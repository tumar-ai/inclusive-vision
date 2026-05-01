import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Header() {
  const { lang, setLang, highContrast, toggleContrast, cycleFontSize, fontSize, t } = useApp();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('Главная', 'Басты бет') },
    { path: '/scan', label: t('Сканер', 'Сканер') },
    { path: '/sign-language', label: t('Жесты', 'Ымдар') },
    { path: '/navigate', label: t('Навигация', 'Навигация') },
    { path: '/audit', label: t('Аудит', 'Аудит') },
    { path: '/dashboard', label: t('Дашборд', 'Дашборд') },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #e8ecf1',
      }}
    >
      {/* Top bar */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #1a3a6b, #2a5298)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 800,
                fontSize: 14,
              }}
            >
              IV
            </div>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#1a3a6b' }}>
              Inclusive Vision
            </span>
          </Link>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => setLang(lang === 'ru' ? 'kz' : 'ru')}
              className="btn-outline"
              style={{ padding: '6px 14px', fontSize: 13, minHeight: 36, borderWidth: '1.5px' }}
            >
              {lang === 'ru' ? 'KZ' : 'RU'}
            </button>
            <button
              onClick={cycleFontSize}
              className="btn-outline"
              style={{ padding: '6px 14px', fontSize: 13, minHeight: 36, borderWidth: '1.5px' }}
            >
              A{fontSize === 'large' ? '+' : fontSize === 'xlarge' ? '++' : ''}
            </button>
            <button
              onClick={toggleContrast}
              className={highContrast ? 'btn-accent' : 'btn-outline'}
              style={{ padding: '6px 14px', fontSize: 13, minHeight: 36, borderWidth: '1.5px' }}
            >
              ◐
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
        <nav
          className="scrollbar-hide"
          style={{
            display: 'flex',
            gap: 6,
            overflowX: 'auto',
            paddingBottom: 12,
          }}
        >
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                padding: '8px 18px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
                color: isActive(item.path) ? 'white' : '#64748b',
                background: isActive(item.path) ? 'linear-gradient(135deg, #1a3a6b, #2a5298)' : '#f1f5f9',
                transition: 'all 0.15s ease',
              }}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
