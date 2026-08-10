import sys

with open("src/utils/pdfExport.ts", "r") as f:
    content = f.read()

target = """        onclone: (clonedDoc: Document) => {
          clonedDoc.documentElement.style.overflow = 'visible';
          clonedDoc.documentElement.style.width = '100%';
          clonedDoc.body.style.overflow = 'visible';
          clonedDoc.body.style.width = '100%';
          clonedDoc.body.style.margin = '0';
          clonedDoc.body.style.padding = '0';"""

replacement = """        onclone: (clonedDoc: Document) => {
          clonedDoc.documentElement.style.overflow = 'visible';
          clonedDoc.documentElement.style.width = '794px';
          clonedDoc.body.style.overflow = 'visible';
          clonedDoc.body.style.width = '794px';
          clonedDoc.body.style.margin = '0';
          clonedDoc.body.style.padding = '0';"""

content = content.replace(target, replacement)

with open("src/utils/pdfExport.ts", "w") as f:
    f.write(content)
