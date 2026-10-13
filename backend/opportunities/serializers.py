from rest_framework import serializers
from .models import Opportunity
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