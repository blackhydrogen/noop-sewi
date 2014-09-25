import json
from django.http import HttpResponse, HttpResponseServerError, HttpResponseNotFound, HttpResponseForbidden
from django.shortcuts import render
from resource import ImageResource

import logging

logger = logging.getLogger('mds.sewi')

# Create your views here.
def main_page(request):
    return render(request, 'sewi/index.html')

def test_page(request):
    return render(request, 'sewi/testRunner.html')

def get_image(request, image_id):
    logger.info("Retrieving Image ID: " + image_id)
    image_resource = ImageResource("some-udid-here")
    data = json.dumps(image_resource.get_info())
    return HttpResponse(data, mimetype='application/json')
