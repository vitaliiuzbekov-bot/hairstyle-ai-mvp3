import urllib.request
import json
import urllib.parse

def search(query):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        data = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
        for item in data['query']['search']:
            title = item['title']
            if title.lower().endswith('.jpg'):
                print(title)
                return title
    except Exception as e:
        print(e)
    return None

def get_url(title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        data = json.loads(urllib.request.urlopen(req).read().decode('utf-8'))
        pages = data['query']['pages']
        for page_id in pages:
            print(pages[page_id]['imageinfo'][0]['url'])
    except Exception as e:
        print(e)

t1 = search("woman long hair portrait")
if t1: get_url(t1)
t2 = search("woman short hair portrait")
if t2: get_url(t2)
