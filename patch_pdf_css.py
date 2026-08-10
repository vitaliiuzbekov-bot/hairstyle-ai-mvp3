import sys

with open("src/utils/pdfExport.ts", "r") as f:
    content = f.read()

target = ".pdf-page { box-sizing: border-box; padding: 10px 20px; font-family: Arial, Helvetica, sans-serif !important; color: #000000 !important; }"
replacement = ".pdf-page { box-sizing: border-box; width: 794px !important; overflow: hidden; padding: 10px 20px; font-family: Arial, Helvetica, sans-serif !important; color: #000000 !important; }"

content = content.replace(target, replacement)

with open("src/utils/pdfExport.ts", "w") as f:
    f.write(content)
