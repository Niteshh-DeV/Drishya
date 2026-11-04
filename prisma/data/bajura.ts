/**
 * Bajura — destination content (6 entries), converted from Bajura.docx.
 *
 * Long descriptions + cultural notes double as the RAG corpus later, so keep
 * them as written prose rather than bullet fragments.
 */
import type { Destination } from "@/lib/types";

export const bajuraDestinations: Destination[] = [
  {
    id: "bajura-badimalika",
    slug: "badimalika-temple",
    districtId: "bajura",
    name: "Badimalika Temple",
    nameNepali: "बडिमालिका मन्दिर",
    category: ["Temple", "Meadow"],
    nearestTown: "2–3 day trek from Martadi (district headquarters of Bajura)",
    // NOTE: source coordinates are identical to Triveni Patan's — verify.
    position: [29.3469, 81.4775],
    elevationM: 4220,

    interestTags: ["Religious", "Nature", "Adventure", "Trekking"],
    bestSeasons: ["Autumn", "Spring"],
    bestTimeNote:
      "The massive pilgrimage festival happens in Shrawan (August, monsoon), but for general travelers Autumn and Spring offer clear skies.",
    budget: "Medium",
    budgetNote:
      "Requires domestic travel, hiring porters/guides, and camping gear.",
    hiddenGem: false,
    hiddenGemReason:
      "Highly celebrated culturally, though physically remote and untamed.",

    shortDescription:
      "A sacred, high-altitude pagoda temple perched atop vast, rolling green meadows that look almost digitally animated.",
    longDescription:
      "Perched at 4,220m, Badimalika is a revered Shakti Peeth dedicated to Bhagwati Durga. It is legendary for its 22 endless alpine grasslands (patan), where clouds skim the grass under vast Himalayan backdrops. Travelers undertake a demanding multiday trek to stand at the summit temple, offering panoramic views of the Api-Saipal ranges, grazing wild horses, and untouched mountain ecology.",
    bestFor: "Hardcore trekkers, photographers, and spiritual seekers.",

    howToGetThere:
      "Fly from Nepalgunj to Kolti Airport, or drive via jeep from Dhangadhi to Martadi. From Martadi, it is a demanding 2-to-3-day trek on foot across high ridges.",
    entryFee: "Free",
    openingHours:
      "Open all year, but practically inaccessible or highly dangerous in deep winter due to snow. Trails are heavily muddy during the mid-monsoon.",
    nearbyStaysFood:
      "No permanent hotels or commercial lodges exist on the upper pastures. Travelers must rely on seasonal pilgrim shelter huts (dharmashala) or carry self-sufficient camping tents and food.",
    safetyNotes:
      "Cell signal is limited to specific high ridges (recently expanded via Ncell/NTC towers near the top). High risk of Acute Mountain Sickness (AMS); warm clothing and acclimatization are mandatory.",

    sources: [
      { url: "https://commons.wikimedia.org/wiki/File:Badimalika_Temple_4186M,_Bajura,_Nepal.jpg", label: "High-altitude pastures & temple complex (Wikimedia Commons)" },
    ],
    photoCredit: "Wikimedia Commons / Umesh Paudel",

    alternateNames: ["Badi Mahka Bhagawati", "Malika Mai"],
    culturalNote:
      "According to the Hindu Swasthani Brata Katha, this is the exact location where Sati Devi's left shoulder fell when Lord Shiva wandered the earth carrying her remains, cementing it as an anchor of divine energy.",
  },

  {
    id: "bajura-chhededaha",
    slug: "khaptad-chhededaha-lake",
    districtId: "bajura",
    name: "Khaptad Chhededaha Lake",
    nameNepali: "छेडेदह ताल",
    category: ["Lake & Wetland"],
    nearestTown:
      "Near the roadside, roughly 5–7 km from the Bajura–Bajhang district border",
    // Approximate — derived from a local centre point in the source.
    position: [29.4764, 81.1892],
    elevationM: 2100,

    interestTags: ["Nature", "Relaxation"],
    bestSeasons: ["Spring", "Autumn", "Winter"],
    bestTimeNote: "Snow blankets the lake beautifully in winter.",
    budget: "Low",
    budgetNote: "Highly affordable compared to the major multiday treks.",
    hiddenGem: true,
    hiddenGemReason:
      "Highly localized, lesser known to national/international travelers, and heavily sought after by local educational tours.",

    shortDescription:
      "A serene, natural mountain lake tucked away between green ridges, famous for its calm waters and accessibility right off the transit route.",
    longDescription:
      "Khaptad Chhededaha Lake is a natural lake located in the Khaptad Chhededaha Rural Municipality. It acts as a scenic, peaceful resting spot for commuters traveling between the Bajura and Bajhang districts. Surrounded by community-managed pine forests and steep valleys, the lake provides a sanctuary for quiet contemplation, photography, and viewing clear mountain reflections on its glassy, untouched surface.",
    bestFor: "Families, road-trippers, and budget travelers.",

    howToGetThere:
      "Easily reached via regular public jeeps or buses heading along the main highway connecting Bajura and Bajhang. It requires minimal walking, unlike the other high-altitude destinations in the region.",
    entryFee: "Free",
    openingHours:
      "Open daily. Monsoons can trigger active landslides along the nearby slopes, so travel should be planned carefully during peak rainy months.",
    nearbyStaysFood:
      "Local eateries and small roadside tea shops operate nearby. Homestays are developing in the adjoining villages of Aatichaur.",
    safetyNotes:
      "The area is prone to slope instability; watch for landslide signs during heavy downpours. The water is deep, so swimming is discouraged unless properly equipped.",

    sources: [
      { url: "https://kathmandupost.com/sudurpaschim-province/2023/12/28/massive-landslide-threatens-bajura-s-chhededaha-lake-and-surroundings", label: "Chhededaha landslide and conservation profile (Kathmandu Post)" },
    ],
    photoCredit: "The Kathmandu Post / Arjun Thapa",

    alternateNames: ["Chhededaha Tal", "Aatichaur Lake"],
    culturalNote:
      "The lake forms the ecological and cultural crown of the local Khaptad Chhededaha region. Local communities actively run afforestation and conservation drives here to safeguard it from erosion, viewing the lake as a living symbol of their district's natural heritage.",
  },

  {
    id: "bajura-kalajagra",
    slug: "kalajagra",
    districtId: "bajura",
    name: "Kalajagra",
    nameNepali: "कालाजग्रा",
    category: ["Viewpoint", "Mountain & Trek", "Cultural Heritage"],
    nearestTown: "2-hour off-road ride plus 4-hour trek from Martadi Bazaar (district HQ)",
    position: [29.4752, 81.3324],
    elevationM: 3100,

    interestTags: ["Nature", "Adventure", "Trekking", "Religious"],
    bestSeasons: ["Spring", "Autumn", "Winter"],
    bestTimeNote:
      "Not recommended in the core monsoon (June to late August): severe mud, landslides, leeches, and dense fog.",
    budget: "Medium",
    hiddenGem: true,

    shortDescription:
      "A pristine 3,100m alpine viewpoint offering breathtaking 180-degree Himalayan views and hosting a sacred localized Bhagwati Devi shrine.",
    longDescription:
      "Kalajagra is a hidden alpine paradise where lush, high-altitude meadows run alongside steep, mist-shrouded rocky ridges. From its windswept peak, visitors are treated to a multi-directional panoramic view: the towering Humla-Dhaulagiri range dominates the eastern horizon, the Api-Jethi Baurani mountains flank the north, and the alpine valleys of Badimalika stretch south. Beyond its visual beauty, Kalajagra holds immense spiritual weight anchored by a stone Bhagwati Devi shrine, where travelers can experience the harmonious blend of rugged Far-West wilderness and remote mountain devotion.",
    bestFor: "Solo trekkers, landscape photographers, and adventure pilgrims.",

    howToGetThere:
      "Take a 4WD jeep or motorcycle from Martadi to Dhamkana Village (1.5 to 2 hours), then embark on a moderately challenging 3 to 4-hour uphill trek through dense pine forests and ridges to reach the summit.",
    entryFee: "Free",
    openingHours: "Open 24/7. See best-time note for the monsoon closure window.",
    nearbyStaysFood:
      "Basic, informal homestays and rustic tea shops are available down in Dhamkana Village. There are no commercial lodges at the summit; overnight visitors must bring self-sustaining camping gear, food, and water filters.",
    safetyNotes:
      "The weather at 3,100m changes rapidly with sudden temperature drops. Trails are narrow along ridge edges. Cellular signals (NTC/Ncell) are completely dead or highly erratic near the peak.",

    sources: [
      { url: "https://www.facebook.com/wildbajura/", label: "Wild Bajura community page" },
    ],
    photoCredit: "Himalaya Bhatt / Wild Bajura",

    alternateNames: ["Kala Jagra", "Kalajagra Bhagwati", "Kalajagra Peak"],
    culturalNote:
      "The peak is traditionally revered as a protective outer sanctuary dedicated to Goddess Bhagwati. Local Dhamis (shamans) and pastoral herders consider the mountain sacred, frequently stopping at the summit shrines to offer prayers before moving livestock further into the high-altitude pastures towards Budhinanda or Badimalika.",
  },

  {
    id: "bajura-budhinanda",
    slug: "budhinanda-tal",
    districtId: "bajura",
    name: "Budhinanda Tal & Temple",
    nameNepali: "बुढीनन्दा",
    category: ["Lake & Wetland", "Religious Site", "Temple", "Cultural Heritage"],
    nearestTown:
      "Trail starts from Kolti Bazaar (gateway hub for Budhinanda Municipality); a rigorous 3–4 day high-altitude trek northward",
    position: [29.6478, 81.5547],
    elevationM: 4600,

    interestTags: [
      "Nature",
      "Adventure",
      "Culture",
      "History",
      "Religious",
      "Trekking",
    ],
    bestSeasons: ["Autumn", "Spring"],
    bestTimeNote:
      "Autumn especially during the Janai Purnima festival in late August for localized cultural events.",
    budget: "High",
    budgetNote:
      "Requires multi-day self-sustained camping, long-distance domestic logistics, and flights or extensive off-road 4WD transit to reach remote trailheads.",
    hiddenGem: true,

    shortDescription:
      "An extraordinary high-altitude wilderness sanctuary at 4,600m, encompassing a network of sacred glacial lakes and shrines backdropped by the Saipal Himalayan range.",
    longDescription:
      "Budhinanda stands as one of Far-West Nepal's ultimate off-the-beaten-track alpine wonders, blending raw geographic isolation with deep Khas mystical heritage. Spanning a high-altitude plateau, the area features more than a dozen hidden mountain lakes nestled among steep rocky slopes and snow-draped passes. Trekkers are rewarded with unobstructed views of the mammoth Saipal and Jethibaurani peaks, while witnessing an age-old pilgrimage route where devotees cross challenging high ridges barefoot to offer prayers at remote stone shrines dedicated to the goddess Bhagwati.",
    bestFor:
      "High-altitude alpine trekkers, adventure pilgrims, and extreme landscape photographers.",

    howToGetThere:
      "Travel from Martadi via off-road vehicle or catch a domestic flight into the Kolti Airstrip. From Kolti, begin a multi-day foot trek ascending through the high mountain settlements of Nuri Gaon, navigating steep rocky scree sections above 4,000 meters to reach the lake basin.",
    entryFee: "Free.",
    openingHours:
      "Open 24/7. Heavily restricted or entirely impassable due to deep winter snowpack from November to April, and highly dangerous in the peak monsoon (June–July) due to intense mountain fog and active landslide zones.",
    nearbyStaysFood:
      "No commercial tea houses or lodges exist in the lake zone. Pilgrims traditionally sleep inside large natural rock caves like Dhauli Odar. Trekkers must pack fully self-sufficient four-season camping gear, high-altitude fuel, and personal food rations (e.g., roti, chiura, and dry goods).",
    safetyNotes:
      "Acute Mountain Sickness (AMS) is a severe risk due to the rapid gain in elevation. The terrain contains narrow, exposed ridge edges and slick boulder trails. Hiring an experienced local guide from Nuri Gaon is highly recommended. Cellular connectivity (NTC/Ncell) is completely non-existent.",

    sources: [
      { url: "https://www.facebook.com/wildbajura/", label: "Wild Bajura community repository" },
    ],
    photoCredit: "Himalaya Bhatt / Wild Bajura",

    alternateNames: [
      "Budhinandha Tal",
      "Budhinanda Mai",
      "Budhinanda Bhagwati",
      "Maharudra Tal",
    ],
    culturalNote:
      "In the regional dialect, Budhi translates to elder and Nanda means unmarried girl, symbolizing Budhinanda Mai as the eldest, pure maternal manifestation among nine sister mountain deities in the Far-West. Local mythology strictly segments the lakes by their appearance: clear, turquoise waters like Chari Daha are considered highly sacred spaces for youth coming-of-age rituals (Bratabandha), while nearby dark, black-water lakes are feared as unholy and are traditionally avoided by passing travelers.",
  },

  {
    id: "bajura-birekhola",
    slug: "birekhola-waterfall",
    districtId: "bajura",
    name: "Birekhola Waterfall",
    nameNepali: "बिरेखोला झरना",
    category: ["Waterfall"],
    nearestTown:
      "Border of Wards 6 and 8 of Badimalika Municipality, beside the Sanfe–Martadi Highway, about 15 minutes (6 km) south of Martadi Bazaar",
    position: [29.4346, 81.4583],
    elevationM: 1250,

    interestTags: ["Nature", "Adventure", "Relaxation"],
    bestSeasons: ["Monsoon", "Autumn"],
    bestTimeNote:
      "Peak flow and ideal viewing run from mid-June to mid-November. The fall drops roughly 100–200 m from the cliff face; 1,250 m is the roadside basin elevation.",
    budget: "Low",
    budgetNote:
      "Direct roadside access requires virtually no hiking expenses or specialized transport.",
    hiddenGem: true,
    hiddenGemReason:
      "Historically a local secret known only to rural herders, it has rapidly emerged as a pristine domestic tourist hotspot in Sudurpashchim.",

    shortDescription:
      "A magnificent 100-to-200-meter waterfall cascading directly alongside the Sanfe–Martadi Highway, serving as a powerful and refreshing natural landmark for anyone traveling through Bajura.",
    longDescription:
      "Birekhola Waterfall, often referred to locally as Bire Chhado, is a thunderous water column dropping down dramatic, lush green cliffs. Its immediate highway visibility combined with the raw, untamed landscape of the Far-West makes it an exceptional rest stop. Visitors can easily step off the road to experience the powerful mountain mist, walk across the newly installed safety bridges, photograph the sheer drop against the rocky backdrop, and escape the crowds in a serene, sub-alpine environment.",
    bestFor:
      "Road-trippers, family day-trippers, landscape photographers, and casual nature lovers.",

    howToGetThere:
      "Extremely straightforward access. Any public bus, local 4WD jeep, or private motorcycle traveling toward Martadi from the Sanfe side can drop you off right at the falls along the Sanfe–Martadi Highway.",
    entryFee: "Rs. 20 per person.",
    openingHours:
      "Open daily during daylight hours. Accessible year-round, though the volume swells dramatically during the peak monsoon months (June–August).",
    nearbyStaysFood:
      "Local roadside eateries and small tea shops are found nearby at Rapak Bazaar and Bhaunera Bazaar, locally famous for fresh poultry and organic cucumbers. Standard lodging, hotels, and main markets are 6 km away in Martadi Bazaar.",
    safetyNotes:
      "The massive water pressure creates a continuous wet spray zone. The stone steps and iron safety railings near the plunge pool can get very slick. Avoid climbing the wet boundary boulders during heavy monsoon discharges. Cell signals (NTC and Ncell) are functional but can fluctuate down in the valley corridor.",

    sources: [
      { url: "https://www.facebook.com/wildbajura/", label: "Wild Bajura community archives" },
    ],
    photoCredit: "Nabin Raj Upadhaya / People Places Nepal",

    alternateNames: [
      "Bire Chhado",
      "बिरे छाँगो",
      "Bire Khola Jharna",
      // Source also lists "Birkholz Jharana" — likely an autocorrect garble; dropped.
    ],
    culturalNote:
      "For generations, this waterfall was passed only by local herders and small foot-travelers moving through Badimalika's forests. The widening and paving of the Sanfe–Martadi highway brought the cascade directly to the roadside. Recognizing its natural appeal, the Badimalika Municipality stepped in to build protective fencing, view bridges, and clean pathways to preserve the waterfall while boosting local eco-tourism.",
  },

  {
    id: "bajura-triveni-patan",
    slug: "triveni-patan",
    districtId: "bajura",
    name: "Triveni Patan",
    nameNepali: "त्रिवेणी पाटन",
    category: ["Meadow", "Forest & Wildlife", "Cultural Heritage"],
    nearestTown:
      "Just below Badimalika Temple. Closest vehicle-accessible settlements are Jadanga or Budha Krodh, then a 2-day uphill trek",
    // NOTE: source coordinates are identical to Badimalika Temple's — verify.
    position: [29.3469, 81.4775],
    elevationM: 3840,

    interestTags: [
      "Nature",
      "Adventure",
      "Culture",
      "Religious",
      "Trekking",
      "Relaxation",
    ],
    bestSeasons: ["Spring", "Summer", "Monsoon", "Autumn"],
    bestTimeNote:
      "April to October is highly vibrant, with the monsoon turning it into a lush green carpet.",
    budget: "High",
    budgetNote:
      "Demands specialized porters, long-distance 4WD off-road travel, and a self-sustained wilderness camping expedition.",
    hiddenGem: true,

    shortDescription:
      "A breathtaking high-altitude alpine grassland stretching across the clouds at 3,840m, featuring a sacred three-river confluence where pilgrims perform holy rituals before climbing to Badimalika Temple.",
    longDescription:
      "Triveni Patan is an awe-inspiring expanse of rolling green hills, small wetlands, and wildflower meadows sitting well above the mountain tree line. It serves as a majestic alpine plateau where herds of sheep and wild horses graze freely against the backdrop of the icy Api and Saipal Himalayan ranges. The area carries profound spiritual energy centered on the confluence of three holy glacial streams, acting as an open-air sanctuary where travelers camp under clear, star-filled skies before ascending the final steep ridges to Mallagiri Peak.",
    bestFor: "High-altitude trekkers, landscape photographers, and cultural pilgrims.",

    howToGetThere:
      "Fly or drive from Kathmandu to Dhangadhi, then hire a local 4WD jeep to Jadanga or Budha Krodh. From the trailhead, it requires a challenging 2-to-3-day trek passing through Karala and Bhitachhina to step onto the grasslands.",
    entryFee: "Free.",
    openingHours:
      "Open 24/7. Completely inaccessible and dangerously frozen during winter (November to March) when shepherds retreat to lower valleys. Monsoon travel requires high caution due to slippery mud trails and heavy fog.",
    nearbyStaysFood:
      "There is zero commercial lodging, tea houses, or hotels. Trekkers must rely completely on four-season tents and carry self-sustaining cooking equipment and rations. During the Janai Purnima festival, basic temporary plastic tents pop up to serve pilgrims.",
    safetyNotes:
      "Acute Mountain Sickness (AMS) is a significant hazard; adequate acclimatization is mandatory. Bring high-quality rain gear, water filters, and cold-weather clothing. Cellular connectivity (NTC/Ncell) is highly erratic or entirely unavailable inside the lower meadow folds.",

    sources: [
      { url: "https://www.facebook.com/wildbajura/", label: "Wild Bajura community repository" },
    ],
    photoCredit: "Himalaya Bhatt / Wild Bajura",

    alternateNames: [
      "Tribeni Patan",
      "Badimalika Patan",
      "Triveni Grasslands",
      "Bini Patan",
    ],
    culturalNote:
      'The name "Triveni" translates to the meeting point of three sacred water streams. By unwavering religious tradition, every pilgrim heading to the Badimalika temple must bathe in these freezing waters at dawn to wash away their sins before they are considered pure enough to face the Goddess Bhagwati on the peak above. The meadow is also home to Bhatejiula, a wetland section covered in unique high-altitude plants that mimic manicured paddy fields, which local mythology claims were planted by the gods themselves.',
  },
];

export function getBajuraDestination(slug: string): Destination | undefined {
  return bajuraDestinations.find((d) => d.slug === slug);
}