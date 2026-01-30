from django.urls import path
from .views import FileUploadView, FileStatsView, FileReportView
from .views import FileHistoryView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('stats/<int:pk>/', FileStatsView.as_view(), name='file-stats'),
    path('report/<int:pk>/', FileReportView.as_view(), name='file-report'),
    path('history/', FileHistoryView.as_view(), name='file-history'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]