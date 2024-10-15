import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "DjangoApi.settings")
import django

django.setup()

from random import randint
from django.contrib.auth.models import Group
from usuarios.models import User
from datetime import date


# Crear grupos
COORDINADOR = Group.objects.get_or_create(name="Coordinador")[0]
ESTUDIANTE = Group.objects.get_or_create(name="Estudiante")[0]
PROFESOR = Group.objects.get_or_create(name="Profesor")[0]


# Crear Coordinador
user = User.objects.create_user(
    password=os.environ.get("ADMIN_PASSWORD"),
    run=12345678,
    nombre_completo="Coordinador",
    email="Coordinador@example.com",
)
user.groups.add(COORDINADOR)
user.groups.remove(ESTUDIANTE)
user.is_superuser = True
