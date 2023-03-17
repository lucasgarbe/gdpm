import json
from django.test import TestCase

from Backend.converter.models import convert_model_to_pymc


class SupportTestCase(TestCase):

    def test_JSON(self):
        with open('./converter/testmodel.json') as f:
            j = json.load(f)
            # u = Nodes(**j)

            print(j)

    def test_pymc(self):
        import pymc as pm
        basic_model = pm.Model()

        with basic_model as schools:
            const1 = 0
            const2 = 10
            const3 = 1

            alpha_node1 = pm.Normal("alpha", mu=const1, sigma=const2)
            beta = pm.Normal("beta", mu=const1, sigma=const2)
            sigma = pm.HalfNormal("sigma", sigma=const3)

            obs = pm.Normal("obs", alpha=alpha_node1, beta=beta, sigma=sigma)

    def test_convert_model_to_pymc(self):
        convert_model_to_pymc('./converter/testedge.json')
