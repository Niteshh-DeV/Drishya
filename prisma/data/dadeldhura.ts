/**
 * Dadeldhura — destination content (11 entries), converted from
 * Dadeldhura_District_google-doc.docx.
 *
 * Unlike Baitadi/Bajura, this source doc is a research draft: several entries
 * have no verified coordinates, fees or hours. Those fields are left out on
 * purpose (never guessed) and named in each entry's `verify` list.
 */
import type { Destination } from "@/lib/types";

export const dadeldhuraDestinations: Destination[] = [
  {
    id: "dadeldhura-ugratara",
    slug: "ugratara-temple",
    districtId: "dadeldhura",
    name: "Ugratara Temple",
    category: ["Temple", "Religious Site", "Cultural Heritage"],
    nearestTown: "Dadeldhura/Amargadhi Bazaar; about 5 km from Dadeldhura town",
    // From OpenStreetMap/Mapcarta — confirm the entrance pin in Google Maps.
    position: [29.33462, 80.6036],
    elevationM: 1600,

    interestTags: ["Religious", "Culture", "History", "Relaxation"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    budget: "Low",
    hiddenGem: false,
    hiddenGemReason: "Famous Shaktipeeth.",

    shortDescription:
      "Ugratara Temple is a famous Shaktipeeth in Dadeldhura dedicated to Goddess Ugratara. The temple is an important religious and cultural destination in Sudurpaschim.",
    longDescription:
      "The temple is located near Dadeldhura headquarters and is known for its two-storey pagoda-style architecture. A large fair is held around the full moon of Kartik, attracting devotees and visitors.",
    bestFor: "Pilgrims, families, photographers, culture lovers",

    howToGetThere:
      "Bus/private vehicle from Dadeldhura Bazaar; road access is available.",
    openingHours:
      "A current map listing shows approximately 6:30 AM–8:30 PM; verify locally.",
    nearbyStaysFood:
      "Dadeldhura/Amargadhi Bazaar has hotels, lodges and restaurants. The provincial tourism plan reports many hotels/lodges in Amargadhi.",
    safetyNotes: "Respect religious rules; crowded during festivals.",

    alternateNames: ["Ugratara Bhagawati Temple", "Ugratara Bhagawati", "Ugratara Mata"],
    culturalNote:
      "Regarded as one of the important Shakti pilgrimage sites of Far-Western Nepal.",
    verify: ["position", "entryFee", "openingHours"],
  },

  {
    id: "dadeldhura-amargadhi-fort",
    slug: "amargadhi-fort",
    districtId: "dadeldhura",
    name: "Amargadhi Fort",
    category: ["Historical Site"],
    nearestTown: "Dadeldhura/Amargadhi Bazaar",
    position: [29.29952, 80.58583],
    elevationM: 1700,

    interestTags: ["History", "Culture", "Nature"],
    bestSeasons: ["Spring", "Autumn", "Winter"],
    budget: "Low",
    hiddenGem: false,
    hiddenGemReason: "Famous; one of Dadeldhura's major tourism attractions.",

    shortDescription:
      "Amargadhi Fort is a historic military fort in Dadeldhura associated with the Nepal–British war period.",
    longDescription:
      "The fort is an important historical attraction of Dadeldhura and is associated with General Amar Singh Thapa and Nepal's military history. The provincial tourism plan identifies it as one of Dadeldhura's major tourism attractions.",
    bestFor: "History lovers, photographers, students, families",

    howToGetThere: "Road access from Dadeldhura Bazaar.",
    openingHours:
      "No reliable official visitor schedule found; a current map listing shows it as open 24 hours, which should not be treated as official.",
    nearbyStaysFood: "Dadeldhura Bazaar/Amargadhi.",
    safetyNotes: "Be careful around old structures and uneven ground.",

    alternateNames: ["Amargadhi Killa"],
    culturalNote:
      'The provincial tourism plan describes Amargadhi Fort as the "only living fort" and lists sightseeing at the fort as an established tourism activity.',
    verify: ["entryFee", "openingHours"],
  },

  {
    id: "dadeldhura-ajaymerukot",
    slug: "ajaymerukot",
    districtId: "dadeldhura",
    name: "Ajaymerukot",
    category: ["Historical Site", "Archaeological Site"],
    nearestTown: "Amargadhi/Dadeldhura Bazaar",
    // Approximate, for the historical fort site.
    position: [29.304, 80.591],
    // ~1,313 m is reported for the nearby Ajaymerukot locality only — not the fort, so omitted.

    interestTags: ["History", "Culture", "Adventure", "Trekking"],
    bestSeasons: ["Spring", "Autumn", "Winter"],
    budget: "Low",
    hiddenGem: false,
    hiddenGemReason: "An emerging historical attraction.",

    shortDescription:
      "Ajaymerukot is an ancient historical and archaeological site connected with the history of the former Doti kingdom.",
    longDescription:
      "The site contains remains associated with ancient settlement and royal history. The provincial tourism plan identifies Ajaymerukot as one of Dadeldhura's important archaeological attractions.",
    bestFor: "History lovers, hikers, photographers, students",

    howToGetThere:
      "Road/vehicle toward Ajaymeru, followed by walking depending on the exact site/route. Older local reporting describes approximately a two-hour walk from Dadeldhura headquarters.",
    nearbyStaysFood: "Dadeldhura/Amargadhi.",
    safetyNotes:
      "Carry water and suitable footwear; some sections can be uneven.",

    alternateNames: [],
    culturalNote:
      "Listed alongside Amargadhi Fort as a major archaeological sightseeing site in the provincial tourism plan.",
    verify: ["elevationM", "entryFee", "openingHours"],
  },

  {
    id: "dadeldhura-alital",
    slug: "ali-tal",
    districtId: "dadeldhura",
    name: "Ali Tal",
    category: ["Lake & Wetland"],
    nearestTown: "Alital Rural Municipality",
    position: [29.14075, 80.46773],
    elevationM: 789,

    interestTags: ["Nature", "Relaxation", "Wildlife", "Culture"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    budget: "Medium",
    hiddenGem: false,
    hiddenGemReason: "Famous; one of Dadeldhura's major natural attractions.",

    shortDescription:
      "Ali Tal is a large natural lake surrounded by forests and hills in Dadeldhura.",
    longDescription:
      "The lake is one of Dadeldhura's major natural tourism attractions. Visitors can enjoy boating, photography, picnicking and nature observation. The local government describes the area as a peaceful natural destination surrounded by greenery.",
    bestFor: "Families, photographers, nature lovers, couples",

    howToGetThere:
      "Road from Dadeldhura toward Alital; access is also connected with the Budar–Jogbuda road area.",
    openingHours: "No fixed official hours found.",
    nearbyStaysFood:
      "Local accommodation/homestays are available; the provincial plan notes homestays near Alital.",
    safetyNotes: "Road conditions can become difficult during monsoon.",

    alternateNames: ["Alital"],
    culturalNote:
      'Local tradition gives an explanation for the name "Alital," relating it to an area where water accumulated.',
    verify: ["entryFee"],
  },

  {
    id: "dadeldhura-parshuram-dham",
    slug: "parshuram-dham",
    districtId: "dadeldhura",
    name: "Parshuram Dham",
    category: ["Religious Site", "Cultural Heritage"],
    nearestTown:
      "Jogbuda / Parshuram Municipality, Ward 5 (Parigaun/Jogbuda area), on the Mahakali River near the Nepal–India border",
    position: null,

    interestTags: ["Religious", "Culture", "History", "Nature"],
    bestSeasons: ["Winter", "Spring", "Autumn"],
    budget: "Low-Medium",
    hiddenGem: false,
    hiddenGemReason: "Famous pilgrimage site.",

    shortDescription:
      "Parshuram Dham is an important religious pilgrimage site located near the Mahakali River in Dadeldhura.",
    longDescription:
      "According to religious tradition, Parshuram, the son of Jamadagni and Renuka, performed meditation and penance at this sacred area. The site becomes particularly important during religious festivals, including Makar Sankranti.",
    bestFor: "Pilgrims, families, culture lovers, photographers",

    howToGetThere: "Road access through Jogbuda/Parshuram Municipality.",
    nearbyStaysFood: "Jogbuda and surrounding local settlements.",
    safetyNotes:
      "River areas require caution, especially during high-water periods.",

    alternateNames: [],
    culturalNote:
      "A major Makar Sankranti bathing fair is held here, attracting devotees.",
    verify: ["position", "entryFee", "openingHours"],
  },

  {
    id: "dadeldhura-shayal-waterfall",
    slug: "shayal-waterfall",
    districtId: "dadeldhura",
    name: "Shayal Waterfall",
    nameNepali: "सायल झरना",
    category: ["Waterfall"],
    nearestTown: "Rupal, Bhageshwar Rural Municipality-1 (Sayal/Rupal area)",
    position: null,

    interestTags: ["Nature", "Adventure", "Trekking", "Relaxation"],
    bestSeasons: ["Summer", "Autumn", "Spring"],
    budget: "Low-Medium",
    hiddenGem: true,
    hiddenGemReason:
      "Hidden / lesser-known. The local government lists it as a major attraction of Bhageshwar Rural Municipality, but it is still under-promoted.",

    shortDescription:
      "Shayal Waterfall is a scenic waterfall in the remote Rupal/Sayal area of Dadeldhura.",
    longDescription:
      "The waterfall is surrounded by natural scenery and is still relatively under-promoted. Recent reporting places it about 60 km from Dadeldhura Bazaar and describes the final road as difficult.",
    bestFor: "Adventure travelers, photographers, hikers, nature lovers",

    howToGetThere:
      "Dadeldhura → Bhageshwar/Rupal → local road → walking section. One report describes a 15–20 minute walk after reaching Puniut, while another describes the route through Rupal/Liwud.",
    nearbyStaysFood:
      "Local villages; formal tourist accommodation may be limited.",
    safetyNotes:
      "Difficult rural road, slippery rocks and limited facilities. Avoid during dangerous monsoon conditions.",

    alternateNames: ["Shayal Jharana", "Sayal Waterfall", "Rupali Gad Waterfall"],
    verify: ["position", "entryFee", "openingHours"],
  },

  {
    id: "dadeldhura-kasyadanda",
    slug: "kasyadanda",
    districtId: "dadeldhura",
    name: "Kasyadanda",
    category: ["Viewpoint", "Mountain & Trek"],
    nearestTown: "Amargadhi Municipality-7; reached from the Surkhal area",
    position: null,

    interestTags: ["Nature", "History", "Culture", "Relaxation"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    budget: "Low",
    hiddenGem: true,
    hiddenGemReason: "Emerging / lesser-known.",

    shortDescription:
      "Kasyadanda is a hilltop viewpoint offering sunrise and sunset views over parts of Dadeldhura and surrounding municipalities.",
    longDescription:
      "The viewpoint has recently attracted increasing domestic visitors. From the hill, visitors can see areas of Amargadhi, Navadurga, Ganyapdhura and Ajaymeru.",
    bestFor: "Photographers, couples, families, sunrise/sunset lovers",

    howToGetThere:
      "Travel toward Surkhal and walk uphill for about 15 minutes.",
    entryFee: "No fee reported.",
    openingHours: "No fixed hours.",
    nearbyStaysFood: "Dadeldhura/Amargadhi Bazaar.",
    safetyNotes: "Visit in daylight and use care on the walking trail.",

    alternateNames: ["Kasyā Dā̃ḍā"],
    verify: ["position"],
  },

  {
    id: "dadeldhura-joshina-jharana",
    slug: "joshina-jharana",
    districtId: "dadeldhura",
    name: "Joshina Jharana",
    category: ["Waterfall"],
    nearestTown: "Gankhet, Alital area",
    position: null,

    interestTags: ["Nature", "Adventure", "Trekking"],
    bestSeasons: [],
    budget: "Low",
    hiddenGem: true,
    hiddenGemReason: "Potential hidden gem.",

    // The source gives no description; this only restates its category and location.
    shortDescription: "A waterfall in the Gankhet area near Alital.",
    safetyNotes:
      "Treat as a natural waterfall with slippery terrain; verify local seasonal conditions.",

    alternateNames: ["Jaisni Jharana"],
    verify: [
      "position",
      "bestSeasons",
      "description",
      "entryFee",
      "openingHours",
      "nearbyStaysFood",
    ],
  },

  {
    id: "dadeldhura-raniban",
    slug: "raniban",
    districtId: "dadeldhura",
    name: "Raniban",
    category: ["Forest & Wildlife"],
    position: null,

    interestTags: ["Nature", "Wildlife", "Trekking", "Relaxation"],
    bestSeasons: ["Spring", "Autumn", "Winter"],
    budget: "Low",
    hiddenGem: true,
    hiddenGemReason: "Lesser-known.",

    shortDescription:
      "Forested natural area suitable for nature walks, photography and experiencing local biodiversity.",
    // Long description deliberately pending in the source until the location is confirmed.
    bestFor: "Nature lovers, photographers, hikers",

    safetyNotes:
      "Forest-trail precautions; check local conditions and avoid traveling alone in unfamiliar areas.",

    alternateNames: [],
    verify: [
      "nearestTown",
      "position",
      "longDescription",
      "entryFee",
      "openingHours",
      "nearbyStaysFood",
    ],
  },

  {
    id: "dadeldhura-ashigram",
    slug: "ashigram-temple",
    districtId: "dadeldhura",
    name: "Ashigram Temple",
    category: ["Temple", "Religious Site", "Cultural Heritage"],
    nearestTown: "Dadeldhura/Amargadhi area",
    // The Ashigram *locality* is at 29.22998, 80.65376, but that is not necessarily
    // the temple — the source says not to enter a temple coordinate yet.
    position: null,

    interestTags: ["Religious", "Culture", "History", "Relaxation"],
    bestSeasons: ["Spring", "Autumn", "Winter"],
    budget: "Low",
    hiddenGem: true,
    hiddenGemReason: "Less-known / local attraction.",

    shortDescription:
      "Ashigram Temple is a local Hindu religious site in Dadeldhura associated with the traditional religious and cultural practices of the surrounding community.",
    longDescription:
      "Ashigram Temple is situated in the Dadeldhura region and represents the local religious traditions of Sudurpaschim.",
    bestFor: "Pilgrims, families, photographers, culture lovers",

    howToGetThere:
      "Road access from Dadeldhura/Amargadhi followed by local travel depending on the exact temple.",
    openingHours:
      "No reliable official schedule found; a current Google Maps listing shows 24-hour availability, which should not be treated as an official temple schedule.",
    nearbyStaysFood: "Dadeldhura/Amargadhi area.",
    safetyNotes: "Respect temple customs and local religious practices.",

    alternateNames: ["Ashigram Mandir"],
    culturalNote:
      "Ashigram is an old administrative/local place name in Dadeldhura; it was among the district's former VDCs before Nepal's administrative restructuring. It is also the name of the surrounding locality, so be careful when choosing a map pin.",
    verify: ["position", "entryFee", "openingHours"],
  },

  {
    id: "dadeldhura-ghatal",
    slug: "ghatal-temple",
    districtId: "dadeldhura",
    name: "Ghatal Temple",
    category: ["Temple", "Religious Site", "Cultural Heritage"],
    nearestTown: "Amargadhi / Dadeldhura Bazaar",
    // Mapped specifically for Ghatal Than, not just the surrounding locality.
    position: [29.27845, 80.55988],
    elevationM: 1583,

    interestTags: ["Religious", "Culture", "History", "Relaxation"],
    bestSeasons: ["Spring", "Autumn", "Winter"],
    budget: "Low",
    hiddenGem: false,
    hiddenGemReason: "Locally well-known; a major local attraction.",

    shortDescription:
      "Ghatal Temple is an important Hindu religious and cultural site in Amargadhi, Dadeldhura, associated with local traditions and festivals.",
    longDescription:
      "Ghatal Than is one of the culturally significant religious sites of Dadeldhura. It is associated with traditional worship and local festivals and forms part of the region's cultural heritage. A government-supported linguistic/cultural survey also describes Ghatal Mandir as an ancient Hindu temple connected with the historical Doti cultural region.",
    bestFor:
      "Pilgrims, families, culture lovers, photographers and visitors interested in local traditions.",

    howToGetThere: "Road access from Amargadhi/Dadeldhura Bazaar.",
    openingHours:
      "No official fixed schedule found; a current map listing indicates the temple is open 24 hours, but verify locally.",
    nearbyStaysFood: "Amargadhi/Dadeldhura Bazaar.",
    safetyNotes: "Follow temple rules; festival periods can be crowded.",

    alternateNames: ["Ghatal Than", "Ghatal Baba", "Ghatal Baba Temple", "Ghatal Mandir"],
    culturalNote:
      "Ghatal Mandir is described as an ancient Hindu temple connected to the history of the Doti cultural region.",
    verify: ["entryFee", "openingHours"],
  },
];

export function getDadeldhuraDestination(slug: string): Destination | undefined {
  return dadeldhuraDestinations.find((d) => d.slug === slug);
}