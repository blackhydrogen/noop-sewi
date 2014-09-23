from django.conf.urls import patterns, url
from . import views

urlpatterns = patterns(
  'sewi.views',
  url(r'^$', views.main_page, name='main_page'),
  # Encounter
  # TODO: Uncomment the following to retrieve the encounter with the ID
  #url(r'^encounter/(?P<encounter_id>\w+)/?$', views.get_encounter, name='get_encounter')
  #url(r'^encounter/(?P<encounter_id>\w+)/resourceList?$', views.get_encounter_resources, name='get_encounter_resources')
  #url(r'^encounter/(?P<encounter_id>\w+)/basicInfo?$', views.get_encounter_info, name='get_encounter_info')
  # Images
  url(r'^resources/image/(?P<image_id>\S+)/?$', views.get_image, name='get_image'),
  #url(r'^resources/image/(?P<image_id>\w+)/thumb$', views.get_image_thumbnail, name='get_image_thumbnail'),
  # Videos
  #url(r'^resources/video/(?P<video_id>\w+)/?$', views.get_video, name='get_video'),
  #url(r'^resources/video/(?P<video_id>\w+)/thumb$', views.get_video_thumbnail, name='get_video_thumb'),
  # Audio
  #url(r'^resources/audio/(?P<audio_id>\w+)/?$', views.get_audio, name='get_audio'),
  #url(r'^resources/audio/(?P<audio_id>\w+)/thumb$', views.get_audio_thumbnail, name='get_audio_thumb'),
  # Graph Plots
  #url(r'^resources/graph/(?P<graph_id>\w+)/?$', views.get_graph_plot, name='get_graph_plot'),
  #url(r'^resources/graph/(?P<graph_id>\w+)/thumb$', views.get_graph_plot_thumbnail, name='get_graph_plot_thumb'),
)
