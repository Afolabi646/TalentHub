from django.urls import path
from .views import OpportunityListView
urlpatterns = [
    path(
        "",
        OpportunityListView.as_view(),
        name="opportunity-list",
    ),
]