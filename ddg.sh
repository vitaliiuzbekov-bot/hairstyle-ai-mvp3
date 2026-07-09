curl -sL "https://html.duckduckgo.com/html/?q=before+after+haircut+woman+portrait+split" | grep -o 'img class="search__image" src="[^"]*"' | head -n 5
