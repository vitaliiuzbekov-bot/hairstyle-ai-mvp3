import React from 'react';

export type Stage = 'analyzing' | 'prompting' | 'generating' | 'done';

const stages: { key: Stage; label: string }[] = [
  { key: 'analyzing', label: 'Анализируем лицо и волосы' },
  { key: 'prompting', label: 'Подбираем идеальную стрижку' },
  { key: 'generating', label: 'Генерируем результат' },
  { key: 'done', label: 'Готово!' },
];

export const GenerationProgress: React.FC<{ stage: Stage }> = ({ stage }) => {
  const current = stages.findIndex(s => s.key === stage);

  return (
    <div style={{ padding: 32, textAlign: 'center' }}>
      <div style={{
        width: 48, height: 48, borderRadius: '50%',
        border: '4px solid #f5a623', borderTopColor: 'transparent',
        animation: 'spin 0.8s linear infinite', margin: '0 auto 24px',
      }} />
      <div style={{ display: 'inline-block', textAlign: 'left' }}>
        {stages.map((s, i) => (
          <div key={s.key} style={{
            display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0',
            opacity: i <= current ? 1 : 0.3,
          }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: i < current ? '#4caf50' : i === current ? '#f5a623' : '#ccc',
              color: 'white', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 12, fontWeight: 'bold',
            }}>
              {i < current ? '✓' : i + 1}
            </div>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};
