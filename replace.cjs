const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf-8');

const startIndex = content.indexOf('{/* Barber Blueprint Modal */}');
const endIndex = content.indexOf('{tryOnStyle && (', startIndex) + 16;
// finding the end of the modal.
const marker = '      {/* User Support/Expert UI */}';
const targetEndIndex = content.indexOf(marker);

const before = content.substring(0, startIndex);
const replace = `      <BarberBlueprintModal
        tryOnStyle={tryOnStyle}
        setTryOnStyle={setTryOnStyle}
        results={results}
        imageUrl={imageUrl}
        mimeType={mimeType}
        imageBase64={imageBase64}
        styleConsultations={styleConsultations}
        loadingARStyles={loadingARStyles}
        arError={arError}
        vtonResultUrl={vtonResultUrl}
        isTeaserResult={isTeaserResult}
        processPayment={processPayment}
        customHairColor={customHairColor}
        setCustomHairColor={setCustomHairColor}
        vtonStrength={vtonStrength}
        setVtonStrength={setVtonStrength}
        generateARPreview={generateARPreview}
        exportToPDF={exportToPDF}
        isExportingPDF={isExportingPDF}
        userRole={userRole}
        salonName={salonName}
        setChatStyleName={setChatStyleName}
        setIsChatOpen={setIsChatOpen}
        loadingVTONStyles={loadingVTONStyles}
        generateVirtualTryOn={generateVirtualTryOn}
        vtonError={vtonError}
      />\n\n`;
const after = content.substring(targetEndIndex);

fs.writeFileSync('src/App.tsx', before + replace + after);
console.log("Successfully replaced modal.")
