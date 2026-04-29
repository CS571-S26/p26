import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="sf-app">
      <Sidebar />
      <main id="main-content" className="sf-main" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
}
