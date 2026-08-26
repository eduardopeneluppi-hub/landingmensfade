import clientesIcon from '../assets/images/balloons/clientes.webp'
import freestyleIcon from '../assets/images/balloons/freestyle.webp'
import instagramIcon from '../assets/images/balloons/instagram.webp'
import barbaIcon from '../assets/images/balloons/barba.webp'
import './FloatingBadges.css'

const badges = [
  { icon: clientesIcon, label: '+ Clientes', position: 'top-[24%] left-[2%]', delay: '' },
  { icon: freestyleIcon, label: 'Freestyle', position: 'top-[62%] left-[1%]', delay: 'floating-badge--delay-2' },
  { icon: instagramIcon, label: 'Instagram', position: 'top-[22%] right-[8%]', delay: 'floating-badge--delay-1' },
  { icon: barbaIcon, label: 'Barba', position: 'top-[60%] right-[1%]', delay: 'floating-badge--delay-3' }
]

export default function FloatingBadges() {
  return (
    <>
      {badges.map(b => (
        <div key={b.label} className={`floating-badge ${b.delay} absolute z-[15] ${b.position}`}>
          <div className="flex flex-col items-center gap-1">
            <img
              src={b.icon}
              alt={b.label}
              className="h-[5.5rem] w-[5.5rem] drop-shadow-[0_8px_16px_rgba(0,0,0,0.25)] sm:h-28 sm:w-28"
            />
            <span className="rounded-full bg-black/85 px-2.5 py-1 text-[9px] font-semibold tracking-wide text-white uppercase backdrop-blur-sm sm:text-xs">
              {b.label}
            </span>
          </div>
        </div>
      ))}
    </>
  )
}
