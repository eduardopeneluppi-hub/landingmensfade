import heroBg from '../assets/images/hero-bg.png'
import tiagoPhoto from '../assets/images/tiago-hero.png'
import mensFadeLogo from '../assets/images/mens-fade-logo.webp'
import titleBadge from '../assets/images/title-badge.webp'
import SparkleButton from './SparkleButton'
import FloatingBadges from './FloatingBadges'
import RotatingWord from './RotatingWord'

export default function Hero() {
  return (
    <section className="relative h-svh w-full overflow-hidden bg-black">
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />
      <p className="font-sans absolute top-[15%] left-1/2 z-[2] w-full -translate-x-1/2 -translate-y-1/2 px-2 text-center text-xs font-semibold tracking-[0.4em] text-black uppercase sm:text-lg">
        Curso prático
      </p>
      <img
        src={titleBadge}
        alt="Aperfeiçoamento"
        className="absolute top-[22%] left-1/2 z-[2] w-[88%] max-w-xl -translate-x-1/2 -translate-y-1/2 sm:w-[60%]"
      />
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
      <p className="font-archivo-black absolute top-[81%] left-1/2 z-20 w-full -translate-x-1/2 -translate-y-1/2 px-6 text-center text-lg leading-tight text-black uppercase sm:text-3xl">
        Vire <RotatingWord /> em qualquer estilo de corte masculino
      </p>
      <div className="absolute top-[89%] left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <SparkleButton size="lg">Quero ser um Men's Fade</SparkleButton>
      </div>
    </section>
  )
}
