import uuid
from django.db import models

""" GDPM_Model
Model to save the reactflow-graph in body as JSON
"""
class GDPM_Model(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(default="default_model", max_length=20)
    body = models.JSONField(default=dict)
    owner = models.ForeignKey('auth.User', related_name='gdpm_models',
                              on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)

    class Visibility(models.TextChoices):
        PUBLIC = 'public'
        PRIVATE = 'private'

    visibility = models.CharField(
        max_length=10,
        choices=Visibility.choices,
        default=Visibility.PRIVATE,
    )

    def __str__(self):
        return self.title


class Job(models.Model):
    model = models.ForeignKey(GDPM_Model, related_name="jobs", on_delete=models.CASCADE)
    status = models.CharField(max_length=30)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(auto_now=True)
