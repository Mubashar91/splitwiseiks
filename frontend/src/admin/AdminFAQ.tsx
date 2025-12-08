import { useCallback, useEffect, useMemo, useState } from 'react';

type Lang = 'en' | 'de';

interface FAQItem {
  _id?: string;
  order: number;
  question: string;
  answer: string;
}

const API_BASE =
  ((import.meta as unknown) as { env?: Record<string, string> }).env?.VITE_API_BASE ||
  'http://localhost:5001';

export default function AdminFAQ() {
  const [lang, setLang] = useState<Lang>('en');
  const [token, setToken] = useState<string>(() => {
    try {
      const ls = localStorage.getItem('adminToken') || '';
      const envTok = ((import.meta as unknown) as { env?: Record<string, string> }).env?.VITE_ADMIN_TOKEN || '';
      return (ls && ls.trim()) || envTok || '';
    } catch {
      return '';
    }
  });
  const hasToken = useMemo(() => token.trim().length > 0, [token]);
  const envToken = useMemo(() => {
    try {
      return ((((import.meta as unknown) as { env?: Record<string, string> }).env?.VITE_ADMIN_TOKEN) || '').trim();
    } catch {
      return '';
    }
  }, []);
  const headers = useCallback((): Record<string, string> => {
    const tk = token.trim();
    return tk ? { Authorization: `Bearer ${tk}` } : {};
  }, [token]);

  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [originalFaqs, setOriginalFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [hoverRow, setHoverRow] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FAQItem | null>(null);
  const [query, setQuery] = useState('');

  const isDirty = useCallback((idx: number) => {
    if (!originalFaqs[idx]) return true;
    return !isEqualFAQ(faqs[idx], originalFaqs[idx]);
  }, [faqs, originalFaqs]);

  const pushToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const u = new URL(window.location.href);
    const t = (u.searchParams.get('token') || '').trim();
    if (t) {
      setToken(t);
      try { localStorage.setItem('adminToken', t); } catch (_err) { void _err; }
      u.searchParams.delete('token');
      window.history.replaceState({}, document.title, u.toString());
    }
  }, []);

  useEffect(() => {
    try { localStorage.setItem('adminToken', token.trim()); } catch (_err) { void _err; }
  }, [token]);

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const res = await fetch(`${API_BASE}/api/admin/faq?lang=${lang}`, { headers: headers() });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      const list: FAQItem[] = Array.isArray(data.faqs) ? data.faqs.slice().sort((a: FAQItem, b: FAQItem) => a.order - b.order) : [];
      // Only update FAQs if they actually changed to prevent form resets
      setFaqs(prevFaqs => {
        const faqsChanged = JSON.stringify(prevFaqs) !== JSON.stringify(list);
        return faqsChanged ? list : prevFaqs;
      });
      setOriginalFaqs(JSON.parse(JSON.stringify(list)) as FAQItem[]);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [lang, headers]);

  useEffect(() => {
    if (hasToken) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasToken, lang]); // Removed 'load' from dependencies to prevent unnecessary re-renders

  const setFAQField = (idx: number, key: keyof FAQItem, value: FAQItem[keyof FAQItem]) => {
    setFaqs(prev => prev.map((f, i) => (i === idx ? { ...f, [key]: value } : f)));
  };

  const validateCore = (f: Pick<FAQItem, 'order'|'question'|'answer'>) => {
    if (f.order < 0) return 'Order must be non-negative';
    if (!f.question.trim()) return 'Question is required';
    if (!f.answer.trim()) return 'Answer is required';
    return null;
  };

  const logHttpError = async (res: Response, context: string) => {
    if (import.meta.env.DEV) {
      let body = '';
      try { body = await res.clone().text(); } catch { /* ignore */ }
      console.error('[AdminFAQ] request failed', {
        context,
        url: res.url,
        status: res.status,
        statusText: res.statusText,
      });
      if (body) console.error('[AdminFAQ] response body:', body);
    }
  };

  const onSave = async (f: FAQItem) => {
    const err = validateCore(f);
    if (err) return alert(err);
    if (!hasToken) return alert('Admin token required');
    const updates: Partial<Omit<FAQItem, 'order'>> = {
      question: f.question,
      answer: f.answer,
    };
    const url = `${API_BASE}/api/admin/faq/${f.order}`;
    setSavingOrder(f.order);
    const res = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...headers() },
      body: JSON.stringify({ lang, updates }),
    });
    if (!res.ok) { await logHttpError(res, `PUT ${url}`); setSavingOrder(null); return alert('Save failed: ' + res.status); }
    await load();
    pushToast('FAQ saved');
    setSavingOrder(null);
  };

  const onDelete = async (f: FAQItem) => {
    if (!hasToken) return alert('Admin token required');
    const url = `${API_BASE}/api/admin/faq/${f.order}?lang=${lang}`;
    const res = await fetch(url, {
      method: 'DELETE', headers: headers()
    });
    if (!res.ok) { await logHttpError(res, `DELETE ${url}`); return alert('Delete failed: ' + res.status); }
    await load();
    pushToast('FAQ deleted');
  };

  const [newFAQ, setNewFAQ] = useState<FAQItem>({
    order: 0, question: '', answer: ''
  });

  const prefillSample = () => {
    const orderNum = faqs.length > 0 ? Math.max(...faqs.map(f => f.order)) + 1 : 0;
    const sample: FAQItem = {
      order: orderNum,
      question: lang === 'de' ? 'Beispiel Frage?' : 'Sample Question?',
      answer: lang === 'de' ? 'Dies ist eine Beispielantwort' : 'This is a sample answer',
    };
    setNewFAQ(sample);
  };

  const onAdd = async () => {
    if (!hasToken) {
      pushToast('Admin token required', 'error');
      return;
    }
    if (newFAQ.order < 0) {
      pushToast('Order must be non-negative', 'error');
      return;
    }
    const existingOrders = new Set(faqs.map(f => f.order));
    if (existingOrders.has(newFAQ.order)) {
      pushToast(`Order ${newFAQ.order} already exists for ${lang}.`, 'error');
      return;
    }
    const err = validateCore(newFAQ);
    if (err) {
      pushToast(err, 'error');
      return;
    }
    const url = `${API_BASE}/api/admin/faq`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers() },
        body: JSON.stringify({ lang, faq: newFAQ }),
      });
      if (!res.ok) {
        if (res.status === 409) {
          pushToast('This order already exists for the selected language.', 'error');
          return;
        }
        const errorText = await res.text().catch(() => 'Unknown error');
        await logHttpError(res, `POST ${url}`);
        pushToast(`Add failed: ${res.status} - ${errorText}`, 'error');
        console.error('Failed to add FAQ:', errorText);
        return;
      }
      setNewFAQ({ order: 0, question: '', answer: '' });
      await load();
      pushToast('FAQ added successfully!', 'success');
      setAddOpen(false);
    } catch (error) {
      console.error('Error adding FAQ:', error);
      pushToast(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    }
  };

  const card = { background: 'rgba(30, 41, 59, 0.4)', border: '1px solid rgba(51, 65, 85, 0.5)', borderRadius: 16, padding: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.3)', backdropFilter: 'blur(12px)' } as const;
  const chip = { color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '6px 14px', borderRadius: 999, fontWeight: 700, border: '1px solid rgba(16, 185, 129, 0.3)' } as const;
  const inputBase = { padding: '10px 14px', border: '1px solid rgba(51, 65, 85, 0.6)', background: 'rgba(15, 23, 42, 0.6)', color: '#e2e8f0', borderRadius: 12, outline: 'none', transition: 'all 0.2s', fontSize: 14 } as const;
  const inputFocus = { border: '1px solid rgba(212, 175, 55, 0.5)', background: 'rgba(15, 23, 42, 0.8)', boxShadow: '0 0 0 3px rgba(212, 175, 55, 0.1)' } as const;
  const btnPrimary = { padding: '10px 16px', borderRadius: 10, background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', fontWeight: 600, fontSize: 14, border: 'none', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' } as const;
  const btnSecondary = { padding: '10px 16px', borderRadius: 10, background: 'rgba(17, 24, 39, 0.6)', color: '#cbd5e1', fontWeight: 600, fontSize: 14, border: '1px solid rgba(55, 65, 81, 0.6)', cursor: 'pointer', transition: 'all 0.2s' } as const;
  const thStyle = { padding: '14px 12px', textAlign: 'left' as const, background: 'rgba(15, 23, 42, 0.8)', color: '#94a3b8', borderBottom: '2px solid rgba(51, 65, 85, 0.5)', position: 'sticky' as const, top: 0, zIndex: 1, textTransform: 'uppercase', fontSize: 11, letterSpacing: 1, fontWeight: 700 };
  const tdStyle = { padding: '14px 12px', borderTop: '1px solid rgba(51, 65, 85, 0.3)', verticalAlign: 'top' as const, background: 'transparent' };

  return (
    <div style={{ padding: 0, maxWidth: '100%', margin: '0 auto', color: '#e2e8f0' }}>
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{ width: 4, height: 32, background: 'linear-gradient(to bottom, #d4af37, #fbbf24)', borderRadius: 2 }}></div>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 4, letterSpacing: -0.5, color: '#fff', background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>FAQ Management</h2>
            <p style={{ color: '#94a3b8', fontSize: 15 }}>Manage your FAQ items for English and German languages</p>
          </div>
        </div>
      </div>

      <div style={{ ...card, display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <label>Language
          <select value={lang} onChange={e => setLang(e.target.value as Lang)} style={{ ...inputBase, marginLeft: 8, padding: 8, width: 160 }}>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
          </label>

          {loading && <span style={{ color: '#9ca3af' }}>Loading…</span>}
          {error && <span style={{ color: '#f87171' }}>{error}</span>}
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {!hasToken ? (
            <>
              <input placeholder="ADMIN_TOKEN" value={token} onChange={e => setToken(e.target.value)} style={{ ...inputBase, width: 260 }} />
              <button onClick={load} disabled={!hasToken && token.trim().length === 0} style={{ ...btnPrimary, opacity: token.trim() ? 1 : 0.6 }}>Load</button>
              {envToken && (
                <button onClick={() => setToken(envToken)} style={{ ...btnSecondary }}>Use env token</button>
              )}
            </>
          ) : (
            <>
              <span style={chip}>Token loaded</span>
              <button onClick={() => setToken('')} style={btnSecondary}>Change token</button>
            </>
          )}
          <div style={{ display: 'flex', gap: 10, marginLeft: 8 }}>
            <span style={{ color: '#9ca3af', fontSize: 12 }}>API: {API_BASE}</span>
            <span style={{ color: hasToken ? '#10b981' : '#f87171', fontSize: 12 }}>Token: {hasToken ? 'yes' : 'no'}</span>
          </div>
        </div>
      </div>

      <div style={{ ...card, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ color: '#9ca3af', fontSize: 13 }}>FAQs: {faqs.length}</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input placeholder="Search FAQs…" value={query} onChange={e => setQuery(e.target.value)} style={{ ...inputBase, width: 260 }} />
          <button onClick={() => load()} style={btnSecondary}>Refresh</button>
          <button onClick={() => setAddOpen(v => !v)} style={btnPrimary}>{addOpen ? 'Hide Add' : 'Add FAQ'}</button>
        </div>
      </div>

      <div style={{ ...card, padding: 0, maxHeight: 460, overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...thStyle }}>Order</th>
              <th style={{ ...thStyle }}>Question</th>
              <th style={{ ...thStyle }}>Answer</th>
              <th style={{ ...thStyle }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {faqs.map((f, idx) => {
              const q = query.trim().toLowerCase();
              const matches = !q || [String(f.order), f.question, f.answer].join(' ').toLowerCase().includes(q);
              return (
              <tr key={f._id || f.order} onMouseEnter={() => setHoverRow(idx)} onMouseLeave={() => setHoverRow(r => (r===idx?null:r))} style={{ background: hoverRow === idx ? '#0e1a33' : (idx % 2 ? '#0b1426' : 'transparent'), transition: 'background 120ms ease', display: matches ? undefined : 'none' }}>
                <td style={tdStyle}>
                  <input 
                    key={`${f._id || f.order}-order-${lang}`}
                    type="number" 
                    min={0} 
                    value={f.order} 
                    onChange={e => setFAQField(idx, 'order', Number(e.target.value))} 
                    style={{ ...inputBase, width: 80, textAlign: 'center' as const }} 
                  />
                </td>
                <td style={tdStyle}>
                  <input 
                    key={`${f._id || f.order}-question-${lang}`}
                    value={f.question} 
                    onChange={e => setFAQField(idx, 'question', e.target.value)} 
                    style={{ ...inputBase, width: '100%' }} 
                  />
                </td>
                <td style={tdStyle}>
                  <textarea 
                    key={`${f._id || f.order}-answer-${lang}`}
                    value={f.answer} 
                    onChange={e => setFAQField(idx, 'answer', e.target.value)} 
                    style={{ ...inputBase, width: '100%', minHeight: 64, resize: 'vertical' }} 
                  />
                </td>
                <td style={tdStyle}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <button onClick={() => onSave(f)} disabled={!hasToken || !isDirty(idx)} style={{ ...btnPrimary, opacity: hasToken && isDirty(idx) ? 1 : 0.6 }}>{savingOrder===f.order ? 'Saving…' : 'Save'}</button>
                    <button onClick={() => setFaqs(prev => prev.map((ff, i) => (i===idx ? { ...originalFaqs[idx] } : ff)))} disabled={!isDirty(idx)} style={{ ...btnSecondary, opacity: isDirty(idx) ? 1 : 0.6 }}>Revert</button>
                    <button onClick={() => setDeleteTarget(f)} disabled={!hasToken} style={{ ...btnSecondary, opacity: hasToken ? 1 : 0.6 }}>Delete</button>
                  </div>
                </td>
              </tr>
              );
            })}
            {faqs.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: 40, textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 48, opacity: 0.3 }}>❓</div>
                    <p style={{ color: '#94a3b8', fontSize: 15 }}>No FAQs yet. Click "Add FAQ" to create one.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <details open={addOpen} onToggle={e => setAddOpen((e.target as HTMLDetailsElement).open)} style={{ marginTop: 16 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 700 }}>Add New FAQ</summary>
        <div style={{ ...card, marginTop: 10 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <input 
              key="new-faq-order"
              type="number" 
              placeholder="Order" 
              min={0} 
              value={newFAQ.order} 
              onChange={e => setNewFAQ(prev => ({ ...prev, order: Number(e.target.value) }))} 
              style={{ ...inputBase, width: 140 }} 
            />
            <input 
              key="new-faq-question"
              placeholder="Question" 
              value={newFAQ.question} 
              onChange={e => setNewFAQ(prev => ({ ...prev, question: e.target.value }))} 
              style={{ ...inputBase, flex: '1 1 260px' }} 
            />
            <textarea 
              key="new-faq-answer"
              rows={3} 
              placeholder="Answer" 
              value={newFAQ.answer} 
              onChange={e => setNewFAQ(prev => ({ ...prev, answer: e.target.value }))} 
              style={{ ...inputBase, flex: '1 1 100%', minHeight: 80, resize: 'vertical' }} 
            />
          </div>
          <div style={{ marginTop: 12 }}>
            <button onClick={onAdd} disabled={newFAQ.order < 0 || !hasToken} style={{ ...btnPrimary, opacity: newFAQ.order >= 0 && hasToken ? 1 : 0.6 }}>Add FAQ</button>
            <button onClick={prefillSample} style={{ ...btnSecondary, marginLeft: 8 }}>Prefill sample</button>
          </div>
        </div>
      </details>
      {toast && (
        <div style={{ 
          position: 'fixed', 
          right: 20, 
          bottom: 20, 
          background: toast.type==='success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
          color: toast.type==='success' ? '#34d399' : '#f87171', 
          border: `1px solid ${toast.type==='success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, 
          borderRadius: 12, 
          padding: '14px 18px', 
          fontWeight: 600,
          backdropFilter: 'blur(12px)',
          boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          zIndex: 1000
        }}>
          <span style={{ fontSize: 20 }}>{toast.type==='success' ? '✓' : '⚠'}</span>
          <span>{toast.message}</span>
        </div>
      )}
      {deleteTarget && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.7)', 
          backdropFilter: 'blur(4px)',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50 
        }}>
          <div style={{ 
            background: 'rgba(30, 41, 59, 0.95)', 
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(51, 65, 85, 0.5)', 
            borderRadius: 16, 
            padding: 24, 
            minWidth: 400,
            maxWidth: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#fff' }}>🗑 Delete FAQ</div>
            <div style={{ color: '#cbd5e1', marginBottom: 20, lineHeight: 1.6 }}>
              Are you sure you want to delete FAQ with order <strong style={{ color: '#f87171' }}>{deleteTarget.order}</strong>? This action cannot be undone.
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button 
                onClick={() => setDeleteTarget(null)} 
                style={{ ...btnSecondary }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(17, 24, 39, 0.8)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = btnSecondary.background; }}
              >
                Cancel
              </button>
              <button 
                onClick={() => { const t = deleteTarget; setDeleteTarget(null); if (t) void onDelete(t); }} 
                style={{ ...btnPrimary, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)'; }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function isEqualFAQ(a: FAQItem, b: FAQItem) {
  return a.order===b.order && a.question===b.question && a.answer===b.answer;
}

