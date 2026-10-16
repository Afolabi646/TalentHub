from django.urls import path
from .views import (
    OpportunityListView,
    SavedOpportunityListView,
    SaveOpportunityView,
    RemoveSavedOpportunityView,
)

urlpatterns = [
    path(
        "",
        OpportunityListView.as_view(),
        name="opportunity-list",
    ),
    path(
        "saved/",
        SavedOpportunityListView.as_view(),
        name="saved-opportunity-list",
    ),
    path(
        "save/<int:opportunity_id>/",
        SaveOpportunityView.as_view(),
        name="save-opportunity",
    ),
    path(
        "saved/<int:opportunity_id>/",
        RemoveSavedOpportunityView.as_view(),
        name="remove-saved-opportunity",
    ),
]