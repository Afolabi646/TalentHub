from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    class Role(models.TextChoices):
        APPLICANT = "APPLICANT", "Applicant"
        EMPLOYER = "EMPLOYER", "Employer"

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.APPLICANT
    )


class ApplicantProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="applicant_profile"
    )
    bio = models.TextField(blank=True)
    skills = models.TextField(blank=True)
    experience = models.TextField(blank=True)
    portfolio_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.user.email}'s Profile"

# Create your models here.
