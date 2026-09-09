import React, { useState } from 'react';
import mammoth from 'mammoth';
import { TOURS_DATA, updateToursData, HERO_SLIDES, updateHeroSlides } from '../data/toursData';
import { TourPackage, Language, Currency } from '../types';
import { parseVoyraTourDocument } from '../utils/docxTourParser';
import { Plus, Edit, Trash2, Shield, Lock, ArrowLeft, Save, X, Eye, CheckCircle2, AlertCircle, Image as ImageIcon, Calendar, ListChecks, Sparkles } from 'lucide-react';
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

  const [activeTab, setActiveTab] = useState<'tours' | 'hero'>('tours');
  const [heroSlides, setHeroSlides] = useState<string[]>(HERO_SLIDES);
  const [newHeroUrl, setNewHeroUrl] = useState<string>('');

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

  // Image file upload handler (converts to base64 data URL)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, targetField: 'heroImage' | 'gallery_add') => {
    const file = e.target.files?.[0];
    if (!file || !editingTour) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        if (targetField === 'heroImage') {
          setEditingTour({ ...editingTour, heroImage: result });
        } else if (targetField === 'gallery_add') {
          setEditingTour({
            ...editingTour,
            galleryImages: [...editingTour.galleryImages, result],
          });
        }
        showToast('Görsel başarıyla yüklendi!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddHeroSlide = () => {
    if (!newHeroUrl.trim()) return;
    const updated = [...heroSlides, newHeroUrl.trim()];
    setHeroSlides(updated);
    updateHeroSlides(updated);
    setNewHeroUrl('');
    showToast('Yeni ana sayfa hero görseli eklendi!');
  };

  const handleDeleteHeroSlide = (index: number) => {
    if (heroSlides.length <= 1) {
      alert('En az 1 adet hero görseli kalmalıdır.');
      return;
    }
    const updated = heroSlides.filter((_, i) => i !== index);
    setHeroSlides(updated);
    updateHeroSlides(updated);
    showToast('Hero görseli kaldırıldı.');
  };

  const handleHeroFileUploadAdmin = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        const updated = [...heroSlides, result];
        setHeroSlides(updated);
        updateHeroSlides(updated);
        showToast('Hero görseli bilgisayardan yüklendi ve eklendi!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleWordUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast('Word dosyası okunuyor...');
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const text = result.value;

      if (!text || text.trim().length === 0) {
        alert('Word dosyası boş veya metin okunamadı.');
        return;
      }

      showToast('Word içeriği tura dönüştürülüyor...');
      let newTour: TourPackage | null = null;

      // 1. Try backend server API first
      try {
        const res = await fetch('/api/parse-tour-word', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        });
        const contentType = res.headers.get("content-type");
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.success && data.tour) {
            newTour = data.tour;
          }
        }
      } catch (err) {
        console.log('Server API not reachable, using smart client-side parser for static hosting...');
      }

      // 2. Fallback smart client-side parser (tailored directly for Voyra Tour Document templates)
      if (!newTour) {
        newTour = parseVoyraTourDocument(text, file.name);
      }

      if (newTour) {
        if (tours.some((t) => t.id === newTour!.id)) {
          newTour!.id = `${newTour!.id}-${Date.now().toString().slice(-4)}`;
          newTour!.slug = newTour!.id;
        }

        const updated = [newTour, ...tours];
        setTours(updated);
        updateToursData(updated);
        showToast(`"${newTour.title}" başarıyla Word dosyasından eklendi!`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Word yükleme hatası: ${err.message || 'Bilinmeyen hata'}`);
    } finally {
      e.target.value = '';
    }
  };

  const handleCreateNew = () => {
    const newId = `tour-${Date.now()}`;
    const newTour: TourPackage = {
      id: newId,
      slug: newId,
      title: 'New Custom Tour',
      titleTr: 'Yeni Özel Tur',
      subtitle: 'Boutique journey through Turkey',
      subtitleTr: 'Türkiye genelinde butik seyahat deneyimi',
      destination: 'Cappadocia & Ephesus',
      destinationTr: 'Kapadokya & Efes',
      region: 'cappadocia',
      durationDays: 3,
      durationNights: 2,
      priceEUR: 490,
      originalPriceEUR: 580,
      rating: 5.0,
      reviewsCount: 1,
      groupType: 'Small Boutique Group',
      groupTypeTr: 'Küçük Butik Grup',
      heroImage: 'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [
        'https://images.unsplash.com/photo-1570939274717-7eda259b50ed?auto=format&fit=crop&w=800&q=85',
        'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=85',
      ],
      badge: 'Bestseller',
      badgeTr: 'Çok Satan',
      featured: true, // Show on homepage popular tours!
      overview: 'Detailed tour overview in English...',
      overviewTr: 'Türkçe detaylı tur açıklaması...',
      highlights: ['Licensed historian guide', 'Cave hotel stay', 'Domestic flights included'],
      highlightsTr: ['Lisanslı tarihçi rehber', 'Mağara otel konaklaması', 'İç hat uçuşları dahil'],
      included: ['Airport transfers', 'Guided tours', 'Breakfasts & Dinners'],
      includedTr: ['Havalimanı transferleri', 'Rehberli turlar', 'Kahvaltı ve Akşam Yemekleri'],
      excluded: ['International flights', 'Personal expenses'],
      excludedTr: ['Uluslararası uçuşlar', 'Kişisel harcamalar'],
      itinerary: [
        {
          day: 1,
          title: 'Arrival & Welcome',
          titleTr: 'Varış ve Karşılama',
          description: 'Airport pickup and transfer to cave hotel.',
          descriptionTr: 'Havalimanı karşılama ve mağara otele transfer.',
          meals: ['Dinner'],
          mealsTr: ['Akşam Yemeği'],
          highlights: ['Welcome dinner'],
          highlightsTr: ['Karşılama yemeği'],
          overnight: 'Cappadocia Cave Suite',
          overnightTr: 'Kapadokya Mağara Süiti',
        },
        {
          day: 2,
          title: 'Valley Tour & Fairy Chimneys',
          titleTr: 'Vadi Turu ve Peri Bacaları',
          description: 'Explore Devrent and Pasabag valleys.',
          descriptionTr: 'Devrent ve Paşabağ vadilerini keşfedin.',
          meals: ['Breakfast', 'Lunch'],
          mealsTr: ['Kahvaltı', 'Öğle Yemeği'],
          highlights: ['Open Air Museum', 'Pottery workshop'],
          highlightsTr: ['Açık Hava Müzesi', 'Çömlek atölyesi'],
          overnight: 'Cappadocia Cave Suite',
          overnightTr: 'Kapadokya Mağara Süiti',
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
            <h1 className="text-2xl font-serif-luxury font-bold text-white">Voyra Tours Admin Panel</h1>
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
                  <AlertCircle className="w-3.5 h-3.5" /> Şifre yanlış. (Hızlı giriş için boş bırakıp girebilirsiniz)
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
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold">Gelişmiş Tur Yönetim Paneli</h1>
            <p className="text-xs text-teal-100/80 mt-1">
              Toplam kayıtlı tur: <span className="font-bold text-white">{tours.length}</span>. Tur görsellerini yükleyebilir, günleri ekleyebilir ve tüm detayları yönetebilirsiniz.
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
            <label className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-lg shadow-teal-700/30 flex items-center gap-2 cursor-pointer">
              <span>📄 Word (.docx) Dosyasından Tur Yükle</span>
              <input
                type="file"
                accept=".docx"
                onChange={handleWordUpload}
                className="hidden"
              />
            </label>
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

      {/* Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <button
            onClick={() => setActiveTab('tours')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'tours'
                ? 'bg-[#009999] text-white shadow-md shadow-[#009999]/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🏔️ Tur ve Rota Yönetimi ({tours.length})
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'hero'
                ? 'bg-[#009999] text-white shadow-md shadow-[#009999]/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            🖼️ Ana Sayfa Hero Slider Görselleri ({heroSlides.length})
          </button>
        </div>
      </div>

      {activeTab === 'hero' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div>
              <h2 className="text-xl font-serif-luxury font-bold text-slate-900">Ana Sayfa Hero Slider Görselleri</h2>
              <p className="text-xs text-slate-500 mt-1">
                Ana sayfadaki büyük kayan (slider) arka plan görsellerini buradan yönetebilir, yeni görseller ekleyebilir veya silebilirsiniz.
              </p>
            </div>

            {/* Add New Hero Image */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Yeni Hero Slider Görseli Ekle</h3>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="text"
                  value={newHeroUrl}
                  onChange={(e) => setNewHeroUrl(e.target.value)}
                  placeholder="Görsel URL yapıştırın (https://...)"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#009999]"
                />
                <button
                  type="button"
                  onClick={handleAddHeroSlide}
                  className="px-5 py-2.5 bg-[#009999] hover:bg-[#008080] text-white font-bold rounded-xl text-xs whitespace-nowrap transition cursor-pointer shadow-sm"
                >
                  URL ile Ekle
                </button>
                <label className="px-5 py-2.5 bg-teal-50 hover:bg-teal-100 text-[#009999] rounded-xl font-bold border border-teal-200 cursor-pointer whitespace-nowrap transition inline-flex items-center gap-1.5 shrink-0 text-xs">
                  <Plus className="w-4 h-4" /> Bilgisayardan Yükle
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroFileUploadAdmin}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Current Hero Slides Grid */}
            <div className="space-y-3">
              <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">Mevcut Hero Slider Görselleri ({heroSlides.length})</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {heroSlides.map((imgUrl, index) => (
                  <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl p-3 relative group shadow-xs space-y-2">
                    <div className="relative h-40 rounded-xl overflow-hidden border border-slate-200">
                      <img src={imgUrl} alt={`Hero ${index + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                      <div className="absolute top-2 left-2 bg-slate-900/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                        Slayt #{index + 1}
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500 truncate max-w-[180px]">{imgUrl}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteHeroSlide(index)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition inline-flex items-center gap-1 cursor-pointer"
                        title="Bu slaytı sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Sil
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
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
            {['all', ...Array.from(new Set(tours.map((t) => t.region)))].map((reg) => (
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
                  <th className="p-4">Popüler (Anasayfa)</th>
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
                      {tour.featured ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 inline-flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Popülerde Gösteriliyor
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-medium text-[10px]">
                          Normal Liste
                        </span>
                      )}
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
      )}

      {/* FULL TOUR EDIT MODAL */}
      {isModalOpen && editingTour && (
        <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-10 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6 sticky top-0 bg-white z-20 pt-2">
              <h3 className="text-xl font-serif-luxury font-bold text-slate-900 flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#009999]" />
                {tours.some((t) => t.id === editingTour.id) ? 'Tur Detaylarını Düzenle' : 'Yeni Tur Oluştur'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTour} className="space-y-8 text-xs">
              {/* SECTION 1: GENERAL & HOMEPAGE FEATURED */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-[#008080] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> 1. Genel Bilgiler & Anasayfa Ayarı
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tur ID (Benzersiz Kod)</label>
                    <input
                      type="text"
                      required
                      value={editingTour.id}
                      onChange={(e) => setEditingTour({ ...editingTour, id: e.target.value, slug: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bölge (Region - İstediğinizi Yazın)</label>
                    <input
                      type="text"
                      required
                      list="existing-regions"
                      value={editingTour.region}
                      onChange={(e) => setEditingTour({ ...editingTour, region: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      placeholder="Örn: antalya, bodrum, karadeniz"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                    <datalist id="existing-regions">
                      {Array.from(new Set(tours.map((t) => t.region))).map((r) => (
                        <option key={r} value={r} />
                      ))}
                      <option value="cappadocia" />
                      <option value="aegean-ephesus" />
                      <option value="istanbul" />
                      <option value="gallipoli" />
                      <option value="antalya" />
                      <option value="bodrum" />
                      <option value="karadeniz" />
                      <option value="fethiye" />
                    </datalist>
                    <span className="text-[10px] text-slate-400 mt-1 block">İstediğiniz yeni bölge adını yazabilirsiniz (Otomatik tireli formata çevrilir).</span>
                  </div>
                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2.5 cursor-pointer bg-white px-4 py-2.5 rounded-xl border border-slate-200 w-full shadow-xs">
                      <input
                        type="checkbox"
                        checked={editingTour.featured || false}
                        onChange={(e) => setEditingTour({ ...editingTour, featured: e.target.checked })}
                        className="w-4 h-4 text-[#009999] rounded border-slate-300 focus:ring-[#009999]"
                      />
                      <span className="font-bold text-slate-800">Ana Sayfa Popüler Turlarda Göster</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tur Başlığı (İngilizce)</label>
                    <input
                      type="text"
                      required
                      value={editingTour.title}
                      onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tur Başlığı (Türkçe)</label>
                    <input
                      type="text"
                      required
                      value={editingTour.titleTr}
                      onChange={(e) => setEditingTour({ ...editingTour, titleTr: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Alt Başlık (İngilizce)</label>
                    <input
                      type="text"
                      value={editingTour.subtitle}
                      onChange={(e) => setEditingTour({ ...editingTour, subtitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Alt Başlık (Türkçe)</label>
                    <input
                      type="text"
                      value={editingTour.subtitleTr}
                      onChange={(e) => setEditingTour({ ...editingTour, subtitleTr: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: PRICING, DURATION & DESTINATION */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-[#008080] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> 2. Süre, Fiyat ve Destinasyon
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Destinasyon (EN)</label>
                    <input
                      type="text"
                      value={editingTour.destination}
                      onChange={(e) => setEditingTour({ ...editingTour, destination: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Destinasyon (TR)</label>
                    <input
                      type="text"
                      value={editingTour.destinationTr}
                      onChange={(e) => setEditingTour({ ...editingTour, destinationTr: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Rozet / Etiket (Örn: Bestseller)</label>
                    <input
                      type="text"
                      value={editingTour.badge || ''}
                      onChange={(e) => setEditingTour({ ...editingTour, badge: e.target.value, badgeTr: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Gün Sayısı</label>
                    <input
                      type="number"
                      min={1}
                      value={editingTour.durationDays}
                      onChange={(e) => setEditingTour({ ...editingTour, durationDays: parseInt(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Gece Sayısı</label>
                    <input
                      type="number"
                      min={0}
                      value={editingTour.durationNights}
                      onChange={(e) => setEditingTour({ ...editingTour, durationNights: parseInt(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fiyat (€ EUR)</label>
                    <input
                      type="number"
                      min={0}
                      value={editingTour.priceEUR}
                      onChange={(e) => setEditingTour({ ...editingTour, priceEUR: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">İndirim Öncü Fiyat (€)</label>
                    <input
                      type="number"
                      min={0}
                      value={editingTour.originalPriceEUR || ''}
                      onChange={(e) => setEditingTour({ ...editingTour, originalPriceEUR: parseFloat(e.target.value) || undefined })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: IMAGES & UPLOAD */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-[#008080] uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4" /> 3. Görseller (Kapak & Galeri)
                </h4>

                <div className="space-y-3">
                  <label className="block font-bold text-slate-700">Ana Kapak Görseli (Hero Image)</label>
                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <input
                      type="text"
                      value={editingTour.heroImage}
                      onChange={(e) => setEditingTour({ ...editingTour, heroImage: e.target.value })}
                      placeholder="Görsel URL yapıştırın veya bilgisayardan yükleyin"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                    <label className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-[#009999] rounded-xl font-bold border border-teal-200 cursor-pointer whitespace-nowrap transition inline-flex items-center gap-1.5 shrink-0">
                      <Plus className="w-4 h-4" /> Dosya Seç & Yükle
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'heroImage')}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {editingTour.heroImage && (
                    <div className="mt-2">
                      <img src={editingTour.heroImage} alt="Kapak Önizleme" className="w-32 h-20 object-cover rounded-xl border border-slate-300 shadow-sm" />
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-3">
                  <label className="block font-bold text-slate-700">Galeri Görselleri (Çoklu)</label>
                  <div className="flex flex-wrap gap-3 mb-2">
                    {editingTour.galleryImages.map((imgUrl, idx) => (
                      <div key={idx} className="relative group">
                        <img src={imgUrl} alt={`Galeri ${idx}`} className="w-20 h-20 object-cover rounded-xl border border-slate-300 shadow-sm" />
                        <button
                          type="button"
                          onClick={() => {
                            const newGallery = editingTour.galleryImages.filter((_, i) => i !== idx);
                            setEditingTour({ ...editingTour, galleryImages: newGallery });
                          }}
                          className="absolute -top-2 -right-2 bg-rose-600 text-white rounded-full p-1 shadow hover:bg-rose-750 transition"
                          title="Görseli Sil"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <input
                      type="text"
                      id="new-gallery-url-input"
                      placeholder="Yeni galeri görseli URL ekle..."
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value.trim();
                          if (val) {
                            setEditingTour({ ...editingTour, galleryImages: [...editingTour.galleryImages, val] });
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('new-gallery-url-input') as HTMLInputElement;
                        if (input && input.value.trim()) {
                          setEditingTour({ ...editingTour, galleryImages: [...editingTour.galleryImages, input.value.trim()] });
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold whitespace-nowrap transition"
                    >
                      URL Ekle
                    </button>
                    <label className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-[#009999] rounded-xl font-bold border border-teal-200 cursor-pointer whitespace-nowrap transition inline-flex items-center gap-1.5 shrink-0">
                      <Plus className="w-4 h-4" /> Bilgisayardan Yükle
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'gallery_add')}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION 4: OVERVIEW & HOTEL DETAILS */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-[#008080] uppercase tracking-wider flex items-center gap-1.5">
                  <ListChecks className="w-4 h-4" /> 4. Genel Açıklama & Otel Bilgileri
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tur Açıklaması (EN)</label>
                    <textarea
                      rows={3}
                      value={editingTour.overview}
                      onChange={(e) => setEditingTour({ ...editingTour, overview: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tur Açıklaması (TR)</label>
                    <textarea
                      rows={3}
                      value={editingTour.overviewTr}
                      onChange={(e) => setEditingTour({ ...editingTour, overviewTr: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Otel Tipi (TR)</label>
                    <input
                      type="text"
                      value={editingTour.hotelTypeTr}
                      onChange={(e) => setEditingTour({ ...editingTour, hotelTypeTr: e.target.value, hotelType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kalkış / Hareket (TR)</label>
                    <input
                      type="text"
                      value={editingTour.departureTr}
                      onChange={(e) => setEditingTour({ ...editingTour, departureTr: e.target.value, departure: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 5: HIGHLIGHTS, INCLUDED & EXCLUDED */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-[#008080] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> 5. Öne Çıkanlar (Highlights) & Dahil / Hariçler
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Highlights TR */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Öne Çıkanlar (Türkçe - Her satıra bir madde)</label>
                    <textarea
                      rows={4}
                      value={editingTour.highlightsTr.join('\n')}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n');
                        setEditingTour({ ...editingTour, highlightsTr: lines, highlights: lines });
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-[11px]"
                    />
                  </div>

                  {/* Included TR */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fiyata Dahil Olanlar (TR - Her satıra bir madde)</label>
                    <textarea
                      rows={4}
                      value={editingTour.includedTr.join('\n')}
                      onChange={(e) => {
                        const lines = e.target.value.split('\n');
                        setEditingTour({ ...editingTour, includedTr: lines, included: lines });
                      }}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-[11px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Fiyata Hariç Olanlar (TR - Her satıra bir madde)</label>
                  <textarea
                    rows={3}
                    value={editingTour.excludedTr.join('\n')}
                    onChange={(e) => {
                      const lines = e.target.value.split('\n');
                      setEditingTour({ ...editingTour, excludedTr: lines, excluded: lines });
                    }}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* SECTION 6: ITINERARY (GÜNLÜK PROGRAMLAR & GÜN EKLE) */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-[#008080] uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> 6. Günlük Program (Itinerary / Gün Ekle)
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      const nextDayNum = editingTour.itinerary.length + 1;
                      const newItineraryItem = {
                        day: nextDayNum,
                        title: `Day ${nextDayNum} Itinerary`,
                        titleTr: `${nextDayNum}. Gün Programı`,
                        description: 'Detailed description for this day...',
                        descriptionTr: 'Bu gün için detaylı rota açıklaması...',
                        meals: ['Breakfast'],
                        mealsTr: ['Kahvaltı'],
                        highlights: ['Sightseeing'],
                        highlightsTr: ['Çevre Gezisi'],
                        overnight: 'Boutique Hotel',
                        overnightTr: 'Butik Otel',
                      };
                      setEditingTour({
                        ...editingTour,
                        durationDays: Math.max(editingTour.durationDays, nextDayNum),
                        itinerary: [...editingTour.itinerary, newItineraryItem],
                      });
                    }}
                    className="px-4 py-2 bg-[#009999] hover:bg-[#008080] text-white font-bold rounded-xl text-xs transition inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> + Yeni Gün Ekle
                  </button>
                </div>

                <div className="space-y-4">
                  {editingTour.itinerary.map((dayItem, index) => (
                    <div key={index} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3 relative">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-[#009999] text-xs">
                          {dayItem.day}. Gün (Day {dayItem.day})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const newItinerary = editingTour.itinerary.filter((_, i) => i !== index);
                            setEditingTour({ ...editingTour, itinerary: newItinerary });
                          }}
                          className="text-rose-500 hover:text-rose-700 text-xs font-bold inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Bu Günü Sil
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1 text-[11px]">Gün Başlığı (TR)</label>
                          <input
                            type="text"
                            value={dayItem.titleTr}
                            onChange={(e) => {
                              const updated = [...editingTour.itinerary];
                              updated[index].titleTr = e.target.value;
                              updated[index].title = e.target.value;
                              setEditingTour({ ...editingTour, itinerary: updated });
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1 text-[11px]">Konaklama Yeri (TR)</label>
                          <input
                            type="text"
                            value={dayItem.overnightTr}
                            onChange={(e) => {
                              const updated = [...editingTour.itinerary];
                              updated[index].overnightTr = e.target.value;
                              updated[index].overnight = e.target.value;
                              setEditingTour({ ...editingTour, itinerary: updated });
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-600 mb-1 text-[11px]">Gün Açıklaması / Rota Detayı (TR)</label>
                        <textarea
                          rows={2}
                          value={dayItem.descriptionTr}
                          onChange={(e) => {
                            const updated = [...editingTour.itinerary];
                            updated[index].descriptionTr = e.target.value;
                            updated[index].description = e.target.value;
                            setEditingTour({ ...editingTour, itinerary: updated });
                          }}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1 text-[11px]">Dahil Öğünler (Örn: Kahvaltı, Öğle, Akşam)</label>
                          <input
                            type="text"
                            value={dayItem.mealsTr.join(', ')}
                            onChange={(e) => {
                              const mealsArr = e.target.value.split(',').map((s) => s.trim());
                              const updated = [...editingTour.itinerary];
                              updated[index].mealsTr = mealsArr;
                              updated[index].meals = mealsArr;
                              setEditingTour({ ...editingTour, itinerary: updated });
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-600 mb-1 text-[11px]">Günün Önemli Noktaları (Virgülle ayırın)</label>
                          <input
                            type="text"
                            value={dayItem.highlightsTr.join(', ')}
                            onChange={(e) => {
                              const hArr = e.target.value.split(',').map((s) => s.trim());
                              const updated = [...editingTour.itinerary];
                              updated[index].highlightsTr = hArr;
                              updated[index].highlights = hArr;
                              setEditingTour({ ...editingTour, itinerary: updated });
                            }}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 sticky bottom-0 bg-white z-20 pb-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-7 py-3 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-bold transition shadow-lg shadow-[#009999]/30 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Turu ve Tüm Değişkenleri Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
