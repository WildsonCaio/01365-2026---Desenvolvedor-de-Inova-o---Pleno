from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from drf_spectacular.utils import extend_schema, extend_schema_view, OpenApiParameter
from drf_spectacular.types import OpenApiTypes
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
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

    @extend_schema(
        summary="Find Nearby Cars",
        description="Search for cars within a given radius in kilometers from a specific coordinate.",
        parameters=[
            OpenApiParameter(name='lat', type=OpenApiTypes.FLOAT, location=OpenApiParameter.QUERY, required=True, description='Latitude'),
            OpenApiParameter(name='lon', type=OpenApiTypes.FLOAT, location=OpenApiParameter.QUERY, required=True, description='Longitude'),
            OpenApiParameter(name='radius_km', type=OpenApiTypes.INT, location=OpenApiParameter.QUERY, required=True, description='Radius in kilometers'),
        ],
        responses={200: CarSerializer(many=True)}
    )
    @action(detail=False, methods=['get'])
    def nearby(self, request):
        lat = request.query_params.get('lat')
        lon = request.query_params.get('lon')
        radius_km = request.query_params.get('radius_km')

        if not all([lat, lon, radius_km]):
            return Response(
                {"error": "Please provide 'lat', 'lon', and 'radius_km' parameters."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            lat = float(lat)
            lon = float(lon)
            radius_km = int(radius_km)
        except ValueError:
            return Response(
                {"error": "'lat' and 'lon' must be floats, and 'radius_km' must be an integer."},
                status=status.HTTP_400_BAD_REQUEST
            )

        ref_location = Point(lon, lat, srid=4326)
        
        # Calculate distance and filter by radius
        nearby_cars = Car.objects.annotate(
            distance=Distance('location', ref_location)
        ).filter(
            location__distance_lte=(ref_location, D(km=radius_km))
        ).order_by('distance')

        serializer = self.get_serializer(nearby_cars, many=True)
        return Response(serializer.data)
