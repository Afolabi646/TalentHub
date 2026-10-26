from rest_framework import serializers
from .models import Opportunity, SavedOpportunity


class OpportunitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Opportunity
        fields = [
            "id",
            "title",
            "organization",
            "category",
            "location",
            "deadline",
            "application_link",
            "description",
            "eligibility",
            "how_to_apply",
            "is_active",
            "created_at",
        ]

class SavedOpportunitySerializer(serializers.ModelSerializer):
    opportunity = OpportunitySerializer(read_only=True)

    class Meta:
        model = SavedOpportunity
        fields = ["id", "opportunity", "created_at"]


class JobMatchSerializer(serializers.ModelSerializer):
    match_score = serializers.FloatField(read_only=True)

    class Meta:
        model = Opportunity
        fields = [
            "id",
            "title",
            "organization",
            "category",
            "location",
            "deadline",
            "description",
            "eligibility",
            "match_score",
        ]