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
      }, 200)
      return () => clearTimeout(timeout)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <span
      className="font-anton inline-block text-[#ff8c1a] transition-opacity duration-200"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {words[index]}
    </span>
  )
}
