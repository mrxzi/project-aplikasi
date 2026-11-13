import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const initialMenuItems = [
  {
    id: 1,
    name: 'Nasi Campur Spesial Kesuma',
    stan: 'Stan Bu Maria',
    category: 'Makanan Berat',
    price: 15000,
    time: '5-7 mnt',
    icon: 'fa-plate-wheat',
    rating: 4.9,
    desc: 'Menu favorit siswa SMAK Kesuma! Nasi putih pulen dengan lauk ayam suwir bumbu merah, telur balado, tempe orek manis, mie goreng gurih, dan sambal khas Bu Maria.'
  },
  {
    id: 2,
    name: 'Ayam Geprek Sambal Bawang',
    stan: 'Stan Bu Maria',
    category: 'Makanan Berat',
    price: 14000,
    time: '8-10 mnt',
    icon: 'fa-drumstick-bite',
    rating: 4.8,
    desc: 'Ayam crispy renyah digeprek dengan cabai rawit segar dan bawang putih pilihan. Tingkat kepedasan bisa request di catatan pesanan.'
  },
  {
    id: 3,
    name: 'Mie Ayam Bakso Urat',
    stan: 'Stan Bu Maria',
    category: 'Makanan Berat',
    price: 13000,
    time: '6-8 mnt',
    icon: 'fa-bowl-food',
    rating: 4.7,
    desc: 'Mie kenyal dengan potongan daging ayam bumbu kecap manis gurih, ditambah 2 butir bakso urat sapi dan kuah kaldu hangat yang sedap.'
  },
  {
    id: 4,
    name: 'Soto Ayam Lamongan + Nasi',
    stan: 'Stan Bu Maria',
    category: 'Makanan Berat',
    price: 12000,
    time: '5 mnt',
    icon: 'fa-bowl-rice',
    rating: 4.6,
    desc: 'Soto ayam berkuah kuning kaya rempah dengan taburan koya gurih, suwiran ayam, soun, tauge, dan perasan jeruk nipis segar.'
  },
  {
    id: 5,
    name: 'Es Teh Melati Jumbo',
    stan: 'Kedai Minuman Segar',
    category: 'Minuman',
    price: 4000,
    time: '2 mnt',
    icon: 'fa-glass-water',
    rating: 4.9,
    desc: 'Pereda dahaga terbaik setelah pelajaran olahraga! Racikan teh melati wangi dengan rasa manis pas dan es batu higienis.'
  },
  {
    id: 6,
    name: 'Es Jeruk Peras Asli',
    stan: 'Kedai Minuman Segar',
    category: 'Minuman',
    price: 6000,
    time: '3 mnt',
    icon: 'fa-lemon',
    rating: 4.7,
    desc: 'Jeruk peras murni tanpa pemanis buatan, kaya vitamin C untuk menjaga daya tahan tubuh siswa selama jam belajar.'
  },
  {
    id: 7,
    name: 'Kopi Susu Gula Aren Kesuma',
    stan: 'Kedai Minuman Segar',
    category: 'Minuman',
    price: 9000,
    time: '3 mnt',
    icon: 'fa-mug-saucer',
    rating: 4.8,
    desc: 'Kopi espresso dengan susu segar dan sirup gula aren asli. Pas untuk menambah fokus saat jam belajar siang.'
  },
  {
    id: 8,
    name: 'Thai Tea Creamy',
    stan: 'Kedai Minuman Segar',
    category: 'Minuman',
    price: 8000,
    time: '3 mnt',
    icon: 'fa-mug-hot',
    rating: 4.8,
    desc: 'Daun teh Thailand berkualitas diseduh pekat berpadu dengan susu evaporasi manis dan lembut.'
  },
  {
    id: 9,
    name: 'Risoles Mayo Keju (2 pcs)',
    stan: 'Snack & Jajanan Kesuma',
    category: 'Snack',
    price: 6000,
    time: '2 mnt',
    icon: 'fa-cookie',
    rating: 4.8,
    desc: 'Kulit risoles renyah dengan isian smoked beef, telur rebus, keju leleh, dan saus mayonnaise gurih nikmat.'
  },
  {
    id: 10,
    name: 'Cireng Crispy Bumbu Rujak',
    stan: 'Snack & Jajanan Kesuma',
    category: 'Snack',
    price: 7000,
    time: '5 mnt',
    icon: 'fa-cookie-bite',
    rating: 4.6,
    desc: 'Cireng tapioka kenyal berbalut tepung renyah, disajikan hangat dengan cocolan saus gula merah cabai rawit.'
  },
  {
    id: 11,
    name: 'Batagor Bumbu Kacang',
    stan: 'Snack & Jajanan Kesuma',
    category: 'Snack',
    price: 8000,
    time: '5 mnt',
    icon: 'fa-stroopwafel',
    rating: 4.7,
    desc: 'Bakso tahu goreng ikan tenggiri garing di luar, empuk di dalam, disiram bumbu kacang kental khas Bandung.'
  },
  {
    id: 12,
    name: 'Buku Tulis Sidu 58 Lbr',
    stan: 'Koperasi Siswa Kesuma',
    category: 'Koperasi',
    price: 5000,
    time: '1 mnt',
    icon: 'fa-book',
    rating: 4.5,
    desc: 'Buku tulis bergaris ukuran standar 58 lembar dengan kertas tebal putih halus tidak tembus tinta.'
  },
  {
    id: 13,
    name: 'Pulpen Pilot G2 0.5mm Hitam',
    stan: 'Koperasi Siswa Kesuma',
    category: 'Koperasi',
    price: 4000,
    time: '1 mnt',
    icon: 'fa-pen',
    rating: 4.6,
    desc: 'Pulpen gel hitam berkualitas dengan grip karet nyaman, tinta pekat mengalir lancar untuk ujian dan catatan.'
  },
  {
    id: 14,
    name: 'Dasi SMAK Kesuma Mataram',
    stan: 'Koperasi Siswa Kesuma',
    category: 'Koperasi',
    price: 15000,
    time: '1 mnt',
    icon: 'fa-user-tie',
    rating: 4.9,
    desc: 'Dasi resmi seragam sekolah dengan bordir logo resmi SMA Katolik Kesuma Mataram kualitas premium.'
  }
];

const initialSppData = [
  { month: 'Juli', year: 2026, amount: 350000, status: 'lunas', paidDate: '10 Juli 2026', ref: 'KSM-SPP-2607101' },
  { month: 'Agustus', year: 2026, amount: 350000, status: 'lunas', paidDate: '8 Agustus 2026', ref: 'KSM-SPP-2608082' },
  { month: 'September', year: 2026, amount: 350000, status: 'lunas', paidDate: '12 September 2026', ref: 'KSM-SPP-2609123' },
  { month: 'Oktober', year: 2026, amount: 350000, status: 'lunas', paidDate: '7 Oktober 2026', ref: 'KSM-SPP-2610074' },
  { month: 'November', year: 2026, amount: 350000, status: 'belum' },
  { month: 'Desember', year: 2026, amount: 350000, status: 'belum' },
];

const AppContext = createContext();

export function AppProvider({ children }) {
  // Official School & Student Profile
  const student = {
    name: 'Rafi Andhika Pratama',
    nis: '2026.07.0142',
    nisn: '0087452190',
    grade: 'XII MIPA 1',
    school: 'SMAK Kesuma Mataram',
    address: 'Jl. Pejanggik No. 110, Cakranegara, Kota Mataram, NTB',
    email: 'rafi.andhika@smakkesuma.sch.id',
    avatarLetter: 'R'
  };

  // LocalStorage helper for REAL persistence
  const getStored = (key, fallback) => {
    try {
      const val = localStorage.getItem(`ksmart_${key}`);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  };

  const [balance, setBalance] = useState(() => getStored('balance', 85000));
  const [cart, setCart] = useState(() => getStored('cart', []));
  const [sppData, setSppData] = useState(() => getStored('sppData', initialSppData));
  const [favorites, setFavorites] = useState(() => getStored('favorites', [1, 5]));
  const [pickupPlace, setPickupPlace] = useState(() => getStored('pickupPlace', 'Kantin Utama Depan Lapangan'));
  const [pickupTime, setPickupTime] = useState(() => getStored('pickupTime', 'Istirahat 1 (09.30 - 10.00)'));
  const [toast, setToast] = useState(null);

  const [orders, setOrders] = useState(() =>
    getStored('orders', [
      {
        id: '#KSM-201',
        type: 'kantin',
        school: 'SMAK Kesuma Mataram',
        items: [
          { name: 'Nasi Campur Spesial Kesuma', qty: 1, price: 15000, icon: 'fa-plate-wheat' },
          { name: 'Es Teh Melati Jumbo', qty: 1, price: 4000, icon: 'fa-glass-water' }
        ],
        total: 19000,
        date: '10 Nov 2026',
        time: '09:30',
        status: 'Selesai',
        payMethod: 'Saldo KSmart Pay',
        pickupTime: 'Istirahat 1 (09.30 - 10.00)',
        pickupPlace: 'Kantin Utama Depan Lapangan',
        note: 'Sambal dipisah ya bu'
      },
      {
        id: '#KSM-200',
        type: 'kantin',
        school: 'SMAK Kesuma Mataram',
        items: [
          { name: 'Ayam Geprek Sambal Bawang', qty: 1, price: 14000, icon: 'fa-drumstick-bite' },
          { name: 'Thai Tea Creamy', qty: 1, price: 8000, icon: 'fa-mug-hot' }
        ],
        total: 22000,
        date: '8 Nov 2026',
        time: '12:00',
        status: 'Selesai',
        payMethod: 'Saldo KSmart Pay',
        pickupTime: 'Istirahat 2 (12.00 - 12.45)',
        pickupPlace: 'Kantin Utama Depan Lapangan',
        note: 'Sedang pedasnya'
      },
    ])
  );

  const [sppHistory, setSppHistory] = useState(() =>
    getStored('sppHistory', [
      { id: 'SPP-OKT-2026', type: 'spp', month: 'Oktober', year: 2026, amount: 350000, date: '7 Oktober 2026', payMethod: 'Saldo KSmart Pay', school: 'SMAK Kesuma Mataram' },
      { id: 'SPP-SEP-2026', type: 'spp', month: 'September', year: 2026, amount: 350000, date: '12 September 2026', payMethod: 'Virtual Account BNI', school: 'SMAK Kesuma Mataram' },
      { id: 'SPP-AGU-2026', type: 'spp', month: 'Agustus', year: 2026, amount: 350000, date: '8 Agustus 2026', payMethod: 'Saldo KSmart Pay', school: 'SMAK Kesuma Mataram' },
      { id: 'SPP-JUL-2026', type: 'spp', month: 'Juli', year: 2026, amount: 350000, date: '10 Juli 2026', payMethod: 'QRIS Sekolah', school: 'SMAK Kesuma Mataram' },
    ])
  );

  const [activeOrder, setActiveOrder] = useState(() => getStored('activeOrder', null));
  const [notifications, setNotifications] = useState(3);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ksmart_balance', JSON.stringify(balance));
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('ksmart_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ksmart_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ksmart_sppData', JSON.stringify(sppData));
  }, [sppData]);

  useEffect(() => {
    localStorage.setItem('ksmart_sppHistory', JSON.stringify(sppHistory));
  }, [sppHistory]);

  useEffect(() => {
    localStorage.setItem('ksmart_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('ksmart_activeOrder', JSON.stringify(activeOrder));
  }, [activeOrder]);

  useEffect(() => {
    localStorage.setItem('ksmart_pickupPlace', JSON.stringify(pickupPlace));
  }, [pickupPlace]);

  useEffect(() => {
    localStorage.setItem('ksmart_pickupTime', JSON.stringify(pickupTime));
  }, [pickupTime]);

  // Toast notification helper
  const showToast = useCallback((message, icon = 'fa-circle-check') => {
    setToast({ message, icon });
    setTimeout(() => {
      setToast(null);
    }, 2400);
  }, []);

  // Cart operations
  const addToCart = useCallback((item) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) {
        return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    showToast(`"${item.name}" ditambah ke keranjang`);
  }, [showToast]);

  const removeFromCart = useCallback((itemId) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === itemId);
      if (existing && existing.qty > 1) {
        return prev.map(c => c.id === itemId ? { ...c, qty: c.qty - 1 } : c);
      }
      return prev.filter(c => c.id !== itemId);
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    showToast('Keranjang telah dikosongkan', 'fa-trash-can');
  }, [showToast]);

  // Favorites toggle
  const toggleFavorite = useCallback((itemId) => {
    setFavorites(prev => {
      const isFav = prev.includes(itemId);
      const next = isFav ? prev.filter(id => id !== itemId) : [...prev, itemId];
      showToast(isFav ? 'Dihapus dari favorit' : 'Ditambahkan ke favorit', isFav ? 'fa-heart-crack' : 'fa-heart');
      return next;
    });
  }, [showToast]);

  // Top Up balance
  const topUp = useCallback((amount) => {
    setBalance(prev => prev + amount);
    showToast(`Top up Rp ${amount.toLocaleString('id-ID')} berhasil!`, 'fa-wallet');
  }, [showToast]);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Real Checkout process
  const checkout = useCallback((pTime, note, payMethod) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    const orderNum = 202 + orders.length;

    const newOrder = {
      id: `#KSM-${orderNum}`,
      type: 'kantin',
      school: 'SMAK Kesuma Mataram',
      items: cart.map(c => ({ name: c.name, qty: c.qty, price: c.price, icon: c.icon })),
      total: cartTotal,
      date: dateStr,
      time: timeStr,
      status: 'Sedang Disiapkan',
      payMethod,
      pickupTime: pTime || pickupTime,
      pickupPlace,
      note: note || '-',
    };

    if (payMethod === 'Saldo KSmart Pay') {
      setBalance(prev => prev - cartTotal);
    }

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrder(newOrder);
    setCart([]);
    showToast(`Pesanan ${newOrder.id} berhasil dibuat!`, 'fa-circle-check');
    return newOrder;
  }, [cart, cartTotal, orders.length, pickupPlace, pickupTime, showToast]);

  // Real Pay SPP process
  const paySpp = useCallback((selectedMonths, payMethod) => {
    const total = selectedMonths.length * 350000;
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    if (payMethod === 'Saldo KSmart Pay') {
      setBalance(prev => prev - total);
    }

    setSppData(prev =>
      prev.map(s =>
        selectedMonths.includes(s.month)
          ? {
              ...s,
              status: 'lunas',
              paidDate: dateStr,
              ref: `KSM-SPP-${Date.now().toString().slice(-7)}`
            }
          : s
      )
    );

    const newHistory = selectedMonths.map(month => ({
      id: `SPP-${month.substring(0, 3).toUpperCase()}-2026`,
      type: 'spp',
      month,
      year: 2026,
      amount: 350000,
      date: dateStr,
      payMethod,
      school: 'SMAK Kesuma Mataram'
    }));

    setSppHistory(prev => [...newHistory, ...prev]);
    showToast(`SPP ${selectedMonths.join(', ')} lunas dibayar!`, 'fa-circle-check');
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        student,
        balance,
        topUp,
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        cartTotal,
        cartCount,
        menuItems: initialMenuItems,
        sppData,
        paySpp,
        orders,
        sppHistory,
        activeOrder,
        setActiveOrder,
        checkout,
        notifications,
        setNotifications,
        favorites,
        toggleFavorite,
        pickupPlace,
        setPickupPlace,
        pickupTime,
        setPickupTime,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
