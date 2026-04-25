import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCityIndex, getAlerts, getNeighborhoods } from '../services/api';
import type { CityIndex, Alert, Neighborhood } from '../types';
import WaterGauge from '../components/WaterGauge';
import AlertBanner from '../components/AlertBanner';
import StatusBadge from '../components/StatusBadge';
import { RefreshCw, ChevronRight, Droplets, BarChart2, Megaphone, PlusCircle } from 'lucide-react';

const QUICK = [
  { to: '/avaliar', icon: PlusCircle, label: 'Avaliar água', sub: 'Envie sua avaliação', color: '#22d3ee', bg: 'rgba(34,211,238,0.08)', border: 'rgba(34,211,238,0.2)' },
  { to: '/bairros', icon: Droplets, label: 'Por bairro', sub: 'Veja seu bairro', color: '#818cf8', bg: 'rgba(129,140,248,0.08)', border: 'rgba(129,140,248,0.2)' },
  { to: '/historico', icon: BarChart2, label: 'Histórico', sub: 'Tendência ao longo do tempo', color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
  { to: '/denunciar', icon: Megaphone, label: 'Denunciar', sub: 'Canais oficiais', color: '#fb923c', bg: 'rgba(251,146,60,0.08)', border: 'rgba(251,146,60,0.2)' },
];

export default function Home() {
  const [cityIndex, setCityIndex] = useState<CityIndex | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [worst, setWorst] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (spin = false) => {
    spin ? setRefreshing(true) : setLoading(true);
    try {
      const [idx, alts, hoods] = await Promise.all([getCityIndex(), getAlerts(), getNeighborhoods()]);
      setCityIndex(idx);
      setAlerts(alts);
      setWorst(
        [...hoods].filter((n) => n.index !== null).sort((a, b) => (a.index ?? 5) - (b.index ?? 5)).slice(0, 6),
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <>
      <div className="page" style={{ maxWidth: 960 }}>
        <AlertBanner alerts={alerts} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 className="page-title">Radar Água Hortolândia</h1>
            <p className="page-sub">Monitoramento colaborativo · Hortolândia, SP</p>
          </div>
          <button
            onClick={() => load(true)}
            style={{ background: 'rgba(51,65,85,0.4)', border: '1px solid rgba(51,65,85,0.6)', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
          >
            <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          </button>
        </div>

        {/* Gauge */}
        <div className="card" style={{ position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
          <div style={{
            position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)',
            width: 280, height: 280, borderRadius: '50%',
            background: cityIndex?.status === 'boa' ? 'rgba(34,197,94,0.05)' : cityIndex?.status === 'critica' ? 'rgba(239,68,68,0.05)' : 'rgba(234,179,8,0.05)',
            filter: 'blur(60px)', pointerEvents: 'none',
          }} />
          <p style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: 1.5, fontWeight: 600, marginBottom: 8 }}>
            Índice Geral da Cidade
          </p>
          {loading
            ? <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569', fontSize: 13 }}>Carregando...</div>
            : <WaterGauge index={cityIndex?.index ?? null} status={cityIndex?.status ?? null} />
          }
          <p style={{ fontSize: 11, color: '#334155', fontStyle: 'italic', marginTop: 12 }}>
            ⚠️ Dados baseados em relatos da população
            {cityIndex?.totalEvaluations ? ` · ${cityIndex.totalEvaluations} avaliações` : ''}
          </p>
        </div>

        {/* Quick links */}
        <div className="quick-grid">
          {QUICK.map((l) => (
            <Link key={l.to} to={l.to} className="quick-card" style={{ border: `1px solid ${l.border}`, background: l.bg }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${l.color}18`, border: `1px solid ${l.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <l.icon size={17} style={{ color: l.color }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{l.label}</div>
                <div style={{ fontSize: 11, color: '#64748b', marginTop: 1 }}>{l.sub}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* Worst */}
        {worst.length > 0 && (
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>Piores bairros agora</h2>
                <p style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Ordenado por menor índice</p>
              </div>
              <Link to="/bairros" style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: '#22d3ee', textDecoration: 'none' }}>
                Ver todos <ChevronRight size={13} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {worst.map((n, i) => (
                <div key={n.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 10px', borderRadius: 8, background: i % 2 === 0 ? 'rgba(15,23,42,0.5)' : 'transparent' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                    <span style={{ fontSize: 10, color: '#334155', fontWeight: 700, width: 18, textAlign: 'right', flexShrink: 0 }}>#{i + 1}</span>
                    <span style={{ fontSize: 13, color: '#cbd5e1', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.name}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: '#64748b', fontFamily: 'monospace' }}>{n.index?.toFixed(1)}</span>
                    <StatusBadge status={n.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .quick-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .quick-card {
          border-radius: 14px;
          padding: 14px;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: opacity 0.15s;
        }
        .quick-card:active { opacity: 0.75; }
        @media (min-width: 640px) {
          .quick-grid { grid-template-columns: repeat(4, 1fr); }
          .quick-card { padding: 16px 18px; gap: 12px; }
        }
      `}</style>
    </>
  );
}
