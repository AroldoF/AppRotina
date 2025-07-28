from django.contrib import admin
from django.urls import path, include
from setup.api_root import api_root  
from apps.users.urls import urlpatterns as routes_users 
from apps.tasks.urls import urlpatterns as routes_tasks 
from apps.subtasks.urls import urlpatterns as routes_subtasks 
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),  # API root endpoint
    path('api/', include(routes_users)),  # Include user routes
    path('api/', include(routes_tasks)),  # Include task routes
    path('api/', include(routes_subtasks)),  # Include subtask routes
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
