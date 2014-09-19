from . import BaseResource

class ImageResource(BaseResource):
    """A representation of an image Resource.
    """

    def __init__(self, resource_id):
        # TODO: Load resource from ID
        pass

    def get_info(self):
        return {
            "path": "path/to/an/image.jpg",
            "type": "image"
        }

    def get_content(self):
        # TODO: return image data
        pass

    def get_type(self):
        return "image"

    def generate_thumbnail(self):
        # TODO: Generate thumbnail and return binary
        pass
