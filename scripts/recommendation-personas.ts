/**
 * Traveller personas for scripts/evaluate-recommendations.ts.
 *
 * Each persona's preferences are what that traveller would pick on /plan.
 * `expected` is for the team to fill in from local knowledge: the places
 * (destination ids — `npm run recommend:eval -- --ids` lists them) that
 * someone who knows the province would suggest to this traveller. Leave it
 * empty until someone who knows the places has written it; a list copied
 * from the engine's own output would only prove the engine agrees with
 * itself.
 */
import type { BudgetLevel, InterestTag, Season } from "../src/lib/types";

export interface Persona {
  name: string;
  interests: InterestTag[];
  /** Null for any time of year. */
  season: Season | null;
  /** Budget ceiling; null for any. */
  budget: BudgetLevel | null;
  /** District id the trip starts from; null for anywhere. */
  from: string | null;
  hiddenGems?: boolean;
  /** Destination ids a local would suggest, in no particular order. */
  expected: string[];
}

export const PERSONAS: Persona[] = [
  {
    name: "Family from Dhangadhi, temples on a winter weekend",
    interests: ["Religious"],
    season: "Winter",
    budget: "Low",
    from: "kailali",
    expected: [],
  },
  {
    name: "Trekker flying into Dhangadhi in autumn",
    interests: ["Trekking", "Adventure"],
    season: "Autumn",
    budget: "Medium",
    from: "kailali",
    expected: [],
  },
  {
    name: "Birdwatcher based in Mahendranagar",
    interests: ["Wildlife", "Nature"],
    season: "Winter",
    budget: "Low-Medium",
    from: "kanchanpur",
    expected: [],
  },
  {
    name: "History student from Dadeldhura",
    interests: ["History", "Archaeology"],
    season: "Spring",
    budget: "Low",
    from: "dadeldhura",
    expected: [],
  },
  {
    name: "Pilgrim to the high temples in summer",
    interests: ["Religious", "Trekking"],
    season: "Summer",
    budget: "Medium",
    from: "bajura",
    expected: [],
  },
  {
    name: "A spring weekend by the water from Dhangadhi",
    interests: ["Relaxation", "Nature"],
    season: "Spring",
    budget: "Low",
    from: "kailali",
    expected: [],
  },
  {
    name: "Hidden-gem hunter starting in Doti",
    interests: ["Culture", "Nature"],
    season: "Autumn",
    budget: null,
    from: "doti",
    hiddenGems: true,
    expected: [],
  },
  {
    name: "Monsoon visitor from Mahendranagar",
    interests: ["Nature"],
    season: "Monsoon",
    budget: "Low",
    from: "kanchanpur",
    expected: [],
  },
  {
    name: "Baitadi local exploring the hills in winter",
    interests: ["Culture", "History"],
    season: "Winter",
    budget: "Low",
    from: "baitadi",
    expected: [],
  },
  {
    name: "Adventure trip from Chainpur in spring",
    interests: ["Adventure", "Trekking"],
    season: "Spring",
    budget: "High",
    from: "bajhang",
    expected: [],
  },
  {
    name: "No plans yet: anything good in autumn from Achham",
    interests: [],
    season: "Autumn",
    budget: null,
    from: "achham",
    expected: [],
  },
  {
    name: "Starting in Darchula in summer",
    interests: ["Nature", "Trekking"],
    season: "Summer",
    budget: "Medium",
    from: "darchula",
    expected: [],
  },
];
