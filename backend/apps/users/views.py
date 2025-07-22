from rest_framework import viewsets, status
from apps.users.serializers import UserSerializer, LoginSerializer, RegisterSerializer
from django.contrib.auth.models import User  
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import logout
from rest_framework_simplejwt.tokens import RefreshToken

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("id")  
    serializer_class = UserSerializer
    http_method_names = ['get', 'put', 'patch', 'delete', 'options', 'head']  

# View para login
class LoginViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    serializer_class = LoginSerializer
    http_method_names = ['get', 'post','options', 'head']

    def list(self, request):  # trata GET /login/
        return Response({'message': 'Faça seu login para continuar!'})

    def create(self, request):  # trata POST /login/
        serializer = LoginSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data['user']

            # Gerando JWT (access token e refresh token)
            refresh = RefreshToken.for_user(user)
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            # Respondendo com os tokens
            return Response({
                'message': f'Login bem-sucedido para {user.username}',
                'user_id': user.id,
                'access_token': access_token,
                'refresh_token': refresh_token
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RegisterViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer
    http_method_names = ['get', 'post', 'options', 'head']

    def list(self, request):
        return Response({'message': 'Crie sua conta para continuar!'})

    def create(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            # Salva o novo usuário
            user = serializer.save()

            # Gerar apenas o access token
            access_token = str(RefreshToken.for_user(user).access_token)

            # Retorna a resposta com o access token
            return Response({
                'message': f'Usuário {user.username} criado com sucesso!',
                'access_token': access_token
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    
class LogoutViewSet(viewsets.ViewSet):
    http_method_names = ['get', 'post', 'options', 'head']  # restringe os métodos

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