import os
from django.test import TestCase
from django.conf import settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.exceptions import ObjectDoesNotExist
from mds.core.models import Concept, Observation
from . import VideoResource
from test_helpers import *

import logging
logger = logging.getLogger('mds.sewi')

class VideoResourceTestCase(TestCase):
    """Test Case X: Video Resource Can Initialize From Database
    """

    def setUp(self):
        self.test_encounter = create_test_encounter()
        self.valid_test_concept = Concept.objects.create(
            name = 'TEST VIDEO OBSERVATION',
            display_name = 'Test Video Obs',
            description = 'Test Video data',
            datatype = 'complex',
            mimetype = 'video/mp4'
        )

        self.valid_test_observation = Observation.objects.create(
            node = '0',
            concept = self.valid_test_concept,
            encounter = self.test_encounter,
            value_text = 'value complex',
            value_complex = SimpleUploadedFile('test.mp4', '<video data>'),
        )

        self.invalid_test_concept = Concept.objects.create(
            name = 'INVALID OBSERVATION',
            display_name = 'Invalid Obs',
            description = 'Invalid data',
            datatype = 'complex',
            mimetype = 'image/mp4'
        )

        self.invalid_test_observation_1 = Observation.objects.create(
            node = '1',
            concept = self.invalid_test_concept,
            encounter = self.test_encounter,
            value_text = 'value complex',
            value_complex = SimpleUploadedFile('test2.mp4', '<video data>'),
        )

        self.invalid_test_observation_2 = Observation.objects.create(
            node = '2',
            concept = self.valid_test_concept,
            encounter = self.test_encounter,
            value_text = 'value complex',
        )

    def tearDown(self):
        os.remove(os.path.join(settings.MEDIA_ROOT, self.invalid_test_observation_1.value_complex.name))
        os.remove(os.path.join(settings.MEDIA_ROOT, self.valid_test_observation.value_complex.name))

        self.invalid_test_observation_2.delete()
        self.invalid_test_observation_1.delete()
        self.invalid_test_concept.delete()
        self.valid_test_observation.delete()
        self.valid_test_concept.delete()
        delete_test_encounter(self.test_encounter)

    def test_video_resource_initialization(self):
        with self.assertRaises(ObjectDoesNotExist):
            VideoResource('invalidUUID')
        with self.assertRaises(StandardError):
            VideoResource(self.invalid_test_observation_1.uuid)
        with self.assertRaises(StandardError):
            VideoResource(self.invalid_test_observation_2.uuid)

        test_video_resource = VideoResource(self.valid_test_observation.uuid)

        self.assertIsInstance(test_video_resource, VideoResource, 'Instance created is not a VideoResource.')
