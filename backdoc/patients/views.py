from rest_framework import viewsets
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response 
from django.db import transaction
from .models import Patient, Document
from .serializers import PatientSerializer, DocumentSerializer
import json


class PatientViewSet(viewsets.ModelViewSet):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    parser_classes = [MultiPartParser, FormParser]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        # Create patient (no documents yet)
        patient_serializer = PatientSerializer(data=request.data)
        patient_serializer.is_valid(raise_exception=True)
        patient = patient_serializer.save()

        # Save uploaded files
        files = request.FILES.getlist('documents[]')
        for f in files:
            Document.objects.create(patient=patient, title=f.name, file=f)

        return Response(PatientSerializer(patient).data)

    @transaction.atomic
    def partial_update(self, request, *args, **kwargs):
        patient = self.get_object()

        # Update patient base fields
        patient_serializer = PatientSerializer(
            patient, data=request.data, partial=True
        )
        patient_serializer.is_valid(raise_exception=True)
        patient = patient_serializer.save()

        # Handle new uploaded files
        files = request.FILES.getlist('documents[]')
        for f in files:
            Document.objects.create(patient=patient, title=f.name, file=f)

        # Handle deletion
        deleted = request.data.get("deletedDocuments")
        if deleted:
            deleted = json.loads(deleted)
            Document.objects.filter(id__in=deleted).delete()

        return Response(PatientSerializer(patient).data)


class DocumentViewSet(viewsets.ModelViewSet):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    parser_classes = [MultiPartParser, FormParser]