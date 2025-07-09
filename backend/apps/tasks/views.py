from rest_framework import viewsets
from django.contrib.contenttypes.models import ContentType
from apps.tasks.models import Task  # Ensure this matches the model name in models.py
from apps.tasks.serializers import TaskSerializer  # Ensure this matches the serializer name in serializers.py
from apps.subtasks.models import Subtask  # Ensure this matches the model name in models.py
from apps.subtasks.serializers import SubtaskSerializer  # Ensure this matches the model name in models.py

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by("id")  # Ensure this matches the model name in models.py
    serializer_class = TaskSerializer  # Ensure this matches the serializer name in serializers.py

class TaskListSubtasksViewSet(viewsets.ModelViewSet):
    serializer_class = SubtaskSerializer
    http_method_names = ["get", "post"]  # Apenas GET, não permite POST, PUT, DELETE

    def get_queryset(self):
        task_id = self.kwargs.get("task_id")  # Recebe da URL: /tasks/<task_id>/subtasks/
        task_content_type = ContentType.objects.get(app_label="tasks", model="task")
        return Subtask.objects.filter(object_id=task_id)