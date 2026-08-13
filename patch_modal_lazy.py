import re

with open("src/components/HaircutLibraryModal.tsx", "r") as f:
    content = f.read()

old_lazy = '''                <LazyImage
                  keyword={item.name}
                  gender={currentGender}
                  uniqueName={item.name}
                  results={null as any}
                  autoLoad={true}
                  isLightMode={isLightMode}
                  isLibrary={true}
                />'''

new_lazy = '''                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                ) : (
                  <LazyImage
                    keyword={item.name}
                    gender={currentGender}
                    uniqueName={item.name}
                    results={null as any}
                    autoLoad={true}
                    isLightMode={isLightMode}
                    isLibrary={true}
                  />
                )}'''

content = content.replace(old_lazy, new_lazy)

with open("src/components/HaircutLibraryModal.tsx", "w") as f:
    f.write(content)
