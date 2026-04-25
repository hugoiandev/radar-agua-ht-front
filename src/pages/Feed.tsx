import { useEffect, useState, useCallback } from 'react';
import { getFeed } from '../services/api';
import type { FeedItem } from '../types';
import StatusBadge from '../components/StatusBadge';
import { calcStatus } from '../utils/status';
import { Clock, RefreshCw, Tag, MapPin } from 'lucide-react';

function timeAgo(d: string) {
  const m = Math.floor((Date.now() - new Date(d).getTime()) / 60000);
  if (m < 1) return 'agora';
  if (m < 60) return `${m}min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}d`;
}

export default function Feed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (reset = false) => {
    reset ? setRefreshing(true) : setLoading(true);
    const off = reset ? 0 : offset;
    const data = await getFeed(20, off);
    setItems((p) => (reset ? data : [...p, ...data]));
    setOffset(off + data.length);
    setHasMore(data.length === 20);
    setLoading(false);
    setRefreshing(false);
  }, [offset]);

  useEffect(() => { load(true); }, []);

  return (
    <div className="page" style={{ maxWidth: 720 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="page-title">Relatos recentes</h1>
          <p className="page-sub">Avaliações da população</p>
        </div>
        <button
          onClick={() => load(true)}
          style={{ background: 'rgba(51,65,85,0.4)', border: '1px solid rgba(51,65,85,0.6)', borderRadius: 8, padding: '8px 10px', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center' }}
        >
          <RefreshCw size={15} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((item) => (
          <div key={item.id} className="card" style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* Top */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                <StatusBadge status={calcStatus(item.avgIndex)} />
                <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <MapPin size={11} style={{ color: '#475569', flexShrink: 0 }} />
                  {item.neighborhood.name}
                </span>
              </div>
              <span style={{ fontSize: 11, color: '#334155', display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
                <Clock size={10} /> {timeAgo(item.createdAt)}
              </span>
            </div>

            {/* Scores */}
            <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(30,41,59,0.8)' }}>
              {[
                { label: '💨 Odor', value: item.odor },
                { label: '🎨 Cor', value: item.color },
                { label: '👅 Sabor', value: item.taste },
              ].map((s, i) => {
                const c = s.value >= 4 ? '#22c55e' : s.value >= 2.5 ? '#eab308' : '#ef4444';
                return (
                  <div key={i} style={{ flex: 1, padding: '8px 4px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, background: 'rgba(9,15,30,0.5)', borderRight: i < 2 ? '1px solid rgba(30,41,59,0.8)' : 'none' }}>
                    <span style={{ fontSize: 10, color: '#475569' }}>{s.label}</span>
                    <span style={{ fontSize: 17, fontWeight: 700, color: c }}>{s.value}</span>
                  </div>
                );
              })}
            </div>

            {/* Tags */}
            {item.tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {item.tags.map((t) => (
                  <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, padding: '3px 9px', borderRadius: 99, background: 'rgba(51,65,85,0.4)', color: '#94a3b8', border: '1px solid rgba(51,65,85,0.6)' }}>
                    <Tag size={9} /> {t}
                  </span>
                ))}
              </div>
            )}

            {/* Comment */}
            {item.comment && (
              <p style={{ fontSize: 13, color: '#94a3b8', borderLeft: '3px solid rgba(34,211,238,0.3)', paddingLeft: 10, fontStyle: 'italic', lineHeight: 1.5 }}>
                "{item.comment}"
              </p>
            )}
          </div>
        ))}

        {items.length === 0 && !loading && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#334155', fontSize: 14 }}>
            Nenhum relato ainda. Seja o primeiro! 💧
          </div>
        )}

        {hasMore && !loading && (
          <button onClick={() => load()} style={{ width: '100%', padding: '12px 0', borderRadius: 12, border: '1px solid rgba(51,65,85,0.6)', background: 'rgba(15,23,42,0.6)', color: '#64748b', fontSize: 13, cursor: 'pointer' }}>
            Carregar mais
          </button>
        )}

        {(loading || refreshing) && (
          <div style={{ textAlign: 'center', padding: '32px 0', color: '#334155', fontSize: 13 }}>Carregando...</div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
