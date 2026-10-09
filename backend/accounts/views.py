from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import ApplicantProfile
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ApplicantProfileSerializer,
)


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer


class MeView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class ApplicantProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ApplicantProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        profile, created = ApplicantProfile.objects.get_or_create(
            user=self.request.user
        )
        return profile