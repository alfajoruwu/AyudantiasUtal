# forms.py
from django import forms
from django.contrib.auth.forms import UserChangeForm
from django.contrib.auth.forms import UserCreationForm as BaseUserCreationForm
from django.contrib.auth.models import Group
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings

from usuarios.models import User
from api.utils import enviar_correo


class UserCreationForm(forms.ModelForm):
    password = forms.CharField(widget=forms.PasswordInput)
    codigo = forms.CharField(max_length=6)

    class Meta:
        model = User
        fields = [
            "run",
            "nombre_completo",
            "email",
            "codigo",
        ]

    def save(self, commit=True):
        User.objects.create_user(
            password=self.cleaned_data["password"],
            run=self.cleaned_data["run"],
            nombre_completo=self.cleaned_data["nombre_completo"],
            email=self.cleaned_data["email"],
            codigo=self.cleaned_data["codigo"],
        )


class UserAdminCreationForm(BaseUserCreationForm):
    class Meta:
        model = User
        fields = ["run", "nombre_completo", "email", "password"]

    def save(self, commit=True):
        user = super().save(commit=False)
        if self.cleaned_data.get("password1"):
            user.set_password(self.cleaned_data["password1"])
        else:
            user.set_unusable_password()
        if commit:
            user.save()
        return user


class CustomUserChangeForm(UserChangeForm):
    password = forms.CharField(widget=forms.PasswordInput, required=False)

    class Meta:
        model = User
        fields = [
            "run",
            "nombre_completo",
            "email",
            "otro_contacto",
            "matricula",
            "tipo_cuenta",
            "n_cuenta",
            "banco",
            "n_contacto",
            "riesgo_academico",
            "charla",
        ]

    def clean_password(self):
        # Return the initial value if no new password is provided or if the new password is an empty string
        password = self.cleaned_data.get("password", "")
        if not password:
            return self.initial["password"]
        return password

    def save(self, commit=True):
        user = super().save(commit=False)
        if self.cleaned_data["password"]:
            user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


class UserCreationFormProfesor(forms.ModelForm):
    class Meta:
        model = User
        fields = [
            "run",
            "nombre_completo",
            "email",
        ]

    def save(self, commit=True):
        profesor = User.objects.create_profesor(
            password="a",
            run=self.cleaned_data["run"],
            nombre_completo=self.cleaned_data["nombre_completo"],
            email=self.cleaned_data["email"],
        )
        profesor.set_unusable_password()
        profesor.save()
        self.mandar_correo(profesor)
        ESTUDIANTE = Group.objects.get_or_create(name="Estudiante")[0]
        PROFESOR = Group.objects.get_or_create(name="Profesor")[0]
        profesor.groups.add(PROFESOR)
        profesor.groups.remove(ESTUDIANTE)

    def mandar_correo(self, profesor):
        token = default_token_generator.make_token(profesor)
        uid = urlsafe_base64_encode(force_bytes(profesor.pk))
        url = f"{settings.FRONTEND_URL}/reset/{uid}/{token}/"
        message = (
            f"Hola {profesor.nombre_completo},\n\n"
            "Hemos recibido una solicitud para recuperar tu contraseña.\n"
            f"Si no has solicitado esto, ignora este mensaje.\n\n"
            f"Para recuperar tu contraseña, visita el siguiente enlace:\n{url}\n\n"
            "Gracias,\n"
            "Este es un mensaje automático, por favor no respondas a este correo.\n"
        )
        enviar_correo(profesor.email, "Solicitud para recuperar contraseña", message)
