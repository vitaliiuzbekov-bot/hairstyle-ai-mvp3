const fs = require('fs');
let code = fs.readFileSync('src/components/PersonalGuideSection.tsx', 'utf8');

const target1 = `  const { isProMode } = useAnalysisContext();`;
const replacement1 = `  const { isProMode, stylistNotes, setStylistNotes } = useAnalysisContext();`;

const target2 = `          <div
            className={\`text-sm font-light leading-relaxed space-y-4 font-sans`;
const replacement2 = `          {isProMode && (
            <div className="mb-6 hide-in-pdf">
              <label className={\`block text-xs uppercase tracking-widest font-medium mb-1.5 \${isLightMode ? 'text-gray-500' : 'text-white/60'}\`}>Заметки мастера для клиента</label>
              <textarea 
                value={stylistNotes || ''}
                onChange={(e) => setStylistNotes(e.target.value)}
                placeholder="Добавьте свои комментарии, рецепт окрашивания или рекомендации по уходу..."
                className={\`w-full px-4 py-3 rounded-xl border text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50 min-h-[80px] resize-y \${isLightMode ? 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400' : 'bg-[#0f0c1b] border-white/10 text-white placeholder:text-white/30'}\`}
              />
            </div>
          )}
          {stylistNotes && (
            <div className="mb-6 border-b border-t py-4 border-amber-500/20 bg-amber-500/5 px-4 rounded-lg">
              <h5 className="text-amber-500 font-medium text-sm mb-2">Заметки мастера:</h5>
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{stylistNotes}</div>
            </div>
          )}
          <div
            className={\`text-sm font-light leading-relaxed space-y-4 font-sans`;

if (code.includes(target1) && code.includes(target2)) {
  code = code.replace(target1, replacement1);
  code = code.replace(target2, replacement2);
  fs.writeFileSync('src/components/PersonalGuideSection.tsx', code);
  console.log('Fixed PersonalGuideSection');
} else {
  console.log('Target not found');
}
