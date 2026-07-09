import urllib.request
import urllib.parse
import json
import re

def search(query):
    url = f"https://duckduckgo.com/i.js?q={urllib.parse.quote(query)}&o=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        data = json.loads(html)
        for res in data.get('results', [])[:5]:
            print(res['image'])
    except Exception as e:
        print(f"Error: {e}")

search("before and after haircut woman portrait split")
