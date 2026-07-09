const fs = require('fs');
let content = fs.readFileSync('src/components/UploadZone.tsx', 'utf8');

const target = `                <div
                  className={\`mt-6 p-3 rounded-xl border flex items-start gap-3 w-full max-w-[340px] cursor-pointer transition-all \${
                    consentError 
                      ? (isLightMode ? "bg-red-50 border-red-300" : "bg-red-500/10 border-red-500/30")
                      : (isLightMode ? "bg-transparent border-transparent" : "bg-transparent border-transparent")
                  }\`}
                  onClick={() => { hapticImpact('light'); setConsentGiven(!consentGiven); setConsentError(false); }}
                >`;

const replacement = `                <div className="flex flex-col gap-3 w-full max-w-[340px] mt-6">
                  <button 
                    onClick={() => { hapticImpact('light'); window.dispatchEvent(new Event('open-library')); }}
                    className={\`w-full flex items-center p-4 rounded-xl border transition-all text-left group \${isLightMode ? 'bg-purple-50/50 border-purple-200 hover:border-purple-300 hover:bg-purple-50' : 'bg-purple-500/5 border-purple-500/20 hover:border-purple-500/30 hover:bg-purple-500/10'}\`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className={\`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors \${isLightMode ? 'bg-purple-100 group-hover:bg-purple-200' : 'bg-purple-500/20 group-hover:bg-purple-500/30'}\`}>
                        <BookOpen size={18} className={isLightMode ? 'text-purple-700' : 'text-purple-300'} />
                      </div>
                      <div className="flex-1">
                        <h4 className={\`text-sm font-medium mb-0.5 \${isLightMode ? 'text-purple-900' : 'text-purple-100'}\`}>Каталог стрижек</h4>
                        <p className={\`text-xs \${isLightMode ? 'text-purple-600' : 'text-purple-300/70'}\`}>Полистать готовые варианты</p>
                      </div>
                    </div>
                  </button>
                </div>

                <div
                  className={\`mt-3 p-3 rounded-xl border flex items-start gap-3 w-full max-w-[340px] cursor-pointer transition-all \${
                    consentError 
                      ? (isLightMode ? "bg-red-50 border-red-300" : "bg-red-500/10 border-red-500/30")
                      : (isLightMode ? "bg-transparent border-transparent" : "bg-transparent border-transparent")
                  }\`}
                  onClick={() => { hapticImpact('light'); setConsentGiven(!consentGiven); setConsentError(false); }}
                >`;

if(content.includes('consentError')) {
    content = content.replace(target, replacement);
    fs.writeFileSync('src/components/UploadZone.tsx', content);
    console.log("Patched UploadZone successfully");
} else {
    console.log("Could not find target in UploadZone");
}
