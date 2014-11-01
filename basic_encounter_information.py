import json
from alphanum import alphanum
from mds.core.models import Encounter, Observation, Concept

import logging
logger = logging.getLogger('mds.sewi')

class BasicEncounterInformation():
	"""A representation of a the basic encounter information.
	"""

	def __init__(self, resource_id):
		self.__resource_id = resource_id

	def get_content(self):
		encounterObservations = list(Observation.objects.filter(encounter=self.__resource_id))
		encounterObservations.sort(key=lambda observation: observation.node, cmp=alphanum)

		content = [
			[
				["header", "Patient Visit Q&A Responses"]
			]
		]
		for observation in encounterObservations:
			if not bool(observation.value_complex):
				content[0].append(
					[
						observation.concept.display_name,
						observation.value_text
					]
				)
		return content