from . import BaseResource
from mds.core.models import Observation, Concept
import logging
logger = logging.getLogger('mds.sewi')


class AudioResource(BaseResource):
    """A representation of a audio Resource.
    """

    __ERROR_RESOURCE_NOT_AUDIO = 'Resource is not a audio.'
    __AUDIO_TYPE_STRING = 'audio'

    def __init__(self, resource_id):
        #self.__observation = Observation.objects.get(uuid=resource_id)
        
        #self.__concept = self.__observation.concept
        #if not self.is_audio_concept(self.__concept):
        #    raise ValueError(self.__ERROR_RESOURCE_NOT_AUDIO)
        #logger.debug('Audio observation successfully retrieved: %s' % resource_id)

        #self.__url = self.__observation.value_complex.url
        #self.__mimetype = self.__concept.mimetype
        self.peaks = []
        pass

    @classmethod
    def is_audio_concept(cls, concept):
        return cls.__AUDIO_TYPE_STRING in concept.mimetype

    def get_info(self):
        return {
            'url': self.get_content(),
            'type': self.get_type(),
        }

    def get_content(self):
        #return self.__url;
        return "content"

    def get_type(self):
        #return self.__mimetype
        return "type"

    def generate_thumbnail(self):
        # TODO: Generate a thumbnail
        return '/'
    
