import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Home() {
  const { t } = useApp();

  const features = [
    {
      path: '/scan',
      title: t('Умные глаза', 'Ақылды көздер'),
      desc: t(
        'Наведите камеру — AI опишет окружение, прочитает текст и озвучит',
        'Камераны бағыттаңыз — AI қоршаған ортаны сипаттайды, мәтінді оқиды'
      ),
      color: '#1a3a6b',
    },
    {
      path: '/sign-language',
      title: t('Жестовый язык', 'Ым тілі'),
      desc: t(
        'Переводим жестовый язык в текст и речь в реальном времени',
        'Ым тілін мәтінге және сөзге нақты уақытта аударамыз'
      ),
      color: '#7c3aed',
    },
    {
      path: '/navigate',
      title: t('Навигатор', 'Навигатор'),
      desc: t(
        'Помощь в навигации с учётом доступности маршрута',
        'Маршруттың қолжетімділігін ескере отырып навигация көмегі'
      ),
      color: '#059669',
    },
    {
      path: '/audit',
      title: t('Аудит доступности', 'Қолжетімділік аудиті'),
      desc: t(
        'Проверка зданий на соответствие стандартам инклюзивности',
        'Ғимараттарды инклюзивтілік стандарттарына сәйкестігін тексеру'
      ),
      color: '#f59e0b',
    },
  ];

  const stats = [
    { num: '2.8M', label: t('Людей с инвалидностью в Казахстане', 'Қазақстандағы мүгедектігі бар адамдар') },
    { num: '< 15%', label: t('Зданий полностью доступны', 'Ғимараттар толық қолжетімді') },
    { num: '72%', label: t('Нуждаются в навигационной помощи', 'Навигациялық көмекке мұқтаж') },
  ];

  return (
    <div className="fade-in">
      {/* Hero */}
      <section className="hero-gradient" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, marginBottom: 16, lineHeight: 1.1 }}>
            Inclusive Vision
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.375rem)', fontWeight: 600, opacity: 0.9, marginBottom: 8 }}>
            {t('Видим мир — для каждого', 'Әлемді көреміз — әрбір адам үшін')}
          </p>
          <p style={{ fontSize: 'clamp(0.875rem, 2vw, 1.063rem)', opacity: 0.7, marginBottom: 40, lineHeight: 1.7 }}>
            {t(
              'AI-платформа для людей с нарушениями зрения и слуха. Компьютерное зрение + голосовой помощник.',
              'Көру және есту қабілеті бұзылған адамдарға арналған AI-платформа. Компьютерлік көру + дауыстық көмекші.'
            )}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
            <Link to="/scan" className="btn-accent" style={{ padding: '14px 36px', fontSize: 15 }}>
              {t('Открыть сканер', 'Сканерді ашу')}
            </Link>
            <Link
              to="/audit"
              className="btn-outline"
              style={{ padding: '14px 36px', fontSize: 15, color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
            >
              {t('Аудит доступности', 'Қолжетімділік аудиті')}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
          {stats.map((s, i) => (
            <div key={i} className="glass-card slide-up" style={{ padding: 28, textAlign: 'center', animationDelay: `${i * 80}ms` }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#1a3a6b' }}>{s.num}</div>
              <div style={{ fontSize: 13, marginTop: 8, opacity: 0.55 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, textAlign: 'center', color: '#1a3a6b', marginBottom: 40 }}>
            {t('Возможности платформы', 'Платформа мүмкіндіктері')}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {features.map((f, i) => (
              <Link
                key={f.path}
                to={f.path}
                className="glass-card slide-up group"
                style={{ padding: 28, animationDelay: `${i * 80}ms`, display: 'block' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      background: `${f.color}12`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: f.color }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: f.color, marginBottom: 6 }}>{f.title}</h3>
                    <p style={{ fontSize: 13, opacity: 0.55, lineHeight: 1.6 }}>{f.desc}</p>
                  </div>
                </div>
                <div
                  className="group-hover:opacity-100"
                  style={{ marginTop: 16, fontSize: 13, fontWeight: 600, color: f.color, opacity: 0, transition: 'opacity 0.2s' }}
                >
                  {t('Перейти →', 'Өту →')}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* B2B */}
      <section style={{ padding: '56px 24px', background: '#f1f5f9' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: '#1a3a6b', marginBottom: 12 }}>
            {t('Для бизнеса и государства', 'Бизнес пен мемлекет үшін')}
          </h2>
          <p style={{ fontSize: 15, opacity: 0.55, marginBottom: 32, lineHeight: 1.7 }}>
            {t(
              'API для автоматической проверки зданий на доступность.',
              'Ғимараттарды қолжетімділікке автоматты тексеруге арналған API.'
            )}
          </p>
          <div
            className="glass-card"
            style={{ padding: 24, textAlign: 'left', fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: 13 }}
          >
            <div style={{ color: '#059669' }}>POST /api/v1/audit</div>
            <div style={{ marginTop: 10, opacity: 0.45 }}>{'{ "image_base64": "...", "lang": "ru" }'}</div>
            <div style={{ marginTop: 10, color: '#f59e0b' }}>{'→ { "score": 72, "passed": [...] }'}</div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 24px', textAlign: 'center', fontSize: 13, opacity: 0.35 }}>
        © 2026 Inclusive Vision — Tumar AI. {t('Все права защищены', 'Барлық құқықтар қорғалған')}.
      </footer>
    </div>
  );
}
