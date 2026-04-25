import { useEffect, useState } from 'react';
import { getHistory, getNeighborhoods } from '../services/api';
import type { HistoryData, Neighborhood } from '../types';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Minus, ChevronDown } from 'lucide-react';

const PERIODS = [
  { value: '24h', label: '24h' },
  { value: '7d', label: '7d' },
  { value: '30d', label: '30d' },
] as const;

const TREND = {
  melhora: { icon: TrendingUp, color: '#22c55e', label: 'Melhora', bg: 'rgba(34,197,94,0.1)' },
  piora: { icon: TrendingDown, color: '#ef4444', label: 'Piora', bg: 'rgba(239,68,68,0.1)' },
  estavel: { icon: Minus, color: '#64748b', label: 'Estável', bg: 'rgba(100,116,139,0.1)' },
};

function fmt(t: string, p: string) {
  const d = new Date(t);
  return p === '24h'
    ? d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

export default function Historico() {
  const [period, setPeriod] = useState<'24h' | '7d' | '30d'>('24h');
  const [neighborhoodId, setNeighborhoodId] = useState('');
  const [history, setHistory] = useState<HistoryData | null>(null);
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getNeighborhoods().then(setNeighborhoods); }, []);
  useEffect(() => {
    setLoading(true);
    getHistory(period, neighborhoodId || undefined).then(setHistory).finally(() => setLoading(false));
  }, [period, neighborhoodId]);

  const trend = history?.trend ? TREND[history.trend] : null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: '#0f172a', border: '1px solid rgba(51,65,85,0.8)', borderRadius: 10, padding: '10px 14px' }}>
        <p style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>{fmt(label, period)}</p>
        <p style={{ fontSize: 16, fontWeight: 700, color: '#22d3ee' }}>{payload[0].value?.toFixed(2)}</p>
        <p style={{ fontSize: 11, color: '#334155' }}>{payload[0].payload?.count} avaliações</p>
      </div>
    );
  };

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Histórico</h1>
        <p className="page-sub">Tendência da qualidade da água ao longo do tempo</p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', background: 'rgba(9,15,30,0.8)', border: '1px solid rgba(51,65,85,0.6)', borderRadius: 10, padding: 3, gap: 2 }}>
          {PERIODS.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              style={{
                padding: '6px 14px', borderRadius: 7, fontSize: 13, fontWeight: period === p.value ? 600 : 400,
                background: period === p.value ? 'rgba(34,211,238,0.15)' : 'transparent',
                color: period === p.value ? '#22d3ee' : '#64748b',
                border: period === p.value ? '1px solid rgba(34,211,238,0.25)' : '1px solid transparent',
                cursor: 'pointer', transition: 'all 0.12s',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
          <select
            value={neighborhoodId}
            onChange={(e) => setNeighborhoodId(e.target.value)}
            className="input-base"
            style={{ paddingRight: 32, appearance: 'none', cursor: 'pointer' }}
          >
            <option value="">Cidade toda</option>
            {neighborhoods.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* Chart card */}
      <div className="card">
        {history && !loading && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, gap: 12, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: 1 }}>Avaliações no período</p>
              <p style={{ fontSize: 26, fontWeight: 800, color: '#e2e8f0', letterSpacing: -1 }}>{history.totalEvaluations}</p>
            </div>
            {trend && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '7px 14px', borderRadius: 10, background: trend.bg, border: `1px solid ${trend.color}30` }}>
                <trend.icon size={15} style={{ color: trend.color }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: trend.color }}>{trend.label}</span>
              </div>
            )}
          </div>
        )}

        {loading ? (
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155', fontSize: 13 }}>
            Carregando...
          </div>
        ) : !history || history.points.length === 0 ? (
          <div style={{ height: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#334155' }}>
            <span style={{ fontSize: 32 }}>📊</span>
            <p style={{ fontSize: 13 }}>Sem dados para este período</p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={history.points} margin={{ top: 5, right: 4, bottom: 0, left: -28 }}>
                <defs>
                  <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tickFormatter={(v) => fmt(v, period)} tick={{ fill: '#334155', fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 5]} tick={{ fill: '#334155', fontSize: 10 }} axisLine={false} tickLine={false} ticks={[0, 2.5, 4, 5]} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={4} stroke="#22c55e" strokeDasharray="4 4" strokeOpacity={0.25} />
                <ReferenceLine y={2.5} stroke="#eab308" strokeDasharray="4 4" strokeOpacity={0.25} />
                <Area type="monotone" dataKey="index" stroke="#22d3ee" strokeWidth={2} fill="url(#wg)" dot={false} activeDot={{ r: 4, fill: '#22d3ee', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 10, flexWrap: 'wrap' }}>
              {[{ c: '#22c55e', l: '≥4 Boa' }, { c: '#eab308', l: '≥2.5 Atenção' }, { c: '#ef4444', l: '<2.5 Crítica' }].map((s) => (
                <span key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#475569' }}>
                  <span style={{ width: 14, height: 2, background: s.c, display: 'inline-block', borderRadius: 1 }} /> {s.l}
                </span>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
