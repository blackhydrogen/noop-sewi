from mds.core.models import Encounter, Observation, Concept

import logging
logger = logging.getLogger('mds.sewi')

class BasicEncounterInformation():
    """A representation of a the basic encounter information.
    """

    def __init__(self, resource_id):
        self.__resource_id = resource_id

    def get_content(self):
        encounterObservation = Observation.objects.filter(encounter=self.__resource_id)
        logger.info(len(encounterObservation))
        return ""
