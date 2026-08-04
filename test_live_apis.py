import urllib.request
import json

def fetch_live_data():
  print("--- TESTING LIVE APIS ---")
  
  # 1. CBR Currency API
  try:
    req = urllib.request.urlopen("https://www.cbr-xml-daily.ru/daily_json.js")
    cbr_data = json.loads(req.read().decode())
    usd = cbr_data['Valute']['USD']['Value']
    eur = cbr_data['Valute']['EUR']['Value']
    print(f"CBR LIVE -> USD: {usd:.2f} RUB, EUR: {eur:.2f} RUB")
  except Exception as e:
    print("CBR Error:", e)

  # 2. Weather Open-Meteo Today
  try:
    req = urllib.request.urlopen("https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6173&current_weather=true")
    w_data = json.loads(req.read().decode())
    print("WEATHER LIVE ->", w_data['current_weather']['temperature'], "°C")
  except Exception as e:
    print("Weather Today Error:", e)

  # 3. Weather Open-Meteo 2007 Archive
  try:
    req = urllib.request.urlopen("https://archive-api.open-meteo.com/v1/archive?latitude=55.7558&longitude=37.6173&start_date=2007-08-04&end_date=2007-08-04&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe%2FMoscow")
    w_2007 = json.loads(req.read().decode())
    print("WEATHER 2007 ->", w_2007['daily']['temperature_2m_max'][0], "°C")
  except Exception as e:
    print("Weather 2007 Error:", e)

fetch_live_data()
