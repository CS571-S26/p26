import { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';

const DEFAULT_SECONDS = 25 * 60; // 25-minute pomodoro

export default function StudyTimer(props) {
  const [secondsLeft, setSecondsLeft] = useState(DEFAULT_SECONDS);
  const [isRunning, setIsRunning] = useState(false);
  const [subjectId, setSubjectId] = useState(
    props.subjects.length > 0 ? String(props.subjects[0].id) : ''
  );

  // Tick down every second while running
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          setIsRunning(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const display =
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const isPaused = !isRunning && secondsLeft < DEFAULT_SECONDS;

  let subtitle = 'Ready to dive into deep work?';
  if (isRunning) subtitle = 'Deep focus in progress...';
  else if (isPaused) subtitle = 'Paused — press resume to continue';

  function handleStart() {
    if (!subjectId) {
      alert('Pick a subject first!');
      return;
    }
    setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleReset() {
    setIsRunning(false);
    setSecondsLeft(DEFAULT_SECONDS);
  }

  function handleEndSession() {
    const minutesStudied = Math.ceil((DEFAULT_SECONDS - secondsLeft) / 60);
    if (minutesStudied <= 0) {
      alert('Start the timer first!');
      return;
    }
    const subject = props.subjects.find(s => String(s.id) === subjectId);
    if (!subject) {
      alert('Pick a subject first!');
      return;
    }
    setIsRunning(false);
    props.onEndSession(minutesStudied, subject.id);
    setSecondsLeft(DEFAULT_SECONDS);
  }

  return (
    <Card className="h-100 text-center">
      <Card.Body className="p-4 d-flex flex-column">
        <h4 className="mb-1">Smart Timer</h4>
        <p className="text-muted mb-4">{subtitle}</p>

        <div className="sf-timer-display">{display}</div>

        <div className="sf-pill mb-3 mt-2">POMODORO MODE</div>

        <Form.Select
          value={subjectId}
          onChange={e => setSubjectId(e.target.value)}
          disabled={isRunning}
          className="mb-3"
          aria-label="Select subject"
        >
          {props.subjects.length === 0 && <option value="">No subjects yet — add one first</option>}
          {props.subjects.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </Form.Select>

        <div className="d-grid gap-2">
          {!isRunning ? (
            <Button variant="primary" size="lg" onClick={handleStart}>
              ▶ {isPaused ? 'Resume Session' : 'Start Session'}
            </Button>
          ) : (
            <Button variant="warning" size="lg" onClick={handlePause}>
              ⏸ Pause
            </Button>
          )}

          <div className="d-flex gap-2 justify-content-center">
            <Button variant="outline-secondary" size="sm" onClick={handleReset}>
              Reset
            </Button>
            <Button variant="outline-success" size="sm" onClick={handleEndSession}>
              End Session
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
