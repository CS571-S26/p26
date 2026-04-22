import { useState, useEffect } from 'react';
import { Container, Card, Form, Table, Button } from 'react-bootstrap';
import EndSessionModal from '../../../p26/src/components/EndSessionModal';

const DEFAULT_SUBJECTS = [
  { id: 1, name: 'Mathematics', color: '#4f46e5', dailyGoal: 2, weeklyGoal: 10, totalTimeSpent: 0 },
  { id: 2, name: 'Computer Science', color: '#10b981', dailyGoal: 2, weeklyGoal: 15, totalTimeSpent: 0 },
  { id: 3, name: 'Economics', color: '#f59e0b', dailyGoal: 1, weeklyGoal: 8, totalTimeSpent: 0 },
];

function Stars(props) {
  const n = props.rating || 0;
  return (
    <span style={{ fontSize: 14, whiteSpace: 'nowrap' }}>
      <span style={{ color: '#f59e0b' }}>{'★'.repeat(n)}</span>
      <span style={{ color: '#e5e7eb' }}>{'★'.repeat(5 - n)}</span>
    </span>
  );
}

export default function Sessions() {
  const [subjects] = useState(() => {
    const saved = localStorage.getItem('studyflow-subjects');
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('studyflow-sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const [filterSubject, setFilterSubject] = useState('all');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    localStorage.setItem('studyflow-sessions', JSON.stringify(sessions));
  }, [sessions]);

  function handleDelete(id) {
    if (window.confirm('Delete this session?')) {
      setSessions(prev => prev.filter(s => s.id !== id));
    }
  }

  function handleEditSave(details) {
    setSessions(prev =>
      prev.map(s =>
        s.id === editing.id
          ? { ...s, focusRating: details.focusRating, notes: details.notes }
          : s
      )
    );
    setEditing(null);
  }

  const filtered =
    filterSubject === 'all'
      ? sessions
      : sessions.filter(s => String(s.subjectId) === filterSubject);

  return (
    <Container fluid className="sf-page">
      <div className="mb-4">
        <h1 className="mb-1">Sessions</h1>
        <p className="text-muted mb-0">
          Your full study session history — edit focus ratings or add notes anytime.
        </p>
      </div>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <span className="fw-semibold">Session History</span>
          <Form.Select
            size="sm"
            style={{ width: 220 }}
            value={filterSubject}
            onChange={e => setFilterSubject(e.target.value)}
          >
            <option value="all">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Form.Select>
        </Card.Header>

        {filtered.length === 0 ? (
          <Card.Body className="text-center text-muted py-5">
            {sessions.length === 0
              ? 'No sessions yet. Go to the Dashboard and start the timer!'
              : 'No sessions match this filter.'}
          </Card.Body>
        ) : (
          <Table hover responsive className="mb-0 align-middle">
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Duration</th>
                <th>Focus</th>
                <th>Notes</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const subj = subjects.find(sub => sub.id === s.subjectId);
                const color = subj?.color || s.subjectColor || '#6b7280';
                return (
                  <tr key={s.id}>
                    <td>{s.date}</td>
                    <td>
                      <span className="d-inline-flex align-items-center gap-2">
                        <span
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            background: color,
                            display: 'inline-block',
                          }}
                        />
                        {s.subjectName}
                      </span>
                    </td>
                    <td>{s.duration} min</td>
                    <td><Stars rating={s.focusRating} /></td>
                    <td style={{ maxWidth: 280 }}>
                      {s.notes ? (
                        <span title={s.notes}>
                          {s.notes.length > 50
                            ? s.notes.slice(0, 50) + '…'
                            : s.notes}
                        </span>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant="outline-secondary"
                        className="me-2"
                        onClick={() => setEditing(s)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(s.id)}
                      >
                        ✕
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card>

      {editing && (
        <EndSessionModal
          show={true}
          title="Edit Session"
          minutes={editing.duration}
          initialRating={editing.focusRating}
          initialNotes={editing.notes}
          saveLabel="Save Changes"
          discardLabel="Cancel"
          onSave={handleEditSave}
          onDiscard={() => setEditing(null)}
        />
      )}
    </Container>
  );
}
