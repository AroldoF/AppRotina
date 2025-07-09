from rest_framework import routers
from apps.tasks.views import TaskViewSet, TaskListSubtasksViewSet  # Ensure this matches the viewset name in views
from django.urls import path, include

router_tasks = routers.DefaultRouter()
router_tasks.register(r'tasks', TaskViewSet, basename='tasks')

urlpatterns = [
    path('', include(router_tasks.urls)),  # Include the router's URLs
    path('tasks/<int:task_id>/subtasks/', TaskListSubtasksViewSet.as_view({'get': 'list'}), name='task-subtasks'),  # Include the tasks app URLs
    ]