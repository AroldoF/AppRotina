from rest_framework import routers
from apps.tasks.views import TaskViewSet, TaskListSubtasksViewSet, TaskUserViewSet  # Ensure this matches the viewset name in views
from django.urls import path, include

router_tasks = routers.DefaultRouter()
router_tasks.register(r'tasks', TaskViewSet, basename='tasks')
router_tasks.register(r'users/(?P<user_id>\d+)/tasks', TaskUserViewSet, basename='user-tasks')

urlpatterns = [
    path('', include(router_tasks.urls)),
    path('tasks/<int:task_id>/subtasks/', TaskListSubtasksViewSet.as_view({'get': 'list'}), name='task-subtasks'),  # Include the tasks app URLs
    ]