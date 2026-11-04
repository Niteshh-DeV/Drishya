/**
 * Kailali — destination content (15 entries), converted from
 * KAILALI DISTRICT.docx.
 *
 * The source is fuller than the hill-district docs (most entries have
 * coordinates, fees and hours), but a few values conflict within the doc
 * itself. Those are kept as written and named in each entry's `verify` list;
 * fields the doc marks "confirm locally" are left out rather than guessed.
 */
import type { Destination } from "@/lib/types";

export const kailaliDestinations: Destination[] = [
  {
    id: "kailali-ghodaghodi-lake",
    slug: "ghodaghodi-lake",
    districtId: "kailali",
    name: "Ghodaghodi Lake",
    category: ["Lake & Wetland", "Forest & Wildlife"],
    nearestTown: "Sukhad Bazaar, Ghodaghodi Municipality",
    // Approximate centre of the main lake, not the whole wetland complex.
    position: [28.68899, 80.94852],
    elevationM: 205,

    interestTags: ["Nature", "Wildlife", "Culture", "Adventure", "Relaxation"],
    bestSeasons: ["Winter", "Spring", "Autumn"],
    bestTimeNote:
      "October to March is best for birdwatching, during the winter migratory season.",
    budget: "Low-Medium",
    hiddenGem: false,
    hiddenGemReason: "An established regional tourism and conservation destination.",

    shortDescription:
      "Ghodaghodi Lake is a freshwater wetland complex in Kailali, famous for its rich biodiversity, migratory birds, aquatic vegetation, surrounding forests and cultural significance. It is a Ramsar site and bird sanctuary.",
    longDescription:
      "Ghodaghodi Lake is one of the most significant wetland ecosystems in western Nepal. Located in Ghodaghodi Municipality, the complex consists of a large freshwater oxbow lake, several associated lakes and ponds, marshes, streams and surrounding forests — roughly 2,563 hectares in all. Studies count about 13 to 14 associated lakes and ponds, though the numbers differ. It is surrounded by tropical deciduous forest and lies near the Siwalik (Churia) Hills.\n\nThe lake supports a wide variety of aquatic plants, fish, reptiles, mammals and birds, and is particularly important for resident and migratory birds, which makes it a rewarding place for birdwatching and nature photography. It was designated a Ramsar Wetland of International Importance on 13 August 2003 and declared Nepal's first bird sanctuary in March 2022.\n\nThe wetland helps maintain ecological balance, provides habitat for threatened wildlife, and has long-standing cultural and traditional ties with the surrounding Tharu communities.",
    bestFor:
      "Ecotourists, birdwatchers and wildlife photographers, families and picnic visitors, environmental researchers, and cultural tourism enthusiasts.",

    howToGetThere:
      "The lake is reached from the East–West (Mahendra) Highway. Travel to Sukhad Bazaar in Ghodaghodi Municipality and follow local directions to the lake.",
    nearbyStaysFood:
      "Hotels and restaurants around Sukhad and Ghodaghodi, including Ghodaghodi Paradise Cottage.",
    safetyNotes:
      "Avoid disturbing birds and wildlife, and never throw plastic or other waste into the lake. Follow local conservation rules, stay out of deep water and restricted wetland areas, and bring binoculars for birdwatching.",

    photoCredit: "Nepal Tourism Board, Wikimedia Commons",

    alternateNames: ["Ghodaghodi Tal", "Ghodaghodi Lake Area"],
    culturalNote:
      "Ghodaghodi Lake has cultural and religious importance for local communities, including traditional worship associated with the nearby Ghodaghodi Temple. Ecologically, the wetland links the Terai plains with the Churia Hills and is an important habitat for aquatic life and migratory birds.",
    verify: ["entryFee", "openingHours"],
  },

  {
    id: "kailali-tikapur-park",
    slug: "tikapur-park",
    districtId: "kailali",
    name: "Tikapur Park",
    nameNepali: "टीकापुर बृहत उद्यान",
    category: ["Park & Recreation", "Historical Site"],
    nearestTown: "Tikapur Bazaar, Tikapur Municipality",
    // Approximate park location.
    position: [28.5278, 81.1189],
    elevationM: 160,

    interestTags: ["Nature", "Relaxation", "History", "Culture"],
    bestSeasons: ["Winter", "Spring", "Autumn"],
    bestTimeNote:
      "November to March; February and March are best for spring flowers.",
    budget: "Low",
    hiddenGem: false,
    hiddenGemReason: "An established and popular tourism destination.",

    shortDescription:
      "Tikapur Park is a public garden on the Karnali River, known for its colourful flower gardens, green lawns, historic royal residences and peaceful setting — a favourite for family picnics, relaxation and sightseeing.",
    longDescription:
      "Tikapur Park, also known as Tikapur Brihat Udyan, is one of the major recreational and historical attractions of Sudurpashchim and one of Nepal's largest human-made parks. It was established in 2028 BS (1971 AD) as part of the planned development of Tikapur.\n\nThe park is associated with former King Mahendra, who stayed in Tikapur for health-related rest. Several structures reflect its royal history, including Mahendra Arogya Griha, Ratna Udyan, Birendra Bishram Batika and Aishwarya Udyan.\n\nVisitors come for the flower gardens, lawns, large trees and walking paths, and for picnics, photography and the historic buildings. Nearby are the Karnali River and Karnali Bridge, Padam Prakasheshwor Temple, local Tharu villages, and Tikapur's markets with their banana-based food products.",
    bestFor:
      "Family picnics and group outings, nature lovers, photographers, history enthusiasts, and anyone seeking a relaxing day out.",

    howToGetThere:
      "Travel to Tikapur Bazaar from Dhangadhi, Lamki or Chisapani by bus, jeep or private vehicle, then take local transport to the park.",
    entryFee:
      "A small entrance fee applies; confirm the current rate with park management. Birendra Bishram Batika was reported to have a separate NPR 20 fee when it opened to visitors in January 2025.",
    nearbyStaysFood:
      "Hotels, restaurants and local food shops around Tikapur Bazaar.",
    safetyNotes:
      "Keep the park clean, do not damage flowers or plants, and follow park rules. Take care near the Karnali River and check whether boating is running before planning it.",

    photoCredit: "BB Dhakal (local guide), Dharmendra Dani (local guide)",

    alternateNames: ["Tikapur Brihat Udyan"],
    culturalNote:
      "The park is associated with former King Mahendra and King Birendra, who used its residences during visits to Tikapur. The surrounding settlements are home to Tharu communities, known for their distinctive food, festivals, dances and cultural practices.",
    verify: ["entryFee", "openingHours"],
  },

  {
    id: "kailali-chisapani-karnali-bridge",
    slug: "chisapani-karnali-bridge",
    districtId: "kailali",
    name: "Karnali Bridge, Chisapani",
    nameNepali: "कर्णाली पुल, चिसापानी",
    category: ["Landmark", "River", "Viewpoint"],
    nearestTown: "Chisapani Bazaar, Lamki Chuha Municipality",
    // From the DHM gauging station at the bridge. The bridge spans the
    // Kailali–Bardiya border, so the pin sits just outside the Kailali outline.
    position: [28.6413, 81.2832],
    elevationM: 190,

    interestTags: ["Nature", "Adventure", "Culture", "History", "Relaxation"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote:
      "Autumn has the clearest views. In the monsoon the river runs strong, so take extra care.",
    budget: "Low",
    hiddenGem: false,
    hiddenGemReason: "A famous tourist attraction and highway landmark.",

    shortDescription:
      "Chisapani Karnali Bridge is a famous cable-stayed bridge over the Karnali River, known for its single-tower design and sweeping river views — a popular stop for travellers.",
    longDescription:
      "The Karnali Bridge at Chisapani is one of the landmarks of Sudurpashchim, carrying the East–West Highway across the Karnali River between Kailali and Bardiya and linking the far west with the rest of Nepal.\n\nThe bridge is about 500 metres long, with a distinctive single-tower cable-stayed design. It was built by Kawasaki Heavy Industries of Japan and completed in 1993, and its striking structure and scenic setting have made it a tourist attraction in its own right.\n\nVisitors stop to enjoy the river views, take photographs, feel the cool breeze, and try the local food of Chisapani, which is known for its Karnali fish dishes and river-based tourism.",
    bestFor:
      "Bridge and river photography, sightseeing and road trips, local fish dishes, and rafting where available.",

    howToGetThere:
      "The bridge is directly on the East–West (Mahendra) Highway and can be reached by bus, car, jeep or motorcycle. Chisapani Bazaar is beside the bridge.",
    entryFee:
      "No separate tourist ticket; it is a public highway crossing, not a controlled attraction.",
    openingHours:
      "Accessible throughout the day; avoid stopping in traffic lanes.",
    nearbyStaysFood:
      "Local restaurants and roadside hotels in Chisapani Bazaar, known for Karnali fish dishes; accommodation is available around Chisapani.",
    safetyNotes:
      "Do not stop vehicles on the bridge for photographs, and follow traffic rules while walking. Avoid swimming — currents and water levels can be dangerous, especially in the monsoon. Check whether rafting is running before planning it.",

    photoCredit: "Bharat Oli (local guide), Wikimedia Commons",

    alternateNames: ["Karnali Bridge", "Chisapani Bridge", "कर्णाली पुल"],
    culturalNote:
      "Since 1993 the bridge has been a major transport connection between Sudurpashchim and the Lumbini region, and Chisapani has grown around it as a stop for river sightseeing, photography and local food.",
  },

  {
    id: "kailali-behadababa-temple",
    slug: "behadababa-temple",
    districtId: "kailali",
    name: "Behadababa Temple",
    nameNepali: "बेहडाबाबा मन्दिर",
    category: ["Religious Site", "Temple", "Cultural Heritage"],
    nearestTown:
      "Rampur–Urma, Dhangadhi-16; Chaumala Bazaar is about 6 km to the south",
    // Source marks this as approximate.
    position: [28.70653, 80.57429],

    interestTags: ["Religious", "Culture", "History", "Nature"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote:
      "The annual Ganga Dashahara Mela is the main fair; Maha Shivaratri is also an important occasion for Shiva devotees.",
    budget: "Low",
    hiddenGem: false,
    hiddenGemReason:
      "Listed among the Sudurpashchim Provincial Government's tourist attractions.",

    shortDescription:
      "Behadababa Temple is a famous Hindu temple dedicated to Lord Shiva in the Rampur–Urma area of Dhangadhi. Surrounded by forest, it is an important centre of faith for devotees from Sudurpashchim and neighbouring parts of India.",
    longDescription:
      "Behadababa Temple is one of the well-known religious destinations of Sudurpashchim. According to local tradition, the temple is associated with a naturally formed Shiva Lingam: a sacred Shaligram is said to have become fixed to the ground here and could not be lifted.\n\nLocal accounts describe Shiva worship at the site stretching back several centuries. The temple is also associated with the Tharu community and draws devotees from Kailali, Kanchanpur and neighbouring Indian areas. These are traditional beliefs and local histories rather than established archaeological dates.\n\nThe biggest event is the annual Ganga Dashahara Mela, when devotees gather for prayers and rituals. A pond known as Mahadev Tal is associated with the temple, and ritual bathing there is part of local tradition.",
    bestFor:
      "Worship and religious visits, local traditions and Tharu cultural heritage, the Ganga Dashahara fair, and peaceful surroundings for photography.",

    howToGetThere:
      "From Dhangadhi, travel towards the Rampur–Urma area by private vehicle, motorcycle, taxi or local transport; it can also be reached from Chaumala Bazaar, about 6 km to the south. Check the final road conditions locally.",
    openingHours:
      "A business listing reports 8:00 AM–6:00 PM daily; confirm locally, as temple and festival timings may differ.",
    nearbyStaysFood:
      "Small shops and basic facilities near the temple; for more choice, stay in Dhangadhi. Book ahead during major fairs.",
    safetyNotes:
      "Dress modestly, respect temple customs and keep the temple and forest clean. Follow temple management during crowded festivals, ask locally before bathing in the pond, and carry drinking water.",

    photoCredit: "shree-behada-baba.wheree.com",

    alternateNames: ["Behada Baba Temple", "Beheda Baba Dham", "Behadababa Dham"],
    culturalNote:
      "Locals believe the Shiva Lingam appeared naturally at the site. The temple is important to local communities, including the Tharu, and its founding date has not been verified.",
    verify: ["elevationM", "entryFee", "openingHours"],
  },

  {
    id: "kailali-godawari-dham",
    slug: "godawari-dham",
    districtId: "kailali",
    name: "Godawari Dham",
    nameNepali: "गोदावरी धाम",
    category: ["Religious Site", "Cultural Heritage"],
    nearestTown:
      "About 8 km north of Attariya Chowk on the Mahakali Highway; 22 km north of Dhangadhi",
    position: [28.8475, 80.5732],
    elevationM: 230,

    interestTags: ["Religious", "Culture", "Nature", "Relaxation"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote:
      "October to April. The Makar Mela on 1 Magh (mid-January) draws thousands of pilgrims. The river can swell heavily in the July–September monsoon.",
    budget: "Low",
    budgetNote: "Minimal or no entry fee, and easy to reach by public transport.",
    hiddenGem: false,
    hiddenGemReason:
      "A popular, well-known pilgrimage and picnic destination in Sudurpashchim.",

    shortDescription:
      "A sacred Hindu pilgrimage site at the base of the Chure hills on the banks of the holy Godawari River, famous for its towering Hanuman statue and spiritual atmosphere.",
    longDescription:
      "Godawari Dham is a spiritual sanctuary and community hub in Godawari Municipality. According to local religious lore, the sage Gautama performed penance here, and the Pandavas stopped to bathe during their forest exile.\n\nVisitors worship at the white, peak-style Shiva temple with its sacred Shivalinga, pray at shrines to other deities, and see the Hanuman statue, more than 40 feet tall. The dham sits where the flat Terai meets the cooler forested Chure hills, which makes it a popular weekend retreat for families and groups who come to picnic and relax by the river.",
    bestFor: "Families, religious pilgrims, and local picnickers.",

    howToGetThere:
      "From Dhangadhi or the Gadda Chauki border crossing, take a bus, micro-bus or auto-rickshaw to Attariya Chowk. From Attariya, jeeps, buses heading to Dadeldhura and auto-rickshaws run north along the highway and stop at the Godawari Dham gates.",
    entryFee:
      "Free entry to the temple complex; small parking fees for private vehicles, and donations are voluntary.",
    openingHours: "Open daily from dawn to dusk, year-round.",
    nearbyStaysFood:
      "Tea shops and small eateries outside the gates serve sel roti, tarkari and cold drinks. For overnight stays, use Attariya Bazaar (15 minutes away) or Dhangadhi.",
    safetyNotes:
      "The road through the Chure hills beyond the temple has winding curves, so drive carefully. During big festivals such as Maghe Sankranti the area gets very crowded — watch your belongings. Mobile signal (Ncell and NTC) is strong.",

    photoCredit: "Wikipedia",

    alternateNames: ["Godavari Dham", "Kailali Godavari", "Far-West Godavari"],
    culturalNote:
      "Every year on 1 Magh (mid-January), Godawari Dham hosts the Makar Mela (Maghe Sankranti fair), when thousands of devotees from across Nepal and nearby Indian border towns take a holy dip in the icy river. Bathing here at this auspicious time is believed to cleanse sins, and the fair is a major venue for mass weddings, Bratabandha ceremonies and community celebrations.",
  },

  {
    id: "kailali-aampani-waterfall",
    slug: "aampani-waterfall",
    districtId: "kailali",
    name: "Aampani Waterfall",
    nameNepali: "आमपानी झरना",
    category: ["Waterfall"],
    nearestTown:
      "About 7 km (15 minutes) north of Lamki Bazaar, in the Chure foothills",
    // Approximate Chure-foothill entry point, per the source.
    position: [28.6945, 81.1215],
    elevationM: 280,

    interestTags: ["Nature", "Adventure", "Relaxation"],
    bestSeasons: ["Spring", "Autumn", "Winter"],
    bestTimeNote:
      "Very popular in summer and the monsoon as an escape from the heat of the plains, but heavy rain can affect the road.",
    budget: "Low",
    hiddenGem: true,
    hiddenGemReason:
      "Mainly visited by domestic travellers from neighbouring districts such as Bardiya and Surkhet, and nearby Indian border towns.",

    shortDescription:
      "A scenic escape inside a community forest at the foot of the Chure Hills, perfect for a refreshing dip and family picnics.",
    longDescription:
      "Aampani Waterfall lies inside the protected Bargada Community Forest and has grown from a secluded local stream into a busy eco-tourism spot. With provincial tourism funding, the site now has upgraded footpaths, swimming areas and picnic spots. Visitors can enjoy the cool, cascading water, rest in the shade, or explore the green forest trails of the Chure foothills.",
    bestFor: "Families, day-trippers, and group picnics.",

    howToGetThere:
      "From Lamki Bazaar on the East–West Highway, take an auto-rickshaw, jeep or motorbike 7 km north along the foothill track.",
    entryFee:
      "Free or a minimal community forest conservation fee; a ticketing system for waste management is being introduced.",
    openingHours:
      "Daily 6:00 AM–6:00 PM, year-round; tracks can get muddy in peak monsoon.",
    nearbyStaysFood:
      "Tea stalls and small eateries near the forest entrance serve snacks, cold drinks and dal bhat. For lodging, stay in Lamki Bazaar.",
    safetyNotes:
      "Rocks near the main pool can be very slippery. Mobile coverage (Ncell/NTC) can be weak inside the forest ravine.",

    photoCredit: "Aampani Waterfall",

    alternateNames: ["Aampani Jharna", "Bargada Forest Waterfall"],
    culturalNote:
      "The waterfall sits within an ecological belt managed entirely by the local community. Its recent development is a model of community-led conservation, with tourism revenue funding the upkeep and protection of the surrounding Chure forest.",
    verify: ["position"],
  },

  {
    id: "kailali-jokhar-lake",
    slug: "jokhar-lake",
    districtId: "kailali",
    name: "Jokhar Lake",
    nameNepali: "जखोर ताल",
    category: ["Lake & Wetland", "Forest & Wildlife"],
    nearestTown:
      "About 4.5 km northeast of Dhangadhi Bazaar; 1 km east of Kailali Multiple Campus",
    position: [28.7061, 80.5985],
    elevationM: 170,

    interestTags: ["Nature", "Wildlife", "Relaxation"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote: "October to March, when migratory waterbirds arrive.",
    budget: "Low",
    budgetNote: "Affordable entry and short local transport from Dhangadhi.",
    hiddenGem: false,
    hiddenGemReason:
      "A popular recreational spot for Dhangadhi residents, though lesser-known to international tourists.",

    shortDescription:
      "A serene oxbow lake and urban wetland sanctuary inside the Devharia Botanical Garden in Dhangadhi, ideal for quiet boating and birdwatching.",
    longDescription:
      "Jokhar Lake is an eco-tourism destination enclosed by dense community forest. It is an important refuge for biodiversity, particularly native and migratory waterbirds that arrive in the winter months.\n\nVisitors can spend the day boating on the calm water, walking the paved paths around the lake, photographing wildlife from viewpoints, or relaxing in the botanical garden. It offers a green escape from the bustle of Dhangadhi.",
    bestFor: "Families, birdwatchers, and photography enthusiasts.",

    howToGetThere:
      "From Dhangadhi Bazaar by e-rickshaw, auto-rickshaw, motorbike or car; the road is paved up to the Devharia Botanical Garden entrance.",
    entryFee:
      "NPR 20–50 for domestic visitors, with small extra fees for boating and cameras.",
    openingHours:
      "6:00 AM–6:00 PM daily, year-round; paths can get muddy in the July–August rains.",
    nearbyStaysFood:
      "Snack stalls and local eateries outside the gates; a wide range of hotels (such as Hotel Devotee and Rubus Hotel) and restaurants is 10 minutes away in central Dhangadhi.",
    safetyNotes:
      "The area is secure and fenced. Stay on marked trails to protect the wetland vegetation, and do not swim in the deep sections of the lake.",

    photoCredit: "Department of Plant Resources Nepal, Sudurpashchim Province Tourism Board",

    alternateNames: ["Jakhor Taal", "Koilahi Lake", "Devharia Botanical Garden"],
    culturalNote:
      "The lake is part of the ancient Terai oxbow lake system formed by shifting river channels, and has been preserved through community-led forestry. Entry fees fund the botanical garden and protect the habitat of endangered birds such as the lesser whistling duck.",
    // The doc gives both 72 ha and 12.5 ha for the lake, and places it in
    // both Kailari Rural Municipality and Dhangadhi; the size is omitted here.
    verify: ["nearestTown"],
  },

  {
    id: "kailali-bhasu-bhir",
    slug: "bhasu-bhir",
    districtId: "kailali",
    name: "Bhasu Bhir",
    nameNepali: "भासु भीर",
    category: ["Viewpoint", "Mountain & Trek"],
    nearestTown:
      "Chure Rural Municipality-5, between Khanidada and Sahajpur on the Bhimdatta Pant Highway (about 55 km north of Dhangadhi)",
    position: [28.9864, 80.6244],
    elevationM: 1515,

    interestTags: ["Nature", "Adventure", "Relaxation"],
    bestSeasons: ["Spring", "Autumn", "Winter"],
    bestTimeNote:
      "Clear days are best for views over the valley clouds. The June–September monsoon brings a high risk of rockslides.",
    budget: "Low",
    budgetNote: "No cost beyond fuel or public transport.",
    hiddenGem: true,
    hiddenGemReason:
      "Heavily travelled on the way to the hill districts, but a scenic pit stop rather than a commercial attraction.",

    shortDescription:
      "A dramatic cliffside mountain pass on the Bhimdatta Pant Highway, famous for its switchbacks, misty valleys and panoramic Chure hill views.",
    longDescription:
      "Bhasu Bhir is a steep rocky slope where the Terai plains give way abruptly to the rugged Chure range. Travellers pull over to breathe the crisp mountain air, photograph the highway winding through green forest below, and watch waterfalls cascade down the cliff after rain. With its cool climate and morning cloud cover, it is a striking introduction to the hilly interior of Far-Western Nepal.",
    bestFor: "Road trippers, landscape photographers, and adventure travellers.",

    howToGetThere:
      "Any bus, jeep or private vehicle heading north from Dhangadhi or Attariya towards Dadeldhura or Doti on the Bhimdatta Pant Highway passes through.",
    entryFee: "Free (public roadside viewpoint).",
    openingHours:
      "Open 24 hours; best in daylight (6:00 AM–5:00 PM) for visibility.",
    nearbyStaysFood:
      "A small cluster of blue-roofed roadside stalls serves tea, instant noodles and snacks. For overnight stays, travellers stop at Khanidada or Sahajpur.",
    safetyNotes:
      "High caution: the cliff is prone to rockslides, especially in the June–September monsoon, and the narrow switchbacks with steep drop-offs need an experienced mountain driver. Mobile reception fluctuates in the gorge but mostly works.",

    photoCredit: "Sky 001 (local guide), Karan Bohara (local guide), Beautiful Farwest Nepal",

    alternateNames: ["Bhasu Vir", "Bhasu ko Bhir", "Bhasu Cliff"],
    culturalNote:
      "Bhasu Bhir was once one of the most feared walking passes for traders moving between the hill hinterland and the Terai. The Bhimdatta Pant Highway turned it from a dangerous bottleneck into the main artery connecting Sudurpashchim's hill districts with the rest of Nepal. Passing drivers often say a short prayer or sound their horns out of respect before taking its sharpest turns.",
  },

  {
    id: "kailali-basanta-protected-forest",
    slug: "basanta-protected-forest",
    districtId: "kailali",
    name: "Basanta Protected Forest & Wildlife Corridor",
    nameNepali: "बसन्ता संरक्षित वन",
    category: ["Forest & Wildlife"],
    nearestTown:
      "Along the East–West Highway, 30–45 minutes east of Dhangadhi (Bhajani, Ghodaghodi, Gauriganga and Kailari)",
    // Centroid of the core protected lowlands, per the source.
    position: [28.635, 80.821],

    interestTags: ["Nature", "Wildlife", "Adventure"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote:
      "October to April is the safest and most rewarding window; monsoon visits are strongly discouraged.",
    budget: "Low",
    budgetNote: "A wilderness zone without standard tourist ticketing.",
    hiddenGem: true,
    hiddenGemReason:
      "Well known to conservation scientists and ornithologists, but a raw, non-commercial wilderness rather than a safari park.",

    shortDescription:
      "Nepal's largest designated protected forest, a 688 km² transboundary wildlife corridor linking the Chure hills with India's Dudhwa National Park.",
    longDescription:
      "Basanta Protected Forest is made up of dense, towering sal forest, community-managed woodland and seasonal river networks, stretching from about 140 metres on the Terai plains up to about 600 metres in the Churia foothills.\n\nIt works as a transboundary corridor for large animals, allowing Royal Bengal tigers, wild Asian elephants and Indian rhinoceroses to move and breed between Nepal and India. Freshwater dolphins have been recorded in the lower Karnali–Mohana river systems. The corridor also wraps around the Ghodaghodi Lake Ramsar site and is known for some 381 bird species, making it one of the finest uncommercialised birding areas in the Terai.",
    bestFor:
      "Serious wildlife photographers, birdwatchers, and conservation-minded travellers.",

    howToGetThere:
      "Peripheral sections are right off the East–West Highway near Gauriganga or Ghodaghodi. Deeper areas are reached on dirt tracks from Kailari or Bhajani; a private jeep, motorbike or local guide is highly recommended.",
    entryFee:
      "Free; no general gate fee, though some community forest pockets or wetland sites may charge small local fees.",
    openingHours:
      "Open year-round, but June–September brings flooding of the Mohana rivers, washed-out roads and impenetrable undergrowth.",
    nearbyStaysFood:
      "No lodges inside the core forest. Tea shops and dhabas line the highway; stay at Bhada Community Homestay or in Dhangadhi (about 40 km west).",
    safetyNotes:
      "High caution: this is an unfenced, working wildlife corridor with elephant herds and tigers. Never walk deep inside alone — go in groups with a knowledgeable local tracker. Mobile coverage is stable near the highway but drops near the southern border rivers.",

    photoCredit: "WWF Nepal, Bird Conservation Nepal",

    alternateNames: ["Basanta Biological Corridor", "Basanta Samrakshit Ban", "Basanta PF"],
    culturalNote:
      "Basanta holds deep cultural and practical significance for the Tharu communities along its edges, who historically relied on it for seasonal resources; today the focus is on community-led forestry. It protects rare trees such as Bijaya Sal (Indian kino) and Satisal (rosewood), valued in local folklore for their healing and spiritual properties. Satellite tracking by the Department of National Parks and Wildlife Conservation has confirmed tigers raising cubs in the corridor.",
  },

  {
    id: "kailali-garva-durbar",
    slug: "garva-durbar",
    districtId: "kailali",
    name: "Garva Durbar",
    nameNepali: "गर्भा दरबार",
    category: ["Cultural Heritage", "Historical Site"],
    nearestTown:
      "Khairala, Chure Rural Municipality-4; about 45 km north of Dhangadhi via Chaumala Bazaar",
    position: [28.8912, 80.6894],
    elevationM: 1120,

    interestTags: ["History", "Culture", "Adventure"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote:
      "October to April, for clear mountain views and dry trails; monsoon access is nearly impossible.",
    budget: "Medium",
    budgetNote: "Requires rural transport or an off-road vehicle from the main highway.",
    hiddenGem: true,
    hiddenGemReason:
      "Despite its size and history, its remote hill location keeps it known mainly to locals and intrepid travellers.",

    shortDescription:
      "A century-old, abandoned three-storey Rana palace hidden in the Chure hills of Kailali, with 83 artistic windows and 53 doors.",
    longDescription:
      "Garva Durbar was built between 1922 and 1927 AD (1979–1984 BS) by the Rana governor Khadga Shamsher Jang Bahadur Rana, as an administrative outpost and a summer retreat from the malarial heat of the Terai. Spread over 10 to 13 ropanis, it has thick masonry walls, spacious courtyards, underground escape tunnels and faded European-style frescoes.\n\nThe palace was set on fire during the Maoist conflict and is now roofless and badly decayed, but its white arches and carved wooden frames still carry a haunting architectural grandeur.",
    bestFor:
      "Heritage trekkers, history enthusiasts, urban explorers, and adventure photographers.",

    howToGetThere:
      "Start from Dhangadhi or Attariya. From Chaumala Bazaar or Sahajpur on the highway, rough seasonal dirt tracks lead up by 4WD jeep or experienced motorbike; in the dry months you can also hike the old footpaths into the Khairala hills.",
    entryFee: "Free (unmanaged historic ruin; no ticket gate).",
    openingHours:
      "Open 24 hours, but visit only in daylight. Monsoon access (June–September) is dangerous because of mud, landslides and swollen rivers.",
    nearbyStaysFood:
      "No hotels or restaurants near the palace — only basic tea stalls in Khairala village. Carry snacks and water, and return to Dhangadhi, Bhasu Bhir or Khanidada for food and lodging.",
    safetyNotes:
      "Extreme structural caution: ceilings have collapsed and floors and walls are unstable, so do not climb to upper storeys or enter enclosed rooms blindly. Watch for hornets and bats. Mobile signal is unreliable.",

    photoCredit: "Wikimedia Commons, Chiran Vlogs, Hemanta Rai Official",

    alternateNames: [
      "Garbha Palace",
      "Garbha Durbar",
      "Garba Darbar",
      "Khairala Durbar",
      "Shamsher Ganj Palace",
    ],
    culturalNote:
      "The palace was the supreme judicial and tax court of the far-western region, covering today's Kailali, Kanchanpur and Doti. Thousands of Terai people were forced into unpaid Jhara labour to carry bricks baked in Chaumala, sal beams from the Bhabar jungles and roofing tin up the mountain tracks on their backs. Its burning erased precious historical archives; it has since been declared an archaeological heritage site as local communities work to stop it collapsing.",
  },

  {
    id: "kailali-bhada-homestay",
    slug: "bhada-homestay",
    districtId: "kailali",
    name: "Bhada Community Homestay",
    nameNepali: "भादा होमस्टे",
    category: ["Cultural Heritage"],
    nearestTown:
      "Dhangadhi-16 (former Urma VDC), about 17 km (30 minutes) east of Dhangadhi Bazaar",
    // Central entry gate of Bhada village.
    position: [28.7185, 80.6868],
    elevationM: 185,

    interestTags: ["Culture", "History", "Nature", "Relaxation"],
    bestSeasons: ["Autumn", "Winter"],
    bestTimeNote:
      "October to February (Asoj to Magh), when the weather is cool and mustard fields are in bloom. May–August is hot, humid and muddy.",
    budget: "Low",
    budgetNote:
      "Homestay packages with a private room and three traditional meals cost roughly NPR 1,200–2,000 per person per night.",
    hiddenGem: true,
    hiddenGemReason:
      "Recognised by the Ministry of Tourism as the Best Homestay in Nepal, yet still an authentic village far from mass tourism.",

    shortDescription:
      'An award-winning, community-run Tharu homestay village near Dhangadhi — an "open museum" of indigenous art, traditional mud-and-wood architecture and far-western hospitality.',
    longDescription:
      "Bhada is an unhurried settlement of the Dagunra Tharu community and Sudurpashchim's first community homestay. About 19 to 20 traditional households host travellers looking for genuine cultural immersion.\n\nGuests ride traditional bullock carts (larka) through golden fields, walk in the nearby Ganesh Community Forest, and join host families harvesting rice or cooking. Evenings are spent in clay-walled kitchens over organic Tharu food, followed by communal dance performances.",
    bestFor:
      "Cultural travellers, anthropology enthusiasts, and slow-paced holidays.",

    howToGetThere:
      "Fly or take a bus to Dhangadhi, then hire an auto-rickshaw, e-rickshaw or taxi for the 17 km drive east. A bullock-cart welcome from the highway junction can sometimes be arranged.",
    entryFee: "No entry fee to the village.",
    openingHours: "Open year-round.",
    nearbyStaysFood:
      "Rooms and meals are provided by your host family. Tharu dishes include dhikri (steamed rice-flour dough), river fish, ghonghi (snails), kheriya and home-brewed rice liquor.",
    safetyNotes:
      "The village is peaceful and safe for solo and female travellers. Rooms are basic but very clean, with mosquito nets or fans. Mobile coverage works throughout.",

    photoCredit: "Bhada Community Homestay Tourism Committee",

    alternateNames: ["Bhada Village", "Bhada Gaun", "Tharu Community Homestay Bhada"],
    culturalNote:
      "Local folklore says Bhada was founded centuries ago by a Tharu guru, Bhagauti Das 'Prakand', who established a shrine to Guru Jagannath so that it would remain an independent Tharu settlement; a legend still warns that outsiders who settle there permanently will fall ill. The community uses tourism to preserve its heritage, including the Sakhiya, Maghauta and Jhumra stick dances, passing them on to village youth.",
  },

  {
    id: "kailali-shivpuri-dham",
    slug: "shivpuri-dham",
    districtId: "kailali",
    name: "Shivpuri Dham",
    nameNepali: "उत्तररामेश्वरम शिवपुरी धाम",
    category: ["Temple", "Religious Site"],
    nearestTown:
      "Uttarbehadi (Ward 4), Dhangadhi; 5–10 minutes from the main bazaar",
    position: [28.7171, 80.5769],
    elevationM: 109,

    interestTags: ["Culture", "History", "Religious", "Relaxation"],
    bestSeasons: ["Spring", "Autumn", "Winter"],
    bestTimeNote:
      "Very busy on Shrawan Mondays in summer and during Maha Shivaratri and Bala Chaturdashi; winter is most pleasant for casual visits.",
    budget: "Low",
    hiddenGem: false,
    hiddenGemReason:
      "An established pilgrimage landmark drawing visitors from across Nepal and nearby Indian states.",

    shortDescription:
      "A serene spiritual sanctuary in Dhangadhi, famous for Nepal's tallest Shiva Linga at 108 feet.",
    longDescription:
      "Spread over eight bighas and surrounded by the Taranagar Community Forest, Shivpuri Dham is the spiritual heart of Dhangadhi. Its centrepiece is a 108-foot Shiva Linga — 72 feet above ground and 36 feet below.\n\nThe complex is built around sacred geometry, with 108 gaumukhi water spouts, 108 tulsi shrines and a 108-kilogram brass bell. Its calm, forested setting suits both devotion and peaceful morning walks.",
    bestFor: "Religious pilgrims, architecture enthusiasts, and families.",

    howToGetThere:
      "Within Dhangadhi Sub-Metropolitan City; reach it by auto-rickshaw, e-rickshaw, city bus or motorbike from anywhere in the bazaar.",
    entryFee: "Free; donations are welcomed by the temple trust.",
    openingHours: "5:00 AM–8:00 PM daily.",
    nearbyStaysFood:
      "Budget and luxury hotels are minutes away in Dhangadhi, with eateries serving Thakali sets and Nepali snacks nearby.",
    safetyNotes:
      "Safe and family-friendly year-round. Dress modestly, and expect very large crowds at Maha Shivaratri and Bala Chaturdashi.",

    photoCredit: "Prakash Joshi, NP Production, Shivpuri Dham Development Committee, Wikimedia Commons",

    alternateNames: [
      "Uttar Rameshwaram Jyotirlinga Dham",
      "Shivpuri Mandir",
      "Behandi Shivpuri Dham",
    ],
    culturalNote:
      "Besides the central deity, the dham has shrines to Nepal Mata (Mother Nepal), Surya Narayan, Ugratara and Muktinath. Its five ceremonial mandaps make it a favoured place in the region for Vedic rituals, weddings and Bratabandha ceremonies.",
    // 109 m looks low for Dhangadhi (Jokhar Lake nearby is ~170 m).
    verify: ["elevationM"],
  },

  {
    id: "kailali-dhangadhi-fun-city",
    slug: "dhangadhi-fun-city",
    districtId: "kailali",
    name: "Dhangadhi Fun City",
    nameNepali: "धनगढी फन सिटी",
    category: ["Park & Recreation"],
    nearestTown:
      "About 2 km south of Dhangadhi Bazaar on Bhansar (customs) Road",
    position: [28.6946, 80.6068],
    elevationM: 109,

    interestTags: ["Adventure", "Relaxation"],
    bestSeasons: ["Spring", "Summer", "Monsoon"],
    bestTimeNote:
      "The water slides are most popular in the hot summer months and may scale back in winter. Weekdays avoid the weekend rush.",
    budget: "Medium",
    budgetNote:
      "Tickets cost more than natural attractions but are standard for commercial amusement parks in Nepal.",
    hiddenGem: false,
    hiddenGemReason:
      "A widely known entertainment centre for the province and cross-border visitors.",

    shortDescription:
      "A modern water and amusement park in Dhangadhi with water slides, family pools and an indoor children's play zone.",
    longDescription:
      "Dhangadhi Fun City is a centre of modern family recreation in the far west. It combines large outdoor pools, multi-lane water slides and a wave pool with a lively music atmosphere, plus an indoor play area, live entertainment spaces and a food court with mascot characters — an all-in-one stop for weekend outings and school trips.",
    bestFor:
      "Families with young children, student groups, and young people looking for weekend fun.",

    howToGetThere:
      "On Bhansar Road: catch an e-rickshaw or bus towards the border from central Dhangadhi (about NPR 20–30), or hire a rickshaw for about 10 minutes (NPR 100–200).",
    entryFee:
      "About NPR 400 for adults; prices vary with seasonal offers and holiday packages.",
    openingHours: "Typically 10:00 AM–8:00 PM daily.",
    nearbyStaysFood:
      "An onsite food court and restaurant; hotels such as Hotel Devotee and Rubus Hotel are a short ride away.",
    safetyNotes:
      "Lifeguards watch the deep slide zones, but keep an eye on children in the wave pool. Lockers are available for valuables.",

    photoCredit: "Dhangadhi Fun City Pvt. Ltd.",

    alternateNames: ["Dhangadhi Fun Park", "Bhansar Road Fun City", "Dhangadhi Water Park"],
    culturalNote:
      "Unlike the region's religious and ecological sites, the park reflects Dhangadhi's rapid shift towards modern urban amenities as it grows into the main economic hub of Sudurpashchim.",
    verify: ["elevationM"],
  },

  {
    id: "kailali-kampase-dhura",
    slug: "kampase-dhura",
    districtId: "kailali",
    name: "Kampase Dhura",
    nameNepali: "कम्पासेधुरा",
    category: ["Viewpoint", "Mountain & Trek"],
    nearestTown:
      "Khanidada Bazaar, Chure Rural Municipality-5 (45–60 minutes north of Attariya or Dhangadhi)",
    position: [28.9427, 80.6175],
    elevationM: 1734,

    interestTags: ["Nature", "Adventure", "Trekking", "Relaxation"],
    bestSeasons: ["Spring", "Autumn", "Winter"],
    bestTimeNote:
      "Popular in summer as an escape from the Terai heat. Dense fog can roll in on late-autumn afternoons.",
    budget: "Low",
    hiddenGem: true,
    hiddenGemReason:
      "Khanidada is a busy roadside stop, but the summit itself remains an underrated, quiet trekking spot.",

    shortDescription:
      "One of the highest and most scenic peaks of the Chure range in Kailali, with panoramic views, crisp air and a refreshing escape from the plains.",
    longDescription:
      "Rising above the hill settlement of Khanidada, Kampase Dhura is a favourite trekking destination in the far west. Hikers are rewarded with views of rolling green ridges, deep valleys and mist-wrapped forests. Because it climbs so quickly from the hot lowlands of Dhangadhi, the temperature drops noticeably, making it popular for weekend road trips, landscape photography and nature walks, as well as short treks and vlogging.",
    bestFor: "Solo trekkers, nature photographers, and weekend riders.",

    howToGetThere:
      "Ride or drive north from Dhangadhi or Attariya on the Bhimdatta Highway through Godawari to Khanidada Bazaar (45–60 minutes by motorbike). From the Khanidada trailheads, a rugged uphill trek or off-road path leads to the summit.",
    entryFee: "Free.",
    openingHours: "Open 24/7; trek in daylight.",
    nearbyStaysFood:
      "Khanidada market has eateries and teahouses serving snacks, mountain goat meat and dal bhat, with basic lodges and homestays in the bazaar.",
    safetyNotes:
      "Trails to the peak have steep, rocky sections, so wear proper footwear. The highway near Khanidada can see landslides in peak monsoon — check local updates.",

    photoCredit: "Farwestern Rider Vlogs",

    alternateNames: ["Compase Dhura", "Compasse Dhura Danda", "Khanidada Peak", "Kampase Danda"],
    culturalNote:
      "The hill sits near old trading paths between the Terai and the hill districts of Dadeldhura and Doti, and has long been a cool resting point for mountain travellers. A small shrine near the peak is where locals pray for safe journeys across the Chure range.",
    // The doc gives both ~1,656 m and 1,734 m.
    verify: ["elevationM"],
  },

  {
    id: "kailali-khanidada",
    slug: "khanidada",
    districtId: "kailali",
    name: "Khanidada",
    nameNepali: "खानीडाँडा",
    category: ["Town & Village"],
    nearestTown:
      "On the Bhimdatta Highway, Chure Rural Municipality-5 (about 45 minutes north of Attariya)",
    position: [28.9573, 80.6201],
    elevationM: 1370,

    interestTags: ["Nature", "Relaxation", "Culture"],
    bestSeasons: ["Spring", "Summer", "Autumn", "Winter"],
    bestTimeNote:
      "A favourite quick escape from the summer heat of the plains. Clear afternoons give the widest views; fog can settle over the highway on late-winter evenings.",
    budget: "Low",
    hiddenGem: false,
    hiddenGemReason:
      "A well-known resting stop for travellers between the plains and the hill districts.",

    shortDescription:
      "A refreshing hill settlement and transit hub in the Chure hills, celebrated for its breezy climate and scenic valley lookouts.",
    longDescription:
      "Sitting on the ridgelines of the Chure (Siwalik) range, Khanidada is both a peaceful rural getaway and a gateway to the hills. The village looks out over terraced farmland, scattered traditional houses and misty horizons.\n\nBecause it is right on the highway, people from Dhangadhi and Attariya often drive up just to escape the heat, enjoy the mountain air, and relax at the community-run Khanidada Park or the seasonal Khanidada Waterfall in the nearby ravines.",
    bestFor:
      "Road trippers, family weekenders, and travellers looking for a scenic meal stop.",

    howToGetThere:
      "Travel north from Attariya on the Bhimdatta Highway via Godawari and Budhitola; the winding road reaches Khanidada Bazaar in about 45 minutes by motorbike or car.",
    entryFee: "Free.",
    openingHours: "Accessible year-round.",
    nearbyStaysFood:
      "The bazaar is full of eateries known for mountain goat meat, fresh snacks and dal bhat, with basic lodges and guesthouses in the market square.",
    safetyNotes:
      "The highway is paved but has steep curves that need careful driving, especially on motorbikes. In heavy monsoon rain, check local updates, as the young Chure soil is prone to mudslides.",

    alternateNames: ["Khanidada Bazaar", "Khanidada Village", "Chure-5 Khanidada"],
    culturalNote:
      "Before the highway, Khanidada was a foot-trail stop where hill communities came down to trade with the Terai markets. It has grown naturally into a thriving roadside hospitality hub.",
  },
];

export function getKailaliDestination(slug: string): Destination | undefined {
  return kailaliDestinations.find((d) => d.slug === slug);
}
