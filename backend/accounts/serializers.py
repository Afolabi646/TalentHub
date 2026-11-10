from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from .models import ApplicantProfile
from .models import User



class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        validators=[]
    )

    class Meta:
        model = User
        fields = [
            "email",
            "password",
            "first_name",
            "last_name",
            "role",
        ]

    def validate_email(self, value):
        email = value.strip().lower()

        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                "An account with this email already exists."
            )

        return email

    def validate_password(self, value):
        from django.contrib.auth.password_validation import validate_password

        user = User(
            email=self.initial_data.get("email", ""),
            first_name=self.initial_data.get("first_name", ""),
            last_name=self.initial_data.get("last_name", ""),
        )

        validate_password(value, user=user)
        return value

    def validate_role(self, value):
        if value not in User.Role.values:
            raise serializers.ValidationError(
                "Please select a valid account type."
            )

        return value

    def create(self, validated_data):
        return User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data.get("first_name", ""),
            last_name=validated_data.get("last_name", ""),
            role=validated_data["role"],
        )


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "role",
        ]




class ApplicantProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApplicantProfile
        fields = [
            "bio",
            "skills",
            "experience",
            "portfolio_url",
        ]