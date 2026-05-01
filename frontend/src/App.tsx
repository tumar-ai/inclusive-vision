import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Audit from './pages/Audit';
import Dashboard from './pages/Dashboard';
import SignLanguage from './pages/SignLanguage';
import Navigate from './pages/Navigate';

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <div className="min-h-screen flex flex-col w-full" style={{ background: '#f8fafc' }}>
          <Header />
          <main className="flex-1 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/scan" element={<Scan />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/sign-language" element={<SignLanguage />} />
              <Route path="/navigate" element={<Navigate />} />
            </Routes>
          </main>
        </div>
      </AppProvider>
    </BrowserRouter>
  );
}
