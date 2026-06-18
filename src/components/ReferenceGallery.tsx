import React from 'react';

interface Reference {
  name: string;
  imageUrl: string;
}

interface Props {
  references: Reference[];
  onSelect: (styleName: string) => void;
  selectedStyle?: string;
  isLoading: boolean;
}

export const ReferenceGallery: React.FC<Props> = ({
  references, onSelect, selectedStyle, isLoading,
}) => {
  if (isLoading) {
    return <div className="loading" style={{ padding: 16, textAlign: 'center' }}>
      Подбираем стрижки под ваши волосы...
    </div>;
  }

  return (
    <div style={{ padding: 16 }}>
      <h3 style={{ margin: '0 0 4px' }}>Стрижки, которые подходят вашим волосам</h3>
      <p style={{ fontSize: 13, color: 'var(--tg-theme-hint-color, #999)', margin: '0 0 12px' }}>
        Референсы подобраны с учётом густоты, текстуры и типа ваших волос
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12,
      }}>
        {references.map((ref) => (
          <div
            key={ref.name}
            onClick={() => onSelect(ref.name)}
            style={{
              borderRadius: 12,
              overflow: 'hidden',
              cursor: 'pointer',
              border: selectedStyle === ref.name ? '3px solid #f5a623' : '3px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            <img
              src={ref.imageUrl || undefined}
              alt={ref.name}
              style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' }}
            />
            <div style={{
              padding: 8,
              textAlign: 'center',
              fontWeight: 600,
              background: 'var(--tg-theme-secondary-bg-color, #f0f0f0)',
            }}>
              {ref.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
