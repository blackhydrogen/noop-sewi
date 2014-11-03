
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
        resource_type = ''
        
        for observation in encounterObservations:
            if(AudioResource.is_valid_observation(observation)):
                resource_type = 'audio'
            elif(VideoResource.is_valid_observation(observation)):
                resource_type = 'video'
            elif(ImageResource.is_valid_observation(observation)):
                resource_type = 'image'
            #elif(ChartResource.is_valid_observation(observation)):
                #resource_type = 'chart'

            if bool(observation.value_complex):
                content.append(
                    {
                        'name': observation.concept.name,
                        'type': resource_type,
                        'date': str(observation.modified.day) +'/' + str(observation.modified.month) + '/' + str(observation.modified.year),
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
