import heroBg from '../assets/images/hero-bg.png'
import tiagoPhoto from '../assets/images/tiago-hero.png'
import mensFadeLogo from '../assets/images/mens-fade-logo.webp'
import PearlButton from './PearlButton'
import FloatingBadges from './FloatingBadges'

export default function Hero() {
  return (
    <section className="relative h-svh w-full overflow-hidden bg-black">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <p className="font-sans absolute top-[14.5%] left-1/2 z-[2] w-full -translate-x-1/2 -translate-y-1/2 px-2 text-center text-xs font-light tracking-[0.4em] text-black uppercase sm:text-lg">
        Curso prático
      </p>
      <h1
        className="font-archivo-black absolute top-[18%] left-1/2 z-[2] w-full -translate-x-1/2 -translate-y-1/2 px-2 text-center text-[2.1rem] leading-none text-black uppercase sm:text-8xl"
        style={{ WebkitTextStroke: '1px black' }}
      >
        APERFEIÇOAMENTO
      </h1>
      <img
        src={mensFadeLogo}
        alt=""
        className="absolute top-[35%] left-1/2 z-[8] h-[125%] w-auto max-w-none -translate-x-1/2 -translate-y-1/2 object-contain opacity-80"
      />
      <img
        src={tiagoPhoto}
        alt="Tiago"
        className="absolute top-[41.5%] left-1/2 z-10 h-[70%] w-auto -translate-x-1/2 -translate-y-1/2 object-contain"
      />
      <FloatingBadges />
      <div className="absolute top-[85%] left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <PearlButton>Quero ser um Men's Fade</PearlButton>
      </div>
    </section>
  )
}
