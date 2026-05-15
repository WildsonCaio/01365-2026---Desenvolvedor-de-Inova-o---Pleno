import uuid
from django.contrib.gis.db import models

class Car(models.Model):
    class Status(models.TextChoices):
        WORKING = 'WORKING', 'Working'
        PROBLEM = 'PROBLEM', 'Problem'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    plate = models.CharField(max_length=50)
    city = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.WORKING)
    location = models.PointField()
    
    last_weather_temperature = models.FloatField(null=True, blank=True)
    last_weather_humidity = models.IntegerField(null=True, blank=True)
    last_weather_code = models.IntegerField(null=True, blank=True)
    last_weather_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.plate}"
