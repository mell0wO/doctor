from django.db import models

class FinanceEntry(models.Model):
    ENTRY_TYPES = (
        ("debit", "Debit"),
        ("credit", "Credit"),
    )

    entry_type = models.CharField(max_length=10, choices=ENTRY_TYPES)
    label = models.CharField(max_length=255)
    entry_id = models.CharField(max_length=50, unique=True)
    date = models.DateField()
    status = models.CharField(max_length=50, default="Pending")
    amount = models.DecimalField(max_digits=10, decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.label} ({self.entry_type})"
