from rest_framework import routers
from django.urls import path
from apps.users.views import (
    UserViewSet, LoginViewSet, 
    RegisterViewSet, LogoutViewSet, SessionViewSet)  

router_users = routers.DefaultRouter()
router_users.register(r'users', UserViewSet, basename='users')
router_users.register(r'login', LoginViewSet, basename='login')
router_users.register(r'register', RegisterViewSet, basename='register')
router_users.register(r'logout', LogoutViewSet, basename='logout')
router_users.register(r'session', SessionViewSet, basename='session')

urlpatterns = router_users.urls