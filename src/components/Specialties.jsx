import './Specialties.css'

const specialties = [
  { label: 'Fade', icon: 'content_cut' },
  { label: 'Divisões', icon: 'grid_view' },
  { label: 'Polimento', icon: 'auto_awesome' },
  { label: 'Barba', icon: 'face' },
  { label: 'Instagram', icon: 'photo_camera' },
  { label: 'Captação de cliente', icon: 'person_add' },
  { label: 'Freestyle', icon: 'bolt' },
  { label: 'Edição', icon: 'edit' }
]

function Badge({ label, icon }) {
  return (
    <div className="glass-badge">
      <span className="material-icons">{icon}</span>
      <span className="text-xs font-medium tracking-wide uppercase">{label}</span>
    </div>
  )
}

export default function Specialties() {
  const doubled = [...specialties, ...specialties]
  return (
    <div className="specialties-fade overflow-hidden">
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <Badge key={`${item.label}-${i}`} {...item} />
        ))}
      </div>
    </div>
  )
}
