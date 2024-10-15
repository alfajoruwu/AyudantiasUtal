# admin.py
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User
from .forms import UserAdminCreationForm, CustomUserChangeForm


class UserGroupInline(admin.TabularInline):
    model = User.groups.through
    extra = 1


class CustomUserAdmin(BaseUserAdmin):
    add_form = UserAdminCreationForm
    form = CustomUserChangeForm
    model = User
    list_display = ["run", "nombre_completo", "email", "is_staff", "is_active"]
    list_filter = ["is_staff", "is_active"]
    fieldsets = (
        (None, {"fields": ("run", "password")}),
        (
            "Personal Info",
            {
                "fields": (
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
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_staff",
                    "is_active",
                    "is_superuser",
                )
            },
        ),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "run",
                    "nombre_completo",
                    "email",
                    "password1",
                    "password2",
                    "is_staff",
                    "is_active",
                ),
            },
        ),
    )
    search_fields = ("run", "email", "nombre_completo")
    ordering = ("run",)
    filter_horizontal = (
        "groups",
        "user_permissions",
    )
    inlines = [UserGroupInline]

    def save_model(self, request, obj, form, change):
        if change:  # Only for existing users
            if form.cleaned_data["password"] == form.initial["password"]:
                # Password has not been changed
                obj.password = form.initial["password"]
            else:
                # Set the new password
                obj.set_password(form.cleaned_data["password"])
        super().save_model(request, obj, form, change)


admin.site.register(User, CustomUserAdmin)
