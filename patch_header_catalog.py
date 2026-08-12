import sys

with open("src/components/Header.tsx", "r") as f:
    content = f.read()

content = content.replace(
    '{isProMode && <button onClick={onOpenLibrary} className={`w-8 h-8 sm:w-auto sm:h-9 sm:px-3 rounded-full flex items-center justify-center sm:gap-1.5 transition-all font-medium text-[11px] sm:text-xs border shrink-0',
    '{isProMode && <button onClick={onOpenLibrary} className={`hidden sm:flex w-8 h-8 sm:w-auto sm:h-9 sm:px-3 rounded-full items-center justify-center sm:gap-1.5 transition-all font-medium text-[11px] sm:text-xs border shrink-0'
)

with open("src/components/Header.tsx", "w") as f:
    f.write(content)
