import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { auditImage } from '../api/client';

const LABELS: Record<string, { ru: string; kz: string }> = {
  ramp_present: { ru: 'Пандусы', kz: 'Пандустар' },
  tactile_tiles: { ru: 'Тактильная плитка', kz: 'Тактильді плитка' },
  accessible_signage: { ru: 'Доступные указатели', kz: 'Қолжетімді белгілер' },
  accessible_parking: { ru: 'Парковка для инвалидов', kz: 'Мүгедектер тұрағы' },
  doorway_width: { ru: 'Ширина дверных проёмов', kz: 'Есік ойықтарының ені' },
  contrast_marking: { ru: 'Контрастная маркировка', kz: 'Контрастты белгілеу' },
};

interface AuditResult {
  id?: string;
  score: number;
  passed: string[];
  failed: string[];
  recommendations: string[];
}

export default function Audit() {
  const { t, lang } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [locationName, setLocationName] = useState('');
  const [locationType, setLocationType] = useState('other');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1];
      setPreviewSrc(dataUrl);
      setLoading(true); setResult(null);
      try {
        const data = await auditImage(base64, locationName || 'Без названия', locationType, lang);
        setResult(data);
      } catch {
        setResult({ score: 0, passed: [], failed: [], recommendations: [t('Ошибка анализа', 'Талдау қатесі')] });
      }
      setLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const getScoreColor = (s: number) => s >= 80 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';
  const getLabel = (key: string) => { const l = LABELS[key]; return l ? (lang === 'kz' ? l.kz : l.ru) : key; };

  return (
    <div className="page-container fade-in section-gap-lg">
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a3a6b', marginBottom: 8 }}>
          {t('Аудит доступности', 'Қолжетімділік аудиті')}
        </h1>
        <p style={{ fontSize: 14, opacity: 0.5, lineHeight: 1.6 }}>
          {t('Загрузите фото здания для проверки на соответствие стандартам', 'Стандарттарға сәйкестікті тексеру үшін ғимарат суретін жүктеңіз')}
        </p>
      </div>

      {/* Location Info */}
      <div className="glass-card" style={{ padding: 24 }}>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
          {t('Название объекта', 'Объект атауы')}
        </label>
        <input
          type="text"
          value={locationName}
          onChange={e => setLocationName(e.target.value)}
          placeholder={t('Например: Школа №45', 'Мысалы: №45 мектеп')}
        />

        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 10, marginTop: 20 }}>
          {t('Тип объекта', 'Объект түрі')}
        </label>
        <select value={locationType} onChange={e => setLocationType(e.target.value)}>
          <option value="school">{t('Школа / Вуз', 'Мектеп / ЖОО')}</option>
          <option value="hospital">{t('Больница', 'Аурухана')}</option>
          <option value="business">{t('Бизнес-центр', 'Бизнес-орталық')}</option>
          <option value="metro">{t('Метро / Транспорт', 'Метро / Көлік')}</option>
          <option value="government">{t('Гос. учреждение', 'Мемлекеттік мекеме')}</option>
          <option value="other">{t('Другое', 'Басқа')}</option>
        </select>
      </div>

      {/* Upload */}
      <button onClick={() => fileRef.current?.click()} className="btn-primary" style={{ width: '100%' }}>
        {t('Загрузить фото объекта', 'Объект суретін жүктеу')}
      </button>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleUpload} style={{ display: 'none' }} />

      {/* Preview */}
      {previewSrc && (
        <div className="camera-frame">
          <img src={previewSrc} alt={t('Загруженное фото', 'Жүктелген сурет')} />
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="glass-card slide-up" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ fontWeight: 600 }}>{t('Проверяю доступность', 'Қолжетімділікті тексеріп жатырмын')}<span className="loading-dots" /></p>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="slide-up section-gap-lg">
          {/* Score */}
          <div className="glass-card" style={{ padding: 32, textAlign: 'center' }}>
            <div
              className="score-ring"
              style={{
                margin: '0 auto 16px',
                background: `conic-gradient(${getScoreColor(result.score)} ${result.score * 3.6}deg, #e2e8f0 0deg)`,
              }}
            >
              <div style={{
                width: 96, height: 96, borderRadius: '50%', background: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, fontWeight: 900, color: getScoreColor(result.score),
              }}>
                {result.score}
              </div>
            </div>
            <p style={{ fontWeight: 700, fontSize: 16 }}>
              {t('Оценка доступности', 'Қолжетімділік бағасы')}: {result.score}/100
            </p>
          </div>

          {/* Passed / Failed */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 700, color: '#10b981', marginBottom: 12, fontSize: 14 }}>
                {t('Пройдено', 'Өтті')}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.passed.map(p => <span key={p} className="badge-pass">{getLabel(p)}</span>)}
                {result.passed.length === 0 && <span style={{ fontSize: 13, opacity: 0.4 }}>{t('Нет', 'Жоқ')}</span>}
              </div>
            </div>
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 700, color: '#ef4444', marginBottom: 12, fontSize: 14 }}>
                {t('Не пройдено', 'Өтпеді')}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {result.failed.map(f => <span key={f} className="badge-fail">{getLabel(f)}</span>)}
                {result.failed.length === 0 && <span style={{ fontSize: 13, opacity: 0.4 }}>{t('Нет', 'Жоқ')}</span>}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontWeight: 700, color: '#1a3a6b', marginBottom: 16, fontSize: 14 }}>
              {t('Рекомендации', 'Ұсыныстар')}
            </h3>
            <ol style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {result.recommendations.map((r, i) => (
                <li key={i} style={{ fontSize: 14, lineHeight: 1.6 }}>{r}</li>
              ))}
            </ol>
          </div>

          {/* PDF */}
          {result.id && (
            <a href={`/api/v1/audits/${result.id}/pdf`} target="_blank" rel="noreferrer" className="btn-outline" style={{ width: '100%', textAlign: 'center' }}>
              {t('Скачать PDF отчёт', 'PDF есебін жүктеу')}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
