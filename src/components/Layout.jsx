import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="sf-app">
      <Sidebar />
      <main className="sf-main">
        <Outlet />
      </main>
    </div>
  );
}
