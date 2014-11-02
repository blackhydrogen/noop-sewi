from . import BaseResource
from mds.core.models import Observation, Concept

import logging
logger = logging.getLogger('mds.sewi')

class AudioResource(BaseResource):
    """A representation of a audio Resource.
    """

    __ERROR_RESOURCE_NOT_AUDIO = 'Resource is not a audio.'
    __AUDIO_TYPE_STRING = 'audio'
    __AUDIO_ICON_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAABmJLR0QA/wD/AP+gvaeTAAAGeElEQVR4nO2dW6gVVRjHf5qlHjVUsCIlLexCgQVd3jJ6qpfudUzSThHVQ0ZBKgS95GOlUE/1Vr34FEYEGd0vEIQcSRGlh9KozNAjeanM0h5GOWfvs/d8a2atNbP2zP8H62nt/X3/9e3/nr1nZq01IIQQQgghhBBCiLYwJWCsWcBTwEpgMTAvYOwUOXCm7QO2AluA/bUqqpFFwE7gdIvbf8AnwHLPWg4cs4Bd1P8BpNS2Alf7FHWQWEv9BU+xHQUe9KjrwDBK/cVOub1YvrSDwXHqL3LqbVPp6g4AdRd3UNqGsgVOnboLO0htY8kaJ4016EHHGt8HwCmH151tjftP0HYDAFxLsesgjTKBDJAxBHzq8PrG/RzIAOMUNcEr8eXHRwbopHUmkAEm0yoTyAC9GSK7OdR4E8gA/WmFCWSAfIqa4OWw8uMjA9g02gQygBuNNYEM4E4jTSADFKOoCV7ykx8fGaA4jTKBDFCOIeBjh/jJm0AGKM8c4GuHHGfb8575oiAD+FH0SDASIGdQZAB/5gBfOeQ6DRwBrgqUNwgyQBiKHAk+CpjXGxkgHENkH66LCW4NnLs0MkBYZuP2c/BhhNylkAHCMxt7wc2/wAWR8hdCBojDNWQLTvNyPxExvzMyQDy2Grm3+CaY5htA1Gryy3wDTA2hQtTGYt8AIXYIsb4BIXchqYNjZHsgpIpXfXUEsNldt4CYyAA2m+sWkDpNPwuYAWzH7epcHa12khcYgJQ3waqd5AUGYhawnuxo8Df1f/BB6quzgPSJWl/9CWw5MkDLkQFajgzQcmSAliMDtBwZwI/pwHXAElp8utuWC0HdPA0cZnyc24EbI+RJvr7JC4zAs/Qe62FgaeBcydc3eYGBmQYcpP94t5H9NIQi+fomLzAwS7HH/FrAfMnXN0WB04FzIsVeiD3mU8AtgfKlWN8OUhO4imz93BiwIlKOb7DHvYcwPwWp1XcSKQkcoXMu/W+R8iwD/sIe+wsBcqVU356kInA1vRdSxOLxHrm622FgrmeeVOrblxQEPkS2VKrq/O/0yTmx+T4pJIX65lK3wJX0//Bd8w+T/a6PATuAdcB5Du9bSPZ/wzoK+Ewrr7u+JnUKXEH+h++Sf32f972P28qpdUb+08BjrgPqgQzQh2HgpGf+C8mf3/e6g46ZwC+Ghm/dhzUJGaAH9+P24Vv573N4/7CDnmcc4lzuOrguZIAu7gX+ccjrkn/Y4f2HgAVGnLnYz098zn2IHcgAE7ibYh++lf9ix3hvOGh704jxhdMIJyMDnOFO4IRDvqL5NzjEOAlcasS5w4hxgnJXBhtvgHuAHx3ilG0WU8me/WfFedWIM5NsJXFejJsc9HTTeAPsd4gR0wAA84GfjDi/Y58WfmbEWOOoZyJRDZDClLCL6hZAdgHIumK3ALjZeI11unels6KKSMEAqfAW2VEgj+VG/w6jf4mzmoqQAcY5CbxrvOYGo3+f0b/EWU1FyACdWJsvWpsyWUeQ+QW0VIIM0Mn3Rr/1f+Wo0T9UQEslyACdWBNIZhv9x4z+5DabkgHCMnCLQ2SATqxDvPUNtw7xxwtoqQQZoJMrjH7rJ+J8o//PAloqQQbo5Daj/wej/xKjf6yAlkqQAcY5l+xuYx7bjP7FRv9eZzUVIQOMM4L9Df7S6F9m9O91VjNA+N6s+NUhhm4GNfhu4F3ENYGFbgd7UpXAVdgzgMvk14QQT6oUWMYEeWhKWACqFriaYibIw2VS6EE0KTSXOgQWMUEeLtPCrVND0LTwWgQ+jP1ULSu/tTBko4MOLQwxWkxcTGDRb2nXe7htMqGlYUaLzQj5JnDhduBzsnP9UWAtbusCtTiUNAQ+Qn8TxETLw0lH4AP0Xi8YizU9cnW3Q9h3CC1SqW9fUhL4KJ1HggOR8miLmAmkJnAF2XX9Q2iTqEpIXmBgtE1cF8kLDIw2iuwieYGB0VaxXSQvMAJP0nusY2iz6PQERmKYzpXN3wHXR8gTtb56bqAfU8j+FAL8HClH1PrKAOkTtb6aFNpyZICWIwO0HBmg5cgALUcGaDkus158afLFoIFHR4CWE8IAyW160CKsDStMQhhgd4AYohy7fAOEMMDmADFEOZKo/QyyBydbd63UwrZRws478GIRsJP6i9KWtoPxu5BehHq86hHgbeAPsoWU86jmFLNNnCD7km0im5CS3H5DQgghhBBCCCGESJv/AWgZ/SpAqcQtAAAAAElFTkSuQmCC';

    def __init__(self, resource_id):
        self.__observation = Observation.objects.get(uuid=resource_id)
        
        if not self.is_valid_observation(self.__observation):
            raise ValueError(self.__ERROR_RESOURCE_NOT_AUDIO)

        self.__concept = self.__observation.concept
        logger.debug('Audio observation successfully retrieved: %s' % resource_id)

        self.__url = self.__observation.value_complex.url
        self.__mimetype = self.__concept.mimetype

    @classmethod
    def is_valid_observation(cls, observation):
        return cls.__AUDIO_TYPE_STRING in observation.concept.mimetype

    def get_info(self):
        return {
            'url': self.get_content(),
            'type': self.get_type(),
        }

    def get_content(self):
        return self.__url;

    def get_type(self):
        return self.__mimetype

    def generate_thumbnail(self):
        return self.__AUDIO_ICON_BASE64
