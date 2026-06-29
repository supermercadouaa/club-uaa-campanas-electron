import React, { useRef } from 'react';
import { COLORS } from '../../utils/constants';
import { parseCSV, parseXLSX, processData } from '../../utils/csv-parser';

interface Step1Props {
  onDataLoaded: (data: any[], columns: string[]) => void;
}

export function Step1Upload({ onDataLoaded }: Step1Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [stats, setStats] = React.useState<{ contacts: number; columns: number } | null>(null);

  async function handleFile(file: File) {
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();

    if (ext === 'csv') {
      reader.onload = (ev) => {
        const text = ev.target?.result as string;
        const { rawData, columns } = parseCSV(text);
        const data = processData(rawData, columns);
        setStats({ contacts: data.length, columns: columns.length });
        onDataLoaded(data, columns);
      };
      reader.readAsText(file, 'UTF-8');
    } else if (ext === 'xlsx' || ext === 'xls') {
      reader.onload = async (ev) => {
        const buffer = ev.target?.result as ArrayBuffer;
        const { rawData, columns } = await parseXLSX(buffer);
        const data = processData(rawData, columns);
        setStats({ contacts: data.length, columns: columns.length });
        onDataLoaded(data, columns);
      };
      reader.readAsArrayBuffer(file);
    }
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
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
        }}>
          Archivo de contactos
        </div>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
          }}
          style={{
            border: `2px dashed ${COLORS.border2}`,
            borderRadius: '12px',
            padding: '48px 32px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all .2s',
            position: 'relative',
            background: isDragging ? `rgba(54,1,95,.08)` : `rgba(54,1,95,.02)`,
            borderColor: isDragging ? COLORS.primary : COLORS.border2,
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={(e) => handleFile(e.target.files?.[0]!)}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
              width: '100%',
              height: '100%',
            }}
          />
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>📊</div>
          <div style={{
            fontSize: '15px',
            fontWeight: 700,
            marginBottom: '8px',
            color: '#FFFFFF',
          }}>
            Arrastrá o hacé clic para subir
          </div>
          <div style={{
            fontSize: '13px',
            color: '#999999',
            fontWeight: 500,
          }}>
            Excel o CSV con nombres y teléfonos
          </div>
          <div style={{
            marginTop: '16px',
            fontSize: '12px',
            color: '#888888',
            fontFamily: "'DM Mono', monospace",
            lineHeight: 1.8,
            fontWeight: 500,
          }}>
            Se autodetectan las columnas de teléfono y nombre<br />
            Soporta separador por coma (,) o punto y coma (;)<br />
            Encoding UTF-8 y Latin-1 · Excel .xlsx y .xls
          </div>
        </div>
      </div>

      {stats && (
        <div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '12px',
            marginBottom: '20px',
          }}>
            <div style={{
              background: COLORS.surface2,
              borderRadius: '8px',
              padding: '14px 16px',
            }}>
              <div style={{
                fontSize: '11px',
                color: '#AAAAAA',
                textTransform: 'uppercase',
                letterSpacing: '.06em',
                marginBottom: '4px',
                fontWeight: 600,
              }}>Contactos</div>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                fontFamily: "'DM Mono', monospace",
                color: '#FFFFFF',
              }}>{stats.contacts.toLocaleString('es-AR')}</div>
            </div>
            <div style={{
              background: COLORS.surface2,
              borderRadius: '8px',
              padding: '14px 16px',
            }}>
              <div style={{
                fontSize: '11px',
                color: '#AAAAAA',
                textTransform: 'uppercase',
                letterSpacing: '.06em',
                marginBottom: '4px',
                fontWeight: 600,
              }}>Columnas</div>
              <div style={{
                fontSize: '24px',
                fontWeight: 700,
                fontFamily: "'DM Mono', monospace",
                color: '#FFFFFF',
              }}>{stats.columns}</div>
            </div>
          </div>
          <div style={{
            display: 'panel',
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
            }}>Vista previa — primeros 5 registros</div>
            {/* Table will be added here */}
          </div>
        </div>
      )}
    </div>
  );
}
