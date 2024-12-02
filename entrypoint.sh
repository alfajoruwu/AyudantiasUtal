#!/bin/sh

# echo 'Running collecstatic...'
# python DjangoApi/manage.py collectstatic --no-input

# echo 'Applying migrations...'
# python DjangoApi/manage.py wait_for_db
# python DjangoApi/manage.py makemigrations
# python DjangoApi/manage.py migrate

# echo 'Running server...'
# python populate_data.py
# gunicorn --env DJANGO_SETTINGS_MODULE=DjangoApi.settings DjangoApi.wsgi:application --bind 0.0.0.0:8000

#!/bin/sh
cd DjangoApi

# Ejecuta las migraciones de la base de datos antes de iniciar Django
python DjangoApi/manage.py wait_for_db
python DjangoApi/manage.py makemigrations
python manage.py migrate

# Crea un superusuario automáticamente
echo "Creando superusuario..."
python manage.py shell << END
from django.contrib.auth import get_user_model

User = get_user_model()
run = "12345678-9"  # Reemplaza por un RUN válido
password = "admin123"
email = "admin@alumnos.utalca.cl"  # Reemplaza con un email válido

if not User.objects.filter(run=run).exists():
    User.objects.create_superuser(run=run, email=email, password=password)
    print("Superusuario creado con éxito.")
else:
    print("El superusuario ya existe.")
END


# Inicia el servidor Django en todas las interfaces de red
python manage.py runserver 0.0.0.0:8000
