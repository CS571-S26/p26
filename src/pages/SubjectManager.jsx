import { Container, Row, Col, Card, Button, ListGroup, Badge } from 'react-bootstrap';

const mockSubjects = [
  { id: 1, name: 'Mathematics', color: '#4f46e5', totalTimeSpent: 120 },
  { id: 2, name: 'Computer Science', color: '#10b981', totalTimeSpent: 90 },
  { id: 3, name: 'Economics', color: '#f59e0b', totalTimeSpent: 60 },
];

export default function SubjectManager() {
  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Subjects</h1>
          <p className="text-muted">Manage your study subjects</p>
        </Col>
        <Col xs="auto">
          <Button variant="primary">+ Add Subject</Button>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={7}>
          <Card>
            <Card.Header>Your Subjects</Card.Header>
            <ListGroup variant="flush">
              {mockSubjects.map(subject => (
                <ListGroup.Item key={subject.id} className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <span style={{ width: 14, height: 14, borderRadius: '50%', background: subject.color, display: 'inline-block' }} />
                    {subject.name}
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <Badge bg="secondary">{subject.totalTimeSpent} min</Badge>
                    <Button size="sm" variant="outline-secondary">Edit</Button>
                    <Button size="sm" variant="outline-danger">Delete</Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col md={5}>
          <Card>
            <Card.Header>Add Subject</Card.Header>
            <Card.Body>
              <p className="text-muted">Subject form coming soon.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
