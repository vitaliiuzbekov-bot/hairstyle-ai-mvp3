import urllib.request, json

url = "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=before%20after%20hair&utf8=&format=json"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
response = urllib.request.urlopen(req)
data = json.loads(response.read().decode('utf-8'))
for item in data['query']['search']:
    print(item['title'])
