import urllib.request
import re

url = "https://html.duckduckgo.com/html/?q=woman+haircut+portrait+centered+unsplash"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    images = re.findall(r'src="([^"]+)"', html)
    print([img for img in images if 'duckduckgo' in img])
except Exception as e:
    print(e)
