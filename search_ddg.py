import urllib.request
import json
import re

url = "https://duckduckgo.com/?q=before+and+after+haircut+woman+portrait+split+screen&t=h_&iax=images&ia=images"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    vqd_match = re.search(r'vqd=([\d-]+)', html)
    if vqd_match:
        vqd = vqd_match.group(1)
        search_url = f"https://duckduckgo.com/i.js?q=before+and+after+haircut+woman+portrait+split+screen&o=json&vqd={vqd}"
        req2 = urllib.request.Request(search_url, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req2).read().decode('utf-8')
        data = json.loads(res)
        for res in data.get('results', [])[:5]:
            print(res.get('image'))
    else:
        print("No vqd found")
except Exception as e:
    print(e)
