import './PearlButton.css'

export default function PearlButton({ children, ...props }) {
  return (
    <button className="pearl-button" {...props}>
      <div className="wrap">
        <p>
          <span>✧</span>
          <span>✦</span>
          {children}
        </p>
      </div>
    </button>
  )
}
