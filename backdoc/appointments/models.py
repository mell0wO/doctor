from django.db import models
from .fields import EncryptedTextField, EncryptedDateTimeField

class Appointment(models.Model):
    patient_name = EncryptedTextField()
    start = EncryptedDateTimeField()
    end = EncryptedDateTimeField()

    def __str__(self):
        return f"{self.patient_name} - {self.start}"
