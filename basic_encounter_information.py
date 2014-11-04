import json
from alphanum import alphanum
from mds.core.models import Encounter, Observation

import logging
logger = logging.getLogger('mds.sewi')

class BasicEncounterInformation():
    """A representation of a the basic encounter information.
    """

    def __init__(self, encounter_id):
        self.__encounter_id = encounter_id

    def get_content(self):
        encounter = Encounter.objects.get(uuid=self.__encounter_id)

        content = [
            [
                ["header", "Encounter Details"]
            ],
            [
                ["header", "Patient Personal Particulars"]
            ],
            [
                ["header", "Patient Visit Q&A Responses"]
            ]
        ]

        # Encounter Details
        content[0].append(["Encounter Type", encounter.concept.display_name])
        content[0].append(["Procedure", encounter.procedure.title])
        content[0].append(["Procedure Description", encounter.procedure.description])
        content[0].append(["Procedure Author", encounter.procedure.author])
        content[0].append(["Procedure Version", encounter.procedure.version])
        content[0].append(["Observed By", encounter.observer.user.last_name + ", " + encounter.observer.user.first_name])
        content[0].append(["Last Updated", encounter.modified.strftime("%d %b %Y, %I:%M%p")]) #DD MMM YYYY, HH:MM<AM/PM>

        # Patient Personal Particulars
        encounterSubject = encounter.subject

        content[1].append(["ID", encounterSubject.system_id])
        content[1].append(["Family Name", encounterSubject.family_name])
        content[1].append(["Given Name", encounterSubject.given_name])
        content[1].append(["Date of Birth", encounterSubject.dob.strftime("%d %b %Y")]) #DD MMM YYYY
        content[1].append(["Gender", encounterSubject.gender])
        content[1].append(["Location", encounterSubject.location.name])

        # Patient Visit Q&A Responses (i.e. Non-complex observations tied to the encounter)
        encounterObservations = list(Observation.objects.filter(encounter=self.__encounter_id))
        encounterObservations.sort(key=lambda observation: observation.node, cmp=alphanum)

        for observation in encounterObservations:
            if not bool(observation.value_complex):
                content[2].append(
                    [
                        observation.concept.display_name,
                        observation.value_text
                    ]
                )
        return content