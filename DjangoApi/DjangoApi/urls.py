from django.contrib import admin
from django.urls import path, include
from rest_framework.documentation import include_docs_urls

urlpatterns = [
    path("backend/admin/", admin.site.urls),
    path("backend/", include("api.urls")),
    path("backend/", include("usuarios.urls")),
    path("backend/docs/", include_docs_urls(title="api ayudantias")),
]
