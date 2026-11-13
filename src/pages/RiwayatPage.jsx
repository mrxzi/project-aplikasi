import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function RiwayatPage({ setTab }) {
  const { student, orders, sppHistory } = useApp();
  const [filter, setFilter] = useState('Semua');
  const [showDetail, setShowDetail] = useState(null);

  const formatRp = (n) => `Rp ${n.toLocaleString('id-ID')}`;

  const allHistory = [
    ...orders.map(o => ({ ...o, sortDate: o.date })),
    ...sppHistory.map(s => ({ ...s, sortDate: s.date })),
  ];

  const filtered = filter === 'Semua' ? allHistory :
    filter === 'Jajan Kantin' ? allHistory.filter(h => h.type === 'kantin') :
    allHistory.filter(h => h.type === 'spp');

  const tabs = [
    { label: 'Semua' },
    { label: 'Jajan Kantin' },
    { label: 'Pembayaran SPP' },
  ];

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-full pb-28">
      {/* White Clean Header — Reference Image 4 Style */}
      <div className="bg-white px-5 pt-8 pb-3 border-b border-gray-100 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTab && setTab('beranda')}
              title="Kembali ke Beranda"
              className="w-10 h-10 rounded-full bg-[#F8F9FB] flex items-center justify-center hover:bg-gray-100 transition cursor-pointer active:scale-95"
            >
              <i className="fa-solid fa-chevron-left text-gray-700 text-sm"></i>
            </button>
            <div>
              <h1 className="text-base font-bold text-gray-800 tracking-tight">Riwayat Transaksi</h1>
              <p className="text-[10px] text-gray-400 font-medium">{student.school}</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#F8F9FB] flex items-center justify-center text-gray-500">
            <i className="fa-solid fa-clock-rotate-left text-sm"></i>
          </div>
        </div>

        {/* Filter Chips — Reference Image 4 Style */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-5 px-5 pb-2">
          {tabs.map((tabItem) => {
            const isSelected = filter === tabItem.label;
            return (
              <button
                key={tabItem.label}
                onClick={() => setFilter(tabItem.label)}
                className={`px-4.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#F9B023] text-[#1B263B] shadow-md shadow-[#F9B023]/25'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {tabItem.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transaction Items List (Reference Image 6 Style) */}
      <div className="px-5 pt-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3 text-gray-300">
              <i className="fa-solid fa-receipt text-2xl"></i>
            </div>
            <p className="text-sm font-bold text-gray-600">Belum ada transaksi</p>
            <p className="text-xs text-gray-400 mt-1">Transaksi jajan kantin & bayar SPP akan tercatat di sini</p>
          </div>
        ) : (
          filtered.map((item, idx) => {
            const isKantin = item.type === 'kantin';
            return (
              <div
                key={`${item.id || item.month}-${idx}`}
                onClick={() => setShowDetail(item)}
                className="bg-white rounded-[24px] p-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] border border-gray-100 flex items-center justify-between cursor-pointer hover:shadow-md hover:border-blue-100 transition active:scale-[0.99]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Outline vector / icon box */}
                  <div className="w-12 h-12 rounded-2xl bg-[#F8F9FB] border border-gray-100 flex items-center justify-center flex-shrink-0 text-[#2A4BA0]">
                    <i className={`fa-solid ${isKantin ? 'fa-utensils' : 'fa-receipt'} text-base`}></i>
                  </div>

                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-gray-800 truncate">
                      {isKantin ? `Kantin ${item.id}` : `SPP ${item.month} ${item.year}`}
                    </h4>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {item.date} &bull; {item.payMethod}
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 pl-3">
                  <p className="text-sm font-extrabold text-[#1B263B]">
                    {formatRp(isKantin ? item.total : item.amount)}
                  </p>
                  <span
                    className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full mt-1 ${
                      isKantin
                        ? item.status === 'Selesai'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-amber-50 text-[#F9B023]'
                        : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {isKantin ? item.status : 'Lunas'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detail Modal (Ticket or Receipt) */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowDetail(null)}></div>
          <div className="relative bg-white w-full max-w-[390px] rounded-[32px] overflow-hidden animate-slide-up shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-[#2A4BA0] text-white text-center py-7 px-5">
              <div className="w-13 h-13 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2 text-xl">
                <i className={`fa-solid ${showDetail.type === 'kantin' ? 'fa-qrcode' : 'fa-receipt'}`}></i>
              </div>
              <h3 className="text-lg font-bold">
                {showDetail.type === 'kantin' ? 'Tiket Pengambilan Pesanan' : 'Kuitansi Resmi SPP'}
              </h3>
              <p className="text-xs text-white/75 mt-0.5">
                {student.school} &bull; Terverifikasi
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {showDetail.type === 'kantin' ? (
                <>
                  <div className="text-center">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">KODE PESANAN</span>
                    <p className="text-2xl font-black text-[#1B263B] tracking-wider mt-0.5">{showDetail.id}</p>
                  </div>

                  {/* REAL QR Code */}
                  <div className="w-36 h-36 mx-auto bg-[#F8F9FB] rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-gray-200 p-2">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`KSMART:SMAK-KESUMA:${showDetail.id}:TOTAL-${showDetail.total}`)}`}
                      alt="QR Code"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'block';
                      }}
                    />
                    <div style={{ display: 'none' }} className="text-center">
                      <i className="fa-solid fa-qrcode text-5xl text-gray-400"></i>
                    </div>
                  </div>

                  <div className="bg-[#F8F9FB] rounded-2xl p-4 text-xs space-y-2">
                    {showDetail.items?.map((it, idx) => (
                      <div key={idx} className="flex justify-between text-gray-600">
                        <span>{it.qty}x {it.name}</span>
                        <span className="font-bold text-gray-800">{formatRp(it.price * it.qty)}</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-sm">
                      <span>Total Bayar</span>
                      <span className="text-[#2A4BA0]">{formatRp(showDetail.total)}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-xs">
                    <div className="bg-blue-50/70 p-2.5 rounded-xl">
                      <span className="text-[10px] text-gray-400 font-semibold block">AMBIL JAM</span>
                      <span className="font-bold text-[#2A4BA0] text-[11px] truncate block">{showDetail.pickupTime}</span>
                    </div>
                    <div className="bg-amber-50/70 p-2.5 rounded-xl">
                      <span className="text-[10px] text-gray-400 font-semibold block">STATUS</span>
                      <span className="font-bold text-[#F9B023] text-[11px] block">{showDetail.status}</span>
                    </div>
                  </div>

                  {showDetail.note && showDetail.note !== '-' && (
                    <div className="bg-gray-50 p-3 rounded-xl text-xs text-gray-600">
                      <span className="font-bold block text-gray-700">Catatan Pesanan:</span>
                      <span>{showDetail.note}</span>
                    </div>
                  )}
                </>
              ) : (
                /* SPP OFFICIAL RECEIPT VIEW */
                <div className="space-y-3">
                  <div className="text-center border-b border-gray-200 pb-2.5">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">YAYASAN INSAN MANDIRI</p>
                    <h4 className="font-bold text-sm text-[#1B263B]">SMA KATOLIK KESUMA MATARAM</h4>
                    <p className="text-[9px] text-gray-400 font-mono mt-0.5">No: {showDetail.id}</p>
                  </div>

                  <div className="bg-[#F8F9FB] rounded-[20px] p-4 space-y-2 text-xs border border-gray-100">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tagihan SPP</span>
                      <span className="font-bold text-gray-800">{showDetail.month} {showDetail.year}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Nominal</span>
                      <span className="font-bold text-gray-800">{formatRp(showDetail.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Metode Bayar</span>
                      <span className="font-bold text-gray-800">{showDetail.payMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tanggal Bayar</span>
                      <span className="font-bold text-gray-800">{showDetail.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nama Siswa</span>
                      <span className="font-bold text-gray-800">{student.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">NIS / Kelas</span>
                      <span className="font-bold text-gray-800">{student.nis} / {student.grade}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                      <span className="text-gray-400">Status</span>
                      <span className="text-[10px] font-black tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                        LUNAS &bull; SAH
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={() => setShowDetail(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold text-xs rounded-full hover:bg-gray-200 cursor-pointer"
                >
                  Tutup
                </button>
                <button
                  onClick={printReceipt}
                  className="flex-1 bg-[#2A4BA0] text-white py-3 rounded-full font-bold text-xs hover:bg-[#1E3A8A] transition flex items-center justify-center gap-1.5 shadow-md shadow-[#2A4BA0]/20 cursor-pointer"
                >
                  <i className="fa-solid fa-print text-xs"></i>
                  <span>Cetak</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
