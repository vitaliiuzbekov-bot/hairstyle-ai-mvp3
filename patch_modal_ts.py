with open("src/components/HaircutLibraryModal.tsx", "r") as f:
    content = f.read()

old_style = '''                const styleData = {
                  name: item.name,
                  description: item.description,
                  stylingTips: item.stylingTips,
                  imageKeyword: "",
                  customImageUrl: "",
                };'''

new_style = '''                const styleData = {
                  name: item.name,
                  description: item.description,
                  stylingTips: (item as any).stylingTips || "",
                  imageKeyword: (item as any).imageKeyword || "",
                  customImageUrl: (item as any).imageUrl || "",
                };'''

content = content.replace(old_style, new_style)

# Also fix the imageUrl in LazyImage rendering block
content = content.replace('{item.imageUrl ? (', '{(item as any).imageUrl ? (')
content = content.replace('src={item.imageUrl}', 'src={(item as any).imageUrl}')

with open("src/components/HaircutLibraryModal.tsx", "w") as f:
    f.write(content)
