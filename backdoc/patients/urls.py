from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework import routers
from .views import PatientViewSet, DocumentViewSet

router = routers.DefaultRouter()
router.register(r'patients', PatientViewSet)
router.register(r'documents', DocumentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
