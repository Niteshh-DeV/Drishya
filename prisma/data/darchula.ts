/**
 * Darchula — destination content (4 entries), converted from
 * Darchula full final.docx, with photo credits from Credits Darchula.docx.
 *
 * Elevations the doc qualifies (a locality figure for Malikarjun, a map point
 * for Tinkar, conflicting figures for Chhangru) are given in the prose with
 * their source and named in `verify` rather than stored as `elevationM`.
 */
import type { Destination } from "@/lib/types";

export const darchulaDestinations: Destination[] = [
  {
    id: "darchula-malikarjun-temple",
    slug: "malikarjun-temple",
    districtId: "darchula",
    name: "Malikarjun Temple",
    nameNepali: "मालिकार्जुन मन्दिर",
    category: ["Temple", "Religious Site", "Cultural Heritage"],
    nearestTown:
      "Gokuleshwar, the nearest market town; Khalanga, the district headquarters. Premnagar–Mad area, Malikarjun Rural Municipality-3",
    // Google Maps pin supplied by the doc.
    position: [29.73476, 80.48578],

    interestTags: ["Religious", "Culture"],
    bestSeasons: ["Autumn", "Winter"],
    bestTimeNote:
      "October–November, for the night-time Jatra on Kartik Shukla Chaturdashi. Shailya Shikhar's Pujan Jatra on Asar Shukla Chaturdashi usually falls in June–July. Festival dates follow the lunar calendar and change every year.",
    budget: "Low-Medium",
    budgetNote:
      "No verified entry fee; ask the temple management committee about donations. Transport, food and accommodation are separate.",
    hiddenGem: true,

    shortDescription:
      "Malikarjun Temple, popularly known as Malikarjun Dham, is a Shiva pilgrimage site in southern Darchula that devotees count among Nepal's seven Dhams. Its night-time Jatra on Kartik Shukla Chaturdashi draws pilgrims from across Sudurpashchim and neighbouring Uttarakhand.",
    longDescription:
      "Malikarjun Temple stands in the Premnagar–Mad area of Malikarjun Rural Municipality-3, Darchula, and is an important centre of devotion and cultural heritage in Sudurpashchim Province. Its principal deity is Lord Shiva, worshipped in the form of Malikarjun. Popularly known as Malikarjun Dham, the temple is recognised by devotees as one of Nepal's seven Dhams, and it draws pilgrims from Darchula, the rest of Sudurpashchim and neighbouring Uttarakhand in India. A published geographical study puts the Malikarjun community centre and temple area at about 1,800 metres.\n\nThe temple's biggest annual celebration is the night-time Jatra on Kartik Shukla Chaturdashi, with worship, processions and traditional Damaha music. It is closely tied to the Shikhar Pujan Jatra on Kartik Shukla Trayodashi at Shailya Shikhar, a separate high-altitude pilgrimage site nearby, which holds a second Pujan Jatra on Asar Shukla Chaturdashi.\n\nLocal religious tradition holds that the Malikarjun deity came from Sri Shailam in southern India, travelling through the Katyur and Kumaon regions before reaching Darchula. The account is part of the area's devotional heritage, a traditional narrative rather than established history.",
    bestFor:
      "Hindu pilgrims, devotees of Lord Shiva, cultural travellers, festival visitors, heritage enthusiasts, and anyone interested in the religious traditions of far-western Nepal.",

    howToGetThere:
      "From Khalanga, the district headquarters, travel by road towards Gokuleshwar; the Malikarjun settlement lies along the road between the two, and a local road leads from Gokuleshwar to the temple. Road conditions and journey times vary, so check transport and the state of the road before travelling.",
    nearbyStaysFood:
      "Food and accommodation around Malikarjun are limited; a 2025 study describes a small market, a hotel and a few shops at the Malikarjun community centre. Gokuleshwar is the larger service centre. Confirm what is available before travelling.",
    safetyNotes:
      "Hill roads here need care, especially in the monsoon and after dark. Expect crowds and heavier traffic during the major Jatras. Follow temple rules, dress respectfully and keep the temple grounds clean.",

    photoCredit: "Jiwan Singh Dhami, Madhu Khanal, Prem Singh Dhami (Google Maps)",
    sources: [
      {
        url: "https://daodarchula.moha.gov.np/en/post/malikarjun-temple",
        label: "District Administration Office, Darchula — Malikarjun Temple",
      },
      { url: "https://www.malikarjunmun.gov.np/", label: "Malikarjun Rural Municipality" },
      { label: "District Coordination Committee, Darchula — local government contacts" },
      {
        url: "https://giwmscdnone.gov.np/media/pdf_upload/SP%20Tourism%20Master%20Plan%20Report%20-final%20revised-web%20version%202023_5lvnqot.pdf",
        label: "Sudurpashchim Province Tourism Master Plan (PDF)",
      },
      {
        url: "https://nepaltraveller.com/news/shailyashikhar-dham-mallikarjuna-pilgrimage",
        label: "Nepal Traveller — Shailyashikhar Dham Mallikarjuna pilgrimage",
      },
      { url: "https://www.news24nepal.com/detail/11248", label: "News 24 Nepal — Darchula's major Malikarjun Jatra" },
      {
        url: "https://www.frontiersin.org/journals/sustainable-food-systems/articles/10.3389/fsufs.2021.646719/full",
        label:
          "Frontiers in Sustainable Food Systems (ICIMOD) — An Offering of Grain: The Agricultural and Spiritual Cycle of a Food System in Darchula",
      },
    ],

    alternateNames: ["Malikarjun Dham", "Shree Malikarjun Dham", "Shree Malikarjun Temple", "मालिकार्जुन धाम"],
    culturalNote:
      "Malikarjun is worshipped as a form of Lord Shiva. Local devotional tradition traces the deity to Sri Shailam in southern India, by way of the Katyur and Kumaon regions. The temple's main festival is the night-time Jatra on Kartik Shukla Chaturdashi, in which traditional Damaha music plays an important part; the associated Shailya Shikhar site holds Pujan Jatras on Asar Shukla Chaturdashi and Kartik Shukla Trayodashi.",
    verify: ["elevationM", "entryFee", "openingHours"],
  },

  {
    id: "darchula-tinkar-village",
    slug: "tinkar-village",
    districtId: "darchula",
    name: "Tinkar Village",
    nameNepali: "टिंकर गाउँ",
    category: ["Town & Village", "Cultural Heritage", "Mountain & Trek"],
    nearestTown: "Chhangru, about 10 km to the west; Byas Rural Municipality-1",
    // OpenStreetMap village reference point.
    position: [30.13545, 80.98485],

    interestTags: ["Culture", "Adventure", "Trekking", "Nature", "History"],
    bestSeasons: ["Spring", "Summer", "Monsoon", "Autumn"],
    bestTimeNote:
      "April–October, when families are back from their winter homes to farm. Winter brings heavy snow and extreme cold, and most residents move to lower settlements.",
    budget: "High",
    budgetNote:
      "Remote access, several days of travel, limited visitor facilities, and possibly a local guide or other support.",
    hiddenGem: true,

    shortDescription:
      "Tinkar is a remote Himalayan village in the upper Byas Valley, close to Nepal's borders with India and China. Home to the Sauka (Byansi) community, it is known for its seasonal migration, its old trade links with Taklakot in Tibet and its dramatic mountain setting.",
    longDescription:
      "Tinkar is one of the remote settlements of the upper Byas Valley, in Byas Rural Municipality-1 in the far north-west of Nepal, near the borders with India and China. Map data puts the village at about 3,730 metres. It is traditionally home to the Sauka community, also known as the Byansi or Byansi Shauka, whose way of life is built around high-altitude farming, livestock and seasonal movement between the mountains and lower ground.\n\nOne of Tinkar's distinctive traditions is kuncha sarne, the seasonal migration families make to escape the winter. Residents spend the farming season in Tinkar and move down to Khalanga and other lower settlements for the winter, returning in spring, usually around April, to ready their homes and fields. The Kathmandu Post, reporting on the tradition in November 2026, counted about 75 households in the village.\n\nTinkar also has historic ties with Taklakot in Tibet. Seasonal trade and movement across the Himalayan border region have long been part of the community's relationship with the wider landscape.\n\nIts remote setting, traditional settlement pattern and cultural practices make Tinkar an important place for understanding the people and heritage of upper Darchula. The terrain is difficult and transport limited, though, so reaching it is a serious undertaking.",
    bestFor:
      "Cultural explorers, responsible travellers, researchers, photographers, experienced trekkers, and anyone interested in traditional Himalayan communities and remote mountain landscapes.",

    howToGetThere:
      "Travel to Darchula and continue into the upper Byas Valley by mountain road and foot trail. The Darchula–Tinkar road is still being built: in May 2026 vehicles reached Dumling after a 12 km section from Tusarpani was completed, and the Nepali Army reported 22.15 km of track opened along the 79 km Tusarpani–Tinkar road. The road does not reach Tinkar, and the approach beyond it can mean a long walk, so get current route information locally and confirm any local permissions and border-area requirements before you go.",
    nearbyStaysFood:
      "Regular tourist accommodation and restaurants in Tinkar have not been confirmed. Arrange food, accommodation and local support in advance rather than counting on tourist services.",
    safetyNotes:
      "Tinkar is a remote border-area settlement. Landslides, damaged trails, river crossings, snowfall, extreme cold and limited communication can make travel hazardous. Some traditional routes between the villages and lower settlements pass through Indian territory; don't assume they are open to tourists, Nepali or foreign, without the required permissions. Travel with an experienced local guide and check current access with the local authorities before setting out.",

    photoCredit: "Pushparaj Aitwal (aitwal.com)",
    sources: [
      {
        url: "https://kathmandupost.com/sudurpaschim-province/2026/11/09/the-two-nepali-border-villages-that-empty-for-six-months-every-year",
        label: "The Kathmandu Post — The two Nepali border villages that empty for six months every year (9 November 2026)",
      },
      {
        url: "https://kathmandupost.com/national/2026/05/10/vehicles-reach-dumling-on-darchula-tinkar-road-section-of-mahakali-corridor",
        label: "The Kathmandu Post — Vehicles reach Dumling on Darchula–Tinkar road (10 May 2026)",
      },
      {
        url: "https://risingnepaldaily.com/news/43056",
        label: "The Rising Nepal — A hill community returns to village after winter migration",
      },
      {
        url: "https://risingnepaldaily.com/news/64639",
        label: "The Rising Nepal — Chhangru foot trail construction making speedy headway",
      },
      { url: "https://mapcarta.com/14910988", label: "Mapcarta — Tinkar" },
    ],

    alternateNames: ["Tinker", "Tinakar"],
    culturalNote:
      "Tinkar is traditionally home to the Sauka community, also called the Byansi or Byansi Shauka. Their seasonal migration between the high village and lower settlements is known locally as kuncha sarne, and farming and livestock rearing are their traditional livelihoods. The village has historic seasonal trading links across the Himalayan border region, including with Taklakot in Tibet.",
    verify: ["elevationM", "entryFee"],
  },

  {
    id: "darchula-chhangru-village",
    slug: "chhangru-village",
    districtId: "darchula",
    name: "Chhangru Village",
    nameNepali: "छाङ्गरु गाउँ",
    category: ["Town & Village", "Cultural Heritage", "Mountain & Trek"],
    nearestTown: "Tinkar, about 12 km away; Byas Rural Municipality-1",
    // OpenStreetMap village reference point.
    position: [30.12954, 80.88335],

    interestTags: ["Culture", "Adventure", "Nature", "History", "Trekking"],
    bestSeasons: ["Spring", "Summer", "Monsoon", "Autumn"],
    bestTimeNote:
      "April–October. Families usually return around April or May, and the village empties in winter, when heavy snow and extreme cold set in.",
    budget: "High",
    budgetNote:
      "Remote access, several days of travel, limited visitor facilities, and possibly a local guide or other support.",
    hiddenGem: true,

    shortDescription:
      "Chhangru is a remote Himalayan village in the upper Byas Valley, near the Nepal–India border. Home to the Sauka (Byansi) community, it is known for its seasonal migration, its high-altitude landscape and a way of life shaped by the mountains.",
    longDescription:
      "Chhangru is one of the traditional settlements of the upper Byas Valley, in Byas Rural Municipality-1 in the far north-west of Nepal, near the border with India. Recent reporting puts it at about 3,200 metres, though map databases give slightly different figures. It is home to the Sauka community, also known as the Byansi or Shauka people, whose culture and livelihoods are closely tied to the Himalayan environment.\n\nLike neighbouring Tinkar, Chhangru follows kuncha sarne, the seasonal migration between the high villages and lower settlements. Families live in the village through the warmer months, farming and keeping livestock, then move down to Khalanga and other lower places as winter brings heavy snow and extreme cold. They generally return in April or May, when conditions allow farming again. The Kathmandu Post, reporting on the tradition in November 2026, counted about 124 households in Chhangru.\n\nFarming and livestock remain central to village life. Residents grow crops suited to the short Himalayan growing season, and their animals travel with them on the seasonal migration.\n\nChhangru's remote location, traditional settlement pattern and cultural identity make it an important place for understanding the heritage of the Byas region, alongside Tinkar and the mountains around them. Difficult terrain, limited infrastructure and the seasonal migration make independent travel challenging.",
    bestFor:
      "Cultural explorers, responsible travellers, researchers, photographers, experienced trekkers, and anyone interested in traditional Himalayan communities and remote mountain landscapes.",

    howToGetThere:
      "Chhangru is reached through the remote upper Byas region; travellers generally start from Khalanga and continue on mountain trails. Residents often use the traditional route through Indian territory, because the Nepali foot trails are difficult and poorly maintained; in May 2026, villagers returning from Khalanga reportedly took about five days on foot that way. In September 2026, landslides damaged several sections of the Chhangru–Tinkar trail and disrupted communication. Confirm the current route, border permissions and local arrangements before travelling.",
    nearbyStaysFood:
      "Regular tourist hotels, restaurants and visitor accommodation in Chhangru have not been confirmed. Arrange food, accommodation and local support in advance.",
    safetyNotes:
      "Chhangru is a remote border-area settlement. Landslides, damaged foot trails, river crossings, snowfall, extreme cold and limited communication can make travel hazardous. Routes through Indian territory may need prior permission from the Indian authorities, so don't assume border routes are open to tourists. Travel with an experienced local guide and check current conditions with the local administration before setting out.",

    photoCredit: "Pushparaj Aitwal (aitwal.com), @chhangruchi and an unnamed photographer (Facebook)",
    sources: [
      {
        url: "https://kathmandupost.com/sudurpaschim-province/2026/11/09/the-two-nepali-border-villages-that-empty-for-six-months-every-year",
        label: "The Kathmandu Post — The two Nepali border villages that empty for six months every year (9 November 2026)",
      },
      {
        url: "https://risingnepaldaily.com/news/43056",
        label: "The Rising Nepal — A hill community returns to village after winter migration",
      },
      {
        url: "https://risingnepaldaily.com/news/67759",
        label: "The Rising Nepal — Neither is there road, nor communication (3 September 2026)",
      },
      {
        url: "https://ancadarchula.gov.np/media/download_attachment/Rangeland_mangaement_plan.pdf",
        label: "Api Nampa Conservation Area — Rangeland management plan (PDF)",
      },
      { url: "https://mapcarta.com/N10582393187", label: "OpenStreetMap / Mapcarta — Chhangru" },
      {
        url: "https://giwmscdntwo.gov.np/media/pdf_upload/NFDIN%20Encyclopedia%20of%20Indigenous%20Nationalities%20of%20Nepal%20-%20Vol%201%20%28English%29_ixzxr6z.pdf",
        label: "National Foundation for Development of Indigenous Nationalities — Encyclopedia of Indigenous Nationalities of Nepal (PDF)",
      },
    ],

    alternateNames: ["Chhangaru", "Chhyangaru", "Changru"],
    culturalNote:
      "Chhangru is traditionally home to the Sauka community, also known as the Byansi or Shauka people. They practise kuncha sarne, moving between high-altitude settlements and lower areas with the seasons, and farming and livestock rearing are their traditional livelihoods. The village belongs to the historic Byas cultural region, which has long-standing connections with neighbouring Himalayan communities.",
    verify: ["elevationM", "entryFee"],
  },

  {
    id: "darchula-api-himal",
    slug: "api-himal",
    districtId: "darchula",
    name: "Api Himal",
    nameNepali: "अपि हिमाल",
    category: ["Mountain & Trek"],
    nearestTown: "Gokuleshwar and Khalanga, the main access points; the approach depends on the route",
    // The summit, from a Google Maps pin the doc calls a map reference rather
    // than a surveyed point.
    position: [30.00501, 80.92833],
    elevationM: 7132,

    interestTags: ["Adventure", "Trekking", "Nature"],
    bestSeasons: ["Spring", "Autumn"],
    bestTimeNote:
      "April–May and September–October for expeditions. Climbing windows depend on snowfall, wind, glacier conditions and forecasts, so plan a summit attempt with an experienced expedition operator.",
    budget: "High",
    budgetNote:
      "Very high for a summit expedition, which needs specialised equipment, permits, experienced climbing support, transport and extended logistics.",
    hiddenGem: true,
    hiddenGemReason: "A remote 7,000-metre peak, far less visited than Nepal's popular climbing destinations.",

    shortDescription:
      "Api Himal, or Mount Api, is a 7,132-metre peak in Darchula and the highest in the Yoka Pahar section of the Gurans Himal. It is known for its remote setting, challenging climbing routes and high-altitude scenery, and lies in the wider Api Nampa Conservation Area.",
    longDescription:
      "Api Himal is one of the most prominent mountains of Nepal's far-western Himalaya. At about 7,132 metres it is the highest peak in the Yoka Pahar section of the Gurans Himal, and its glaciated slopes, steep ridges and rugged terrain make it a serious objective for experienced mountaineers.\n\nThe first ascent was made on 10 May 1960 by Katsutoshi Hirabayashi and Gyaltsen Norbu Sherpa of the Japanese Doshisha University Himalayan Expedition, a milestone in the mountaineering history of the far west.\n\nGlaciers, high valleys, alpine terrain and neighbouring peaks surround the mountain. The wider region is part of the Api Nampa Conservation Area, which protects important Himalayan ecosystems and wildlife habitat.\n\nApi is a technical mountaineering objective, not a trekking peak. Reaching the base-camp area is an adventure of its own and quite separate from climbing the summit, which involves glacier travel, snow and ice climbing, technical equipment, careful acclimatisation and experienced support.",
    bestFor:
      "Experienced mountaineers, high-altitude expedition teams, technical climbers, wilderness explorers and adventure photographers.",

    howToGetThere:
      "Reach Darchula by road from Dhangadhi, Dadeldhura or another major town in Sudurpashchim; Gokuleshwar and Khalanga are the main access points. The Department of Tourism's mountaineering records list two approaches: Darchula–Syaku–Gati Bagad–Base Camp from the Darchula side, and Baitadi–Gokuleshwar–Ghunsa–Base Camp. The Sudurpashchim Province Tourism Master Plan also describes a southern trek from Makarigadh to Api Base Camp, about three nights and half a day on foot. These routes lead to the base-camp area, not the summit; confirm road access, trail conditions and local arrangements before setting out.",
    entryFee:
      "Api Nampa Conservation Area entry, per the Nepal Tourism Board: Nepali citizens NPR 100; SAARC nationals NPR 500; other foreign nationals NPR 2,000; children under 10 free. A summit expedition also needs a separate mountaineering permit, and some approaches need trekking permits, so confirm with the Department of Tourism and local authorities.",
    nearbyStaysFood:
      "Basic food and accommodation may be available in road-accessible settlements such as Gokuleshwar and Khalanga, but facilities thin out along the remote trails. Don't expect accommodation near the mountain: an expedition brings its own food, tents, cooking equipment, porters and high-altitude support.",
    safetyNotes:
      "Api is a technical 7,000-metre peak and not suited to inexperienced trekkers. Climb with a qualified expedition operator and an experienced high-altitude team, holding all the required mountaineering and conservation-area permits. Prepare for extreme cold, strong winds, snowfall, avalanches, crevasses and rapidly changing weather; allow time to acclimatise and watch for symptoms of altitude sickness. Carry technical climbing gear, communication devices and emergency supplies, confirm routes and weather before departure, follow conservation-area rules and leave no waste on the mountain.",

    photoCredit: "Bibekkunwar7 (CC BY-SA 4.0, Wikimedia Commons), Benmerdmann (CC BY-SA 3.0, Wikimedia Commons)",
    sources: [
      {
        url: "https://giwmscdnone.gov.np/media/pdf_upload/Facts%202025%20Final_jktttlf.pdf",
        label: "Department of Tourism — Mountaineering Facts and Figures 2025 (PDF)",
      },
      {
        url: "https://giwmscdnone.gov.np/media/pdf_upload/SP%20Tourism%20Master%20Plan%20Report%20-final%20revised-web%20version%202023_5lvnqot.pdf",
        label: "Sudurpashchim Province Tourism Master Plan (PDF)",
      },
      {
        url: "https://dnpwc.gov.np/media/publication/API_Nampa_2019.pdf",
        label: "Department of National Parks and Wildlife Conservation — Api Nampa Conservation Area (PDF)",
      },
      {
        url: "https://ntb.gov.np/en/plan-your-trip/before-you-come/park-entry-fees",
        label: "Nepal Tourism Board — Park entry fees",
      },
      {
        url: "https://himalayan-database.climbing-history.org/reports/first-ascents",
        label: "Himalayan Database — First ascents",
      },
    ],

    alternateNames: ["Mount Api", "Api Peak"],
    culturalNote:
      "Api is a major landmark of the far-western Himalaya, and its first ascent on 10 May 1960, by Katsutoshi Hirabayashi and Gyaltsen Norbu Sherpa of the Japanese Doshisha University Himalayan Expedition, is a significant event in Nepal's mountaineering history. The region around it is home to remote mountain communities with their own traditions and livelihoods, and the Api Nampa Conservation Area protects its biodiversity and natural heritage.",
  },
];

export function getDarchulaDestination(slug: string): Destination | undefined {
  return darchulaDestinations.find((d) => d.slug === slug);
}
