import React, { useState, useEffect } from 'react';
import { TOURS_DATA, updateToursData } from '../data/toursData';
import { TourPackage, Language, Currency } from '../types';
import { Plus, Edit, Trash2, Shield, Lock, ArrowLeft, Save, X, Eye, Download, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminPageProps {
  language: Language;
  currency: Currency;
  onSelectTour: (tour: TourPackage) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ language, currency, onSelectTour }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<boolean>(false);

  const [tours, setTours] = useState<TourPackage[]>(TOURS_DATA);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Edit / Add modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTour, setEditingTour] = useState<TourPackage | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'voyra2026' || passwordInput === 'admin' || passwordInput === '') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleSaveTour = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTour) return;

    let updatedList: TourPackage[];
    const exists = tours.some((t) => t.id === editingTour.id);

    if (exists) {
      updatedList = tours.map((t) => (t.id === editingTour.id ? editingTour : t));
    } else {
      updatedList = [editingTour, ...tours];
    }

    setTours(updatedList);
    updateToursData(updatedList);
    setIsModalOpen(false);
    setEditingTour(null);
    showToast('Tur başarıyla kaydedildi ve tüm sitede güncellendi!');
  };

  const handleDeleteTour = (tourId: string) => {
    if (confirm('Bu turu silmek istediğinizden emin misiniz?')) {
      const updatedList = tours.filter((t) => t.id !== tourId);
      setTours(updatedList);
      updateToursData(updatedList);
      showToast('Tur silindi.');
    }
  };

  const handleCreateNew = () => {
    const newId = `tour-${Date.now()}`;
    const newTour: TourPackage = {
      id: newId,
      slug: newId,
      title: 'New Tour Package',
      titleTr: 'Yeni Tur Paketi',
      subtitle: 'Enter tour subtitle here',
      subtitleTr: 'Tur alt başlığını buraya girin',
      destination: 'Cappadocia',
      destinationTr: 'Kapadokya',
      region: 'cappadocia',
      durationDays: 3,
      durationNights: 2,
      priceEUR: 450,
      originalPriceEUR: 520,
      rating: 5.0,
      reviewsCount: 1,
      groupType: 'Small Group',
      groupTypeTr: 'Küçük Grup',
      heroImage: 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=800&q=85',
      ],
      badge: 'New',
      badgeTr: 'Yeni',
      featured: false,
      overview: 'Detailed tour overview in English...',
      overviewTr: 'Türkçe detaylı tur açıklaması...',
      highlights: ['Licensed guide', 'Hotel stay'],
      highlightsTr: ['Lisanslı rehber', 'Otel konaklaması'],
      included: ['Airport transfers', 'Guided tours'],
      includedTr: ['Havalimanı transferleri', 'Rehberli turlar'],
      excluded: ['International flights', 'Personal expenses'],
      excludedTr: ['Uluslararası uçuşlar', 'Kişisel harcamalar'],
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Welcome',
          titleTr: 'Varış ve Karşılama',
          description: 'Airport pickup and transfer to hotel.',
          descriptionTr: 'Havalimanı karşılama ve otele transfer.',
          meals: ['Dinner'],
          mealsTr: ['Akşam Yemeği'],
          highlights: ['Welcome dinner'],
          highlightsTr: ['Karşılama yemeği'],
          overnight: 'Boutique Hotel',
          overnightTr: 'Butik Otel',
        },
      ],
      hotelType: '4-Star Boutique Cave Hotel',
      hotelTypeTr: '4 Yıldızlı Butik Mağara Otel',
      departure: 'Daily departures from Istanbul',
      departureTr: 'İstanbul çıkışlı her gün hareket',
    };
    setEditingTour(newTour);
    setIsModalOpen(true);
  };

  const handleEditTour = (tour: TourPackage) => {
    setEditingTour(JSON.parse(JSON.stringify(tour))); // deep copy
    setIsModalOpen(true);
  };

  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.titleTr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tour.destination.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || tour.region === selectedRegion;
    return matchesSearch && matchesRegion;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-slate-900 px-4 py-16">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl text-white">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#009999]/20 border border-[#009999] rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#5ce6e6]">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-serif-luxury font-bold text-white">Voyra Tours Admin</h1>
            <p className="text-xs text-slate-400 mt-1">Tur yönetim paneline erişmek için şifre girin</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Yönetici Şifresi
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Şifre girin (Örn: voyra2026)"
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#009999]"
              />
              {authError && (
                <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Şifre yanlış. (Deneme için boş bırakıp Gidebilirsiniz veya voyra2026 yazabilirsiniz)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-bold text-sm tracking-wide transition shadow-lg shadow-[#009999]/30 cursor-pointer"
            >
              Panoya Giriş Yap
            </button>

            <div className="text-center pt-2">
              <Link to="/" className="text-xs text-teal-300 hover:underline inline-flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Ana Sayfaya Dön
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#009999] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header */}
      <div className="bg-gradient-to-r from-[#004d53] via-[#004247] to-[#00383d] text-white py-10 px-4 sm:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Shield className="w-4 h-4" />
              <span>Voyra Tours Secure Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold">Tur Yönetim ve Veri Paneli</h1>
            <p className="text-xs text-teal-100/80 mt-1">
              Toplam aktif tur sayısı: <span className="font-bold text-white">{tours.length}</span>. Tüm tur değişkenlerini buradan yönetebilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Siteye Dön</span>
            </Link>
            <button
              onClick={handleCreateNew}
              className="px-5 py-2.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-bold text-xs transition shadow-lg shadow-[#009999]/30 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Tur Ekle</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tur adına veya destinasyona göre ara..."
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#009999]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            {['all', 'cappadocia', 'aegean-ephesus', 'istanbul', 'gallipoli', 'multi-region'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-[#009999] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {reg === 'all' ? 'Tüm Bölgeler' : reg.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Tours Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="p-4">Tur Görseli & Başlık</th>
                  <th className="p-4">Destinasyon</th>
                  <th className="p-4">Süre</th>
                  <th className="p-4">Fiyat (EUR)</th>
                  <th className="p-4">Grup Tipi</th>
                  <th className="p-4 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredTours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={tour.heroImage}
                        alt={tour.title}
                        className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900 font-serif-luxury">{tour.title}</div>
                        <div className="text-slate-500 text-[11px]">{tour.titleTr}</div>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-700">
                      {tour.destination} ({tour.destinationTr})
                    </td>
                    <td className="p-4 text-slate-600">
                      {tour.durationDays} Gün / {tour.durationNights} Gece
                    </td>
                    <td className="p-4 font-bold text-[#009999]">
                      €{tour.priceEUR}
                      {tour.originalPriceEUR && (
                        <span className="text-slate-400 line-through text-[10px] ml-1.5">€{tour.originalPriceEUR}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-teal-50 text-[#008080] font-semibold text-[10px] border border-teal-200">
                        {tour.groupType}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectTour(tour)}
                          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                          title="Sitede Önizle"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEditTour(tour)}
                          className="p-2 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#009999] transition"
                          title="Düzenle"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteTour(tour.id)}
                          className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition"
                          title="Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* EDIT / CREATE TOUR MODAL */}
      {isModalOpen && editingTour && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
              <h3 className="text-lg font-serif-luxury font-bold text-slate-900">
                {tours.some((t) => t.id === editingTour.id) ? 'Turu Düzenle' : 'Yeni Tur Ekle'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTour} className="space-y-6 text-xs">
              {/* Basic Identifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tur ID (Benzersiz Kod)</label>
                  <input
                    type="text"
                    required
                    value={editingTour.id}
                    onChange={(e) => setEditingTour({ ...editingTour, id: e.target.value, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Bölge (Region)</label>
                  <select
                    value={editingTour.region}
                    onChange={(e: any) => setEditingTour({ ...editingTour, region: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  >
                    <option value="cappadocia">Kapadokya (Cappadocia)</option>
                    <option value="aegean-ephesus">Efes & Pamukkale (Aegean)</option>
                    <option value="istanbul">İstanbul (Istanbul)</option>
                    <option value="gallipoli">Çanakkale & Truva (Gallipoli)</option>
                    <option value="mediterranean">Akdeniz (Mediterranean)</option>
                    <option value="black-sea">Karadeniz (Black Sea)</option>
                    <option value="multi-region">Büyük Türkiye Turu (Multi-Region)</option>
                  </select>
                </div>
              </div>

              {/* Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tur Başlığı (İngilizce)</label>
                  <input
                    type="text"
                    required
                    value={editingTour.title}
                    onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tur Başlığı (Türkçe)</label>
                  <input
                    type="text"
                    required
                    value={editingTour.titleTr}
                    onChange={(e) => setEditingTour({ ...editingTour, titleTr: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              {/* Subtitles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alt Başlık (İngilizce)</label>
                  <input
                    type="text"
                    value={editingTour.subtitle}
                    onChange={(e) => setEditingTour({ ...editingTour, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alt Başlık (Türkçe)</label>
                  <input
                    type="text"
                    value={editingTour.subtitleTr}
                    onChange={(e) => setEditingTour({ ...editingTour, subtitleTr: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              {/* Destinations & Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destinasyon (EN)</label>
                  <input
                    type="text"
                    value={editingTour.destination}
                    onChange={(e) => setEditingTour({ ...editingTour, destination: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Destinasyon (TR)</label>
                  <input
                    type="text"
                    value={editingTour.destinationTr}
                    onChange={(e) => setEditingTour({ ...editingTour, destinationTr: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Etiket / Badge (Örn: Bestseller)</label>
                  <input
                    type="text"
                    value={editingTour.badge || ''}
                    onChange={(e) => setEditingTour({ ...editingTour, badge: e.target.value, badgeTr: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              {/* Duration & Pricing */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gün Sayısı</label>
                  <input
                    type="number"
                    min={1}
                    value={editingTour.durationDays}
                    onChange={(e) => setEditingTour({ ...editingTour, durationDays: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gece Sayısı</label>
                  <input
                    type="number"
                    min={0}
                    value={editingTour.durationNights}
                    onChange={(e) => setEditingTour({ ...editingTour, durationNights: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fiyat (€ EUR)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingTour.priceEUR}
                    onChange={(e) => setEditingTour({ ...editingTour, priceEUR: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Orijinal Fiyat (€)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingTour.originalPriceEUR || ''}
                    onChange={(e) => setEditingTour({ ...editingTour, originalPriceEUR: parseFloat(e.target.value) || undefined })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ana Kapak Görseli URL (Hero Image)</label>
                <input
                  type="text"
                  value={editingTour.heroImage}
                  onChange={(e) => setEditingTour({ ...editingTour, heroImage: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                />
              </div>

              {/* Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tur Açıklaması (EN)</label>
                  <textarea
                    rows={3}
                    value={editingTour.overview}
                    onChange={(e) => setEditingTour({ ...editingTour, overview: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tur Açıklaması (TR)</label>
                  <textarea
                    rows={3}
                    value={editingTour.overviewTr}
                    onChange={(e) => setEditingTour({ ...editingTour, overviewTr: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              {/* Hotel & Departure */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Otel Tipi (TR)</label>
                  <input
                    type="text"
                    value={editingTour.hotelTypeTr}
                    onChange={(e) => setEditingTour({ ...editingTour, hotelTypeTr: e.target.value, hotelType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kalkış / Hareket (TR)</label>
                  <input
                    type="text"
                    value={editingTour.departureTr}
                    onChange={(e) => setEditingTour({ ...editingTour, departureTr: e.target.value, departure: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-bold transition shadow-md shadow-[#009999]/30 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Değişiklikleri Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
