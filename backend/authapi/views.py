"""
Vistas de la API de autenticacion.

Endpoints:
    POST /api/register/   -> crea un usuario
    POST /api/login/      -> devuelve tokens JWT
    GET  /api/me/         -> datos del usuario autenticado (requiere token)
    POST /api/refresh/    -> renueva el token de acceso
"""

from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import LoginSerializer, RegisterSerializer, UserSerializer


def tokens_para_usuario(user):
    """Genera el par de tokens (refresh y access) de un usuario."""
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class RegisterView(APIView):
    """Registro de usuario. Publico: no requiere token."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"mensaje": "No se pudo crear la cuenta.", "errores": serializer.errors},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = serializer.save()
        return Response(
            {
                "mensaje": "Cuenta creada correctamente.",
                "usuario": UserSerializer(user).data,
                **tokens_para_usuario(user),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """Login: valida credenciales y devuelve el token JWT."""

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                {"mensaje": "Usuario y contrasena son obligatorios."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # authenticate compara el hash guardado en la base de datos
        user = authenticate(
            request,
            username=serializer.validated_data["username"],
            password=serializer.validated_data["password"],
        )

        if user is None:
            return Response(
                {"mensaje": "Usuario o contrasena incorrectos."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user.is_active:
            return Response(
                {"mensaje": "Esta cuenta esta desactivada."},
                status=status.HTTP_403_FORBIDDEN,
            )

        return Response(
            {
                "mensaje": "Autenticacion exitosa.",
                "usuario": UserSerializer(user).data,
                **tokens_para_usuario(user),
            },
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    """Ruta protegida: solo responde si el token es valido."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"usuario": UserSerializer(request.user).data})
