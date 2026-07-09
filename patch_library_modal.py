import sys

with open("src/components/HaircutLibraryModal.tsx", "r") as f:
    content = f.read()

target = """              onClick={() => {
                if (onSelectStyle) {
                  onSelectStyle({
                    name: item.name,
                    description: item.description,
                    stylingTips: item.stylingTips,
                    imageKeyword: "",
                    customImageUrl: "",
                  });
                }
              }}"""

replacement = """              onClick={() => {
                const styleData = {
                  name: item.name,
                  description: item.description,
                  stylingTips: item.stylingTips,
                  imageKeyword: "",
                  customImageUrl: "",
                };
                if (onSelectStyle) {
                  onSelectStyle(styleData);
                } else {
                  window.dispatchEvent(new CustomEvent('select-style', { detail: styleData }));
                }
                onClose();
              }}"""

class_target = """${onSelectStyle ? 'hover:scale-105 cursor-pointer' : ''}"""
class_replacement = """hover:scale-105 cursor-pointer"""

if target in content:
    content = content.replace(target, replacement)
    content = content.replace(class_target, class_replacement)
    with open("src/components/HaircutLibraryModal.tsx", "w") as f:
        f.write(content)
    print("Fixed")
else:
    print("target not found")
