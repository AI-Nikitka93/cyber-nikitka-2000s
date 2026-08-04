import urllib.request
import json

def test_weather():
    # 1. Weather Moscow Today
    url_today = "https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6173&current_weather=true"
    req1 = urllib.request.urlopen(url_today)
    data1 = json.loads(req1.read().decode())
    print("WEATHER TODAY (MOSCOW):", data1.get("current_weather"))

    # 2. Weather Moscow August 4, 2007
    url_2007 = "https://archive-api.open-meteo.com/v1/archive?latitude=55.7558&longitude=37.6173&start_date=2007-08-04&end_date=2007-08-04&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=Europe%2FMoscow"
    req2 = urllib.request.urlopen(url_2007)
    data2 = json.loads(req2.read().decode())
    print("WEATHER AUGUST 4, 2007 (MOSCOW):", data2.get("daily"))

test_weather()
