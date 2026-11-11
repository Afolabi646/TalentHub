from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from opportunities.models import Opportunity
from .models import JobApplication


User = get_user_model()


class ApplicationSecurityTests(APITestCase):

    def setUp(self):
        self.applicant = User.objects.create_user(
            username="applicant@example.com",
            email="applicant@example.com",
            password="SecurePassword!2026",
            role="APPLICANT",
        )

        self.other_applicant = User.objects.create_user(
            username="other@example.com",
            email="other@example.com",
            password="SecurePassword!2026",
            role="APPLICANT",
        )

        self.employer = User.objects.create_user(
            username="employer@example.com",
            email="employer@example.com",
            password="SecurePassword!2026",
            role="EMPLOYER",
            is_employer_approved=True,
        )

        self.other_employer = User.objects.create_user(
            username="otheremployer@example.com",
            email="otheremployer@example.com",
            password="SecurePassword!2026",
            role="EMPLOYER",
            is_employer_approved=True,
        )

        self.unapproved_employer = User.objects.create_user(
            username="pending@example.com",
            email="pending@example.com",
            password="SecurePassword!2026",
            role="EMPLOYER",
            is_employer_approved=False,
        )

        self.opportunity = Opportunity.objects.create(
            employer=self.employer,
            title="Python Developer",
            organization="Test Company",
            description="Python development position.",
        )

        self.other_opportunity = Opportunity.objects.create(
            employer=self.other_employer,
            title="React Developer",
            organization="Another Company",
            description="React development position.",
        )

        self.apply_url = reverse("apply-for-opportunity")
        self.my_applications_url = reverse("my-applications")
        self.employer_applications_url = reverse(
            "employer-applications"
        )

    def create_application(self, applicant=None, opportunity=None):
        return JobApplication.objects.create(
            applicant=applicant or self.applicant,
            opportunity=opportunity or self.opportunity,
            cover_letter="I am interested in this position.",
        )

    def test_applicant_can_apply_for_active_opportunity(self):
        self.client.force_authenticate(user=self.applicant)

        response = self.client.post(
            self.apply_url,
            {"opportunity": self.opportunity.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            JobApplication.objects.filter(
                applicant=self.applicant,
                opportunity=self.opportunity,
            ).exists()
        )

    def test_applicant_cannot_apply_twice(self):
        self.create_application()
        self.client.force_authenticate(user=self.applicant)

        response = self.client.post(
            self.apply_url,
            {"opportunity": self.opportunity.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_applicant_cannot_apply_for_inactive_opportunity(self):
        self.opportunity.is_active = False
        self.opportunity.save()

        self.client.force_authenticate(user=self.applicant)

        response = self.client.post(
            self.apply_url,
            {"opportunity": self.opportunity.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_employer_cannot_apply_for_own_opportunity(self):
        self.client.force_authenticate(user=self.employer)

        response = self.client.post(
            self.apply_url,
            {"opportunity": self.opportunity.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_applicant_can_only_view_own_applications(self):
        self.create_application()
        self.create_application(
            applicant=self.other_applicant,
            opportunity=self.other_opportunity,
        )

        self.client.force_authenticate(user=self.applicant)

        response = self.client.get(self.my_applications_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(
            response.data["results"][0]["applicant"],
            self.applicant.id,
        )

    def test_employer_can_only_view_own_received_applications(self):
        self.create_application()
        self.create_application(
            applicant=self.other_applicant,
            opportunity=self.other_opportunity,
        )

        self.client.force_authenticate(user=self.employer)

        response = self.client.get(self.employer_applications_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(
            response.data["results"][0]["opportunity"],
            self.opportunity.id,
        )

    def test_unapproved_employer_cannot_view_applications(self):
        self.client.force_authenticate(
            user=self.unapproved_employer
        )

        response = self.client.get(self.employer_applications_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_applicant_cannot_update_application_status(self):
        application = self.create_application()
        self.client.force_authenticate(user=self.applicant)

        response = self.client.patch(
            reverse(
                "update-application-status",
                kwargs={"pk": application.id},
            ),
            {"status": "ACCEPTED"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_employer_cannot_update_another_employers_application(self):
        application = self.create_application(
            applicant=self.other_applicant,
            opportunity=self.other_opportunity,
        )

        self.client.force_authenticate(user=self.employer)

        response = self.client.patch(
            reverse(
                "update-application-status",
                kwargs={"pk": application.id},
            ),
            {"status": "ACCEPTED"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_employer_can_update_status_of_own_application(self):
        application = self.create_application()
        self.client.force_authenticate(user=self.employer)

        response = self.client.patch(
            reverse(
                "update-application-status",
                kwargs={"pk": application.id},
            ),
            {"status": "REVIEWING"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        application.refresh_from_db()
        self.assertEqual(application.status, "REVIEWING")

    def test_applicant_cannot_manipulate_application_fields(self):
        self.client.force_authenticate(user=self.applicant)

        response = self.client.post(
            self.apply_url,
            {
                "opportunity": self.opportunity.id,
                "status": "ACCEPTED",
                "applicant": self.other_applicant.id,
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        application = JobApplication.objects.get(
            opportunity=self.opportunity,
            applicant=self.applicant,
        )

        self.assertEqual(application.status, "PENDING")
        self.assertEqual(application.applicant, self.applicant)