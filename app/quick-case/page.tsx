'use client';
import { useState, useMemo } from 'react';

export default function QuickCasePage() {
  const [tumor, setTumor] = useState('');
  const [gene, setGene] = useState('');
  const [hgvs, setHgvs] = useState('');
  const [outcome, setOutcome] = useState('');
  const [response, setResponse] = useState('');
  const [duration, setDuration] = useState('');
  const [toxicity, setToxicity] = useState('');
  const [summary, setSummary] = useState('');
  const [attest, setAttest] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    setMsg('Submitting…');
    const res = await fetch('/api/cases', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tumor, gene, hgvs, outcome, response, duration, toxicity, summary, attest })
    });
    const data = await res.json();
    setMsg(res.ok ? `✅ Saved: ${data.id}` : `❌ ${data.error || 'Error'}`);
  }

  const tags = useMemo(() => {
    const list: string[] = [];
    if (tumor) list.push(tumor);
    if (gene) list.push(gene.toUpperCase());
    if (gene && hgvs) list.push(`${gene.toUpperCase()} ${hgvs}`);
    if (outcome) list.push(outcome);
    if (response) list.push(`Response: ${response}`);
    if (duration) list.push(`Duration: ${duration}`);
    if (toxicity) list.push(toxicity === 'None' ? 'Toxicity: None' : `CTCAE ${toxicity}`);
    return list;
  }, [tumor, gene, hgvs, outcome, response, duration, toxicity]);

  return (
    <div className="card">
      <h1>Quick Case</h1>
      <div className="row cols-2">
        <div>
          <label>Tumor (OncoTree)</label>
          <input value={tumor} onChange={e=>setTumor(e.target.value)} placeholder="e.g., LUAD" />
        </div>
        <div>
          <label>Gene (HGNC)</label>
          <input value={gene} onChange={e=>setGene(e.target.value)} placeholder="e.g., KRAS" />
        </div>
      </div>
      <div className="row cols-2">
        <div>
          <label>Variant (HGVS)</label>
          <input value={hgvs} onChange={e=>setHgvs(e.target.value)} placeholder="e.g., p.G12C" />
        </div>
        <div>
          <label>Outcome (free text)</label>
          <input value={outcome} onChange={e=>setOutcome(e.target.value)} placeholder="e.g., Exceptional response" />
        </div>
      </div>
      <h2>Bins (quick categories)</h2>
      <div className="row cols-3">
        <select value={response} onChange={e=>setResponse(e.target.value)}>
          <option value="">Response</option><option>CR</option><option>PR</option><option>SD</option><option>PD</option><option>Mixed</option><option>Unknown</option>
        </select>
        <select value={duration} onChange={e=>setDuration(e.target.value)}>
          <option value="">Duration</option><option>&lt;3 mo</option><option>3–6 mo</option><option>6–12 mo</option><option>12–24 mo</option><option>&gt;24 mo</option><option>Unknown</option>
        </select>
        <select value={toxicity} onChange={e=>setToxicity(e.target.value)}>
          <option value="">Toxicity</option><option>None</option><option>G1–2</option><option>≥G3</option><option>Immune-related</option><option>Unknown</option>
        </select>
      </div>
      <label>Summary (2–3 lines, no identifiers)</label>
      <textarea value={summary} onChange={e=>setSummary(e.target.value)} rows={4} placeholder="Month–year only; avoid names/places." />
      <label><input type="checkbox" checked={attest} onChange={e=>setAttest(e.target.checked)} /> I attest this is de-identified</label>
      <div style={{display:'flex', gap:10, alignItems:'center', marginTop:8}}>
        <button className="btn" onClick={submit}>Submit</button>
        {msg && <span className="note">{msg}</span>}
      </div>
      <h2>Auto-tags (preview)</h2>
      <div className="chips">{tags.map((t,i)=><span key={i} className="chip">{t}</span>)}</div>
    </div>
  );
}
