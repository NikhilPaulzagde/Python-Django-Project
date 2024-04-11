from django.urls import path
from . import views
   

urlpatterns = [
    path('', views.index, name='index'),
    path('update_balance/', views.update_balance, name='update_balance'),
    path('bet_History/', views.bet_History, name='bet_History'),
    path('place_bet/', views.place_bet, name='place_bet'),  # Add this line for the new URL pattern
    path('add_bet_result/', views.add_bet_result, name='add_bet_result'),
    path('fetch_history/', views.fetch_history, name='fetch_history'),
    path('generate_pdf/',views.generate_pdf, name='generate_pdf'),


]
