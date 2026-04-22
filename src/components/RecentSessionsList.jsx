import { Card } from 'react-bootstrap';

function formatDuration(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export default function RecentSessionsList(props) {
  const { sessions, subjects } = props;

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>Recent Sessions</span>
      </Card.Header>
      {sessions.length === 0 ? (
        <Card.Body className="text-muted text-center py-4">
          No sessions yet. Start the timer above!
        </Card.Body>
      ) : (
        <div className="list-group list-group-flush">
          {sessions.map(s => {
            const subject = subjects.find(sub => sub.id === s.subjectId);
            const color = subject?.color || s.subjectColor || '#6b7280';
            const initial = s.subjectName?.[0]?.toUpperCase() || '?';
            return (
              <div
                key={s.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="sf-subject-icon"
                    style={{ background: color }}
                  >
                    {initial}
                  </div>
                  <div>
                    <div className="fw-semibold">{s.subjectName}</div>
                    <small className="text-muted">
                      {s.date} {s.notes && `• ${s.notes.slice(0, 40)}${s.notes.length > 40 ? '…' : ''}`}
                    </small>
                  </div>
                </div>
                <div className="text-end">
                  <div className="fw-semibold">{formatDuration(s.duration)}</div>
                  <small className="text-muted">Focus: {s.focusRating}/5</small>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
