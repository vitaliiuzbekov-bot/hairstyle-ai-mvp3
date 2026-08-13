import re

with open("src/components/HaircutLibraryModal.tsx", "r") as f:
    content = f.read()

old_filter = '{library.filter(item => item.category === activeCategory).map((item, idx) => ('
new_filter = '''{library.filter(item => item.category === activeCategory).length === 0 ? (
            <div className={`col-span-2 py-10 text-center text-sm ${isLightMode ? "text-gray-500" : "text-gray-400"}`}>
              {isLoadingCommunity ? "Загрузка..." : "Пока нет сгенерированных стрижек."}
            </div>
          ) : library.filter(item => item.category === activeCategory).map((item, idx) => ('''

content = content.replace(old_filter, new_filter)

with open("src/components/HaircutLibraryModal.tsx", "w") as f:
    f.write(content)
