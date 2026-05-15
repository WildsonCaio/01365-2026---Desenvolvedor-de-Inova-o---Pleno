import os
from celery import Celery
from celery.schedules import crontab
from django.conf import settings

# Set the default Django settings module for the 'celery' program.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'app.settings')

app = Celery('geotrack')

# Using a string here means the worker doesn't have to serialize
# the configuration object to child processes.
# - namespace='CELERY' means all celery-related configuration keys
#   should have a `CELERY_` prefix.
app.config_from_object('django.conf:settings', namespace='CELERY')

# Load task modules from all registered Django apps.
app.autodiscover_tasks()

@app.on_after_configure.connect
def setup_periodic_tasks(sender, **kwargs):
    from simulation.tasks import update_fleet_task
    # Retrieve the interval from environment or default to 30s
    interval_seconds = int(os.environ.get('SIMULATION_INTERVAL_SECONDS', 30))
    sender.add_periodic_task(interval_seconds, update_fleet_task.s(), name='update_fleet_every_interval')
