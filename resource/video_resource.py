from . import BaseResource
from mds.core.models import Observation, Concept

import logging
logger = logging.getLogger('mds.sewi')

class VideoResource(BaseResource):
    """A representation of a video Resource.
    """

    __ERROR_RESOURCE_NOT_VIDEO = 'Resource is not a video.'
    __VIDEO_TYPE_STRING = 'video'

    def __init__(self, resource_id):
        self.__observation = Observation.objects.get(uuid=resource_id)

        self.__concept = Concept.objects.get(uuid=self.__observation.concept.uuid)
        if not self.is_video_concept(self.__concept):
            raise ValueError(self.__ERROR_RESOURCE_NOT_VIDEO)
        logger.debug('Video observation successfully retrieved: %s' % resource_id)

        self.__url = self.__observation.value_complex.url
        self.__mimetype = self.__observation.value_text

    @classmethod
    def is_video_concept(cls, concept):
        return cls.__VIDEO_TYPE_STRING in concept.mimetype

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
        # TODO: Generate a thumbnail
        return '/'
