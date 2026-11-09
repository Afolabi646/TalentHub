from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, ApplicantProfile


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = (
        "email",
        "first_name",
        "last_name",
        "role",
        "is_employer_approved",
        "is_active",
    )

    list_filter = ("role", "is_employer_approved", "is_active")

    fieldsets = UserAdmin.fieldsets + (
        ("Employer Approval", {
            "fields": ("role", "is_employer_approved"),
        }),
    )


admin.site.register(ApplicantProfile)