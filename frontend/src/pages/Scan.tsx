import { useState, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { scanImage } from '../api/client';

export default function Scan() {
  const { t, lang, speak } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [streaming, setStreaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      if (videoRef.current) { videoRef.current.srcObject = stream; setStreaming(true); }
    } catch {
      alert(t('Не удалось открыть камеру', 'Камераны ашу мүмкін болмады'));
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(tr => tr.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
  };

  const captureAndAnalyze = useCallback(async (base64: string) => {
    setLoading(true); setResult(null);
    try {
      const data = await scanImage(base64, lang);
      setResult(data.description);
      speak(data.description);
    } catch { setResult(t('Ошибка анализа', 'Талдау қатесі')); }
    setLoading(false);
  }, [lang, speak, t]);

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const c = canvasRef.current, v = videoRef.current;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext('2d')?.drawImage(v, 0, 0);
    const dataUrl = c.toDataURL('image/jpeg', 0.8);
    setPreviewSrc(dataUrl); stopCamera();
    captureAndAnalyze(dataUrl.split(',')[1]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setPreviewSrc(dataUrl);
      captureAndAnalyze(dataUrl.split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="page-container fade-in section-gap-lg">
      <div>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a3a6b', marginBottom: 8 }}>
          {t('Умные глаза — Сканер', 'Ақылды көздер — Сканер')}
        </h1>
        <p style={{ fontSize: 14, opacity: 0.5, lineHeight: 1.6 }}>
          {t('Наведите камеру или загрузите фото — AI опишет окружение', 'Камераны бағыттаңыз немесе сурет жүктеңіз — AI қоршаған ортаны сипаттайды')}
        </p>
      </div>

      <div className="camera-frame">
        {streaming ? (
          <video ref={videoRef} autoPlay playsInline muted style={{ display: 'block' }} />
        ) : previewSrc ? (
          <img src={previewSrc} alt={t('Захваченное изображение', 'Түсірілген сурет')} />
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 260, color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
            {t('Нажмите «Камера» или «Загрузить фото»', '«Камера» немесе «Сурет жүктеу» басыңыз')}
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />

      <div style={{ display: 'flex', gap: 12 }}>
        {!streaming ? (
          <button onClick={startCamera} className="btn-primary" style={{ flex: 1 }}>{t('Камера', 'Камера')}</button>
        ) : (
          <button onClick={captureFrame} className="btn-accent pulse-animation" style={{ flex: 1 }}>{t('Снимок', 'Түсіру')}</button>
        )}
        <button onClick={() => fileInputRef.current?.click()} className="btn-outline" style={{ flex: 1 }}>
          {t('Загрузить фото', 'Сурет жүктеу')}
        </button>
        <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={handleFileUpload} style={{ display: 'none' }} />
      </div>

      {loading && (
        <div className="glass-card slide-up" style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ fontWeight: 600 }}>{t('Анализирую изображение', 'Суретті талдап жатырмын')}<span className="loading-dots" /></p>
        </div>
      )}

      {result && !loading && (
        <div className="glass-card slide-up" style={{ padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a3a6b' }}>
              {t('Результат анализа', 'Талдау нәтижесі')}
            </h2>
            <button onClick={() => speak(result)} className="btn-outline" style={{ padding: '6px 16px', fontSize: 13, minHeight: 36, borderWidth: '1.5px' }}>
              {t('Озвучить', 'Дыбыстау')}
            </button>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{result}</p>
        </div>
      )}

      <div style={{ padding: 20, borderRadius: 14, background: '#fef3c7', fontSize: 13, opacity: 0.5, textAlign: 'center' }}>
        {t('Без ANTHROPIC_API_KEY работает демо-режим', 'ANTHROPIC_API_KEY жоқ болса демо-режим жұмыс істейді')}
      </div>
    </div>
  );
}
