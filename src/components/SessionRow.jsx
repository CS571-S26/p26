import { Badge, Button } from 'react-bootstrap';

export default function SessionRow(props) {
  const { session } = props;

  return (
    <tr>
      <td>{session.date}</td>
      <td>{session.subjectName}</td>
      <td>{session.duration} min</td>
      <td><Badge bg="primary">{session.focusRating}/5</Badge></td>
      <td>{session.notes || '—'}</td>
      <td>
        <Button
          size="sm"
          variant="outline-danger"
          onClick={() => props.onDelete(session.id)}
        >
          ✕
        </Button>
      </td>
    </tr>
  );
}
