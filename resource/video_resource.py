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

        if not self.is_valid_observation(self.__observation):
            raise ValueError(self.__ERROR_RESOURCE_NOT_VIDEO)
        
        self.__concept = self.__observation.concept
        logger.debug('Video observation successfully retrieved: %s' % resource_id)

        self.__url = self.__observation.value_complex.url
        self.__mimetype = self.__concept.mimetype

    @classmethod
    def is_valid_observation(cls, observation):
        return cls.__VIDEO_TYPE_STRING in observation.concept.mimetype

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
