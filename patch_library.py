import re

with open('src/components/HaircutList.tsx', 'r') as f:
    content = f.read()

# Replace the grid area
old_code = """                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {(results?.gender?.toLowerCase()?.includes("female") ||
                    results?.gender?.toLowerCase()?.includes("жен") ||
                    results?.gender?.toLowerCase()?.includes("дев")
                      ? FEMALE_LIBRARY
                      : MALE_LIBRARY
                    ).map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setTryOnStyle({
                            name: item.name,
                            description: item.description,
                            stylingTips: item.stylingTips,
                            imageKeyword: "",
                            customImageUrl: item.customImageUrl,
                          });
                          setIsLibraryOpen(false);
                        }}
                        className={`relative rounded-xl overflow-hidden aspect-[3/4] group text-left border transition-transform hover:scale-105 shadow-sm ${isLightMode ? "border-gray-200 bg-gray-100" : "border-white/10 bg-white/10"}`}
                      >
                        <img
                          src={item.customImageUrl || undefined}
                          alt={item.name}
                          loading={idx < 4 ? undefined : "lazy"}
                          fetchPriority={idx < 4 ? "high" : "auto"}
                          className="absolute inset-0 w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 flex flex-col justify-end">
                          <span className="text-white text-xs font-medium leading-tight shadow-sm drop-shadow-md">
                            {item.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>"""

new_code = """                  <div className="flex overflow-x-auto gap-2 pb-4 mb-2 custom-scrollbar">
                    {(Object.keys(CATEGORY_LABELS) as HaircutCategory[]).map(cat => (
                       <button 
                         key={cat}
                         onClick={() => setActiveCategory(cat)}
                         className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? (isLightMode ? "bg-indigo-600 text-white" : "bg-indigo-500 text-white") : (isLightMode ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-white/10 text-white/70 hover:bg-white/20")}`}
                       >
                         {CATEGORY_LABELS[cat]}
                       </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                    {(results?.gender?.toLowerCase()?.includes("female") ||
                    results?.gender?.toLowerCase()?.includes("жен") ||
                    results?.gender?.toLowerCase()?.includes("дев")
                      ? FEMALE_LIBRARY
                      : MALE_LIBRARY
                    ).filter(item => item.category === activeCategory).map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setTryOnStyle({
                            name: item.name,
                            description: item.description,
                            stylingTips: item.stylingTips,
                            imageKeyword: "",
                            customImageUrl: item.customImageUrl,
                          });
                          setIsLibraryOpen(false);
                        }}
                        className={`relative rounded-xl overflow-hidden aspect-[3/4] group text-left border transition-transform hover:scale-105 shadow-sm ${isLightMode ? "border-gray-200 bg-gray-100" : "border-white/10 bg-white/10"}`}
                      >
                        <img
                          src={item.customImageUrl || undefined}
                          alt={item.name}
                          loading={idx < 4 ? undefined : "lazy"}
                          fetchPriority={idx < 4 ? "high" : "auto"}
                          className="absolute inset-0 w-full h-full object-cover rounded-xl"
                        />
                        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 flex flex-col justify-end">
                          <span className="text-white text-sm font-semibold leading-tight shadow-sm drop-shadow-md">
                            {item.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>"""

if old_code in content:
    content = content.replace(old_code, new_code)
    with open('src/components/HaircutList.tsx', 'w') as f:
        f.write(content)
    print("Success")
else:
    print("Failed to find old code")
