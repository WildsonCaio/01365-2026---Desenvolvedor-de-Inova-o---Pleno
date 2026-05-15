import os
import requests
import logging
import pybreaker

logger = logging.getLogger(__name__)

# Configurar o Circuit Breaker: abrir após 3 falhas consecutivas e testar novamente após 60s
weather_breaker = pybreaker.CircuitBreaker(
    fail_max=3,
    reset_timeout=60,
)

# Adicionar um listener para logar as transições de estado do circuit breaker
class CircuitBreakerListener(pybreaker.CircuitBreakerListener):
    def state_change(self, cb, old_state, new_state):
        logger.warning(f"Circuit Breaker state changed from {old_state.name} to {new_state.name}")

weather_breaker.add_listeners(CircuitBreakerListener())

class OpenMeteoClient:
    BASE_URL = "https://api.open-meteo.com/v1/forecast"

    @classmethod
    @weather_breaker
    def _fetch_data(cls, lat, lon):
        timeout = int(os.environ.get('OPEN_METEO_TIMEOUT', 5))
        params = {
            "latitude": lat,
            "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,weather_code"
        }
        response = requests.get(cls.BASE_URL, params=params, timeout=timeout)
        response.raise_for_status()
        return response.json()

    @classmethod
    def get_current_weather(cls, lat, lon):
        try:
            data = cls._fetch_data(lat, lon)
            current = data.get("current", {})
            return {
                "temperature": current.get("temperature_2m"),
                "humidity": current.get("relative_humidity_2m"),
                "weather_code": current.get("weather_code")
            }
        except pybreaker.CircuitBreakerError:
            # Não faz log de erro, pois o circuit breaker abriu e bloqueou a chamada.
            # logger em nível warning para não poluir
            logger.warning(f"Circuit Breaker OPEN. Skipped weather fetch for lat={lat}, lon={lon}.")
            return None
        except requests.exceptions.RequestException as e:
            logger.error(f"Open-Meteo API request failed for lat={lat}, lon={lon}: {e}")
            return None

