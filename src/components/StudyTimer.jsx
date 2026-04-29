import { useState, useEffect, useRef } from 'react';
import { Card, Button, Form, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

const POMODORO_SECONDS = 25 * 60;
const STOPWATCH_TARGET = 0; // 0 = no upper bound, count up forever

const MODES = [
  { value: 'pomodoro', label: 'Pomodoro', sub: '25 min countdown' },
  { value: 'custom', label: 'Custom', sub: 'Pick your own' },
  { value: 'stopwatch', label: 'Stopwatch', sub: 'Count up freely' },
];

function formatClock(totalSeconds) {
  const safe = Math.max(0, totalSeconds);
  const m = Math.floor(safe / 60);
  const s = safe % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function StudyTimer(props) {
  const [mode, setMode] = useState('pomodoro');
  const [customMinutes, setCustomMinutes] = useState(45);
  const [targetSeconds, setTargetSeconds] = useState(POMODORO_SECONDS);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [subjectId, setSubjectId] = useState(
    props.subjects.length > 0 ? String(props.subjects[0].id) : ''
  );
  const [error, setError] = useState('');

  // Live region announcement for screen readers when timer auto-completes
  const [liveMessage, setLiveMessage] = useState('');
  const autoEndedRef = useRef(false);

  // Tick — the timer always counts up internally; target tells us when to stop
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsElapsed(prev => {
        const next = prev + 1;
        if (targetSeconds > 0 && next >= targetSeconds) {
          autoEndedRef.current = true;
          setIsRunning(false);
          return targetSeconds;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, targetSeconds]);

  // Announce when the countdown auto-completes
  useEffect(() => {
    if (autoEndedRef.current && !isRunning && secondsElapsed === targetSeconds && targetSeconds > 0) {
      setLiveMessage('Session complete. Time is up.');
      autoEndedRef.current = false;
    }
  }, [isRunning, secondsElapsed, targetSeconds]);

  const isCountdown = targetSeconds > 0;
  const displaySeconds = isCountdown ? targetSeconds - secondsElapsed : secondsElapsed;
  const isPaused = !isRunning && secondsElapsed > 0;

  let subtitle = 'Ready to dive into deep work?';
  if (isRunning) subtitle = 'Deep focus in progress…';
  else if (isPaused) subtitle = 'Paused — press resume to continue';

  function applyMode(nextMode) {
    if (isRunning || secondsElapsed > 0) {
      // Don't blow away an in-progress session silently
      if (!window.confirm('Switching modes will reset the current session. Continue?')) return;
    }
    setMode(nextMode);
    setIsRunning(false);
    setSecondsElapsed(0);
    setError('');
    if (nextMode === 'pomodoro') setTargetSeconds(POMODORO_SECONDS);
    else if (nextMode === 'stopwatch') setTargetSeconds(STOPWATCH_TARGET);
    else setTargetSeconds(Math.max(1, Number(customMinutes) || 1) * 60);
  }

  function applyCustomMinutes(value) {
    setCustomMinutes(value);
    if (mode === 'custom' && !isRunning && secondsElapsed === 0) {
      const mins = Math.max(1, Number(value) || 1);
      setTargetSeconds(mins * 60);
    }
  }

  function handleStart() {
    if (!subjectId) {
      setError('Pick a subject first.');
      return;
    }
    setError('');
    setIsRunning(true);
  }

  function handlePause() {
    setIsRunning(false);
  }

  function handleReset() {
    setIsRunning(false);
    setSecondsElapsed(0);
    setLiveMessage('');
  }

  function handleEndSession() {
    const minutesStudied = Math.ceil(secondsElapsed / 60);
    if (minutesStudied <= 0) {
      setError('Start the timer first.');
      return;
    }
    const subject = props.subjects.find(s => String(s.id) === subjectId);
    if (!subject) {
      setError('Pick a subject first.');
      return;
    }
    setError('');
    setIsRunning(false);
    props.onEndSession(minutesStudied, subject.id);
    setSecondsElapsed(0);
  }

  const activeMode = MODES.find(m => m.value === mode);

  return (
    <Card className="h-100 text-center">
      <Card.Body className="p-4 d-flex flex-column">
        <h2 className="h4 mb-1">Smart Timer</h2>
        <p style={{ color: 'var(--muted-strong)' }} className="mb-3">{subtitle}</p>

        <div role="group" aria-label="Timer mode" className="mb-3">
          <ToggleButtonGroup
            type="radio"
            name="timer-mode"
            value={mode}
            onChange={applyMode}
            className="w-100"
          >
            {MODES.map(m => (
              <ToggleButton
                key={m.value}
                id={`timer-mode-${m.value}`}
                value={m.value}
                variant={mode === m.value ? 'primary' : 'outline-primary'}
                disabled={isRunning}
              >
                {m.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <div className="small mt-1" style={{ color: 'var(--muted-strong)' }}>
            {activeMode?.sub}
          </div>
        </div>

        <div className="sf-timer-display" aria-live="off">
          {formatClock(displaySeconds)}
        </div>

        <div className="sf-pill mb-3 mt-2" aria-hidden="true">
          {mode === 'pomodoro' && 'POMODORO MODE'}
          {mode === 'custom' && 'CUSTOM TIMER'}
          {mode === 'stopwatch' && 'STOPWATCH MODE'}
        </div>

        {mode === 'custom' && (
          <Form.Group controlId="timer-custom-minutes" className="mb-3 text-start">
            <Form.Label className="small mb-1" style={{ color: 'var(--muted-strong)' }}>
              Custom duration (minutes)
            </Form.Label>
            <Form.Control
              type="number"
              min={1}
              max={240}
              step={1}
              value={customMinutes}
              onChange={e => applyCustomMinutes(e.target.value)}
              disabled={isRunning || secondsElapsed > 0}
            />
          </Form.Group>
        )}

        <Form.Group controlId="timer-subject" className="mb-3 text-start">
          <Form.Label className="small mb-1" style={{ color: 'var(--muted-strong)' }}>
            Subject
          </Form.Label>
          <Form.Select
            value={subjectId}
            onChange={e => setSubjectId(e.target.value)}
            disabled={isRunning}
          >
            {props.subjects.length === 0 && (
              <option value="">No subjects yet — add one first</option>
            )}
            {props.subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        {error && (
          <div role="alert" className="small mb-2" style={{ color: 'var(--danger-text)' }}>
            {error}
          </div>
        )}

        <div className="d-grid gap-2">
          {!isRunning ? (
            <Button variant="primary" size="lg" onClick={handleStart}>
              <span aria-hidden="true">▶ </span>
              {isPaused ? 'Resume Session' : 'Start Session'}
            </Button>
          ) : (
            <Button variant="warning" size="lg" onClick={handlePause}>
              <span aria-hidden="true">⏸ </span>Pause
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

        <div className="visually-hidden" role="status" aria-live="polite">
          {liveMessage}
        </div>
      </Card.Body>
    </Card>
  );
}
