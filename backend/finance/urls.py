from django.urls import path
from .views import SummaryView, TransactionListCreateView, TransactionDetailView

urlpatterns = [
    path("summary/", SummaryView.as_view(), name="summary"),
    path("transactions/", TransactionListCreateView.as_view()),
    path("transactions/<int:pk>/", TransactionDetailView.as_view()),
]