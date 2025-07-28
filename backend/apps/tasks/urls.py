from rest_framework import routers
from apps.tasks.views import TaskViewSet, TaskListSubtasksViewSet  
from django.urls import path, include

router_tasks = routers.DefaultRouter()
router_tasks.register(r'tasks', TaskViewSet, basename='tasks')

urlpatterns = [
    path('', include(router_tasks.urls)),
    path('tasks/<int:task_id>/subtasks/', TaskListSubtasksViewSet.as_view({'get': 'list'}), name='task-subtasks'),  # Include the tasks app URLs
    ]