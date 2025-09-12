
import React, { useEffect, useMemo, useState } from "react";

// Utils de cores
function clamp01(n: any) {
  const x = Number.isFinite(n) ? Number(n) : 0;
  return x < 0 ? 0 : x > 1 ? 1 : x;
}
function withAlpha(color: string, alpha: number = 1) {
  try {
    const a = clamp01(alpha);
    if (typeof color !== 'string') return `rgba(0,0,0,${a})`;
    const c = color.trim();

    const m = c.match(/^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+))?\s*\)$/i);
    if (m) {
      const r = Math.max(0, Math.min(255, parseInt(m[1], 10)));
      const g = Math.max(0, Math.min(255, parseInt(m[2], 10)));
      const b = Math.max(0, Math.min(255, parseInt(m[3], 10)));
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    }

    const h = c.replace(/^#/, '').toLowerCase();
    if (!/^[0-9a-f]{3,8}$/.test(h)) return `rgba(0,0,0,${a})`;
    let r: number, g: number, b: number;
    if (h.length === 3 || h.length === 4) {
      r = parseInt(h[0] + h[0], 16);
      g = parseInt(h[1] + h[1], 16);
      b = parseInt(h[2] + h[2], 16);
    } else {
      r = parseInt(h.slice(0, 2), 16);
      g = parseInt(h.slice(2, 4), 16);
      b = parseInt(h.slice(4, 6), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  } catch {
    return `rgba(0,0,0,${clamp01(alpha)})`;
  }
}

const COLORS = Object.freeze({
  bg: "#1f1f1f",
  accent: "#e8b912",
  alert: "#ab0101",
  text: "#ffffff",
  button: "#4CAF50",
  loginButton: "#a40000"
} as const);

const AUTH = { email: "cliente713@umpicnic.com", password: "c713" } as const;

type Module = { id: string; title: string; description: string; image: string; lessons: string[]; };

const MODULES: Module[] = [
  { id: "mod-1", title: "Módulo 1 - Boas-Vindas", description: "Aulas introdutórias e visão geral do curso.", image: "https://i.imgur.com/UtwSQ5B.jpeg", lessons: [
    "AULA1: Agradecimento.",
    "AULA2: Como o curso deve ser consumido.",
    "AULA4: Certificado.",
    "Aula 5: Como entrar na comunidade exclusiva do curso.",
    "Aula 6: Visão geral do que você será capaz de fazer ao final do curso."
  ]},
  { id: "mod-2", title: "Módulo 2 - Marca", description: "Fundamentos de branding e construção de marca.", image: "https://i.imgur.com/2tigiLN.jpeg", lessons: [
    "AULA1: O que é e para que serve uma marca? Conceitos gerais e básicos.",
    "AULA2: Roube como um artista.",
    "AULA3: Vision board.",
    "AULA4: Personagem.",
    "AULA5: Regras.",
    "AULA6: Elementos.",
    "AULA7: Comunidade.",
    "AULA8: Público-alvo.",
    "AULA9: Posicionamento de marca.",
    "AULA10: Storytelling.",
    "AULA11: Cultura e emoção.",
    "AULA 12: Personalidade.",
    "AULA13: Distribuição.",
    "AULA14: Estraégia de marca.",
    "AULA15: Formatos.",
    "AULA16: Análise.",
    "AULA17: Arquétipos de Marca.",
    "AULA18: Voz e Tom de Comunicação."
  ]},
  { id: "mod-3", title: "Módulo 3 - N8N", description: "Automação com n8n e fluxos inteligentes.", image: "https://i.imgur.com/rXl5zvU.jpeg", lessons: [
    "AULA1: O que é e para que serve o N8N.",
    "AULA2: Instalação e acesso",
    "AULA3: Interface do n8n (workflows, nodes, executions, menu lateral)",
    "AULA4: Posso usar outro programa.",
    "AULA5: O que dá para fazer com o n8n?",
    "AULA6: O que são fluxos e templates.",
    "AULA7: Tipos de nodes (triggers, actions, utils, transforms, AI, etc.).",
    "AULA8: Variáveis e dados entre nodes (Items, JSON, parâmetros).",
    "AULA9: Uso do Set e Function para manipular dados.",
    "AULA10: Estruturas de decisão (IF, Switch, Merge, SplitInBatches).",
    "AULA11: Erros e retries (Error Workflow e práticas de resiliência).",
    "AULA12: Versionamento e backups de workflows.",
    "AULA13: Criação de conectores/nodes customizados."
  ]},
  { id: "mod-4", title: "Módulo 4 - Agente de IA no WhatsApp", description: "Como criar e integrar agentes de IA no WhatsApp.", image: "https://i.imgur.com/GPWXxjm.jpeg", lessons: [
    "Aula 1: O que é um agente de IA e como funciona no WhatsApp.",
    "Aula 2: Opções de conexão: WhatsApp Business API, Twilio, Gupshup, Z-API, 360Dialog.",
    "Aula 3: Configuração inicial de uma API de WhatsApp.",
    "Aula 4: Estrutura de um agente vendedor (captura → qualificação → resposta → fechamento).",
    "Aula 5: Integração com IA (ChatGPT/LLM + n8n).",
    "Aula 6: Criação de atendimento.",
    "Aula 7: Estrutura de mensagens: saudação, quebra de objeções, fechamento.",
    "Aula 8: Captura de leads (nome, e-mail, produto de interesse).",
    "Aula 9: Agendamento automático de reuniões/consultas.",
    "Aula 10: Fluxo de suporte e FAQ automático.",
    "Aula 11: Como monitorar conversas e intervir manualmente.",
    "Aula 13: Multiagente (quando usar mais de um bot).",
    "Aula 14: Como tornar seu agente “humanizado”."
  ]},
  { id: "mod-5", title: "Módulo 5 - Conteúdo e Presença Digital", description: "Criação e distribuição de conteúdo digital.", image: "https://i.imgur.com/jLTBCwt.jpeg", lessons: [
    "Aula 1: O papel do conteúdo na construção da marca.",
    "Aula 2: Ferramentas para gerar imagens e vídeos com IA.",
    "Aula 3: Calendário editorial prático (e automatizável)",
    "Aula 4: Reaproveitamento de conteúdo em vários canais.",
    "Aula 5: Distribuição de conteúdo orgânico.",
    "Aula 6: Automação de postagens (Instagram, Facebook, TikTok, LinkedIn).",
    "BÔNUS: Aula 9: Hacks de engajamento em redes sociais.",
    "Aula 10: Como medir métricas de conteúdo (alcance, engajamento, CTR)."
  ]},
  { id: "mod-6", title: "Módulo 6 - Tráfego Pago (Meta Ads)", description: "Campanhas pagas e anúncios no Meta.", image: "https://i.imgur.com/nFGFLZt.jpeg", lessons: [
    "Aula 1: Introdução a tráfego pago para WhatsApp.",
    "Aula 2: Configuração do Business Manager + API.",
    "Aula 3: Pixel e eventos de conversão.",
    "Aula 4: Tipos de campanha (mensagens, conversão, remarketing).",
    "Aula 5: Criativos que vendem (imagem, vídeo, copy).",
    "Aula 6: Estrutura de anúncios para WhatsApp.",
    "Aula 7: Segmentação inteligente (interesses, lookalike, remarketing).",
    "Aula 8: Testes A/B na prática.",
    "Aula 9: Estrutura de escala (CBO, ABO).",
    "BÔNUS:",
    "Aula 12: Hacks de tráfego pago para negócios locais.",
    "Aula 13: Como usar campanhas de baixo orçamento para validar ideias."
  ]},
  { id: "mod-7", title: "Módulo 7 - Escala e Modelo de Negócio", description: "Escalando seu projeto e criando modelos de negócio.", image: "https://i.imgur.com/Ij6RyHc.jpeg", lessons: [
    "Aula 1: Como transformar seu agente em produto ou serviço.",
    "Aula 2: Modelos de monetização (SaaS, setup + mensalidade, white label).",
    "Aula 3: Precificação (quanto cobrar pelo bot + manutenção).",
    "Aula 4: Como encontrar clientes (orgânico e pago).",
    "Aula 5: Como apresentar seu projeto para clientes (pitch + demonstração).",
    "Aula 6: Propostas comerciais e contratos.",
    "Aula 7: Estrutura de suporte e manutenção.",
    "Aula 8: Como escalar para centenas de clientes."
  ]},
  { id: "mod-8", title: "Módulo 8 - Disparo em Massa", description: "Automação de disparos em massa via WhatsApp e e-mail.", image: "https://i.imgur.com/hggY3Ak.jpeg", lessons: [
    "AULA1: Introdução ao disparo em massa (conceito, usos e diferenças entre spam e campanha estratégica).",
    "AULA2: Compliance e boas práticas (regras do WhatsApp e do e-mail marketing para evitar banimentos).",
    "AULA3: Ferramentas para disparo em massa no WhatsApp (Z-API, 360Dialog, Gupshup, Twilio, WhatsApp Business API).",
    "AULA4: Criação de listas segmentadas (estratégias para segmentar contatos por comportamento e interesse).",
    "AULA5: Disparo em massa no WhatsApp com n8n (workflow completo, monitoramento, logs e métricas).",
    "AULA6: Ferramentas para disparo em massa de e-mails (SendGrid, Mailgun, Amazon SES, Mailchimp, ActiveCampaign, Brevo).",
    "AULA10: Criação de campanhas de e-mail (estrutura de e-mail, assunto, pré-header, copy, CTA).",
    "AULA11: Automação de e-mails com n8n (workflows de envio, follow-up, funil de nutrição, gatilhos por comportamento).",
    "AULA12: Boas práticas para evitar blacklist (limpeza de listas, opt-in, reputação de domínio e IP).",
    "AULA13: Métricas e análise de resultados (taxa de abertura, clique, conversão, dashboards).",
    "AULA14 (Extra): Disparo em massa de arquivos (PDFs, vídeos, catálogos).",
    "AULA15 (Extra): Como usar tags para disparos inteligentes e segmentados.",
    "AULA16 (Extra): Casos práticos de campanhas reais de disparo em massa."
  ]}
];

const YT_IDS = ["M7lc1UVf-VE", "LXb3EKWsInQ", "ysz5S6PUM-U", "dQw4w9WgXcQ"];
function getVideoId(moduleId: string, lessonIndex: number) {
  const base = moduleId.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) + lessonIndex;
  return YT_IDS[base % YT_IDS.length];
}

function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : initialValue; } catch { return initialValue; }
  });
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} }, [key, value]);
  return [value, setValue] as const;
}

function useScrollSpy(itemClass = "snap-item") {
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const items = Array.from(document.querySelectorAll(`.${itemClass}`));
    if (items.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const idx = items.indexOf(visible[0].target as Element);
          if (idx !== -1) setActiveIndex(idx);
        }
      },
      { root: null, threshold: Array.from({ length: 11 }, (_, i) => i / 10) }
    );
    items.forEach((it) => observer.observe(it));
    return () => observer.disconnect();
  }, [itemClass]);
  return activeIndex;
}

const SectionCard: React.FC<{title: string; description?: string}> = ({ title, description }) => (
  <div className="rounded-2xl p-4 shadow-lg border" style={{ background: "rgba(0,0,0,0.15)", borderColor: withAlpha(COLORS.accent, 0.2) }}>
    <h3 className="text-lg font-extrabold" style={{ color: COLORS.text }}>{title}</h3>
    {description && <p className="text-sm opacity-80" style={{ color: COLORS.text }}>{description}</p>}
  </div>
);

const ModuleCard: React.FC<{mod: Module; onOpen?: (m: Module)=>void}> = ({ mod, onOpen }) => (
  <button
    type="button"
    onClick={() => onOpen?.(mod)}
    onKeyDown={(e) => { if ((e as any).key === 'Enter' || (e as any).key === ' ') { e.preventDefault(); onOpen?.(mod); } }}
    aria-label={`Abrir ${mod.title}`}
    className="relative block w-full overflow-hidden rounded-2xl border shadow-lg focus:outline-none focus:ring-2 transition-transform hover:-translate-y-[2px] active:translate-y-0 cursor-pointer"
    style={{ aspectRatio: '1080 / 1350', borderColor: COLORS.accent, background: 'rgba(0,0,0,0.08)' }}
  >
    <img src={mod.image} alt={mod.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" decoding="async" />
    <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.75) 100%)' }}/>
    <div className="absolute bottom-0 left-0 right-0 p-4">
      <h2 className="text-base sm:text-lg font-bold mb-1 overflow-hidden" style={{ color: COLORS.text, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{mod.title}</h2>
      <p className="text-xs sm:text-sm opacity-90 mb-3 overflow-hidden" style={{ color: COLORS.text, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{mod.description}</p>
      <div className="flex items-center justify-between">
        <span className="px-2 py-1 rounded-full border text-[10px] sm:text-xs font-semibold" style={{ borderColor: withAlpha(COLORS.accent, 0.4), color: COLORS.text }}>
          {Array.isArray(mod.lessons) ? `${mod.lessons.length} aulas` : 'Sem aulas'}
        </span>
        <span aria-hidden>▶️</span>
      </div>
    </div>
  </button>
);

function ModulesGrid({ modules, onOpen }: {modules: Module[]; onOpen: (m: Module)=>void}) {
  const activeIndex = useScrollSpy('snap-item');
  return (
    <div className="relative">
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold fixed right-4 top-20 z-30 shadow"
           style={{ background: 'rgba(0,0,0,0.25)', borderColor: withAlpha(COLORS.accent, 0.6), color: COLORS.text }}
           aria-live="polite">
        <span>Vendo:</span>
        <span className="truncate max-w-[220px]">{modules[activeIndex]?.title || '—'}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-4 sm:px-6 md:px-8">
        {modules.map((m) => (
          <div key={m.id} className="snap-item">
            <ModuleCard mod={m} onOpen={onOpen} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LessonList({ module, onPick }: {module: Module; onPick: (i: number)=>void}) {
  return (
    <ul className="divide-y" style={{ borderColor: withAlpha(COLORS.accent, 0.2) }}>
      {module.lessons.map((name, idx) => (
        <li key={idx}>
          <button
            type="button"
            onClick={() => onPick(idx)}
            className="w-full text-left px-4 py-3 hover:bg-black/20 focus:outline-none"
            style={{ color: COLORS.text }}
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm sm:text-base">{name}</span>
              <span className="text-xs opacity-80">Assistir ▶️</span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}

function LessonPlayer({ module, lessonIndex, onBack }: {module: Module; lessonIndex: number; onBack: ()=>void}) {
  const title = module.lessons[lessonIndex];
  const vid = getVideoId(module.id, lessonIndex);
  return (
    <div>
      <div className="px-4 py-3 border-b" style={{ borderColor: COLORS.accent }}>
        <button onClick={onBack} className="mr-3 px-3 py-1 rounded-md text-sm font-bold border" style={{ background: 'transparent', color: COLORS.text, borderColor: COLORS.accent }}>← Aulas</button>
        <span className="font-bold">{title}</span>
      </div>
      <div className="p-4">
        <div className="w-full rounded-xl overflow-hidden border" style={{ borderColor: COLORS.accent }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              title={`${module.title} - ${title}`}
              src={`https://www.youtube.com/embed/${vid}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Modal({ open, title, onClose, children }: {open: boolean; title: string; onClose: ()=>void; children: React.ReactNode}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden />
      <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-4xl rounded-2xl border shadow-xl overflow-hidden" style={{ background: COLORS.bg, borderColor: COLORS.accent, color: COLORS.text }} role="dialog" aria-modal="true" aria-label={title}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: COLORS.accent }}>
            <h3 className="font-bold text-lg">{title}</h3>
            <button className="px-3 py-1 rounded-md text-sm font-bold border" style={{ background: COLORS.loginButton, color: '#fff', borderColor: COLORS.accent }} onClick={onClose}>Fechar ✕</button>
          </div>
          <div className="max-h-[75vh] overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ onSuccess }: {onSuccess: ()=>void}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const ok = email.trim().toLowerCase() === AUTH.email && password === AUTH.password;
      setLoading(false);
      if (ok) onSuccess(); else setError("Credenciais inválidas. Verifique e tente novamente.");
    }, 400);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: COLORS.bg }}>
      <div className="w-full max-w-md rounded-2xl border shadow-xl p-6" style={{ borderColor: withAlpha(COLORS.accent, 0.8), background: "rgba(0,0,0,0.25)", color: COLORS.text }}>
        <h1 className="text-2xl font-black mb-1">Bem-vindo(a)</h1>
        <p className="opacity-80 mb-6">Faça login para acessar o conteúdo.</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 rounded-xl bg-transparent border outline-none"
              style={{ color: COLORS.text, borderColor: withAlpha(COLORS.accent, 0.4) }}
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full px-4 py-3 rounded-xl bg-transparent border outline-none"
              style={{ color: COLORS.text, borderColor: withAlpha(COLORS.accent, 0.4) }}
              onKeyDown={(e) => { if ((e as any).key === 'Enter') submit(); }}
            />
          </div>

          {error && (
            <div className="text-sm px-3 py-2 rounded-lg border" style={{ color: COLORS.text, borderColor: COLORS.alert, background: "rgba(171,1,1,0.22)" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-xl font-bold border flex items-center justify-center"
            style={{ background: COLORS.loginButton, color: '#fff', borderColor: COLORS.accent }}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

const TabBar: React.FC<{current: string; onChange: (k: string)=>void}> = ({ current, onChange }) => {
  const items = [
    { key: "home", label: "Principal", icon: "🏠", hotkey: "1" },
    { key: "continue", label: "Continuar", icon: "▶️", hotkey: "2" },
    { key: "library", label: "Mais", icon: "📚", hotkey: "3" },
    { key: "settings", label: "Config", icon: "⚙️", hotkey: "4" }
  ] as const;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = (e as any).key;
      if (["1", "2", "3", "4"].includes(key)) {
        const item = items.find((it) => it.hotkey === key);
        if (item) onChange(item.key);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onChange]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch justify-around border-t"
         style={{ background: COLORS.bg, borderColor: COLORS.accent }}
         role="tablist" aria-label="Navegação principal">
      {items.map((it) => {
        const isActive = current === it.key;
        return (
          <button key={it.key} onClick={() => onChange(it.key)} role="tab" aria-selected={isActive}
            aria-label={`${it.label} (atalho ${it.hotkey})`}
            className="flex-1 py-2 px-1 flex flex-col items-center justify-center gap-1 focus:outline-none focus:ring-2"
            style={{ color: COLORS.text }}>
            <span className="text-xl leading-none" aria-hidden>{it.icon}</span>
            <span className="text-[11px] uppercase tracking-wide font-semibold"
                  style={{ color: isActive ? COLORS.accent : COLORS.text }}>{it.label}</span>
            {isActive && (<span className="mt-1 h-0.5 w-6 rounded-full" style={{ background: COLORS.accent }} />)}
          </button>
        );
      })}
    </nav>
  );
};

function ContinueWatching({ lastId, onOpen }: {lastId: string; onOpen: (m: Module)=>void}) {
  const mod = useMemo(() => MODULES.find((m) => m.id === lastId), [lastId]);
  if (!lastId || !mod) {
    return (
      <div className="px-4 sm:px-6 md:px-8">
        <SectionCard title="Nada para continuar agora" description="Assim que você abrir um módulo, ele aparece aqui." />
      </div>
    );
  }
  return (
    <div className="px-4 sm:px-6 md:px-8">
      <SectionCard title="Continuar assistindo" description="Retome de onde parou." />
      <div className="mt-4 max-w-xl">
        <ModuleCard mod={mod} onOpen={onOpen} />
      </div>
    </div>
  );
}

function Library() {
  return (
    <div className="px-4 sm:px-6 md:px-8">
      <SectionCard title="Mais conteúdos" description="Materiais extras e leituras recomendadas." />
    </div>
  );
}

function Settings({ isLogged, onToggleLogin }: {isLogged: boolean; onToggleLogin: ()=>void}) {
  return (
    <div className="px-4 sm:px-6 md:px-8">
      <SectionCard title="Configurações" description="Preferências do aplicativo" />
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={onToggleLogin}
          className="px-4 py-2 rounded-xl text-sm font-bold border"
          style={{ background: isLogged ? 'transparent' : COLORS.button, color: isLogged ? COLORS.text : '#0b1d0a', borderColor: COLORS.accent }}
        >
          {isLogged ? "Sair" : "Entrar"}
        </button>
        <span className="text-sm opacity-80" style={{ color: COLORS.text }}>
          {isLogged ? "Sessão ativa" : "Sessão não iniciada"}
        </span>
      </div>
    </div>
  );
}

function runTests(mods: Module[]) {
  const results: {name: string; pass: boolean; message: string}[] = [];
  const hasMod9 = mods.some((m) => /\b9\b/.test(m.id) || /Módulo 9/i.test(m.title));
  results.push({ name: "Não existe Módulo 9", pass: !hasMod9, message: hasMod9 ? "Módulo 9 ainda presente" : "OK" });

  results.push({ name: "Existem módulos", pass: Array.isArray(mods) && mods.length > 0, message: `Qtd: ${mods.length}` });

  const imgsOk = mods.every((m) => typeof m.image === "string" && m.image.length > 0);
  results.push({ name: "Imagens definidas (strings)", pass: imgsOk, message: imgsOk ? "OK" : "Algum módulo sem imagem" });

  const lessonsOk = mods.every((m) => Array.isArray(m.lessons) && m.lessons.length > 0);
  results.push({ name: "Aulas presentes em todos os módulos", pass: lessonsOk, message: lessonsOk ? "OK" : "Algum módulo sem aulas" });

  const uniqueIds = new Set(mods.map((m) => m.id));
  results.push({ name: "IDs únicos", pass: uniqueIds.size === mods.length, message: `${uniqueIds.size}/${mods.length}` });

  const authOk = AUTH.email.includes('@') && AUTH.password.length > 0;
  results.push({ name: "Credenciais fixas definidas", pass: authOk, message: authOk ? 'OK' : 'Ausentes' });

  const moduleCardIsFn = typeof (ModuleCard) === 'function';
  results.push({ name: "ModuleCard é função", pass: moduleCardIsFn, message: moduleCardIsFn ? 'OK' : 'ModuleCard inválido' });

  const ok1 = /^rgba\(/.test(withAlpha('#e8b912', 0.4));
  const ok2 = /^rgba\(/.test(withAlpha('#abc', 0.5));
  const ok3 = withAlpha('rgb(0,0,0)', 0.7) === 'rgba(0, 0, 0, 0.7)';
  const ok4 = /^rgba\(/.test(withAlpha('not-a-color', 0.2));
  const ok5 = /^rgba\(/.test(withAlpha('#e8b912ff'));
  results.push({ name: "withAlpha HEX(6) ok", pass: ok1, message: withAlpha('#e8b912', 0.4) });
  results.push({ name: "withAlpha HEX(3) ok", pass: ok2, message: withAlpha('#abc', 0.5) });
  results.push({ name: "withAlpha rgb() convertido com alpha", pass: ok3, message: withAlpha('rgb(0,0,0)', 0.7) });
  results.push({ name: "withAlpha inválido faz fallback", pass: ok4, message: withAlpha('not-a-color', 0.2) });
  results.push({ name: "withAlpha HEX(8) ok", pass: ok5, message: withAlpha('#e8b912ff') });

  console.group("TESTES – Plataforma de Aulas");
  for (const r of results) console[r.pass ? "log" : "error"](`${r.pass ? "✔" : "✖"} ${r.name} – ${r.message}`);
  console.groupEnd();
  return results;
}

function TestsPanel({ results }: {results: {name: string; pass: boolean; message: string}[]}) {
  const total = results.length;
  const passed = results.filter((r) => r.pass).length;
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-14 right-4 z-50">
      <button
        onClick={() => setOpen((v) => !v)}
        className="px-3 py-2 rounded-xl text-xs font-bold border shadow"
        style={{ background: COLORS.button, color: "#0b1d0a", borderColor: COLORS.accent }}
      >
        Testes: {passed}/{total} {open ? "▲" : "▼"}
      </button>
      {open && (
        <div className="mt-2 rounded-xl border shadow p-3 text-xs w-80"
          style={{ background: "rgba(0,0,0,0.8)", borderColor: COLORS.accent, color: COLORS.text }}>
          <ul className="space-y-1">
            {results.map((r, i) => (
              <li key={i}>
                {r.pass ? "✔" : "✖"} {r.name} – {r.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("home");
  const [query, setQuery] = useState("");
  const [isLogged, setIsLogged] = useLocalStorage("logged", false);
  const [lastId, setLastId] = useLocalStorage("lastModuleId", "");

  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedLessonIndex, setSelectedLessonIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return MODULES;
    const q = query.toLowerCase();
    return MODULES.filter((m) => m.title.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));
  }, [query]);

  const openModule = (mod: Module) => { setSelectedModule(mod); setSelectedLessonIndex(null); setLastId(mod.id); };
  const closeModal = () => { setSelectedLessonIndex(null); setSelectedModule(null); };
  const pickLesson = (idx: number) => setSelectedLessonIndex(idx);

  const [testResults] = useState(() => runTests(MODULES));

  if (!isLogged) {
    return (<>
      <LoginScreen onSuccess={() => setIsLogged(true)} />
      <TestsPanel results={testResults} />
    </>);
  }

  return (
    <div className="min-h-screen" style={{ background: COLORS.bg }}>
      <header className="sticky top-0 z-40 backdrop-blur border-b" style={{ background: "rgba(10,10,10,0.85)", borderColor: COLORS.accent }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between">
          <h1 className="font-black tracking-tight text-xl sm:text-2xl" style={{ color: COLORS.text }}>Plataforma de Aulas</h1>
          <div className="flex items-center gap-2">
            <span className="hidden sm:block text-xs opacity-80" style={{ color: COLORS.text }}>Imagens 1080x1350 • Cards uniformes</span>
            <button onClick={() => setIsLogged(false)} className="px-3 py-2 rounded-xl text-sm font-bold border" style={{ background: 'transparent', color: COLORS.text, borderColor: COLORS.accent }}>Sair</button>
          </div>
        </div>
      </header>

      <main className="pb-20 max-w-6xl mx-auto">
        {tab === "home" && (
          <section className="pt-4">
            <div className="px-4 sm:px-6 md:px-8 mb-4">
              <SectionCard title="Trilha principal" description="Navegue pelos módulos do curso" />
            </div>
            <div className="px-4 sm:px-6 md:px-8 mb-4">
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2" style={{ borderColor: withAlpha(COLORS.accent, 0.4), background: "rgba(0,0,0,0.12)" }}>
                <span role="img" aria-label="buscar">🔎</span>
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar módulos..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: COLORS.text }} aria-label="Buscar módulos"/>
                {query && (<button onClick={() => setQuery("")} className="text-xs opacity-80 hover:opacity-100" style={{ color: COLORS.text }}>Limpar</button>)}
              </div>
            </div>
            <ModulesGrid modules={filtered} onOpen={openModule} />
          </section>
        )}

        {tab === "continue" && (<ContinueWatching lastId={lastId} onOpen={openModule} />)}
        {tab === "library" && (<Library />)}
        {tab === "settings" && (<Settings isLogged={isLogged} onToggleLogin={() => setIsLogged((v: boolean) => !v)} />)}
      </main>

      <TabBar current={tab} onChange={setTab} />
      <TestsPanel results={testResults} />

      <Modal open={!!selectedModule} title={selectedModule ? selectedModule.title : ''} onClose={closeModal}>
        {selectedModule && selectedLessonIndex === null && (<LessonList module={selectedModule} onPick={pickLesson} />)}
        {selectedModule && selectedLessonIndex !== null && (<LessonPlayer module={selectedModule} lessonIndex={selectedLessonIndex!} onBack={() => setSelectedLessonIndex(null)} />)}
      </Modal>
    </div>
  );
}
