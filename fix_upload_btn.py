import sys

with open("src/components/HaircutList.tsx", "r") as f:
    content = f.read()

target = """          <button
            onClick={() => window.dispatchEvent(new Event('open-library'))}"""

replacement = """          <label className={`cursor-pointer flex items-center gap-2 rounded-full px-6 py-4 transition-all font-medium text-sm sm:text-base border w-full sm:w-auto justify-center ${isLightMode ? "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 shadow-sm" : "text-white/90 glass-panel hover:bg-white/5 border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.37)]"}`}>
            <Upload size={16} />
            Свое фото
            <input type="file" className="hidden" accept="image/*" onChange={handleCustomUpload} />
          </label>
          <button
            onClick={() => window.dispatchEvent(new Event('open-library'))}"""

if target in content:
    content = content.replace(target, replacement)
    with open("src/components/HaircutList.tsx", "w") as f:
        f.write(content)
    print("Fixed")
else:
    print("target not found")
