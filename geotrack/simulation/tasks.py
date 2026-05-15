import logging
import random
from datetime import datetime
from django.utils import timezone
from celery import shared_task
from django.contrib.gis.geos import Point
from cars.models import Car
from weather.services import OpenMeteoClient

logger = logging.getLogger(__name__)

def mutate_location(location):
    """Slightly moves the point by a random factor to simulate movement"""
    # random offset between -0.01 and 0.01 degrees (roughly 1km)
    lat_offset = random.uniform(-0.01, 0.01)
    lon_offset = random.uniform(-0.01, 0.01)
    return Point(location.x + lon_offset, location.y + lat_offset, srid=4326)

def mutate_status(current_status):
    """10% chance to become PROBLEM, 90% chance to become WORKING"""
    if random.random() < 0.1:
        return Car.Status.PROBLEM
    return Car.Status.WORKING

@shared_task
def update_fleet_task():
    logger.info("Starting fleet update simulation cycle")
    
    cars = Car.objects.all()
    success_count = 0
    error_count = 0
    
    for car in cars:
        try:
            # Move slightly
            car.location = mutate_location(car.location)
            
            # Update status
            car.status = mutate_status(car.status)
            
            # Fetch weather
            weather_data = OpenMeteoClient.get_current_weather(car.location.y, car.location.x)
            
            if weather_data:
                car.last_weather_temperature = weather_data.get('temperature')
                car.last_weather_humidity = weather_data.get('humidity')
                car.last_weather_code = weather_data.get('weather_code')
                car.last_weather_at = timezone.now()
            
            car.save()
            logger.info(f"Successfully updated car {car.plate}")
            success_count += 1
        except Exception as e:
            logger.error(f"Failed to update car {car.plate}: {str(e)}")
            error_count += 1
            
    logger.info(f"Fleet update cycle finished. Success: {success_count}, Errors: {error_count}")
    return {"success": success_count, "errors": error_count}
