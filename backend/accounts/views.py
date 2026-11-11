from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import EmailTokenObtainPairSerializer

from .models import ApplicantProfile
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ApplicantProfileSerializer,
)

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

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


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"detail": "Refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            token = RefreshToken(refresh_token)

            if str(token["user_id"]) != str(request.user.pk):
                return Response(
                    {"detail": "You cannot revoke another user's token."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            token.blacklist()

            return Response(
                {"detail": "Successfully logged out."},
                status=status.HTTP_200_OK,
            )

        except TokenError:
            return Response(
                {"detail": "Invalid or expired refresh token."},
                status=status.HTTP_400_BAD_REQUEST,
            )