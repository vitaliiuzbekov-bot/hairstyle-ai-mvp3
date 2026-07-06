import urllib.request
import re

url = "https://www.pexels.com/search/woman%20short%20hair/"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    images = re.findall(r'src="(https://images.pexels.com/photos/\d+/[^"]+)"', html)
    for img in images[:3]:
        print(img)
except Exception as e:
    print(e)
