import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Container className="py-5">
      <Row className="mb-5">
        <Col>
          <h1>Welcome to StudyFlow</h1>
          <p className="text-muted fs-5">Track your study sessions, manage subjects, and hit your goals.</p>
          <Button as={Link} to="/sessions" variant="primary" size="lg">Start Studying</Button>
        </Col>
      </Row>

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
