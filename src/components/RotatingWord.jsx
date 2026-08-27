import { useEffect, useState } from 'react'

const words = ['referência', 'autoridade', 'expert', 'especialista', 'mestre']

export default function RotatingWord() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      const timeout = setTimeout(() => {
        setIndex(i => (i + 1) % words.length)
        setVisible(true)
      }, 450)
      return () => clearTimeout(timeout)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className="font-anton inline-block text-[#ff8c1a] transition-all duration-500 ease-in-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.94)',
        filter: visible ? 'blur(0px)' : 'blur(4px)'
      }}
    >
      {words[index]}
    </span>
  )
}
