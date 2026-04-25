import { useEffect, useState } from 'react';
import { getNeighborhoods } from '../services/api';
import type { Neighborhood } from '../types';
import StatusBadge from '../components/StatusBadge';
import { Search, Users, ChevronDown } from 'lucide-react';

export default function Bairros() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'index' | 'name'>('index');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNeighborhoods().then((d) => { setNeighborhoods(d); setLoading(false); });
  }, []);

  const filtered = [...neighborhoods]
    .filter((n) => n.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'index') {
        if (a.index === null && b.index === null) return 0;
        if (a.index === null) return 1;
        if (b.index === null) return -1;
        return a.index - b.index;
      }
      return a.name.localeCompare(b.name, 'pt-BR');
    });

  const counts = { boa: 0, atencao: 0, critica: 0, sem: 0 };
  neighborhoods.forEach((n) => { if (!n.status) counts.sem++; else counts[n.status]++; });

  return (
    <div className="page">
      <div>
        <h1 className="page-title">Bairros de Hortolândia</h1>
        <p className="page-sub">Qualidade da água por bairro</p>
      </div>

      {/* Summary pills */}
      {!loading && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { label: 'Boa', count: counts.boa, color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
            { label: 'Atenção', count: counts.atencao, color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.25)' },
            { label: 'Crítica', count: counts.critica, color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
            { label: 'Sem dados', count: counts.sem, color: '#64748b', bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.25)' },
          ].map((s) => (
            <div key={s.label} style={{ padding: '4px 12px', borderRadius: 99, border: `1px solid ${s.border}`, background: s.bg, fontSize: 12, fontWeight: 600, color: s.color }}>
              {s.count} {s.label}
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar bairro..."
            className="input-base"
            style={{ paddingLeft: 34 }}
          />
        </div>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'index' | 'name')}
            className="input-base"
            style={{ paddingRight: 32, appearance: 'none', cursor: 'pointer', width: 'auto' }}
          >
            <option value="index">Pior primeiro</option>
            <option value="name">A – Z</option>
          </select>
          <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
        </div>
      </div>

      {/* List */}
      <div style={{ borderRadius: 16, border: '1px solid rgba(51,65,85,0.7)', overflow: 'hidden', background: 'rgba(9,15,30,0.8)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '28px 1fr auto auto', gap: 0, padding: '8px 14px', background: 'rgba(15,23,42,0.9)', borderBottom: '1px solid rgba(51,65,85,0.5)' }}>
          <span style={{ fontSize: 10, color: '#334155', fontWeight: 700 }}>#</span>
          <span style={{ fontSize: 10, color: '#334155', fontWeight: 700 }}>BAIRRO</span>
          <span style={{ fontSize: 10, color: '#334155', fontWeight: 700, textAlign: 'center', minWidth: 44 }}>IDX</span>
          <span style={{ fontSize: 10, color: '#334155', fontWeight: 700, textAlign: 'right', minWidth: 72 }}>STATUS</span>
        </div>

        {loading ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#334155', fontSize: 13 }}>Carregando...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: '#334155', fontSize: 13 }}>Nenhum bairro encontrado</div>
        ) : (
          filtered.map((n, i) => (
            <div
              key={n.id}
              style={{
                display: 'grid', gridTemplateColumns: '28px 1fr auto auto', alignItems: 'center',
                padding: '11px 14px',
                borderBottom: i < filtered.length - 1 ? '1px solid rgba(30,41,59,0.7)' : 'none',
                background: i % 2 === 0 ? 'transparent' : 'rgba(15,23,42,0.35)',
              }}
            >
              <span style={{ fontSize: 10, color: '#334155', fontWeight: 700 }}>{i + 1}</span>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: 13, color: '#cbd5e1', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.name}</p>
                {n.totalEvaluations > 0 && (
                  <p style={{ fontSize: 10, color: '#334155', display: 'flex', alignItems: 'center', gap: 3, marginTop: 1 }}>
                    <Users size={9} /> {n.totalEvaluations}
                  </p>
                )}
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: n.index !== null ? '#94a3b8' : '#334155', fontFamily: 'monospace', textAlign: 'center', minWidth: 44 }}>
                {n.index !== null ? n.index.toFixed(1) : '—'}
              </span>
              <div style={{ display: 'flex', justifyContent: 'flex-end', minWidth: 72 }}>
                <StatusBadge status={n.status} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
