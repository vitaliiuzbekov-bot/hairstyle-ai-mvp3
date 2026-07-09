import sys

with open("src/components/HaircutList.tsx", "r") as f:
    content = f.read()

start_marker = '    return (\n      <div className="w-full">'
end_marker = '        <div className="flex items-center gap-4 mb-6">'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

new_code = """    return (
      <div className="w-full">
        {cropperFileSrc && (
          <ImageCropperModal
            imageSrc={cropperFileSrc}
            isLightMode={isLightMode}
            onClose={() => setCropperFileSrc(null)}
            onCropComplete={(croppedBase64) => {
              setTryOnStyle({
                name: "Своя прическа (Кастомная)",
                description: "Фото, загруженное пользователем",
                stylingTips: "Загружено пользователем",
                imageKeyword: "",
                customImageUrl: croppedBase64,
              });
              setCropperFileSrc(null);
            }}
          />
        )}
"""

content = content[:start_idx] + new_code + content[end_idx:]

with open("src/components/HaircutList.tsx", "w") as f:
    f.write(content)

print("Fixed")
