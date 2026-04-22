import { Card } from 'react-bootstrap';

export default function StatsCard(props) {
  return (
    <Card className="h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start mb-2">
          <span className="text-muted small">{props.title}</span>
          <div
            className="sf-stats-icon"
            style={{ background: props.iconBg || 'rgba(43, 74, 238, 0.1)' }}
          >
            <span style={{ fontSize: '1.1rem' }}>{props.icon}</span>
          </div>
        </div>

        <div className="d-flex align-items-baseline gap-2 mb-1">
          <span className="sf-stats-value">{props.value}</span>
          {props.unit && <span className="text-muted">{props.unit}</span>}
        </div>

        {props.subtitle && (
          <div
            className="small"
            style={{ color: props.subtitleColor || 'var(--text-light)' }}
          >
            {props.subtitle}
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
