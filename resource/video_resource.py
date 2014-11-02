from . import BaseResource
from mds.core.models import Observation, Concept

import logging
logger = logging.getLogger('mds.sewi')

class VideoResource(BaseResource):
    """A representation of a video Resource.
    """

    __ERROR_RESOURCE_NOT_VIDEO = 'Resource is not a video.'
    __VIDEO_TYPE_STRING = 'video'
    __VIDEO_ICON_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAAFCElEQVR4nO2dPW9cRRSGH3AkIjspUkBDpEhUUQCFX4DEXwAEpiAJDZ8tQqIECYECpIjCH6BJGZQUGPHRQJ1I+ZBLRAMkEkgkjgLYJhTXqwRj7507c2bP7D3vI53Oc2b2zLP37l7PzIIQQgghhBBCCCGi8IBhriXgLeAl4BBwwDB3i1zfip+AFeAc8IvriBw5CFwB7gaOTeBb4OnCWs4dS8A1/CegpVgBjpQUdZ54G/+Ctxi3gOWCus4NF/EvdsvxXn5p54Pb+Be59TiVXd05wLu48xLv5xa4dbwLO0/xaWaNm6bvRc87fa/vS+CfhL+bxOg+E0QXAOAow56DjEoCCdCxCHyX8Pejux1IgHsMleCT+sOvjwT4L+EkkAD/J5QEEmBnFun+OTR6CSTA7oSQQAJMZ6gEH9sOvz4SoJ9RSyAB0hitBBIgnVFKIAGGMVSCk2XDr48EGM6oJJAAeSwC3yTkb14CCZDPfuCHhD4m8W5hf1WQAGUMvRIcN+jTFAlQzn7g+4S+7gI3gcNG/ZogAWwYciX42rDfYiSAHYt0k5siwTPGfWcjAWzZR9rt4KsKfWchAezZR/+Gmw3gkUr9D0IC1OFxug2n0/p+tWL/yUiAeqz09H2utIM9pQmEq+SPlSZ40GIUwo1DpQksTgjpewdYnkLiwRrdGQitUlRfXQH6WfUeQE0kQD9nvQfQOmP/FrAXuETa0zmPcKf5ARrQ8iFY7jQ/QCOWgHforgZ/4j/xJvXVt4D2qVpffQgMjgQIjgQIjgQIjgQIjgQIjgQITosCPAWcoXvydoP6D1JuAJe3+jw6g9e3DPxI99sCL86gv+pYPanaQzcJfcugasYmcJp6C2Ve2fb6fk1o0/yTVosBLgAXEnLNKs5vjcmSE+wsdx8hBDiZkGfW8dHgSuzOCXa/svUxegGOAOsJeWYd69hswTrO9NtaH6MX4LOEHF5xOqMe9/Mm/QdJ9zF6AVYTcnjF1Yx6TDhG2gfaPkYvwFpCDq+4lVEPSHvnS4DE9t4xlJfptm1Z5ZcAzjGENxj24xESIKG9d6SSM/kSIKG9d6SQO/kSIKG9d/RRMvkSIKG9d0zjdcomXwIktPeO3bCYfAmQ0N47dsJq8iVAQnvv2M5r2E2+uwAtbAxpwuIpbB//Brb/Ki6tjzaGzBjrdQKuSIDgSIDgSIDgSIDhbHoPwBIJMJwX6JaLiS2iPQcAeBb4u2L+IfVxJ6IAYCdBaX3ciSoA2EhQWh93IgsA8BxlEpTWx53oAkCZBKX1cUcCdORKUFofdyTAPXIk6EMCOMdQnmfYVrc+Ri/AGDeGHCN9b0Afoxeg5a1h1zLqMWEutoa18Ch4xXsAUygZ2+d0J4BsGI2lWUoN1fbw6Yz+FgA6IGIaIQRYoDuWxXvSJ/EFOiImGasBLgAf4ns7WAc+oN66v+2HRF1PaBNGgAlP0p0WdhW4k5C/NO7QHUl3BngiY7xDWQZ+Bn4j7Zi4qgK0sCxcTKdqfVv4GigckQDBkQDBkQDBkQDBkQDBkQDBkQDBkQDBkQDBkQDBkQDBkQDBkQDBkQDBqfXzaPfTxKoVsTO6AgTHQoDbBjlEHmulCSwEWDXIIfIo2bkE2Ahw1iCHyKOJ2u8FLuG3lDtqXAQeSpifmXCQbmm1d1GixGXg0aSZ6cFqA8RNus2QfwAPAweYzVfMSPxF9yY7RXdk/e++wxFCCCGEEEIIIcS88S9BMfEthNx8BwAAAABJRU5ErkJggg=='

    def __init__(self, resource_id):
        self.__observation = Observation.objects.get(uuid=resource_id)

        if not self.is_valid_observation(self.__observation):
            raise ValueError(self.__ERROR_RESOURCE_NOT_VIDEO)
        
        self.__concept = self.__observation.concept
        logger.debug('Video observation successfully retrieved: %s' % resource_id)

        self.__url = self.__observation.value_complex.url
        self.__mimetype = self.__concept.mimetype

    @classmethod
    def is_valid_observation(cls, observation):
        return cls.__VIDEO_TYPE_STRING in observation.concept.mimetype

    def get_info(self):
        return {
            'url': self.get_content(),
            'type': self.get_type()
        }

    def get_content(self):
        return self.__url;

    def get_type(self):
        return self.__mimetype

    def generate_thumbnail(self):
        return self.__VIDEO_ICON_BASE64
