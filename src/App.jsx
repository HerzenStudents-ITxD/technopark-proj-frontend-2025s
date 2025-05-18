import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import ProjectPage from './pages/ProjectPage';
import EditProjectPage from './pages/EditProjectPage';

function App() {

  return (
    <BrowserRouter basename="/technopark-proj">
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="project/:id" element={<ProjectPage />} />
        <Route path="project/:id/edit" element={<EditProjectPage />} />
		<Route path="project/edit" element={<EditProjectPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
