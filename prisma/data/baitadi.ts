/**
 * Baitadi — destination content (9 entries), converted from Baitadi.docx.
 *
 * Long descriptions + cultural notes double as the RAG corpus later, so keep
 * them as written prose rather than bullet fragments.
 */
import type { Destination } from "@/lib/types";

export const baitadiDestinations: Destination[] = [
  {
    id: "baitadi-tripura-sundari",
    slug: "tripura-sundari-temple",
    districtId: "baitadi",
    name: "Tripura Sundari Temple",
    nameNepali: "त्रिपुरा सुन्दरी मन्दिर",
    category: ["Temple", "Religious Site"],
    nearestTown: "15 minutes from Gothalapani / Dasharathchand Bazaar",
    // TODO: source gave "29.5678, 80" — longitude is truncated. Confirm and fill in.
    position: null,
    elevationM: 1500,

    interestTags: ["Culture", "History", "Religious"],
    bestSeasons: ["Autumn", "Spring"],
    bestTimeNote:
      "Highly crowded and vibrant during Dashain, Gaura, and the grand Jaat festival.",
    budget: "Low",
    hiddenGem: false,
    hiddenGemReason:
      "One of Nepal's top 100 tourism/pilgrimage destinations and the most famous temple in the district.",

    shortDescription:
      "Perched on a forested hilltop near the Indo-Nepal border, Tripura Sundari is a sacred pagoda-style Shakti Peeth overlooking the Mahakali River valley.",
    longDescription:
      "As one of the revered seven sister Bhagwati temples of the region, Tripura Sundari Temple represents the apex of religious architecture and devotion in Baitadi. The shrine features a beautifully decorated tiered structure made with copper features and localized stone craftsmanship. Pilgrims from across both Nepal and neighboring India frequent this hilltop site to perform rituals, witness traditional instruments played during seasonal festivals, and immerse themselves in the deep spiritual folklore of the far-western hills.",
    bestFor: "Families, cultural researchers, and religious pilgrims.",

    howToGetThere:
      "Easily accessible by local jeep, bus, or taxi directly via the paved Mahakali Highway to Dasharathchand Municipality, followed by a short 15-minute link road drive or walk.",
    entryFee: "Free.",
    openingHours: "Open 24/7 year-round.",
    nearbyStaysFood:
      "Plentiful mid-range hotels, local eateries, and traditional guest houses are operational in Gothalapani Bazaar and the Dasharathchand town center.",
    safetyNotes:
      "Cell phone signal is fully stable. Expect heavy crowd congestion and limited walking space during peak festival times like Dashain.",

    sources: [
      { label: "Wikimedia Commons — Tripurasundari Temple" },
    ],
    photoCredit: "Wikimedia Commons / Local Devotees",

    alternateNames: [
      "Ransaini Bhagwati",
      "Ransaini",
      "Tripurarisundari Devi",
      "Pujaragaun Bhagwati",
    ],
    culturalNote:
      "Deeply tied to the medieval history of the Katyuri and Chand dynasties, local legends describe that the goddess emerged here to secure peace in the borderlands. It is locally famous for preserving the classical Gaura culture of Sudurpashchim.",
  },

  {
    id: "baitadi-patal-bhumeshwar",
    slug: "patal-bhumeshwar-cave",
    districtId: "baitadi",
    name: "Patal Bhumeshwar Cave",
    nameNepali: "पाताल भुवनेश्वर गुफा",
    category: ["Cave"],
    nearestTown:
      "Surnaya Rural Municipality, roughly 30–40 minutes' drive from Patan hill town",
    position: [29.4752, 80.5694], // Surnaya Ward-2 cave system entryway
    elevationM: 1800,

    interestTags: ["Nature", "Adventure", "Trekking"],
    bestSeasons: ["Autumn", "Spring", "Winter"],
    bestTimeNote:
      "Highly hazardous during the monsoon due to internal mud blockages and water streams.",
    budget: "Low-Medium",
    budgetNote: "Basic travel expenses up to Surnaya.",
    hiddenGem: true,
    hiddenGemReason:
      "Despite being claimed as one of the deepest cave networks in South Asia, it lacks commercialization and remains vastly unexplored.",

    shortDescription:
      "Patal Bhumeshwar is a sprawling, deeply mysterious subterranean limestone cave system cloaked by dense pine forests and a permanent natural lake.",
    longDescription:
      "Regarded by international speleologists as a highly unique geological marvel, Patal Bhumeshwar Cave extends vertically into the earth with massive caverns displaying intricate stalactites, stalagmites, and rock structures resembling elephant trunks. Multiple foreign exploration expeditions, including French and British expert teams, have descended deep into its passageways but failed to map its ultimate end point due to narrow, rocky natural bottlenecks. Above the dark cavern system lies a serene ecosystem filled with local medicinal herbs and quiet hiking trails.",
    bestFor: "Adventure seekers, seasoned cavers, and geological researchers.",

    howToGetThere:
      "Travel via jeep or public bus from Patan or Gothalapani towards Surnaya Rural Municipality. From the road drop-off point, a short forest hike leads up to the cave entrance.",
    entryFee: "Free",
    openingHours:
      "Open during daylight hours. Strictly avoided during monsoon due to flash flooding risks inside the tunnels.",
    nearbyStaysFood:
      "Basic local tea shops and rural eateries operate around the Surnaya road hub. For proper accommodation, travelers return to hotels in nearby Patan town.",
    safetyNotes:
      "High caution advised. Exploring deep into the cave requires high-powered headlamps, protective gear, and an experienced local guide. Internal oxygen levels can drop, and the limestone steps are permanently damp and slippery.",

    photoCredit: "Local Explorers / The Annapurna Express",
    sources: [
      { url: "https://hsj.sg/destinations/nepal/sudurpashchim/baitadi/poi/patal-bhumeshwar-cave" },
      { url: "https://nepaltraveller.com/travel/cities/patan-the-heart-of-baitadi" },
      { url: "https://theannapurnaexpress.com/story/47506/", label: "The Annapurna Express feature on Baitadi" },
    ],

    alternateNames: [
      "Pattal Bhuvaneshwar",
      "Patalebhumeshwor",
      "South Asia's Deepest Cave",
    ],
    culturalNote:
      "Local spiritual folklore holds that the subterranean channels of this cave system extend thousands of miles beneath the mountains directly to the sacred Mount Kailash. Inside the outer chambers, structural rock formations are actively worshipped as natural manifestations of Lord Shiva and a divine Shivalinga.",
  },

  {
    id: "baitadi-ningalashaini",
    slug: "ningalashaini-bhagawati-temple",
    districtId: "baitadi",
    name: "Ningalashaini Bhagawati Temple",
    nameNepali: "निङ्गलाशैनी भगवती मन्दिर",
    category: ["Temple", "Cultural Heritage"],
    nearestTown: "Dehimandau (Dasharathchand Municipality-2), right off the highway",
    position: [29.5447, 80.4852], // Dehimandau temple precinct
    elevationM: 2100,

    interestTags: ["Culture", "History", "Religious"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote:
      "Famous for the massive animal sacrifices during Dashain and the bloodless Jamani Jatra festival in Mansir.",
    budget: "Low",
    hiddenGem: false,
    hiddenGemReason:
      "Highly regarded as one of the most prominent, culturally vital religious landmarks in the entire Sudurpashchim Province.",

    shortDescription:
      "Standing as a supreme pillar of spiritual faith in the far west, Ningalashaini is a legendary hilltop temple famous for its grand regional festivals and ancient architectural importance.",
    longDescription:
      'As another key powerhouse among the famed "seven sister" Bhagwati temples of Baitadi, the Ningalashaini Bhagawati Temple features extensive open courtyards, ancient stone masonry, and deep cultural roots. The shrine is globally recognized for holding one of the largest congregational religious events in the region. While peak Dashain celebrations feature traditional rites, the annual Jamani Jatra on Mansir Shukla Purnima strictly prohibits any animal sacrifices, showcasing instead an immaculate display of local musical heritage, Deuda dances, and classic mid-hill shamanic rituals.',
    bestFor: "Cultural documentarians, families, and religious historians.",

    howToGetThere:
      "Very easy access via paved roads; long-distance public buses or jeeps travelling along the highway to Gothalapani or Darchula drop travelers directly at the Dehimandau market junction, from which the temple is a short walk away.",
    entryFee: "Free.",
    openingHours: "Open 24/7 year-round.",
    nearbyStaysFood:
      "Basic hotels, retail markets, and authentic tea stalls operate in Dehimandau bazaar. Expanded hotel options are situated 20–30 minutes down the highway in Gothalapani.",
    safetyNotes:
      "Cell connectivity is strong and stable. The courtyard becomes extremely packed with massive crowds during festival weeks, requiring strict vigilance.",

    sources: [
      { url: "https://dty.wikipedia.org/wiki/%E0%A4%A8%E0%A4%BF%E0%A4%99%E0%A5%8D%E0%A4%97%E0%A4%B2%E0%A4%BE%E0%A4%B6%E0%A5%88%E0%A4%A8%E0%A5%80_%E0%A4%AD%E0%A4%97%E0%A4%B5%E0%A4%A4%E0%A5%80_%E0%A4%AE%E0%A4%A8%E0%A5%8D%E0%A4%A6%E0%A4%BF%E0%A4%B0", label: "Dami Jatra / local festival logs (Doteli Wikipedia)" },
    ],
    photoCredit: "Doteli Wikipedia Community Contributors",

    alternateNames: ["Dehimandau Bhagawati", "Ningalasaini Mandir"],
    culturalNote:
      "The temple serves as the ultimate epicentre for the protection of classical Khas-Far Western culture. Local lore specifies that the protective deity dictates peace over the surrounding valleys, and the surrounding old-growth forests have been preserved for centuries due to sacred religious taboos against cutting the trees.",
  },

  {
    id: "baitadi-melauli-bhagwati",
    slug: "melauli-bhagwati-temple",
    districtId: "baitadi",
    name: "Melauli Bhagwati Temple",
    nameNepali: "मेलाउली भगवती मन्दिर",
    category: ["Temple", "Historical Site"],
    nearestTown:
      "Central Melauli Municipality, roughly 1.5 to 2 hours' drive from Patan or Gothalapani",
    position: [29.3875, 80.4691], // main temple complex centre
    elevationM: 1600,

    interestTags: ["Culture", "History", "Religious"],
    bestSeasons: ["Autumn", "Spring"],
    bestTimeNote: "Vibrant during the Kartik/Dashain festival seasons.",
    budget: "Low-Medium",
    budgetNote: "Slightly further travel required into the southern ridge lines.",
    hiddenGem: false,
    hiddenGemReason:
      'Another heavily revered pillar of the "seven sister" Shaktism tradition across far-western Nepal.',

    shortDescription:
      "Seated on a stunning mountain ridge, Melauli Bhagwati is a powerful, highly historic temple complex known for its deep spiritual traditions and architectural heritage.",
    longDescription:
      "Built using classic hill-pagoda structural concepts, the Melauli Bhagwati Mandir acts as the cultural anchor for southern Baitadi. The temple compound is filled with old stone pillars, ancient bells, and intricately carved doors that reflect medieval artistry. During major seasonal gatherings, the hilltop comes alive with the sound of traditional horns (narsingha) and drums, bringing together thousands of local Bajhangi and Kumaoni cross-border travelers who climb the ridges to seek blessings and witness historic mask rituals.",
    bestFor: "Cultural enthusiasts, religious pilgrims, and heritage photographers.",

    howToGetThere:
      "Accessible via regular local four-wheel-drive jeeps or rural passenger buses heading south from the main Patan highway junction or Dasharathchand Municipality.",
    entryFee: "Free.",
    openingHours:
      "Open daily. Roads can be difficult and prone to landslides during the core rainy monsoon months.",
    nearbyStaysFood:
      "Simple rural lodges, traditional homestays, and community tea-houses operate in the growing Melauli Bazaar area.",
    safetyNotes:
      "Cell coverage is generally available but can experience temporary drops on remote ridge trails. Carrying cash is highly recommended as digital payment systems are absent locally.",

    sources: [
      { label: "Melauli Local Gov Media Archives" },
    ],
    photoCredit: "Melauli Community / Google Maps Contributors",

    alternateNames: [
      "Melauri Bhagwati",
      "Thankot Mandir",
      "Southern Baitadi Shakti Peeth",
    ],
    culturalNote:
      "According to medieval local court chronicles, the temple was heavily patronized by ancient regional kings who constructed special structural towers around the complex to announce astronomical cycles and seasonal agricultural festivals to the valley farmlands below.",
  },

  {
    id: "baitadi-udayadev",
    slug: "udayadev-maharaj-mandir",
    districtId: "baitadi",
    name: "Shree Udayadev Maharaj Mandir",
    nameNepali: "श्री उदयदेव महाराज मन्दिर",
    category: ["Temple", "Cultural Heritage", "Religious Site"],
    nearestTown:
      "Patan Municipality (Ward No. 6), about a 5–10 minute walk or short auto-rickshaw ride from the main Patan Bazaar",
    position: [29.4712, 80.5518], // Maitad/Sangaurkot hilltop area, Patan
    elevationM: 1220,

    interestTags: ["Culture", "History", "Religious", "Relaxation"],
    bestSeasons: ["Autumn", "Spring"],
    bestTimeNote:
      "Autumn (September–November) is the primary festival season; spring runs March–May.",
    budget: "Low",
    budgetNote:
      "Entry is free and local town amenities are very cheap.",
    hiddenGem: true,
    hiddenGemReason:
      "Highly revered within the far-western region, but a lesser-known gem for national and international tourists visiting outside Sudurpashchim.",

    shortDescription:
      "An ancient and highly sacred Hindu temple dedicated to the divine guardian King Udayadev, serving as the central cultural and spiritual anchor of Patan, Baitadi.",
    longDescription:
      "Shree Udayadev Maharaj Mandir stands as a magnificent symbol of deep-rooted faith and traditional architecture in Sudurpashchim Province. Dedicated to King Udayadev, revered as a powerful local deity and divine protector, the shrine features a classic regional architectural style and acts as the lead temple among over 30 sister shrines dedicated to his lineage across the region. Visitors come to witness its serene hilltop setting, participate in local spiritual traditions, and enjoy sweeping views of the green Patan valley. During major regional festivals, the courtyard transforms into a lively display of Far-Western culture, echoing with traditional musical instruments, ritual call-and-response devotionals, and vibrant heritage gatherings.",
    bestFor:
      "Cultural enthusiasts, religious pilgrims, heritage photographers, and peace-seekers.",

    howToGetThere:
      "By air: fly from Kathmandu to Dhangadhi Airport, then take a public bus or private jeep up the Mahakali Highway to Patan, Baitadi (approx. 6–8 hours' drive). Locally: from Patan Bazaar, the temple is a short walk or auto-rickshaw ride up to the Maitad hilltop.",
    entryFee:
      "Free. Voluntary donations are accepted for temple maintenance.",
    openingHours:
      "Open daily, 5:00 AM to 7:00 PM. Accessible year-round, though the hill road journey is best done outside the peak monsoon (July–August) due to potential rain delays.",
    nearbyStaysFood:
      "Numerous local lodges, guest houses, and traditional eateries are available within Patan Bazaar. Basic homestay options are also expanding in nearby settlements like Sakar and Basantapur.",
    safetyNotes:
      "Cell signal (NTC and Ncell) is strong. Road travel along the winding hill highways requires caution; choose daytime travel when possible. Respect temple dress codes: wear modest attire and remove shoes and leather items before entering the inner sanctum.",

    sources: [
      { url: "https://commons.wikimedia.org/wiki/File:Udaydev_temple,_Patan,_Baitadi.jpg", label: "Wikimedia Commons — Udaydev Gallery" },
    ],
    photoCredit: "Wikimedia Commons / Local cultural contributors",

    alternateNames: [
      "Udayadev Mandir",
      "Udaydev Maharaj Shrine",
      "उदयदेव मन्दिर",
      "Udayadev Mahakali Temple",
    ],
    culturalNote:
      "Local folklore holds that King Udayadev was an ancient, highly just ruler whose spirit became a divine guardian protecting the valleys of Baitadi. The grand annual Mela (religious fair) held in Ashoj or Kartik brings the entire municipality together. It features the vibrant Deuda dance, an interactive, lyrical circle dance unique to the far-western hills of Nepal, making the temple grounds a living museum of regional intangible heritage.",
  },

  {
    id: "baitadi-jagannath-gadhi",
    slug: "jagannath-mandir-gadhi",
    districtId: "baitadi",
    name: "Historical Jagannath Mandir (Gadhi)",
    nameNepali: "जगन्नाथ मन्दिर",
    category: ["Cultural Heritage", "Historical Site"],
    nearestTown: "Historic Gadhi fort ridge zone, near Dasharathchand",
    position: [29.5511, 80.3989], // Gadhi fort monument precinct
    elevationM: 1650,

    interestTags: ["History", "Culture", "Religious"],
    bestSeasons: ["Autumn", "Spring", "Winter"],
    budget: "Low",
    hiddenGem: true,
    hiddenGemReason:
      "Despite its national monumental status, it is rarely crowded outside of specific seasonal festival dates.",

    shortDescription:
      "Located on the strategic ridge lines of the ancient Gadhi fort, Jagannath Mandir is a unique, medieval stone temple showcasing rare regional architectural styles.",
    longDescription:
      "Listed formally as a protected historical structure under National Monument ID NP-BA-08, the Jagannath Mandir at Gadhi represents an architectural departure from standard Nepali pagodas. Built entirely using heavy, hand-cut grey stone masonry, the inner chambers house historic stone idols and ancient wood reliefs that have survived for centuries. Its location on the old defensive fort ridge gives visitors a double experience: they can explore the unique structural configurations of the shrine while stepping out onto the ramparts to look across the deep valleys defining the Indo-Nepal frontier.",
    bestFor: "History buffs, architectural researchers, and culture seekers.",

    howToGetThere:
      "Easily reached via a short uphill walk or local jeep drive from the main municipal offices of Dasharathchand town up to the defensive Gadhi ridge.",
    entryFee: "Free.",
    openingHours: "Open during daytime hours year-round.",
    nearbyStaysFood:
      "Full market infrastructure, local guest houses, and traditional family-run eateries are situated just minutes away in the surrounding bazaar.",
    safetyNotes:
      "Cell connectivity is very strong across the entire ridge. Take caution when walking along the old stone steps and high fort edge borders.",

    photoCredit: "Nirajan Pant / Wikimedia Commons",
    sources: [
      { url: "https://en.wikipedia.org/wiki/List_of_monuments_in_Baitadi,_Nepal" },
      { url: "https://commons.wikimedia.org/wiki/File:Jagannath_Mandir_situated_at_Gadhi,_Baitadi,_Nepal.jpg", label: "Wikimedia Commons — Jagannath Mandir Baitadi" },
    ],

    alternateNames: [
      "Jagannath Temple Gadhi",
      "Gadhi Ko Jagannath Mandir",
      "NP-BA-08 Monument",
    ],
    culturalNote:
      "The temple's unique design and placement are directly linked to the ancient medieval Chand and Katyuri defense strategies. It is one of the few ancient temples in the far-western mid-hills dedicated solely to the Jagannath incarnation, maintaining strong historical cultural linkages with cross-border Kumaon traditions.",
  },

  {
    id: "baitadi-jhulaghat",
    slug: "jhulaghat",
    districtId: "baitadi",
    name: "Jhulaghat Border Town & Suspension Bridge",
    nameNepali: "झुलाघाट",
    category: ["Town & Village", "Historical Site", "Landmark"],
    nearestTown: "About 30–40 minutes' downhill drive from Gothalapani Bazaar",
    position: [29.5732, 80.3801], // Mahakali border bridge crossing
    elevationM: 750,

    interestTags: ["History", "Culture", "Adventure", "Relaxation"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote:
      "Summer and monsoon bring heavy heat and high, turbulent river waves.",
    budget: "Low",
    hiddenGem: false,
    hiddenGemReason:
      "The premier, long-standing historical border gateway connecting Baitadi with Pithoragarh in Uttarakhand, India.",

    shortDescription:
      "Nestled along the banks of the turbulent Mahakali River, Jhulaghat is a historic border trading town centered around a famous, centuries-old suspension bridge.",
    longDescription:
      "Serving for generations as the primary economic and cultural link across the western border, Jhulaghat provides a vibrant, cross-cultural experience. The town is built along the deep gorges of the Mahakali River, where the primary attraction is the historic iron suspension bridge that pedestrian travelers walk across between Nepal and India. The town's markets are filled with unique goods, cross-border fabrics, and local street foods. The surrounding river valleys also serve as prime starting points for adventure enthusiasts interested in seasonal river rafting along the rapid waters of the Mahakali.",
    bestFor: "Cultural shoppers, slow-travelers, and adventure road-trippers.",

    howToGetThere:
      "Regular public jeeps and micro-buses depart throughout the day down the winding mountain roads from Gothalapani Bazaar directly to the Jhulaghat river station.",
    entryFee:
      "Free to visit the town and market. Standard citizenship checks or passports apply at the security gates for international border crossing.",
    openingHours:
      "The border town is accessible year-round; the international bridge gates operate under set daily hours, typically closing by sunset.",
    nearbyStaysFood:
      "Good options for local market lodges, traditional eateries, and fast-food stalls serving fresh river fish and distinct local hill cuisines.",
    safetyNotes:
      "The Mahakali River current is very fast and highly dangerous; swimming or approaching unguided banks is strictly forbidden. Security check-posts require valid identification documents.",

    photoCredit: "Cross-Border Documentation Group / Nepal Traveller",
    sources: [
      { url: "https://www.kupi.com/en/explore/nepal/baitadi" },
      // TODO: this URL is an article about Bajhang, not Jhulaghat — replace it.
      { url: "https://nepaltraveller.com/sidetrack/explore-bajhang-where-mountains-meet-myths", label: "Nepal Traveller Jhulaghat archive" },
    ],

    alternateNames: [
      "Jhulaghat Baitadi",
      "Mahakali River Crossing",
      "Pithoragarh-Baitadi Gateway",
    ],
    culturalNote:
      "For centuries before modern highways were built, this narrow point of the Mahakali River was crossed using temporary hemp rope bridges (jhula), giving the settlement its permanent name. It represents a vital cultural bridge where families on both sides share language, marriages, and joint participation in the ancient Gaura Parva festivals.",
  },

  {
    id: "baitadi-dewalhat",
    slug: "dewalhat-panchadeval",
    districtId: "baitadi",
    name: "Dewalhat (Panchadeval) Archaeological Site",
    nameNepali: "देवलहाट पञ्चदेवल",
    category: ["Cultural Heritage", "Historical Site", "Archaeological Site"],
    nearestTown: "Patan Municipality, roughly 5–10 minutes from the Patan core bazaar",
    position: [29.4589, 80.5482], // stone temple complex near Patan
    elevationM: 1240,

    interestTags: ["History", "Culture", "Religious", "Archaeology"],
    bestSeasons: ["Autumn", "Spring", "Winter"],
    budget: "Low",
    hiddenGem: true,
    hiddenGemReason:
      "Recognized under national monument IDs NP-BA-01 and NP-BA-02, yet it receives very low footfall outside of regional heritage students.",

    shortDescription:
      "Dewalhat is an ancient archaeological enclave featuring seven pristine, multi-tiered medieval stone spire temples (shikhara) and historic stepwells.",
    longDescription:
      "Known locally as the Panchadeval despite housing seven standing stone monuments today, this site showcases the classic Shikhara architecture popularized during the Katyuri and ancient Khas empires. Built entirely out of interlocking grey stones without mortar, the temples feature detailed reliefs of cosmic diagrams and deities. The site features the Dewalhatka Naula Bhapi (ancient stepwells), Shivakunda holy pools, and a collection of Sahasralinga stone carvings. It stands as one of the most critical archaeological records of medieval craftsmanship in the far-western hills.",
    bestFor:
      "Historians, architecture researchers, and cultural heritage enthusiasts.",

    howToGetThere:
      "Easily reached via a short walk or a 5-minute local auto/jeep ride from the main Patan bazaar along the Dasharathchand Highway.",
    entryFee: "Free.",
    openingHours: "Open daily during daylight hours year-round.",
    nearbyStaysFood:
      "Plentiful local lodges, small hotels, and authentic food stalls are situated right nearby in Patan Municipality.",
    safetyNotes:
      "Cell connectivity is strong and stable. Walk carefully around the ancient stone bases as some structures are fragile.",

    sources: [
      { url: "https://en.wikipedia.org/wiki/List_of_monuments_in_Baitadi,_Nepal", label: "List of Monuments in Baitadi (Wikipedia)" },
    ],
    photoCredit: "Department of Archaeology, Nepal / Wikimedia Commons",

    alternateNames: [
      "Dewalhatka Dewalharu",
      "Patan Panchadeval",
      "Saptadeval Baitadi",
      "NP-BA-02",
    ],
    culturalNote:
      "Local spiritual folklore attributes the construction of these massive stone blocks to the legendary Pandavas from the Mahabharata, who supposedly erected the spires in a single night during their forest exile (Banabasa).",
  },

  {
    id: "baitadi-shivnath",
    slug: "shivnath-temple",
    districtId: "baitadi",
    name: "Shivnath Temple",
    nameNepali: "शिवनाथ मन्दिर",
    category: ["Temple", "Historical Site", "Cultural Heritage"],
    nearestTown:
      "Shivnath Rural Municipality, on a high ridge overlooking the Mahakali River loop along the Indo-Nepal border",
    position: [29.3512, 80.3704], // approximate — high ridge sanctuary in Shivnath RM
    elevationM: 1450,

    interestTags: ["Culture", "History", "Religious", "Nature"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote:
      "Vibrant during Shivaratri and local full moon Jaat festivals.",
    budget: "Medium",
    budgetNote:
      "Due to its geographic isolation in the southwestern corner of the district.",
    hiddenGem: true,

    shortDescription:
      "Shivnath Temple is an ancient, highly revered hilltop sanctuary dedicated to Lord Shiva, offering expansive views of the Mahakali River gorge along the Nepal-India border.",
    longDescription:
      "Standing as a historical bastion of Shaivism in the mid-hills, the Shivnath Temple features traditional far-western stone masonry structures that have served borderland communities for generations. The temple complex occupies a strategic vantage ridge, allowing visitors to look directly across the river bends into the Kumaon hills of Uttarakhand, India. During key seasonal gatherings, the temple grounds fill with the deep resonance of traditional horns, bringing together regional devotees who climb the heights to participate in ancient rituals, observe traditional Jagar culture, and experience local religious customs that have remained intact for centuries.",
    bestFor:
      "Cultural researchers, off-the-beaten-path explorers, and spiritual travelers.",

    howToGetThere:
      "Travel from the Patan or Gothalapani highway hubs using a local four-wheel-drive jeep heading southwest toward Shivnath Rural Municipality along the unpaved rural border corridors. A scenic hike up the ridge path leads directly to the temple complex.",
    entryFee: "Free.",
    openingHours:
      "Open daily. The unpaved dirt tracks through the hills can become heavily muddy and difficult to traverse during peak monsoon downpours.",
    nearbyStaysFood:
      "Simple rural tea shops and basic family-run eateries operate in the nearby rural municipality bazaar hubs. Formal accommodation is minimal, so most long-distance travelers plan day trips and return to Patan or Gothalapani for hotels.",
    safetyNotes:
      "Cellular signals can become weak or fluctuate along the immediate border valley drops. Carry local cash: digital payment facilities and ATMs are absent in the immediate vicinity.",

    photoCredit: "Local Community Developers / Sudurpashchim Khabar",
    sources: [
      { url: "https://en.wikipedia.org/wiki/Baitadi_District" },
      { url: "https://nepaltraveller.com/travel/cities/patan-the-heart-of-baitadi" },
      { url: "https://www.youtube.com/watch?v=9srm0P_XYJY" },
      { label: "Shivnath Regional Media Archives" },
    ],

    alternateNames: [
      "Shivanath Mandir",
      "Shivnath Dham Baitadi",
      "Mahakali Border Shiva Temple",
    ],
    culturalNote:
      "The temple is the namesake anchor for the entire Shivnath local governance unit. Local folklore states that the protective energy of the deity guards the traditional river trade routes below, cementing the shrine as a shared cultural link where cross-border communities exchange centuries-old devotional traditions during the annual Gaura Parva celebrations.",
  },
];

export function getBaitadiDestination(slug: string): Destination | undefined {
  return baitadiDestinations.find((d) => d.slug === slug);
}