export default function StreakBanner(props) {
  if (props.streak <= 0) {
    return (
      <p className="text-muted mb-0">
        Start a session today to begin your streak!
      </p>
    );
  }

  return (
    <p className="text-muted mb-0">
      <span style={{ fontSize: '1.1rem' }}>🔥</span> You're on a{' '}
      <strong>{props.streak}-day streak</strong> — keep it up!
    </p>
  );
}
