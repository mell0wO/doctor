from rest_framework import serializers
from .models import FinanceEntry

class FinanceEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = FinanceEntry
        fields = '__all__'
