import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';
import SubjectManager from './pages/SubjectManager';
import Statistics from './pages/Statistics';
import NotFound from './pages/NotFound';

const BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="subjects" element={<SubjectManager />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
