import { Card } from 'react-bootstrap';

function getSessionSeconds(session) {
  if (typeof session.durationSeconds === 'number') return session.durationSeconds;
  if (typeof session.duration === 'number') return session.duration * 60;
  return 0;
}

function formatDuration(seconds) {
  const total = Math.max(0, Math.floor(seconds));
  if (total < 60) return `${total}s`;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return s > 0 ? `${h}h ${m}m ${s}s` : `${h}h ${m}m`;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
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
                  <div className="fw-semibold">{formatDuration(getSessionSeconds(s))}</div>
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
