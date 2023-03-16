import json
from django.test import TestCase

# Create your tests here.
from .models import Nodes


class SupportTestCase(TestCase):

    def testJSON(self):
        with open('./converter/testmodel.json') as f:
            j = json.load(f)
            # u = Nodes(**j)

            print(j)
