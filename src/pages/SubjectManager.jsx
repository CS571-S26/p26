import { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import SubjectForm from '../components/SubjectForm';
import SubjectCard from '../components/SubjectCard';
import WeeklyOverviewCard from '../components/WeeklyOverviewCard';

const DEFAULT_SUBJECTS = [
  { id: 1, name: 'Mathematics', color: '#4f46e5', dailyGoal: 2, weeklyGoal: 10, totalTimeSpent: 0 },
  { id: 2, name: 'Computer Science', color: '#10b981', dailyGoal: 2, weeklyGoal: 15, totalTimeSpent: 0 },
  { id: 3, name: 'Economics', color: '#f59e0b', dailyGoal: 1, weeklyGoal: 8, totalTimeSpent: 0 },
];

export default function SubjectManager() {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem('studyflow-subjects');
    return saved ? JSON.parse(saved) : DEFAULT_SUBJECTS;
  });

  const [sessions] = useState(() => {
    const saved = localStorage.getItem('studyflow-sessions');
    return saved ? JSON.parse(saved) : [];
  });

  // Capture "now" once on mount so render stays pure
  const [now] = useState(() => Date.now());

  const [showForm, setShowForm] = useState(true);

  useEffect(() => {
    localStorage.setItem('studyflow-subjects', JSON.stringify(subjects));
  }, [subjects]);

  // Compute this week's minutes per subject (last 7 days)
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const weeklyMinutesBySubject = {};
  sessions.forEach(s => {
    const sessionTime = new Date(s.date).getTime();
    if (sessionTime >= weekAgo) {
      weeklyMinutesBySubject[s.subjectId] =
        (weeklyMinutesBySubject[s.subjectId] || 0) + s.duration;
    }
  });

  function handleAdd(newSubject) {
    setSubjects(prev => [...prev, newSubject]);
  }

  function handleDelete(id) {
    setSubjects(prev => prev.filter(s => s.id !== id));
  }

  return (
    <Container fluid className="sf-page">
      <div className="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-2">
        <div>
          <h1 className="mb-1">Subjects</h1>
          <p className="text-muted mb-0">
            Track your learning progress and study targets.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(prev => !prev)}
          aria-expanded={showForm}
          aria-controls="subject-form-region"
        >
          {showForm ? 'Close form' : 'Add new subject'}
        </Button>
      </div>

      <Row className="g-4" id="subject-form-region">
        {showForm && (
          <Col lg={4}>
            <SubjectForm onAdd={handleAdd} />
          </Col>
        )}

        <Col lg={showForm ? 8 : 12}>
          {subjects.length === 0 ? (
            <div className="text-center text-muted py-5">
              No subjects yet — add one on the left!
            </div>
          ) : (
            subjects.map(subject => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                weeklyMinutes={weeklyMinutesBySubject[subject.id] || 0}
                onDelete={handleDelete}
              />
            ))
          )}

          {subjects.length > 0 && (
            <WeeklyOverviewCard
              subjects={subjects}
              weeklyMinutesBySubject={weeklyMinutesBySubject}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}
