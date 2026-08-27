import navLogo from '../assets/images/nav-logo.webp'
import SparkleButton from './SparkleButton'

export default function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-3 z-50 px-4 sm:top-5 sm:px-6">
      <div className="mx-auto flex w-full max-w-2xl items-center justify-between rounded-full border border-white/25 bg-white/10 py-2 pr-2 pl-5 shadow-[0_8px_28px_rgba(0,0,0,0.25),inset_0_1px_0_rgba(255,255,255,0.3)] backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <img src={navLogo} alt="MF" className="h-5 w-auto sm:h-6" />
          <span className="font-archivo-black text-sm tracking-wide text-black uppercase sm:text-base">
            Men's Fade
          </span>
        </div>
        <SparkleButton>Garanta já</SparkleButton>
      </div>
    </nav>
  )
}
