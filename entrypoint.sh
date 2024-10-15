#!/bin/sh

echo 'Running collecstatic...'
python DjangoApi/manage.py collectstatic --no-input

echo 'Applying migrations...'
python DjangoApi/manage.py wait_for_db
python DjangoApi/manage.py makemigrations
python DjangoApi/manage.py migrate

echo 'Running server...'
cd DjangoApi
python populate_data.py
gunicorn --env DJANGO_SETTINGS_MODULE=DjangoApi.settings DjangoApi.wsgi:application --bind 0.0.0.0:8000