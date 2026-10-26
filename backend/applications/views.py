from rest_framework import generics, permissions
from rest_framework.exceptions import ValidationError
from rest_framework import status
from rest_framework.response import Response
from .models import JobApplication
from .serializers import (
    JobApplicationSerializer,
    ApplicationStatusSerializer,
)


class ApplyForOpportunityView(generics.CreateAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        opportunity = serializer.validated_data["opportunity"]

        if not opportunity.is_active:
            raise ValidationError(
                "You cannot apply for an inactive opportunity."
            )

        if opportunity.employer == self.request.user:
            raise ValidationError(
                "You cannot apply for your own opportunity."
            )

        already_applied = JobApplication.objects.filter(
            applicant=self.request.user,
            opportunity=opportunity
        ).exists()

        if already_applied:
            raise ValidationError(
                "You have already applied for this opportunity."
            )

        serializer.save(applicant=self.request.user)


class MyApplicationsView(generics.ListAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(
            applicant=self.request.user
        ).select_related("opportunity", "applicant")


class EmployerApplicationsView(generics.ListAPIView):
    serializer_class = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return JobApplication.objects.filter(
            opportunity__employer=self.request.user
        ).select_related("opportunity", "applicant")


class UpdateApplicationStatusView(generics.UpdateAPIView):
    serializer_class = ApplicationStatusSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["patch", "head", "options"]

    def get_queryset(self):
        return JobApplication.objects.filter(
            opportunity__employer=self.request.user
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
            raise ValidationError("Invalid application status.")

        serializer.save()