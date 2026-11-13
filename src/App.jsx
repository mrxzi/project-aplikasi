import { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import HomePage from './pages/HomePage';
import KantinPage from './pages/KantinPage';
import SppPage from './pages/SppPage';
import RiwayatPage from './pages/RiwayatPage';

function AppContent() {
  const [tab, setTab] = useState('beranda');
  const [kantinCategoryFilter, setKantinCategoryFilter] = useState('');
  const { toast } = useApp();

  const tabs = [
    { id: 'beranda', label: 'Beranda', icon: 'fa-house' },
    { id: 'kantin', label: 'Kantin', icon: 'fa-table-cells-large' },
    { id: 'spp', label: 'SPP', icon: 'fa-heart' },
    { id: 'riwayat', label: 'Riwayat', icon: 'fa-ellipsis-vertical' },
  ];

  const navigateToKantin = (cat = '') => {
    setKantinCategoryFilter(cat);
    setTab('kantin');
  };

  return (
    <div className="bg-[#DCE1EB] min-h-screen flex items-start justify-center sm:py-6 select-none font-sans">
      {/* Mobile Frame Container — Clean, no fake status bar */}
      <div className="w-full max-w-[430px] mx-auto min-h-screen bg-[#F8F9FB] shadow-[0_30px_70px_rgba(0,0,0,0.22)] sm:rounded-[36px] relative overflow-hidden flex flex-col border border-gray-200/50">
        
        {/* Main Content Area */}
        <main className="flex-1 pb-24 overflow-y-auto">
          {tab === 'beranda' && (
            <HomePage
              setTab={setTab}
              onNavigateKantin={navigateToKantin}
            />
          )}
          {tab === 'kantin' && (
            <KantinPage
              setTab={setTab}
              initialCategory={kantinCategoryFilter}
              clearInitialCategory={() => setKantinCategoryFilter('')}
            />
          )}
          {tab === 'spp' && <SppPage setTab={setTab} />}
          {tab === 'riwayat' && <RiwayatPage setTab={setTab} />}
        </main>

        {/* Global Toast Notification */}
        {toast && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-[380px] pointer-events-none animate-slide-up">
            <div className="bg-[#1B263B] text-white px-4 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
              <div className="w-7 h-7 rounded-xl bg-[#F9B023] text-[#1B263B] flex items-center justify-center flex-shrink-0">
                <i className={`fa-solid ${toast.icon} text-xs`}></i>
              </div>
              <p className="text-xs font-semibold leading-snug flex-1">{toast.message}</p>
            </div>
          </div>
        )}

        {/* Bottom Navigation Bar — Exact Reference Style (Image 2 & 3) */}
        <nav className="fixed bottom-0 sm:absolute sm:bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-30">
          <div className="bg-white/95 backdrop-blur-md rounded-t-[28px] border-t border-gray-100 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-around">
              {tabs.map(({ id, label, icon }) => {
                const active = tab === id;
                return (
                  <button
                    key={id}
                    onClick={() => {
                      if (id === 'kantin') setKantinCategoryFilter('');
                      setTab(id);
                    }}
                    className="flex flex-col items-center justify-center min-w-[64px] transition-all duration-200 cursor-pointer active:scale-95"
                  >
                    {active ? (
                      /* Active state: Dark circular button with yellow accent icon */
                      <div className="flex flex-col items-center -translate-y-2 animate-fade-in">
                        <div className="w-13 h-13 bg-[#1B263B] rounded-full flex items-center justify-center shadow-lg shadow-[#1B263B]/30 border-2 border-white">
                          <i className={`fa-solid ${icon} text-[#F9B023] text-[18px]`}></i>
                        </div>
                        <span className="text-[10px] font-bold text-[#1B263B] mt-0.5 tracking-tight">{label}</span>
                      </div>
                    ) : (
                      /* Inactive state: clean gray icon with label */
                      <div className="flex flex-col items-center py-1.5 transition-colors duration-200">
                        <i className={`fa-solid ${icon} text-gray-400 text-[18px] hover:text-gray-600`}></i>
                        <span className="text-[10px] font-medium text-gray-400 mt-1">{label}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
