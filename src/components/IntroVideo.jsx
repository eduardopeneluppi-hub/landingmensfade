import introVideo from '../assets/videos/tiago-intro.mp4'
import PatternBackground from './PatternBackground'
import ScrollExpand from './ScrollExpand'

function VideoBackground() {
  return (
    <div className="relative h-full w-full">
      <PatternBackground />
      <div className="absolute inset-x-0 top-10 z-10 flex justify-center px-4 sm:top-14">
        <div className="rounded-full border border-white/20 bg-white/10 px-8 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur-md">
          <h2 className="font-archivo-black text-xl tracking-wide text-white uppercase sm:text-3xl">
            Veja na prática
          </h2>
        </div>
      </div>
    </div>
  )
}

export default function IntroVideo() {
  return (
    <section className="relative w-full">
      <ScrollExpand
        src={introVideo}
        mediaType="video"
        scrollHint="Role para assistir"
        background={<VideoBackground />}
        startWidth={42}
        startHeight={58}
        startRadius={24}
        endRadius={0}
        mediaZoom={1.35}
        scrollDistance={1.2}
        holdDistance={0.35}
        useWindowScroll
      />
    </section>
  )
}
