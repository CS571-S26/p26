import { createContext, useContext, useEffect, useRef, useState } from 'react';

const TimerContext = createContext(null);

const POMODORO_SECONDS = 25 * 60;
const ORIGINAL_TITLE = 'StudyFlow - Track Your Study Sessions';
const TIMER_STORAGE_KEY = 'studyflow-timer';

export function formatClock(totalSeconds, options = {}) {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  const pad = n => String(n).padStart(2, '0');
  const showHours = options.showHours || h > 0;
  if (showHours) return `${h}:${pad(m)}:${pad(s)}`;
  return `${pad(m)}:${pad(s)}`;
}

function readTimerFromStorage() {
  try {
    const raw = localStorage.getItem(TIMER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readSubjectsFromStorage() {
  try {
    const raw = localStorage.getItem('studyflow-subjects');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function TimerProvider({ children }) {
  const storedTimer = readTimerFromStorage();
  const [mode, setMode] = useState(storedTimer?.mode ?? 'pomodoro');
  const [customH, setCustomH] = useState(storedTimer?.customH ?? 0);
  const [customM, setCustomM] = useState(storedTimer?.customM ?? 45);
  const [customS, setCustomS] = useState(storedTimer?.customS ?? 0);
  const [targetSeconds, setTargetSeconds] = useState(
    storedTimer?.targetSeconds ?? POMODORO_SECONDS
  );
  const [secondsElapsed, setSecondsElapsed] = useState(storedTimer?.secondsElapsed ?? 0);
  const [isRunning, setIsRunning] = useState(storedTimer?.isRunning ?? false);
  const [subjectId, setSubjectId] = useState(storedTimer?.subjectId ?? '');
  const [startEpochMs, setStartEpochMs] = useState(storedTimer?.startEpochMs ?? null);
  const [error, setError] = useState('');
  const [pendingSession, setPendingSession] = useState(null);
  const [liveMessage, setLiveMessage] = useState('');
  const autoEndedRef = useRef(false);
  const elapsedAtAutoEndRef = useRef(0);

  // Tick every second while running (based on wall clock to survive tab throttling)
  useEffect(() => {
    if (!isRunning || !startEpochMs) return;
    const tick = () => {
      const elapsed = Math.max(0, Math.floor((Date.now() - startEpochMs) / 1000));
      if (targetSeconds > 0 && elapsed >= targetSeconds) {
        autoEndedRef.current = true;
        elapsedAtAutoEndRef.current = targetSeconds;
        setIsRunning(false);
        setSecondsElapsed(targetSeconds);
        return;
      }
      setSecondsElapsed(elapsed);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [isRunning, startEpochMs, targetSeconds]);

  // Tab title — show countdown / count-up while active, restore when idle
  useEffect(() => {
    const display = targetSeconds > 0 ? targetSeconds - secondsElapsed : secondsElapsed;
    if (isRunning) {
      document.title = `${formatClock(display)} • StudyFlow`;
    } else if (pendingSession) {
      document.title = `✓ Save your session • StudyFlow`;
    } else if (secondsElapsed > 0) {
      document.title = `${formatClock(display)} (paused) • StudyFlow`;
    } else {
      document.title = ORIGINAL_TITLE;
    }
    return () => { document.title = ORIGINAL_TITLE; };
  }, [isRunning, secondsElapsed, targetSeconds, pendingSession]);

  useEffect(() => {
    if (isRunning && !startEpochMs) {
      setStartEpochMs(Date.now() - secondsElapsed * 1000);
    }
  }, [isRunning, startEpochMs, secondsElapsed]);

  // Persist timer state so it survives navigation/reloads
  useEffect(() => {
    const payload = {
      mode,
      customH,
      customM,
      customS,
      targetSeconds,
      secondsElapsed,
      isRunning,
      subjectId,
      startEpochMs,
    };
    try {
      localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(payload));
    } catch { /* noop */ }
  }, [mode, customH, customM, customS, targetSeconds, secondsElapsed, isRunning, subjectId, startEpochMs]);

  // When the countdown auto-ends, prompt the save modal
  useEffect(() => {
    if (autoEndedRef.current && !isRunning && secondsElapsed === elapsedAtAutoEndRef.current) {
      setLiveMessage('Session complete. Time is up.');
      autoEndedRef.current = false;
      promptSave(elapsedAtAutoEndRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, secondsElapsed]);

  function customTotalSeconds(h, m, s) {
    return Math.max(1, (h | 0) * 3600 + (m | 0) * 60 + (s | 0));
  }

  function setCustomTime(h, m, s) {
    setCustomH(h);
    setCustomM(m);
    setCustomS(s);
    if (mode === 'custom' && !isRunning && secondsElapsed === 0) {
      setTargetSeconds(customTotalSeconds(h, m, s));
    }
  }

  function applyMode(nextMode) {
    if (isRunning || secondsElapsed > 0) {
      if (!window.confirm('Switching modes will reset the current session. Continue?')) return;
    }
    setMode(nextMode);
    setIsRunning(false);
    setSecondsElapsed(0);
    setStartEpochMs(null);
    setError('');
    autoEndedRef.current = false;
    if (nextMode === 'pomodoro') setTargetSeconds(POMODORO_SECONDS);
    else if (nextMode === 'stopwatch') setTargetSeconds(0);
    else setTargetSeconds(customTotalSeconds(customH, customM, customS));
  }

  function start() {
    if (!subjectId) {
      const subjects = readSubjectsFromStorage();
      if (subjects.length > 0) {
        setSubjectId(String(subjects[0].id));
      } else {
        setError('Add a subject first.');
        return;
      }
    }
    setError('');
    setStartEpochMs(Date.now() - secondsElapsed * 1000);
    setIsRunning(true);
  }

  function pause() {
    if (isRunning && startEpochMs) {
      const elapsed = Math.max(0, Math.floor((Date.now() - startEpochMs) / 1000));
      setSecondsElapsed(elapsed);
    }
    setIsRunning(false);
  }

  function reset() {
    setIsRunning(false);
    setSecondsElapsed(0);
    setStartEpochMs(null);
    setLiveMessage('');
    autoEndedRef.current = false;
  }

  function promptSave(elapsedSeconds) {
    const minutes = Math.ceil(elapsedSeconds / 60);
    if (minutes <= 0) {
      setError('Start the timer first.');
      return;
    }
    const subjects = readSubjectsFromStorage();
    const subject = subjects.find(s => String(s.id) === subjectId);
    if (!subject) {
      setError('Pick a subject first.');
      return;
    }
    setPendingSession({
      minutes,
      seconds: elapsedSeconds,
      subjectId: subject.id,
      subjectName: subject.name,
      subjectColor: subject.color,
    });
    setIsRunning(false);
  }

  function endSession() {
    promptSave(secondsElapsed);
  }

  function saveSession(details) {
    if (!pendingSession) return;
    const newSession = {
      id: Date.now(),
      subjectId: pendingSession.subjectId,
      subjectName: pendingSession.subjectName,
      subjectColor: pendingSession.subjectColor,
      duration: Math.max(1, Math.ceil(pendingSession.seconds / 60)),
      durationSeconds: pendingSession.seconds,
      focusRating: details.focusRating,
      notes: details.notes,
      date: new Date().toISOString().slice(0, 10),
    };

    try {
      const sessionsRaw = localStorage.getItem('studyflow-sessions');
      const prev = sessionsRaw ? JSON.parse(sessionsRaw) : [];
      localStorage.setItem('studyflow-sessions', JSON.stringify([newSession, ...prev]));
    } catch { /* noop */ }

    try {
      const subjectsRaw = localStorage.getItem('studyflow-subjects');
      const prevSubjects = subjectsRaw ? JSON.parse(subjectsRaw) : [];
      localStorage.setItem('studyflow-subjects', JSON.stringify(
        prevSubjects.map(s =>
          s.id === pendingSession.subjectId
            ? { ...s, totalTimeSpent: (s.totalTimeSpent || 0) + pendingSession.minutes }
            : s
        )
      ));
    } catch { /* noop */ }

    window.dispatchEvent(new Event('studyflow:data-changed'));
    setPendingSession(null);
    setSecondsElapsed(0);
  }

  function discardSession() {
    setPendingSession(null);
    setSecondsElapsed(0);
    setStartEpochMs(null);
  }

  const value = {
    mode, applyMode,
    customH, customM, customS, setCustomTime,
    targetSeconds, secondsElapsed, isRunning,
    subjectId, setSubjectId,
    error,
    pendingSession,
    liveMessage,
    start, pause, reset, endSession,
    saveSession, discardSession,
  };

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useTimer() {
  const ctx = useContext(TimerContext);
  if (!ctx) throw new Error('useTimer must be used inside <TimerProvider>');
  return ctx;
}
