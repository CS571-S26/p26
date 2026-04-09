import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';

const mockSessions = [
  { id: 1, subject: 'Mathematics', duration: 45, focusRating: 4, date: '2026-04-07', notes: 'Calculus homework' },
  { id: 2, subject: 'Computer Science', duration: 60, focusRating: 5, date: '2026-04-07', notes: 'React practice' },
  { id: 3, subject: 'Economics', duration: 30, focusRating: 3, date: '2026-04-06', notes: 'Chapter 5 reading' },
];

export default function Sessions() {
  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Study Sessions</h1>
          <p className="text-muted">Track and review your study time</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary">+ Start Session</Button>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={8}>
          <Card>
            <Card.Header>Session History</Card.Header>
            <Table hover responsive className="mb-0">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Subject</th>
                  <th>Duration</th>
                  <th>Focus</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {mockSessions.map(session => (
                  <tr key={session.id}>
                    <td>{session.date}</td>
                    <td>{session.subject}</td>
                    <td>{session.duration} min</td>
                    <td><Badge bg="primary">{session.focusRating}/5</Badge></td>
                    <td>{session.notes}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>Timer</Card.Header>
            <Card.Body className="text-center">
              <h2 className="display-4 fw-bold">25:00</h2>
              <p className="text-muted">Pomodoro</p>
              <Button variant="primary" className="w-100">Start</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
