from django.db import models

class Appointment(models.Model):
    patient_name = models.CharField(max_length=255)
    start = models.DateTimeField()
    end = models.DateTimeField()

    def __str__(self):
        return f"{self.patient_name} - {self.start}"
