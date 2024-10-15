from django.db import migrations


def create_groups(apps, schema_editor):
    Group = apps.get_model("auth", "Group")
    Group.objects.get_or_create(name="Coordinador")
    Group.objects.get_or_create(name="Profesor")
    Group.objects.get_or_create(name="Estudiante")


class Migration(migrations.Migration):
    dependencies = [
        ("usuarios", "0003_alter_user_promedio"),
    ]

    operations = [
        migrations.RunPython(create_groups),
    ]
