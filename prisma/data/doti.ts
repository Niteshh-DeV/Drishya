/**
 * Doti — destination content (5 entries), converted from Doti.docx, with
 * photo credits from Credits Doti.docx.
 *
 * The doc is careful to say what it could not confirm. Fields it marks as
 * unverified (most fees, hours and elevations) are left out and named in each
 * entry's `verify` list rather than guessed.
 */
import type { Destination } from "@/lib/types";

export const dotiDestinations: Destination[] = [
  {
    id: "doti-khaptad-national-park",
    // Suffixed: Bajhang already has `khaptad-national-park`.
    slug: "khaptad-national-park-doti",
    districtId: "doti",
    name: "Khaptad National Park (Doti-side Access)",
    nameNepali: "खप्तड राष्ट्रिय निकुञ्ज",
    category: ["Forest & Wildlife", "Meadow", "Mountain & Trek"],
    nearestTown:
      "Silgadhi Bazaar; the trail starts at the Jhingrana park post, about 18 km by road beyond Silgadhi",
    // The Jhingrana park office, where the Doti-side walk begins — not the
    // plateau or the park headquarters at Khaptad.
    position: [29.34247, 81.04808],

    interestTags: ["Nature", "Trekking", "Wildlife", "Adventure", "Religious", "Culture"],
    bestSeasons: ["Spring", "Autumn"],
    budget: "Medium",
    budgetNote: "Transport, park entry, food, accommodation and trekking supplies.",
    hiddenGem: true,
    hiddenGemReason: "Far less visited than Nepal's major trekking regions.",

    shortDescription:
      "Khaptad National Park is a protected highland of rolling meadows, forests, wetlands and spiritual sites. The Doti-side approach starts from Silgadhi and climbs on foot through Jhingrana and Bichpani to the Khaptad Plateau.",
    longDescription:
      "Khaptad National Park is one of the distinctive protected landscapes of Nepal's mid-hills. Established in 1984, it covers about 225 km² across Doti, Achham, Bajhang and Bajura, with a further 216 km² of buffer zone added in 2006. The park ranges from roughly 1,400 to 3,300 metres.\n\nIts best-known feature is the patans — about 22 open grasslands spread among the forested hills, coloured with wildflowers in the warmer months. Subtropical, temperate and subalpine forests hold a rich variety of medicinal plants, and the Nepal Tourism Board lists around 270 bird species and 224 species of medicinal herbs. Mammals include barking deer, wild boar, ghoral, Himalayan black bear, yellow-throated marten, and rhesus and langur monkeys.\n\nKhaptad is also a place of pilgrimage through Khaptad Baba (Sri Paramhansa Swami Sachchidananda Saraswati), whose ashram is one of the park's best-known sights. Other highlights are Khaptad Daha, Tribeni and Sahasralinga, which at about 3,200 metres is the park's highest point.\n\nFrom Doti, the walk in starts at the Jhingrana park post and passes Bichpani on the way up to the plateau, about six hours on foot through forest and mountain scenery. Jhingrana and Bichpani are park posts on the route; the park headquarters is at Khaptad itself.",
    bestFor:
      "Nature lovers, trekkers and hikers, birdwatchers and wildlife enthusiasts, photographers, and spiritual travellers.",

    howToGetThere:
      "Fly to Dhangadhi or travel by road to Sudurpashchim, then drive about 195 km from Dhangadhi to Silgadhi Bazaar. The road continues about 18 km to Jhingrana, where the 16 km trail to Khaptad begins — roughly six hours of walking, according to the Khaptad Tourism Development and Management Committee.",
    entryFee:
      "Nepal Tourism Board fee table: Nepali citizens NPR 100; SAARC nationals NPR 1,500; other foreign nationals NPR 3,000; children under 10 free. The park regulations list NPR 500 for SAARC nationals and NPR 1,500 for other foreigners, so confirm the current fee with the park office.",
    nearbyStaysFood:
      "Basic local lodging and food along parts of the trekking route; facilities inside the park are limited.",
    safetyNotes:
      "Carry enough water, food, warm clothing and a first-aid kit, and wear sturdy shoes for forest trails. Start the walk from Jhingrana early in the day. Check weather and trail conditions before setting out, especially in the monsoon and winter, and consider a local guide if you don't know the route. Follow park rules: don't disturb wildlife, remove plants or leave litter.",

    photoCredit: "Raaz Theeng (nepaliphotos.com), Laba Guragain (Google Maps)",
    sources: [
      {
        url: "https://dnpwc.gov.np/content/33/khaptad-national-park/",
        label: "Department of National Parks and Wildlife Conservation — Khaptad National Park",
      },
      {
        url: "https://giwmscdntwo.gov.np/media/pdf_upload/Khaptad%20NP%20Management%20Plan%20%282082-2086%29_vshs1ki.pdf",
        label: "Khaptad National Park Management Plan, 2082–2086 BS (PDF)",
      },
      { url: "https://katdmc.gov.np/", label: "Khaptad Tourism Development and Management Committee" },
      { url: "https://ntb.gov.np/khaptad-national-park-nepal", label: "Nepal Tourism Board — Khaptad National Park" },
      {
        url: "https://ntb.gov.np/en/plan-your-trip/before-you-come/park-entry-fees",
        label: "Nepal Tourism Board — Park entry fees",
      },
    ],

    alternateNames: ["Khaptad Rashtriya Nikunja"],
    culturalNote:
      "Khaptad is closely tied to Khaptad Baba, Sri Paramhansa Swami Sachchidananda Saraswati, whose ashram on the plateau draws spiritual visitors. Khaptad Daha, Tribeni and Sahasralinga are the park's other major religious and natural sites.",
    // The NTB fee table and the park regulations disagree for foreign visitors.
    verify: ["elevationM", "entryFee", "openingHours"],
  },

  {
    id: "doti-budar-waterfall",
    slug: "budar-waterfall",
    districtId: "doti",
    name: "Budar Waterfall",
    nameNepali: "छहरा झरना",
    category: ["Waterfall"],
    nearestTown: "Budar Bazaar, about 10 km to the west; Chhatiwan, Jorayal Rural Municipality",
    position: [29.10209, 80.59976],

    interestTags: ["Nature", "Relaxation"],
    bestSeasons: ["Spring", "Autumn", "Winter", "Monsoon"],
    bestTimeNote:
      "Spring and autumn are the most comfortable. The falls run strongest during and after the monsoon, but heavy rain makes the approach road, trails and rocks slippery.",
    budget: "Low",
    hiddenGem: true,
    hiddenGemReason: "A lesser-known waterfall that is only now drawing domestic visitors.",

    shortDescription:
      "Budar Waterfall, locally called Chhahara Jharana, drops more than 100 metres down a forested hillside in Jorayal Rural Municipality — reportedly the tallest waterfall in Doti. It sits close to Chhatiwan Lake and its picnic park.",
    longDescription:
      "Budar Waterfall, commonly known as Chhahara Jharana, is one of the notable natural attractions of Doti. It falls down a forested hillside in the Chhatiwan area of Jorayal Rural Municipality.\n\nThe Sudurpashchim Province Tourism Master Plan records the falls in Chhatiwan-2, Jorayal, gives their height as more than 100 metres, and describes them as the tallest waterfall in Doti District. The plan places them about 10 km east of Budar Bazaar and notes that the surrounding forests suit ecotourism and nature walks.\n\nThe waterfall is near Chhatiwan Lake and an adjacent picnic park, so the three are easily combined for a day of short walks, photographs and time outdoors. Local news reports describe growing numbers of domestic visitors and local efforts to improve the road and facilities.",
    bestFor: "Nature lovers, families, photographers and day visitors.",

    howToGetThere:
      "Travel by road to Budar Bazaar on the Dhangadhi–Dadeldhura highway corridor, then continue about 10 km east towards Chhatiwan. A rural road has been built towards the waterfall, but its condition varies, so check locally.",
    nearbyStaysFood:
      "Look for food and accommodation in Budar Bazaar and nearby settlements; local reports mention hotels in the Budar area.",
    safetyNotes:
      "Wear shoes with good grip and take care on wet or uneven ground. Don't climb slippery rocks or stand directly under the falling water. During and after heavy rain, check the weather and road conditions before setting out. Leave no litter at the falls or the nearby lake.",

    photoCredit: "DP Bhatta (Facebook), Himalaya Bhatt (Facebook)",
    sources: [
      {
        url: "https://giwmscdntwo.gov.np/media/pdf_upload/SP%20Tourism%20Master%20Plan%20Report%20-final%20revised-web%20version%202023_5lvnqot.pdf",
        label: "Sudurpashchim Province Tourism Master Plan (PDF)",
      },
      {
        url: "https://bihanionline.com/archives/24012",
        label: "Bihani Online — पर्यटक आकर्षणको केन्द्र बन्दै डोटीको ‘छहरा झर्ना’",
      },
      {
        url: "https://www.ratopati.com/story/254710/doti",
        label: "Ratopati — डोटीको छहरा झरनामा पर्यटकको आकर्षण बढ्दै",
      },
      {
        url: "https://moitfe.sudurpashchim.gov.np/content/12/sudurpaschim-province-tourism-masterplan/",
        label: "Ministry of Industry, Tourism, Forest and Environment, Sudurpashchim Province",
      },
    ],

    alternateNames: ["Chhahara Jharana", "Chahara Waterfall", "Chhahara Falls"],
    culturalNote:
      "Budar Waterfall is a developing local tourism destination. The provincial tourism plan names the Chattiwan Tourism Promotion and Conservation Development Committee as the body working on tourism and conservation around it; no further history has been verified.",
    verify: ["elevationM", "entryFee", "openingHours", "budget"],
  },

  {
    id: "doti-chhatiwan-lake",
    slug: "chhatiwan-lake",
    districtId: "doti",
    name: "Chhatiwan Lake",
    nameNepali: "छतिवन ताल",
    category: ["Lake & Wetland"],
    nearestTown: "Budar Bazaar, about 3 km away; Jorayal Rural Municipality-2 (Chhatiwan)",
    // From the government wetland inventory; the Google Maps visitor pin
    // (29.079529, 80.587177) is about 90 m away.
    position: [29.07892, 80.58646],
    elevationM: 1188,

    interestTags: ["Nature", "Wildlife", "Relaxation", "Culture"],
    bestSeasons: ["Spring", "Autumn"],
    bestTimeNote:
      "March–May and September–November. In the monsoon, check rainfall, road conditions and access before travelling.",
    budget: "Low",
    hiddenGem: true,
    hiddenGemReason: "A lesser-known natural lake in Doti.",

    shortDescription:
      "Chhatiwan Lake is a small natural freshwater lake in the Chure hills of Jorayal Rural Municipality, ringed by pine-covered slopes and terraced farmland — a quiet place for nature, birds and photography, and an important water source for the villages around it.",
    longDescription:
      "Chhatiwan Lake (Chhatiwan Tal) is a permanent natural freshwater wetland in the Chhatiwan area of Jorayal Rural Municipality-2. It lies at about 1,188 metres in the Chure hill landscape of western Nepal.\n\nThe Department of Forests' wetland inventory records a core area of about 1.9 hectares within a basin of about 66.7 hectares, set among farmland and forest. Aquatic plants include Jaluka (Colocasia species) and Bojo (Acorus calamus); the inventory also lists Halhale (Rumex nipalensis) and a fish, Pagarmachha (Garra gotyla).\n\nThe lake supplies the surrounding communities with water for irrigation, drinking and livestock. An April 2026 article by the International Water Management Institute (IWMI) describes its egrets and other birdlife, the pine-covered hills and terraced fields around it, and how closely the lake, the forests and local farming depend on one another.\n\nThe lake is under pressure. The 2016 inventory flagged its shrinking water volume, and IWMI's article describes sediment washing in from the slopes, changing forest cover and declining springs.",
    bestFor:
      "Quiet nature walks, landscape photography, birdwatching, and learning about local wetlands and water resources.",

    howToGetThere:
      "Travel to Budar Bazaar in Doti and continue towards Chhatiwan using local directions. The 2016 wetland inventory recorded a motorable road ending about 3 km from the lake via Budar; confirm the current road and final approach locally.",
    nearbyStaysFood:
      "The 2016 inventory recorded hotels and resorts in the Budar area. Arrange meals and accommodation in advance rather than expecting facilities beside the lake.",
    safetyNotes:
      "Check road and weather conditions before travelling, and take care at the water's edge, especially during and after rain. Don't litter, disturb birds or damage aquatic plants, and respect religious practices at Siddha Temple.",

    photoCredit:
      "RSS (The Himalayan Times), Flying Bishnu Photography, Janak Bhatta (Google Maps), MR. JoRa (Google Maps)",
    sources: [
      {
        url: "https://www.codefundnepal.org.np/wp-content/uploads/2022/12/1593881767Setting_Dof_23_final_-July_book1.pdf",
        label: "Department of Forests (2017) — Wetlands of Western Nepal: A Brief Profile of Selected Lakes (PDF)",
      },
      {
        url: "https://www.iwmi.org/news/lessons-from-the-shoreline/",
        label: "International Water Management Institute — Lessons from the Shoreline (8 April 2026)",
      },
      { url: "https://jorayalmun.gov.np/node/57", label: "Jorayal Rural Municipality — Ward No. 2 (Chhatiwan)" },
      {
        url: "https://jorayalmun.gov.np/sites/jorayalmun.gov.np/files/FINAL%20DRAFT%20OF%20JORAYAL%20EDUCATION%20PLAN%202078-2087BS.pdf",
        label: "Jorayal Rural Municipality — Education plan with ward map (PDF)",
      },
    ],

    alternateNames: ["Chhatiwan Tal"],
    culturalNote:
      "The 2016 government wetland inventory identifies Chhatiwan Lake as a religious site and records Siddha Temple in its basin. Local people use the lake for rituals and religious practices, and IWMI's 2026 article describes its place in community life.",
    verify: ["entryFee", "openingHours", "budget"],
  },

  {
    id: "doti-shaileshwari-temple",
    slug: "shaileshwari-temple",
    districtId: "doti",
    name: "Shaileshwari Temple",
    nameNepali: "शैलेश्वरी मन्दिर",
    category: ["Temple", "Religious Site", "Cultural Heritage"],
    nearestTown: "Silgadhi Bazaar, Dipayal Silgadhi Municipality-6",
    position: [29.26661, 80.98088],

    interestTags: ["Religious", "Culture"],
    bestSeasons: ["Autumn", "Spring"],
    bestTimeNote:
      "Open to visitors all year. Dashain, especially Navaratri, brings special pujas, and the annual Shaileshwari Jatra falls on Kartik Shukla Purnima.",
    budget: "Low",
    budgetNote: "No confirmed entry fee; travel, food and accommodation are separate.",
    hiddenGem: false,
    hiddenGemReason: "A recognised religious destination of the far west.",

    shortDescription:
      "Shaileshwari Temple in Silgadhi is one of Doti's most important pilgrimage sites, dedicated to Goddess Shaileshwari. Its complex holds shrines to several deities, and it is busiest during Dashain and the annual Shaileshwari Jatra.",
    longDescription:
      "Shaileshwari Temple stands in Silgadhi, the district headquarters of Doti, and is one of the best-known religious sites of Sudurpashchim. Dedicated to Goddess Shaileshwari, it holds an important place in the region's religious traditions; the Nepal Tourism Board notes its association with the Skanda Purana and counts it among the prominent shrines of Nepal's mid- and far-western hills.\n\nThe temple complex includes a Shiva lingam and shrines to Chaturbhuj Narayan, Ganesh, Bhairab and Masta. Special pujas are held during Dashain, particularly during Navaratri.\n\nThe main annual gathering, the Shaileshwari Jatra, is associated with Kartik Shukla Purnima, when devotees gather for worship and celebration to traditional music and cultural performances. Local accounts also describe a ritual held every twelve years; its timing should be confirmed with the temple.",
    bestFor:
      "Hindu pilgrims, cultural travellers, festival-goers, and anyone exploring the heritage of Doti.",

    howToGetThere:
      "From Dhangadhi, travel via Attariya and Dadeldhura to Silgadhi along the road the Nepal Tourism Board calls Bhimdatta Marga. Check local transport and road conditions before travelling.",
    nearbyStaysFood:
      "Silgadhi Bazaar is the nearest place for accommodation and food; confirm availability before travelling.",
    safetyNotes:
      "Check road and weather conditions before travelling, especially in the monsoon. Dress modestly, follow the instructions of priests and temple staff, and ask before photographing worshippers or rituals.",

    photoCredit: "rajunepal.com, Troll सुदुर पश्चिम (Facebook), Raaz Theeng (nepaliphotos.com)",
    sources: [
      { url: "https://ntb.gov.np/en/shaileshwari--doti-", label: "Nepal Tourism Board — Shaileshwari, Doti" },
      { url: "https://dipayalsilgadhimun.gov.np/", label: "Dipayal Silgadhi Municipality" },
      {
        url: "https://daodoti.moha.gov.np/en/post/introduction-of-doti-district",
        label: "District Administration Office, Doti — Introduction of Doti District",
      },
      {
        url: "https://giwmscdntwo.gov.np/media/pdf_upload/SP%20Tourism%20Master%20Plan%20Report%20-final%20revised-web%20version%202023_5lvnqot.pdf",
        label: "Sudurpashchim Province Tourism Master Plan (PDF)",
      },
    ],

    alternateNames: ["Shaileshwari Mandir", "Shaileshwari Bhagawati Temple"],
    culturalNote:
      "The Nepal Tourism Board records the temple's association with the Skanda Purana. Dashain is the main period of special worship, and the Shaileshwari Jatra on Kartik Shukla Purnima is the temple's biggest annual festival, listed by the Doti District Administration Office among the district's important festivals. The twelve-yearly ritual described in local accounts is a local tradition whose schedule has not been confirmed.",
    verify: ["elevationM", "entryFee", "openingHours"],
  },

  {
    id: "doti-badikedar-temple",
    slug: "badikedar-temple",
    districtId: "doti",
    name: "Badikedar Temple",
    nameNepali: "बडीकेदार धाम",
    category: ["Temple", "Religious Site"],
    nearestTown: "B.P. Nagar, on the Sahajpur–Bogtan–Dipayal road; Badikedar Rural Municipality-5",
    // The doc says the temple's exact coordinates are not reliably verified.
    position: [29.07536, 80.9242],

    interestTags: ["Religious", "Culture", "Nature"],
    bestSeasons: ["Spring", "Autumn"],
    bestTimeNote:
      "March–May and September–November. Check the weather and the trail before setting out.",
    budget: "Low-Medium",
    budgetNote: "No verified entry fee; transport, food and accommodation are separate.",
    hiddenGem: true,
    hiddenGemReason: "A lesser-known pilgrimage destination in Sudurpashchim.",

    shortDescription:
      "Badikedar Dham is a Shiva temple high in the hills of southern Doti, about two hours' walk from the nearest road. Reported to sit at around 2,500 metres, it is valued for its religious importance and peaceful mountain setting.",
    longDescription:
      "Badikedar Dham is one of the notable religious destinations of southern Doti. Dedicated to Lord Shiva, it draws Hindu devotees from Doti, neighbouring districts and beyond, and Badikedar Rural Municipality takes its name from the temple.\n\nThe temple stands in Ward 5 of Badikedar Rural Municipality, near the boundary with Bogtan Phudsil Rural Municipality, at a reported elevation of about 2,500 metres. Hills and rural settlements surround it, so a visit combines worship with the landscape of southern Doti.\n\nLocal belief holds that worship at Badikedar Dham brings blessings and fulfils devotees' wishes. The walk up passes villages and hill scenery, and local and provincial authorities have recognised the site's tourism potential, including plans to improve the pilgrimage trail and visitor facilities.",
    bestFor: "Hindu pilgrims, cultural travellers, hikers and nature lovers.",

    howToGetThere:
      "Travel towards southern Doti on the Sahajpur–B.P. Nagar–Bogtan–Dipayal road. From the road, the temple is about a two-hour walk through hilly terrain, according to an RSS report on Onlinekhabar; the actual time depends on where you start and the state of the trail. Confirm the route locally.",
    nearbyStaysFood:
      "There is no food near the temple, so carry water and snacks. Food and overnight accommodation are available in B.P. Nagar.",
    safetyNotes:
      "Wear comfortable walking shoes and carry water, snacks and essentials. Be ready for changing mountain weather, take extra care on slippery monsoon trails, and avoid walking after dark unless you're with someone who knows the route. Respect local religious customs and the surroundings.",

    photoCredit: "Purvi Blues (YouTube), Sagar Mateli-Duluwa (TikTok), Dinesh Khabar, Photo Khich Deu (TikTok)",
    sources: [
      {
        url: "https://badikedarmun.gov.np/content/%E0%A4%AC%E0%A4%A1%E0%A5%80%E0%A4%95%E0%A5%87%E0%A4%A6%E0%A4%BE%E0%A4%B0-%E0%A4%97%E0%A4%BE%E0%A4%89%E0%A4%81%E0%A4%AA%E0%A4%BE%E0%A4%B2%E0%A4%BF%E0%A4%95%E0%A4%BE%E0%A4%95%E0%A5%8B-%E0%A4%B8%E0%A4%82%E0%A4%95%E0%A5%8D%E0%A4%B7%E0%A4%BF%E0%A4%AA%E0%A5%8D%E0%A4%A4-%E0%A4%AA%E0%A4%B0%E0%A4%BF%E0%A4%9A%E0%A4%AF",
        label: "Badikedar Rural Municipality — Introduction",
      },
      {
        url: "https://www.badikedarmun.gov.np/content/%E0%A4%B5%E0%A4%A1%E0%A4%BE-%E0%A4%A8%E0%A4%82%E0%A5%AB",
        label: "Badikedar Rural Municipality — Ward No. 5",
      },
      {
        url: "https://www.onlinekhabar.com/2024/01/1422700/dotis-badikedardham-awaits-tourists",
        label: "Onlinekhabar / RSS — Doti's Badikedar Dham awaits tourists",
      },
      { url: "https://risingnepaldaily.com/news/12756", label: "The Rising Nepal / RSS — Badikedar trail development" },
      {
        url: "https://ekantipur.com/pradesh-7/2023/02/02/167530511448473582.html",
        label: "Kantipur — Religious destination: Badikedar",
      },
    ],

    alternateNames: ["Badikedar Dham", "Badi Kedar Dham"],
    culturalNote:
      "Badikedar Dham is dedicated to Lord Shiva and is an important religious site of southern Doti; Badikedar Rural Municipality is named after it. Local belief associates worship here with blessings and the fulfilment of wishes, and local and provincial authorities have identified the site for tourism development, including trail improvements.",
    verify: ["position", "elevationM", "entryFee", "openingHours"],
  },
];

export function getDotiDestination(slug: string): Destination | undefined {
  return dotiDestinations.find((d) => d.slug === slug);
}
