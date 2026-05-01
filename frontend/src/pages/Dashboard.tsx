import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getAudits, getAuditPdfUrl } from '../api/client';

interface AuditSummary {
  id: string;
  location_name: string;
  location_type: string;
  score: number;
  lang: string;
  created_at: string;
}

const TYPE_LABELS: Record<string, { ru: string; kz: string }> = {
  school: { ru: 'Школа', kz: 'Мектеп' },
  hospital: { ru: 'Больница', kz: 'Аурухана' },
  business: { ru: 'Бизнес', kz: 'Бизнес' },
  metro: { ru: 'Метро', kz: 'Метро' },
  government: { ru: 'Гос.', kz: 'Мем.' },
  other: { ru: 'Другое', kz: 'Басқа' },
};

export default function Dashboard() {
  const { t, lang } = useApp();
  const [audits, setAudits] = useState<AuditSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAudits()
      .then(data => { setAudits(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const getScoreColor = (s: number) => s >= 80 ? '#10b981' : s >= 50 ? '#f59e0b' : '#ef4444';
  const avgScore = audits.length ? Math.round(audits.reduce((a, b) => a + b.score, 0) / audits.length) : 0;
  const getTypeLabel = (type: string) => {
    const l = TYPE_LABELS[type];
    return l ? (lang === 'kz' ? l.kz : l.ru) : type;
  };

  return (
    <div className="page-container fade-in section-gap-lg">
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a3a6b', marginBottom: 8 }}>
          {t('Дашборд аудитов', 'Аудиттер дашборды')}
        </h1>
        <p style={{ fontSize: 14, opacity: 0.5, lineHeight: 1.6 }}>
          {t('История проверок доступности объектов', 'Объектілердің қолжетімділігін тексеру тарихы')}
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
        <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#1a3a6b' }}>{audits.length}</div>
          <div style={{ fontSize: 12, marginTop: 6, opacity: 0.5 }}>{t('Всего аудитов', 'Барлық аудиттер')}</div>
        </div>
        <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: getScoreColor(avgScore) }}>{avgScore}</div>
          <div style={{ fontSize: 12, marginTop: 6, opacity: 0.5 }}>{t('Средний балл', 'Орташа балл')}</div>
        </div>
        <div className="glass-card" style={{ padding: 24, textAlign: 'center' }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>
            {audits.filter(a => a.score >= 80).length}
          </div>
          <div style={{ fontSize: 12, marginTop: 6, opacity: 0.5 }}>{t('Соответствуют', 'Сәйкес келеді')}</div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <p style={{ fontWeight: 600, opacity: 0.5 }}>{t('Загрузка', 'Жүктелуде')}<span className="loading-dots" /></p>
        </div>
      )}

      {/* Empty */}
      {!loading && audits.length === 0 && (
        <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
          <p style={{ opacity: 0.45, fontSize: 15 }}>{t('Аудитов пока нет', 'Әзірге аудиттер жоқ')}</p>
        </div>
      )}

      {/* Audit List */}
      {!loading && audits.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {audits.map((audit, i) => (
            <div
              key={audit.id}
              className="glass-card slide-up"
              style={{ padding: 20, animationDelay: `${i * 60}ms` }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                {/* Type badge */}
                <div
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: '#f1f5f9',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#64748b',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {getTypeLabel(audit.location_type)}
                </div>

                {/* Name + date */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontWeight: 700, fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {audit.location_name}
                  </h3>
                  <p style={{ fontSize: 12, opacity: 0.4, marginTop: 4 }}>
                    {new Date(audit.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                {/* Score */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: getScoreColor(audit.score) }}>
                    {audit.score}
                  </div>
                  <div style={{ fontSize: 11, opacity: 0.4 }}>/100</div>
                </div>

                {/* PDF link */}
                <a
                  href={getAuditPdfUrl(audit.id)}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-outline"
                  style={{ padding: '6px 14px', fontSize: 12, minHeight: 34, borderWidth: '1.5px', flexShrink: 0 }}
                >
                  PDF
                </a>
              </div>

              {/* Score bar */}
              <div style={{ marginTop: 14, height: 6, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: 999,
                    width: `${audit.score}%`,
                    background: getScoreColor(audit.score),
                    transition: 'width 0.5s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
