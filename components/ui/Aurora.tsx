'use client'

interface AuroraProps {
  intensity?: 'subtle' | 'medium' | 'strong'
}

export default function Aurora({ intensity = 'medium' }: AuroraProps) {
  const o = { subtle: 0.18, medium: 0.28, strong: 0.45 }[intensity]

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="absolute rounded-full"
        style={{
          top: '-25%', left: '50%', transform: 'translateX(-50%)',
          width: '900px', height: '900px',
          background: `radial-gradient(circle, rgba(124,58,237,${o}) 0%, transparent 70%)`,
          filter: 'blur(70px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          bottom: '-15%', right: '-10%',
          width: '650px', height: '650px',
          background: `radial-gradient(circle, rgba(167,139,250,${o * 0.55}) 0%, transparent 70%)`,
          filter: 'blur(90px)',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          top: '25%', left: '-12%',
          width: '500px', height: '500px',
          background: `radial-gradient(circle, rgba(99,102,241,${o * 0.45}) 0%, transparent 70%)`,
          filter: 'blur(80px)',
        }}
      />
    </div>
  )
}
