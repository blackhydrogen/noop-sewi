
import json
from alphanum import alphanum
from mds.core.models import Encounter, Observation, Concept
from resource import ImageResource, VideoResource, AudioResource

class ResourceGallery():
    """A representation of all resources associated with an encounter
    """

    def __init__(self, encounter_id):
        self.__encounter_id = encounter_id

    def get_info(self):
        encounterObservations = list(Observation.objects.filter(encounter=self.__encounter_id))
        encounterObservations.sort(key=lambda observation: observation.node, cmp=alphanum)

        content = []
        
        for observation in encounterObservations:
            if bool(observation.value_complex):
                content.append(
                    {
                        'name': observation.concept.name,
                        'type': observation.concept.mimetype,
                        'date': str(observation.concept.modified.day) +'/' + str(observation.concept.modified.month) + '/' + str(observation.concept.modified.year),
                        'id': observation.uuid
                        
                    }
                )
        return content
        

    def get_content(self):
        # TODO: return image data
        pass

    def get_type(self):
        return "image"

    def generate_thumbnail(self):
        # TODO: Generate thumbnail and return binary
        pass
