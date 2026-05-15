from rest_framework import viewsets
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view
from .models import Car
from .serializers import CarSerializer

@extend_schema_view(
    list=extend_schema(summary="List Cars", description="Get a list of all cars, optionally filtered by status."),
    create=extend_schema(summary="Create Car", description="Register a new car with its initial location."),
    retrieve=extend_schema(summary="Retrieve Car", description="Get details of a specific car."),
    update=extend_schema(summary="Update Car", description="Update a car's details."),
    partial_update=extend_schema(summary="Partial Update Car", description="Partially update a car's details."),
    destroy=extend_schema(summary="Delete Car", description="Remove a car from the system.")
)
class CarViewSet(viewsets.ModelViewSet):
    queryset = Car.objects.all().order_by('-created_at')
    serializer_class = CarSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']
