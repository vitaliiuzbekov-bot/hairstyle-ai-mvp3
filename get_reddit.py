import urllib.request, json
url = "https://www.reddit.com/r/femalehairadvice/search.json?q=before+after&restrict_sr=on&sort=top&t=all"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'})
try:
    response = urllib.request.urlopen(req)
    data = json.loads(response.read().decode('utf-8'))
    for child in data['data']['children']:
        post = child['data']
        if 'url' in post and post['url'].endswith('.jpg'):
            print(post['url'])
except Exception as e:
    print(e)
