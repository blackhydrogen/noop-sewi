from . import BaseResource
from mds.core.models import Observation, Concept
from django.conf import settings
import Image, StringIO, base64

import logging
logger = logging.getLogger('mds.sewi')

class ImageResource(BaseResource):
    """A representation of an image resource.
    """

    __ERROR_RESOURCE_NOT_IMAGE = 'Resource is not an image.'
    __IMAGE_TYPE_STRING = 'image'

    def __init__(self, resource_id):
        self.__observation = Observation.objects.get(uuid=resource_id)

        if not self.is_valid_observation(self.__observation):
            raise ValueError(self.__ERROR_RESOURCE_NOT_IMAGE)

        self.__concept = self.__observation.concept    
        logger.debug('Image resource successfully retrieved: %s' % resource_id)

        self.__url = self.__observation.value_complex.url
        self.__mimetype = self.__concept.mimetype

    @classmethod
    def is_valid_observation(cls, observation):
        return cls.__IMAGE_TYPE_STRING in observation.concept.mimetype

    def get_info(self):
        return {
            'url': self.get_content(),
            'type': self.get_type()
        }

    def get_content(self):
        return self.__url;

    def get_type(self):
        return self.__mimetype

    def generate_thumbnail(self):
        binaryData = StringIO.StringIO()

        image = Image.open(settings.MEDIA_ROOT + self.__observation.value_complex.name)
        image.thumbnail((90, 90), Image.ANTIALIAS)
        image.convert("RGB").save(binaryData, "JPEG")

        base64Data = base64.b64encode(binaryData.getvalue())

        thumbnailUrl = "data:image/jpeg;base64," + base64Data

        return thumbnailUrl
