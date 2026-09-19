export type TourStop = {
  time: string;
  place: string;
  description: string;
};

export type Tour = {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  longDescription: string;
  duration: string;
  groupSize: string;
  price: number;
  priceGroup?: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  badge: string;
  badgeColor: string;
  includes: string[];
  excludes: string[];
  departureTimes: string[];
  meetingPoint: string;
  itinerary: TourStop[];
  highlights: string[];
  languages: string[];
  cancellation: string;
};

export const tours: Tour[] = [
  {
    slug: "sidi-bou-said-carthage",
    name: "Sidi Bou Said & Carthage",
    category: "Historical & Scenic Day Trip",
    tagline: "Explore the jewel of the Mediterranean and the glory of ancient Carthage",
    description:
      "Wander the cobblestone streets of the iconic blue-and-white village of Sidi Bou Said before stepping through millennia at the magnificent ruins of Carthage.",
    longDescription:
      "Begin your morning with a scenic drive along the Gulf of Tunis coastline to the enchanting village of Sidi Bou Said. Perched on a clifftop above the sea, this UNESCO-listed village is a paradise of blue-painted doors, white-washed walls, and cascading bougainvillea. Your expert local guide will lead you through its narrow stone streets, past the famous Café des Nattes, to viewpoints overlooking the shimmering Mediterranean.\n\nIn the afternoon, descend to the ancient city of Carthage — once the mightiest city in the ancient world. Walk through the Tophet (Sanctuary of Punic gods), the baths of Antoninus, the Carthaginian residential quarter, and the stunning hilltop Byrsa Museum with its panoramic views.",
    duration: "Full Day (8–9 hours)",
    groupSize: "Up to 12 people",
    price: 65,
    priceGroup: 420,
    rating: 4.9,
    reviewCount: 312,
    image: "/hero-sidi-bou-said.jpg",
    gallery: ["/hero-sidi-bou-said.jpg", "/hero-riad.jpg", "/tour-dougga.jpg"],
    badge: "Most Popular",
    badgeColor: "bg-terracotta-warmth",
    includes: [
      "Professional English/French/Arabic speaking guide",
      "Round-trip transport from Hotel Karim",
      "All entrance fees (Sidi Bou Said + Carthage sites)",
      "Traditional mint tea at Café des Nattes",
      "Bottled water throughout",
    ],
    excludes: ["Lunch & personal meals", "Personal shopping", "Gratuities"],
    departureTimes: ["08:00 AM", "09:00 AM"],
    meetingPoint: "Hotel Karim lobby",
    languages: ["English", "French", "Arabic"],
    cancellation: "Free cancellation up to 24 hours before departure",
    highlights: [
      "Visit the iconic blue-and-white village of Sidi Bou Said",
      "Traditional mint tea at Café des Nattes",
      "Explore the UNESCO-listed ruins of ancient Carthage",
      "Panoramic Mediterranean sea views",
      "Byrsa Hill Museum with original Punic artifacts",
    ],
    itinerary: [
      { time: "08:00", place: "Hotel Karim Departure", description: "Pick up from Hotel Karim lobby. Your private air-conditioned vehicle departs along the picturesque Gulf of Tunis." },
      { time: "08:45", place: "Sidi Bou Said Village", description: "Arrive in the magical blue-and-white hilltop village. Free exploration of narrow alleys, artisan shops, and panoramic sea viewpoints." },
      { time: "10:00", place: "Café des Nattes", description: "Enjoy a traditional Tunisian mint tea with pine nuts at the legendary clifftop café, a staple of Tunisian cultural life since 1914." },
      { time: "10:45", place: "Drive to Carthage", description: "A short 10-minute drive brings you to the ancient Carthaginian ruins on the slopes of Byrsa Hill." },
      { time: "11:00", place: "Carthage Ruins", description: "Guided tour of the Tophet, Baths of Antoninus (largest Roman baths in Africa), Roman villas, and Punic ports." },
      { time: "13:00", place: "Byrsa Museum", description: "Explore the hilltop National Museum of Carthage with breathtaking panoramic views over the Gulf of Tunis." },
      { time: "13:30", place: "Lunch Break (Optional)", description: "Free time for lunch at a local restaurant in Carthage (own expense). Your guide can recommend the best local spots." },
      { time: "14:30", place: "Return to Hotel", description: "Private transfer back to Hotel Karim, arriving approximately 15:30." },
    ],
  },
  {
    slug: "dougga-zaghouan",
    name: "Dougga & Zaghouan",
    category: "UNESCO Archaeological Tour",
    tagline: "Walk through one of Africa's best-preserved Roman cities",
    description:
      "Explore the magnificent UNESCO-listed ruins of Dougga, one of the best-preserved Roman cities in North Africa, then visit the dramatic aqueduct temple of Zaghouan.",
    longDescription:
      "Journey through the verdant Tunisian countryside to reach Dougga — often called the 'Pompeii of North Africa.' This remarkably well-preserved ancient city perches dramatically on a hilltop surrounded by olive groves and rolling green hills. Your expert archaeologist guide will bring history to life as you walk through its Capitol Temple, Theatre, Forum, public baths, and intimate residential streets.\n\nAfterward, visit the spectacular Temple of Waters at Zaghouan — the dramatic source of the ancient Roman aqueduct that once supplied water to Carthage over 100km away. The temple is set dramatically against towering limestone cliffs, making it one of Tunisia's most photogenic sites.",
    duration: "Full Day (9–10 hours)",
    groupSize: "Up to 10 people",
    price: 75,
    priceGroup: 480,
    rating: 4.8,
    reviewCount: 187,
    image: "/tour-dougga.jpg",
    gallery: ["/tour-dougga.jpg", "/hero-riad.jpg", "/hero-sidi-bou-said.jpg"],
    badge: "UNESCO Heritage",
    badgeColor: "bg-mediterranean-blue",
    includes: [
      "Specialized archaeologist or historian guide",
      "Round-trip transport from Hotel Karim",
      "Dougga & Zaghouan entrance fees",
      "Picnic lunch with traditional Tunisian dishes",
      "Bottled water & refreshments",
    ],
    excludes: ["Personal shopping", "Extra snacks or drinks", "Gratuities"],
    departureTimes: ["07:30 AM", "08:00 AM"],
    meetingPoint: "Hotel Karim lobby",
    languages: ["English", "French", "Arabic", "German"],
    cancellation: "Free cancellation up to 48 hours before departure",
    highlights: [
      "UNESCO World Heritage site of Dougga",
      "Towering Capitol Temple and Roman Theatre",
      "Dramatic Temple of Waters at Zaghouan",
      "Expert archaeologist guide",
      "Tunisian countryside scenic drive",
    ],
    itinerary: [
      { time: "07:30", place: "Hotel Karim Departure", description: "Early departure to beat the midday heat. Scenic drive northwest through the Tunisian countryside." },
      { time: "09:30", place: "Dougga Archaeological Site", description: "Arrive at the UNESCO World Heritage Site. Begin guided walk through the monumental Capitol Temple, dedicated to Jupiter, Juno, and Minerva." },
      { time: "10:30", place: "Roman Theatre & Forum", description: "Visit the remarkably preserved 3,500-seat Roman theatre, the market square, and the iconic Libyo-Punic Mausoleum." },
      { time: "11:30", place: "Residential Quarter & Baths", description: "Explore the Baths of Caracalla, the Baths of Licinius, and the beautifully mosaiced residential houses." },
      { time: "12:30", place: "Picnic Lunch", description: "Traditional Tunisian picnic lunch with brik, salad, olives, and seasonal fruit served amidst the olive groves." },
      { time: "13:30", place: "Drive to Zaghouan", description: "45-minute drive through scenic mountain roads to the Temple of Waters." },
      { time: "14:30", place: "Temple of Waters, Zaghouan", description: "Visit the dramatic nymphaeum — source of the ancient Roman aqueduct — set against towering limestone cliffs. Exceptional photo opportunity." },
      { time: "15:30", place: "Return to Hotel", description: "Scenic return drive to Hotel Karim, arriving approximately 17:00." },
    ],
  },
  {
    slug: "sahara-desert",
    name: "Tozeur & Sahara Desert",
    category: "Desert Safari",
    tagline: "Ride camels at dusk and sleep under a billion stars",
    description:
      "Journey to the edge of the Sahara for an unforgettable desert safari. Explore the oasis city of Tozeur, ride camels over golden dunes, and spend the night in a luxury desert camp.",
    longDescription:
      "This epic 2-day adventure takes you deep into the heart of southern Tunisia. Begin with a morning flight or scenic drive to Tozeur — a magnificent oasis city of 400,000 palm trees and a stunning old medina built entirely from sun-baked brick. Your guide will lead you through the ancient Ouled el Hadef quarter, the extraordinary Chak Wak theme park with its life-size dinosaur models, and the dramatic Mides canyon.\n\nIn the afternoon, cross into the Sahara Desert for your camel trek across the golden Erg Chebbi dunes. Watch the sun sink below the horizon in an explosion of orange and purple, then settle into your luxury Berber desert camp for a traditional dinner, live music, and a night beneath an extraordinary canopy of stars. The 3-day option includes a visit to the Star Wars filming location at Matmata and the iconic salt lake of Chott el Jerid.",
    duration: "2 Days / 3 Days",
    groupSize: "Up to 8 people",
    price: 220,
    priceGroup: 1400,
    rating: 5.0,
    reviewCount: 94,
    image: "/hero-sahara.jpg",
    gallery: ["/hero-sahara.jpg", "/tour-dougga.jpg", "/hero-sidi-bou-said.jpg"],
    badge: "Premium",
    badgeColor: "bg-golden-sun-gold",
    includes: [
      "Return transport from Tunis (air-conditioned 4WD)",
      "1 night luxury Berber desert camp (full board)",
      "Camel trek at sunset",
      "Professional bilingual desert guide",
      "Tozeur city guided tour",
      "Mides canyon & Chebika oasis visits",
      "All meals (Day 1 & Day 2)",
      "Bottled water throughout",
    ],
    excludes: ["Personal items & souvenirs", "Alcoholic beverages", "Flight tickets (if applicable)", "Gratuities"],
    departureTimes: ["07:00 AM"],
    meetingPoint: "Hotel Karim lobby",
    languages: ["English", "French", "Arabic"],
    cancellation: "Free cancellation up to 72 hours before departure",
    highlights: [
      "Sahara sunset camel trek",
      "Luxury Berber desert camp under the stars",
      "Tozeur oasis city & ancient medina",
      "Dramatic Mides canyon & Chebika oasis",
      "Chott el Jerid salt lake (3-day option)",
      "Star Wars filming locations at Matmata",
    ],
    itinerary: [
      { time: "07:00", place: "Hotel Karim Departure", description: "Early morning departure in a comfortable 4WD vehicle for the 5-hour drive south to the Sahara." },
      { time: "09:30", place: "Chott el Jerid", description: "Stop at Tunisia's vast salt lake — an otherworldly landscape of shimmering white salt flats stretching to the horizon." },
      { time: "11:00", place: "Tozeur City Tour", description: "Guided walk through the ancient Ouled el Hadef quarter with its extraordinary 14th-century brick architecture." },
      { time: "13:00", place: "Oasis Lunch", description: "Traditional lunch in a local restaurant shaded by 400,000 palm trees of the Tozeur oasis." },
      { time: "14:30", place: "Mides Canyon & Chebika Oasis", description: "Visit Tunisia's most dramatic canyon with its turquoise waterfall pool, and the mountain oasis of Chebika perched on clifftops." },
      { time: "17:00", place: "Sahara Camel Trek", description: "Mount your camel for the legendary sunset trek across the golden Erg Chebbi sand dunes. Watch the sky turn orange, pink, and deep purple." },
      { time: "19:00", place: "Luxury Desert Camp", description: "Arrive at your luxury Berber tent camp. Traditional Tunisian dinner, live Bedouin music, and fire under a sky of a billion stars." },
      { time: "08:00", place: "Day 2 — Return Journey", description: "After breakfast, explore the dunes at dawn. Return journey to Tunis, arriving at Hotel Karim by 14:00." },
    ],
  },
  {
    slug: "custom-itinerary",
    name: "Custom Itinerary",
    category: "Bespoke Private Tour",
    tagline: "Your dream Tunisian journey, designed exclusively for you",
    description:
      "Work with our expert team to design a completely personalized Tunisian experience, tailored to your interests, schedule, and group size.",
    longDescription:
      "Have a specific destination in mind? Want to combine multiple sites in one seamless journey? Our concierge team will work with you to craft a completely bespoke itinerary — from a private Medina food tour in Tunis to a photography expedition to the remote Ksar Ouled Soltane. Whatever your dream Tunisian adventure, we will make it happen.",
    duration: "Flexible (Half Day to Multi-Day)",
    groupSize: "1–20+ people",
    price: 0,
    rating: 5.0,
    reviewCount: 48,
    image: "/hero-riad.jpg",
    gallery: ["/hero-riad.jpg", "/hero-sidi-bou-said.jpg", "/hero-sahara.jpg"],
    badge: "Bespoke",
    badgeColor: "bg-slate-700",
    includes: ["Fully customizable", "Expert private guide", "Private transport", "All logistics handled by our team"],
    excludes: ["Varies by itinerary"],
    departureTimes: ["Flexible"],
    meetingPoint: "Hotel Karim lobby or custom",
    languages: ["English", "French", "Arabic", "German", "Italian", "Spanish"],
    cancellation: "Flexible — discuss with our team",
    highlights: [
      "100% personalized itinerary",
      "Private vehicle and guide",
      "Any combination of Tunisian destinations",
      "Perfect for families, couples, and groups",
    ],
    itinerary: [
      { time: "TBD", place: "Consultation", description: "Our team will work with you to understand your interests, available time, and group requirements." },
      { time: "TBD", place: "Itinerary Design", description: "We craft a detailed day-by-day itinerary with transparent pricing and full logistics." },
      { time: "TBD", place: "Your Journey Begins", description: "Sit back and enjoy while we handle every detail — transfers, guides, tickets, meals, and accommodation." },
    ],
  },
];
