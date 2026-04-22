import { useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';

export default function Home() {
  // Read sessions from localStorage once when the component mounts
  const [sessions] = useState(() => {
    const saved = localStorage.getItem('studyflow-sessions');
    return saved ? JSON.parse(saved) : [];
  });

  const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMinutes = totalMinutes % 60;
  const timeDisplay = totalHours > 0
    ? `${totalHours}h ${remainingMinutes}m`
    : `${totalMinutes}m`;

  const today = new Date().toISOString().slice(0, 10);
  const todaysSessions = sessions.filter(s => s.date === today);
  const todaysMinutes = todaysSessions.reduce((acc, s) => acc + s.duration, 0);

  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1>Welcome to StudyFlow</h1>
          <p className="text-muted fs-5">
            Track your study sessions, manage subjects, and hit your goals.
          </p>
          <Button as={Link} to="/sessions" variant="primary" size="lg">
            Start Studying
          </Button>
        </Col>
      </Row>

      <h2 className="h5 text-muted mb-3">Your Progress</h2>
      <Row className="g-4 mb-5">
        <Col md={4}>
          <StatsCard
            title="Total Sessions"
            value={sessions.length}
            subtitle="all-time"
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title="Total Study Time"
            value={timeDisplay}
            subtitle="all-time"
            color="#10b981"
          />
        </Col>
        <Col md={4}>
          <StatsCard
            title="Today"
            value={`${todaysMinutes}m`}
            subtitle={`${todaysSessions.length} sessions`}
            color="#f59e0b"
          />
        </Col>
      </Row>

      <h2 className="h5 text-muted mb-3">Features</h2>
      <Row className="g-4">
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Study Timer</Card.Title>
              <Card.Text>Start a session and track your study time in real time.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Subject Manager</Card.Title>
              <Card.Text>Organize your study time by subject with custom colors.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Analytics</Card.Title>
              <Card.Text>See your weekly trends and focus ratings over time.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
