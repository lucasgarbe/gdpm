import uuid
from django.db import models

""" Support
Defines the output of all distributions
"""


class Support(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    type = models.CharField(max_length=29)
    upper = models.CharField(max_length=29)
    lower = models.CharField(max_length=29)
    upperInclusive = models.BooleanField()
    lowerInclusive = models.BooleanField()

    def __str__(self):
        return self.id


""" PortSpecification
 Defines the Inputs of a distribution.
"""


class PortSpecification(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=29)
    type = models.CharField(max_length=29)
    upper = models.CharField(max_length=29)
    lower = models.CharField(max_length=29)
    upperInclusive = models.BooleanField()
    lowerInclusive = models.BooleanField()

    optional = models.BooleanField()

    def __str__(self):
        return self.name


"""
Abstract class to act as Interface for continuous / discrete distributions
"""


class Distribution(models.Model):
    distType = models.CharField(max_length=30)
    name = models.CharField(max_length=30, primary_key=True)
    displayName = models.CharField(max_length=40)
    url = models.URLField()
    image_url = models.URLField()

    input = models.ManyToManyField(PortSpecification,
                                   blank=True,
                                   )
    output = models.ForeignKey(Support,
                               models.SET_NULL,
                               blank=True,
                               null=True, )

    class Meta:
        abstract = True

    def __str__(self):
        return self.name


class Continuous(Distribution):
    pass


class Discrete(Distribution):
    pass


""" GDPM_Model
Model to save the reactflow-graph in body as JSON
"""


class GDPM_Model(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(default="default_model", max_length=20)
    body = models.JSONField(default=dict)

    def __str__(self):
        return self.id


class Constant(models.Model):
    value = models.IntegerField()
