from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


from usuarios.views import (
    create_user,
    correo,
    delete_user,
    logout_view,
    create_user_profesor_view,
    password_reset_request,
    password_reset_confirm,
)

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("create/", create_user),
    path("correo_enviar/", correo),
    path("delete/<int:user_id>/", delete_user, name="delete_user"),
    path("logout/", logout_view, name="logout"),
    path("create_profesor/", create_user_profesor_view, name="create_profesor"),
    path("password_reset/", password_reset_request, name="password_reset"),
    path(
        "reset/<uidb64>/<token>/", password_reset_confirm, name="password_reset_confirm"
    ),
]
