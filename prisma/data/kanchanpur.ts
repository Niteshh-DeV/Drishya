/**
 * Kanchanpur — destination content (8 entries), converted from
 * Kanchanpur.docx, with photo credits from Credit.docx.
 *
 * Shuklaphanta, the Dodhara Chandani bridge, Bhamkeni Dham and Bandha Tal
 * cite specific sources. Jhilmila, Bedkot, the four-lane bridge and Saket Dham
 * cite only portal home pages, so their figures are kept as written but could
 * not be traced. Fields the doc marks unverified are left out and listed in
 * `verify`, as is the one place where the doc contradicts its own pin.
 */
import type { Destination } from "@/lib/types";

const BHIMDATTA_MUNICIPALITY = { url: "http://bheemdattamun.gov.np", label: "Bhimdatta Municipality" };

export const kanchanpurDestinations: Destination[] = [
  {
    id: "kanchanpur-shuklaphanta-national-park",
    slug: "shuklaphanta-national-park",
    districtId: "kanchanpur",
    name: "Shuklaphanta National Park",
    nameNepali: "शुक्लाफाँटा राष्ट्रिय निकुञ्ज",
    category: ["Forest & Wildlife", "Meadow", "Lake & Wetland"],
    nearestTown:
      "Bhimdatta (Mahendranagar); the park headquarters is at Majhgaon, Bhimdatta-16, about 5 km south",
    // A point inside the park from Google Maps, not the Majhgaon headquarters.
    position: [28.85564, 80.25444],

    interestTags: ["Wildlife", "Nature", "Adventure"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote:
      "October to early April. November to March is best for wildlife, when shorter grass opens up the views and the swamp deer gather in large herds.",
    budget: "Medium",
    budgetNote: "Park permits, accommodation, local transport and safari arrangements.",
    hiddenGem: true,
    hiddenGemReason: "A quieter, less commercial wildlife experience than Chitwan or Bardiya.",

    shortDescription:
      "Shuklaphanta National Park protects one of Nepal's largest Terai grasslands, home to the world's largest herd of swamp deer as well as Bengal tigers, rhinos, wild elephants and more than 400 bird species.",
    longDescription:
      "Shuklaphanta National Park is one of Nepal's most important wilderness areas, in southwestern Kanchanpur on the border with India. It covers 305 km² of Terai and Siwalik (Chure) country, with a further 243.5 km² of buffer zone.\n\nThe park is named for its phantas, the vast open grasslands where, in winter, the white seed heads of tall thatch grass turn the plains pale. These grasslands support thousands of swamp deer (barasingha), the world's largest herd, along with spotted deer and hog deer. Bengal tigers, Asian wild elephants and greater one-horned rhinoceroses live here too, and the birdlife includes endangered grassland species such as the Bengal florican.\n\nWetlands, rivers and sal forest complete the landscape, which is part of the wider Terai Arc, with wildlife corridors linking Nepal and India. The main sights are the Shuklaphanta grasslands, the machans (wildlife-viewing towers), Rani Tal, Baba Tal, and the blackbuck reintroduction area at Hirapur.",
    bestFor:
      "Wildlife safaris, birdwatching, wildlife and landscape photography, and research on Terai grassland ecology.",

    howToGetThere:
      "Fly from Kathmandu to Dhangadhi and drive about 55 km west (around 1.5 hours) to the park. The headquarters and main visitor entrance are at Majhgaon, Bhimdatta-16, about 5 km south of Bhimdatta. Buses, taxis, jeeps and private vehicles all make the trip.",
    entryFee:
      "Per person per entry, as listed by the Nepal Tourism Board: Nepali citizens NPR 100; SAARC nationals NPR 750; other foreign nationals NPR 1,500; children under 10 free. Vehicle, guide and activity charges are extra.",
    openingHours:
      "Generally daylight hours. Confirm current times, entry arrangements and seasonal restrictions with the park office.",
    nearbyStaysFood:
      "Jungle lodges, safari resorts and hotels in the buffer-zone villages and in Bhimdatta, with restaurants in town.",
    safetyNotes:
      "Follow park rules and use authorised guides and safari operators. Confirm vehicle requirements and permitted safari routes with the park before entering. Wear muted, earthy colours, keep a safe distance from elephants, rhinos and other animals, and never feed or approach wildlife or enter restricted areas.",

    photoCredit:
      "Megaurab09 (CC BY-SA 4.0, Wikimedia Commons), Kaviraj Bohara, DNPWC, Ganesh Paudel (CC BY-SA 3.0, Wikimedia Commons), RSS (Nepal Traveller)",
    sources: [
      { url: "https://dnpwc.gov.np", label: "Department of National Parks and Wildlife Conservation" },
      {
        url: "https://shuklaphantanationalpark.gov.np/pages/introduction/",
        label: "Shuklaphanta National Park — Introduction",
      },
      {
        url: "https://dnpwc.gov.np/media/publication/Sukhlaphant_Management_Plan_19_NOV_2023.pdf",
        label: "Shuklaphanta National Park Management Plan, 2023 (PDF)",
      },
      { url: "https://ntb.gov.np/en/shuklaphanta-national-park", label: "Nepal Tourism Board — Shuklaphanta National Park" },
      {
        url: "https://ntb.gov.np/en/plan-your-trip/before-you-come/park-entry-fees",
        label: "Nepal Tourism Board — Park entry fees",
      },
    ],

    alternateNames: ["Shuklaphanta Rashtriya Nikunja", "Shuklaphanta Wildlife Reserve"],
    culturalNote:
      "The name comes from the phanta, the local word for these open grasslands, and is commonly linked to the white look of the flowering thatch grass in winter. The area was set aside as a royal hunting reserve in 1969 to protect its swamp deer, declared the Royal Shuklaphanta Wildlife Reserve in 1976, and upgraded to a national park in 2017. The Tharu, Rana and Sonaha communities around the park shape the region's culture and livelihoods. The park is known for protecting swamp deer, reintroducing blackbuck and conserving Bengal tigers, work that earned it the TX2 Award in 2022.",
    // The brochure (174–1,386 m) and the management plan (176–1,353 m) give
    // different elevation ranges, so neither is stored.
    verify: ["openingHours"],
  },

  {
    id: "kanchanpur-dodhara-chandani-bridge",
    slug: "dodhara-chandani-suspension-bridge",
    districtId: "kanchanpur",
    name: "Dodhara Chandani Suspension Bridge",
    nameNepali: "दोधारा चाँदनी झोलुङ्गे पुल",
    category: ["Landmark", "River", "Viewpoint"],
    nearestTown:
      "Bhimdatta (Mahendranagar), about 9–12 km by road; Dodhara Chandani Municipality on the far bank",
    position: [28.92379, 80.11399],
    elevationM: 176,

    interestTags: ["History", "Culture", "Nature"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote:
      "Before the closure, October to April gave the most comfortable weather and the clearest river views. That holds again only once the authorities reopen the bridge.",
    budget: "Low",
    hiddenGem: false,
    hiddenGemReason: "A well-known regional landmark and a symbol of connectivity in Sudurpashchim.",

    shortDescription:
      "A 1.45-kilometre multi-span footbridge over the Mahakali River that linked Dodhara Chandani with Bhimdatta and the rest of Nepal. It has been closed since floods brought down a central tower and a section of the deck on 30 September 2026.",
    longDescription:
      "The Dodhara Chandani Suspension Bridge is one of the engineering landmarks of Sudurpashchim. A multi-span pedestrian bridge 1,452.96 metres long and 1.6 metres wide, held up by eight major towers, it crosses the Mahakali River between Bhimdatta Municipality and Dodhara Chandani Municipality. It was completed in 2061 BS (2004).\n\nThe Mahakali separates Dodhara and Chandani from the rest of Nepal. Before the bridge, residents often had to travel through India to reach Mahendranagar, which made everyday trips to school, hospital, market and government offices difficult. The bridge transformed local mobility and became a symbol of regional connectivity, and its length, river views and web of cables drew visitors and photographers.\n\nOn 30 September 2026, flooding and riverbank erosion brought down a central supporting tower and a major section of the bridge, and about 5–6 metres of another deck section was reported lifted or distorted. Movement across the bridge was stopped and a technical assessment began; a later estimate put reconstruction at about NPR 200 million, depending on funding, technical work and river conditions. Check the latest local government notices before planning a visit.",
    bestFor:
      "Engineering and infrastructure enthusiasts, river and landscape photographers, and anyone interested in the history of Nepal's borderland communities.",

    howToGetThere:
      "The bridge is about 9–12 km from central Bhimdatta, reached by auto-rickshaw, taxi, motorcycle or private vehicle. It is closed: do not try to reach or enter the damaged structure. To cross between Bhimdatta and Dodhara Chandani, use the four-lane Mahakali road bridge about 2–3 km upstream.",
    entryFee: "Free before the closure, with no ticket; local parking or transport charges may apply.",
    openingHours:
      "Closed to all movement since the collapse on 30 September 2026. No reopening date has been confirmed.",
    nearbyStaysFood:
      "Tea shops and small eateries have operated in the settlements near the bridge approaches; check locally during the closure. Bhimdatta has more accommodation and restaurants.",
    safetyNotes:
      "The bridge is closed because of major structural damage — do not attempt to cross it. Don't bypass barriers, enter restricted areas or approach damaged sections for photographs, and follow instructions from police, municipal staff and technical teams. Keep well back from the Mahakali, especially in the monsoon and at high water.",

    photoCredit:
      "Hopingyousuf (CC BY-SA 4.0, Wikimedia Commons), Kalopati, Beautiful Far West Nepal, Arjun Bhadra Khanal (Photowalk Nepal)",
    sources: [
      { url: "https://www.dodharachandanimun.gov.np/", label: "Dodhara Chandani Municipality" },
      {
        url: "https://dodharachandanimun.gov.np/content/%E0%A4%A6%E0%A5%8B%E0%A4%A7%E0%A4%BE%E0%A4%B0%E0%A4%BE-%E0%A4%9A%E0%A4%BE%E0%A4%A6%E0%A4%81%E0%A4%A8%E0%A5%80-%E0%A4%A8%E0%A4%97%E0%A4%B0%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A4%BF%E0%A4%95%E0%A4%BE%E0%A4%95%E0%A5%8B-%E0%A4%AA%E0%A4%B0%E0%A4%BF%E0%A4%9A%E0%A4%AF",
        label: "Dodhara Chandani Municipality — Introduction",
      },
      {
        url: "https://kathmandupost.com/sudurpaschim-province/2026/09/30/flood-damages-iconic-dodhara-chandani-suspension-footbridge",
        label: "The Kathmandu Post — Flood damages iconic Dodhara Chandani suspension footbridge",
      },
      {
        url: "https://english.onlinekhabar.com/technical-study-begins-into-damage-to-suspension-bridge-linking-dodhara-chandani.html",
        label: "Onlinekhabar — Technical study begins into damage to suspension bridge",
      },
      {
        url: "https://english.khabarhub.com/2026/13/571860/",
        label: "Khabarhub — Reconstruction estimated at NPR 200 million",
      },
    ],

    alternateNames: ["Dodhara Chandani Jhulunge Pul", "Mahakali Suspension Bridge"],
    culturalNote:
      "The bridge was built to end the isolation of Dodhara and Chandani, cut off from the rest of Nepal by the Mahakali River. Completed in 2061 BS (2004), it became a symbol of national connectivity and local development, strengthened social and economic ties with the rest of Kanchanpur, and grew into a well-known landmark in its own right. It remains part of the region's infrastructure history while it is closed after the September 2026 collapse.",
  },

  {
    id: "kanchanpur-jhilmila-lake",
    slug: "jhilmila-lake",
    districtId: "kanchanpur",
    name: "Jhilmila Lake",
    category: ["Lake & Wetland", "Religious Site"],
    nearestTown: "Brahmadev–Matena area, Bhimdatta-9; about 21 km north of central Bhimdatta",
    position: [29.06776, 80.18764],
    elevationM: 668,

    interestTags: ["Nature", "Religious", "Wildlife"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote:
      "October to March, when dry, mild weather keeps the forest road firm. The dirt road is prone to mud and landslips in the June–September monsoon.",
    budget: "Low-Medium",
    budgetNote: "Mainly a hired jeep or off-road motorbike for the forest road, plus simple meals.",
    hiddenGem: true,
    hiddenGemReason: "Off the beaten path compared with the busier lakes of central Nepal.",

    shortDescription:
      "A spring-fed lake hidden in the forested Chure hills north of Bhimdatta, known for water said to change colour through the day and for its place in local Mahabharata tradition.",
    longDescription:
      "Jhilmila Lake (Jhilmila Tal) is a natural lake tucked into the green ridges of the Chure (Siwalik) range in Bhimdatta Municipality, at about 668 metres. Fed mainly by springs, it covers about 4.3 hectares and is up to 9 metres deep.\n\nThe lake is best known for the way its surface changes colour with the light: golden in the morning, clear blue in the afternoon and deep green by evening. A small temple stands on the bank, and the lake is a pilgrimage site linked in local tradition to the Mahabharata.\n\nThe still water reflects the surrounding sal forest, and the lake's fish are protected. With little built around it and only a rough forest road leading in, it remains a quiet, uncommercialised place.",
    bestFor:
      "Pilgrims, nature lovers looking for an undeveloped lakeside, and travellers exploring the Chure foothills of Kanchanpur.",

    howToGetThere:
      "Travel about 21 km north from central Bhimdatta to Brahmadev or Matena by local transport, then take a four-wheel-drive jeep or high-clearance motorcycle up the 9 km unpaved forest road into the hills.",
    entryFee: "Free; donations can be made at the lakeside temple.",
    openingHours:
      "Sunrise to sunset. Avoid the forest road after dark: it is unlit and wildlife moves through the area.",
    nearbyStaysFood:
      "Facilities at the lake are kept to a minimum to protect it; there are basic tea houses and snack stalls near the end of the road. Hotels and restaurants are in Bhimdatta.",
    safetyNotes:
      "Swimming and bathing in the lake are prohibited, for safety and religious reasons. Avoid the dirt road in the monsoon, when mud and landslips are common. Hunting, littering and disturbing the fish are forbidden.",

    photoCredit: "DP Bhatta (Facebook), Janak Raj Bhatta (Facebook), Abarta Pandey (local guide)",
    sources: [
      BHIMDATTA_MUNICIPALITY,
      {
        url: "https://giwmscdntwo.gov.np/media/pdf_upload/SP%20Tourism%20Master%20Plan%20Report%20-final%20revised-web%20version%202023_5lvnqot.pdf",
        label: "Sudurpashchim Province Tourism Master Plan (PDF)",
      },
      { label: "Nepal Journal of Science and Technology — Lake water quality and vegetation in the Churiya hills" },
    ],

    alternateNames: ["Jhilmila Tal"],
  },

  {
    id: "kanchanpur-bedkot-lake",
    slug: "bedkot-lake",
    districtId: "kanchanpur",
    name: "Bedkot Lake",
    nameNepali: "बेदकोट ताल",
    category: ["Lake & Wetland", "Religious Site"],
    nearestTown:
      "Daijee Bazaar on the Mahendra Highway; Bedkot Municipality-4, about 22 km northeast of Bhimdatta",
    position: [29.0234, 80.3201],

    interestTags: ["Nature", "Religious", "Relaxation", "Trekking"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote: "October to April, with mild weather, steady roads and clear water after the monsoon.",
    budget: "Low",
    budgetNote: "Mostly local road transport; there is no entry fee.",
    hiddenGem: true,
    hiddenGemReason: "Popular with domestic visitors, but still uncrowded for travellers from abroad.",

    shortDescription:
      "A forest-ringed freshwater lake at the foot of the Chure hills, known for its calm water and for Lingeshwor Dham, the Shiva temple beside it — an easy trip from Bhimdatta or Dhangadhi.",
    longDescription:
      "Bedkot Lake (Bedkot Tal) lies at the foot of the Chure hills in Bedkot Municipality, at about 480–500 metres. Fed by springs and local streams, it covers about 5.3 hectares and is up to 6 metres deep, and its calm water reflects the surrounding forest of sal, pine and mixed hill trees.\n\nThe lake helps regulate local floods, holds soil in place and supports the biodiversity of the foothills. Beside it stands Lingeshwor Dham (Linga Dham), a temple complex dedicated to Lord Shiva, which draws devotees for ritual bathing, meditation and the major Hindu festivals.\n\nPicnic areas line the shore, and a recently black-topped road from the highway has made the lake easy to reach.",
    bestFor:
      "Picnics and day trips from Bhimdatta or Dhangadhi, pilgrims visiting Lingeshwor Dham, and photographers after forest reflections and Chure birdlife.",

    howToGetThere:
      "Drive along the Mahendra Highway to Daijee Bazaar, then turn north on the tarred access road for about 5–7 km to the lakeside parking area. The lake is about 22 km northeast of Bhimdatta.",
    entryFee:
      "Free; offerings at the temple are voluntary, and municipal staff may collect a small parking fee.",
    openingHours:
      "6:00 AM to 6:00 PM daily. Don't head into the forest behind the lake or onto unlit tracks after dark.",
    nearbyStaysFood:
      "Tea houses, snack stalls and simple eateries along the Daijee approach road serve local fish dishes and quick meals.",
    safetyNotes:
      "Swimming and wading beyond the marked shore are prohibited: the bottom drops away suddenly and the mud is deep. Watch for wild animals on the forest trails beyond the park, and don't litter, dump plastic in the wetland or disturb the fish — all are penalised.",

    photoCredit: "Shambhu S. Bista (CC BY-SA 4.0, Wikimedia Commons), GTM Vlogs (TikTok)",
    sources: [
      { url: "http://bedkotmun.gov.np", label: "Bedkot Municipality" },
      {
        label:
          "Nepal Journal of Science and Technology — Lake water quality and surrounding vegetation in the dry Churiya hills",
      },
    ],

    alternateNames: ["Bedkot Tal", "Betkot Lake"],
    culturalNote:
      "Through the adjoining Lingeshwor Dham, Bedkot Lake is a centre of religious tourism and Shiva worship in the far west, and its temple and shrines are kept as sacred spaces for worship and meditation.",
  },

  {
    id: "kanchanpur-mahakali-four-lane-bridge",
    slug: "four-lane-mahakali-bridge",
    districtId: "kanchanpur",
    name: "Four-Lane Mahakali River Bridge",
    nameNepali: "चार लेन महाकाली पुल",
    category: ["Landmark", "River", "Viewpoint"],
    nearestTown: "Bhimdatta (Mahendranagar), about 6–8 km to the east",
    position: [28.94552, 80.10423],
    elevationM: 178,

    interestTags: ["Nature", "Relaxation"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote:
      "Open year-round. October to April brings a steady river, clear horizons and comfortable afternoons; come at golden hour for the sunset over the riverbed.",
    budget: "Low",
    hiddenGem: false,
    hiddenGemReason: "A prominent and busy highway landmark.",

    shortDescription:
      "A four-lane concrete road bridge over the Mahakali River between Bhimdatta and Dodhara Chandani. Since the old suspension footbridge closed in 2026 it is the crossing everyone uses, and its wide walkways are a favourite place to watch the sun set over the river.",
    longDescription:
      "The Four-Lane Mahakali River Bridge carries the road from Bhimdatta, on the east bank of the Mahakali, to Dodhara Chandani on the west. The prestressed concrete bridge is about 800 metres long and 21.6 metres wide and opened to traffic in 2080 BS (2023). Stone-faced river-training embankments on both banks hold the braided channels in place.\n\nThe bridge stands about 2 km upstream of the Dodhara Chandani Suspension Bridge, close to the international border. Since the suspension bridge was damaged and closed in September 2026, all traffic between the two municipalities has used this crossing.\n\nBeyond freight and daily traffic, the wide walkways have become a popular evening gathering spot, with long views of the sunset over the riverbed.",
    bestFor:
      "Travellers crossing the Mahakali, photographers after sunsets and long bridge perspectives, and anyone interested in Nepal's new infrastructure.",

    howToGetThere:
      "Follow the paved multi-lane road west from Bhimdatta's main bazaar for about 6–8 km to the bridge's eastern approach. Auto-rickshaws, taxis and buses use the route daily.",
    entryFee:
      "Free to walk or drive across; highway tolls or vehicle charges may be collected separately at transport posts.",
    openingHours: "Open at all hours as part of the national highway.",
    nearbyStaysFood:
      "Snack stalls, tea houses and small cottages near both approaches; hotels and restaurants are in Bhimdatta.",
    safetyNotes:
      "Stay alert on the walkways — heavy trucks run constantly in the traffic lanes. Wind over the open riverbed can be strong, so hold on to loose belongings and camera gear. Don't climb or sit on the guard rails, and follow instructions from the traffic police.",

    photoCredit: "RSS (The Rising Nepal), DP Bhatta (DP Photography, TikTok)",
    sources: [
      { url: "https://mopit.gov.np/", label: "Ministry of Physical Infrastructure and Transport" },
      { url: "https://dor.gov.np/", label: "Department of Roads" },
    ],

    alternateNames: ["Chaar-Lane Mahakali Pul", "New Mahakali Motorable Bridge", "Mahakali Concrete Four-Lane Bridge"],
    culturalNote:
      "The bridge gives Kanchanpur a permanent, flood-resistant road crossing of the Mahakali, strengthening its role as a transport gateway on the border and a link in the far west's economy.",
  },

  {
    id: "kanchanpur-saket-dham",
    slug: "vishnu-mandir-saket-dham",
    districtId: "kanchanpur",
    name: "Vishnu Mandir (Saket Dham)",
    nameNepali: "साकेत धाम",
    category: ["Temple", "Religious Site"],
    nearestTown: "Tilakpur, Bhimdatta Municipality-3",
    // The doc puts the temple 12–14 km north of the bazaar, but this pin (also
    // from the doc) is only 5–6 km from central Bhimdatta.
    position: [29.00998, 80.19784],
    elevationM: 176,

    interestTags: ["Religious", "Culture"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote:
      "October to April, when the dry season keeps the rural roads and stream crossings passable. Ekadashi and Ram Navami bring festival crowds.",
    budget: "Low",
    budgetNote: "No entry fee; only local transport and optional donations.",
    hiddenGem: true,
    hiddenGemReason: "In rural Tilakpur, away from the main bazaar.",

    shortDescription:
      "A community-run Vishnu temple in rural Tilakpur, north of Bhimdatta, with a tiered yellow pagoda, a brick-paved courtyard and two large ponds — a gathering place for local worship and festivals.",
    longDescription:
      "Saket Dham is a community-managed Hindu temple in the rural Tilakpur area of Bhimdatta Municipality. Its multi-tiered yellow pagoda houses a central stone idol of Lord Vishnu, and the brick-paved courtyard is flanked by two large ponds.\n\nThe temple was rebuilt and expanded by the local community in 2059 BS and is looked after by a temple management committee. It sits near the foot of the Chure hills, between the Pumai River to the east and the seasonal Khanya Khola to the west.\n\nOn most days it serves the surrounding villages for morning and evening prayers, and on festival days in the Hindu calendar it becomes a gathering place for the whole area.",
    bestFor:
      "Travellers interested in rural temple architecture and community shrines, devotees, and sightseers heading towards the Chure foothills.",

    howToGetThere:
      "From the main bazaar and bus park in Bhimdatta, head about 12–14 km north on the roads towards Brahmadev and the Chure hills. The last stretch is on unpaved rural roads, so a four-wheel-drive vehicle or motorcycle is advised. Confirm the route locally.",
    entryFee: "Free; donations to the community trust go towards maintenance.",
    openingHours: "Sunrise to sunset. Avoid the unlit rural roads after dark.",
    nearbyStaysFood:
      "Only basic tea stalls selling snacks and bottled water; accommodation and restaurants are back in Bhimdatta.",
    safetyNotes:
      "Take care at the edges of the ponds and stream banks in wet weather. Remove your shoes before stepping onto the prayer platforms, and put plastic waste in the municipal bins.",

    photoCredit: "Rajesh Dhungana (CC BY-SA 4.0, Wikimedia Commons), Visit Kanchanpur 2026 (Facebook)",
    sources: [
      {
        url: "https://commons.wikimedia.org/wiki/File:Vishnu_Temple_or_Saket_Dham_Talakpur_Mahendranagar_Kanchanpur_Nepal_Rajesh_Dhungana_(28).jpg",
        label: "Wikimedia Commons — Vishnu Temple or Saket Dham, Talakpur",
      },
      BHIMDATTA_MUNICIPALITY,
    ],

    alternateNames: ["Saket Dham", "Vishnu Mandir Tilakpur", "Vishnu Temple"],
    culturalNote:
      "Saket Dham is the religious centre of the farming community of Bhimdatta Ward 3. Community committees run the temple and manage pilgrims and festival crowds.",
    verify: ["howToGetThere"],
  },

  {
    id: "kanchanpur-bhamkeni-dham",
    slug: "bhamkeni-dham",
    districtId: "kanchanpur",
    name: "Bhamkeni Dham",
    nameNepali: "भम्केनी धाम",
    category: ["Religious Site", "Temple"],
    nearestTown: "Tilachaur, Bhimdatta Municipality-8",
    position: [29.03523, 80.1727],

    interestTags: ["Religious", "Culture"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote:
      "October to April is a general recommendation for the region rather than an established season for the site.",
    budget: "Low",
    budgetNote: "Confirm any costs or contributions locally.",
    hiddenGem: true,
    hiddenGemReason: "An emerging religious tourism destination in Kanchanpur.",

    shortDescription:
      "A developing religious site at the foot of the Chure hills in Tilachaur, known for its nine ponds representing the nine districts of Sudurpashchim and a 75-foot statue of Nepal Aama now under construction.",
    longDescription:
      "Bhamkeni Dham is a religious and cultural site at the foot of the Chure range in Bhimdatta Municipality-8. It has grown through religious activities begun by Jagatguru Mohansharan Devacharya and efforts to develop the area for religious tourism.\n\nIts largest project is a 75-foot statue of Nepal Aama (Mother Nepal), intended to represent Nepal's 75 former districts. Work began in 2075 BS but has been slowed by funding problems; reports in October 2026 described construction resuming.\n\nThe site also has nine separate ponds, one for each district of Sudurpashchim Province, set among colourful temples, an open courtyard and greenery.",
    bestFor:
      "Hindu devotees and pilgrims, visitors interested in local religious traditions, and travellers curious about Nepal's monumental statue projects.",

    howToGetThere:
      "Head for the Tilachaur area of Bhimdatta Municipality-8 and follow the map pin for the final approach. Confirm road conditions locally.",
    nearbyStaysFood:
      "Small tea houses and village shops along the way sell snacks and drinking water; for hotels and restaurants, stay in central Bhimdatta.",
    safetyNotes:
      "Follow the temple management committee's instructions, respect religious customs, keep the ponds and temple grounds clean, and stay out of any area where construction is under way.",

    photoCredit: "Trip.com, Manish Bhatt (TikTok)",

    alternateNames: ["Bhamkeni Religious Site"],
    culturalNote:
      "Bhamkeni Dham is associated with religious activities led by Jagatguru Mohansharan Devacharya. According to a local legend reported in regional media, its name comes from an episode involving the Pandavas during their exile. The Nepal Aama statue and the nine district ponds reflect efforts to promote religious tourism in the province.",
    verify: ["elevationM", "entryFee", "openingHours"],
  },

  {
    id: "kanchanpur-bandha-tal",
    slug: "bandha-tal",
    districtId: "kanchanpur",
    name: "Bandha Tal",
    nameNepali: "बन्धा ताल",
    category: ["Lake & Wetland"],
    nearestTown: "Belauri Bazaar, Belauri Municipality-4",
    // Google Maps pin for Bandhatal Picnic Ground, which the doc recommends as
    // the visitor reference; GeoNames puts the lake ~200 m to the south-west.
    position: [28.66932, 80.40966],

    interestTags: ["Nature", "Wildlife", "Relaxation"],
    bestSeasons: ["Autumn", "Winter", "Spring"],
    bestTimeNote:
      "October to April. Winter is the time for migratory waterbirds in the wider Belauri wetlands.",
    budget: "Low-Medium",
    budgetNote: "Indicative; mostly transport and food.",
    hiddenGem: true,
    hiddenGemReason: "A lesser-known wetland in southern Kanchanpur with developing tourism potential.",

    shortDescription:
      "A natural lake and wetland in Belauri Municipality, southern Kanchanpur, valued for its waterbirds and local biodiversity — an emerging spot for birdwatching, nature walks and rural tourism.",
    longDescription:
      "Bandha Tal (Bandhatal) is a natural wetland in Belauri Municipality-4, in the Terai of southern Kanchanpur. Belauri Municipality lists it among its lakes, and its wetland provides habitat for fish and waterbirds.\n\nThe Government of Nepal named Bandha Tal among its 100 new tourism destinations in 2075 BS. In July 2025, work began on tourism infrastructure with a federal investment of NPR 54.3 million; the plans included a protective wall around the lake and proposed a temple and a bridge leading to it. Check what has been completed before you go.\n\nThe lake is part of Belauri's wider wetland system. The Asian Waterbird Census 2025 counted 48 waterbird species and 1,349 birds at the combined Puraini and Bandha Tal survey site, and the 2026 census counted 2,352 waterbirds across the two lakes — figures for both lakes together, not Bandha Tal alone.",
    bestFor:
      "Birdwatchers, nature lovers interested in wetlands, photographers of lakes and rural Terai scenery, and visitors looking for lesser-known places.",

    howToGetThere:
      "Travel from Bhimdatta (Mahendranagar) towards Belauri on the regional roads, then follow the map pin to Bandhatal Picnic Ground. Check the final approach and local conditions before travelling.",
    nearbyStaysFood: "Food and accommodation in Belauri Bazaar; confirm availability before travelling.",
    safetyNotes:
      "Don't swim or wade into unfamiliar parts of the lake — the depth and bottom vary. Leave waterbirds, fish and plants undisturbed, keep clear of any construction areas, and take your litter with you. Carry drinking water, visit in daylight, and check the roads in the monsoon.",

    photoCredit: "Lagani News, Khadka Jii (local guide), Binu Shahi (local guide)",
    sources: [
      { label: "Belauri Municipality — municipal introduction" },
      {
        url: "https://laganinews.com/en/2025/07/15/infrastructure-to-be-constructed-at-an-investment-of-rs-50-million-2/",
        label: "Lagani News / RSS — Infrastructure to be constructed at an investment of Rs 50 million (15 July 2025)",
      },
      { label: "Nepal Press — tourism infrastructure at Bandha Tal (15 July 2025)" },
      { label: "Dhangadhi Khabar — पर्यटकको पर्खाइमा कञ्चनपुरको बन्धा ताल" },
      { label: "Nepalese Ornithological Union — Asian Waterbird Census 2025" },
      { label: "Bird Conservation Nepal — wetland and waterbird conservation in Belauri" },
      { label: "GeoNames — Baṅdhā Tāl" },
    ],

    alternateNames: ["Bandhatal", "Bandha Lake"],
    culturalNote:
      "Bandha Tal is one of Belauri Municipality's recognised natural and tourism resources, named among the Government of Nepal's 100 new tourism destinations in 2075 BS. The municipality counts it as part of its tourism and conservation potential.",
    verify: ["elevationM", "entryFee", "openingHours"],
  },
];

export function getKanchanpurDestination(slug: string): Destination | undefined {
  return kanchanpurDestinations.find((d) => d.slug === slug);
}
