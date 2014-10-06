from . import BaseResource

class VideoResource(BaseResource):
    """A representation of a video Resource.
    """

    def __init__(self, resource_id):
        # TODO: Load resource from ID
        pass

    def get_info(self):
        return {
            'path': '/static/sewi/video/video.mp4',
            'type': 'video/webm'
        }

    def get_content(self):
        # TODO: return image data
        pass

    def get_type(self):
        return 'video/webm'

    def generate_thumbnail(self):
        return '/'
