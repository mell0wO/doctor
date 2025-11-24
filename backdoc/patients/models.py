from django.db import models

class Patient(models.Model):
    name = models.CharField(max_length=100, default="N/A")
    profession = models.CharField(max_length=100, default="N/A")
    address = models.CharField(max_length=255, default="N/A")
    phone = models.CharField(max_length=20, default="N/A")
    etatdesante = models.TextField(default="N/A")  # health condition

    def __str__(self):
        return self.name

class Document(models.Model):
    patient = models.ForeignKey(Patient, related_name="documents", on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to="patient_documents/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.patient.name})"
