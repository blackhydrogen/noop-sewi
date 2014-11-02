
import json
from alphanum import alphanum
from mds.core.models import Encounter, Observation, Concept


class ResourceGallery():
    """A representation of all resources associated with an encounter
    """

    def __init__(self, resource_id):
        self.__resource_id = resource_id

    def get_info(self):
        encounterObservations = list(Observation.objects.filter(encounter=self.__resource_id))
        encounterObservations.sort(key=lambda observation: observation.node, cmp=alphanum)

        content = []
        
        for observation in encounterObservations:
            if bool(observation.value_complex):
                content.append(
                    [
                        observation.value_complex.url,
                        observation.concept.name,
                        observation.concept.mimetype,
                        observation.concept.modified.year,
                        observation.concept.modified.month,
                        observation.concept.modified.day,
                        observation.uuid
                        
                    ]
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
