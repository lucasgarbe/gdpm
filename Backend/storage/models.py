from django.db import models


# Create your models here.
class Support(models.Model):
    id = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=29)
    type = models.CharField(max_length=29)
    upper = models.FloatField()
    lower = models.FloatField()
    upperBound = models.BooleanField()  # open / closed
    lowerBound = models.BooleanField()
    mu = models.CharField(max_length=30)
    sigma = models.CharField(max_length=30)
    tau = models.CharField(max_length=30)
    optional = models.BooleanField()

    def __str__(self):
        return self.name


class PortSpecification(models.Model):
    id = models.CharField(max_length=20, primary_key=True)
    name = models.CharField(max_length=29)
    type = models.CharField(max_length=29)
    upper = models.FloatField()
    lower = models.FloatField()
    upperBound = models.BooleanField()  # open / closed
    lowerBound = models.BooleanField()
    mu = models.CharField(max_length=30)
    sigma = models.CharField(max_length=30)
    tau = models.CharField(max_length=30)
    optional = models.BooleanField()

    def __str__(self):
        return self.name


class Distribution(models.Model):
    distType = models.CharField(max_length=30)
    name = models.CharField(max_length=30, primary_key=True)
    url = models.URLField()
    image_url = models.URLField()  # kann man noch auf ImageField() aendern

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


class Constant(models.Model):
    value = models.IntegerField()


class Continuous(Distribution):
    pass


class Discrete(Distribution):
    pass


class DistributionModel(models.Model):
    pass
