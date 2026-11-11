from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from .models import Opportunity, SavedOpportunity


User = get_user_model()


class OpportunitySecurityTests(APITestCase):

    def setUp(self):
        self.applicant = User.objects.create_user(
            username="applicant@example.com",
            email="applicant@example.com",
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
            username="other@example.com",
            email="other@example.com",
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

        self.create_url = reverse("create-opportunity")
        self.list_url = reverse("opportunity-list")
        self.my_url = reverse("my-opportunities")
        self.saved_url = reverse("saved-opportunity-list")

    def test_approved_employer_can_create_opportunity(self):
        self.client.force_authenticate(user=self.employer)

        response = self.client.post(
            self.create_url,
            {
                "title": "Django Developer",
                "organization": "New Company",
                "description": "Django development position.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        opportunity = Opportunity.objects.get(
            title="Django Developer"
        )
        self.assertEqual(opportunity.employer, self.employer)

    def test_unapproved_employer_cannot_create_opportunity(self):
        self.client.force_authenticate(
            user=self.unapproved_employer
        )

        response = self.client.post(
            self.create_url,
            {
                "title": "Django Developer",
                "organization": "New Company",
                "description": "Django development position.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_applicant_cannot_create_opportunity(self):
        self.client.force_authenticate(user=self.applicant)

        response = self.client.post(
            self.create_url,
            {
                "title": "Django Developer",
                "organization": "New Company",
                "description": "Django development position.",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_employer_can_only_view_own_opportunities(self):
        self.client.force_authenticate(user=self.employer)

        response = self.client.get(self.my_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(
            response.data["results"][0]["id"],
            self.opportunity.id,
        )

    def test_applicant_cannot_view_employer_opportunities(self):
        self.client.force_authenticate(user=self.applicant)

        response = self.client.get(self.my_url)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_employer_cannot_edit_another_employers_opportunity(self):
        self.client.force_authenticate(user=self.employer)

        response = self.client.patch(
            reverse(
                "update-opportunity",
                kwargs={"pk": self.other_opportunity.id},
            ),
            {"title": "Changed title"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_employer_cannot_change_opportunity_owner(self):
        self.client.force_authenticate(user=self.employer)

        response = self.client.patch(
            reverse(
                "update-opportunity",
                kwargs={"pk": self.opportunity.id},
            ),
            {"title": "Updated title", "employer": self.other_employer.id},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.opportunity.refresh_from_db()
        self.assertEqual(self.opportunity.employer, self.employer)

    def test_general_update_cannot_reactivate_opportunity(self):
        self.opportunity.is_active = False
        self.opportunity.save()

        self.client.force_authenticate(user=self.employer)

        response = self.client.patch(
            reverse(
                "update-opportunity",
                kwargs={"pk": self.opportunity.id},
            ),
            {"is_active": True},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.opportunity.refresh_from_db()
        self.assertFalse(self.opportunity.is_active)

    def test_employer_can_deactivate_own_opportunity(self):
        self.client.force_authenticate(user=self.employer)

        response = self.client.patch(
            reverse(
                "deactivate-opportunity",
                kwargs={"pk": self.opportunity.id},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.opportunity.refresh_from_db()
        self.assertFalse(self.opportunity.is_active)

    def test_employer_can_reactivate_own_opportunity(self):
        self.opportunity.is_active = False
        self.opportunity.save()

        self.client.force_authenticate(user=self.employer)

        response = self.client.patch(
            reverse(
                "reactivate-opportunity",
                kwargs={"pk": self.opportunity.id},
            ),
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.opportunity.refresh_from_db()
        self.assertTrue(self.opportunity.is_active)

    def test_employer_cannot_delete_active_opportunity(self):
        self.client.force_authenticate(user=self.employer)

        response = self.client.delete(
            reverse(
                "delete-opportunity",
                kwargs={"pk": self.opportunity.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_employer_can_delete_own_inactive_opportunity(self):
        self.opportunity.is_active = False
        self.opportunity.save()

        self.client.force_authenticate(user=self.employer)

        response = self.client.delete(
            reverse(
                "delete-opportunity",
                kwargs={"pk": self.opportunity.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        self.assertFalse(
            Opportunity.objects.filter(
                id=self.opportunity.id
            ).exists()
        )

    def test_employer_cannot_delete_another_employers_opportunity(self):
        self.other_opportunity.is_active = False
        self.other_opportunity.save()

        self.client.force_authenticate(user=self.employer)

        response = self.client.delete(
            reverse(
                "delete-opportunity",
                kwargs={"pk": self.other_opportunity.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_users_can_only_view_their_own_saved_opportunities(self):
        SavedOpportunity.objects.create(
            user=self.applicant,
            opportunity=self.opportunity,
        )

        SavedOpportunity.objects.create(
            user=self.other_employer,
            opportunity=self.other_opportunity,
        )

        self.client.force_authenticate(user=self.applicant)

        response = self.client.get(self.saved_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_user_can_save_active_opportunity(self):
        self.client.force_authenticate(user=self.applicant)

        response = self.client.post(
            reverse(
                "save-opportunity",
                kwargs={"opportunity_id": self.opportunity.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.assertTrue(
            SavedOpportunity.objects.filter(
                user=self.applicant,
                opportunity=self.opportunity,
            ).exists()
        )

    def test_user_cannot_save_inactive_opportunity(self):
        self.opportunity.is_active = False
        self.opportunity.save()

        self.client.force_authenticate(user=self.applicant)

        response = self.client.post(
            reverse(
                "save-opportunity",
                kwargs={"opportunity_id": self.opportunity.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_remove_another_users_saved_opportunity(self):
        SavedOpportunity.objects.create(
            user=self.other_employer,
            opportunity=self.opportunity,
        )

        self.client.force_authenticate(user=self.applicant)

        response = self.client.delete(
            reverse(
                "remove-saved-opportunity",
                kwargs={"opportunity_id": self.opportunity.id},
            )
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_applicant_without_profile_gets_helpful_error(self):
        self.client.force_authenticate(user=self.applicant)

        response = self.client.get(
            reverse("job-matches")
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertEqual(
            response.data["error"],
            "Please complete your applicant profile first.",
        )