from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
    Group,
)
from django.core.exceptions import ValidationError
from datetime import timedelta
from django.utils import timezone
from itertools import cycle


def digito_verificador(rut):
    reversed_digits = map(int, reversed(str(rut)))
    factors = cycle(range(2, 8))
    s = sum(d * f for d, f in zip(reversed_digits, factors))
    return (-s) % 11 if (-s) % 11 < 10 else "K"


# Create your CustomUserManager here.
class CustomUserManager(BaseUserManager):
    def _create_user(self, password, run, **extra_fields):
        if not password:
            raise ValueError("Contraseña no puede ser vacía.")

        run_aux = run.replace(".", "").replace("-", "").replace(" ", "")
        run_aux, digito = run_aux[:-1], run_aux[-1]

        if str(digito_verificador(int(run_aux))) != digito:
            raise ValueError("Run no valido")

        user = self.model(
            run=run,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)

        # Obtener el grupo del usuario, por defecto "Estudiante"
        group_name = extra_fields.get("group", "Estudiante")
        group, _ = Group.objects.get_or_create(name=group_name)
        user.groups.add(group)
        return user

    def create_user(self, password, run, **extra_fields):
        # busca codigo de verificacion
        codigo = verificar.objects.filter(codigo=extra_fields.pop("codigo"))
        if not codigo.exists():
            raise ValueError("Codigo de verificacion no valido")
        codigo = codigo.first()
        codigo.clean()
        if codigo.correo != extra_fields.get("email"):
            print("Correo no coincide")
            raise ValueError("Codigo de verificacion no valido")

        if not extra_fields.get("email").endswith("@alumnos.utalca.cl"):
            raise ValidationError(
                "El dominio del correo electrónico debe ser @alumnos.utalca.cl"
            )

        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_superuser", False)

        return self._create_user(password, run, **extra_fields)

    def create_superuser(self, password, run, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_superuser", True)
        return self._create_user(password, run, **extra_fields)

    def create_profesor(self, password, run, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(password, run, **extra_fields)

    def create_user_admin(self, password, run, **extra_fields):
        print("test")
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_active", True)
        extra_fields.setdefault("is_superuser", False)

        return self._create_user_admin(password, run, **extra_fields)

    def _create_user_admin(self, password, run, **extra_fields):
        if not password:
            raise ValueError("Contraseña no puede ser vacía.")

        user = self.model(
            run=run,
            **extra_fields,
        )
        user.set_password(password)
        user.save(using=self._db)

        # Obtener el grupo del usuario, por defecto "Estudiante"
        group_name = extra_fields.get("group", "Estudiante")
        group, _ = Group.objects.get_or_create(name=group_name)
        user.groups.add(group)
        return user


# Create your User Model here.
class User(AbstractBaseUser, PermissionsMixin):
    # Abstractbaseuser has password, last_login, is_active by default

    run = models.CharField(max_length=13, unique=True)
    nombre_completo = models.CharField(max_length=100)
    email = models.EmailField(db_index=True, unique=True, max_length=254)
    otro_contacto = models.CharField(max_length=100, blank=True)
    matricula = models.CharField(max_length=12, blank=True)
    tipo_cuenta = models.CharField(max_length=20, blank=True)
    n_cuenta = models.CharField(max_length=20, blank=True)
    banco = models.CharField(max_length=50, blank=True)
    n_contacto = models.CharField(max_length=12, blank=True)
    riesgo_academico = models.BooleanField(default=False)
    charla = models.BooleanField(default=False)
    Promedio = models.FloatField(default=0.0)

    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    is_superuser = models.BooleanField(default=False)

    objects = CustomUserManager()

    USERNAME_FIELD = "run"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = "Usuario"
        verbose_name_plural = "Usuarios"


# modelo para verificar
class verificar(models.Model):
    correo = models.EmailField(max_length=100)
    codigo = models.CharField(max_length=6)
    fecha = models.DateTimeField(auto_now_add=True)

    def clean(self):
        # si ya existe un codigo de verificacion para el correo, se eliminan los anteriores (no el actual)
        verificar.objects.filter(correo=self.correo).exclude(
            codigo=self.codigo
        ).delete()

        # si el codigo de verificacion es anterior a 5 minutos
        if self.fecha < timezone.now() - timedelta(minutes=5):
            raise ValueError("Codigo de verificacion expirado")
        return self
