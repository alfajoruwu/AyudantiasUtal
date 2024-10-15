# views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
import json
from api.utils import enviar_correo
import random
from django.contrib.auth import logout
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.conf import settings

from .forms import UserCreationForm, UserCreationFormProfesor
from .models import verificar, User
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken


@csrf_exempt
def create_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Solicitud JSON no válida."}, status=400)

        form = UserCreationForm(data)
        if form.is_valid():
            try:
                form.save()
                return JsonResponse(
                    {"message": "Usuario creado exitosamente."},
                    status=status.HTTP_201_CREATED,
                )
            except Exception as e:
                return JsonResponse(
                    {"error": str(e)}, status=status.HTTP_400_BAD_REQUEST
                )
        else:
            return JsonResponse(
                {"errors": form.errors}, status=status.HTTP_400_BAD_REQUEST
            )
    return JsonResponse(
        {"error": "Método no permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED
    )


@csrf_exempt
def correo(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            destinatario = data.get("destinatario")
            if destinatario is None:
                return JsonResponse({"error": "Faltan campos requeridos."}, status=400)

            codigo = verificar.objects.create()
            codigo.correo = destinatario
            codigo.codigo = random.randint(100000, 999999)
            codigo.save()
            enviar_correo(
                destinatario,
                "verificar cuenta utal",
                "tu codigo es: " + str(codigo.codigo),
            )

        except json.JSONDecodeError:
            return JsonResponse({"error": "Solicitud JSON no válida."}, status=400)
        return JsonResponse({"message": "Correo enviado exitosamente."})
    return JsonResponse(
        {"error": "Método no permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED
    )


@csrf_exempt
def delete_user(request, user_id):
    if request.method == "DELETE":
        try:
            user = User.objects.get(id=user_id)
            user.delete()

            return JsonResponse(
                {"message": "Usuario eliminado exitosamente."},
                status=status.HTTP_200_OK,
            )
        except User.DoesNotExist:
            print("User not found")
            return JsonResponse(
                {"error": "Usuario no encontrado."}, status=status.HTTP_404_NOT_FOUND
            )
    return JsonResponse(
        {"error": "Método no permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED
    )


@csrf_exempt
def logout_view(request):
    print("logout")
    logout(request)
    response = JsonResponse({"message": "Logout successful"}, status=200)
    response.delete_cookie("access_token")  # Eliminar la cookie de sesión
    response.delete_cookie("refresh_token")  # Eliminar la cookie de sesión
    response.delete_cookie("csrftoken")  # Eliminar la cookie de sesión
    return response


@csrf_exempt
def create_user_profesor_view(request):
    # obtener el usuario que realiza la petición, con los headers de la petición
    # los headers de la petición son "Bearer <token>"
    if request.method == "POST":
        if not request.headers.get("Authorization") or not request.headers.get(
            "Authorization"
        ).startswith("Bearer "):
            return JsonResponse(
                {"error": "No se proporcionó un token de autorización."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        token = request.headers["Authorization"].split(" ")[1]
        # validar el token con simplejwt
        try:
            access_token = AccessToken(token)
            # Token is valid, you can access its payload
            user_id = access_token["user_id"]
            # Perform any additional validation or checks here
        except (InvalidToken, TokenError):
            return JsonResponse(
                {"error": "Token de autorización inválido."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        user = User.objects.get(id=user_id)
        if not user.groups.filter(name="Coordinador").exists():
            return JsonResponse(
                {"error": "No tienes permisos para realizar esta acción."},
                status=status.HTTP_403_FORBIDDEN,
            )

        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Solicitud JSON no válida."}, status=400)

        form = UserCreationFormProfesor(data)
        if form.is_valid():
            form.save()
            return JsonResponse(
                {"message": "Usuario creado exitosamente."},
                status=status.HTTP_201_CREATED,
            )
        else:
            return JsonResponse(
                {"errors": form.errors}, status=status.HTTP_400_BAD_REQUEST
            )
    return JsonResponse(
        {"error": "Método no permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED
    )


@csrf_exempt
def password_reset_confirm(request, uidb64=None, token=None):
    print(request.body)
    if uidb64 is not None and token is not None:
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and default_token_generator.check_token(user, token):
            if request.method == "POST":
                try:
                    data = json.loads(request.body)
                except json.JSONDecodeError:
                    return JsonResponse({"error": "Invalid JSON."}, status=400)

                new_password = data.get("new_password")
                confirm_password = data.get("confirm_password")
                if new_password and confirm_password:
                    if new_password == confirm_password:
                        print("new", new_password)
                        print("user", user)
                        user.set_password(new_password)
                        user.save()
                        return JsonResponse(
                            {"message": "Tu contraseña ha sido cambiada."}, status=200
                        )
                    else:
                        return JsonResponse(
                            {"error": "Las contraseñas no coinciden."}, status=400
                        )
                else:
                    print("new", new_password)
                    print("confirm", confirm_password)
                    return JsonResponse(
                        {"error": "Los campos de contraseña son requeridos."},
                        status=400,
                    )
            return JsonResponse(
                {"message": "El token es válido.", "uid": uidb64, "token": token},
                status=200,
            )
        else:
            return JsonResponse(
                {"error": "El token no es válido o ha expirado."}, status=400
            )
    return JsonResponse({"error": "Invalid request."}, status=400)


@csrf_exempt
def password_reset_request(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON."}, status=400)
        email = data.get("email")
        if email:
            associated_users = User.objects.filter(email=email)
            if associated_users.exists():
                for user in associated_users:
                    token = default_token_generator.make_token(user)
                    uid = urlsafe_base64_encode(force_bytes(user.pk))
                    url = f"{settings.FRONTEND_URL}/reset/{uid}/{token}/"
                    message = (
                        f"Hola {user.nombre_completo},\n\n"
                        "Hemos recibido una solicitud para recuperar tu contraseña.\n"
                        f"Si no has solicitado esto, ignora este mensaje.\n\n"
                        f"Para recuperar tu contraseña, visita el siguiente enlace:\n{url}\n\n"
                        "Gracias,\n"
                        "Este es un mensaje automático, por favor no respondas a este correo.\n"
                    )
                    enviar_correo(
                        user.email, "Solicitud para recuperar contraseña", message
                    )
            return JsonResponse(
                {
                    "message": "Si el correo proporcionado es válido, recibirás un correo con instrucciones para recuperar tu contraseña."
                },
            )
        else:
            return JsonResponse(
                {"error": "El campo de correo es requerido."}, status=400
            )
    return JsonResponse({"error": "Invalid request method."}, status=405)
