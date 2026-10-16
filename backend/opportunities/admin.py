from django.contrib import admin
from .models import Opportunity, SavedOpportunity


@admin.register(Opportunity)
class OpportunityAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "organization",
        "category",
        "location",
        "deadline",
        "is_active",
    )
    list_filter = ("category", "is_active")
    search_fields = ("title", "organization", "location")
    list_editable = ("is_active",)

admin.site.register(SavedOpportunity)

# Register your models here.
