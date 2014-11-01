from . import BaseResource
from mds.core.models import Observation, Concept

import logging
logger = logging.getLogger('mds.sewi')

class ImageResource(BaseResource):
    """A representation of an image resource.
    """

    __ERROR_RESOURCE_NOT_IMAGE = 'Resource is not an image.'
    __IMAGE_TYPE_STRING = 'image'

    def __init__(self, resource_id):
        self.__observation = Observation.objects.get(uuid=resource_id)

        self.__concept = self.__observation.concept
        if not self.is_video_concept(self.__concept):
            raise ValueError(self.__ERROR_RESOURCE_NOT_IMAGE)
        logger.debug('Image resource successfully retrieved: %s' % resource_id)

        self.__url = self.__observation.value_complex.url
        self.__mimetype = self.__concept.mimetype

    @classmethod
    def is_image_concept(cls, concept):
        return cls.__IMAGE_TYPE_STRING in concept.mimetype

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

        image = Image.open(self.__url)
        image.thumbnail((100, 100), Image.ANTIALIAS)
        image.convert("RGB").save(binaryData, "JPEG")

        base64Data = base64.b64encode(binaryData.getvalue())

        thumbnailUrl = "data:image/jpeg;base64," + base64Data

        return thumbnailUrl
