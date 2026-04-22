import { Card, Table } from 'react-bootstrap';
import SessionRow from './SessionRow';

export default function SessionTable(props) {
  return (
    <Card>
      <Card.Header>Session History</Card.Header>
      {props.sessions.length === 0 ? (
        <Card.Body className="text-muted text-center">
          No sessions yet. Start the timer to log one!
        </Card.Body>
      ) : (
        <Table hover responsive className="mb-0">
          <thead>
            <tr>
              <th>Date</th>
              <th>Subject</th>
              <th>Duration</th>
              <th>Focus</th>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {props.sessions.map(session => (
              <SessionRow
                key={session.id}
                session={session}
                onDelete={props.onDelete}
              />
            ))}
          </tbody>
        </Table>
      )}
    </Card>
  );
}
