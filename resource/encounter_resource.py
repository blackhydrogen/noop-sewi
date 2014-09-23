from . import BaseResource

class EncounterResource(BaseResource):
    """A representation of an encounter.
    """

    def get_info(self):
        return {
            "patientName": "Robin Williams",
            "encounterNo": 234,
            "type": "encounter"
        }

    def get_content(self):
        # TODO: Return list of resources
        pass

    def get_type(self):
        return "encounter"

    # Encounters don't have thumbnails
    def generate_thumbnail(self):
        pass
