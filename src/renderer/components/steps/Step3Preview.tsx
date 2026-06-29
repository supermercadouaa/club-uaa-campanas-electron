import React, { useState } from 'react';
import { COLORS, TEMPLATES } from '../../utils/constants';

interface Step3Props {
  data: Array<Record<string, string>>;
  selectedTemplate: string;
  customVars: Record<string, string>;
}

export function Step3Preview({
  data,
  selectedTemplate,
  customVars,
}: Step3Props) {
  const [previewIdx, setPreviewIdx] = useState(0);
  const template = TEMPLATES.find(t => t.id === selectedTemplate);
  const row = data[previewIdx];

  let previewBody = template?.body || '';
  if (row && template) {
    previewBody = template.body.replace(/\{\{nombre\}\}/g, row.nombre || '{{nombre}}');
    template.variables.forEach(v => {
      const value = customVars[v];
      const replacement = !value ? '<span style="text-decoration: line-through; opacity: 0.5;">—</span>' : value;
      previewBody = previewBody.replace(new RegExp(`\\{\\{${v}\\}\\}`, 'g'), replacement);
    });
  }

  return (
    <div>
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
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '16px',
        }}>
          <span style={{
            fontSize: '12px',
            color: '#AAAAAA',
            fontFamily: "'DM Mono', monospace",
            fontWeight: 600,
          }}>
            {previewIdx + 1} / {data.length}
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setPreviewIdx(Math.max(0, previewIdx - 1))}
              style={{
                width: '28px',
                height: '28px',
                background: COLORS.surface2,
                border: `1px solid ${COLORS.border2}`,
                borderRadius: '8px',
                color: COLORS.text,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                transition: 'all .15s',
              }}
            >
              ←
            </button>
            <button
              onClick={() => setPreviewIdx(Math.min(data.length - 1, previewIdx + 1))}
              style={{
                width: '28px',
                height: '28px',
                background: COLORS.surface2,
                border: `1px solid ${COLORS.border2}`,
                borderRadius: '8px',
                color: COLORS.text,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                transition: 'all .15s',
              }}
            >
              →
            </button>
          </div>
          <span style={{
            fontSize: '12px',
            color: COLORS.muted,
            marginLeft: '4px',
          }}>
            navegá entre contactos
          </span>
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
            {row ? `${row.nombre} — ${row.telefono}` : '—'}
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
    </div>
  );
}
