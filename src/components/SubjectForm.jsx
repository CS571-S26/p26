import { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';

const COLOR_OPTIONS = [
  '#ef4444', // red
  '#10b981', // green
  '#2b4bee', // blue
  '#a855f7', // purple
  '#f59e0b', // orange
  '#06b6d4', // teal
];

export default function SubjectForm(props) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[0]);
  const [dailyGoal, setDailyGoal] = useState(2);
  const [weeklyGoal, setWeeklyGoal] = useState(10);

  function handleSubmit() {
    if (name.trim().length === 0) {
      alert('Please enter a subject name.');
      return;
    }
    props.onAdd({
      id: Date.now(),
      name: name.trim(),
      color: color,
      dailyGoal: Number(dailyGoal) || 0,
      weeklyGoal: Number(weeklyGoal) || 0,
      totalTimeSpent: 0,
    });
    // Reset form
    setName('');
    setColor(COLOR_OPTIONS[0]);
    setDailyGoal(2);
    setWeeklyGoal(10);
  }

  return (
    <Card>
      <Card.Body>
        <h5 className="mb-4">Create New Subject</h5>

        <Form.Group className="mb-3">
          <Form.Label>Subject Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="e.g. Organic Chemistry"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Assign Color</Form.Label>
          <div className="d-flex gap-2">
            {COLOR_OPTIONS.map(c => (
              <button
                key={c}
                type="button"
                aria-label={`Choose color ${c}`}
                onClick={() => setColor(c)}
                className="sf-color-dot"
                style={{
                  background: c,
                  boxShadow:
                    color === c ? `0 0 0 3px white, 0 0 0 5px ${c}` : 'none',
                }}
              />
            ))}
          </div>
        </Form.Group>

        <Row className="mb-4">
          <Col>
            <Form.Label>Daily Goal (Hrs)</Form.Label>
            <Form.Control
              type="number"
              min={0}
              step={0.5}
              value={dailyGoal}
              onChange={e => setDailyGoal(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Label>Weekly Goal (Hrs)</Form.Label>
            <Form.Control
              type="number"
              min={0}
              step={0.5}
              value={weeklyGoal}
              onChange={e => setWeeklyGoal(e.target.value)}
            />
          </Col>
        </Row>

        <Button variant="primary" className="w-100" onClick={handleSubmit}>
          Save Subject
        </Button>
      </Card.Body>
    </Card>
  );
}
