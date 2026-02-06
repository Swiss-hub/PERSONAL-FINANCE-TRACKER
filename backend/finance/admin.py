from django.contrib import admin
from .models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "transaction_type",
        "amount",
        "description",
        "created_at",
    )
    list_filter = ("transaction_type", "created_at")
    search_fields = ("description", "user__username")
