import urllib.request
import re

url = "https://www.flickr.com/search/?text=woman+bob+haircut+portrait"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    images = re.findall(r'src="(https://live.staticflickr.com/[^"]+\.jpg)"', html)
    for img in images[:5]:
        print(img)
except Exception as e:
    print(e)
