import { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import StreakBanner from '../components/StreakBanner';
import StatsCard from '../components/StatsCard';
import StudyTimer from '../components/StudyTimer';
import WeeklyTrendCard from '../components/WeeklyTrendCard';
import RecentSessionsList from '../components/RecentSessionsList';
import EndSessionModal from '../components/EndSessionModal';

const DEFAULT_SUBJECTS = [
  { id: 1, name: 'Mathematics', color: '#4f46e5', dailyGoal: 2, weeklyGoal: 10, totalTimeSpent: 0 },
  { id: 2, name: 'Computer Science', color: '#10b981', dailyGoal: 2, weeklyGoal: 15, totalTimeSpent: 0 },
  { id: 3, name: 'Economics', color: '#f59e0b', dailyGoal: 1, weeklyGoal: 8, totalTimeSpent: 0 },
];

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const DAILY_SESSION_GOAL = 4;

export default function Dashboard() {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('studyflow-subjects');
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
  });

  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('studyflow-sessions');
    return saved ? JSON.parse(saved) : [];
  });

  // Capture "now" once on mount so render stays pure
  const [now] = useState(() => Date.now());

  const [pendingSession, setPendingSession] = useState(null);

  useEffect(() => {
    localStorage.setItem('studyflow-sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('studyflow-subjects', JSON.stringify(subjects));
  }, [subjects]);

  // --- Compute dashboard stats ---
  const today = new Date(now).toISOString().slice(0, 10);
  const todaysSessions = sessions.filter(s => s.date === today);
  const todaysMinutes = todaysSessions.reduce((acc, s) => acc + s.duration, 0);
  const todaysHours = (todaysMinutes / 60).toFixed(1);

  // Yesterday comparison
  const yesterday = new Date(now - 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  const yesterdaysMinutes = sessions
    .filter(s => s.date === yesterday)
    .reduce((acc, s) => acc + s.duration, 0);
  let focusChangeText = 'No data yesterday';
  let focusChangeColor = 'var(--text-light)';
  if (yesterdaysMinutes > 0) {
    const diff = Math.round(
      ((todaysMinutes - yesterdaysMinutes) / yesterdaysMinutes) * 100
    );
    focusChangeText = `${diff >= 0 ? '+' : ''}${diff}% vs yesterday`;
    focusChangeColor = diff >= 0 ? '#10b981' : '#ef4444';
  }

  // Streak: consecutive days ending today (or yesterday if no session today)
  const uniqueDates = [...new Set(sessions.map(s => s.date))].sort().reverse();
  let streak = 0;
  if (uniqueDates.length > 0) {
    let cursor = new Date(now);
    if (uniqueDates[0] !== today) {
      // If no session today, start from yesterday so streak isn't broken
      cursor = new Date(now - 24 * 60 * 60 * 1000);
    }
    for (const dateStr of uniqueDates) {
      const cursorStr = cursor.toISOString().slice(0, 10);
      if (dateStr === cursorStr) {
        streak++;
        cursor = new Date(cursor.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }
  }

  // Weekly trend — last 7 days
  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toISOString().slice(0, 10);
    const mins = sessions
      .filter(s => s.date === dateStr)
      .reduce((acc, s) => acc + s.duration, 0);
    weeklyData.push({ date: dateStr, label: DAY_LABELS[d.getDay()], minutes: mins });
  }

  const sessionsToday = todaysSessions.length;
  const goalPct = Math.round((sessionsToday / DAILY_SESSION_GOAL) * 100);

  // --- Callbacks ---
  function handleTimerEnd(minutesStudied, subjectId) {
    const subject = subjects.find(s => s.id === subjectId);
    if (!subject) return;
    setPendingSession({
      minutes: minutesStudied,
      subjectId: subject.id,
      subjectName: subject.name,
      subjectColor: subject.color,
    });
  }

  function handleSaveSession(details) {
    const newSession = {
      id: Date.now(),
      subjectId: pendingSession.subjectId,
      subjectName: pendingSession.subjectName,
      subjectColor: pendingSession.subjectColor,
      duration: pendingSession.minutes,
      focusRating: details.focusRating,
      notes: details.notes,
      date: new Date().toISOString().slice(0, 10),
    };
    setSessions(prev => [newSession, ...prev]);
    setSubjects(prev =>
      prev.map(s =>
        s.id === pendingSession.subjectId
          ? { ...s, totalTimeSpent: s.totalTimeSpent + pendingSession.minutes }
          : s
      )
    );
    setPendingSession(null);
  }

  return (
    <Container fluid className="sf-page">
      <div className="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-2">
        <div>
          <h1 className="mb-2">Welcome back!</h1>
          <StreakBanner streak={streak} />
        </div>
      </div>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <StatsCard
            title="Today's Focus"
            value={todaysHours}
            unit="Hours"
            icon="⏱"
            iconBg="rgba(43, 74, 238, 0.1)"
            subtitle={focusChangeText}
            subtitleColor={focusChangeColor}
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title="Daily Streak"
            value={streak}
            unit="Days"
            icon="🔥"
            iconBg="rgba(245, 158, 11, 0.15)"
            subtitle={
              streak > 0 ? 'Consecutive active days' : 'Study today to start one!'
            }
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title="Sessions Today"
            value={`${sessionsToday}/${DAILY_SESSION_GOAL}`}
            icon="✓"
            iconBg="rgba(16, 185, 129, 0.15)"
            subtitle={`${Math.min(100, goalPct)}% of your daily goal`}
          />
        </Col>
      </Row>

      <Row className="g-3 mb-4">
        <Col lg={7}>
          <StudyTimer subjects={subjects} onEndSession={handleTimerEnd} />
        </Col>
        <Col lg={5}>
          <WeeklyTrendCard dailyMinutes={weeklyData} />
        </Col>
      </Row>

      <Row>
        <Col>
          <RecentSessionsList
            sessions={sessions.slice(0, 5)}
            subjects={subjects}
          />
        </Col>
      </Row>

      {pendingSession && (
        <EndSessionModal
          show={true}
          minutes={pendingSession.minutes}
          onSave={handleSaveSession}
          onDiscard={() => setPendingSession(null)}
        />
      )}
    </Container>
  );
}
