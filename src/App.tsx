import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ClipboardList, CheckCircle2, XCircle, UtensilsCrossed, Clock, Trash2 } from 'lucide-react'

const STORAGE_KEY = 'potluck-rsvp-v1'

const EVENT = {
  title: 'Team Potluck',
  subtitle: 'SDM',
  date: '30th April 2026',
  time: '12PM – 2PM',
  note: "Good food, great company. Let us know if you'll be joining the feast.",
}

interface RSVP {
  id: number
  name: string
  attending: boolean
  bringing: string
  allergies: string
  time: string
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function App() {
  const [rsvps, setRsvps] = useState<RSVP[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    } catch {
      return []
    }
  })

  const [name, setName] = useState('')
  const [attending, setAttending] = useState(true)
  const [bringing, setBringing] = useState('')
  const [allergies, setAllergies] = useState('')
  const [flash, setFlash] = useState<string | null>(null)
  const [wipeModalOpen, setWipeModalOpen] = useState(false)
  const [wipeUser, setWipeUser] = useState('')
  const [wipePass, setWipePass] = useState('')
  const [wipeError, setWipeError] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rsvps))
  }, [rsvps])

  const stats = {
    total: rsvps.length,
    attending: rsvps.filter(r => r.attending).length,
    notAttending: rsvps.filter(r => !r.attending).length,
  }

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!name.trim()) return

    const idx = rsvps.findIndex(
      r => r.name.toLowerCase() === name.trim().toLowerCase()
    )
    const entry: RSVP = {
      id: idx >= 0 ? rsvps[idx].id : Date.now(),
      name: name.trim(),
      attending,
      bringing: bringing.trim(),
      allergies: allergies.trim(),
      time: new Date().toISOString(),
    }

    if (idx >= 0) {
      setRsvps(prev => prev.map((r, i) => (i === idx ? entry : r)))
      triggerFlash('Response updated')
    } else {
      setRsvps(prev => [...prev, entry])
      triggerFlash('RSVP submitted!')
    }

    setName('')
    setBringing('')
    setAllergies('')
    setAttending(true)
  }

  function triggerFlash(msg: string) {
    setFlash(msg)
    setTimeout(() => setFlash(null), 2800)
  }

  function handleWipeConfirm() {
    if (wipeUser === 'Admin' && wipePass === 'Admin') {
      setRsvps([])
      setWipeModalOpen(false)
      setWipeUser('')
      setWipePass('')
      setWipeError('')
      triggerFlash('All data wiped.')
    } else {
      setWipeError('Invalid credentials.')
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Wipe credentials modal */}
      {wipeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80">
            <h2 className="text-sm font-semibold text-stone-800 mb-1">Admin credentials required</h2>
            <p className="text-xs text-stone-500 mb-4">Enter your credentials to wipe all data.</p>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Username"
                value={wipeUser}
                onChange={e => setWipeUser(e.target.value)}
                className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              <input
                type="password"
                placeholder="Password"
                value={wipePass}
                onChange={e => setWipePass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleWipeConfirm()}
                className="w-full border border-stone-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-rose-300"
              />
              {wipeError && <p className="text-xs text-rose-500">{wipeError}</p>}
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setWipeModalOpen(false)}
                className="text-xs px-3 py-1.5 rounded border border-stone-300 text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleWipeConfirm}
                className="text-xs px-3 py-1.5 rounded bg-rose-500 text-white hover:bg-rose-600"
              >
                Wipe data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {flash && (
        <div className="fixed top-5 right-5 z-50 bg-[#1C1917] text-white text-sm font-medium px-4 py-2.5 rounded shadow-lg">
          {flash}
        </div>
      )}

      <div className="max-w-xl mx-auto px-5 py-10">
        {/* ── FORM CARD ─────────────────────────────── */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm mb-7">
          {/* Header strip */}
          <div className="relative bg-[#18160F] overflow-hidden">
            {/* Ambient terracotta glow */}
            <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(228,92,43,0.22) 0%, transparent 68%)' }} />
            {/* Subtle grid texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
              style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
                backgroundSize: '28px 28px',
              }} />

            <div className="relative flex items-center justify-between gap-4 px-7 py-8">
              {/* Left: text content */}
              <div className="flex-1 min-w-0">
                {/* Date badge */}
                <div className="inline-flex items-center gap-2 mb-4 px-2.5 py-1 rounded-full border border-[#E45C2B]/30 bg-[#E45C2B]/10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E45C2B]"
                    style={{ animation: 'dot-drift 2s ease-in-out infinite' }} />
                  <span className="text-[10px] font-bold tracking-[0.22em] uppercase text-[#E45C2B]">
                    {EVENT.date}
                  </span>
                  <span className="text-stone-600 text-[10px]">·</span>
                  <span className="text-[10px] font-semibold tracking-wider text-stone-400 uppercase">
                    {EVENT.time}
                  </span>
                </div>

                <h1 className="text-[1.9rem] font-bold text-white leading-[1.1] tracking-tight">
                  {EVENT.title}
                </h1>
                <p className="text-[#E45C2B] text-base font-semibold mt-1 tracking-wide">
                  — {EVENT.subtitle}
                </p>
                <p className="mt-3 text-sm text-stone-500 leading-relaxed" style={{ maxWidth: '32ch' }}>
                  {EVENT.note}
                </p>
              </div>

              {/* Right: animated SVG graphic */}
              <div className="feast-float flex-shrink-0" style={{ width: 108, height: 108 }}>
                <svg viewBox="0 0 108 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Plate rings */}
                  <circle cx="54" cy="66" r="38" stroke="white" strokeWidth="1" opacity="0.1" />
                  <circle cx="54" cy="66" r="29" stroke="white" strokeWidth="0.75" opacity="0.07" />
                  {/* Food on plate */}
                  <circle cx="54" cy="66" r="11" fill="#E45C2B" opacity="0.2" />
                  <circle cx="54" cy="66" r="5.5" fill="#E45C2B" opacity="0.5" />

                  {/* Fork — left, tilted */}
                  <g transform="rotate(-18 54 66)" opacity="0.8">
                    <line x1="40" y1="22" x2="40" y2="56" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="36" y1="22" x2="36" y2="36" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="44" y1="22" x2="44" y2="36" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M36 36 Q36 42 40 42 Q44 42 44 36" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
                  </g>

                  {/* Knife — right, tilted */}
                  <g transform="rotate(18 54 66)" opacity="0.8">
                    <line x1="68" y1="22" x2="68" y2="56" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M68 22 C68 22 75 29 75 38 L68 41" stroke="white" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  </g>

                  {/* Steam — animated */}
                  <path className="steam-a" d="M46 18 Q48 13 46 8" stroke="#E45C2B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  <path className="steam-b" d="M54 16 Q56 11 54 6" stroke="#E45C2B" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                  <path className="steam-c" d="M62 18 Q64 13 62 8" stroke="#E45C2B" strokeWidth="1.5" strokeLinecap="round" fill="none" />

                  {/* Accent dots */}
                  <circle className="dot-drift-1" cx="14" cy="52" r="2.5" fill="#E45C2B" />
                  <circle className="dot-drift-2" cx="94" cy="48" r="2.5" fill="#E45C2B" />
                  <circle className="dot-drift-3" cx="16" cy="78" r="1.5" fill="white" opacity="0.2" />
                  <circle cx="92" cy="76" r="1.5" fill="white" opacity="0.15" />
                  <circle cx="10" cy="64" r="1" fill="white" opacity="0.12" />
                  <circle cx="98" cy="62" r="1" fill="white" opacity="0.12" />
                </svg>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(228,92,43,0.45), transparent)' }} />
          </div>

          {/* Form body */}
          <form onSubmit={handleSubmit} className="px-7 py-6 space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-stone-800">Your Name</label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="rounded-lg border-stone-200 bg-stone-50 placeholder:text-stone-400 focus-visible:ring-[#E45C2B]"
              />
              <p className="text-xs text-stone-400">
                Already RSVP'd? Use the same name to update your response.
              </p>
            </div>

            {/* Attending toggle */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-stone-800">Will you be attending?</label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setAttending(true)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                    attending
                      ? 'border-[#E45C2B] bg-orange-50 text-[#E45C2B]'
                      : 'border-stone-200 text-stone-400 hover:border-stone-300'
                  }`}
                >
                  <CheckCircle2 size={15} /> Yes, I'm in!
                </button>
                <button
                  type="button"
                  onClick={() => setAttending(false)}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium border-2 transition-all ${
                    !attending
                      ? 'border-stone-700 bg-stone-100 text-stone-700'
                      : 'border-stone-200 text-stone-400 hover:border-stone-300'
                  }`}
                >
                  <XCircle size={15} /> Can't make it
                </button>
              </div>
            </div>

            {/* Bringing */}
            {attending && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-stone-800">
                  What are you bringing?{' '}
                  <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <Input
                  value={bringing}
                  onChange={e => setBringing(e.target.value)}
                  placeholder="e.g. Potato Salad, Brownies…"
                  className="rounded-lg border-stone-200 bg-stone-50 placeholder:text-stone-400 focus-visible:ring-[#E45C2B]"
                />
              </div>
            )}

            {/* Allergies — only relevant when attending */}
            {attending && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-stone-800">
                  Any allergies we should know about?{' '}
                  <span className="text-stone-400 font-normal">(Optional)</span>
                </label>
                <Input
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  placeholder="e.g. Nuts, Gluten, Dairy…"
                  className="rounded-lg border-stone-200 bg-stone-50 placeholder:text-stone-400 focus-visible:ring-[#E45C2B]"
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#E45C2B] hover:bg-[#c94e22] text-white rounded-lg h-11 text-sm font-semibold tracking-wide"
            >
              Submit RSVP →
            </Button>
          </form>
        </div>

        {/* ── STATS ─────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            {
              label: 'Total Responses',
              value: stats.total,
              icon: <ClipboardList size={18} className="text-stone-500" />,
              className: 'bg-white border-stone-200',
              valueClass: 'text-stone-800',
            },
            {
              label: 'Attending',
              value: stats.attending,
              icon: <CheckCircle2 size={18} className="text-emerald-600" />,
              className: 'bg-emerald-50 border-emerald-100',
              valueClass: 'text-emerald-700',
            },
            {
              label: 'Not Attending',
              value: stats.notAttending,
              icon: <XCircle size={18} className="text-rose-500" />,
              className: 'bg-rose-50 border-rose-100',
              valueClass: 'text-rose-600',
            },
          ].map(card => (
            <div
              key={card.label}
              className={`${card.className} border rounded-xl p-4 shadow-sm`}
            >
              {card.icon}
              <div className={`text-2xl font-bold mt-2 ${card.valueClass}`}>{card.value}</div>
              <div className="text-[11px] text-stone-500 mt-0.5 font-medium leading-tight">
                {card.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── TABLE ─────────────────────────────────── */}
        <div className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  {[
                    { label: 'Name', icon: null },
                    { label: 'Status', icon: null },
                    { label: 'Bringing', icon: null },
                    { label: 'Allergies', icon: null },
                    { label: 'Time', icon: <Clock size={11} className="inline mr-1 mb-0.5" /> },
                  ].map(col => (
                    <th
                      key={col.label}
                      className="text-left px-5 py-3.5 text-[11px] font-semibold text-stone-400 uppercase tracking-widest"
                    >
                      {col.icon}{col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rsvps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-stone-400 text-sm">
                      No responses yet. Be the first!
                    </td>
                  </tr>
                ) : (
                  [...rsvps].reverse().map(r => (
                    <tr
                      key={r.id}
                      className="border-b border-stone-50 last:border-0 hover:bg-stone-50 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-semibold text-stone-800">{r.name}</td>
                      <td className="px-5 py-3.5">
                        {r.attending ? (
                          <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[11px] font-medium hover:bg-emerald-100">
                            ✓ Attending
                          </Badge>
                        ) : (
                          <Badge className="bg-stone-100 text-stone-600 border-0 text-[11px] font-medium hover:bg-stone-100">
                            ✕ Not Attending
                          </Badge>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-stone-500">{r.bringing || '—'}</td>
                      <td className="px-5 py-3.5 text-stone-500">{r.allergies || '—'}</td>
                      <td className="px-5 py-3.5 text-stone-400 text-xs">{formatTime(r.time)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin strip */}
        <div className="mt-6 pt-4 border-t border-stone-200 flex items-center justify-between">
          <p className="text-xs text-stone-400">Admin</p>
          <button
            onClick={() => { setWipeModalOpen(true); setWipeError(''); setWipeUser(''); setWipePass('') }}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-600 transition-colors"
          >
            <Trash2 size={12} /> Wipe all data
          </button>
        </div>
      </div>
    </div>
  )
}
