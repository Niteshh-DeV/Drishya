/**
 * Achham — destination content (10 entries), converted from ACHHAM.docx.
 *
 * Like the Dadeldhura doc, this source is a research draft: many fees, hours
 * and coordinates are marked "verify locally". Those fields are left out on
 * purpose (never guessed) and named in each entry's `verify` list. Where the
 * doc only gives locality or park-wide coordinates, `position` is null.
 */
import type { Destination } from "@/lib/types";

export const achhamDestinations: Destination[] = [
  {
    id: "achham-ramaroshan",
    slug: "ramaroshan",
    districtId: "achham",
    name: "Ramaroshan",
    category: ["Lake & Wetland", "Forest & Wildlife", "Viewpoint", "Cultural Heritage"],
    nearestTown:
      "Mangalsen (Achham headquarters), or Sanfebagar / Campu Bazaar",
    // Source marks this as approximate (also gives 29.2333, 81.4667).
    position: [29.2322, 81.4693],
    elevationM: 2500,

    interestTags: ["Nature", "Adventure", "Culture", "Wildlife", "Trekking", "Relaxation"],
    bestSeasons: ["Spring", "Autumn"],
    bestTimeNote:
      "Best before the monsoon in spring or after it in autumn, around Dashain. Winter brings heavy frost and snow, and monsoon trails can be muddy or landslide-prone.",
    budget: "Medium",
    budgetNote:
      "Long-distance road or jeep travel, with basic local guesthouses and homestays.",
    hiddenGem: true,
    hiddenGemReason: "Lesser-known and off the beaten path.",

    shortDescription:
      'A serene high-altitude sanctuary in Far-Western Nepal known as the "land of 12 lakes and 18 meadows" (Barha Baanda, Athara Khanda).',
    longDescription:
      "Ramaroshan is a picturesque upland basin at around 2,500 metres, featuring scattered alpine lakes — including the Y-shaped Jigale Lake — surrounded by expansive green grasslands (patans) and dense rhododendron and pine forests. Visitors can hike across open meadows, enjoy quiet boating on the lakes, and catch panoramic views of distant Himalayan peaks such as Mount Api and Mount Saipal.\n\nKinemini is the largest of the eighteen meadows and the place where the Kailash River begins. This part of Ramaroshan is covered entirely with forest.",
    bestFor: "Nature photographers, off-the-grid trekkers, and slow-travel explorers.",

    howToGetThere:
      "Drive or take a public bus or jeep from Dhangadhi or Attariya to Sanfebagar or Mangalsen in Achham, then charter a local off-road jeep or hike up to the Ramaroshan plateau.",
    entryFee:
      "Free; there is no formal park gate fee, though local community tourism fees may apply.",
    openingHours: "Open 24/7.",
    nearbyStaysFood:
      "Basic local guesthouses, small tea houses and informal village homestays near Ramaroshan village and Jigale Lake (for example, Jigale Hotel).",
    safetyNotes:
      "Cell reception is spotty or absent in parts of the forest. Off-road jeep tracks can be rough in the rain. Carry warm layers, as temperatures drop sharply at 2,500 m.",

    photoCredit: "MR.G (Facebook), Nick Magar (local guide), Shamsher Bohara (Facebook page), Ramaroshan Tourism Area",

    alternateNames: [
      "Ramaroshan Gaunpalika",
      "Barha Baanda Athara Khanda",
      "Ramaroshan Lake & Meadows",
    ],
    culturalNote:
      "Local folklore says the name comes from King Rama visiting a place called Roshan, and Hindu tradition associates the tranquil wetlands with Lord Shiva and Goddess Parvati resting after their divine wedding. Ramaroshan is also one of the rare natural habitats of the Danfe (Himalayan Monal), Nepal's national bird.",
    // The doc calls Jigale Lake both C-shaped and Y-shaped.
    verify: ["position", "longDescription"],
  },

  {
    id: "achham-baidhyanath-dham",
    slug: "baidhyanath-dham",
    districtId: "achham",
    name: "Baidhyanath Dham Temple",
    category: ["Temple", "Religious Site", "Cultural Heritage"],
    nearestTown: "Sanfebagar",
    // Source gives ~29°13′48″N 81°13′06″E for "the Sanfebagar area", not the temple itself.
    position: [29.23, 81.2183],
    elevationM: 1300,

    interestTags: ["Religious", "Culture", "History"],
    bestSeasons: ["Autumn", "Spring"],
    bestTimeNote:
      "Large crowds gather during Maha Shivaratri and Bala Chaturdashi.",
    budget: "Low",
    hiddenGem: false,
    hiddenGemReason: "A regional cultural and religious attraction.",

    shortDescription:
      "Baidhyanath Dham Temple is a revered Hindu pilgrimage destination in Achham, known for its association with Lord Shiva and its religious importance.",
    longDescription:
      "A historic and deeply revered temple dedicated to Lord Shiva, Baidhyanath Dham sits at the sacred confluence of the Budhiganga and Saraswati rivers near Sanfebagar. It is an important spiritual and cultural destination for devotees visiting western Nepal, who come to worship and take part in religious observances.\n\nIts setting in the hills of Achham gives visitors a chance to explore local traditions, religious practice and the cultural heritage of Sudurpashchim Province.",
    bestFor:
      "Hindu pilgrims and devotees, cultural and heritage enthusiasts, and travelers exploring Achham.",

    howToGetThere:
      "Travel to Sanfebagar by road and continue to the temple by local transport or on foot, depending on the access point.",
    nearbyStaysFood: "Local accommodation and restaurants in the Sanfebagar area.",
    safetyNotes:
      "Check road conditions and local transport availability before traveling.",

    alternateNames: ["Baidhyanath Dham", "Vaidyanath Temple"],
    culturalNote:
      "The temple is said to be mentioned in the Skanda Purana, and local tradition holds that Ravana meditated here and received his ten heads from Lord Shiva. These legends are still to be confirmed with reliable local or archaeological sources.",
    verify: ["position", "entryFee", "openingHours", "culturalNote"],
  },

  {
    id: "achham-mangalsen-durbar",
    slug: "mangalsen-durbar",
    districtId: "achham",
    name: "Mangalsen Durbar",
    nameNepali: "मंगलसेन दरबार",
    category: ["Historical Site", "Cultural Heritage"],
    nearestTown: "Mangalsen Bazaar",
    // Source marks this as approximate.
    position: [29.1421, 81.2565],
    elevationM: 1400,

    interestTags: ["History", "Culture"],
    bestSeasons: ["Spring", "Autumn"],
    budget: "Low",
    hiddenGem: true,
    hiddenGemReason:
      "A regional heritage site, little known to visitors from outside Sudurpashchim.",

    shortDescription:
      "Mangalsen Durbar is a historic palace in Mangalsen, Achham, associated with the former rulers of Achham and the region's administrative history.",
    longDescription:
      "The hilltop palace of the old Achham kingdom stands in the district headquarters, Mangalsen, as a symbol of far-western royal architecture, with sweeping views of the surrounding hills.\n\nThe palace was built during the period of the former local rulers and later played a role in the district's administrative history. According to the Nepal Tourism Board, it was damaged during the Maoist insurgency and subsequently reconstructed. It remains an important part of Achham's historical and cultural identity, and visitors can explore the surrounding town, experience local life, and learn about the heritage of far-western Nepal.",
    bestFor:
      "History and heritage enthusiasts, architecture photographers, and travelers exploring Achham.",

    howToGetThere:
      "Travel by road to Mangalsen from other major towns in Sudurpashchim, then reach the palace from Mangalsen Bazaar.",
    entryFee: "No special ticket is generally reported; confirm locally.",
    nearbyStaysFood:
      "Hotels, inns, restaurants and shops are available around Mangalsen Bazaar.",
    safetyNotes:
      "Check road conditions, and whether reconstruction or restricted access affects visits, before traveling.",

    photoCredit: "Mohan Bishwokarma (local guide), Wikimedia Commons",

    alternateNames: ["Achham Durbar", "अछाम दरबार"],
    culturalNote:
      "The palace is associated with Achham's former royal administration. It was damaged in a conflict-era attack in 2002 and later reconstructed.",
    verify: ["position", "entryFee", "openingHours"],
  },

  {
    id: "achham-panchadewal-complex",
    slug: "panchadewal-complex",
    districtId: "achham",
    name: "Panchadewal Complex",
    nameNepali: "पञ्चदेवल विनायक",
    category: ["Archaeological Site", "Religious Site", "Cultural Heritage"],
    nearestTown: "Binayak Bazaar, Panchadewal Binayak Municipality",
    // Source only gives locality coordinates (29.1008, 81.4463) and says they
    // are not the temple complex. Confirm the site pin before filling in.
    position: null,

    interestTags: ["History", "Culture", "Religious", "Archaeology"],
    bestSeasons: ["Spring", "Autumn"],
    bestTimeNote: "Also worth visiting during local festival periods.",
    budget: "Low",
    budgetNote: "Provisional; local travel and accommodation costs vary.",
    hiddenGem: true,
    hiddenGemReason:
      "A regional heritage site that is less familiar to visitors from outside the province.",

    shortDescription:
      "Panchadewal Complex is a historic religious and archaeological site in the Binayak area of Achham, known for its traditional shrine structures and cultural significance.",
    longDescription:
      "Panchadewal Complex is part of the historic religious heritage of western Nepal. The site features traditional stone dewal shrines, renowned for their intricate stonework, and reflects the region's long-standing religious and cultural traditions.\n\nIt appeals to visitors interested in local history, traditional architecture, pilgrimage and the preservation of Nepal's archaeological heritage, and the surrounding Binayak area offers a chance to experience community life and other cultural landmarks. Nepal's tourism planning documents identify the Panchadeval archaeological and religious area as having potential for heritage-tourism development.",
    bestFor:
      "History and archaeology enthusiasts, religious and cultural visitors, and photographers of traditional architecture.",

    howToGetThere:
      "Travel by road to Binayak Bazaar in Panchadewal Binayak Municipality, then ask locally for directions to the temple complex.",
    nearbyStaysFood:
      "Basic accommodation and food around Binayak Bazaar; confirm availability before travel.",
    safetyNotes:
      "Respect religious customs and avoid touching or climbing on fragile historic structures. Check access roads and whether conservation work affects entry.",

    photoCredit: "Aryam Bist (RONB), Wikimedia Commons",

    alternateNames: ["Panchadewal of Vinayak", "Panchadeval"],
    culturalNote:
      "Panchadewal is listed among the monuments of Achham and is commonly described as a cluster of stone-carved temples from the Khas Malla period. The exact construction date, builders and site-specific legends are still to be confirmed with the Department of Archaeology or local historical sources.",
    verify: ["position", "entryFee", "openingHours", "budget", "culturalNote"],
  },

  {
    id: "achham-khaptad-national-park",
    // Suffixed: Bajhang already has `khaptad-national-park`.
    slug: "khaptad-national-park-achham",
    districtId: "achham",
    name: "Khaptad National Park (Achham Section)",
    nameNepali: "खप्तड राष्ट्रिय निकुञ्ज",
    category: ["Forest & Wildlife", "Religious Site"],
    nearestTown: "Sanfebagar; Achham access via Bhirkhu post or the Unisaina approach",
    // Source gives only a park-wide reference (29°17′41″N 81°13′43″E) and says
    // it is not a coordinate for the Achham section.
    position: null,

    interestTags: ["Nature", "Adventure", "Wildlife", "Trekking", "Culture", "Relaxation"],
    bestSeasons: ["Spring", "Autumn"],
    bestTimeNote: "March–May and October–November.",
    budget: "Medium",
    budgetNote: "Transport, trekking, food and accommodation costs.",
    hiddenGem: true,
    hiddenGemReason: "Particularly for visitors exploring the Achham-side routes.",

    shortDescription:
      "Khaptad National Park is a protected natural area famous for its green alpine meadows, dense forests, diverse wildlife, medicinal plants and peaceful mountain landscapes. Its Achham section gives access through the Bhirkhu area and routes connected with Sanfebagar.",
    longDescription:
      "Khaptad National Park is one of the important natural heritage destinations of far-western Nepal. Established in 1984 (2040 BS), it covers 225 square kilometres across Achham, Bajhang, Bajura and Doti. About 20% of the park, roughly 45 km², lies inside Achham, where steep wooded slopes, streams and rugged terrain rise from about 1,400 metres towards the central plateau at over 3,000 metres.\n\nThe park is famous for its grasslands, locally known as patans, surrounded by forests of pine, oak and other Himalayan vegetation. Its wildlife includes musk deer, leopards, Himalayan black bears and many bird species.\n\nKhaptad also has religious and spiritual importance through its association with Khaptad Baba. Its best-known sights — Khaptad Daha, Khaptad Baba Ashram, Tribeni and Sahasralinga — belong to the wider park rather than the Achham section specifically.",
    bestFor:
      "Nature lovers and adventure travellers, wildlife and bird photographers, trekkers, biodiversity researchers, and visitors interested in religious heritage.",

    howToGetThere:
      "From Sanfebagar, travel towards the Unisaina/Bhirkhu access area and continue on foot into the park. Confirm current trail conditions and local transport before travelling.",
    entryFee:
      "Nepal Tourism Board fee schedule: Nepali citizens NPR 100; SAARC nationals NPR 1,500; other foreign nationals NPR 3,000; children under 10 free.",
    openingHours:
      "Access is subject to park regulations and entry-point arrangements.",
    nearbyStaysFood:
      "Basic local accommodation and food along some trekking routes; facilities inside the remote park are limited.",
    safetyNotes:
      "Carry warm clothes, enough drinking water and food. Check weather and trail conditions, follow national park conservation rules, and consider a local guide for unfamiliar routes.",

    photoCredit: "Nepal Tourism Board",

    alternateNames: [],
    culturalNote:
      "Khaptad is associated with the renowned spiritual saint Khaptad Baba (Swami Sachchidananda), who spent many years meditating in the region. The park also protects important Himalayan ecosystems and biodiversity.",
    // The Bajhang entry for the same park lists different entry fees.
    verify: ["position", "entryFee"],
  },

  {
    id: "achham-janali-falls",
    slug: "janali-falls",
    districtId: "achham",
    name: "Janali Falls",
    nameNepali: "जनाली झरना",
    category: ["Waterfall", "Park & Recreation"],
    nearestTown: "Mangalsen Bazaar (Janali, Mangalsen Municipality)",
    position: [29.10017, 81.29095],
    elevationM: 1704,

    interestTags: ["Nature", "Adventure", "Relaxation", "Trekking"],
    bestSeasons: ["Monsoon", "Spring", "Autumn"],
    bestTimeNote:
      "The surroundings turn greener in the rainy season, and the falls may carry more water.",
    budget: "Low",
    hiddenGem: true,

    shortDescription:
      "Janali Falls is a natural waterfall in Mangalsen, Achham, offering a peaceful setting surrounded by green hills and natural landscapes.",
    longDescription:
      "Janali Falls is a small natural attraction in the Mangalsen area of Achham, where visitors can enjoy the flowing water and the surrounding countryside. It suits short trips, photography, picnics and relaxation. During the rainy season the landscape turns greener and the waterfall may carry much more water.",
    bestFor: "Nature lovers, picnic visitors, photographers, and families.",

    howToGetThere:
      "Travel to Mangalsen Bazaar and continue towards Janali Falls by local transport or on foot.",
    nearbyStaysFood: "Hotels and restaurants around Mangalsen Bazaar.",
    safetyNotes:
      "Avoid slippery rocks, especially during the monsoon. Do not swim in deep or fast-flowing water.",

    photoCredit: "The Achham Post (Facebook page)",

    alternateNames: ["Janali Jharna"],
    culturalNote:
      "A local natural attraction associated with the Janali area of Mangalsen. No specific historical legends have been verified.",
    verify: ["entryFee", "openingHours"],
  },

  {
    id: "achham-surma-devi-temple",
    slug: "surma-devi-temple",
    districtId: "achham",
    name: "Surma Devi Temple",
    nameNepali: "सुरमा देवी मन्दिर",
    category: ["Temple", "Religious Site", "Cultural Heritage"],
    // Source gives 29.552, 81.19835, which falls in Bajhang (Chainpur), not
    // Achham, and says the location within Achham needs confirmation.
    position: null,

    interestTags: ["Religious", "Culture", "History", "Trekking"],
    bestSeasons: ["Spring", "Autumn"],
    bestTimeNote: "Devotees gather for worship and local fairs during festival periods.",
    budget: "Low-Medium",
    hiddenGem: true,
    hiddenGemReason: "Provisional.",

    shortDescription:
      "Surma Devi Temple is a hilltop pilgrimage site associated with Goddess Surma Devi, a form of Shakti, where devotees gather for worship and religious celebrations.",
    longDescription:
      "Surma Devi Temple represents the religious and cultural traditions of the Achham region. Devotees visit to worship the goddess and take part in rituals and local fairs, and the hill setting lets visitors experience the natural scenery and traditional religious practice of the surrounding communities.",
    bestFor:
      "Hindu pilgrims, religious and cultural visitors, festival-goers, and landscape photographers.",

    safetyNotes: "Check hill-road conditions and carry drinking water.",

    photoCredit: "Far-Western Region, Nepal",

    alternateNames: ["Surma Devi Mandir"],
    culturalNote:
      "Associated with Shakti worship and local religious traditions. Its claimed Shakti Peetha status has not been independently verified.",
    verify: [
      "position",
      "nearestTown",
      "howToGetThere",
      "entryFee",
      "openingHours",
      "nearbyStaysFood",
    ],
  },

  {
    id: "achham-river-valleys",
    slug: "river-valleys-of-achham",
    districtId: "achham",
    name: "River Valleys of Achham",
    category: ["River"],
    nearestTown: "Mangalsen, Sanfebagar and riverside settlements",
    // A landscape spanning three valleys; no single point to pin.
    position: null,

    interestTags: ["Nature", "Adventure", "Relaxation"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    budget: "Low-Medium",
    hiddenGem: true,

    shortDescription:
      "The river valleys of Achham offer beautiful natural landscapes of flowing rivers, green hills, terraced fields and traditional settlements.",
    longDescription:
      "Achham is surrounded by river landscapes and mountain valleys. The Budhiganga is an important river flowing through northern and central Achham, with crossings near Sanfebagar and Chaurpati and a valley floor ranging from about 430 to 1,250 metres. The Karnali forms the eastern and southern edge of the district, bordering Dailekh and Surkhet and crossed at points such as Rakam, in a deep gorge roughly 400 to 650 metres above sea level. The Seti, a major tributary of the Karnali system, flows through western and central parts of the district near Dhakari.\n\nThese valleys support local agriculture, water resources and rural livelihoods. Their scenic surroundings, terraced farmland and natural riverbanks offer opportunities for photography, sightseeing and nature exploration.",
    bestFor:
      "Nature lovers, landscape photographers, adventure travellers, and visitors interested in rural life.",

    howToGetThere:
      "Access depends on the river section. Use local roads from Mangalsen or Sanfebagar and ask for directions to suitable river viewpoints.",
    entryFee: "Generally no designated ticket; local access restrictions may apply.",
    openingHours: "No fixed hours for public river viewpoints.",
    nearbyStaysFood: "Local hotels and restaurants in nearby settlements.",
    safetyNotes:
      "Avoid swimming in deep or fast-flowing sections. River levels can rise suddenly during the monsoon. Keep away from unstable riverbanks.",

    photoCredit: "Department of Hydrology and Meteorology, The Rising Nepal, local photographers",

    alternateNames: ["Budhiganga Khola", "Karnali River", "Seti River"],
    culturalNote:
      "Rivers have traditionally supported agriculture, settlement, transport, water resources and livelihoods in the Achham region.",
  },

  {
    id: "achham-deuda-culture-villages",
    slug: "deuda-culture-villages",
    districtId: "achham",
    name: "Deuda Culture Villages of Achham",
    category: ["Cultural Heritage"],
    nearestTown: "Mangalsen and surrounding rural settlements",
    // A living tradition across villages (Kalagaun, Talkot, Dhamali, …), not one site.
    position: null,

    interestTags: ["Culture", "History"],
    bestSeasons: ["Autumn"],
    bestTimeNote:
      "Deuda is performed most during Gaura Parva, Dashain, Tihar and other festival periods.",
    budget: "Low-Medium",
    hiddenGem: true,

    shortDescription:
      "Deuda culture villages represent the traditional songs, dances, language, festivals and community life of Achham and the wider Sudurpashchim region.",
    longDescription:
      "Deuda is one of the most recognised traditional cultural practices of Sudurpashchim and the Karnali region. Groups of men and women hold hands and dance in a circle while singing traditional songs that express love, social relationships, local history, daily life and community experience.\n\nDuring festivals such as Gaura Parva, people gather to perform Deuda and celebrate their cultural identity. Visitors can experience traditional music, community gatherings, local food and the hospitality of rural villages. Deuda is a living tradition rather than a single physical attraction.",
    bestFor:
      "Cultural tourists, traditional music and dance enthusiasts, cultural researchers, and photographers and filmmakers.",

    howToGetThere:
      "Travel to Mangalsen or other rural municipalities in Achham and coordinate with local communities to attend cultural events.",
    entryFee:
      "No standard fee for community gatherings; event-specific charges may apply.",
    openingHours: "Depends on local festivals and community events.",
    nearbyStaysFood:
      "Local hotels, guesthouses and community homestays where available.",
    safetyNotes:
      "Ask permission before photographing or recording people, and respect cultural traditions and festival practices.",

    photoCredit: "Music Research and Development Forum",

    alternateNames: ["Deuda Khel", "Deuda Nach", "देउडा नाच"],
    culturalNote:
      "Deuda is a traditional song-and-dance form practised in Achham and other districts of Sudurpashchim and Karnali, particularly associated with Gaura Parva and other community celebrations.",
  },

  {
    id: "achham-naini-tourism-area",
    slug: "naini-tourism-area",
    districtId: "achham",
    name: "Naini Tourism Development Area",
    category: ["Viewpoint", "Cultural Heritage"],
    nearestTown: "Sanfebagar Airport Bazaar",
    // Source coordinates sit near Mangalsen, while the doc describes a 5–6 hour
    // hike from Sanfebagar — confirm the pin.
    position: [29.1068, 81.2926],

    interestTags: ["Nature", "Adventure", "Culture", "Religious", "Relaxation"],
    bestSeasons: ["Spring", "Autumn"],
    budget: "Low-Medium",
    hiddenGem: true,
    hiddenGemReason: "Provisional.",

    shortDescription:
      "Naini Tourism Development Area is a locally identified destination in Achham, promoting the area's natural and cultural attractions through community-led tourism.",
    longDescription:
      "Naini has been developed almost single-handedly by Arjun Rana, now 76, who has worked on it for about twelve years with support from local people and the government. The site has a lake and a statue, and a half Shiva statue is being carved. It draws local and religious visitors to its pristine nature and wilderness, at between roughly 1,200 and 1,550 metres.\n\nVisitors can enjoy sightseeing, relaxation, photography and the surrounding rural landscapes, making it a way to explore Achham beyond its best-known attractions.",
    bestFor:
      "Local and religious tourists, community-tourism enthusiasts, photographers, and visitors exploring rural Achham.",

    howToGetThere:
      "From Sanfebagar, the nearest hill town, take a shared jeep or hike for 5–6 hours. Sanfebagar can be reached by flight or direct bus from Kathmandu.",
    openingHours: "Open all day.",
    safetyNotes:
      "Check road conditions, weather and local facilities before travelling.",

    alternateNames: ["Naini Tourism Area", "Naini Paryatan Kshetra"],
    verify: ["position", "entryFee", "nearbyStaysFood", "budget", "hiddenGem"],
  },
];

export function getAchhamDestination(slug: string): Destination | undefined {
  return achhamDestinations.find((d) => d.slug === slug);
}
