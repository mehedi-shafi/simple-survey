# Generated by Django 4.0.2 on 2022-02-21 07:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('survey', '0004_question_is_active_question_is_required'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questionoption',
            name='position',
            field=models.PositiveIntegerField(blank=True, null=True),
        ),
    ]