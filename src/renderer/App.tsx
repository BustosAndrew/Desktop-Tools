import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { FileFolderUpdater } from './components/FileFolderUpdater';
import { FileFolderFinder } from './components/FileFolderFinder';
import { Home } from './components/Home';
import './App.css';

// comments written in jsx code have to be within curly braces,
// as shown for the default route
export default function App() {
  // switches between different pages of the app
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* default page */}
        <Route path="/updater" element={<FileFolderUpdater />} />
        <Route path="/finder" element={<FileFolderFinder />} />
      </Routes>
    </Router>
  );
}
