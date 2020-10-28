from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('new_game', views.new_game),
    path('how_to_play', views.how_to_play),
    path('medium', views.medium),
    path('hard', views.hard),

    
]
