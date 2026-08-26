import heroBg from '../assets/images/hero-bg.png'
import tiagoPhoto from '../assets/images/tiago-hero.png'
import mensFadeLogo from '../assets/images/mens-fade-logo.webp'
import Scanner from './Scanner'
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
      <div className="absolute top-[2%] left-1/2 z-[5] h-[74%] w-full -translate-x-1/2 overflow-hidden">
        <Scanner
          color1="#3008d0"
          color2="#0811e8"
          color3="#FFFFFF"
          speed={0.5}
          sweepSpeed={0.25}
          sweepWidth={1.6}
          sweepFalloff={6}
          scale={1.5}
          frequency={2}
          ripple={0.22}
          bandDensity={11}
          lineSharpness={5.5}
          glow={0.22}
          scanDirection="vertical"
          colorSpread={0.7}
          brightness={0.6}
          contrast={1.15}
          softness={1.4}
          vignette={0.45}
          scanline={true}
          grain={true}
          grainIntensity={0.05}
          opacity={1.0}
          mouseInteraction={true}
          mouseRadius={0.5}
          mouseStrength={0.5}
        />
      </div>
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
