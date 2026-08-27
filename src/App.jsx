import Hero from './components/Hero'
import IntroVideo from './components/IntroVideo'
import Navbar from './components/Navbar'

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <div className="h-24 w-full bg-gradient-to-b from-white to-[#181c21] sm:h-32" />
      <IntroVideo />
    </>
  )
}

export default App
