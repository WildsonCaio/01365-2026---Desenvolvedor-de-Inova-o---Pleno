import os
import requests
import logging

logger = logging.getLogger(__name__)

class OpenMeteoClient:
    BASE_URL = "https://api.open-meteo.com/v1/forecast"

    @classmethod
    def get_current_weather(cls, lat, lon):
        timeout = int(os.environ.get('OPEN_METEO_TIMEOUT', 5))
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,weather_code"
        }
        
        try:
            response = requests.get(cls.BASE_URL, params=params, timeout=timeout)
            response.raise_for_status()
            data = response.json()
            
            current = data.get("current", {})
            return {
                "temperature": current.get("temperature_2m"),
                "humidity": current.get("relative_humidity_2m"),
                "weather_code": current.get("weather_code")
            }
        except requests.exceptions.RequestException as e:
            logger.error(f"Open-Meteo API request failed for lat={lat}, lon={lon}: {e}")
            return None
