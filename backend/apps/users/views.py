from rest_framework import viewsets, status
from apps.users.serializers import UserSerializer, LoginSerializer
from django.contrib.auth.models import User  
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import logout

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("id")  
    serializer_class = UserSerializer
    http_method_names = ['get', 'put', 'patch', 'delete', 'options']

class LoginViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    http_method_names = ['get', 'post']

    def list(self, request):  # trata GET /login/
        return Response({'Message': 'Faça seu login para continuar!'})
    
    def create(self, request):
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']
            return Response({'message': f'Login bem-sucedido para {user.username}'})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RegisterViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    http_method_names = ['get', 'post']

    def list(self, request):
        return Response({'Message': 'Crie sua conta para continuar!'})
    
    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # salva o novo usuário no banco
            return Response({'message': f'Usuário {user.username} criado com sucesso!'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class LogoutViewSet(viewsets.ViewSet):
    http_method_names = ['get', 'post']  # restringe os métodos

    def list(self, request):
        return Response({'Message': 'Logout quase concluído!'})
    
    def create(self, request):
        logout(request)  # encerra a sessão
        return Response({'message': 'Logout realizado com sucesso!'}, status=status.HTTP_200_OK)
    
class SessionViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    http_method_names = ['get']

    def list(self, request):
        if request.user.is_authenticated:
            return Response({'isAuthenticated': True, 'username': request.user.username})
        return Response({'isAuthenticated': False})