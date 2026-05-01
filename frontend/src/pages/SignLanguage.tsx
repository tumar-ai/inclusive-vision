import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { translateSign } from '../api/client';

export default function SignLanguage() {
  const { t, lang, speak } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);

  const analyze = async (base64: string) => {
    setLoading(true); setResult(null);
    try {
      const data = await translateSign(base64, lang);
      setResult(data.translation);
      speak(data.translation);
    } catch { setResult(t('Ошибка распознавания', 'Тану қатесі')); }
    setLoading(false);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreviewSrc(dataUrl);
      analyze(dataUrl.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) { videoRef.current.srcObject = stream; setStreaming(true); }
    } catch { alert(t('Не удалось открыть камеру', 'Камераны ашу мүмкін болмады')); }
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const c = canvasRef.current, v = videoRef.current;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d')?.drawImage(v, 0, 0);
    const dataUrl = c.toDataURL('image/jpeg', 0.8);
    setPreviewSrc(dataUrl);
    (v.srcObject as MediaStream)?.getTracks().forEach(tr => tr.stop());
    v.srcObject = null; setStreaming(false);
    analyze(dataUrl.split(',')[1]);
  };

  return (
    <div className="page-container fade-in section-gap-lg">
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a3a6b', marginBottom: 8 }}>
          {t('Жестовый язык', 'Ым тілі')}
        </h1>
        <p style={{ fontSize: 14, opacity: 0.5, lineHeight: 1.6 }}>
          {t('Покажите жест — AI переведёт его в текст и озвучит', 'Ымды көрсетіңіз — AI мәтінге аударып, дыбыстайды')}
        </p>
      </div>

      <div className="camera-frame">
        {streaming ? (
          <video ref={videoRef} autoPlay playsInline muted style={{ display: 'block', transform: 'scaleX(-1)' }} />
        ) : previewSrc ? (
          <img src={previewSrc} alt={t('Жест', 'Ым')} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 260, color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            {t('Покажите жест на камеру', 'Камераға ымды көрсетіңіз')}
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{ display: 'flex', gap: 12 }}>
        {!streaming ? (
          <button onClick={startCamera} className="btn-primary" style={{ flex: 1 }}>{t('Камера', 'Камера')}</button>
        ) : (
          <button onClick={capture} className="btn-accent pulse-animation" style={{ flex: 1 }}>{t('Снимок', 'Түсіру')}</button>
        )}
        <button onClick={() => fileRef.current?.click()} className="btn-outline" style={{ flex: 1 }}>
          {t('Загрузить', 'Жүктеу')}
        </button>
        <input ref={fileRef} type="file" accept="image/*,video/*" onChange={handleFile} style={{ display: 'none' }} />
      </div>

      {loading && (
        <div className="glass-card slide-up" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ fontWeight: 600 }}>{t('Распознаю жест', 'Ымды танып жатырмын')}<span className="loading-dots" /></p>
        </div>
      )}

      {result && !loading && (
        <div className="glass-card slide-up" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#7c3aed' }}>
              {t('Перевод жеста', 'Ым аудармасы')}
            </h2>
            <button onClick={() => speak(result)} className="btn-outline" style={{ padding: '6px 16px', fontSize: 13, minHeight: 36, borderWidth: '1.5px' }}>
              {t('Озвучить', 'Дыбыстау')}
            </button>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{result}</p>
        </div>
      )}
    </div>
  );
}
