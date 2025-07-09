from rest_framework import viewsets
from apps.subtasks.models import Subtask  # Ensure this matches the model name in models.py
from apps.subtasks.serializers import SubtaskSerializer  # Ensure this matches the serializer name in

class SubtaskViewSet(viewsets.ModelViewSet):
    queryset = Subtask.objects.all().order_by("id")  # Ensure this matches the model name in models.py
    serializer_class = SubtaskSerializer  # Ensure this matches the serializer name in serializers.py
