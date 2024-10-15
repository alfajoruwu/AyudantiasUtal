import os
from django.db import migrations
from usuarios.models import User


def create_superuser(apps, schema_editor):
    username = os.getenv("SUPERUSER_USERNAME", "11.111.111-1")
    email = os.getenv("SUPERUSER_EMAIL", "admin@example.com")
    password = os.getenv("SUPERUSER_PASSWORD", "AdminAyud@nti@s")
    User.objects.create_superuser(run=username, email=email, password=password)


class Migration(migrations.Migration):
    dependencies = [
        ("usuarios", "0001_initial"),
    ]

    operations = [
        migrations.RunPython(create_superuser),
    ]
