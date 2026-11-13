import { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function SppPage({ setTab }) {
  const { student, sppData, paySpp, balance, showToast } = useApp();
  const [selected, setSelected] = useState([]);
  const [showPayModal, setShowPayModal] = useState(false);
  const [payMethod, setPayMethod] = useState('Saldo KSmart Pay');
  const [paySuccess, setPaySuccess] = useState(null);
  const [showReceipt, setShowReceipt] = useState(null);

  const formatRp = (n) => `Rp ${n.toLocaleString('id-ID')}`;
  const unpaid = sppData.filter(s => s.status === 'belum');
  const totalTagihan = unpaid.reduce((sum, s) => sum + s.amount, 0);
  const selectedTotal = selected.length * 350000;

  const toggleSelect = (month) => {
    if (sppData.find(s => s.month === month)?.status === 'lunas') return;
    setSelected(prev =>
      prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
    );
  };

  const handlePay = () => {
    if (selected.length === 0) {
      alert('Pilih minimal satu bulan SPP untuk dibayar.');
      return;
    }
    if (payMethod === 'Saldo KSmart Pay' && balance < selectedTotal) {
      const kurang = selectedTotal - balance;
      alert(`Saldo KSmart Pay tidak mencukupi! Kurang ${formatRp(kurang)}. Silakan Top Up terlebih dahulu atau pilih metode Virtual Account / QRIS.`);
      return;
    }
    paySpp(selected, payMethod);
    setPaySuccess(selected);
    setSelected([]);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div className="min-h-full pb-28">
      {/* Deep Blue Header — Reference Image 2 & 3 */}
      <div className="bg-[#2A4BA0] text-white px-5 pt-8 pb-8 rounded-b-[30px] relative overflow-hidden shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTab && setTab('beranda')}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition cursor-pointer active:scale-95"
            >
              <i className="fa-solid fa-chevron-left text-white text-sm"></i>
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Pembayaran SPP</h1>
              <p className="text-blue-100/75 text-xs font-normal">{student.school} &bull; 2026/2027</p>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <i className="fa-solid fa-graduation-cap text-white text-base"></i>
          </div>
        </div>

        {/* Tagihan Summary Card inside header */}
        <div className="bg-[#153075] rounded-[24px] p-5 text-white flex items-center justify-between shadow-inner border border-white/10">
          <div>
            <span className="text-[10px] text-white/60 uppercase font-bold tracking-wider">TOTAL TAGIHAN AKTIF</span>
            <p className="text-2xl font-black mt-0.5">{formatRp(totalTagihan)}</p>
            <p className="text-xs text-white/70 mt-1">
              {unpaid.length} bulan belum lunas (Rp 350.000 / bln)
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-[#F9B023]">
            <i className="fa-solid fa-file-invoice-dollar text-2xl"></i>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="px-5 pt-6 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[#1B263B]">Pilih Bulan Tagihan SPP</h3>
            <span className="text-xs text-gray-400 font-medium">Centang untuk bayar</span>
          </div>

          {/* SPP Month Cards (Exact Image 7 selection style: yellow border when selected) */}
          <div className="space-y-3">
            {sppData.map((item) => {
              const isLunas = item.status === 'lunas';
              const isSelected = selected.includes(item.month);

              return (
                <div
                  key={item.month}
                  onClick={() => toggleSelect(item.month)}
                  className={`p-4 rounded-[22px] border-2 transition relative ${
                    isLunas
                      ? 'bg-white border-gray-100 opacity-85 cursor-default'
                      : isSelected
                      ? 'border-[#F9B023] bg-amber-50/20 cursor-pointer shadow-sm'
                      : 'bg-white border-gray-200 hover:border-gray-300 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      {/* Checkbox Icon */}
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isLunas
                            ? 'bg-emerald-500 text-white'
                            : isSelected
                            ? 'bg-[#F9B023] text-white shadow-xs'
                            : 'border-2 border-gray-300'
                        }`}
                      >
                        {(isLunas || isSelected) && <i className="fa-solid fa-check text-[10px]"></i>}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-800">
                          SPP {item.month} {item.year}
                        </h4>
                        <p className="text-xs font-semibold text-gray-500 mt-0.5">
                          {formatRp(item.amount)}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="text-right">
                      {isLunas ? (
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                            <i className="fa-solid fa-circle-check text-[10px]"></i> Lunas
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowReceipt(item);
                            }}
                            title="Buka Kuitansi Resmi"
                            className="w-7 h-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition cursor-pointer"
                          >
                            <i className="fa-solid fa-receipt text-[11px]"></i>
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                          Belum Bayar
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Student Profile Info Card */}
        <div className="bg-[#F8F9FB] rounded-[24px] p-4.5 border border-gray-100 space-y-2 text-xs">
          <p className="font-bold text-[#1B263B] text-xs uppercase tracking-wider mb-2">Data Siswa Terdaftar</p>
          <div className="flex justify-between text-gray-500">
            <span>Nama Siswa</span>
            <span className="font-bold text-gray-800">{student.name}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Nomor Induk Siswa (NIS)</span>
            <span className="font-bold text-gray-800">{student.nis}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Kelas & Jurusan</span>
            <span className="font-bold text-gray-800">{student.grade}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Unit Pendidikan</span>
            <span className="font-bold text-gray-800">{student.school}</span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Action Bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-5 z-20">
          <button
            onClick={() => {
              setShowPayModal(true);
              setPaySuccess(null);
            }}
            className="w-full bg-[#2A4BA0] text-white py-4 px-6 rounded-full font-bold text-xs flex items-center justify-between shadow-xl shadow-[#2A4BA0]/30 hover:bg-[#1E3A8A] transition active:scale-[0.98] cursor-pointer"
          >
            <span>Bayar {selected.length} Bulan Terpilih</span>
            <span className="font-extrabold">{formatRp(selectedTotal)} &rarr;</span>
          </button>
        </div>
      )}

      {/* Payment Confirmation Modal (Exact Image 7 style) */}
      {showPayModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowPayModal(false)}></div>
          <div className="relative bg-white w-full max-w-[430px] rounded-t-[36px] p-6 pb-10 animate-slide-up shadow-2xl">
            <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5"></div>

            {paySuccess ? (
              /* Success State */
              <div className="text-center py-6">
                <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-4 text-3xl">
                  <i className="fa-solid fa-check"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Pembayaran SPP Berhasil!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Tagihan bulan {paySuccess.join(', ')} 2026 telah terverifikasi lunas.
                </p>

                <div className="mt-5 p-4 bg-[#F8F9FB] rounded-[22px] text-xs space-y-2 text-left border border-gray-100">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Dibayar</span>
                    <span className="font-bold text-gray-800">{formatRp(paySuccess.length * 350000)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Metode Bayar</span>
                    <span className="font-bold text-gray-800">{payMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Siswa</span>
                    <span className="font-bold text-gray-800">{student.name} ({student.grade})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status</span>
                    <span className="font-bold text-emerald-600">LUNAS</span>
                  </div>
                </div>

                <div className="flex gap-2.5 mt-6">
                  <button
                    onClick={() => {
                      const sampleItem = sppData.find(s => paySuccess.includes(s.month));
                      setShowPayModal(false);
                      setPaySuccess(null);
                      if (sampleItem) setShowReceipt(sampleItem);
                    }}
                    className="flex-1 py-3.5 bg-gray-100 text-gray-700 font-bold text-xs rounded-full hover:bg-gray-200 cursor-pointer"
                  >
                    Lihat Kuitansi
                  </button>
                  <button
                    onClick={() => {
                      setShowPayModal(false);
                      setPaySuccess(null);
                    }}
                    className="flex-1 bg-[#2A4BA0] text-white py-3.5 rounded-full font-bold text-xs hover:bg-[#1E3A8A] transition active:scale-[0.98] cursor-pointer"
                  >
                    Selesai
                  </button>
                </div>
              </div>
            ) : (
              /* Payment Selection Form */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-[#1B263B]">Konfirmasi Pembayaran SPP</h3>
                  <button
                    onClick={() => setShowPayModal(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-gray-200 cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark text-sm"></i>
                  </button>
                </div>

                {/* Amount card */}
                <div className="bg-[#F8F9FB] rounded-[22px] p-4.5 mb-4 border border-gray-100">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">TOTAL PEMBAYARAN</span>
                  <p className="text-2xl font-black text-[#2A4BA0] mt-0.5">{formatRp(selectedTotal)}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Bulan: {selected.join(', ')} 2026 &bull; {student.name}
                  </p>
                </div>

                {/* Payment Methods Options (Image 7 Yellow Border Radio Style) */}
                <div className="space-y-2">
                  {[
                    { id: 'Saldo KSmart Pay', desc: `Saldo Anda: ${formatRp(balance)}`, icon: 'fa-wallet' },
                    { id: 'Virtual Account BNI', desc: 'Transfer via ATM/Mobile Banking BNI SMAK Kesuma', icon: 'fa-building-columns' },
                    { id: 'QRIS Sekolah', desc: 'Scan melalui BCA, GoPay, OVO, Dana, LinkAja', icon: 'fa-qrcode' },
                  ].map((pm) => {
                    const isPicked = payMethod === pm.id;
                    return (
                      <div
                        key={pm.id}
                        onClick={() => setPayMethod(pm.id)}
                        className={`p-3.5 rounded-[20px] border-2 flex items-center justify-between cursor-pointer transition ${
                          isPicked
                            ? 'border-[#F9B023] bg-amber-50/20'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#2A4BA0]/10 text-[#2A4BA0] flex items-center justify-center">
                            <i className={`fa-solid ${pm.icon} text-base`}></i>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-800">{pm.id}</p>
                            <p className="text-[10px] text-gray-400">{pm.desc}</p>
                          </div>
                        </div>

                        {isPicked ? (
                          <div className="w-5 h-5 rounded-full bg-[#F9B023] text-white flex items-center justify-center text-xs">
                            <i className="fa-solid fa-check text-[10px]"></i>
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Pay Button — Exact Image 7 button */}
                <button
                  onClick={handlePay}
                  className="w-full bg-[#2A4BA0] text-white py-4 rounded-full font-bold text-xs mt-5 shadow-xl shadow-[#2A4BA0]/25 hover:bg-[#1E3A8A] active:scale-[0.98] transition cursor-pointer"
                >
                  Bayar Sekarang &bull; {formatRp(selectedTotal)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OFFICIAL DIGITAL RECEIPT MODAL (REAL SMAK KESUMA MATARAM) */}
      {showReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setShowReceipt(null)}></div>
          <div className="relative bg-white w-full max-w-[390px] rounded-[32px] p-6 animate-slide-up shadow-2xl border border-gray-100 max-h-[92vh] overflow-y-auto">
            {/* School Letterhead */}
            <div className="text-center pb-3 border-b-2 border-gray-800/80">
              <p className="text-[10px] font-bold tracking-widest uppercase text-gray-500">YAYASAN INSAN MANDIRI</p>
              <h3 className="font-black text-sm text-[#1B263B] leading-tight mt-0.5">SMA KATOLIK KESUMA MATARAM</h3>
              <p className="text-[9px] text-gray-500 mt-0.5">
                Jl. Pejanggik No. 110, Cakranegara, Kota Mataram, NTB 83239
              </p>
              <p className="text-[8px] text-gray-400">NPSN: 50201886 &bull; Akreditasi A</p>
            </div>

            <div className="text-center my-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider bg-gray-100 px-3 py-1 rounded-full text-gray-800">
                KUITANSI PEMBAYARAN SPP
              </span>
              <p className="text-[10px] text-gray-400 font-mono mt-1">No: {showReceipt.ref || `KSM-SPP-202611${showReceipt.month.substring(0,3)}`}</p>
            </div>

            <div className="bg-[#F8F9FB] rounded-[20px] p-4 space-y-2 text-xs border border-gray-200/60">
              <div className="flex justify-between">
                <span className="text-gray-400">Nama Siswa</span>
                <span className="font-bold text-gray-800">{student.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">NIS / Kelas</span>
                <span className="font-bold text-gray-800">{student.nis} / {student.grade}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tagihan SPP</span>
                <span className="font-bold text-gray-800">{showReceipt.month} {showReceipt.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tanggal Bayar</span>
                <span className="font-bold text-gray-800">{showReceipt.paidDate || '13 November 2026'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Jumlah Uang</span>
                <span className="font-extrabold text-[#2A4BA0] text-sm">{formatRp(showReceipt.amount)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
                <span className="text-gray-400">Status Pembayaran</span>
                <span className="text-[10px] font-black tracking-wider text-emerald-700 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md">
                  LUNAS / SAH
                </span>
              </div>
            </div>

            {/* Stamp & Signature simulation */}
            <div className="flex items-center justify-between pt-4 px-2 text-[10px]">
              <div>
                <span className="text-gray-400 block">Cap Stempel:</span>
                <div className="w-14 h-14 rounded-full border-2 border-emerald-500/40 text-emerald-600 flex flex-col items-center justify-center font-bold text-[8px] rotate-[-12deg] mt-1">
                  <span>TERVERIFIKASI</span>
                  <span className="text-[6px]">SMAK KESUMA</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-gray-400 block">Mataram, NTB</span>
                <span className="font-bold text-gray-700 block mt-6 underline">Bendahara Sekolah</span>
                <span className="text-[9px] text-gray-400">SMAK Kesuma Mataram</span>
              </div>
            </div>

            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setShowReceipt(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold text-xs rounded-full hover:bg-gray-200 cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={printReceipt}
                className="flex-1 bg-[#2A4BA0] text-white py-3 rounded-full font-bold text-xs hover:bg-[#1E3A8A] transition flex items-center justify-center gap-1.5 shadow-md shadow-[#2A4BA0]/20 cursor-pointer"
              >
                <i className="fa-solid fa-print"></i>
                <span>Cetak / Unduh</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
