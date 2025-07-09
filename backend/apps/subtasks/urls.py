from rest_framework import routers
from apps.subtasks.views import SubtaskViewSet

routes_subtasks = routers.SimpleRouter()
routes_subtasks.register(r'subtasks', SubtaskViewSet, basename='subtasks')

urlpatterns = routes_subtasks.urls
