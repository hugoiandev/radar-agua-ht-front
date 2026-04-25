import { useEffect, useState } from 'react';
import { getNeighborhoods, createEvaluation } from '../services/api';
import type { Neighborhood } from '../types';
import { CheckCircle, ChevronDown } from 'lucide-react';

const TAGS = ['Cheiro de esgoto', 'Água turva', 'Gosto estranho', 'Cor escura', 'Sem problemas'];

function RatingRow({ emoji, label, value, onChange }: { emoji: string; label: string; value: number; onChange: (v: number) => void }) {
  return (
    <>
      <div className="rating-row">
        <span className="rating-label">{emoji} {label}</span>
        <div className="rating-buttons">
          {[0, 1, 2, 3, 4, 5].map((n) => {
            const active = n <= value;
            const color = n === 0 ? '#ef4444' : n <= 2 ? '#f97316' : n <= 3 ? '#eab308' : '#22c55e';
            return (
              <button
                key={n}
                type="button"
                onClick={() => onChange(n)}
                className="rating-btn"
                style={{
                  border: active ? `1px solid ${color}50` : '1px solid rgba(51,65,85,0.5)',
                  background: active ? `${color}20` : 'rgba(15,23,42,0.6)',
                  color: active ? color : '#334155',
                }}
              >
                {n}
              </button>
            );
          })}
        </div>
      </div>
      <style>{`
        .rating-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(30,41,59,0.6);
        }
        .rating-label {
          font-size: 14px;
          color: #cbd5e1;
          font-weight: 500;
          min-width: 80px;
          flex-shrink: 0;
        }
        .rating-buttons {
          display: flex;
          gap: 4px;
        }
        .rating-btn {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.12s;
          flex-shrink: 0;
        }
        @media (max-width: 400px) {
          .rating-btn { width: 30px; height: 30px; font-size: 12px; }
          .rating-label { font-size: 13px; min-width: 70px; }
        }
      `}</style>
    </>
  );
}

export default function Avaliar() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [neighborhoodId, setNeighborhoodId] = useState('');
  const [odor, setOdor] = useState(3);
  const [color, setColor] = useState(3);
  const [taste, setTaste] = useState(3);
  const [tags, setTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { getNeighborhoods().then(setNeighborhoods); }, []);

  const toggleTag = (tag: string) =>
    setTags((p) => p.includes(tag) ? p.filter((t) => t !== tag) : [...p, tag]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!neighborhoodId) { setError('Selecione um bairro'); return; }
    setSubmitting(true);
    setError('');
    try {
      const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
      let recaptchaToken = 'no-recaptcha';
      if (siteKey && (window as any).grecaptcha) {
        recaptchaToken = await new Promise<string>((resolve, reject) =>
          (window as any).grecaptcha.ready(() =>
            (window as any).grecaptcha.execute(siteKey, { action: 'avaliar' }).then(resolve).catch(reject)
          )
        );
      }
      await createEvaluation({ neighborhoodId, odor, color, taste, tags, comment: comment || undefined, recaptchaToken });
      setSuccess(true);
      setComment('');
      setTags([]);
    } catch (err: any) {
      if (err?.response?.status === 429) {
        setError('Você já avaliou recentemente. Aguarde 10 minutos.');
      } else {
        const msg = err?.response?.data?.message;
        setError(typeof msg === 'string' ? msg : 'Erro ao enviar. Tente novamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '64px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle size={36} style={{ color: '#22c55e' }} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f1f5f9' }}>Avaliação enviada!</h2>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6 }}>Obrigado por contribuir com o monitoramento da qualidade da água em Hortolândia.</p>
        <button onClick={() => setSuccess(false)} style={{ marginTop: 8, padding: '11px 28px', borderRadius: 10, background: 'rgba(34,211,238,0.15)', border: '1px solid rgba(34,211,238,0.3)', color: '#22d3ee', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Enviar outra avaliação
        </button>
      </div>
    );
  }

  return (
    <div className="page" style={{ maxWidth: 560 }}>
      <div>
        <h1 className="page-title">Avaliar qualidade</h1>
        <p className="page-sub">Anônimo · sem cadastro · 1 avaliação por 10 minutos</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Bairro */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8 }}>Bairro *</label>
          <div style={{ position: 'relative' }}>
            <select
              value={neighborhoodId}
              onChange={(e) => setNeighborhoodId(e.target.value)}
              className="input-base"
              style={{ paddingRight: 36, appearance: 'none', cursor: 'pointer', borderColor: neighborhoodId ? 'rgba(34,211,238,0.3)' : undefined, color: neighborhoodId ? '#e2e8f0' : '#475569' }}
            >
              <option value="">Selecione seu bairro...</option>
              {neighborhoods.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
            </select>
            <ChevronDown size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Ratings */}
        <div className="card" style={{ padding: '4px 16px 0' }}>
          <p style={{ fontSize: 11, color: '#334155', fontWeight: 700, letterSpacing: 1.2, textTransform: 'uppercase', padding: '12px 0 4px' }}>
            Notas — 0 = ruim · 5 = ótimo
          </p>
          <RatingRow emoji="💨" label="Odor" value={odor} onChange={setOdor} />
          <RatingRow emoji="🎨" label="Cor" value={color} onChange={setColor} />
          <RatingRow emoji="👅" label="Sabor" value={taste} onChange={setTaste} />
          <div style={{ height: 12 }} />
        </div>

        {/* Tags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8 }}>Observações</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {TAGS.map((tag) => {
              const active = tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  style={{
                    padding: '7px 14px', borderRadius: 99, fontSize: 13, fontWeight: 500, cursor: 'pointer',
                    border: active ? '1px solid rgba(34,211,238,0.4)' : '1px solid rgba(51,65,85,0.6)',
                    background: active ? 'rgba(34,211,238,0.12)' : 'rgba(15,23,42,0.7)',
                    color: active ? '#22d3ee' : '#64748b',
                    transition: 'all 0.12s',
                  }}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Comment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8 }}>Comentário</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="Descreva o que observou..."
            className="input-base"
            style={{ resize: 'vertical', lineHeight: 1.5 }}
          />
          <span style={{ fontSize: 11, color: '#334155', textAlign: 'right' }}>{comment.length}/500</span>
        </div>

        {error && (
          <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', fontSize: 13 }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={submitting} className="btn-primary">
          {submitting ? 'Enviando...' : '💧 Enviar avaliação'}
        </button>

        <p style={{ textAlign: 'center', fontSize: 11, color: '#334155' }}>
          ⚠️ Dados baseados em relatos da população
        </p>
      </form>
    </div>
  );
}
