from rest_framework import serializers
from .models import JobApplication


class JobApplicationSerializer(serializers.ModelSerializer):
    applicant_name = serializers.CharField(
        source="applicant.username",
        read_only=True
    )

    opportunity_title = serializers.CharField(
        source="opportunity.title",
        read_only=True
    )

    class Meta:
        model = JobApplication
        fields = [
            "id",
            "applicant",
            "applicant_name",
            "opportunity",
            "opportunity_title",
            "cover_letter",
            "status",
            "applied_at",
        ]
        read_only_fields = [
            "id",
            "applicant",
            "status",
            "applied_at",
        ]


class ApplicationStatusSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(
        choices=[
            ("PENDING", "Pending"),
            ("REVIEWING", "Reviewing"),
            ("ACCEPTED", "Accepted"),
            ("REJECTED", "Rejected"),
        ]
    )

    class Meta:
        model = JobApplication
        fields = ["status"]