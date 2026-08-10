const fs = require('fs');
let code = fs.readFileSync('src/components/UploadZone.tsx', 'utf8');

const target = `                {!results && !error && (
                  <>
                  <button`;

const replacement = `                {!results && !error && (
                  <>
                  {isProMode && imageBase64 && (
                    <div className="mb-4">
                      <label className={\`block text-xs uppercase tracking-widest font-medium mb-1.5 \${isLightMode ? 'text-gray-500' : 'text-white/60'}\`}>Имя клиента (необязательно)</label>
                      <input 
                        type="text" 
                        value={clientName || ''}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Например, Анна" 
                        className={\`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 \${isLightMode ? 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400' : 'bg-white/5 border-white/10 text-white placeholder:text-white/30'}\`}
                      />
                    </div>
                  )}
                  <button`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/components/UploadZone.tsx', code);
  console.log('Fixed UploadZone');
} else {
  console.log('Target not found');
}
