"use client";
import { useState } from "react";
import { Send, Binary, Radio, CheckCircle2, AlertTriangle, Activity } from "lucide-react";

type Result = {
  status: string; message?: string; timestamp?: string; original_message?: string;
  ascii_values?: number[]; binary_data?: string; encoding_scheme?: string; encoded_signal?: string;
  transmitted_signal?: string; decoded_binary?: string; recovered_message?: string;
  success?: boolean; source_bits?: number; channel_bits?: number;
};


const Box = ({title, subtitle, value, accent="cyan"}:{title:string;subtitle:string;value:string;accent?:string}) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 min-w-0">
    <div className={`text-${accent}-400 text-[10px] font-black tracking-[.22em] uppercase`}>{title}</div>
    <div className="text-slate-500 text-xs mt-1 mb-3">{subtitle}</div>
    <div className="rounded-xl bg-black/40 border border-white/5 p-4 font-mono text-sm break-all max-h-40 overflow-auto text-slate-200">{value || "—"}</div>
  </div>
);

const ManchesterWaveform = ({bits, title}:{bits:string; title:string}) => {
  const shown = bits.slice(0, 24);
  const levels:number[] = [];
  for (const bit of shown) levels.push(bit === "0" ? 1 : 0, bit === "0" ? 0 : 1);
  const step = 18, high = 24, low = 68, left = 22;
  let d = levels.length ? `M ${left} ${levels[0] ? high : low}` : "";
  levels.forEach((level,i) => {
    const y = level ? high : low, x2 = left + (i+1)*step;
    d += ` H ${x2}`;
    if(i < levels.length-1) d += ` V ${levels[i+1] ? high : low}`;
  });
  return <div className="rounded-2xl border border-cyan-500/20 bg-black/30 p-5 overflow-hidden">
    <div className="flex items-center justify-between gap-3 mb-3"><div><div className="text-cyan-400 text-[10px] font-black tracking-[.22em] uppercase">{title}</div><div className="text-xs text-slate-500 mt-1">First {shown.length} source bits • HIGH/LOW Manchester transitions</div></div><Radio className="text-cyan-400 animate-pulse" size={20}/></div>
    <div className="overflow-x-auto"><svg width={Math.max(700,left+levels.length*step+25)} height="118" viewBox={`0 0 ${Math.max(700,left+levels.length*step+25)} 118`} className="min-w-[700px]">
      <text x="0" y="28" fill="#64748b" fontSize="10">HIGH</text><text x="2" y="72" fill="#64748b" fontSize="10">LOW</text>
      <line x1={left} y1={high} x2={left+levels.length*step} y2={high} stroke="#1e293b" strokeDasharray="3 5"/><line x1={left} y1={low} x2={left+levels.length*step} y2={low} stroke="#1e293b" strokeDasharray="3 5"/>
      <path d={d} fill="none" stroke="currentColor" strokeWidth="3" className="text-cyan-400 waveform-path"/>
      {shown.split("").map((b,i)=><g key={i}><line x1={left+i*step*2} y1="82" x2={left+i*step*2} y2="88" stroke="#475569"/><text x={left+i*step*2+step} y="104" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontWeight="700">{b}</text></g>)}
    </svg></div>
    <div className="text-xs text-slate-400 mt-1">Convention: <b className="text-cyan-400">0 = HIGH→LOW (01)</b> • <b className="text-cyan-400">1 = LOW→HIGH (10)</b></div>
  </div>;
};

export default function Home() {
  const [message, setMessage] = useState("HELLO");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const transmit = async () => {
    setLoading(true);
    try {
      const r = await fetch("http://localhost:8000/api/communicate", {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message})});
      setResult(await r.json());
    } catch {
      setResult({status:"Error",message:"Backend is not running. Start backend first on port 8000."});
    } finally { setLoading(false); }
  };



  return <main className="min-h-screen bg-[#05070b] text-slate-200">
    <header className="border-b border-white/10 bg-black/30 px-6 md:px-10 py-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4"><div className="p-3 bg-cyan-400 rounded-2xl"><Radio className="text-black"/></div><div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">DIGITAL DATA TRANSMISSION</h1>
          <p className="text-xs text-cyan-400 tracking-[.25em] font-bold">MANCHESTER ENCODING • TRANSMISSION • DECODING</p>
        </div></div>
        <div className="text-xs border border-green-500/30 text-green-400 rounded-xl px-4 py-2 flex items-center gap-2"><Activity size={14}/> MINI PROJECT DEMO</div>
      </div>
    </header>

    <div className="max-w-7xl mx-auto p-6 md:p-10 space-y-8">
      <section className="rounded-3xl border border-cyan-500/20 bg-cyan-500/[.035] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-5"><Send className="text-cyan-400"/><div><h2 className="font-black text-xl text-white">Digital Communication Demonstration</h2><p className="text-sm text-slate-400">Enter information at the transmitter and observe every stage up to the receiver.</p></div></div>
        <div className="flex flex-col md:flex-row gap-3">
          <input value={message} maxLength={120} onChange={e=>setMessage(e.target.value)} onKeyDown={e=>e.key==='Enter'&&transmit()} className="flex-1 rounded-xl bg-black/40 border border-white/10 px-5 py-4 outline-none focus:border-cyan-400 font-mono" placeholder="Enter message e.g. HELLO"/>
          <button onClick={transmit} disabled={loading} className="rounded-xl bg-cyan-400 text-black font-black px-7 py-4 hover:bg-cyan-300 disabled:opacity-50">{loading?"TRANSMITTING...":"ENCODE & TRANSMIT"}</button>
        </div>
        {result?.status === "Error" && <div className="mt-4 text-red-400 flex items-center gap-2"><AlertTriangle size={16}/>{result.message}</div>}
      </section>

      {result?.status === "Success" && <>
        <section>
          <div className="flex items-center gap-2 mb-4"><Binary className="text-cyan-400"/><h2 className="font-black text-white">LIVE ENCODING & DECODING OUTPUT</h2></div>
          <div className="grid md:grid-cols-2 gap-4">
            <Box title="1. SOURCE MESSAGE" subtitle="Information generated at transmitter" value={result.original_message || ""}/>
            <Box title="2. UTF-8 / ASCII VALUES" subtitle="Character values before binary conversion" value={(result.ascii_values || []).join("  ")}/>
            <Box title="3. BINARY DATA" subtitle="8-bit source representation" value={result.binary_data || ""}/>
            <Box title="4. ENCODER OUTPUT" subtitle={result.encoding_scheme || "Manchester encoding"} value={result.encoded_signal || ""}/>
            <Box title="5. DIGITAL CHANNEL" subtitle="Manchester signal transmitted through ideal channel" value={result.transmitted_signal || ""}/>
            <Box title="6. DECODER OUTPUT" subtitle="Manchester decoder reconstructs original bits" value={result.decoded_binary || ""}/>
          </div>
          <div className="mt-4 grid lg:grid-cols-2 gap-4">
            <ManchesterWaveform bits={result.binary_data || ""} title="TRANSMITTER • MANCHESTER WAVEFORM"/>
            <ManchesterWaveform bits={result.decoded_binary || ""} title="RECEIVER • RECOVERED WAVEFORM"/>
          </div>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[.025] p-5">
            <div className="text-[10px] font-black tracking-[.22em] text-cyan-400 mb-3">LIVE SIGNAL PATH</div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">{["SOURCE","BINARY","MANCHESTER ENCODER","DIGITAL CHANNEL","MANCHESTER DECODER","DESTINATION"].map((x,i)=><span key={x} className="contents"><span className="rounded-lg border border-white/10 bg-black/30 px-3 py-2">{x}</span>{i<5&&<span className="text-cyan-400 animate-pulse">→</span>}</span>)}</div>
          </div>
        </section>

        <section className={`rounded-3xl border p-7 ${result.success?'border-green-500/30 bg-green-500/[.05]':'border-red-500/30 bg-red-500/[.05]'}`}>
          <div className="flex items-start gap-4">{result.success?<CheckCircle2 className="text-green-400 mt-1" size={30}/>:<AlertTriangle className="text-red-400"/>}<div>
            <div className="text-xs text-slate-500 font-bold tracking-widest">7. RECEIVER / RECOVERED MESSAGE</div>
            <div className="text-3xl font-black text-white mt-2 break-all">{result.recovered_message}</div>
            <div className={`mt-2 font-bold ${result.success?'text-green-400':'text-red-400'}`}>{result.success?"✓ ORIGINAL MESSAGE = DECODED MESSAGE • COMMUNICATION SUCCESSFUL":"✕ DATA MISMATCH"}</div>
          </div></div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
          {[['Source bits',result.source_bits],['Channel bits',result.channel_bits],['Encoding','Manchester'],['Time',result.timestamp]].map(([k,v])=><div key={String(k)} className="rounded-xl border border-white/10 bg-white/[.03] p-4"><div className="text-[10px] uppercase text-slate-500 font-bold">{k}</div><div className="mt-1 font-black text-cyan-400">{v}</div></div>)}
        </section>
      </>}



      <section className="rounded-2xl border border-white/10 p-5 text-sm text-slate-400">
        <b className="text-white">Block flow:</b> Source → UTF-8/ASCII → Binary → Manchester Encoder → Digital Channel → Manchester Decoder → Binary → Recovered Message. Convention: <b className="text-cyan-400">0 → 01</b>, <b className="text-cyan-400">1 → 10</b>.
      </section>
    </div>
  </main>;
}
