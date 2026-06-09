'use client'
import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, CheckCircle2, AlertTriangle, RotateCcw, ArrowRight, Zap, Brain
} from 'lucide-react'
import Link from 'next/link'

// ─── Types ───────────────────────────────────────────────────────────────────

interface Fault {
  key?: string
  message?: string
  severity?: string
  [key: string]: unknown
}

interface AnalysisResult {
  skill: string
  quality: string
  elite_score: number
  elite_micro_insights: Record<string, number>
  confidence: number
  reps_used: number
  frames_used: number
  primary_fix: string
  fix_severity: string | null
  fix_key: string | null
  fix_meta: Fault[]
  rep_label_votes: Record<string, number>
}

type Phase = 'idle' | 'uploading' | 'done' | 'error'

// ─── Config ──────────────────────────────────────────────────────────────────

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

const PROCESSING_MSGS = [
  'Extracting pose keypoints...',
  'Running GRU sequence model...',
  'Detecting rep boundaries...',
  'Computing elite score...',
  'Generating AI coaching fixes...',
]

const POSITIONS = [
  'Outside Hitter', 'Middle Blocker', 'Setter',
  'Libero', 'Opposite', 'Defensive Specialist',
]

const INSIGHT_KEYS: { key: string; label: string; scale: number }[] = [
  { key: 'rep_cleanliness',            label: 'REP CLEANLINESS',  scale: 1   },
  { key: 'athletic_posture_score',     label: 'ATHLETIC POSTURE', scale: 1   },
  { key: 'timing_consistency',         label: 'TIMING',           scale: 100 },
  { key: 'platform_stability',         label: 'STABILITY',        scale: 100 },
  { key: 'platform_angle_consistency', label: 'EXPLOSIVENESS',    scale: 100 },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function qualityColor(q: string) {
  if (q === 'good') return '#00d4ff'
  if (q === 'bad')  return '#ff3d3d'
  return '#ff9d00'
}

function qualityLabel(q: string, skill: string) {
  const s = skill === 'passing' ? 'Pass' : 'Set'
  if (q === 'good') return `${s}: Strong Form`
  if (q === 'bad')  return `${s}: Needs Work`
  return `${s}: Developing`
}

function scoreColor(s: number) {
  if (s >= 80) return '#00d4ff'
  if (s >= 60) return '#00e676'
  if (s >= 40) return '#ff9d00'
  return '#ff3d3d'
}

// ─── Skeleton SVG (animated during loading) ──────────────────────────────────

const BONES: [number, number, number, number][] = [
  [60,14, 60,34], [60,34, 40,68], [60,34, 80,68],
  [40,68, 30,104],[80,68, 92,104],[30,104, 22,136],[92,104, 100,136],
  [60,34, 52,115],[60,34, 70,115],[52,115, 46,164],[70,115, 76,164],
  [46,164, 42,196],[76,164, 80,196],
]
const JOINT_POS: [number, number][] = [
  [60,14],[60,34],[40,68],[80,68],[30,104],[92,104],[22,136],[100,136],
  [52,115],[70,115],[46,164],[76,164],[42,196],[80,196],
]

function SkeletonSVG() {
  return (
    <svg viewBox="0 0 120 210" width="72" height="126">
      {BONES.map(([x1,y1,x2,y2], i) => (
        <motion.line
          key={i} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(0,212,255,0.5)" strokeWidth="1.5" strokeLinecap="round"
          animate={{ opacity:[0.3,1,0.3], strokeWidth:[1.5,2.5,1.5] }}
          transition={{ duration:1.8, delay:i*0.07, repeat:Infinity, ease:'easeInOut' }}
        />
      ))}
      {JOINT_POS.map(([cx,cy], i) => (
        <motion.circle
          key={i} cx={cx} cy={cy} r={3} fill="var(--cyan)"
          animate={{ opacity:[0.4,1,0.4], r:[2.5,4,2.5] }}
          transition={{ duration:1.5, delay:i*0.06, repeat:Infinity, ease:'easeInOut' }}
        />
      ))}
    </svg>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function DemoHero() {
  const [phase,          setPhase]         = useState<Phase>('idle')
  const [result,         setResult]        = useState<AnalysisResult | null>(null)
  const [error,          setError]         = useState('')
  const [skill,          setSkill]         = useState<'passing' | 'setting'>('passing')
  const [position,       setPosition]      = useState('Outside Hitter')
  const [dragOver,       setDragOver]      = useState(false)
  const [fileName,       setFileName]      = useState('')
  const [procStep,       setProcStep]      = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const stepRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const runAnalysis = useCallback(async (file: File) => {
    setFileName(file.name)
    setPhase('uploading')
    setProcStep(0)

    stepRef.current = setInterval(() => {
      setProcStep(s => Math.min(s + 1, PROCESSING_MSGS.length - 1))
    }, 3500)

    const fd = new FormData()
    fd.append('file', file)
    fd.append('forced_skill', skill)
    fd.append('position', position)

    try {
      const res = await fetch(`${API_URL}/analyze`, { method: 'POST', body: fd })
      if (stepRef.current) clearInterval(stepRef.current)

      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: 'Analysis failed.' }))
        throw new Error(body.detail ?? 'Analysis failed.')
      }
      const data = await res.json()
      setResult(data)
      setPhase('done')
    } catch (e) {
      if (stepRef.current) clearInterval(stepRef.current)
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setPhase('error')
    }
  }, [skill, position])

  const pickFile = useCallback((file: File) => {
    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file (MP4, MOV, AVI).')
      setPhase('error')
      return
    }
    runAnalysis(file)
  }, [runAnalysis])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) pickFile(f)
  }, [pickFile])

  const reset = () => {
    setPhase('idle')
    setResult(null)
    setError('')
    setFileName('')
    setProcStep(0)
    if (fileRef.current) fileRef.current.value = ''
  }

  const progressPct = Math.round(((procStep + 1) / PROCESSING_MSGS.length) * 80 + 8)

  return (
    <section
      className="relative overflow-hidden"
      style={{ paddingTop: '120px', paddingBottom: '6rem', background: 'var(--void)', minHeight: '100vh' }}
    >
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(0,212,255,0.06) 0%, transparent 65%)' }}
      />

      <div className="container-max relative">
        <AnimatePresence mode="wait">

          {/* ── IDLE / ERROR ── */}
          {(phase === 'idle' || phase === 'error') && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start"
            >
              {/* Left */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="badge mb-6">
                  <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: 'var(--cyan)' }} />
                  Live AI Analysis
                </div>
                <h1 className="display-xl text-white mb-5">
                  Upload.<br />
                  <span className="gradient-text">Analyze.<br />Improve.</span>
                </h1>
                <p className="text-lg mb-8" style={{ color: 'var(--text-muted)', maxWidth: '400px', lineHeight: 1.7 }}>
                  Film any volleyball skill. Upload the clip. Get your objective AI performance score in under 60 seconds.
                </p>
                <div className="flex flex-col gap-2.5">
                  {[
                    'Frame-by-frame YOLOv8 pose detection',
                    'Bidirectional GRU sequence classifier',
                    'Objective 0–100 score, not subjective feedback',
                  ].map(f => (
                    <div key={f} className="flex items-center gap-2.5">
                      <CheckCircle2 size={14} style={{ color: '#00e676', flexShrink: 0 }} />
                      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right: Upload card */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.0, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  id="upload"
                  className="rounded-2xl overflow-hidden"
                  style={{ background: '#050710', border: '1px solid rgba(0,212,255,0.14)' }}
                >
                  <div
                    className="flex items-center gap-2 px-5 py-3.5"
                    style={{ background: '#060810', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: 'var(--cyan)' }} />
                    <span className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--cyan)' }}>
                      ANALYSIS ENGINE v2.1
                    </span>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Skill + Position */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="font-mono text-[9px] tracking-widest mb-1.5" style={{ color: 'var(--text-subtle)' }}>SKILL</div>
                        <select
                          value={skill}
                          onChange={e => setSkill(e.target.value as 'passing' | 'setting')}
                          className="w-full rounded-lg px-3 py-2.5 text-sm font-medium text-white"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', outline: 'none', cursor: 'pointer', colorScheme: 'dark' }}
                        >
                          <option value="passing">Passing</option>
                          <option value="setting">Setting</option>
                        </select>
                      </div>
                      <div>
                        <div className="font-mono text-[9px] tracking-widest mb-1.5" style={{ color: 'var(--text-subtle)' }}>POSITION</div>
                        <select
                          value={position}
                          onChange={e => setPosition(e.target.value)}
                          className="w-full rounded-lg px-3 py-2.5 text-sm font-medium text-white"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', outline: 'none', cursor: 'pointer', colorScheme: 'dark' }}
                        >
                          {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Drop zone */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => fileRef.current?.click()}
                      onKeyDown={e => e.key === 'Enter' && fileRef.current?.click()}
                      onDrop={onDrop}
                      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-12 px-6 text-center cursor-pointer transition-all"
                      style={{
                        borderColor: dragOver ? 'var(--cyan)' : 'rgba(0,212,255,0.22)',
                        background:  dragOver ? 'rgba(0,212,255,0.06)' : 'rgba(0,212,255,0.02)',
                      }}
                    >
                      <div
                        className="flex items-center justify-center rounded-2xl mb-4"
                        style={{ width: '56px', height: '56px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.16)' }}
                      >
                        <Upload size={24} style={{ color: 'var(--cyan)' }} />
                      </div>
                      <div className="font-semibold text-white mb-1.5">
                        {dragOver ? 'Drop to analyze' : 'Drop your clip here'}
                      </div>
                      <div className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
                        MP4, MOV, AVI · Up to 4K · Up to 3 min
                      </div>
                      <div
                        className="btn-primary"
                        style={{ fontSize: '0.82rem', padding: '0.55rem 1.25rem', pointerEvents: 'none' }}
                      >
                        Choose File
                      </div>
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={e => { const f = e.target.files?.[0]; if (f) pickFile(f) }}
                    />

                    {/* Error banner */}
                    {phase === 'error' && (
                      <div
                        className="rounded-xl p-4 flex items-start gap-3"
                        style={{ background: 'rgba(255,61,61,0.07)', border: '1px solid rgba(255,61,61,0.18)' }}
                      >
                        <AlertTriangle size={15} style={{ color: '#ff3d3d', flexShrink: 0, marginTop: '1px' }} />
                        <div>
                          <div className="text-sm font-semibold text-white mb-0.5">Analysis failed</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{error}</div>
                        </div>
                      </div>
                    )}

                    <div className="text-center">
                      <span className="text-xs" style={{ color: 'var(--text-subtle)' }}>
                        Free — 2 analyses/month · No card required
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ── PROCESSING ── */}
          {phase === 'uploading' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="max-w-lg mx-auto"
            >
              <div
                className="rounded-2xl overflow-hidden"
                style={{ background: '#050710', border: '1px solid rgba(0,212,255,0.18)' }}
              >
                <div
                  className="flex items-center justify-between px-5 py-3.5"
                  style={{ background: '#060810', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full pulse-dot" style={{ background: 'var(--cyan)' }} />
                    <span className="font-mono text-[10px] tracking-widest" style={{ color: 'var(--cyan)' }}>ANALYZING</span>
                  </div>
                  <span className="font-mono text-[9px] truncate max-w-[160px]" style={{ color: 'var(--text-subtle)' }}>
                    {fileName}
                  </span>
                </div>

                <div className="p-10 text-center">
                  <div className="flex justify-center mb-8">
                    <SkeletonSVG />
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={procStep}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="font-mono text-sm mb-1" style={{ color: 'var(--cyan)' }}>
                        {PROCESSING_MSGS[procStep]}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                  <div className="text-xs mt-2 mb-8" style={{ color: 'var(--text-subtle)' }}>
                    Usually 15–60 seconds depending on video length
                  </div>

                  <div className="h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'linear-gradient(90deg,#00d4ff,#1d6aff)' }}
                      initial={{ width: '5%' }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.9 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── RESULTS ── */}
          {phase === 'done' && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Top bar */}
              <div className="flex items-center justify-between mb-10">
                <div>
                  <div className="badge mb-3">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#00e676' }} />
                    Analysis Complete
                  </div>
                  <h1 className="display-xl text-white">Your Results</h1>
                </div>
                <button
                  onClick={reset}
                  className="flex items-center gap-2 text-sm font-medium"
                  style={{ color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)' }}
                >
                  <RotateCcw size={14} />
                  Analyze Another
                </button>
              </div>

              <div
                className="rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(0,212,255,0.14)', background: '#04060d' }}
              >
                {/* Status bar */}
                <div
                  className="flex items-center justify-between px-6 py-4 flex-wrap gap-3"
                  style={{ background: '#060810', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: '#00e676' }} />
                    <span className="font-mono text-[10px] tracking-[0.18em]" style={{ color: '#00e676' }}>
                      ANALYSIS COMPLETE
                    </span>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span
                      className="font-mono text-[9px] px-2.5 py-1 rounded-full font-bold"
                      style={{
                        background: `${qualityColor(result.quality)}15`,
                        color: qualityColor(result.quality),
                        border: `1px solid ${qualityColor(result.quality)}25`,
                      }}
                    >
                      {qualityLabel(result.quality, result.skill).toUpperCase()}
                    </span>
                    <span className="font-mono text-[9px]" style={{ color: 'var(--text-muted)' }}>
                      {result.reps_used} rep{result.reps_used !== 1 ? 's' : ''} · {result.frames_used} frames · {Math.round(result.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3">
                  {/* Score + micro insights */}
                  <div className="p-8" style={{ borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="font-mono text-[10px] tracking-widest mb-6" style={{ color: 'var(--text-subtle)' }}>
                      ELITE SCORE
                    </div>

                    <div className="flex items-baseline gap-2 mb-3">
                      <motion.span
                        className="font-black"
                        style={{ fontSize: '72px', lineHeight: 1, color: scoreColor(result.elite_score) }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      >
                        {result.elite_score}
                      </motion.span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '20px' }}>/100</span>
                    </div>

                    <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg,${scoreColor(result.elite_score)},#1d6aff)` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.elite_score}%` }}
                        transition={{ duration: 1.4, delay: 0.5 }}
                      />
                    </div>

                    <div className="text-xs mb-8" style={{ color: 'var(--text-muted)' }}>
                      {result.skill.charAt(0).toUpperCase() + result.skill.slice(1)} · {position}
                    </div>

                    <div className="space-y-4">
                      {INSIGHT_KEYS.map(({ key, label, scale }) => {
                        const raw = result.elite_micro_insights?.[key] ?? 0
                        const val = Math.min(100, Math.max(0, Math.round(raw * scale)))
                        const c   = val >= 70 ? '#00d4ff' : val >= 50 ? '#ff9d00' : '#ff3d3d'
                        return (
                          <div key={key}>
                            <div className="flex justify-between font-mono text-[9px] mb-1.5">
                              <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                              <span style={{ color: c }}>{val}</span>
                            </div>
                            <div className="h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: c }}
                                initial={{ width: 0 }}
                                animate={{ width: `${val}%` }}
                                transition={{ duration: 0.9, delay: 0.5 }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* AI coaching */}
                  <div className="p-8 lg:col-span-2">
                    <div className="font-mono text-[10px] tracking-widest mb-6" style={{ color: 'var(--text-subtle)' }}>
                      AI COACHING ANALYSIS
                    </div>

                    {/* Primary fix */}
                    <div
                      className="rounded-xl p-5 mb-5"
                      style={{
                        background: `${qualityColor(result.quality)}09`,
                        border: `1px solid ${qualityColor(result.quality)}22`,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <Brain size={16} style={{ color: qualityColor(result.quality), flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <div className="font-mono text-[9px] tracking-widest mb-2" style={{ color: qualityColor(result.quality) }}>
                            PRIMARY FOCUS{result.fix_severity ? ` · ${result.fix_severity.toUpperCase()}` : ''}
                          </div>
                          <p className="text-sm leading-relaxed text-white">{result.primary_fix}</p>
                        </div>
                      </div>
                    </div>

                    {/* Additional faults from fix_meta */}
                    {Array.isArray(result.fix_meta) && result.fix_meta.length > 0 && (
                      <div className="space-y-3 mb-5">
                        {result.fix_meta.slice(0, 3).map((fault, i) => {
                          const sev = typeof fault.severity === 'string' ? fault.severity : 'info'
                          const color = sev === 'high' ? '#ff3d3d' : sev === 'medium' ? '#ff9d00' : '#00d4ff'
                          const msg   = typeof fault.message === 'string'
                            ? fault.message
                            : typeof fault === 'string'
                            ? fault
                            : JSON.stringify(fault)
                          return (
                            <div
                              key={i}
                              className="rounded-lg px-4 py-3 flex items-start gap-3"
                              style={{ background: `${color}07`, border: `1px solid ${color}18` }}
                            >
                              <AlertTriangle size={12} style={{ color, flexShrink: 0, marginTop: '3px' }} />
                              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{msg}</p>
                            </div>
                          )
                        })}
                      </div>
                    )}

                    {/* Interpretation */}
                    <div
                      className="rounded-xl p-5 mb-6"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Zap size={13} style={{ color: 'var(--cyan)' }} />
                        <span className="font-mono text-[9px] tracking-widest" style={{ color: 'var(--text-subtle)' }}>
                          WHAT THIS MEANS
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {result.quality === 'good'
                          ? `Your ${result.skill} technique is strong. This score puts you in the upper tier for your position. Target the metrics above to push from good to elite.`
                          : result.quality === 'bad'
                          ? `The AI detected specific technical breakdowns in your ${result.skill}. These are fixable with targeted repetition — the note above tells you exactly what to address.`
                          : `Your ${result.skill} has the fundamentals in place but shows inconsistency. Drill the coaching cue above until the movement becomes automatic.`}
                      </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap gap-3">
                      <Link href="/pricing" className="btn-primary" style={{ fontSize: '0.85rem' }}>
                        Unlock Full Analysis
                        <ArrowRight size={14} />
                      </Link>
                      <button
                        onClick={reset}
                        className="btn-secondary flex items-center gap-2"
                        style={{ fontSize: '0.85rem' }}
                      >
                        <RotateCcw size={13} />
                        Analyze Another Clip
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </section>
  )
}
