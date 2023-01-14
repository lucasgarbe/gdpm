from django.db import models


# Create your models here.


class PortSpecification(models.Model):
    name = models.CharField(max_length=29)
    type = models.CharField(max_length=29)
    upper = models.FloatField()  # Decimal('infinity') ist moeglich
    lower = models.FloatField()
    upperbound = models.BooleanField()  # open / closed
    lowerBound = models.BooleanField()
    mu = models.CharField(max_length=30)
    sigma = models.CharField(max_length=30)
    tau = models.CharField(max_length=30)
    optional = models.BooleanField()


class Distribution(models.Model):
    distType = models.CharField(max_length=30)
    name = models.CharField(max_length=30)
    url = models.URLField()
    image_url = models.URLField()  # kann man noch auf ImageField() aendern

    input = models.ManyToManyField(PortSpecification,
                                   blank=True,
                                   related_name="%(app_label)s_%(class)s_related")
    output = models.ForeignKey(PortSpecification,
                               models.SET_NULL,
                               blank=True,
                               null=True, )

    class Meta:
        abstract = True


class Constant(models.Model):
    value = models.IntegerField()


class Continuous(Distribution):
    pass


class Discrete(Distribution):
    pass


class DistributionModel(models.Model):
    pass
