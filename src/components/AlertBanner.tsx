import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import type { Alert } from '../types';

export default function AlertBanner({ alerts }: { alerts: Alert[] }) {
  const [dismissed, setDismissed] = useState(false);
  if (alerts.length === 0 || dismissed) return null;

  return (
    <div style={{
      borderRadius: 12,
      border: '1px solid rgba(239,68,68,0.4)',
      background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.06))',
      padding: '12px 16px',
      display: 'flex',
      gap: 10,
      alignItems: 'flex-start',
    }}>
      <AlertTriangle style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} size={17} />
      <div style={{ flex: 1 }}>
        {alerts.map((a) => (
          <p key={a.id} style={{ color: '#fca5a5', fontSize: 13, fontWeight: 500 }}>
            ⚠️ {a.message}
          </p>
        ))}
      </div>
      <button onClick={() => setDismissed(true)} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }}>
        <X size={15} />
      </button>
    </div>
  );
}
