import './App.css';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage'
function App() {
  return (
    <Routes>
      <Route path = {'/'} element = {<HomePage />} />
      <Route path = {'*'} element = {<h1> Enter a valiud URL</h1>} />
    </Routes>
  );
}

export default App;
