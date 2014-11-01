import json
from django.templatetags.static import static
from django.http import HttpResponse, HttpResponseServerError, HttpResponseNotFound, HttpResponseForbidden
from django.shortcuts import render
from resource import ImageResource, VideoResource, AudioResource

import logging

logger = logging.getLogger('mds.sewi')

def is_valid_encounter(encounter_id):
    return True

# Create your views here.
def main_page(request):
    return render(request, 'sewi/index.html')

def test_page(request):
    return render(request, 'sewi/testRunner.html')

def get_encounter(request, encounter_id):
    if is_valid_encounter(encounter_id):
        return render(request, 'sewi/index.html', {
            "encounter_id": encounter_id
        })

def get_image(request, image_id):
    logger.info("Retrieving Image ID: " + image_id)
    image_resource = ImageResource("some-udid-here")
    data = json.dumps(image_resource.get_info())
    return HttpResponse(data, mimetype='application/json')

def get_video(request, video_id):
    logger.info('Retrieving Video ID: ' + video_id)
    video_resource = VideoResource(video_id)
    data = json.dumps(video_resource.get_info())
    return HttpResponse(data, mimetype='application/json')

def get_video_thumbnail(request, video_id):
    pass

def get_audio(request, audio_id):
    logger.info('Retrieving Audio ID: ' + audio_id)
    audio_resource = AudioResource(audio_id)
    data = json.dumps(audio_resource.get_info())
    return HttpResponse(data, mimetype='application/json')
