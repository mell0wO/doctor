from django.urls import path
from . import views

urlpatterns = [
    path('all/', views.get_all_entries),
    path('add/', views.add_entry),
    path('totals/', views.get_totals),
    path('chart/', views.chart_data),
]
