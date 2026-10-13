from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Opportunity
from .serializers import OpportunitySerializer


class OpportunityListView(generics.ListAPIView):
    serializer_class = OpportunitySerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        return Opportunity.objects.filter(
            is_active=True
        ).order_by("-created_at")

# Create your views here.
