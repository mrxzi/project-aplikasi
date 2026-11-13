import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function HomePage({ setTab, onNavigateKantin }) {
  const {
    student,
    balance,
    topUp,
    sppData,
    activeOrder,
    menuItems,
    notifications,
    setNotifications,
    cartCount,
    cartTotal,
    addToCart,
    pickupPlace,
    setPickupPlace,
    pickupTime,
    setPickupTime,
    showToast,
  } = useApp();

  const [showTopUp, setShowTopUp] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showPickupModal, setShowPickupModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [topUpSuccess, setTopUpSuccess] = useState(null);
  const [customTopUp, setCustomTopUp] = useState('');

  const currentSpp = sppData.find(s => s.status === 'belum');
  const popularMenu = menuItems.filter(m => m.rating >= 4.7).slice(0, 6);

  const handleTopUp = (amount) => {
    topUp(amount);
    setTopUpSuccess(amount);
    setTimeout(() => {
      setTopUpSuccess(null);
      setShowTopUp(false);
      setCustomTopUp('');
    }, 1400);
  };

  const handleCustomTopUp = (e) => {
    e.preventDefault();
    const val = parseInt(customTopUp.replace(/\D/g, ''), 10);
    if (!val || val < 5000) {
      alert('Nominal minimal top up adalah Rp 5.000');
      return;
    }
    handleTopUp(val);
  };

  const formatRp = (n) => `Rp ${n.toLocaleString('id-ID')}`;

  return (
    <div className="min-h-full">
      {/* Blue Header — Reference Image 2 Style */}
      <div className="bg-[#2A4BA0] text-white px-5 pt-8 pb-7 rounded-b-[30px] relative overflow-hidden shadow-sm">
        {/* Top Header: Greeting, School & Icons */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 border border-white/30 flex items-center justify-center font-extrabold text-white text-base shadow-sm">
              {student.avatarLetter}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-[19px] font-bold tracking-tight">Halo, {student.name.split(' ')[0]}</h1>
                <span className="text-[10px] bg-amber-400 text-[#1B263B] font-extrabold px-1.5 py-0.2 rounded-md">
                  SISWA
                </span>
              </div>
              <p className="text-blue-100/75 text-xs font-normal">
                {student.grade} &bull; {student.school}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Notification Bell Button */}
            <button
              onClick={() => {
                setShowNotif(true);
                setNotifications(0);
              }}
              title="Notifikasi"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative hover:bg-white/20 active:scale-95 transition cursor-pointer"
            >
              <i className="fa-regular fa-bell text-white text-[15px]"></i>
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#F9B023] text-[#1B263B] text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {notifications}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => onNavigateKantin('')}
              title="Keranjang Belanja"
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center relative hover:bg-white/20 active:scale-95 transition cursor-pointer"
            >
              <i className="fa-solid fa-bag-shopping text-white text-[15px]"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#F9B023] text-[#1B263B] text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Pill — Functional */}
        <div className="relative mb-4.5">
          <i className="fa-solid fa-magnifying-glass absolute left-4.5 top-1/2 -translate-y-1/2 text-white/60 text-sm"></i>
          <input
            type="text"
            readOnly
            onClick={() => onNavigateKantin('')}
            placeholder="Cari makanan, minuman di Kantin Kesuma..."
            className="w-full pl-12 pr-4 py-3.5 bg-[#153075] rounded-full text-xs text-white placeholder:text-white/50 outline-none cursor-pointer hover:bg-[#122a69] transition font-medium border border-white/10"
          />
        </div>

        {/* Subheader Selectors: Delivery To & Within (Both Fully Interactive!) */}
        <div className="flex items-center justify-between text-xs font-medium text-white/80 px-1 pt-1">
          {/* Pickup Place Dropdown Button */}
          <button
            onClick={() => setShowPickupModal(true)}
            className="flex items-center gap-1.5 cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition active:scale-95 text-left"
          >
            <i className="fa-solid fa-location-dot text-[10px] text-amber-300"></i>
            <div className="max-w-[130px] truncate">
              <span className="text-[9px] uppercase tracking-wider block text-blue-200/70 font-bold leading-none">AMBIL DI</span>
              <span className="text-white font-semibold text-[11px] truncate block leading-tight">{pickupPlace.split(' ')[0]} {pickupPlace.split(' ')[1]}</span>
            </div>
            <i className="fa-solid fa-chevron-down text-[8px] text-white/70 ml-0.5"></i>
          </button>

          {/* Pickup Time Dropdown Button */}
          <button
            onClick={() => setShowTimeModal(true)}
            className="flex items-center gap-1.5 cursor-pointer bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition active:scale-95 text-right"
          >
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-wider block text-blue-200/70 font-bold leading-none">JAM ISTIRAHAT</span>
              <span className="text-white font-semibold text-[11px] block leading-tight">
                {pickupTime.includes('09.30') ? 'Istirahat 1 (09.30)' : 'Istirahat 2 (12.00)'}
              </span>
            </div>
            <i className="fa-solid fa-chevron-down text-[8px] text-white/70 ml-0.5"></i>
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="px-5 pt-5 space-y-5">
        {/* Banner Cards — Horizontal Scroll (Reference Image 2 Style) */}
        <div className="flex gap-3.5 overflow-x-auto -mx-5 px-5 scrollbar-hide py-1">
          {/* Card 1: 50% Off Banner (Image 2 style) - Interactive! */}
          <div
            onClick={() => setShowVoucherModal(true)}
            className="min-w-[280px] bg-gradient-to-r from-[#F9B023] to-[#F59E0B] rounded-[24px] p-5 text-white flex items-center justify-between shadow-sm relative overflow-hidden flex-shrink-0 cursor-pointer hover:shadow-md transition active:scale-[0.98]"
          >
            <div className="w-16 h-16 rounded-2xl border-2 border-white/60 bg-white/10 flex items-center justify-center relative flex-shrink-0 shadow-xs">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-9 h-9 text-white">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <div className="text-right pl-3">
              <span className="text-[10px] uppercase font-extrabold bg-white/25 px-2 py-0.5 rounded-full inline-block">
                Kupon Siswa
              </span>
              <h3 className="text-2xl font-black leading-tight my-1 tracking-tight">DISKON 50%</h3>
              <p className="text-[10px] text-white/90 font-medium">Klik untuk klaim voucher</p>
            </div>
          </div>

          {/* Card 2: Saldo KSmart Pay - Interactive! */}
          <div className="min-w-[280px] bg-[#E8DEC9] rounded-[24px] p-5 text-[#1B263B] flex items-center justify-between shadow-sm flex-shrink-0 border border-amber-200/50">
            <div className="w-16 h-16 rounded-2xl border-2 border-[#1B263B]/20 bg-white/40 flex items-center justify-center flex-shrink-0">
              <i className="fa-solid fa-wallet text-2xl text-[#1B263B]"></i>
            </div>
            <div className="text-right pl-3">
              <p className="text-[10px] font-bold text-[#1B263B]/60 uppercase tracking-wider">SALDO KSMART PAY</p>
              <h3 className="text-xl font-black leading-none my-1 text-[#1B263B]">{formatRp(balance)}</h3>
              <button
                onClick={() => setShowTopUp(true)}
                className="mt-1 text-xs font-bold bg-[#1B263B] text-white px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-sm active:scale-90 transition hover:bg-[#2A3B7E]"
              >
                <i className="fa-solid fa-plus text-[9px] text-[#F9B023]"></i>
                <span>Top Up</span>
              </button>
            </div>
          </div>
        </div>

        {/* SPP Notification Reminder Card */}
        {currentSpp && (
          <div className="bg-white rounded-[24px] p-4.5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-orange-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0">
                <i className="fa-solid fa-receipt text-orange-500 text-lg"></i>
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                  SPP Belum Lunas
                </span>
                <p className="text-sm font-bold text-gray-800 mt-1 truncate">
                  SPP {currentSpp.month} {currentSpp.year}
                </p>
                <p className="text-xs text-gray-400 font-medium">{formatRp(currentSpp.amount)}</p>
              </div>
            </div>
            <button
              onClick={() => setTab('spp')}
              className="bg-[#2A4BA0] text-white text-xs font-bold px-4.5 py-2.5 rounded-full shadow-md shadow-[#2A4BA0]/20 hover:bg-[#1E3A8A] transition active:scale-95 flex-shrink-0 cursor-pointer"
            >
              Bayar Sekarang
            </button>
          </div>
        )}

        {/* Active Order Alert (Interactive -> opens ticket modal) */}
        {activeOrder && activeOrder.status === 'Sedang Disiapkan' && (
          <div
            onClick={() => setShowTicketModal(true)}
            className="bg-white rounded-[24px] p-4 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-2 border-emerald-500/25 flex items-center justify-between cursor-pointer hover:border-emerald-500/50 transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <i className="fa-solid fa-utensils text-base"></i>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Pesanan Aktif {activeOrder.id}</p>
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {activeOrder.status} &bull; {activeOrder.pickupTime.split(' ')[0]}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#2A4BA0] flex items-center gap-1">
              Tiket QR <i className="fa-solid fa-chevron-right text-[10px]"></i>
            </span>
          </div>
        )}

        {/* Quick Kategori Menu Buttons — All 4 Functional */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#1B263B] tracking-tight">Kategori Kantin</h2>
            <button
              onClick={() => onNavigateKantin('')}
              className="text-xs font-bold text-[#2A4BA0] hover:underline cursor-pointer"
            >
              Semua Menu
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2.5 text-center">
            {[
              { label: 'Makanan', category: 'Makanan Berat', icon: 'fa-bowl-rice', bg: 'bg-blue-50 text-[#2A4BA0]' },
              { label: 'Minuman', category: 'Minuman', icon: 'fa-glass-water', bg: 'bg-amber-50 text-amber-600' },
              { label: 'Snack', category: 'Snack', icon: 'fa-cookie-bite', bg: 'bg-rose-50 text-rose-500' },
              { label: 'Koperasi', category: 'Koperasi', icon: 'fa-store', bg: 'bg-emerald-50 text-emerald-600' },
            ].map((cat) => (
              <button
                key={cat.label}
                onClick={() => onNavigateKantin(cat.category)}
                className="bg-white rounded-2xl p-3 border border-gray-100 shadow-xs flex flex-col items-center gap-2 hover:border-[#2A4BA0]/30 transition group active:scale-95 cursor-pointer"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cat.bg} group-hover:scale-105 transition-transform`}>
                  <i className={`fa-solid ${cat.icon} text-base`}></i>
                </div>
                <span className="text-[11px] font-semibold text-gray-700">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recommended Food Section (Reference Image 2 Style) */}
        <div className="pb-4">
          <div className="flex items-center justify-between mb-3.5">
            <h2 className="text-lg font-bold text-[#1B263B] tracking-tight">Menu Populer Siswa</h2>
            <button
              onClick={() => onNavigateKantin('')}
              className="text-xs font-bold text-[#2A4BA0] hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 gap-3.5">
            {popularMenu.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedDetailItem(item)}
                className="bg-white rounded-[24px] p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-blue-100 transition group"
              >
                {/* Outline Image Vector Container */}
                <div className="w-full h-28 bg-[#F8F9FB] rounded-2xl flex items-center justify-center relative mb-3 group-hover:bg-blue-50/40 transition">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-12 h-12 text-gray-300">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <div className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-xs flex items-center justify-center text-[#2A4BA0]">
                    <i className={`fa-solid ${item.icon} text-xs`}></i>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{item.stan}</p>
                </div>

                {/* Price and Functional Plus Button */}
                <div className="flex items-center justify-between mt-3 pt-1">
                  <div>
                    <span className="text-sm font-extrabold text-[#1B263B]">{formatRp(item.price)}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    title="Tambah ke Keranjang"
                    className="w-8 h-8 rounded-full bg-[#2A4BA0] text-white flex items-center justify-center shadow-md shadow-[#2A4BA0]/20 hover:bg-[#1E3A8A] active:scale-90 transition cursor-pointer"
                  >
                    <i className="fa-solid fa-plus text-xs"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= MODAL: TOP UP SALDO ================= */}
      {showTopUp && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowTopUp(false)}></div>
          <div className="relative bg-white w-full max-w-[430px] rounded-t-[32px] p-6 pb-10 animate-slide-up shadow-2xl">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Top Up KSmart Pay</h3>
                <p className="text-xs text-gray-400">Saldo saat ini: {formatRp(balance)}</p>
              </div>
              <button
                onClick={() => setShowTopUp(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            {topUpSuccess ? (
              <div className="text-center py-6 animate-fade-in">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-500">
                  <i className="fa-solid fa-check text-2xl"></i>
                </div>
                <p className="font-bold text-gray-800 text-base">Top Up Berhasil!</p>
                <p className="text-sm text-gray-500 mt-1">Saldo bertambah +{formatRp(topUpSuccess)}</p>
              </div>
            ) : (
              <div className="space-y-3.5">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Pilih Nominal Instan:</p>
                <div className="grid grid-cols-2 gap-2.5">
                  {[20000, 50000, 100000, 150000].map((nominal) => (
                    <button
                      key={nominal}
                      onClick={() => handleTopUp(nominal)}
                      className="p-3.5 bg-[#F8F9FB] hover:bg-blue-50/70 rounded-2xl border border-gray-100 hover:border-[#2A4BA0]/40 transition text-left cursor-pointer active:scale-95 group"
                    >
                      <span className="text-[10px] text-gray-400 font-bold block">SIMULASI</span>
                      <span className="text-sm font-bold text-gray-800 group-hover:text-[#2A4BA0]">
                        {formatRp(nominal)}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Custom nominal input */}
                <form onSubmit={handleCustomTopUp} className="pt-2">
                  <label className="text-xs text-gray-500 font-medium block mb-1.5">Atau Masukkan Nominal Lain (Rp):</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={customTopUp}
                      onChange={(e) => setCustomTopUp(e.target.value)}
                      placeholder="Contoh: 25000"
                      className="flex-1 px-4 py-3 bg-[#F8F9FB] rounded-xl text-sm border border-gray-200 outline-none focus:border-[#2A4BA0]"
                    />
                    <button
                      type="submit"
                      className="px-5 py-3 bg-[#2A4BA0] text-white font-bold text-xs rounded-xl shadow-md shadow-[#2A4BA0]/20 hover:bg-[#1E3A8A] cursor-pointer"
                    >
                      Isi Saldo
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: NOTIFIKASI ================= */}
      {showNotif && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowNotif(false)}></div>
          <div className="relative bg-white w-full max-w-[430px] rounded-t-[32px] p-6 pb-10 animate-slide-up shadow-2xl">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Notifikasi Siswa</h3>
                <p className="text-xs text-gray-400">Pengumuman & aktivitas akun SMAK Kesuma</p>
              </div>
              <button
                onClick={() => setShowNotif(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
            <div className="space-y-3">
              {[
                { title: 'Jatuh Tempo SPP November', desc: 'Batas akhir pembayaran SPP bulan November adalah tanggal 15.', time: '1 jam lalu', icon: 'fa-bell text-orange-500' },
                { title: 'Menu Baru di Stan Bu Maria', desc: 'Soto Ayam Lamongan kini tersedia dengan koya spesial.', time: '3 jam lalu', icon: 'fa-utensils text-[#2A4BA0]' },
                { title: 'Kantin Buka Jam Istirahat', desc: 'Pesanan untuk Istirahat 1 sudah bisa dipesan mulai sekarang.', time: 'Pagi ini', icon: 'fa-clock text-emerald-500' },
              ].map((item, idx) => (
                <div key={idx} className="p-3.5 bg-[#F8F9FB] rounded-2xl border border-gray-100 flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-xs">
                    <i className={`fa-solid ${item.icon} text-sm`}></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-800">{item.title}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{item.desc}</p>
                    <span className="text-[10px] text-gray-300 font-medium block mt-1">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PILIH TEMPAT AMBIL ================= */}
      {showPickupModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowPickupModal(false)}></div>
          <div className="relative bg-white w-full max-w-[430px] rounded-t-[32px] p-6 pb-10 animate-slide-up shadow-2xl">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
            <h3 className="text-base font-bold text-gray-800 mb-3">Pilih Lokasi Pengambilan Kantin</h3>
            <div className="space-y-2">
              {[
                'Kantin Utama Depan Lapangan',
                'Kantin Belakang Dekat Lab Biologi',
                'Koperasi Siswa Kesuma'
              ].map((place) => (
                <button
                  key={place}
                  onClick={() => {
                    setPickupPlace(place);
                    setShowPickupModal(false);
                    showToast(`Lokasi diubah ke: ${place}`);
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition flex items-center justify-between cursor-pointer ${
                    pickupPlace === place ? 'border-[#F9B023] bg-amber-50/20' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-location-dot text-[#2A4BA0]"></i>
                    <span className="text-xs font-bold text-gray-800">{place}</span>
                  </div>
                  {pickupPlace === place && (
                    <i className="fa-solid fa-circle-check text-[#F9B023]"></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: PILIH WAKTU ISTIRAHAT ================= */}
      {showTimeModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowTimeModal(false)}></div>
          <div className="relative bg-white w-full max-w-[430px] rounded-t-[32px] p-6 pb-10 animate-slide-up shadow-2xl">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>
            <h3 className="text-base font-bold text-gray-800 mb-3">Pilih Jam Pengambilan Pesanan</h3>
            <div className="space-y-2">
              {[
                { label: 'Istirahat 1 (09.30 - 10.00)', desc: 'Istirahat pagi setelah jam ke-4' },
                { label: 'Istirahat 2 (12.00 - 12.45)', desc: 'Makan siang setelah jam ke-7' },
              ].map((t) => (
                <button
                  key={t.label}
                  onClick={() => {
                    setPickupTime(t.label);
                    setShowTimeModal(false);
                    showToast(`Waktu ambil diatur ke: ${t.label.split(' ')[0]} ${t.label.split(' ')[1]}`);
                  }}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition flex items-center justify-between cursor-pointer ${
                    pickupTime === t.label ? 'border-[#F9B023] bg-amber-50/20' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">{t.label}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5 block">{t.desc}</span>
                  </div>
                  {pickupTime === t.label && (
                    <i className="fa-solid fa-circle-check text-[#F9B023]"></i>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: KLAIM VOUCHER ================= */}
      {showVoucherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowVoucherModal(false)}></div>
          <div className="relative bg-white w-full max-w-[360px] rounded-[30px] p-6 text-center animate-slide-up shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center mx-auto mb-3 text-2xl">
              <i className="fa-solid fa-ticket"></i>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Kupon Jajan Kesuma</h3>
            <p className="text-xs text-gray-500 mt-1">Diskon 50% untuk pesanan menu berat di Stan Bu Maria!</p>

            <div className="my-4 p-3 bg-[#F8F9FB] rounded-2xl border border-dashed border-[#F9B023] flex items-center justify-between">
              <span className="font-mono font-extrabold text-[#2A4BA0] text-sm tracking-widest">KESUMA50</span>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText('KESUMA50');
                  showToast('Kode voucher KESUMA50 disalin!', 'fa-copy');
                  setShowVoucherModal(false);
                }}
                className="text-xs font-bold bg-[#2A4BA0] text-white px-3 py-1.5 rounded-xl cursor-pointer active:scale-95"
              >
                Salin Kode
              </button>
            </div>

            <button
              onClick={() => {
                setShowVoucherModal(false);
                onNavigateKantin('Makanan Berat');
              }}
              className="w-full py-3.5 bg-[#F9B023] text-[#1B263B] font-bold text-xs rounded-full cursor-pointer hover:bg-amber-400 active:scale-95 transition"
            >
              Gunakan Sekarang di Kantin &rarr;
            </button>
          </div>
        </div>
      )}

      {/* ================= MODAL: DETAIL MENU DARI HOME ================= */}
      {selectedDetailItem && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setSelectedDetailItem(null)}></div>
          <div className="relative bg-white w-full max-w-[430px] rounded-t-[36px] max-h-[90vh] overflow-y-auto animate-slide-up flex flex-col shadow-2xl">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 px-5 pt-4 pb-2 flex items-center justify-between border-b border-gray-50">
              <button
                onClick={() => setSelectedDetailItem(null)}
                className="w-9 h-9 rounded-full bg-[#F8F9FB] flex items-center justify-center hover:bg-gray-100 cursor-pointer"
              >
                <i className="fa-solid fa-chevron-left text-gray-700 text-sm"></i>
              </button>
              <span className="text-xs font-bold text-gray-800">{selectedDetailItem.stan}</span>
              <button
                onClick={() => setSelectedDetailItem(null)}
                className="w-9 h-9 rounded-full bg-[#F8F9FB] flex items-center justify-center text-gray-400 cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>

            <div className="p-6">
              <div className="w-full h-48 bg-[#F8F9FB] rounded-[24px] flex items-center justify-center relative mb-4">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-20 h-20 text-gray-300">
                  <rect x="3" y="3" width="18" height="18" rx="4" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white shadow-xs flex items-center justify-center text-[#2A4BA0]">
                  <i className={`fa-solid ${selectedDetailItem.icon} text-sm`}></i>
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#1B263B]">{selectedDetailItem.name}</h3>
              <p className="text-lg font-black text-[#2A4BA0] mt-1">{formatRp(selectedDetailItem.price)}</p>
              <p className="text-xs text-gray-500 mt-2.5 leading-relaxed">{selectedDetailItem.desc}</p>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    addToCart(selectedDetailItem);
                    setSelectedDetailItem(null);
                  }}
                  className="flex-1 py-3.5 rounded-full border-2 border-[#2A4BA0] text-[#2A4BA0] font-bold text-xs cursor-pointer hover:bg-blue-50/50 active:scale-95"
                >
                  + Tambah Keranjang
                </button>
                <button
                  onClick={() => {
                    addToCart(selectedDetailItem);
                    setSelectedDetailItem(null);
                    onNavigateKantin('');
                  }}
                  className="flex-1 py-3.5 rounded-full bg-[#2A4BA0] text-white font-bold text-xs cursor-pointer hover:bg-[#1E3A8A] active:scale-95 shadow-md shadow-[#2A4BA0]/20"
                >
                  Pesan Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: TIKET PESANAN AKTIF DARI HOME ================= */}
      {showTicketModal && activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowTicketModal(false)}></div>
          <div className="relative bg-white w-full max-w-[360px] rounded-[32px] overflow-hidden animate-slide-up shadow-2xl">
            <div className="bg-[#2A4BA0] text-white text-center py-6 px-5">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 text-xl">
                <i className="fa-solid fa-qrcode text-white"></i>
              </div>
              <h3 className="text-base font-bold">Tiket Pesanan Kantin</h3>
              <p className="text-[11px] text-white/70">Tunjukkan di Stan SMAK Kesuma</p>
            </div>

            <div className="p-5 space-y-3.5 text-center">
              <div>
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">KODE PESANAN</span>
                <p className="text-xl font-black text-[#1B263B] mt-0.5">{activeOrder.id}</p>
              </div>

              <div className="w-32 h-32 mx-auto bg-[#F8F9FB] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200">
                <i className="fa-solid fa-qrcode text-5xl text-gray-400"></i>
                <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase">Scan di Kasir</span>
              </div>

              <div className="bg-[#F8F9FB] rounded-xl p-3 text-xs space-y-1.5 text-left">
                {activeOrder.items?.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-gray-600">
                    <span>{it.qty}x {it.name}</span>
                    <span className="font-bold text-gray-800">{formatRp(it.price * it.qty)}</span>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-1.5 flex justify-between font-bold text-xs">
                  <span>Total</span>
                  <span className="text-[#2A4BA0]">{formatRp(activeOrder.total)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowTicketModal(false)}
                className="w-full py-3 bg-[#2A4BA0] text-white rounded-full font-bold text-xs cursor-pointer hover:bg-[#1E3A8A] active:scale-95"
              >
                Tutup Tiket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
