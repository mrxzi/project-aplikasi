import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';

export default function KantinPage({ setTab, initialCategory, clearInitialCategory }) {
  const {
    menuItems,
    addToCart,
    removeFromCart,
    cart,
    cartTotal,
    cartCount,
    balance,
    checkout,
    favorites,
    toggleFavorite,
    pickupPlace,
    setPickupPlace,
    pickupTime,
    setPickupTime,
    showToast,
  } = useApp();

  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('Semua');
  const [showCart, setShowCart] = useState(false);
  const [note, setNote] = useState('');
  const [payMethod, setPayMethod] = useState('Saldo KSmart Pay');
  const [showTicket, setShowTicket] = useState(null);
  const [showDetail, setShowDetail] = useState(null);
  const [view, setView] = useState('category'); // 'category' or 'list'
  const [selectedStan, setSelectedStan] = useState('');
  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' or 'address' (Image 6 & 7)

  // Categories list matching Image 3 style (Stan SMAK Kesuma Mataram)
  const stanCategories = [
    { label: 'Stan Bu Maria', sub: 'Makanan Berat & Lauk', icon: 'fa-bowl-rice', stan: 'Stan Bu Maria' },
    { label: 'Kedai Minuman Segar', sub: 'Minuman Dingin & Hangat', icon: 'fa-glass-water', stan: 'Kedai Minuman Segar' },
    { label: 'Snack & Jajanan Kesuma', sub: 'Camilan & Gorengan', icon: 'fa-cookie-bite', stan: 'Snack & Jajanan Kesuma' },
    { label: 'Koperasi Siswa Kesuma', sub: 'Alat Tulis & Atribut', icon: 'fa-store', stan: 'Koperasi Siswa Kesuma' },
  ];

  // Chips matching Image 4 style
  const filterChips = ['Semua', 'Popular', 'Termurah', 'Makanan Berat', 'Minuman', 'Snack', 'Favorit'];

  // Handle category navigation from HomePage
  useEffect(() => {
    if (initialCategory) {
      setView('list');
      if (initialCategory === 'Makanan Berat' || initialCategory === 'Minuman' || initialCategory === 'Snack' || initialCategory === 'Koperasi') {
        setActiveFilter(initialCategory);
        setSelectedStan('');
      } else {
        setSelectedStan(initialCategory);
        setActiveFilter('Semua');
      }
      clearInitialCategory?.();
    }
  }, [initialCategory, clearInitialCategory]);

  const filtered = useMemo(() => {
    let items = menuItems;
    if (selectedStan && selectedStan !== 'Semua') {
      items = items.filter(i => i.stan === selectedStan);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.stan.toLowerCase().includes(q) ||
        i.desc.toLowerCase().includes(q)
      );
    }
    if (activeFilter === 'Popular') items = [...items].sort((a, b) => b.rating - a.rating);
    if (activeFilter === 'Termurah') items = [...items].sort((a, b) => a.price - b.price);
    if (activeFilter === 'Makanan Berat') items = items.filter(i => i.category === 'Makanan Berat');
    if (activeFilter === 'Minuman') items = items.filter(i => i.category === 'Minuman');
    if (activeFilter === 'Snack') items = items.filter(i => i.category === 'Snack');
    if (activeFilter === 'Favorit') items = items.filter(i => favorites.includes(i.id));
    return items;
  }, [search, activeFilter, menuItems, selectedStan, favorites]);

  const formatRp = (n) => `Rp ${n.toLocaleString('id-ID')}`;
  const getCartQty = (id) => cart.find(c => c.id === id)?.qty || 0;

  const handleCheckoutSubmit = () => {
    if (cart.length === 0) {
      alert('Keranjang belanja Anda masih kosong.');
      return;
    }
    if (payMethod === 'Saldo KSmart Pay' && balance < cartTotal) {
      alert(`Saldo KSmart Pay tidak mencukupi! Total: ${formatRp(cartTotal)}, Saldo Anda: ${formatRp(balance)}. Silakan pilih metode lain atau Top Up terlebih dahulu.`);
      return;
    }
    const order = checkout(pickupTime, note, payMethod);
    setShowCart(false);
    setCheckoutStep('cart');
    setShowTicket(order);
    setNote('');
  };

  const openStan = (stanName) => {
    setSelectedStan(stanName);
    setView('list');
    setActiveFilter('Semua');
  };

  // ==========================================
  // VIEW 1: CATEGORY GRID (Reference Image 3)
  // ==========================================
  if (view === 'category') {
    return (
      <div className="min-h-full">
        {/* Deep Blue Header — Exact Image 3 Style */}
        <div className="bg-[#2A4BA0] text-white px-5 pt-10 pb-9 rounded-b-[30px] relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-white/90">Kantin SMAK Kesuma</span>
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setView('list'); setSelectedStan(''); }}
                title="Cari Menu"
                className="text-white hover:text-white/80 cursor-pointer"
              >
                <i className="fa-solid fa-magnifying-glass text-lg"></i>
              </button>
              <div
                className="relative cursor-pointer"
                onClick={() => cartCount > 0 && setShowCart(true)}
                title="Keranjang Belanja"
              >
                <i className="fa-solid fa-bag-shopping text-white text-lg"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 w-4.5 h-4.5 bg-[#F9B023] text-[#1B263B] text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-md">
                    {cartCount}
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* Large Bold Heading */}
          <h1 className="text-4xl font-normal tracking-tight text-white/90">Pesan Menu</h1>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mt-1">Stan Kantin</h1>
        </div>

        {/* Categories 2-Column Grid — Exact Image 3 */}
        <div className="px-5 pt-6 pb-28">
          <div className="grid grid-cols-2 gap-4">
            {stanCategories.map((cat) => (
              <button
                key={cat.label}
                onClick={() => openStan(cat.stan)}
                className="bg-white rounded-[26px] p-5 pt-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col items-center text-center hover:shadow-lg hover:border-blue-100 transition active:scale-[0.98] group cursor-pointer"
              >
                {/* Outline Placeholder Icon Container */}
                <div className="w-full h-28 bg-[#F8F9FB] rounded-2xl flex items-center justify-center relative mb-4 group-hover:bg-blue-50/50 transition">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-14 h-14 text-gray-300">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <div className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-xs flex items-center justify-center text-[#2A4BA0]">
                    <i className={`fa-solid ${cat.icon} text-xs`}></i>
                  </div>
                </div>

                <h3 className="font-bold text-gray-800 text-sm tracking-tight">{cat.label}</h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{cat.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Floating Cart Button if has items */}
        {cartCount > 0 && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-5 z-20">
            <button
              onClick={() => setShowCart(true)}
              className="w-full bg-[#2A4BA0] text-white rounded-full py-4 px-6 flex items-center justify-between shadow-xl shadow-[#2A4BA0]/30 hover:bg-[#1E3A8A] transition active:scale-[0.98] cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#F9B023] text-[#1B263B] font-extrabold text-xs flex items-center justify-center">
                  {cartCount}
                </div>
                <span className="font-bold text-sm">Lihat Keranjang</span>
              </div>
              <span className="font-extrabold text-sm">{formatRp(cartTotal)}</span>
            </button>
          </div>
        )}

        {/* Modals */}
        {showCart && (
          <CartModal
            cart={cart}
            cartTotal={cartTotal}
            cartCount={cartCount}
            formatRp={formatRp}
            balance={balance}
            pickupTime={pickupTime}
            setPickupTime={setPickupTime}
            pickupPlace={pickupPlace}
            setPickupPlace={setPickupPlace}
            note={note}
            setNote={setNote}
            payMethod={payMethod}
            setPayMethod={setPayMethod}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
            checkoutStep={checkoutStep}
            setCheckoutStep={setCheckoutStep}
            handleCheckoutSubmit={handleCheckoutSubmit}
            onClose={() => setShowCart(false)}
          />
        )}

        {showTicket && (
          <TicketModal ticket={showTicket} formatRp={formatRp} onClose={() => setShowTicket(null)} />
        )}
      </div>
    );
  }

  // ==========================================
  // VIEW 2: PRODUCT LIST (Reference Image 4)
  // ==========================================
  return (
    <div className="min-h-full">
      {/* White Header — Exact Image 4 Style */}
      <div className="bg-white px-5 pt-8 pb-3 border-b border-gray-100 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setView('category'); setSelectedStan(''); }}
              title="Kembali ke Kategori"
              className="w-10 h-10 rounded-full bg-[#F8F9FB] flex items-center justify-center hover:bg-gray-100 transition cursor-pointer active:scale-95"
            >
              <i className="fa-solid fa-chevron-left text-gray-700 text-sm"></i>
            </button>
            <h1 className="text-base font-bold text-gray-800 tracking-tight">
              {selectedStan || 'Menu Kantin Kesuma'}
            </h1>
          </div>
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => {
                if (view === 'list') {
                  const input = document.getElementById('kantin-search-input');
                  input?.focus();
                }
              }}
              className="text-gray-500 cursor-pointer"
            >
              <i className="fa-solid fa-magnifying-glass text-base"></i>
            </button>
            <div
              className="relative cursor-pointer"
              onClick={() => cartCount > 0 && setShowCart(true)}
              title="Buka Keranjang"
            >
              <i className="fa-solid fa-bag-shopping text-gray-800 text-lg"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 w-4.5 h-4.5 bg-[#F9B023] text-[#1B263B] text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-md">
                  {cartCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar with Clear button */}
        <div className="relative mb-3">
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm"></i>
          <input
            id="kantin-search-input"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nasi, soto, es teh, alat tulis..."
            className="w-full pl-11 pr-9 py-3 bg-[#F8F9FB] rounded-full text-xs text-gray-800 placeholder:text-gray-400 outline-none border border-transparent focus:border-[#2A4BA0]/40 transition"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs cursor-pointer"
            >
              <i className="fa-solid fa-circle-xmark"></i>
            </button>
          )}
        </div>

        {/* Filter Pills Chips — Exact Image 4 (Yellow active pill, white outline inactive) */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-2">
          {filterChips.map((chip) => {
            const isSelected = activeFilter === chip;
            return (
              <button
                key={chip}
                onClick={() => setActiveFilter(chip)}
                className={`px-4.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#F9B023] text-[#1B263B] shadow-md shadow-[#F9B023]/25'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {chip === 'Favorit' ? (
                  <span>
                    <i className="fa-solid fa-heart text-rose-500 mr-1 text-[10px]"></i>
                    Favorit ({favorites.length})
                  </span>
                ) : (
                  chip
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Product Grid — Exact Image 4 */}
      <div className="px-5 pt-4 pb-28">
        <div className="grid grid-cols-2 gap-3.5">
          {filtered.map((item) => {
            const qty = getCartQty(item.id);
            const isFav = favorites.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => setShowDetail(item)}
                className="bg-white rounded-[24px] p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col justify-between cursor-pointer hover:shadow-md hover:border-blue-100 transition group relative"
              >
                {/* Image Placeholder Box */}
                <div className="w-full h-32 bg-[#F8F9FB] rounded-2xl flex items-center justify-center relative mb-3 group-hover:bg-blue-50/40 transition">
                  {/* Outline Image Placeholder Vector (Exact Reference Icon) */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-14 h-14 text-gray-300">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>

                  {/* Top category icon badge */}
                  <div className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow-xs flex items-center justify-center text-[#2A4BA0]">
                    <i className={`fa-solid ${item.icon} text-xs`}></i>
                  </div>

                  {/* Favorite indicator badge if favored */}
                  {isFav && (
                    <div className="absolute top-2 left-2 w-6 h-6 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 text-[10px]">
                      <i className="fa-solid fa-heart"></i>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div>
                  <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">{item.stan}</p>
                </div>

                {/* Price and Circular Plus / Counter Button */}
                <div className="flex items-center justify-between mt-3 pt-1">
                  <span className="text-sm font-extrabold text-[#1B263B]">{formatRp(item.price)}</span>
                  {qty === 0 ? (
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
                  ) : (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-1.5 py-0.5"
                    >
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-gray-600 active:scale-90 cursor-pointer shadow-2xs"
                      >
                        <i className="fa-solid fa-minus text-[8px]"></i>
                      </button>
                      <span className="text-xs font-bold text-[#1B263B] px-1">{qty}</span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-5 h-5 rounded-full bg-[#2A4BA0] text-white flex items-center justify-center active:scale-90 cursor-pointer shadow-2xs"
                      >
                        <i className="fa-solid fa-plus text-[8px]"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-300">
              <i className="fa-solid fa-magnifying-glass text-xl"></i>
            </div>
            <p className="text-sm font-bold text-gray-600">Tidak ada menu yang sesuai</p>
            <p className="text-xs text-gray-400 mt-1">Coba kata kunci lain atau ubah filter kategori</p>
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-5 z-20">
          <button
            onClick={() => setShowCart(true)}
            className="w-full bg-[#2A4BA0] text-white rounded-full py-4 px-6 flex items-center justify-between shadow-xl shadow-[#2A4BA0]/30 hover:bg-[#1E3A8A] transition active:scale-[0.98] cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#F9B023] text-[#1B263B] font-extrabold text-xs flex items-center justify-center">
                {cartCount}
              </div>
              <span className="font-bold text-sm">Lihat Keranjang</span>
            </div>
            <span className="font-extrabold text-sm">{formatRp(cartTotal)}</span>
          </button>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL (Exact Image 5) */}
      {showDetail && (
        <ProductDetailModal
          item={showDetail}
          formatRp={formatRp}
          addToCart={addToCart}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          onClose={() => setShowDetail(null)}
          onBuyNow={(it) => {
            addToCart(it);
            setShowDetail(null);
            setShowCart(true);
          }}
        />
      )}

      {/* SHOPPING CART / CHECKOUT MODAL (Exact Image 6 & 7) */}
      {showCart && (
        <CartModal
          cart={cart}
          cartTotal={cartTotal}
          cartCount={cartCount}
          formatRp={formatRp}
          balance={balance}
          pickupTime={pickupTime}
          setPickupTime={setPickupTime}
          pickupPlace={pickupPlace}
          setPickupPlace={setPickupPlace}
          note={note}
          setNote={setNote}
          payMethod={payMethod}
          setPayMethod={setPayMethod}
          addToCart={addToCart}
          removeFromCart={removeFromCart}
          checkoutStep={checkoutStep}
          setCheckoutStep={setCheckoutStep}
          handleCheckoutSubmit={handleCheckoutSubmit}
          onClose={() => {
            setShowCart(false);
            setCheckoutStep('cart');
          }}
        />
      )}

      {/* ORDER TICKET MODAL */}
      {showTicket && (
        <TicketModal ticket={showTicket} formatRp={formatRp} onClose={() => setShowTicket(null)} />
      )}
    </div>
  );
}

// ==========================================
// COMPONENT: PRODUCT DETAIL (Reference Image 5)
// ==========================================
function ProductDetailModal({ item, formatRp, addToCart, favorites, toggleFavorite, onClose, onBuyNow }) {
  const [openNutri, setOpenNutri] = useState(false);
  const [openReviews, setOpenReviews] = useState(false);
  const isFav = favorites.includes(item.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-[430px] rounded-t-[36px] max-h-[92vh] overflow-y-auto animate-slide-up flex flex-col shadow-2xl">
        {/* Header bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 px-5 pt-4 pb-2 flex items-center justify-between border-b border-gray-50">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#F8F9FB] flex items-center justify-center hover:bg-gray-100 transition cursor-pointer active:scale-90"
          >
            <i className="fa-solid fa-chevron-left text-gray-700 text-sm"></i>
          </button>
          <span className="text-sm font-bold text-gray-800">{item.stan}</span>
          <button
            onClick={() => toggleFavorite(item.id)}
            title={isFav ? 'Hapus Favorit' : 'Tambah Favorit'}
            className="w-10 h-10 rounded-full bg-[#F8F9FB] flex items-center justify-center transition active:scale-90 cursor-pointer"
          >
            <i className={`fa-solid fa-heart ${isFav ? 'text-rose-500' : 'text-gray-300'} text-base`}></i>
          </button>
        </div>

        {/* Big Outline Image Placeholder & Dash Indicators (Exact Image 5) */}
        <div className="px-6 pt-4 pb-2 flex flex-col items-center">
          <div className="w-full h-56 bg-[#F8F9FB] rounded-[30px] flex items-center justify-center relative">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-24 h-24 text-gray-300">
              <rect x="3" y="3" width="18" height="18" rx="4" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <div className="absolute bottom-4 right-4 w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#2A4BA0]">
              <i className={`fa-solid ${item.icon} text-lg`}></i>
            </div>
          </div>

          {/* Dash Pagination (Exact Image 5: orange active dash, 2 gray dashes) */}
          <div className="flex items-center gap-1.5 mt-4">
            <div className="w-6 h-1.5 rounded-full bg-[#F9B023]"></div>
            <div className="w-3.5 h-1.5 rounded-full bg-gray-200"></div>
            <div className="w-3.5 h-1.5 rounded-full bg-gray-200"></div>
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 pt-3 pb-8 flex-1">
          <h2 className="text-2xl font-extrabold text-[#1B263B] leading-tight">{item.name}</h2>

          {/* Price & Badge */}
          <div className="flex items-center gap-3 mt-3">
            <span className="text-xl font-extrabold text-[#2A4BA0]">{formatRp(item.price)}</span>
            <span className="bg-[#1B263B] text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
              Harga Siswa
            </span>
            <span className="text-xs text-gray-400 line-through">
              {formatRp(Math.round(item.price * 1.2))}
            </span>
          </div>

          {/* Stars & Reviews */}
          <div className="flex items-center gap-2 mt-3 text-xs">
            <div className="flex text-[#F9B023]">
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star"></i>
              <i className="fa-solid fa-star-half-stroke"></i>
            </div>
            <span className="font-bold text-gray-700">{item.rating}</span>
            <span className="text-gray-400">&bull; Terfavorit di SMAK Kesuma</span>
          </div>

          {/* Details Section */}
          <div className="mt-5">
            <h4 className="text-sm font-bold text-[#1B263B] mb-2">Details</h4>
            <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
          </div>

          {/* Accordion 1: Estimasi Siap */}
          <div className="border-t border-gray-100 mt-5 pt-3.5">
            <button
              onClick={() => setOpenNutri(!openNutri)}
              className="w-full flex items-center justify-between text-sm font-bold text-[#1B263B] cursor-pointer"
            >
              <span>Waktu Penyajian & Stan</span>
              <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform ${openNutri ? 'rotate-180' : ''}`}></i>
            </button>
            {openNutri && (
              <div className="py-2.5 text-xs text-gray-500 space-y-1">
                <p>&bull; Waktu penyajian: <b>{item.time}</b></p>
                <p>&bull; Kategori menu: <b>{item.category}</b></p>
                <p>&bull; Stan penyedia: <b>{item.stan}</b></p>
              </div>
            )}
          </div>

          {/* Accordion 2: Reviews */}
          <div className="border-t border-gray-100 mt-3.5 pt-3.5">
            <button
              onClick={() => setOpenReviews(!openReviews)}
              className="w-full flex items-center justify-between text-sm font-bold text-[#1B263B] cursor-pointer"
            >
              <span>Ulasan Siswa SMAK Kesuma</span>
              <i className={`fa-solid fa-chevron-down text-xs text-gray-400 transition-transform ${openReviews ? 'rotate-180' : ''}`}></i>
            </button>
            {openReviews && (
              <div className="py-2.5 text-xs text-gray-500 space-y-2">
                <p>&ldquo;Porsinya nampol banget, rasanya pas buat makan siang!&rdquo; &mdash; <b>Michael XII MIPA</b></p>
                <p>&ldquo;Bumbunya meresap dan selalu disajikan higienis.&rdquo; &mdash; <b>Clara XI IPS 1</b></p>
              </div>
            )}
          </div>

          {/* Bottom Dual Action Buttons — Exact Image 5: Add To Cart (Outlined) + Buy Now (Solid Blue) */}
          <div className="flex gap-3 mt-7">
            <button
              onClick={() => {
                addToCart(item);
                onClose();
              }}
              className="flex-1 py-4 rounded-full border-2 border-[#2A4BA0] text-[#2A4BA0] font-bold text-xs hover:bg-[#2A4BA0]/5 transition active:scale-[0.98] cursor-pointer"
            >
              Add To Cart
            </button>
            <button
              onClick={() => onBuyNow(item)}
              className="flex-1 py-4 rounded-full bg-[#2A4BA0] text-white font-bold text-xs hover:bg-[#1E3A8A] shadow-lg shadow-[#2A4BA0]/25 transition active:scale-[0.98] cursor-pointer"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// COMPONENT: SHOPPING CART & ADDRESS MODAL (Image 6 & Image 7)
// ============================================================
function CartModal({
  cart,
  cartTotal,
  cartCount,
  formatRp,
  balance,
  pickupTime,
  setPickupTime,
  pickupPlace,
  setPickupPlace,
  note,
  setNote,
  payMethod,
  setPayMethod,
  addToCart,
  removeFromCart,
  checkoutStep,
  setCheckoutStep,
  handleCheckoutSubmit,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-[430px] rounded-t-[36px] max-h-[92vh] overflow-y-auto animate-slide-up flex flex-col shadow-2xl">
        {/* Top Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md z-10 px-5 pt-4 pb-3 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (checkoutStep === 'address') setCheckoutStep('cart');
                else onClose();
              }}
              className="w-10 h-10 rounded-full bg-[#F8F9FB] flex items-center justify-center hover:bg-gray-100 transition cursor-pointer active:scale-95"
            >
              <i className="fa-solid fa-chevron-left text-gray-700 text-sm"></i>
            </button>
            <h3 className="text-base font-bold text-[#1B263B]">
              {checkoutStep === 'cart' ? `Shopping Cart (${cartCount})` : 'Detail Checkout'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* STEP 1: SHOPPING CART ITEMS (Exact Image 6) */}
        {checkoutStep === 'cart' ? (
          <div className="p-5 flex-1 flex flex-col justify-between">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-300">
                  <i className="fa-solid fa-bag-shopping text-2xl"></i>
                </div>
                <p className="text-sm font-bold text-gray-600">Keranjang masih kosong</p>
                <p className="text-xs text-gray-400 mt-1">Pilih menu kantin lezat sekarang!</p>
              </div>
            ) : (
              <>
                {/* List of Cart Items */}
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div key={item.id} className="py-4 flex items-center gap-4">
                      {/* Outline Image Vector */}
                      <div className="w-14 h-14 bg-[#F8F9FB] rounded-2xl flex items-center justify-center flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" className="w-8 h-8 text-gray-300">
                          <rect x="3" y="3" width="18" height="18" rx="4" />
                          <circle cx="8.5" cy="8.5" r="1.5" />
                          <path d="M21 15l-5-5L5 21" />
                        </svg>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-800 truncate">{item.name}</h4>
                        <p className="text-xs font-semibold text-gray-500 mt-0.5">{formatRp(item.price)}</p>
                      </div>

                      {/* Quantity Stepper: circular subtle buttons */}
                      <div className="flex items-center gap-3 bg-[#F8F9FB] rounded-full px-2 py-1 border border-gray-100">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-600 shadow-2xs active:scale-90 cursor-pointer"
                        >
                          <i className="fa-solid fa-minus text-[9px]"></i>
                        </button>
                        <span className="text-xs font-bold text-gray-800 w-4 text-center">{item.qty}</span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-600 shadow-2xs active:scale-90 cursor-pointer"
                        >
                          <i className="fa-solid fa-plus text-[9px]"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Summary Sheet Card (Exact Image 6) */}
                <div className="mt-6 bg-[#F8F9FB] rounded-[26px] p-5 border border-gray-100">
                  <div className="space-y-2.5 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal ({cartCount} item)</span>
                      <span className="font-bold text-gray-800">{formatRp(cartTotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Biaya Pengambilan</span>
                      <span className="font-bold text-emerald-600">Gratis (Rp 0)</span>
                    </div>
                    <div className="border-t border-gray-200/60 pt-2.5 flex justify-between">
                      <span className="font-extrabold text-[#1B263B]">Total</span>
                      <span className="font-extrabold text-[#2A4BA0] text-lg">{formatRp(cartTotal)}</span>
                    </div>
                  </div>

                  {/* Proceed to Checkout Button */}
                  <button
                    onClick={() => setCheckoutStep('address')}
                    className="w-full bg-[#2A4BA0] text-white py-4 rounded-full font-bold text-xs mt-5 shadow-lg shadow-[#2A4BA0]/25 hover:bg-[#1E3A8A] active:scale-[0.98] transition cursor-pointer"
                  >
                    Proceed To Checkout &rarr;
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          /* STEP 2: DELIVERY ADDRESS & PAYMENT (Exact Image 7) */
          <div className="p-5 flex-1 space-y-5">
            <div>
              <h4 className="text-sm font-bold text-[#1B263B] mb-2.5">Waktu Pengambilan di Kantin</h4>

              {/* Address Card 1: Istirahat 1 (Selected Style with Yellow Border) */}
              <div
                onClick={() => setPickupTime('Istirahat 1 (09.30 - 10.00)')}
                className={`p-4 rounded-[22px] border-2 transition cursor-pointer mb-2.5 relative ${
                  pickupTime.includes('09.30')
                    ? 'border-[#F9B023] bg-amber-50/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-gray-800">Istirahat 1 (09.30 - 10.00)</h5>
                    <p className="text-xs text-gray-500 mt-1">{pickupPlace} &bull; Antrean A</p>
                  </div>
                  {pickupTime.includes('09.30') ? (
                    <div className="w-5 h-5 rounded-full bg-[#F9B023] text-white flex items-center justify-center text-xs">
                      <i className="fa-solid fa-check text-[10px]"></i>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-[#2A4BA0] block mt-1.5">Paling Awal</span>
              </div>

              {/* Address Card 2: Istirahat 2 */}
              <div
                onClick={() => setPickupTime('Istirahat 2 (12.00 - 12.45)')}
                className={`p-4 rounded-[22px] border-2 transition cursor-pointer relative ${
                  pickupTime.includes('12.00')
                    ? 'border-[#F9B023] bg-amber-50/20'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className="font-bold text-sm text-gray-800">Istirahat 2 (12.00 - 12.45)</h5>
                    <p className="text-xs text-gray-500 mt-1">{pickupPlace} &bull; Jam Makan Siang</p>
                  </div>
                  {pickupTime.includes('12.00') ? (
                    <div className="w-5 h-5 rounded-full bg-[#F9B023] text-white flex items-center justify-center text-xs">
                      <i className="fa-solid fa-check text-[10px]"></i>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                  )}
                </div>
                <span className="text-[10px] font-bold text-gray-400 block mt-1.5">Makan Siang</span>
              </div>

              {/* Dashed "+ Add Note" Button — Exact Image 7 Dashed Style */}
              <div className="mt-3.5">
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="+ Tulis Catatan Pesanan (misal: Jangan terlalu pedas ya bu)"
                  className="w-full p-3.5 border border-dashed border-gray-300 rounded-[20px] text-xs text-gray-700 outline-none focus:border-[#2A4BA0] font-medium text-center placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <h4 className="text-sm font-bold text-[#1B263B] mb-2">Metode Pembayaran</h4>
              <div className="space-y-2">
                {[
                  { id: 'Saldo KSmart Pay', desc: `Saldo Anda: ${formatRp(balance)}`, icon: 'fa-wallet' },
                  { id: 'QRIS Sekolah', desc: 'Scan QR di Stan Kantin SMAK Kesuma', icon: 'fa-qrcode' },
                ].map((pm) => (
                  <div
                    key={pm.id}
                    onClick={() => setPayMethod(pm.id)}
                    className={`p-3.5 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition ${
                      payMethod === pm.id
                        ? 'border-[#F9B023] bg-amber-50/20'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#2A4BA0]/10 text-[#2A4BA0] flex items-center justify-center">
                        <i className={`fa-solid ${pm.icon} text-sm`}></i>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{pm.id}</p>
                        <p className="text-[10px] text-gray-400">{pm.desc}</p>
                      </div>
                    </div>
                    {payMethod === pm.id && (
                      <div className="w-5 h-5 rounded-full bg-[#F9B023] text-white flex items-center justify-center">
                        <i className="fa-solid fa-check text-[10px]"></i>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Checkout Button — Exact Image 7 solid blue button */}
            <div className="pt-2">
              <button
                onClick={handleCheckoutSubmit}
                className="w-full bg-[#2A4BA0] text-white py-4 rounded-full font-bold text-xs shadow-xl shadow-[#2A4BA0]/25 hover:bg-[#1E3A8A] active:scale-[0.98] transition cursor-pointer"
              >
                Konfirmasi & Bayar Pesanan &bull; {formatRp(cartTotal)}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// COMPONENT: ORDER TICKET MODAL WITH REAL QR
// ==========================================
function TicketModal({ ticket, formatRp, onClose }) {
  const qrData = `KSMART:SMAK-KESUMA-MATARAM:${ticket.id}:TOTAL-${ticket.total}:WAKTU-${ticket.pickupTime}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-5">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-[380px] rounded-[32px] overflow-hidden animate-slide-up shadow-2xl">
        {/* Ticket Header */}
        <div className="bg-[#2A4BA0] text-white text-center py-7 px-5">
          <div className="w-13 h-13 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 text-xl">
            <i className="fa-solid fa-check text-white"></i>
          </div>
          <h3 className="text-lg font-bold">Pesanan Terkonfirmasi!</h3>
          <p className="text-xs text-white/75 mt-0.5">Kantin SMA Katolik Kesuma Mataram</p>
        </div>

        {/* Ticket Body with Notches */}
        <div className="p-6 space-y-4">
          <div className="text-center">
            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">KODE TIKET PESANAN</span>
            <p className="text-2xl font-black text-[#1B263B] tracking-wider mt-0.5">{ticket.id}</p>
          </div>

          {/* REAL QR Code Image */}
          <div className="w-36 h-36 mx-auto bg-[#F8F9FB] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 p-2 relative overflow-hidden">
            <img
              src={qrUrl}
              alt="QR Code Tiket"
              className="w-full h-full object-contain"
              onError={(e) => {
                // Fallback icon if offline
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{ display: 'none' }} className="text-center">
              <i className="fa-solid fa-qrcode text-5xl text-gray-400"></i>
              <span className="text-[8px] font-bold text-gray-400 mt-1 uppercase block">Scan Kasir</span>
            </div>
          </div>

          <div className="bg-[#F8F9FB] rounded-2xl p-4 text-xs space-y-2">
            {ticket.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-gray-600">
                <span>{it.qty}x {it.name}</span>
                <span className="font-bold text-gray-800">{formatRp(it.price * it.qty)}</span>
              </div>
            ))}
            <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm">
              <span>Total Bayar</span>
              <span className="text-[#2A4BA0]">{formatRp(ticket.total)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-blue-50/70 p-2.5 rounded-xl">
              <span className="text-[10px] text-gray-400 font-semibold block">JAM AMBIL</span>
              <span className="font-bold text-[#2A4BA0] text-[11px] truncate block">{ticket.pickupTime.split(' ')[0]}</span>
            </div>
            <div className="bg-amber-50/70 p-2.5 rounded-xl">
              <span className="text-[10px] text-gray-400 font-semibold block">STATUS</span>
              <span className="font-bold text-[#F9B023] text-[11px] block">{ticket.status}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#2A4BA0] text-white py-3.5 rounded-full font-bold text-xs hover:bg-[#1E3A8A] transition active:scale-[0.98] cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
