import { Link, useLocation } from 'react-router-dom';
import { Droplets, Home, Map, MessageSquare, PlusCircle, BarChart2, Megaphone } from 'lucide-react';

const LINKS = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/bairros', label: 'Bairros', icon: Map },
  { to: '/feed', label: 'Relatos', icon: MessageSquare },
  { to: '/avaliar', label: 'Avaliar', icon: PlusCircle },
  { to: '/historico', label: 'Histórico', icon: BarChart2 },
  { to: '/denunciar', label: 'Denunciar', icon: Megaphone },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <>
      {/* ── Top bar ── */}
      <nav className="top-nav">
        <div className="top-nav-inner">
          <Link to="/" className="nav-logo">
            <Droplets size={20} />
            <span className="nav-logo-text">Radar Água Hortolândia</span>
          </Link>

          <div className="top-nav-links">
            {LINKS.map((l) => {
              const active = pathname === l.to;
              return (
                <Link key={l.to} to={l.to} className={`top-link ${active ? 'top-link-active' : ''}`}>
                  <l.icon size={14} />
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── Bottom nav (mobile only) ── */}
      <nav className="bottom-nav">
        {LINKS.map((l) => {
          const active = pathname === l.to;
          return (
            <Link key={l.to} to={l.to} className={`bottom-link ${active ? 'bottom-link-active' : ''}`}>
              <l.icon size={20} />
              <span className="bottom-link-label">{l.label}</span>
            </Link>
          );
        })}
      </nav>

      <style>{`
        /* ── Top bar ── */
        .top-nav {
          background: rgba(6,12,26,0.88);
          border-bottom: 1px solid rgba(51,65,85,0.55);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .top-nav-inner {
          max-width: 1024px;
          margin: 0 auto;
          padding: 0 20px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #22d3ee;
          font-weight: 700;
          font-size: 17px;
          text-decoration: none;
          flex-shrink: 0;
        }
        .nav-logo-text { display: none; }
        .top-nav-links { display: none; }
        .top-link {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          color: #94a3b8;
          background: transparent;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.15s;
          border: 1px solid transparent;
          font-weight: 400;
        }
        .top-link-active {
          color: #22d3ee;
          background: rgba(34,211,238,0.12);
          border-color: rgba(34,211,238,0.25);
          font-weight: 600;
        }

        /* ── Bottom nav (mobile) ── */
        .bottom-nav {
          display: flex;
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 50;
          background: rgba(6,12,26,0.96);
          border-top: 1px solid rgba(51,65,85,0.6);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding-bottom: env(safe-area-inset-bottom);
        }
        .bottom-link {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding: 10px 4px;
          text-decoration: none;
          color: #475569;
          transition: color 0.15s;
        }
        .bottom-link-active { color: #22d3ee; }
        .bottom-link-label {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.2px;
          white-space: nowrap;
        }

        /* ── Desktop breakpoint ── */
        @media (min-width: 640px) {
          .nav-logo-text { display: inline; }
          .top-nav-links { display: flex; gap: 2px; }
          .bottom-nav { display: none; }
        }

        /* ── Mobile page padding for bottom nav ── */
        @media (max-width: 639px) {
          main { padding-bottom: 72px !important; }
        }
      `}</style>
    </>
  );
}
