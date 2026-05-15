from rest_framework import serializers
from django.contrib.gis.geos import Point
from .models import Car

class CarSerializer(serializers.ModelSerializer):
    lat = serializers.FloatField(write_only=True, required=True)
    lon = serializers.FloatField(write_only=True, required=True)
    location = serializers.SerializerMethodField(read_only=True)

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
