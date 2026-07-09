import './Loader.css'

export default function Loader({ label = 'Loading' }) {
  return (
    <div className="loader-wrap">
      <span className="loader-ring" />
      <p>{label}</p>
    </div>
  )
}
