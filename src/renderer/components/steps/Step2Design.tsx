import React from 'react';
import { COLORS, TEMPLATES } from '../../utils/constants';

interface Step2Props {
  data: Array<Record<string, string>>;
  selectedTemplate: string | null;
  onSelectTemplate: (templateId: string) => void;
  customVars: Record<string, string>;
  onUpdateVar: (varName: string, value: string) => void;
}

export function Step2Design({
  data,
  selectedTemplate,
  onSelectTemplate,
  customVars,
  onUpdateVar,
}: Step2Props) {
  const template = selectedTemplate
    ? TEMPLATES.find(t => t.id === selectedTemplate)
    : null;

  const firstRow = data[0];
  let previewBody = template?.body || 'Seleccioná una plantilla para ver el preview';

  if (template && firstRow) {
    previewBody = template.body.replace(/\{\{nombre\}\}/g, firstRow.nombre || '{{nombre}}');
    template.variables.forEach(v => {
      const value = customVars[v];
      const replacement = !value ? '<span style="text-decoration: line-through; opacity: 0.5;">—</span>' : value;
      previewBody = previewBody.replace(new RegExp(`\\{\\{${v}\\}\\}`, 'g'), replacement);
    });
  }

  return (
    <div>
      <div style={{
        background: `rgba(54,1,95,.05)`,
        border: `1px solid rgba(54,1,95,.2)`,
        borderRadius: '8px',
        padding: '12px 16px',
        fontSize: '13px',
        marginBottom: '16px',
        color: COLORS.primaryLighter,
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
      }}>
        💡 Seleccioná una plantilla y personalizá agregando tus variables (link, precio, etc.)
      </div>

      <div style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        padding: '28px',
        marginBottom: '20px',
        boxShadow: `0 4px 16px rgba(54,1,95,.08)`,
      }}>
        <div style={{
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          color: '#FFFFFF',
          marginBottom: '20px',
          fontWeight: 700,
        }}>
          Plantillas disponibles
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}>
          {TEMPLATES.map(t => (
            <div
              key={t.id}
              onClick={() => onSelectTemplate(t.id)}
              style={{
                background: COLORS.surface2,
                border: `2px solid ${selectedTemplate === t.id ? COLORS.wa : COLORS.border2}`,
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                transition: 'all .2s',
                backgroundColor: selectedTemplate === t.id ? `rgba(37,211,102,.08)` : COLORS.surface2,
              }}
            >
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{t.icon}</div>
              <div style={{
                fontSize: '13px',
                fontWeight: 700,
                marginBottom: '8px',
                color: '#FFFFFF',
              }}>{t.name}</div>
              <div style={{
                fontSize: '12px',
                color: COLORS.muted,
              }}>{t.subtitle}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.border}`,
        borderRadius: '12px',
        padding: '28px',
        marginBottom: '20px',
        boxShadow: `0 4px 16px rgba(54,1,95,.08)`,
      }}>
        <div style={{
          fontSize: '14px',
          textTransform: 'uppercase',
          letterSpacing: '.08em',
          color: '#FFFFFF',
          marginBottom: '20px',
          fontWeight: 700,
        }}>
          Preview del mensaje
        </div>
        <div style={{
          background: COLORS.surface2,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '8px',
          padding: '20px',
          fontSize: '13px',
          lineHeight: 1.7,
          boxShadow: `0 4px 16px rgba(54,1,95,.08)`,
        }}>
          <div style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            color: '#AAAAAA',
            marginBottom: '6px',
            fontFamily: "'DM Mono', monospace",
            fontWeight: 600,
          }}>Para</div>
          <div style={{
            marginBottom: '14px',
            paddingBottom: '14px',
            borderBottom: `1px solid ${COLORS.border}`,
            fontSize: '13px',
          }}>
            {firstRow ? `${firstRow.nombre} — ${firstRow.telefono}` : '—'}
          </div>
          <div style={{
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            color: '#AAAAAA',
            marginBottom: '6px',
            fontFamily: "'DM Mono', monospace",
            fontWeight: 600,
          }}>Mensaje</div>
          <div style={{
            color: '#FFFFFF',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.8,
            fontSize: '14px',
          }} dangerouslySetInnerHTML={{ __html: previewBody.replace(/\n/g, '<br>') }} />
        </div>
      </div>

      {template && (
        <div style={{
          background: COLORS.surface,
          border: `1px solid ${COLORS.border}`,
          borderRadius: '12px',
          padding: '28px',
          marginBottom: '20px',
          boxShadow: `0 4px 16px rgba(54,1,95,.08)`,
        }}>
          <div style={{
            fontSize: '14px',
            textTransform: 'uppercase',
            letterSpacing: '.08em',
            color: '#FFFFFF',
            marginBottom: '20px',
            fontWeight: 700,
          }}>
            Variables adicionales
          </div>
          <div style={{
            fontSize: '12px',
            color: COLORS.muted,
            marginBottom: '16px',
          }}>
            Completá aquí los datos de tus 3 productos destacados y el link del catálogo
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
          }}>
            {template.variables.map(v => (
              <div key={v}>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  color: '#FFFFFF',
                  marginBottom: '10px',
                  fontWeight: 600,
                }}>
                  {v.replace(/_/g, ' ')}
                </label>
                <input
                  type="text"
                  value={customVars[v] || ''}
                  onChange={(e) => onUpdateVar(v, e.target.value)}
                  placeholder="Ingresá"
                  style={{
                    width: '100%',
                    background: COLORS.surface2,
                    border: `1px solid ${COLORS.border2}`,
                    borderRadius: '8px',
                    padding: '12px 16px',
                    color: '#FFFFFF',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px',
                    fontWeight: 500,
                    outline: 'none',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
