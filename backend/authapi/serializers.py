"""
Serializers: traducen entre objetos de Django y JSON.
"""

from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    """Datos publicos del usuario que devolvemos al frontend."""

    class Meta:
        model = User
        fields = ("id", "username", "email")


class RegisterSerializer(serializers.ModelSerializer):
    """Valida y crea un usuario nuevo."""

    password = serializers.CharField(
        write_only=True,            # nunca se devuelve en la respuesta
        validators=[validate_password],
    )
    email = serializers.EmailField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("Ese nombre de usuario ya esta registrado.")
        return value

    def create(self, validated_data):
        # create_user cifra la contrasena con hash (nunca se guarda en texto plano)
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data.get("email", ""),
            password=validated_data["password"],
        )


class LoginSerializer(serializers.Serializer):
    """Solo valida que vengan los dos campos del formulario."""

    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
