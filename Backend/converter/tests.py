import json
from django.test import TestCase

from Backend.converter.pymc_converter import convert_model


class SupportTestCase(TestCase):

    def test_convert_model_to_pymc(self):
        print(convert_model('Backend/converter/test/testedge.json'))
