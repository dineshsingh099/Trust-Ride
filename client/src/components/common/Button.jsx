import './Button.css'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  type = 'button',
  onClick,
  disabled,
  className = ""
}) {

  return (
		<button
			type={type}
			onClick={onClick}
			disabled={disabled || loading}
			className={`btn btn-${variant} btn-${size} ${fullWidth ? "btn-full" : ""} ${className}`}
		>
			{loading ? <span className="btn-spinner" /> : children}
		</button>
	);
}
