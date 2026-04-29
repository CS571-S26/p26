import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '▦', end: true },
  { to: '/subjects', label: 'Subjects', icon: '📕' },
  { to: '/sessions', label: 'Sessions', icon: '⏱' },
  { to: '/statistics', label: 'Statistics', icon: '📊' },
];

export default function Sidebar() {
  return (
    <aside className="sf-sidebar">
      <div className="sf-brand">
        <div className="sf-brand-icon" aria-hidden="true">📖</div>
        <div>
          <div className="sf-brand-name">StudyFlow</div>
          <div className="sf-brand-sub">Deep Work Engine</div>
        </div>
      </div>

      <nav className="sf-nav" aria-label="Primary">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? 'sf-navlink sf-navlink-active' : 'sf-navlink'
            }
          >
            <span className="sf-navlink-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
