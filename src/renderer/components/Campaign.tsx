import React, { useState } from 'react';
import { COLORS, TEMPLATES } from '../utils/constants';
import { Step1Upload } from './steps/Step1Upload';
import { Step2Design } from './steps/Step2Design';
import { Step3Preview } from './steps/Step3Preview';

export function Campaign() {
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [data, setData] = useState<Array<Record<string, string>>>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [customVars, setCustomVars] = useState<Record<string, string>>({});

  function handleDataLoaded(newData: typeof data, newColumns: typeof columns) {
    setData(newData);
    setColumns(newColumns);
    setMaxStep(Math.max(maxStep, 1));
  }

  function handleSelectTemplate(templateId: string) {
    setSelectedTemplate(templateId);
    setCustomVars({});
    setMaxStep(Math.max(maxStep, 2));
    setMaxStep(Math.max(maxStep, 3));
  }

  function handleUpdateVar(varName: string, value: string) {
    setCustomVars(prev => ({ ...prev, [varName]: value }));
  }

  function validateAndGoStep(n: number) {
    if (n === 2 && !selectedTemplate) {
      alert('Por favor seleccioná una plantilla primero');
      return;
    }
    goStep(n);
  }

  function goStep(n: number) {
    if (n > maxStep && n !== 0) return;
    setStep(n);
  }

  const stepLabels = ['Cargar datos', 'Diseñar', 'Preview', 'Envío'];

  return (
    <div>
      {/* Steps Navigation */}
      <nav style={{
        display: 'flex',
        borderBottom: `1px solid ${COLORS.border}`,
        padding: '0 32px',
      }}>
        {stepLabels.map((label, i) => {
          let className = '';
          if (i === step) className = 'active';
          else if (i < step) className = 'done';
          else if (i > maxStep) className = 'locked';

          return (
            <div
              key={i}
              onClick={() => goStep(i)}
              style={{
                padding: '14px 20px',
                fontSize: '13px',
                color: className === 'locked' ? '#666666' : className === 'done' ? COLORS.success : className === 'active' ? '#FFFFFF' : '#999999',
                cursor: className === 'locked' ? 'not-allowed' : 'pointer',
                borderBottom: `3px solid ${className === 'active' ? COLORS.primary : 'transparent'}`,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all .2s',
                whiteSpace: 'nowrap',
                fontWeight: className === 'active' ? 700 : 600,
                opacity: className === 'locked' ? 0.4 : 1,
              }}
            >
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                border: `1px solid currentColor`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontFamily: "'DM Mono', monospace",
              }}>
                {i + 1}
              </div>
              {label}
            </div>
          );
        })}
      </nav>

      {/* Main Content */}
      <main style={{
        padding: '40px',
        maxWidth: '900px',
        margin: '0 auto',
      }}>
        {step === 0 && (
          <>
            <Step1Upload onDataLoaded={handleDataLoaded} />
            {data.length > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                marginTop: '20px',
                gap: '10px',
              }}>
                <span style={{
                  fontSize: '12px',
                  color: COLORS.muted,
                }}>
                  {columns.length} columnas detectadas · próximo paso: diseñar mensaje
                </span>
                <button
                  onClick={() => validateAndGoStep(1)}
                  style={{
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: 'none',
                    background: `linear-gradient(135deg, ${COLORS.wa} 0%, ${COLORS.wa2} 100%)`,
                    color: '#FFFFFF',
                    boxShadow: `0 4px 12px rgba(37,211,102,.3)`,
                    transition: 'all .2s',
                  }}
                >
                  Diseñar mensaje →
                </button>
              </div>
            )}
          </>
        )}

        {step === 1 && (
          <>
            <Step2Design
              data={data}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={handleSelectTemplate}
              customVars={customVars}
              onUpdateVar={handleUpdateVar}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
              gap: '10px',
            }}>
              <button
                onClick={() => goStep(0)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: `1px solid ${COLORS.border2}`,
                  background: 'transparent',
                  color: COLORS.text,
                  transition: 'all .2s',
                }}
              >
                ← Volver
              </button>
              <button
                onClick={() => validateAndGoStep(2)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  background: `linear-gradient(135deg, ${COLORS.wa} 0%, ${COLORS.wa2} 100%)`,
                  color: '#FFFFFF',
                  boxShadow: `0 4px 12px rgba(37,211,102,.3)`,
                  transition: 'all .2s',
                }}
              >
                Ver preview completo →
              </button>
            </div>
          </>
        )}

        {step === 2 && selectedTemplate && (
          <>
            <Step3Preview
              data={data}
              selectedTemplate={selectedTemplate}
              customVars={customVars}
            />
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '20px',
              gap: '10px',
            }}>
              <button
                onClick={() => goStep(1)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: `1px solid ${COLORS.border2}`,
                  background: 'transparent',
                  color: COLORS.text,
                  transition: 'all .2s',
                }}
              >
                ← Editar
              </button>
              <button
                onClick={() => goStep(3)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: 'none',
                  background: `linear-gradient(135deg, ${COLORS.wa} 0%, ${COLORS.wa2} 100%)`,
                  color: '#FFFFFF',
                  boxShadow: `0 4px 12px rgba(37,211,102,.3)`,
                  transition: 'all .2s',
                }}
              >
                Configurar envío →
              </button>
            </div>
          </>
        )}

        {step === 3 && (
          <div style={{
            background: COLORS.surface,
            border: `1px solid ${COLORS.border}`,
            borderRadius: '12px',
            padding: '28px',
            textAlign: 'center',
            color: COLORS.muted,
          }}>
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>🔒</div>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>
              Envío en Phase 2
            </div>
            <div style={{ fontSize: '13px' }}>
              En la próxima versión conectaremos con SQL Server y Meta WhatsApp API
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
