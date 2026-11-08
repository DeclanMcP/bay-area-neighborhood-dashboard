// Top picks from Zillow for the ranked areas.
// Curated by hand from the user's Zillow alert / recommendation emails
// (Gmail) plus live listing checks, most recently on 2026-11-07. These are
// NOT live availability: a pick is a listing Zillow surfaced by email on
// the stated date, and only entries marked "live-checked" were verified
// against a listing page that day. Prices are as emailed. The user's saved
// Zillow searches cover San Jose and Redwood City, so other ranked areas
// have no picks on file yet — the Rankings tab says so per area rather
// than filling the space with unsourced listings.

export const ZILLOW_PICKS = {
  "San Jose": [
    {
      address: "1562 Kooser Rd", price: 998000, beds: 3, baths: 2,
      note: "Cambrian, 6,009 sqft lot. Best fit of the live-checked set; no open-house time was posted.",
      source: "Live-checked Nov 7, 2026",
    },
    {
      address: "1409 Hamilton Way", price: 999000, beds: 2, baths: 1,
      note: "Willow Glen bungalow, 6,200 sqft lot, detached garage, ADU potential. Offers due Mon Nov 16 at noon.",
      source: "Zillow email",
    },
    {
      address: "458 Flagg Ave", price: 995000, beds: 2, baths: 1,
      note: "After a $55k price cut (Nov 2). No open house listed.",
      source: "Zillow email, Nov 2",
    },
    {
      address: "1533 Pomona Ave", price: 999999, beds: 2, baths: 2,
      note: "After a $49k price cut. Its neighbour 1541 Pomona ($1,099,000, 3bd) is in the same alerts.",
      source: "Zillow email, Oct 31",
    },
  ],
  "Redwood City": [
    {
      address: "614 Warrington Ave", price: 849000, beds: null, baths: null,
      note: "The cheapest Peninsula pick in the alerts.",
      source: "Zillow email, Oct 26",
    },
    {
      address: "3091 Glendale Ave", price: 1299000, beds: null, baths: null,
      note: "Zillow recommendation pick. Above the $1.2M comfort max, shown for completeness.",
      source: "Zillow recommendation, Oct 27",
    },
  ],
};

export const PICKS_NOTE =
  "Picks are listings from the user's Zillow alert and recommendation emails, " +
  "with prices as emailed; they are not live availability unless marked " +
  "live-checked. Saved Zillow searches cover San Jose and Redwood City, so " +
  "other ranked areas have no picks on file yet.";
