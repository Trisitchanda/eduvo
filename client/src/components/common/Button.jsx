export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) {
  const sizeClass = size === 'sm' ? 'btn-sm' : '';
  return (
    <button
      className={`btn btn-${variant} ${sizeClass} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="loader-spinner" style={{ width: 14, height: 14, borderWidth: 1.5 }} />
      )}
      {children}
    </button>
  );
}
