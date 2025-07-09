"""
URL configuration for setup project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from setup.api_root import api_root  # Import the API root view
from apps.users.urls import urlpatterns as routes_users # Import the user routes
from apps.tasks.urls import urlpatterns as routes_tasks # Import the user routes
from apps.subtasks.urls import urlpatterns as routes_subtasks # Import the subtask routes

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api-root'),  # API root endpoint
    path('api/', include(routes_users)),  # Include user routes
    path('api/', include(routes_tasks)),  # Include task routes
    path('api/', include(routes_subtasks)),  # Include subtask routes
    # path('api/2/'),  # Include DRF authentication URLs
]
