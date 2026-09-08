export type Currency = 'EUR' | 'USD' | 'TRY' | 'GBP';
export type Language = 'en' | 'tr';

export interface ItineraryDay {
  day: number;
  title: string;
  titleTr: string;
  description: string;
  descriptionTr: string;
  meals: string[];
  mealsTr: string[];
  highlights: string[];
  highlightsTr: string[];
  overnight: string;
  overnightTr: string;
}

export interface TourPackage {
  id: string;
  slug: string;
  title: string;
  titleTr: string;
  subtitle: string;
  subtitleTr: string;
  destination: string;
  destinationTr: string;
  region: 'cappadocia' | 'istanbul' | 'aegean-ephesus' | 'gallipoli' | 'mediterranean' | 'black-sea' | 'multi-region';
  durationDays: number;
  durationNights: number;
  priceEUR: number; // Base price per person in EUR
  originalPriceEUR?: number;
  rating: number;
  reviewsCount: number;
  groupType: 'Small Group' | 'Private VIP' | 'Customizable';
  groupTypeTr: 'Küçük Grup' | 'Özel VIP' | 'Kişiye Özel';
  heroImage: string;
  galleryImages: string[];
  badge?: string;
  badgeTr?: string;
  featured?: boolean;
  overview: string;
  overviewTr: string;
  highlights: string[];
  highlightsTr: string[];
  included: string[];
  includedTr: string[];
  excluded: string[];
  excludedTr: string[];
  itinerary: ItineraryDay[];
  hotelType: string;
  hotelTypeTr: string;
  departure: string;
  departureTr: string;
}

export interface DestinationInfo {
  id: string;
  name: string;
  nameTr: string;
  tagline: string;
  taglineTr: string;
  image: string;
  toursCount: number;
  popularHighlights: string[];
  popularHighlightsTr: string[];
}

export interface ReviewItem {
  id: string;
  author: string;
  country: string;
  countryFlag: string;
  tourTaken: string;
  tourTakenTr: string;
  rating: number;
  date: string;
  comment: string;
  commentTr: string;
  avatar: string;
}

export interface BookingInquiry {
  tourId: string;
  tourTitle: string;
  fullName: string;
  email: string;
  phone: string;
  travelDate: string;
  adults: number;
  children: number;
  tourOption: 'group' | 'private';
  addOnBalloon: boolean;
  specialRequests: string;
}
