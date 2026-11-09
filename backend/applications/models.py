from django.db import models
from django.conf import settings
from opportunities.models import Opportunity


class JobApplication(models.Model):
    applicant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="job_applications"
    )

    opportunity = models.ForeignKey(
        Opportunity,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    cover_letter = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        default="PENDING"
    )

    applied_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["applicant", "opportunity"],
                name="unique_applicant_opportunity"
            )
        ]
        ordering = ["-applied_at"]

    def _str_(self):
        return f"{self.applicant} - {self.opportunity.title}"