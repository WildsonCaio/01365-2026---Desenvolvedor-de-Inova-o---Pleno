from rest_framework import serializers
from django.contrib.gis.geos import Point
from drf_spectacular.utils import extend_schema_serializer, OpenApiExample
from .models import Car

@extend_schema_serializer(
    examples=[
        OpenApiExample(
            'Create Car Example',
            summary='Example of creating a car',
            description='Creates a new car with a given latitude and longitude.',
            value={
                "name": "Tesla Model S",
                "plate": "EVT-1234",
                "city": "Florianópolis",
                "status": "WORKING",
                "lat": -27.5954,
                "lon": -48.5480
            },
            request_only=True,
        ),
        OpenApiExample(
            'Car Response Example',
            summary='Example of a car response',
            value={
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "name": "Tesla Model S",
                "plate": "EVT-1234",
                "city": "Florianópolis",
                "status": "WORKING",
                "location": {"lat": -27.5954, "lon": -48.5480},
                "last_weather_temperature": 22.5,
                "last_weather_humidity": 65,
                "last_weather_code": 3,
                "last_weather_at": "2026-05-15T15:00:00Z",
                "created_at": "2026-05-15T10:00:00Z",
                "updated_at": "2026-05-15T15:00:00Z"
            },
            response_only=True,
        ),
    ]
)
class CarSerializer(serializers.ModelSerializer):
    lat = serializers.FloatField(write_only=True, required=True, help_text="Latitude for the location (e.g., -27.5954)")
    lon = serializers.FloatField(write_only=True, required=True, help_text="Longitude for the location (e.g., -48.5480)")
    location = serializers.SerializerMethodField(read_only=True, help_text="Generated Lat/Lon object from PointField")

    class Meta:
        model = Car
        fields = [
            'id', 'name', 'plate', 'city', 'status', 'location', 
            'lat', 'lon',
            'last_weather_temperature', 'last_weather_humidity', 
            'last_weather_code', 'last_weather_at', 
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'last_weather_temperature', 'last_weather_humidity', 
            'last_weather_code', 'last_weather_at', 'created_at', 'updated_at'
        ]

    def get_location(self, obj):
        if obj.location:
            return {
                "lat": obj.location.y,
                "lon": obj.location.x
            }
        return None

    def create(self, validated_data):
        lat = validated_data.pop('lat')
        lon = validated_data.pop('lon')
        validated_data['location'] = Point(lon, lat, srid=4326)
        return super().create(validated_data)

    def update(self, instance, validated_data):
        lat = validated_data.pop('lat', None)
        lon = validated_data.pop('lon', None)
        if lat is not None and lon is not None:
            instance.location = Point(lon, lat, srid=4326)
        return super().update(instance, validated_data)

