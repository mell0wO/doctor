from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from .models import FinanceEntry
from .serializers import FinanceEntrySerializer

@api_view(['GET'])
def get_all_entries(request):
    entries = FinanceEntry.objects.all().order_by('-date')
    ser = FinanceEntrySerializer(entries, many=True)
    return Response(ser.data)


@api_view(['POST'])
def add_entry(request):
    ser = FinanceEntrySerializer(data=request.data)
    if ser.is_valid():
        ser.save()
        return Response({"success": True, "entry": ser.data})
    return Response(ser.errors, status=400)


@api_view(['GET'])
def get_totals(request):
    debit = FinanceEntry.objects.filter(entry_type="debit").aggregate(Sum('amount'))['amount__sum'] or 0
    credit = FinanceEntry.objects.filter(entry_type="credit").aggregate(Sum('amount'))['amount__sum'] or 0
    profit = debit - credit

    return Response({
        "debit": debit,
        "credit": credit,
        "profit": profit
    })


@api_view(['GET'])
def chart_data(request):
    from django.db.models import Sum
    entries = FinanceEntry.objects.values('date', 'entry_type').annotate(total=Sum('amount'))

    grouped = {}

    for e in entries:
        date = e['date'].strftime('%d/%m/%Y')
        if date not in grouped:
            grouped[date] = {"debit": 0, "credit": 0}
        grouped[date][e['entry_type']] += float(e['total'])

    return Response(grouped)
