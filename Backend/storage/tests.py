from django.test import TestCase

from .models import Support, PortSpecification, Discrete, Continuous


class SupportTestCase(TestCase):
    def setUp(self):
        Support.objects.create(pk="support_int", type="int", upper="inf", lower="-inf", upperInclusive="False",
                               lowerInclusive="False")
        Support.objects.create(pk="support_float", type="float", upper="inf", lower="-inf", upperInclusive="False",
                               lowerInclusive="False")

    def test_support(self):
        pass


class PortSpecificationTestCase(TestCase):
    def setUp(self):
        pass


class DistributionTestCase(TestCase):
    def setUp(self):
        PortSpecification.objects.create(pk="mu",
                                         name="mu - Expected number of occurrences during the given interval (mu >= 0)",
                                         type="float", upper="inf", lower="0", upperInclusive="False",
                                         lowerInclusive="True", optional="False")
        Support.objects.create(pk="support_int", type="int", upper="inf", lower="-inf", upperInclusive="False",
                               lowerInclusive="False")
        Discrete.objects.create(name="Poisson log-likelihood", distType="discrete",
                                url="https://www.pymc.io/projects/docs/en/stable/api/distributions/generated/pymc.Poisson.html",
                                image_url="https://www.pymc.io/projects/docs/en/stable/_images/pymc-Poisson-1.png",
                                output=Support.objects.get(pk='support_int'))

        Discrete.objects.get(name='Poisson log-likelihood').input.set([PortSpecification.objects.get(pk='mu')])

    def test_Distribution_input_output_class(self):
        poisson = Discrete.objects.get(name="Poisson log-likelihood")

        self.assertIsInstance(poisson.input.get(pk='mu'), PortSpecification)
        self.assertIsInstance(poisson.output, Support)
