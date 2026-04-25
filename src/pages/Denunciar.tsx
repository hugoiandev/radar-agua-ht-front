import { useEffect, useState } from 'react';
import { ExternalLink, Phone, Globe, CheckCircle, Copy, Check, ChevronDown } from 'lucide-react';
import { getNeighborhoods } from '../services/api';
import type { Neighborhood } from '../types';

const CANAIS = [
  { nome: 'SABESP', desc: 'Responsável pelo abastecimento de água em Hortolândia', tel: '0800 055 0195', site: 'https://www.sabesp.com.br', siteName: 'sabesp.com.br', color: '#22d3ee' },
  { nome: 'Prefeitura de Hortolândia', desc: 'Canal oficial da prefeitura', tel: '(19) 3865-3000', site: 'https://www.hortolandia.sp.gov.br', siteName: 'hortolandia.sp.gov.br', color: '#818cf8' },
  { nome: 'CETESB', desc: 'Agência Ambiental do Estado de SP', tel: '0800 055 1560', site: 'https://cetesb.sp.gov.br', siteName: 'cetesb.sp.gov.br', color: '#34d399' },
  { nome: 'PROCON Hortolândia', desc: 'Defesa do consumidor', tel: '(19) 3865-3700', site: null, siteName: null, color: '#fb923c' },
];

export default function Denunciar() {
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [bairro, setBairro] = useState('');
  const [problema, setProblema] = useState('');

  useEffect(() => { getNeighborhoods().then(setNeighborhoods); }, []);
  const [denounced, setDenounced] = useState(false);
  const [copied, setCopied] = useState(false);

  const hoje = new Date().toLocaleDateString('pt-BR');
  const texto = bairro && problema
    ? `Moradores do bairro ${bairro} estão relatando ${problema} na água desde o dia ${hoje}.`
    : '';

  const copy = () => {
    if (!texto) return;
    navigator.clipboard.writeText(texto);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="page" style={{ maxWidth: 680 }}>
      <div>
        <h1 className="page-title">Denunciar problema</h1>
        <p className="page-sub">Relate formalmente para as autoridades responsáveis</p>
      </div>

      {/* Banner */}
      <div style={{ borderRadius: 14, border: '1px solid rgba(251,146,60,0.3)', background: 'rgba(251,146,60,0.08)', padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <span style={{ fontSize: 22, flexShrink: 0 }}>📢</span>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: '#fdba74' }}>Sua voz faz diferença!</p>
          <p style={{ fontSize: 12, color: '#92653a', marginTop: 3, lineHeight: 1.5 }}>Quanto mais denúncias, mais rápido o problema é resolvido pela empresa responsável.</p>
        </div>
      </div>

      {/* Text generator */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(30,41,59,0.8)' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>Gerar texto de denúncia</h2>
          <p style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>Preencha para criar um texto pronto para copiar</p>
        </div>
        <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="denunciar-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8 }}>Bairro</label>
              <div style={{ position: 'relative' }}>
                <select
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="input-base"
                  style={{ paddingRight: 32, appearance: 'none', cursor: 'pointer', color: bairro ? '#e2e8f0' : '#475569' }}
                >
                  <option value="">Selecione o bairro...</option>
                  {neighborhoods.map((n) => <option key={n.id} value={n.name}>{n.name}</option>)}
                </select>
                <ChevronDown size={13} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: 0.8 }}>Problema</label>
              <input value={problema} onChange={(e) => setProblema(e.target.value)} placeholder="Ex: forte odor de esgoto" className="input-base" />
            </div>
          </div>

          {texto ? (
            <div style={{ borderRadius: 10, background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(34,211,238,0.2)', padding: '12px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <p style={{ flex: 1, fontSize: 13, color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.6 }}>"{texto}"</p>
              <button
                onClick={copy}
                style={{ flexShrink: 0, padding: '6px 12px', borderRadius: 8, background: copied ? 'rgba(34,197,94,0.15)' : 'rgba(34,211,238,0.1)', border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'rgba(34,211,238,0.2)'}`, color: copied ? '#22c55e' : '#22d3ee', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                {copied ? <><Check size={11} /> Copiado</> : <><Copy size={11} /> Copiar</>}
              </button>
            </div>
          ) : (
            <div style={{ borderRadius: 10, background: 'rgba(15,23,42,0.5)', border: '1px dashed rgba(51,65,85,0.5)', padding: '12px', textAlign: 'center', color: '#334155', fontSize: 12 }}>
              Preencha os campos para gerar o texto
            </div>
          )}
        </div>
      </div>

      {/* Channels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>Canais oficiais</h2>
        {CANAIS.map((c) => (
          <div key={c.nome} className="card" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 16px' }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: `${c.color}15`, border: `1px solid ${c.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Phone size={15} style={{ color: c.color }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0' }}>{c.nome}</p>
              <p style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>{c.desc}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end', flexShrink: 0 }}>
              <a href={`tel:${c.tel.replace(/\D/g, '')}`} style={{ fontSize: 12, fontWeight: 600, color: c.color, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Phone size={11} /> {c.tel}
              </a>
              {c.site && (
                <a href={c.site} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Globe size={10} /> {c.siteName} <ExternalLink size={9} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Already reported */}
      {!denounced ? (
        <button onClick={() => setDenounced(true)} style={{ width: '100%', padding: '13px 0', borderRadius: 12, border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', color: '#22c55e', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          ✅ Já fiz minha denúncia
        </button>
      ) : (
        <div style={{ borderRadius: 12, border: '1px solid rgba(34,197,94,0.3)', background: 'rgba(34,197,94,0.08)', padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
          <CheckCircle size={22} style={{ color: '#22c55e' }} />
          <p style={{ fontSize: 14, fontWeight: 600, color: '#22c55e' }}>Obrigado por denunciar!</p>
          <p style={{ fontSize: 12, color: '#166534' }}>Sua ação contribui para uma Hortolândia melhor.</p>
        </div>
      )}

      <style>{`
        .denunciar-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        @media (min-width: 480px) {
          .denunciar-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
