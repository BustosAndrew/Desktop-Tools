import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Render } from './components/Render';
import './App.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Render />} />
      </Routes>
    </Router>
  );
}
