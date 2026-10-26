from django.urls import path
from .views import (
    ApplyForOpportunityView,
    MyApplicationsView,
    EmployerApplicationsView,
    UpdateApplicationStatusView,
)

urlpatterns = [
    path(
        "apply/",
        ApplyForOpportunityView.as_view(),
        name="apply-for-opportunity",
    ),
    path(
        "my/",
        MyApplicationsView.as_view(),
        name="my-applications",
    ),
    path(
        "employer/",
        EmployerApplicationsView.as_view(),
        name="employer-applications",
    ),
    path(
        "<int:pk>/status/",
        UpdateApplicationStatusView.as_view(),
        name="update-application-status",
    ),
]