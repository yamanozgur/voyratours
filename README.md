# Voyra Tours 🏛️✈️

> **Curated Turkey Travel Experiences & Bespoke Boutique Tours**  
> TÜRSAB Licensed boutique tour operator specializing in domestic flight-inclusive travel packages, cave suites in Cappadocia, Greco-Roman antiquities in Ephesus, and tailor-made Anatolian odysseys.

---

## 🌟 Key Features

- **Multi-Page Architecture (`react-router-dom`)**:
  - **Home (`/`)**: Sunlit Cappadocia sunrise Hero with instant trip finder, Bestselling Popular Tours showcase, Regional Destination cards, and Bespoke custom tour planner banner.
  - **Tours & Packages (`/tours`)**: Interactive catalog with real-time region, duration, group type, and keyword search filters.
  - **Destinations Guide (`/destinations`)**: In-depth profiles for Cappadocia, Ephesus & Pamukkale, Istanbul, Gallipoli & Troy, and Antalya.
  - **Tailor-Made Trip Planner (`/tailor-made`)**: Interactive step-by-step bespoke travel designer with hotel tier selection, interest tags, and direct inquiry submission.
  - **Why Voyra (`/why-voyra`)**: 6 pillars of boutique trust, TÜRSAB licensing assurance, and comparison matrix with mass-market group tours.
  - **FAQ (`/faq`)**: Transparent Q&A on sunrise balloon bookings, flight tickets, baggage, and booking policies.
  - **Contact (`/contact`)**: Sultanahmet headquarters details, Google Maps directions, live hours, and instant inquiry form.

- **Dual-Language & Multi-Currency**:
  - Full English (`en`) and Turkish (`tr`) localization with smooth real-time toggle.
  - Live currency selector for EUR (€), USD ($), TRY (₺), and GBP (£).

- **Brand & Design Identity**:
  - **Primary Brand Color**: Dark Turquoise (`#009999`) with subtle mint accents.
  - **Typography**: Clean, modern, high-contrast **Montserrat** throughout.
  - **Responsive & Compact UI**: Refined tour cards and destination cards optimized for desktop, tablet, and mobile displays.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Bundler / Dev Server**: Vite 6
- **Routing**: React Router 7
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Animations**: Motion

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-username/voyra-tours.git
cd voyra-tours
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:3000`.

### 4. Build for production
```bash
npm run build
```
Production assets are generated in the `dist/` directory.

### 5. Preview production build
```bash
npm run preview
```

### 6. Run TypeScript Lint
```bash
npm run lint
```

---

## 📁 Project Structure

```text
├── public/                 # Static assets and icons
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── TourCard.tsx
│   │   ├── DestinationsSection.tsx
│   │   ├── TourDetailModal.tsx
│   │   ├── TailorMadePlanner.tsx
│   │   ├── WhyVoyra.tsx
│   │   ├── FAQSection.tsx
│   │   ├── Footer.tsx
│   │   ├── ScrollToTop.tsx
│   │   └── WhatsAppFloatingButton.tsx
│   ├── pages/              # Multi-page route views
│   │   ├── HomePage.tsx
│   │   ├── ToursPage.tsx
│   │   ├── DestinationsPage.tsx
│   │   ├── TailorMadePage.tsx
│   │   ├── WhyVoyraPage.tsx
│   │   ├── FAQPage.tsx
│   │   └── ContactPage.tsx
│   ├── data/
│   │   └── toursData.ts    # Comprehensive tour packages & destination data
│   ├── utils/
│   │   └── currency.ts     # Currency conversion and formatting utilities
│   ├── types.ts            # Global TypeScript interfaces & types
│   ├── App.tsx             # Main router & modal container
│   ├── main.tsx            # React root & BrowserRouter entrypoint
│   └── index.css           # Tailwind CSS & Montserrat styling
├── index.html              # HTML entry point with Montserrat fonts & meta tags
├── package.json            # Project manifest & scripts
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
└── README.md
```

---

## 📄 License
MIT © Voyra Tours
