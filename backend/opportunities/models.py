from django.conf import settings
from django.db import models


class Opportunity(models.Model):
    class Category(models.TextChoices):
        JOB = "JOB", "Job"
        INTERNSHIP = "INTERNSHIP", "Internship"

    title = models.CharField(max_length=200)
    organization = models.CharField(max_length=200)
    category = models.CharField(
        max_length=20,
        choices=Category.choices,
        default=Category.JOB,
    )
    location = models.CharField(max_length=200, blank=True)
    deadline = models.DateField(null=True, blank=True)
    application_link = models.URLField(blank=True)
    description = models.TextField()
    eligibility = models.TextField(blank=True)
    how_to_apply = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title




class SavedOpportunity(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_opportunities"
    )
    opportunity = models.ForeignKey(
        "opportunities.Opportunity",
        on_delete=models.CASCADE,
        related_name="saved_by_users"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "opportunity")

    def __str__(self):
        return f"{self.user} saved {self.opportunity.title}"

# Create your models here.
