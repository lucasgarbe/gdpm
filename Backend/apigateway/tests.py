from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient


# Create your tests here.
class MyAPITestCase(TestCase):
    # Get URL for GDPM_ModelViewSet
    gdpm_url = reverse('gdpm_model-list')

    # Get URL for DownloadViewSet
    download_url = reverse('download-list')

    # Get URL for DiscreteViewSet
    discrete_url = reverse('discrete-list')

    # Get URL for ContinuousViewSet
    continuous_url = reverse('continuous-list')

    # Get URL for PymcViewSet
    pymc_url = reverse('pymc-list')

    def setUp(self):
        self.client = APIClient()

    def test_get_gdpm_model(self):
        url = reverse('my-api')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_gdpm_model(self):
        url = reverse('my-api')
        data = {'name': 'test', 'description': 'test item'}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
