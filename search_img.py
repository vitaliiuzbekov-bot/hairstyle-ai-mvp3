import urllib.request
import json
url = "https://html.duckduckgo.com/html/?q=before+after+haircut+woman+portrait+centered+unsplash"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    import re
    urls = re.findall(r'src="([^"]+)"', html)
    print(urls[:5])
except Exception as e:
    print(e)
