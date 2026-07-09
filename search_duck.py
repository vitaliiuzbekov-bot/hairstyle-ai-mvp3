import urllib.request, json, re

url = "https://html.duckduckgo.com/html/?q=before+after+haircut+woman+site:pinterest.com"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
response = urllib.request.urlopen(req)
html = response.read().decode('utf-8')
links = re.findall(r'href="([^"]+)"', html)
for link in links[:20]:
    if 'url=' in link:
        print(link)
