import { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

export default function Statistics() {
    function getSessionMinutes(session) {
      if (typeof session.durationSeconds === 'number') return session.durationSeconds / 60;
      if (typeof session.duration === 'number') return session.duration;
      return 0;
    }
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('studyflow-subjects');
    return saved ? JSON.parse(saved) : [];
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('studyflow-sessions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    function refreshFromStorage() {
      const savedSessions = localStorage.getItem('studyflow-sessions');
      const savedSubjects = localStorage.getItem('studyflow-subjects');
      setSessions(savedSessions ? JSON.parse(savedSessions) : []);
      setSubjects(savedSubjects ? JSON.parse(savedSubjects) : []);
    }

    window.addEventListener('studyflow:data-changed', refreshFromStorage);
    window.addEventListener('storage', refreshFromStorage);
    return () => {
      window.removeEventListener('studyflow:data-changed', refreshFromStorage);
      window.removeEventListener('storage', refreshFromStorage);
    };
  }, []);

  // Breakdown by subject
  const breakdown = subjects
    .map(s => {
      const subjSessions = sessions.filter(sess => sess.subjectId === s.id);
      const minutes = subjSessions.reduce((acc, sess) => acc + getSessionMinutes(sess), 0);
      const avgFocus =
        subjSessions.length > 0
          ? (
              subjSessions.reduce((acc, sess) => acc + (sess.focusRating || 0), 0) /
              subjSessions.length
            ).toFixed(1)
          : '—';
      return { ...s, minutes, count: subjSessions.length, avgFocus };
    })
    .sort((a, b) => b.minutes - a.minutes);

  const totalMinutes = breakdown.reduce((acc, b) => acc + b.minutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  const overallAvgFocus =
    sessions.length > 0
      ? (
          sessions.reduce((acc, s) => acc + (s.focusRating || 0), 0) /
          sessions.length
        ).toFixed(1)
      : '—';

  return (
    <Container fluid className="sf-page">
      <div className="mb-4">
        <h1 className="mb-1">Statistics</h1>
        <p className="text-muted mb-0">
          Deep-dive into your study patterns.
        </p>
      </div>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card>
            <Card.Body>
              <div className="text-muted small">Total Study Time</div>
              <div className="fs-2 fw-bold">{totalHours}h</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <div className="text-muted small">Total Sessions</div>
              <div className="fs-2 fw-bold">{sessions.length}</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <div className="text-muted small">Avg Focus Rating</div>
              <div className="fs-2 fw-bold">{overallAvgFocus} / 5</div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Header>Time by Subject</Card.Header>
        <Card.Body>
          {breakdown.length === 0 && (
            <div className="text-muted text-center py-3">No data yet.</div>
          )}
          {breakdown.map(b => {
            const pct =
              totalMinutes > 0
                ? Math.round((b.minutes / totalMinutes) * 100)
                : 0;
            return (
              <div key={b.id} className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        background: b.color,
                        marginRight: 8,
                      }}
                    />
                    {b.name}
                    <span className="text-muted ms-2">
                      · {b.count} sessions · avg focus {b.avgFocus}
                    </span>
                  </span>
                  <span className="fw-semibold">
                    {(b.minutes / 60).toFixed(1)}h ({pct}%)
                  </span>
                </div>
                <div className="progress" style={{ height: 8 }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${pct}%`,
                      background: b.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </Card.Body>
      </Card>
    </Container>
  );
}
