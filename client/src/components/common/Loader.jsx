export function Loader({ size = 18, className = '' }) {
  return (
    <span
      className={`loader-spinner ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

export function PageLoader() {
  return (
    <div className="loader-full">
      <Loader size={24} />
    </div>
  );
}
