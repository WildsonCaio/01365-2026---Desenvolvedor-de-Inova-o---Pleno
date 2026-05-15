from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from cars.models import Car

# Real cities in Santa Catarina with real coordinates
SC_CITIES = [
    {"name": "Florianópolis", "lat": -27.5954, "lon": -48.5480},
    {"name": "Joinville", "lat": -26.3045, "lon": -48.8487},
    {"name": "Blumenau", "lat": -26.9194, "lon": -49.0661},
    {"name": "São José", "lat": -27.6136, "lon": -48.6266},
    {"name": "Criciúma", "lat": -28.6775, "lon": -49.3705},
    {"name": "Chapecó", "lat": -27.1004, "lon": -52.6152},
    {"name": "Itajaí", "lat": -26.9104, "lon": -48.6628},
    {"name": "Lages", "lat": -27.8156, "lon": -50.3261},
    {"name": "Jaraguá do Sul", "lat": -26.4852, "lon": -49.0713},
    {"name": "Palhoça", "lat": -27.6441, "lon": -48.6677},
    {"name": "Balneário Camboriú", "lat": -26.9922, "lon": -48.6340},
    {"name": "Brusque", "lat": -27.0981, "lon": -48.9175},
    {"name": "Tubarão", "lat": -28.4716, "lon": -49.0069},
    {"name": "São Bento do Sul", "lat": -26.2492, "lon": -49.3789},
    {"name": "Camboriú", "lat": -27.0253, "lon": -48.6542},
    {"name": "Navegantes", "lat": -26.8978, "lon": -48.6558},
    {"name": "Concórdia", "lat": -27.2319, "lon": -52.0258},
    {"name": "Rio do Sul", "lat": -27.2144, "lon": -49.6433},
    {"name": "Araranguá", "lat": -28.9347, "lon": -49.4853},
    {"name": "Gaspar", "lat": -26.9322, "lon": -48.9567},
]

class Command(BaseCommand):
    help = 'Populates the database with 20 real cars and real coordinates in Santa Catarina'

    def handle(self, *args, **options):
        self.stdout.write("Starting database seed...")
        
        Car.objects.all().delete()
        self.stdout.write("Cleared existing cars.")

        cars_to_create = []
        for i, city in enumerate(SC_CITIES):
            plate = f"ABC-{1000 + i}"
            cars_to_create.append(Car(
                name=f"Car {i+1} ({city['name']})",
                plate=plate,
                city=city['name'],
                status=Car.Status.WORKING,
                location=Point(city['lon'], city['lat'], srid=4326)
            ))
            
        Car.objects.bulk_create(cars_to_create)
        self.stdout.write(self.style.SUCCESS('Successfully seeded 20 cars with real SC coordinates!'))
