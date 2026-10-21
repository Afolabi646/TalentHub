from rest_framework import generics, permissions
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .models import Opportunity, SavedOpportunity
from .serializers import OpportunitySerializer, SavedOpportunitySerializer

class OpportunityListView(generics.ListAPIView):
    serializer_class = OpportunitySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Opportunity.objects.filter(
            is_active=True
        ).order_by("-created_at")

class CreateOpportunityView(generics.CreateAPIView):
    serializer_class = OpportunitySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        if self.request.user.role != "EMPLOYER":
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied(
                "Only employers can create opportunities."
            )

        serializer.save()


class SavedOpportunityListView(generics.ListAPIView):
    serializer_class = SavedOpportunitySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedOpportunity.objects.filter(
            user=self.request.user
        ).select_related("opportunity").order_by("-created_at")


class SaveOpportunityView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, opportunity_id):
        try:
            opportunity = Opportunity.objects.get(
                id=opportunity_id,
                is_active=True
            )
        except Opportunity.DoesNotExist:
            return Response(
                {"error": "Opportunity not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        saved_opportunity, created = SavedOpportunity.objects.get_or_create(
            user=request.user,
            opportunity=opportunity
        )

        return Response(
            {
                "message": (
                    "Opportunity saved successfully."
                    if created else "Opportunity already saved."
                ),
                "saved": True,
                "id": saved_opportunity.id,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )


class RemoveSavedOpportunityView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, opportunity_id):
        deleted_count, _ = SavedOpportunity.objects.filter(
            user=request.user,
            opportunity_id=opportunity_id
        ).delete()

        if deleted_count == 0:
            return Response(
                {"error": "Saved opportunity not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {"message": "Opportunity removed from saved opportunities."},
            status=status.HTTP_200_OK
        )