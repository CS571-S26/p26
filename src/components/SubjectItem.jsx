import { ListGroup, Badge, Button } from 'react-bootstrap';

export default function SubjectItem(props) {
  const { subject } = props;

  function handleDelete() {
    if (window.confirm(`Delete "${subject.name}"?`)) {
      props.onDelete(subject.id);
    }
  }

  return (
    <ListGroup.Item className="d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-2">
        <span
          style={{
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: subject.color,
            display: 'inline-block',
          }}
        />
        {subject.name}
      </div>
      <div className="d-flex align-items-center gap-2">
        <Badge bg="secondary">{subject.totalTimeSpent} min</Badge>
        <Button size="sm" variant="outline-danger" onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </ListGroup.Item>
  );
}
