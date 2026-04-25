import type { WaterStatus } from '../types';

const CONFIG: Record<WaterStatus, { label: string; color: string; bg: string; border: string }> = {
  boa: { label: 'Boa', color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)' },
  atencao: { label: 'Atenção', color: '#eab308', bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)' },
  critica: { label: 'Crítica', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
};

const DOT: Record<WaterStatus, string> = {
  boa: '🟢',
  atencao: '🟡',
  critica: '🔴',
};

export default function StatusBadge({ status, size = 'sm' }: { status: WaterStatus | null; size?: 'sm' | 'md' }) {
  if (!status) {
    return (
      <span style={{ fontSize: 11, color: '#475569', background: 'rgba(71,85,105,0.15)', border: '1px solid rgba(71,85,105,0.3)', padding: '2px 8px', borderRadius: 99 }}>
        Sem dados
      </span>
    );
  }
  const cfg = CONFIG[status];
  const fs = size === 'md' ? 13 : 11;
  return (
    <span style={{
      fontSize: fs,
      fontWeight: 600,
      color: cfg.color,
      background: cfg.bg,
      border: `1px solid ${cfg.border}`,
      padding: size === 'md' ? '4px 12px' : '2px 8px',
      borderRadius: 99,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      whiteSpace: 'nowrap',
    }}>
      {DOT[status]} {cfg.label}
    </span>
  );
}
