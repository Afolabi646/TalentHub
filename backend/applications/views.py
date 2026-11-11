from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError, PermissionDenied

from .models import JobApplication
from .serializers import (
    JobApplicationSerializer,
    ApplicationStatusSerializer,
)

from django.db import IntegrityError, transaction


class ApplyForOpportunityView(generics.CreateAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        if user.role != "APPLICANT":
            raise PermissionDenied(
                "Only applicants can apply for opportunities."
            )

        opportunity = serializer.validated_data["opportunity"]

        if not opportunity.is_active:
            raise ValidationError(
                "You cannot apply for an inactive opportunity."
            )

        if opportunity.employer == user:
            raise ValidationError(
                "You cannot apply for your own opportunity."
            )

        already_applied = JobApplication.objects.filter(
            applicant=user,
            opportunity=opportunity
        ).exists()

        if already_applied:
            raise ValidationError(
                "You have already applied for this opportunity."
            )

        try:
             with transaction.atomic():
               serializer.save(applicant=user)

        except IntegrityError:
         raise ValidationError(
        "You have already applied for this opportunity."
    )


class MyApplicationsView(generics.ListAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role != "APPLICANT":
            raise PermissionDenied(
                "Only applicants can view their applications."
            )

        return JobApplication.objects.filter(
            applicant=self.request.user
        ).select_related("opportunity", "applicant")


class EmployerApplicationsView(generics.ListAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        if user.role != "EMPLOYER":
            raise PermissionDenied(
                "Only employers can view received applications."
            )

        if not user.is_employer_approved:
            raise PermissionDenied(
                "Your employer account is awaiting approval."
            )

        return JobApplication.objects.filter(
            opportunity__employer=user
        ).select_related("opportunity", "applicant")


class UpdateApplicationStatusView(generics.UpdateAPIView):
    serializer_class = ApplicationStatusSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["patch", "head", "options"]

    def get_queryset(self):
        user = self.request.user

        if user.role != "EMPLOYER":
            raise PermissionDenied(
                "Only employers can update application statuses."
            )

        if not user.is_employer_approved:
            raise PermissionDenied(
                "Your employer account is awaiting approval."
            )

        return JobApplication.objects.filter(
            opportunity__employer=user
        )

    def perform_update(self, serializer):
        new_status = serializer.validated_data.get("status")

        allowed_statuses = [
            "PENDING",
            "REVIEWING",
            "ACCEPTED",
            "REJECTED",
        ]

        if new_status not in allowed_statuses:
            raise ValidationError(
                "Invalid application status."
            )

        serializer.save()