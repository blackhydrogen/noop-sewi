from . import BaseResource
from mds.core.models import Observation

class VideoResource(BaseResource):
    """A representation of a video Resource.
    """

    def __init__(self, resource_id):
        self.__observation = Observation.objects.get(uuid=resource_id)
        if not self.__observation:
            raise ValueError('Resource does not exist.')
        self.__concept = Concept.objects.get(uuid=__observation.concept)
        if not self.__is_video_concept(self.__concept):
            raise ValueError('Resource is not a video.')
        self.__path = observation.value_complex.url()
        self.__mimetype = self.__concept.mimetype

    @staticmethod
    def __is_video_concept(concept):
        return concept.datatype == 'video'

    def get_info(self):
        return {
            'path': self.get_content(),
            'type': self.get_type()
        }

    def get_content(self):
        return self.__path;

    def get_type(self):
        return self.__mimetype

    def generate_thumbnail(self):
        # TODO: Generate a thumbnail
        return '/'
