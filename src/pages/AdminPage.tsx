import React, { useState, useMemo } from 'react';
import mammoth from 'mammoth';
import {
  TOURS_DATA,
  updateToursData,
  HERO_SLIDES,
  updateHeroSlides,
  resetToursToDefault,
  DESTINATIONS_DATA,
  updateDestinationsData,
  resetDestinationsToDefault,
} from '../data/toursData';
import { TourPackage, Language, Currency, DestinationInfo } from '../types';
import { parseVoyraTourDocument } from '../utils/docxTourParser';
import {
  autoSyncDestinationsFromTour,
  syncDestinationsWithAllTours,
  detectRegionsFromTour,
  sanitizeTourDestinations,
} from '../utils/destinationDetector';
import {
  Plus,
  Edit,
  Trash2,
  Shield,
  Lock,
  ArrowLeft,
  Save,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  Calendar,
  ListChecks,
  Sparkles,
  RotateCcw,
  MapPin,
  Upload,
} from 'lucide-react';
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

  const [activeTab, setActiveTab] = useState<'tours' | 'destinations' | 'hero'>('tours');
  const [heroSlides, setHeroSlides] = useState<string[]>(HERO_SLIDES);
  const [newHeroUrl, setNewHeroUrl] = useState<string>('');

  const [tours, setTours] = useState<TourPackage[]>(TOURS_DATA);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');

  // Destinations state
  const [destinations, setDestinations] = useState<DestinationInfo[]>(DESTINATIONS_DATA);
  const [destSearchTerm, setDestSearchTerm] = useState<string>('');
  const [isDestModalOpen, setIsDestModalOpen] = useState<boolean>(false);
  const [editingDestination, setEditingDestination] = useState<DestinationInfo | null>(null);
  const [highlightsInputEn, setHighlightsInputEn] = useState<string>('');
  const [highlightsInputTr, setHighlightsInputTr] = useState<string>('');

  // Edit / Add modal state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingTour, setEditingTour] = useState<TourPackage | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live preview of regions detected from current tour being edited
  const detectedRegionsPreview = useMemo(() => {
    if (!editingTour) return [];
    return detectRegionsFromTour(editingTour);
  }, [
    editingTour?.destination,
    editingTour?.destinationTr,
    editingTour?.title,
    editingTour?.titleTr,
    editingTour?.region,
    editingTour?.itinerary,
  ]);

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

    // Auto-detect regions mentioned in the tour and synchronize with destinations
    const { updatedDestinations, newlyAdded, detectedRegions } = autoSyncDestinationsFromTour(
      editingTour,
      updatedList,
      destinations
    );

    setDestinations(updatedDestinations);
    updateDestinationsData(updatedDestinations);

    setIsModalOpen(false);
    setEditingTour(null);

    const detectedNames = detectedRegions.map((r) => r.nameTr || r.name).join(', ');
    if (newlyAdded.length > 0) {
      const addedNames = newlyAdded.map((d) => d.nameTr || d.name).join(', ');
      showToast(`Tur kaydedildi! Turda geçen bölgeler tespit edilip destinasyonlara eklendi: ${addedNames}`);
    } else if (detectedNames) {
      showToast(`Tur başarıyla kaydedildi! Bölgeler güncellendi: ${detectedNames}`);
    } else {
      showToast('Tur başarıyla kaydedildi ve tüm sitede güncellendi!');
    }
  };

  const handleScanAllToursForDestinations = () => {
    const { updatedDestinations, newlyAdded } = syncDestinationsWithAllTours(tours, destinations);
    setDestinations(updatedDestinations);
    updateDestinationsData(updatedDestinations);
    if (newlyAdded.length > 0) {
      const names = newlyAdded.map((d) => d.nameTr || d.name).join(', ');
      showToast(`Tüm turlar tarandı! ${newlyAdded.length} yeni destinasyon sisteme eklendi: ${names}`);
    } else {
      showToast(`Tüm turlar tarandı. Kayıtlı ${updatedDestinations.length} destinasyonun tur sayıları güncellendi!`);
    }
  };

  const handleToggleFeatured = (tourId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const updatedList = tours.map((t) => {
      if (t.id === tourId) {
        return { ...t, featured: !t.featured };
      }
      return t;
    });
    setTours(updatedList);
    updateToursData(updatedList);
    const targetTour = updatedList.find((t) => t.id === tourId);
    showToast(
      targetTour?.featured
        ? `"${targetTour.titleTr || targetTour.title}" ana sayfa popüler turlara eklendi!`
        : `"${targetTour?.titleTr || targetTour?.title}" ana sayfa popüler turlardan çıkarıldı.`
    );
  };

  const handleDeleteTour = (tourId: string) => {
    if (confirm('Bu turu silmek istediğinizden emin misiniz?')) {
      const updatedList = tours.filter((t) => t.id !== tourId);
      setTours(updatedList);
      updateToursData(updatedList);
      showToast('Tur silindi.');
    }
  };

  const handleResetToDefaultTours = () => {
    if (confirm('Tüm turları temizlemek ve listeyi sıfırlamak istiyor musunuz?')) {
      const fresh = resetToursToDefault();
      setTours(fresh);
      showToast('Tüm turlar temizlendi.');
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
          body: JSON.stringify({ text, fileName: file.name }),
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

      // Always guarantee clean title from file name if title is too long or contains paragraph text
      if (newTour && file.name) {
        const cleanFileNameTitle = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/\s*-\s*/g, '-')
          .replace(/[-_]/g, ' ')
          .trim()
          .split(' ')
          .filter(Boolean)
          .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        if (
          !newTour.title ||
          newTour.title.length > 70 ||
          newTour.title.toLowerCase().includes('your journey begins') ||
          newTour.title.toLowerCase().includes('day 1') ||
          newTour.title.toLowerCase().includes('number of guests')
        ) {
          newTour.title = cleanFileNameTitle;
          newTour.titleTr = cleanFileNameTitle;
        }
      }

      if (newTour) {
        // Enforce Voyra default.jpg if heroImage is missing or using legacy Paris photo
        if (!newTour.heroImage || newTour.heroImage.includes('1570939274717-7eda259b50ed')) {
          newTour.heroImage = 'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg';
        }
        if (!newTour.galleryImages || !Array.isArray(newTour.galleryImages) || newTour.galleryImages.length === 0) {
          newTour.galleryImages = ['https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg'];
        } else {
          newTour.galleryImages = newTour.galleryImages.map((img: string) =>
            img.includes('1570939274717-7eda259b50ed')
              ? 'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg'
              : img
          );
        }

        // Sanitize destinations strictly according to day-by-day sightseeing
        newTour = sanitizeTourDestinations(newTour);

        if (tours.some((t) => t.id === newTour!.id)) {
          newTour!.id = `${newTour!.id}-${Date.now().toString().slice(-4)}`;
          newTour!.slug = newTour!.id;
        }

        const updated = [newTour, ...tours];
        setTours(updated);
        updateToursData(updated);

        // Auto-detect regions mentioned in the Word tour and synchronize with destinations
        const { updatedDestinations, newlyAdded, detectedRegions } = autoSyncDestinationsFromTour(
          newTour,
          updated,
          destinations
        );
        setDestinations(updatedDestinations);
        updateDestinationsData(updatedDestinations);

        const detectedNames = detectedRegions.map((r) => r.nameTr || r.name).join(', ');
        if (newlyAdded.length > 0) {
          const addedNames = newlyAdded.map((d) => d.nameTr || d.name).join(', ');
          showToast(`"${newTour.title}" Word'den eklendi! Tespit edilen yeni destinasyonlar eklendi: ${addedNames}`);
        } else if (detectedNames) {
          showToast(`"${newTour.title}" Word'den eklendi! (Bölgeler: ${detectedNames})`);
        } else {
          showToast(`"${newTour.title}" başarıyla Word dosyasından eklendi!`);
        }
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
      groupType: 'Small Group',
      groupTypeTr: 'Küçük Grup',
      heroImage: 'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg',
      galleryImages: [
        'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg',
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

  // Destination Handlers
  const handleCreateNewDestination = () => {
    const newId = `dest-${Date.now()}`;
    const newDest: DestinationInfo = {
      id: newId,
      name: '',
      nameTr: '',
      tagline: '',
      taglineTr: '',
      image: 'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg',
      toursCount: 1,
      popularHighlights: ['Top Attraction 1', 'Top Attraction 2'],
      popularHighlightsTr: ['Gezilecek Yer 1', 'Gezilecek Yer 2'],
      showOnHome: true,
    };
    setEditingDestination(newDest);
    setHighlightsInputEn(newDest.popularHighlights.join(', '));
    setHighlightsInputTr(newDest.popularHighlightsTr.join(', '));
    setIsDestModalOpen(true);
  };

  const handleEditDestination = (dest: DestinationInfo) => {
    setEditingDestination({
      ...JSON.parse(JSON.stringify(dest)),
      showOnHome: dest.showOnHome !== false,
    });
    setHighlightsInputEn(dest.popularHighlights.join(', '));
    setHighlightsInputTr(dest.popularHighlightsTr.join(', '));
    setIsDestModalOpen(true);
  };

  const handleToggleDestinationShowOnHome = (destId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const updatedList = destinations.map((d) => {
      if (d.id === destId) {
        const isCurrentlyShown = d.showOnHome !== false;
        return { ...d, showOnHome: !isCurrentlyShown };
      }
      return d;
    });
    setDestinations(updatedList);
    updateDestinationsData(updatedList);
    const target = updatedList.find((d) => d.id === destId);
    const isNowShown = target?.showOnHome !== false;
    showToast(
      isNowShown
        ? `"${target?.nameTr || target?.name}" ana sayfada gösterilecek!`
        : `"${target?.nameTr || target?.name}" ana sayfadan gizlendi.`
    );
  };

  const handleSaveDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDestination) return;

    if (!editingDestination.name.trim() && !editingDestination.nameTr.trim()) {
      alert('Lütfen destinasyon adını giriniz.');
      return;
    }

    const highlightsEn = highlightsInputEn
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const highlightsTr = highlightsInputTr
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const destToSave: DestinationInfo = {
      ...editingDestination,
      id: editingDestination.id.trim() || `dest-${Date.now()}`,
      name: editingDestination.name.trim() || editingDestination.nameTr.trim(),
      nameTr: editingDestination.nameTr.trim() || editingDestination.name.trim(),
      tagline: editingDestination.tagline.trim(),
      taglineTr: editingDestination.taglineTr.trim(),
      showOnHome: editingDestination.showOnHome !== false,
      image:
        !editingDestination.image?.trim() || editingDestination.image.includes('1570939274717-7eda259b50ed')
          ? 'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg'
          : editingDestination.image.trim(),
      popularHighlights: highlightsEn.length > 0 ? highlightsEn : ['Tour Highlight'],
      popularHighlightsTr: highlightsTr.length > 0 ? highlightsTr : ['Tur Noktası'],
    };

    let updatedList: DestinationInfo[];
    const exists = destinations.some((d) => d.id === destToSave.id);
    if (exists) {
      updatedList = destinations.map((d) => (d.id === destToSave.id ? destToSave : d));
    } else {
      updatedList = [...destinations, destToSave];
    }

    setDestinations(updatedList);
    updateDestinationsData(updatedList);
    setIsDestModalOpen(false);
    setEditingDestination(null);
    showToast('Destinasyon başarıyla kaydedildi ve tüm sitede güncellendi!');
  };

  const handleDeleteDestination = (destId: string) => {
    if (confirm('Bu destinasyonu silmek istediğinizden emin misiniz?')) {
      const updatedList = destinations.filter((d) => d.id !== destId);
      setDestinations(updatedList);
      updateDestinationsData(updatedList);
      showToast('Destinasyon silindi.');
    }
  };

  const handleResetDestinations = () => {
    if (confirm('Tüm destinasyonları temizlemek ve listeyi sıfırlamak istiyor musunuz?')) {
      const fresh = resetDestinationsToDefault();
      setDestinations(fresh);
      showToast('Tüm destinasyonlar sıfırlandı.');
    }
  };

  const handleDestImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingDestination) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const result = uploadEvent.target?.result as string;
      if (result) {
        setEditingDestination({ ...editingDestination, image: result });
        showToast('Görsel başarıyla yüklendi!');
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredDestinations = destinations.filter((d) => {
    const term = destSearchTerm.toLowerCase();
    return (
      d.name.toLowerCase().includes(term) ||
      d.nameTr.toLowerCase().includes(term) ||
      d.tagline.toLowerCase().includes(term) ||
      d.taglineTr.toLowerCase().includes(term) ||
      d.id.toLowerCase().includes(term)
    );
  });

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
            <h1 className="text-2xl sm:text-3xl font-serif-luxury font-bold">Gelişmiş Yönetim Paneli</h1>
            <p className="text-xs text-teal-100/80 mt-1">
              {activeTab === 'tours' && (
                <>Toplam kayıtlı tur: <span className="font-bold text-white">{tours.length}</span>. Tur görsellerini yükleyebilir, günleri ekleyebilir ve tüm detayları yönetebilirsiniz.</>
              )}
              {activeTab === 'destinations' && (
                <>Toplam kayıtlı destinasyon: <span className="font-bold text-white">{destinations.length}</span>. Ana sayfa ("Bölgelere Göre Keşfedin") ve Destinasyonlar sayfalarındaki bölgeleri yönetebilirsiniz.</>
              )}
              {activeTab === 'hero' && (
                <>Toplam aktif hero slaytı: <span className="font-bold text-white">{heroSlides.length}</span>. Ana sayfanın tepe bölümündeki kayan görselleri yönetebilirsiniz.</>
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20 flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Siteye Dön</span>
            </Link>

            {activeTab === 'tours' && (
              <>
                <button
                  onClick={handleResetToDefaultTours}
                  className="px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 font-semibold text-xs transition border border-rose-400/40 flex items-center gap-1.5 cursor-pointer"
                  title="Tüm turları temizle ve sıfırla"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-rose-300" />
                  <span>Listeyi Temizle</span>
                </button>
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
              </>
            )}

            {activeTab === 'destinations' && (
              <>
                <button
                  onClick={handleResetDestinations}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition border border-white/20 flex items-center gap-1.5 cursor-pointer"
                  title="Varsayılan 5 destinasyona geri dön"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-teal-300" />
                  <span>Varsayılana Sıfırla</span>
                </button>
                <button
                  onClick={handleCreateNewDestination}
                  className="px-5 py-2.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-bold text-xs transition shadow-lg shadow-[#009999]/30 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Destinasyon Ekle</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-6">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 pb-4">
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
            onClick={() => setActiveTab('destinations')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'destinations'
                ? 'bg-[#009999] text-white shadow-md shadow-[#009999]/20'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Destinasyon Yönetimi ({destinations.length})</span>
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
      ) : activeTab === 'destinations' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-8">
          {/* Header & Search */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 mb-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-serif-luxury font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#009999]" />
                  <span>Destinasyon ve Bölge Yönetimi</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Ana sayfa ("Bölgelere Göre Keşfedin") ve Destinasyonlar sayfasındaki tüm bölgeleri buradan yönetebilir, yeni bölge ekleyebilir veya silebilirsiniz.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
                <button
                  type="button"
                  onClick={handleScanAllToursForDestinations}
                  className="px-4 py-2.5 bg-teal-50 hover:bg-teal-100 text-[#009999] border border-teal-200/80 font-bold rounded-xl text-xs whitespace-nowrap transition cursor-pointer shadow-xs flex items-center gap-2"
                  title="Mevcut tüm turları inceleyip geçen bölgeleri tespit eder ve destinasyonlara ekler"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Turlardan Otomatik Tara & Eşitle</span>
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewDestination}
                  className="px-5 py-2.5 bg-[#009999] hover:bg-[#008080] text-white font-bold rounded-xl text-xs whitespace-nowrap transition cursor-pointer shadow-md shadow-[#009999]/20 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Destinasyon Ekle</span>
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="w-full sm:w-96">
              <input
                type="text"
                value={destSearchTerm}
                onChange={(e) => setDestSearchTerm(e.target.value)}
                placeholder="Destinasyon adı veya etiketine göre ara..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#009999]"
              />
            </div>
          </div>

          {/* Destinations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDestinations.map((dest) => (
              <div
                key={dest.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition group"
              >
                {/* Photo Preview */}
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Homepage Visibility Status Badge */}
                  <div className="absolute top-3 left-3">
                    <button
                      type="button"
                      onClick={(e) => handleToggleDestinationShowOnHome(dest.id, e)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
                        dest.showOnHome !== false
                          ? 'bg-emerald-600/90 hover:bg-emerald-700 text-white border border-emerald-400/40'
                          : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-white/20'
                      }`}
                      title={
                        dest.showOnHome !== false
                          ? 'Ana sayfada gösteriliyor (Gizlemek için tıklayın)'
                          : 'Ana sayfada gizli (Göstermek için tıklayın)'
                      }
                    >
                      {dest.showOnHome !== false ? (
                        <>
                          <Eye className="w-3 h-3 text-emerald-200" />
                          <span>Ana Sayfada</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3 text-slate-400" />
                          <span>Gizli</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/20">
                    {dest.toursCount} Tur
                  </div>
                  <div className="absolute bottom-3 left-3 text-white">
                    <span className="text-[10px] uppercase font-bold text-teal-300 tracking-wider">
                      Bölge Kodu: {dest.id}
                    </span>
                    <h3 className="text-lg font-serif-luxury font-bold leading-tight">
                      {dest.name} <span className="text-sm font-sans font-normal opacity-90">({dest.nameTr})</span>
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs font-medium text-slate-700 mb-1 line-clamp-1" title={dest.tagline}>
                      🇬🇧 {dest.tagline}
                    </div>
                    <div className="text-xs font-medium text-slate-500 line-clamp-1" title={dest.taglineTr}>
                      🇹🇷 {dest.taglineTr}
                    </div>

                    {/* Highlights tags */}
                    <div className="mt-3 pt-3 border-t border-slate-100">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Öne Çıkan Noktalar
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {dest.popularHighlightsTr && dest.popularHighlightsTr.length > 0 ? (
                          dest.popularHighlightsTr.slice(0, 4).map((tag, i) => (
                            <span
                              key={i}
                              className="text-[11px] px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200/60 font-medium"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400 italic">Belirtilmedi</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions & Homepage Visibility Toggle */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                    {/* Direct Homepage Visibility Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleDestinationShowOnHome(dest.id, e)}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border ${
                        dest.showOnHome !== false
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                      title="Ana sayfadaki 'Bölgelere Göre Keşfedin' vitrininde bu bölgeyi göster veya gizle"
                    >
                      {dest.showOnHome !== false ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Ana Sayfada Gösteriliyor</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                          <span>Ana Sayfada Göster (Şu an Gizli)</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditDestination(dest)}
                        className="flex-1 py-2 px-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#009999] text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Düzenle</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDestination(dest.id)}
                        className="py-2 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Destinasyonu Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Sil</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Add Card */}
            <div
              onClick={handleCreateNewDestination}
              className="border-2 border-dashed border-slate-300 hover:border-[#009999] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition min-h-[320px] bg-slate-50/50 hover:bg-teal-50/20 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-[#009999] flex items-center justify-center mb-3 group-hover:scale-110 transition">
                <Plus className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">Yeni Destinasyon Ekle</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Kapadokya, Efes, İstanbul gibi popüler seyahat bölgelerinden bir yenisini listeye dahil edin.
              </p>
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
            {['all', ...Array.from(new Set(tours.map((t) => t.region)))].map((reg: string) => (
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
                {filteredTours.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-slate-500">
                      <p className="font-bold text-sm text-slate-700 mb-1">Kayıtlı tur bulunamadı.</p>
                      <p className="text-xs text-slate-400">Yukarıdaki <strong>"📄 Word (.docx) Dosyasından Tur Yükle"</strong> veya <strong>"Yeni Tur Ekle"</strong> butonuyla ilk turunuzu ekleyebilirsiniz.</p>
                    </td>
                  </tr>
                ) : (
                filteredTours.map((tour) => (
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
                      <button
                        type="button"
                        onClick={(e) => handleToggleFeatured(tour.id, e)}
                        className={`group px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-all duration-200 cursor-pointer shadow-xs active:scale-95 whitespace-nowrap ${
                          tour.featured
                            ? 'bg-emerald-50 hover:bg-rose-50 text-emerald-700 hover:text-rose-700 border border-emerald-300 hover:border-rose-300'
                            : 'bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-700 border border-dashed border-slate-300 hover:border-emerald-400'
                        }`}
                        title={
                          tour.featured
                            ? 'Tıklayarak ana sayfa popüler turlarından kaldırın'
                            : 'Tıklayarak bu turu ana sayfa popüler turlarına ekleyin'
                        }
                      >
                        {tour.featured ? (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600 group-hover:hidden shrink-0" />
                            <X className="w-3.5 h-3.5 text-rose-600 hidden group-hover:inline shrink-0" />
                            <span className="group-hover:hidden font-bold">Popülerde Gösteriliyor</span>
                            <span className="hidden group-hover:inline font-bold">Popülerden Kaldır</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                            <span>Popülere Ekle</span>
                          </>
                        )}
                      </button>
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
                )))}
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
                      <option value="ephesus" />
                      <option value="pamukkale" />
                      <option value="antalya" />
                      <option value="istanbul" />
                      <option value="canakkale" />
                      <option value="troy" />
                      <option value="bodrum" />
                      <option value="fethiye" />
                      <option value="kas" />
                      <option value="trabzon" />
                      <option value="multi-region" />
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

                {/* Real-Time Detected Regions Detection Banner */}
                {detectedRegionsPreview.length > 0 && (
                  <div className="p-3.5 bg-teal-50/90 border border-teal-200 rounded-2xl">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2">
                      <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#009999]" />
                        Turda Otomatik Tespit Edilen Bölgeler ({detectedRegionsPreview.length}):
                      </span>
                      <span className="text-[11px] text-teal-700 font-medium">
                        (Kaydettiğinizde otomatik olarak destinasyonlar listesine eklenecektir)
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {detectedRegionsPreview.map((reg) => {
                        const isExisting = destinations.some(
                          (d) => d.id === reg.id || d.name.toLowerCase() === reg.name.toLowerCase()
                        );
                        return (
                          <span
                            key={reg.id}
                            className={`text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 shadow-2xs ${
                              isExisting
                                ? 'bg-white text-teal-900 border border-teal-300'
                                : 'bg-[#009999] text-white border border-[#008080]'
                            }`}
                          >
                            <span>📍 {reg.nameTr || reg.name}</span>
                            <span className="text-[10px] font-normal opacity-85">
                              {isExisting ? '✓ Kayıtlı' : '+ Yeni Destinasyon'}
                            </span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

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

      {/* Destination Edit / Create Modal */}
      {isDestModalOpen && editingDestination && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-serif-luxury font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#009999]" />
                  <span>
                    {editingDestination.id.startsWith('dest-') && !destinations.some((d) => d.id === editingDestination.id)
                      ? 'Yeni Destinasyon Ekle'
                      : 'Destinasyonu Düzenle'}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bölge adı, fotoğrafı, sloganı ve gezilecek noktalarını buradan güncelleyin.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDestModalOpen(false)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveDestination} className="p-6 space-y-5 text-xs">
              {/* ID & Tour count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Destinasyon Kodu / ID
                  </label>
                  <input
                    type="text"
                    value={editingDestination.id}
                    onChange={(e) => setEditingDestination({ ...editingDestination, id: e.target.value })}
                    placeholder="Örn: cappadocia, istanbul, pamukkale"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-[#009999]"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Küçük harfler ve tire (-) kullanın (URL ve filtreleme için).
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Tur Sayısı (Rozet)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editingDestination.toursCount}
                    onChange={(e) =>
                      setEditingDestination({
                        ...editingDestination,
                        toursCount: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#009999]"
                    required
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Bölge kartının üzerinde görünecek tur sayısı.
                  </span>
                </div>
              </div>

              {/* Names EN & TR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Bölge Adı (İngilizce)
                  </label>
                  <input
                    type="text"
                    value={editingDestination.name}
                    onChange={(e) => setEditingDestination({ ...editingDestination, name: e.target.value })}
                    placeholder="Örn: Cappadocia"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#009999]"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Bölge Adı (Türkçe)
                  </label>
                  <input
                    type="text"
                    value={editingDestination.nameTr}
                    onChange={(e) => setEditingDestination({ ...editingDestination, nameTr: e.target.value })}
                    placeholder="Örn: Kapadokya"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#009999]"
                    required
                  />
                </div>
              </div>

              {/* Taglines EN & TR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Slogan / Açıklama (İngilizce)
                  </label>
                  <textarea
                    rows={2}
                    value={editingDestination.tagline}
                    onChange={(e) => setEditingDestination({ ...editingDestination, tagline: e.target.value })}
                    placeholder="Örn: Fairy Chimneys, Cave Suites & Hot Air Balloons"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#009999]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Slogan / Açıklama (Türkçe)
                  </label>
                  <textarea
                    rows={2}
                    value={editingDestination.taglineTr}
                    onChange={(e) => setEditingDestination({ ...editingDestination, taglineTr: e.target.value })}
                    placeholder="Örn: Peri Bacaları, Mağara Oteller ve Sıcak Hava Balonları"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#009999]"
                  />
                </div>
              </div>

              {/* Image upload & preview */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className="block font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  Destinasyon Görseli
                </label>
                {editingDestination.image && (
                  <div className="relative h-44 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-200">
                    <img
                      src={editingDestination.image}
                      alt="Önizleme"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <input
                    type="text"
                    value={editingDestination.image}
                    onChange={(e) => setEditingDestination({ ...editingDestination, image: e.target.value })}
                    placeholder="Görsel URL yapıştırın (https://...)"
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-[#009999]"
                  />
                  <label className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-[#009999] rounded-xl font-bold border border-teal-200 cursor-pointer whitespace-nowrap transition inline-flex items-center gap-1.5 shrink-0 text-xs">
                    <Upload className="w-3.5 h-3.5" /> Bilgisayardan Yükle
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleDestImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Highlights EN & TR */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Öne Çıkan Noktalar (İngilizce - Virgülle Ayırın)
                  </label>
                  <input
                    type="text"
                    value={highlightsInputEn}
                    onChange={(e) => setHighlightsInputEn(e.target.value)}
                    placeholder="Örn: Hot Air Balloon, Goreme Museum, Underground City"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#009999]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 uppercase tracking-wider text-[11px]">
                    Öne Çıkan Noktalar (Türkçe - Virgülle Ayırın)
                  </label>
                  <input
                    type="text"
                    value={highlightsInputTr}
                    onChange={(e) => setHighlightsInputTr(e.target.value)}
                    placeholder="Örn: Sıcak Hava Balonu, Göreme Müzesi, Yeraltı Şehri"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-[#009999]"
                  />
                </div>
              </div>

              {/* Show on Homepage Toggle Card */}
              <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#009999]" />
                    <span>Ana Sayfada Göster</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Bu destinasyonun ana sayfadaki "Bölgelere Göre Keşfedin" vitrininde listelenmesini sağlar.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingDestination({
                      ...editingDestination,
                      showOnHome: editingDestination.showOnHome === false ? true : false,
                    })
                  }
                  className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                    editingDestination.showOnHome !== false ? 'bg-[#009999]' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      editingDestination.showOnHome !== false ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsDestModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#009999] hover:bg-[#008080] text-white font-bold transition shadow-lg shadow-[#009999]/30 flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Destinasyonu Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
