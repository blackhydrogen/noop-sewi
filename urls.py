from django.conf.urls import patterns, url
from . import views

urlpatterns = patterns(
  'sewi.views',
  url(r'^$', views.main_page, name='main_page'),
)
