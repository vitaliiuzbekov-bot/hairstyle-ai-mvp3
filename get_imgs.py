import urllib.request, re

url = "https://www.latest-hairstyles.com/trends/before-and-after.html"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    response = urllib.request.urlopen(req)
    html = response.read().decode('utf-8')
    imgs = re.findall(r'src="(https://[^"]+\.jpg)"', html)
    for img in set(imgs):
        if 'before' in img.lower() or 'after' in img.lower():
            print(img)
except Exception as e:
    print(e)
