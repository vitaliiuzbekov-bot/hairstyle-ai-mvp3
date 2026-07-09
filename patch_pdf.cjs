const fs = require('fs');
let content = fs.readFileSync('src/utils/pdfExport.ts', 'utf8');
content = content.replace('import html2pdf from "html2pdf.js";\n\n', '');
content = content.replace(
`export const exportToPDF = async (
  contentHTML: string,
  filename: string = "hairstyle_guide.pdf",
  imgBeforeSrc?: string,
  imgRefSrc?: string,
  imgAfterSrc?: string
) => {
  try {`, 
`export const exportToPDF = async (
  contentHTML: string,
  filename: string = "hairstyle_guide.pdf",
  imgBeforeSrc?: string,
  imgRefSrc?: string,
  imgAfterSrc?: string
) => {
  try {
    const html2pdfModule = await import("html2pdf.js");
    const html2pdf = html2pdfModule.default || html2pdfModule;`
);
fs.writeFileSync('src/utils/pdfExport.ts', content);
