import { Card, Button } from 'react-bootstrap';

export default function SubjectCard(props) {
  const { subject, weeklyMinutes } = props;
  const weeklyGoal = subject.weeklyGoal || 0;
  const weeklyGoalMin = weeklyGoal * 60;
  const hoursStudied = (weeklyMinutes / 60).toFixed(1);
  const percent =
    weeklyGoalMin > 0
      ? Math.min(100, Math.round((weeklyMinutes / weeklyGoalMin) * 100))
      : 0;

  function handleDelete() {
    if (window.confirm(`Delete "${subject.name}"?`)) {
      props.onDelete(subject.id);
    }
  }

  const initial = subject.name?.[0]?.toUpperCase() || '?';

  return (
    <Card className="mb-3">
      <Card.Body>
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div className="d-flex align-items-center gap-3">
            <div
              className="sf-subject-icon sf-subject-icon-lg"
              style={{ background: subject.color }}
            >
              {initial}
            </div>
            <div>
              <h5 className="mb-0">{subject.name}</h5>
              <small className="text-muted">
                Goal: {weeklyGoal} hours / week
              </small>
            </div>
          </div>
          <Button size="sm" variant="outline-danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>

        <div className="d-flex justify-content-between small mb-1">
          <span className="text-muted">Weekly Progress</span>
          <span style={{ color: subject.color, fontWeight: 600 }}>
            {hoursStudied} / {weeklyGoal} Hours ({percent}%)
          </span>
        </div>
        <div className="progress" style={{ height: 8 }}>
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${percent}%`, background: subject.color }}
            aria-valuenow={percent}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>
      </Card.Body>
    </Card>
  );
}
