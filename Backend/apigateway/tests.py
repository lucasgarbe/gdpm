from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from storage.models import GDPM_Model, Job
from unittest.mock import patch, mock_open
from django.utils import timezone
from datetime import timedelta


class GDPM_ModelViewSetTests(APITestCase):
    def setUp(self):
        """Set up test data"""
        # Create users
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@test.com',
            password='adminpass'
        )
        self.regular_user = User.objects.create_user(
            username='regular',
            email='regular@test.com',
            password='regularpass'
        )
        self.another_user = User.objects.create_user(
            username='another',
            email='another@test.com',
            password='anotherpass'
        )

        # Create test models with different timestamps
        self.now = timezone.now()

        # Public models
        self.public_model_1 = GDPM_Model.objects.create(
            title='Public Model 1',
            body='test body 1',
            visibility='public',
            owner=self.regular_user,
            changed_at=self.now - timedelta(days=1)
        )

        self.public_model_2 = GDPM_Model.objects.create(
            title='Public Model 2',
            body='test body 2',
            visibility='public',
            owner=self.another_user,
            changed_at=self.now
        )

        # Private models
        self.private_model_1 = GDPM_Model.objects.create(
            title='Private Model 1',
            body='private body 1',
            visibility='private',
            owner=self.regular_user,
            changed_at=self.now - timedelta(days=2)
        )

        self.private_model_2 = GDPM_Model.objects.create(
            title='Private Model 2',
            body='private body 2',
            visibility='private',
            owner=self.another_user,
            changed_at=self.now - timedelta(days=3)
        )

        # Create some test jobs
        self.job1 = Job.objects.create(
            model=self.public_model_1,
            status='completed'
        )
        self.job2 = Job.objects.create(
            model=self.public_model_1,
            status='pending'
        )

        self.client = APIClient()

    def test_list_public_models_unauthenticated(self):
        """Test that unauthenticated users can only see public models"""
        response = self.client.get(reverse('model-list'))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Only public models
        self.assertTrue(all(model['visibility'] == 'public' for model in response.data))
        
        # Check ordering (newest changed_at first)
        self.assertEqual(response.data[0]['id'], str(self.public_model_2.id))
        self.assertEqual(response.data[1]['id'], str(self.public_model_1.id))

    def test_list_models_regular_user(self):
        """Test that regular users can see their own models and public models"""
        self.client.force_authenticate(user=self.regular_user)
        
        # Test default visibility (public)
        response = self.client.get(reverse('model-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)  # User's private model + all public models
        
        # Test private visibility
        response = self.client.get(reverse('model-list') + '?visibility=private')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Only user's models
        self.assertEqual(response.data[0]['id'], str(self.private_model_1.id))

    def test_list_models_admin(self):
        """Test that admin users can see all models"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(reverse('model-list'))
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)  # All models
        
        # Verify ordering
        model_ids = [model['title'] for model in response.data]
        expected_order = [
            str(self.private_model_2.title),
            str(self.private_model_1.title),
            str(self.public_model_2.title),
            str(self.public_model_1.title)
        ]
        self.assertEqual(model_ids, expected_order)

    def test_create_model(self):
        """Test creating a new model"""
        self.client.force_authenticate(user=self.regular_user)
        data = {
            'title': 'New Model',
            'body': 'new body',
            'visibility': 'public'
        }
        
        response = self.client.post(reverse('model-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['owner'], self.regular_user.username)
        self.assertEqual(response.data['title'], 'New Model')

    def test_duplicate_model(self):
        """Test duplicating a model"""
        self.client.force_authenticate(user=self.regular_user)
        
        # Test duplicating own model
        response = self.client.get(
            reverse('model-duplicate', kwargs={'pk': self.public_model_1.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        duplicated_model = GDPM_Model.objects.get(id=response.data['id'])
        self.assertEqual(duplicated_model.title, self.public_model_1.title + ' (copy)')
        self.assertEqual(duplicated_model.owner, self.regular_user)
        
        # Test duplicating public model owned by another user
        response = self.client.get(
            reverse('model-duplicate', kwargs={'pk': self.public_model_2.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        duplicated_model = GDPM_Model.objects.get(id=response.data['id'])
        self.assertEqual(duplicated_model.owner, self.regular_user)

    def test_jobs_action(self):
        """Test retrieving jobs for a model"""
        self.client.force_authenticate(user=self.regular_user)
        
        response = self.client.get(
            reverse('model-jobs', kwargs={'pk': self.public_model_1.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Two jobs for public_model_1
        
        # Verify job statuses
        job_statuses = [job['status'] for job in response.data]
        self.assertIn('completed', job_statuses)
        self.assertIn('pending', job_statuses)

    def test_permission_denied_cases(self):
        """Test various permission denied scenarios"""
        self.client.force_authenticate(user=self.regular_user)
        
        # Try to access another user's private model
        response = self.client.get(
            reverse('model-detail', kwargs={'pk': self.private_model_2.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Try to duplicate private model of another user
        response = self.client.get(
            reverse('model-duplicate', kwargs={'pk': self.private_model_2.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Try to get jobs of another user's private model
        response = self.client.get(
            reverse('model-jobs', kwargs={'pk': self.private_model_2.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthenticated_access_restrictions(self):
        """Test restrictions for unauthenticated users"""
        # Try to create model without authentication
        data = {
            'title': 'Unauthorized Model',
            'body': 'test body',
            'visibility': 'public'
        }
        response = self.client.post(reverse('model-list'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Try to duplicate model wit
        response = self.client.get(
            reverse('model-duplicate', kwargs={'pk': self.public_model_1.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Try to get jobs without authentication
        response = self.client.get(
            reverse('model-jobs', kwargs={'pk': self.public_model_1.pk})
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class ConfigViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.mock_config_data = """
        distributions:
          - distType: discrete
            name: test_discrete
          - distType: continuous
            name: test_continuous
        """

    @patch("builtins.open", new_callable=mock_open, read_data="config data")
    def test_get_config(self, mock_file):
        """Test getting config file"""
        response = self.client.get(reverse('config'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/octet-stream')

    @patch("builtins.open", new_callable=mock_open, read_data="config data")
    def test_post_config(self, mock_file):
        """Test updating config file"""
        data = {'config': 'new config data'}
        response = self.client.post(reverse('config'), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        mock_file().write.assert_called_once_with('new config data')

class DiscreteViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.mock_config_data = {
            'distributions': [
                {'distType': 'discrete', 'name': 'test1'},
                {'distType': 'discrete', 'name': 'test2'}
            ]
        }

    @patch('yaml.safe_load')
    def test_get_discrete_distributions(self, mock_yaml_load):
        """Test getting discrete distributions"""
        mock_yaml_load.return_value = self.mock_config_data
        response = self.client.get(reverse('discrete'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertTrue(all(d['distType'] == 'discrete' for d in response.data))

class ContinuousViewTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.mock_config_data = {
            'distributions': [
                {'distType': 'continuous', 'name': 'test1'},
                {'distType': 'continuous', 'name': 'test2'}
            ]
        }

    @patch('yaml.safe_load')
    def test_get_continuous_distributions(self, mock_yaml_load):
        """Test getting continuous distributions"""
        mock_yaml_load.return_value = self.mock_config_data
        response = self.client.get(reverse('continuous'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertTrue(all(d['distType'] == 'continuous' for d in response.data))

class PymcViewSetTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user('testuser', 'test@test.com', 'testpass')
        self.model = GDPM_Model.objects.create(
            title='Test Model',
            body='{ "nodes": [], "edges": [] }',
            visibility='public',
            owner=self.user
        )
        print(self.model.id, self.model.title, )
        self.client = APIClient()

    @patch('converter.pymc_converter.convert_model')
    def test_retrieve_pymc_code(self, mock_convert):
        """Test retrieving PyMC code"""
        mock_convert.return_value = 'converted code'
        response = self.client.get(
            reverse('pymc-detail', kwargs={'id': self.model.id})
        )
        print(response)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/force-download')
        self.assertEqual(
            response['Content-Disposition'],
            f'attachment; filename="{self.model.id}.py"'
        )
