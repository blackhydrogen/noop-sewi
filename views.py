import json
from django.templatetags.static import static
from django.http import HttpResponse, HttpResponseServerError, HttpResponseForbidden, Http404
from django.shortcuts import render, get_object_or_404
from resource import ImageResource, VideoResource, AudioResource
from basic_encounter_information import BasicEncounterInformation
from mds.core.models import Encounter

import logging

logger = logging.getLogger('mds.sewi')

# Create your views here.
def main_page(request):
    return render(request, 'sewi/index.html')

def test_page(request):
    return render(request, 'sewi/testRunner.html')

def get_encounter(request, encounter_id):
    #encounter = get_object_or_404(Encounter, uuid=encounter_id)
    # TODO: Uncomment above line to enable encounter checking
    return render(request, 'sewi/index.html', {
        "encounter_id": encounter_id
    })

def get_image(request, image_id):
    logger.info("Retrieving Image ID: " + image_id)
    image_resource = ImageResource(image_id)
    data = json.dumps(image_resource.get_info())
    return HttpResponse(data, mimetype='application/json')

def get_image_thumbnail(request, image_id):
    logger.info('Retrieving Image Thumbnail: ' + image_id)
    image_resource = ImageResource(image_id)
    thumb_data = image_resource.generate_thumbnail()
    return HttpResponse(thumb_data, mimetype='text/plain')

def get_video(request, video_id):
    logger.info('Retrieving Video ID: ' + video_id)
    video_resource = VideoResource(video_id)
    data = json.dumps(video_resource.get_info())
    return HttpResponse(data, mimetype='application/json')

def get_video_thumbnail(request, video_id):
    logger.info('Retrieving Video Thumbnail: ' + video_id)
    video_resource = VideoResource(video_id)
    thumb_data = video_resource.generate_thumbnail()
    return HttpResponse(thumb_data, mimetype='text/plain')

def get_audio(request, audio_id):
    logger.info('Retrieving Audio ID: ' + audio_id)
    audio_resource = AudioResource(audio_id)
    data = json.dumps(audio_resource.get_info())
    return HttpResponse(data, mimetype='application/json')

def get_audio_thumbnail(request, audio_id):
    logger.info('Retrieving Audio Thumbnail: ' + audio_id)
    audio_resource = AudioResource(audio_id)
    thumb_data = audio_resource.generate_thumbnail()
    return HttpResponse(thumb_data, mimetype='text/plain')

def get_encounter_info(request, encounter_id):
    logger.info('Getting Basic Encounter Information: ' + encounter_id)
    basic_encounter_info = BasicEncounterInformation(encounter_id)
    data = json.dumps(basic_encounter_info.get_content(), indent=4)
    return HttpResponse(data, mimetype='application/json')
