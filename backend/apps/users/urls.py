from rest_framework import routers
from django.urls import path, include
from apps.users.views import (
    UserViewSet, LoginViewSet, 
    RegisterViewSet, LogoutViewSet, SessionViewSet,
    UserProfileView)  

router_users = routers.DefaultRouter()
router_users.register(r'users', UserViewSet, basename='users')
router_users.register(r'login', LoginViewSet, basename='login')
router_users.register(r'register', RegisterViewSet, basename='register')
router_users.register(r'logout', LogoutViewSet, basename='logout')
router_users.register(r'session', SessionViewSet, basename='session')
router_users.register(r'points', UserProfileView, basename='points')

urlpatterns = [
    path('', include(router_users.urls)),
    # path('users/points/', UserProfileView.as_view({'get': 'list'}), name='user-points'),
]