import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Bairros from './pages/Bairros';
import Feed from './pages/Feed';
import Avaliar from './pages/Avaliar';
import Historico from './pages/Historico';
import Denunciar from './pages/Denunciar';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0A0F1E]">
        <Navbar />
        <main className="pb-12">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bairros" element={<Bairros />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/avaliar" element={<Avaliar />} />
            <Route path="/historico" element={<Historico />} />
            <Route path="/denunciar" element={<Denunciar />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
