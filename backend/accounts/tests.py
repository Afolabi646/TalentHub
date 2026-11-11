from django.test import TestCase
from .models import User
from .serializers import RegisterSerializer

from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse


class RegisterSerializerSecurityTests(TestCase):

    def setUp(self):
        self.valid_data = {
            "email": "applicant@example.com",
            "password": "N3w!Secure-Phrase-2026",
            "first_name": "John",
            "last_name": "Doe",
            "role": "APPLICANT",
        }

    def test_applicant_registration(self):
        serializer = RegisterSerializer(data=self.valid_data)

        self.assertTrue(serializer.is_valid(), serializer.errors)

        user = serializer.save()

        self.assertEqual(user.role, "APPLICANT")
        self.assertFalse(user.is_employer_approved)

    def test_employer_registration_requires_approval(self):
        data = self.valid_data.copy()
        data["email"] = "employer@example.com"
        data["role"] = "EMPLOYER"

        serializer = RegisterSerializer(data=data)

        self.assertTrue(serializer.is_valid(), serializer.errors)

        user = serializer.save()

        self.assertEqual(user.role, "EMPLOYER")
        self.assertFalse(user.is_employer_approved)

    def test_employer_cannot_self_approve(self):
        data = self.valid_data.copy()
        data["email"] = "attacker@example.com"
        data["role"] = "EMPLOYER"
        data["is_employer_approved"] = True
        data["is_staff"] = True
        data["is_superuser"] = True

        serializer = RegisterSerializer(data=data)

        self.assertTrue(serializer.is_valid(), serializer.errors)

        user = serializer.save()

        self.assertFalse(user.is_employer_approved)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_password_is_hashed(self):
        serializer = RegisterSerializer(data=self.valid_data)

        self.assertTrue(serializer.is_valid(), serializer.errors)

        user = serializer.save()

        self.assertNotEqual(
            user.password,
            self.valid_data["password"]
        )

        self.assertTrue(
            user.check_password(self.valid_data["password"])
        )

    def test_weak_password_is_rejected(self):
        data = self.valid_data.copy()
        data["password"] = "12345678"

        serializer = RegisterSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("password", serializer.errors)

    def test_duplicate_email_is_rejected(self):
        User.objects.create_user(
            username="applicant@example.com",
            email="applicant@example.com",
            password="Another!Secure-Password-2026"
        )

        serializer = RegisterSerializer(data=self.valid_data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("email", serializer.errors)

    def test_invalid_role_is_rejected(self):
        data = self.valid_data.copy()
        data["role"] = "ADMIN"

        serializer = RegisterSerializer(data=data)

        self.assertFalse(serializer.is_valid())
        self.assertIn("role", serializer.errors)


class LogoutSecurityTests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username="user@example.com",
            email="user@example.com",
            password="SecurePassword!2026"
        )

        self.other_user = User.objects.create_user(
            username="other@example.com",
            email="other@example.com",
            password="AnotherPassword!2026"
        )

        self.logout_url = reverse("logout")
        self.refresh_url = reverse("token_refresh")

        self.refresh_token = RefreshToken.for_user(self.user)

    def test_authenticated_user_can_logout(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            self.logout_url,
            {"refresh": str(self.refresh_token)},
            format="json"
        )

        self.assertEqual(response.status_code, 200)

        refresh_response = self.client.post(
            self.refresh_url,
            {"refresh": str(self.refresh_token)},
            format="json"
        )

        self.assertEqual(refresh_response.status_code, 401)

    def test_unauthenticated_user_cannot_logout(self):
        response = self.client.post(
            self.logout_url,
            {"refresh": str(self.refresh_token)},
            format="json"
        )

        self.assertEqual(response.status_code, 401)

    def test_user_cannot_blacklist_another_users_token(self):
        self.client.force_authenticate(user=self.other_user)

        response = self.client.post(
            self.logout_url,
            {"refresh": str(self.refresh_token)},
            format="json"
        )

        self.assertEqual(response.status_code, 403)

        refresh_response = self.client.post(
            self.refresh_url,
            {"refresh": str(self.refresh_token)},
            format="json"
        )

        self.assertEqual(refresh_response.status_code, 200)

    def test_logout_requires_refresh_token(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            self.logout_url,
            {},
            format="json"
        )

        self.assertEqual(response.status_code, 400)