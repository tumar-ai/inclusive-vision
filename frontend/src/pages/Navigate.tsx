import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { navigate as navigateApi } from '../api/client';

export default function Navigate() {
  const { t, lang, speak } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreviewSrc(dataUrl);
      setImageBase64(dataUrl.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    if (!description && !imageBase64) return;
    setLoading(true); setResult(null);
    try {
      const data = await navigateApi(description, imageBase64 || undefined, lang);
      setResult(data.guidance);
      speak(data.guidance);
    } catch { setResult(t('Ошибка навигации', 'Навигация қатесі')); }
    setLoading(false);
  };

  return (
    <div className="page-container fade-in section-gap-lg">
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a3a6b', marginBottom: 8 }}>
          {t('Навигационный помощник', 'Навигация көмекшісі')}
        </h1>
        <p style={{ fontSize: 14, opacity: 0.5, lineHeight: 1.6 }}>
          {t('Опишите или сфотографируйте препятствие — AI поможет обойти', 'Кедергіні сипаттаңыз немесе суретке түсіріңіз — AI айналып өтуге көмектеседі')}
        </p>
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <label style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
          {t('Опишите ситуацию', 'Жағдайды сипаттаңыз')}
        </label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder={t(
            'Например: Я стою у перекрёстка, рядом торговый центр. Мне нужно дойти до аптеки.',
            'Мысалы: Мен қиылыста тұрмын, жанымда сауда орталығы. Маған дәріханаға бару керек.'
          )}
          style={{ minHeight: 140, resize: 'vertical' }}
        />
      </div>

      <button onClick={() => fileRef.current?.click()} className="btn-outline" style={{ width: '100%' }}>
        {t('Добавить фото местности', 'Жер бедері суретін қосу')}
      </button>
      <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{ display: 'none' }} />

      {previewSrc && (
        <div className="camera-frame" style={{ maxHeight: 220 }}>
          <img src={previewSrc} alt={t('Фото местности', 'Жер бедері суреті')} />
        </div>
      )}

      <button onClick={submit} className="btn-primary" style={{ width: '100%' }} disabled={loading || (!description && !imageBase64)}>
        {t('Построить маршрут', 'Маршрут құру')}
      </button>

      {loading && (
        <div className="glass-card slide-up" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ fontWeight: 600 }}>{t('Строю маршрут', 'Маршрут құрып жатырмын')}<span className="loading-dots" /></p>
        </div>
      )}

      {result && !loading && (
        <div className="glass-card slide-up" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#059669' }}>
              {t('Навигация', 'Навигация')}
            </h2>
            <button onClick={() => speak(result)} className="btn-outline" style={{ padding: '6px 16px', fontSize: 13, minHeight: 36, borderWidth: '1.5px' }}>
              {t('Озвучить', 'Дыбыстау')}
            </button>
          </div>
          <div style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{result}</div>
        </div>
      )}
    </div>
  );
}
