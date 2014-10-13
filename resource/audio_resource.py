import os, sys, pygst
pygst.require('0.10')
from . import BaseResource
from mds.core.models import Observation, Concept
import gst, gobject
import logging
logger = logging.getLogger('mds.sewi')


class AudioResource(BaseResource):
    """A representation of a audio Resource.
    """

    __ERROR_RESOURCE_NOT_AUDIO = 'Resource is not a audio.'
    __AUDIO_TYPE_STRING = 'audio'

    def __init__(self, resource_id):
        #self.__observation = Observation.objects.get(uuid=resource_id)
        
        #self.__concept = self.__observation.concept
        #if not self.is_audio_concept(self.__concept):
        #    raise ValueError(self.__ERROR_RESOURCE_NOT_AUDIO)
        #logger.debug('Audio observation successfully retrieved: %s' % resource_id)

        #self.__url = self.__observation.value_complex.url
        #self.__mimetype = self.__concept.mimetype
		self.peaks = []
        pass

    @classmethod
    def is_audio_concept(cls, concept):
        return cls.__AUDIO_TYPE_STRING in concept.mimetype

    def get_info(self):
        return {
            'url': self.get_content(),
            'type': self.get_type(),
			'amplitude': self.generate_amplitude()
        }

    def get_content(self):
       	#return self.__url;
		return "content"

    def get_type(self):
		#return self.__mimetype
		return "type"

    def generate_thumbnail(self):
        # TODO: Generate a thumbnail
        return '/'
	
    def generate_amplitude(self):
		
		return "amplitude"

	def get_peaks(self, file_name):
        pipeline_txt = (
		        'filesrc location="%s" ! decodebin ! audioconvert ! '
                'audio/x-raw-int,channels=1,rate=44100,endianness=1234,'
                'width=32,depth=32,signed=(bool)True ! level name=level interval=40000000 ! fakesink' % filename)
		pipeline = gst.parse_launch(pipeline_txt)
        level = pipeline.get_by_name('level')
        bus = pipeline.get_bus()
        bus.add_signal_watch()
        bus.connect('message', self.show_peak, self);

    def show_peak(self, bus, message):
        stop = False
        if message.type == gst.MESSAGE_EOS:
            pipeline.set_state(gst.STATE_NULL)
            stop = True
        elif message.src is level and message.structure.has_key('peak')
            self.peaks.append(message.structure['peak'][0]);

        return stop
