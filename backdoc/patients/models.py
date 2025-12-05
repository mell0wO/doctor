from django.db import models
from .fields import EncryptedTextField
from .storage import EncryptedFileSystemStorage


class Patient(models.Model):
    name = EncryptedTextField(default="N/A")  # If you want full encryption
    profession = EncryptedTextField(default="N/A")
    address = EncryptedTextField(default="N/A")
    phone = EncryptedTextField(default="N/A")
    etatdesante = EncryptedTextField(default="N/A")


    def __str__(self):
        return self.name


class Document(models.Model):
    patient = models.ForeignKey(Patient, related_name="documents", on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to="patient_documents/", storage=EncryptedFileSystemStorage())
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.patient.name})"
