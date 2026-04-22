import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function EndSessionModal(props) {
  const [rating, setRating] = useState(props.initialRating || 4);
  const [notes, setNotes] = useState(props.initialNotes || '');

  function handleSave() {
    props.onSave({ focusRating: rating, notes: notes.trim() });
  }

  return (
    <Modal show={props.show} onHide={props.onDiscard} centered>
      <Modal.Header closeButton>
        <Modal.Title>{props.title || 'Session Complete'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {props.minutes !== undefined && (
          <p className="text-muted mb-3">
            You studied for <strong>{props.minutes} minutes</strong>. How was your focus?
          </p>
        )}

        <Form.Group className="mb-4">
          <Form.Label>Focus Rating</Form.Label>
          <div className="d-flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <Button
                key={n}
                variant={rating === n ? 'primary' : 'outline-secondary'}
                onClick={() => setRating(n)}
                style={{ flex: 1, fontWeight: 600 }}
              >
                {n}
              </Button>
            ))}
          </div>
          <Form.Text className="text-muted">
            1 = distracted, 5 = deep focus
          </Form.Text>
        </Form.Group>

        <Form.Group>
          <Form.Label>Notes <span className="text-muted small">(optional)</span></Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="What did you work on? Any reflections?"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={props.onDiscard}>
          {props.discardLabel || 'Discard'}
        </Button>
        <Button variant="primary" onClick={handleSave}>
          {props.saveLabel || 'Save Session'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
