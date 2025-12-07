  import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Save, RotateCcw, RefreshCw, Loader2, CheckCircle2, AlertCircle, Globe, Shield, Sparkles } from 'lucide-react';

type Lang = 'en' | 'de';

interface FinalCTAData {
  badge: string;
  headlineLine1: string;
  headlineLine2: string;
  subheading: string;
  benefits: string[];
  stats: {
    activeClients: string;
    avgRoi: string;
    satisfaction: string;
    fastStart: string;
  };
  trust: {
    consultationTime: string;
    consultationLabel: string;
    responseTime: string;
    responseLabel: string;
    noCommitment: string;
    noCommitmentLabel: string;
    footer: string;
  };
  ctas: {
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  whatsAppNumber: string;
}

const API_BASE = ((import.meta as unknown) as { env?: Record<string, string> }).env?.VITE_API_BASE || 'http://localhost:5001';

export default function AdminFinalCTA() {
  const [lang, setLang] = useState<Lang>('en');
  const [token] = useState<string>(() => {
    try {
      return (localStorage.getItem('adminToken') || '').trim();
    } catch (e) {
      void e;
      return '';
    }
  });
  const hasToken = useMemo(() => token.trim().length > 0, [token]);
  const headers = useCallback((): Record<string, string> => {
    const tk = token.trim();
    return tk ? { 'Content-Type': 'application/json', Authorization: `Bearer ${tk}` } : { 'Content-Type': 'application/json' };
  }, [token]);

  const [data, setData] = useState<FinalCTAData | null>(null);
  const [original, setOriginal] = useState<FinalCTAData | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isDirty = useMemo(() => JSON.stringify(data) !== JSON.stringify(original), [data, original]);
  const [saved, setSaved] = useState(false);
  const [open, setOpen] = useState({ hero: true, benefits: true, stats: true, trust: true, ctas: true });
  const [isWide, setIsWide] = useState<boolean>(() => (typeof window !== 'undefined' ? window.innerWidth >= 1100 : true));
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const isValidHref = (s: string) => {
    const v = (s || '').trim();
    if (!v) return false;
    return v.startsWith('/') || /^https?:\/\//i.test(v);
  };
  const isValidWhats = (s: string) => {
    const v = (s || '').trim();
    if (!v) return true; // optional
    return /^\d{6,15}$/.test(v);
  };

  const errors = useMemo(() => {
    if (!data) return {} as Record<string, boolean>;
    return {
      primaryLabel: !(data.ctas.primaryLabel || '').trim(),
      primaryHref: !isValidHref(data.ctas.primaryHref),
      secondaryHref: !!(data.ctas.secondaryHref || '').trim() && !isValidHref(data.ctas.secondaryHref),
      whatsAppNumber: !isValidWhats(data.whatsAppNumber),
    } as const;
  }, [data]);
  const hasErrors = useMemo(() => Object.values(errors as Record<string, boolean>).some(Boolean), [errors]);

  useEffect(() => {
    try { localStorage.setItem('adminToken', token); } catch (e) { void e; }
  }, [token]);

  const handle401 = useCallback(() => {
    try { localStorage.removeItem('adminToken'); } catch (e) { void e; }
    window.location.href = '/admin/login';
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const res = await fetch(`${API_BASE}/api/admin/final-cta?lang=${lang}`, { headers: headers() });
      if (res.status === 401) return void handle401();
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const json = await res.json();
      const d: FinalCTAData | null = json.finalCta || null;
      if (d) {
        setData(structuredClone(d));
        setOriginal(structuredClone(d));
      } else {
        const empty: FinalCTAData = {
          badge: '', headlineLine1: '', headlineLine2: '', subheading: '', benefits: [],
          stats: { activeClients: '', avgRoi: '', satisfaction: '', fastStart: '' },
          trust: { consultationTime: '', consultationLabel: '', responseTime: '', responseLabel: '', noCommitment: '', noCommitmentLabel: '', footer: '' },
          ctas: { primaryLabel: '', primaryHref: '/book-meeting', secondaryLabel: '', secondaryHref: '' },
          whatsAppNumber: ''
        };
        setData(empty);
        setOriginal(structuredClone(empty));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, [lang, headers, handle401]);

  useEffect(() => { if (hasToken) void load(); }, [hasToken, lang, load]);

  // Persist open/closed state
  useEffect(() => {
    try {
      const raw = localStorage.getItem('admin_finalcta_open');
      if (raw) setOpen(JSON.parse(raw));
    } catch (e) { void e; }
  }, []);
  useEffect(() => {
    try { localStorage.setItem('admin_finalcta_open', JSON.stringify(open)); } catch (e) { void e; }
  }, [open]);

  // Handle responsive layout
  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= 1100);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const onSave = useCallback(async () => {
    if (!data) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/final-cta`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ lang, finalCta: data })
      });
      if (res.status === 401) return void handle401();
      if (!res.ok) throw new Error(`Save failed: ${res.status}`);
      await load();
      setSaved(true);
      setToast({ type: 'success', message: 'Changes saved successfully!' });
      setTimeout(() => setSaved(false), 2000);
      setTimeout(() => setToast(null), 3000);
    } catch (e: unknown) {
      setToast({ type: 'error', message: e instanceof Error ? e.message : 'Save failed' });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setSaving(false);
    }
  }, [data, headers, lang, handle401, load]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const key = (e.key || '').toLowerCase();
      if ((e.ctrlKey || e.metaKey) && key === 's') {
        e.preventDefault();
        if (!hasErrors && hasToken && isDirty && !saving) {
          void onSave();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [hasErrors, hasToken, isDirty, saving, onSave]);

  // Warn before closing tab with unsaved changes
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  const SectionCard = ({ title, isOpen, onToggle, children, icon: Icon }: { title: string; isOpen: boolean; onToggle: () => void; children: React.ReactNode; icon?: React.ElementType }) => (
    <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 shadow-xl hover:border-gold/30 transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between mb-4 group"
      >
        <div className="flex items-center gap-3">
          {Icon && <Icon className="w-5 h-5 text-gold" />}
          <h3 className="text-lg font-bold text-white group-hover:text-gold transition-colors">{title}</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-gold transition-colors" />
        ) : (
          <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-gold transition-colors" />
        )}
      </button>
      {isOpen && <div className="space-y-4">{children}</div>}
    </div>
  );

  const FormField = ({ label, required, error, helpText, children }: { label: string; required?: boolean; error?: string; helpText?: string; children: React.ReactNode }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-xs text-slate-500">{helpText}</p>
      )}
    </div>
  );

  return (
    <div className="w-full py-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gold/20 rounded-lg border border-gold/30">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <h1 className="text-2xl font-extrabold text-white">Final CTA Management</h1>
            </div>
            <p className="text-slate-400 text-sm ml-12">Manage hero, benefits, stats, trust indicators, and call-to-action buttons. Press <kbd className="px-2 py-1 bg-slate-700/50 rounded text-xs font-mono">Ctrl/Cmd + S</kbd> to save quickly.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border backdrop-blur-sm ${
              isDirty 
                ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300' 
                : 'bg-green-500/10 border-green-500/30 text-green-300'
            }`}>
              {isDirty ? (
                <>
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-semibold">Unsaved changes</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="text-sm font-semibold">All saved</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-4 mb-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <FormField label="Language" required={false}>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="px-4 py-2.5 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
              >
                <option value="en">English</option>
                <option value="de">Deutsch</option>
              </select>
            </FormField>
            {loading && (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading…</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => load()}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/60 hover:border-slate-500/60 text-slate-300 rounded-xl transition-all text-sm font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              hasToken ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'
            }`}>
              <Shield className={`w-4 h-4 ${hasToken ? 'text-green-400' : 'text-red-400'}`} />
              <span className={`text-xs font-semibold ${hasToken ? 'text-green-300' : 'text-red-300'}`}>
                {hasToken ? 'Authenticated' : 'Not Authenticated'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {saved && (
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-4 mb-6 backdrop-blur-sm">
          <div className="flex items-center gap-3 text-green-300">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-semibold">Changes saved successfully!</span>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {!data && loading && (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 h-32 animate-pulse" />
          ))}
        </div>
      )}

      {/* Main Form */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Sections */}
          <div className="lg:col-span-2 space-y-6">
            <SectionCard
              title="Hero Section"
              isOpen={open.hero}
              onToggle={() => setOpen({ ...open, hero: !open.hero })}
              icon={Sparkles}
            >
              <FormField label="Badge">
                <input
                  type="text"
                  placeholder="e.g., New: Free Setup"
                  value={data.badge}
                  onChange={(e) => setData({ ...data, badge: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                />
              </FormField>
              <FormField label="Headline Line 1">
                <input
                  type="text"
                  placeholder="Main title line 1"
                  value={data.headlineLine1}
                  onChange={(e) => setData({ ...data, headlineLine1: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                />
              </FormField>
              <FormField label="Headline Line 2">
                <input
                  type="text"
                  placeholder="Main title line 2"
                  value={data.headlineLine2}
                  onChange={(e) => setData({ ...data, headlineLine2: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                />
              </FormField>
              <FormField label="Subheading">
                <textarea
                  placeholder="Short supporting statement"
                  value={data.subheading}
                  onChange={(e) => setData({ ...data, subheading: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all resize-y min-h-[80px]"
                />
              </FormField>
            </SectionCard>

            <SectionCard
              title="Benefits"
              isOpen={open.benefits}
              onToggle={() => setOpen({ ...open, benefits: !open.benefits })}
            >
              <FormField label="Benefits" helpText="Enter one benefit per line">
                <textarea
                  value={(data.benefits || []).join('\n')}
                  onChange={(e) => setData({ ...data, benefits: e.target.value.split('\n').map(s => s.trim()).filter(Boolean) })}
                  rows={6}
                  placeholder="No Setup Fees&#10;Free Trial&#10;Native Managers&#10;24/7 Support"
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all resize-y font-mono text-sm"
                />
              </FormField>
            </SectionCard>

            <SectionCard
              title="Statistics"
              isOpen={open.stats}
              onToggle={() => setOpen({ ...open, stats: !open.stats })}
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Active Clients">
                  <input
                    type="text"
                    placeholder="e.g., 200+"
                    value={data.stats.activeClients}
                    onChange={(e) => setData({ ...data, stats: { ...data.stats, activeClients: e.target.value } })}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  />
                </FormField>
                <FormField label="Avg ROI">
                  <input
                    type="text"
                    placeholder="e.g., 3.5x"
                    value={data.stats.avgRoi}
                    onChange={(e) => setData({ ...data, stats: { ...data.stats, avgRoi: e.target.value } })}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  />
                </FormField>
                <FormField label="Satisfaction">
                  <input
                    type="text"
                    placeholder="e.g., 98%"
                    value={data.stats.satisfaction}
                    onChange={(e) => setData({ ...data, stats: { ...data.stats, satisfaction: e.target.value } })}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  />
                </FormField>
                <FormField label="Fast Start">
                  <input
                    type="text"
                    placeholder="e.g., 48h"
                    value={data.stats.fastStart}
                    onChange={(e) => setData({ ...data, stats: { ...data.stats, fastStart: e.target.value } })}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  />
                </FormField>
              </div>
            </SectionCard>

            <SectionCard
              title="Trust Indicators"
              isOpen={open.trust}
              onToggle={() => setOpen({ ...open, trust: !open.trust })}
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Consultation Time">
                  <input
                    type="text"
                    value={data.trust.consultationTime}
                    onChange={(e) => setData({ ...data, trust: { ...data.trust, consultationTime: e.target.value } })}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  />
                </FormField>
                <FormField label="Consultation Label">
                  <input
                    type="text"
                    value={data.trust.consultationLabel}
                    onChange={(e) => setData({ ...data, trust: { ...data.trust, consultationLabel: e.target.value } })}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  />
                </FormField>
                <FormField label="Response Time">
                  <input
                    type="text"
                    value={data.trust.responseTime}
                    onChange={(e) => setData({ ...data, trust: { ...data.trust, responseTime: e.target.value } })}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  />
                </FormField>
                <FormField label="Response Label">
                  <input
                    type="text"
                    value={data.trust.responseLabel}
                    onChange={(e) => setData({ ...data, trust: { ...data.trust, responseLabel: e.target.value } })}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  />
                </FormField>
                <FormField label="No Commitment">
                  <input
                    type="text"
                    value={data.trust.noCommitment}
                    onChange={(e) => setData({ ...data, trust: { ...data.trust, noCommitment: e.target.value } })}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  />
                </FormField>
                <FormField label="No Commitment Label">
                  <input
                    type="text"
                    value={data.trust.noCommitmentLabel}
                    onChange={(e) => setData({ ...data, trust: { ...data.trust, noCommitmentLabel: e.target.value } })}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  />
                </FormField>
              </div>
              <FormField label="Footer Text">
                <textarea
                  value={data.trust.footer}
                  onChange={(e) => setData({ ...data, trust: { ...data.trust, footer: e.target.value } })}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all resize-y min-h-[80px]"
                />
              </FormField>
            </SectionCard>

            <SectionCard
              title="Call-to-Action Buttons"
              isOpen={open.ctas}
              onToggle={() => setOpen({ ...open, ctas: !open.ctas })}
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Primary Label" required error={errors.primaryLabel ? 'Required' : undefined}>
                  <input
                    type="text"
                    value={data.ctas.primaryLabel}
                    onChange={(e) => setData({ ...data, ctas: { ...data.ctas, primaryLabel: e.target.value } })}
                    className={`w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${
                      errors.primaryLabel
                        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50'
                        : 'border-slate-700/60 focus:ring-gold/50 focus:border-gold/50'
                    }`}
                  />
                </FormField>
                <FormField label="Primary Href" required error={errors.primaryHref ? 'Required. Use /relative or http(s) URL' : undefined}>
                  <input
                    type="text"
                    value={data.ctas.primaryHref}
                    onChange={(e) => setData({ ...data, ctas: { ...data.ctas, primaryHref: e.target.value } })}
                    className={`w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all font-mono text-sm ${
                      errors.primaryHref
                        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50'
                        : 'border-slate-700/60 focus:ring-gold/50 focus:border-gold/50'
                    }`}
                  />
                </FormField>
                <FormField label="Secondary Label">
                  <input
                    type="text"
                    placeholder="e.g., Chat on WhatsApp"
                    value={data.ctas.secondaryLabel}
                    onChange={(e) => setData({ ...data, ctas: { ...data.ctas, secondaryLabel: e.target.value } })}
                    className="w-full px-4 py-3 bg-slate-900/60 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50 transition-all"
                  />
                </FormField>
                <FormField label="Secondary Href" error={errors.secondaryHref ? 'Invalid URL' : undefined}>
                  <input
                    type="text"
                    placeholder="Leave blank to auto-use WhatsApp number"
                    value={data.ctas.secondaryHref}
                    onChange={(e) => setData({ ...data, ctas: { ...data.ctas, secondaryHref: e.target.value } })}
                    className={`w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all font-mono text-sm ${
                      errors.secondaryHref
                        ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50'
                        : 'border-slate-700/60 focus:ring-gold/50 focus:border-gold/50'
                    }`}
                  />
                </FormField>
              </div>
              <FormField
                label="WhatsApp Number"
                error={errors.whatsAppNumber ? 'Digits only, 6-15 length' : undefined}
                helpText={!errors.whatsAppNumber ? 'Used when Secondary Href is empty to auto-build wa.me link' : undefined}
              >
                <input
                  type="text"
                  placeholder="Digits only, e.g., 15551234567"
                  value={data.whatsAppNumber}
                  onChange={(e) => setData({ ...data, whatsAppNumber: e.target.value })}
                  className={`w-full px-4 py-3 bg-slate-900/60 border rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all font-mono ${
                    errors.whatsAppNumber
                      ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50'
                      : 'border-slate-700/60 focus:ring-gold/50 focus:border-gold/50'
                  }`}
                />
              </FormField>
            </SectionCard>
          </div>

          {/* Live Preview Sidebar */}
          {isWide && (
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-5 h-5 text-gold" />
                  <h3 className="text-lg font-bold text-white">Live Preview</h3>
                </div>
                <p className="text-xs text-slate-400 mb-4">This is a simplified preview using your current edits.</p>
                <div className="p-6 rounded-xl bg-gradient-to-br from-gold/20 via-amber-500/20 to-yellow-600/20 border border-gold/30">
                  <div className="inline-flex items-center gap-2 bg-white/25 backdrop-blur-sm rounded-full px-3 py-1.5 mb-4 border border-white/30">
                    <Sparkles className="w-3 h-3 text-white" />
                    <span className="text-white text-xs font-bold">{(data.badge || 'Badge').trim() || 'Badge'}</span>
                  </div>
                  <h4 className="text-white font-extrabold text-xl mb-1 leading-tight">{(data.headlineLine1 || 'Headline 1').trim() || 'Headline 1'}</h4>
                  <h4 className="text-white font-extrabold text-xl mb-3 leading-tight">{(data.headlineLine2 || 'Headline 2').trim() || 'Headline 2'}</h4>
                  <p className="text-white/90 text-sm mb-4">{(data.subheading || 'Subheading').trim() || 'Subheading'}</p>
                  <ul className="space-y-1 mb-4 text-white/95 text-xs">
                    {(data.benefits || []).slice(0, 4).map((b, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30">
                      <div className="text-white font-bold text-sm">{data.stats.activeClients || '200+'}</div>
                      <div className="text-white/80 text-[10px]">Clients</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30">
                      <div className="text-white font-bold text-sm">{data.stats.avgRoi || '3.5x'}</div>
                      <div className="text-white/80 text-[10px]">ROI</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30">
                      <div className="text-white font-bold text-sm">{data.stats.satisfaction || '98%'}</div>
                      <div className="text-white/80 text-[10px]">Satisfaction</div>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center border border-white/30">
                      <div className="text-white font-bold text-sm">{data.stats.fastStart || '48h'}</div>
                      <div className="text-white/80 text-[10px]">Fast Start</div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <a
                      href={data.ctas.primaryHref}
                      className="bg-white text-gold px-4 py-2 rounded-lg font-bold text-sm text-center hover:bg-white/95 transition-colors"
                    >
                      {data.ctas.primaryLabel || 'Primary CTA'}
                    </a>
                    <a
                      href={data.ctas.secondaryHref || (data.whatsAppNumber ? `https://wa.me/${data.whatsAppNumber}` : '#')}
                      className="border-2 border-white text-white px-4 py-2 rounded-lg font-semibold text-sm text-center hover:bg-white/10 transition-colors"
                    >
                      {data.ctas.secondaryLabel || 'Secondary CTA'}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sticky Action Bar */}
      {data && (
        <div className="sticky bottom-0 mt-6 bg-gradient-to-br from-slate-900/95 to-slate-950/95 backdrop-blur-xl border-t border-slate-700/60 rounded-t-2xl p-4 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            {isDirty && (
              <div className="flex items-center gap-2 text-yellow-400 text-sm font-semibold">
                <AlertCircle className="w-4 h-4" />
                <span>You have unsaved changes</span>
              </div>
            )}
            <div className="flex items-center gap-3 ml-auto">
              <button
                onClick={() => setData(original ? structuredClone(original) : data)}
                disabled={!isDirty}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isDirty
                    ? 'bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/60 hover:border-slate-500/60 text-slate-300 cursor-pointer'
                    : 'bg-slate-800/30 border border-slate-700/30 text-slate-600 cursor-not-allowed'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                Revert
              </button>
              <button
                onClick={onSave}
                disabled={!hasToken || !isDirty || saving || hasErrors}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                  hasToken && isDirty && !saving && !hasErrors
                    ? 'bg-gradient-to-r from-gold to-yellow-500 hover:from-gold/90 hover:to-yellow-500/90 text-slate-900 shadow-lg shadow-gold/20 hover:shadow-gold/30 cursor-pointer'
                    : 'bg-slate-700/30 border border-slate-600/30 text-slate-600 cursor-not-allowed'
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed right-6 bottom-6 z-50 animate-in slide-in-from-right">
          <div className={`rounded-2xl p-4 shadow-2xl backdrop-blur-xl border ${
            toast.type === 'success'
              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30'
              : 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/30'
          }`}>
            <div className="flex items-center gap-3">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={`font-semibold ${toast.type === 'success' ? 'text-green-300' : 'text-red-300'}`}>
                {toast.message}
              </span>
              <button
                onClick={() => setToast(null)}
                className="ml-4 text-slate-400 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
