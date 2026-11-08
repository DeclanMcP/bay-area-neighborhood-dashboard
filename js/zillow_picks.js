// Top picks from Zillow for the ranked areas.
// Pulled from live Zillow search on 2026-11-07 (evening PT) with a
// $1,200,000 price cap in every city: each pick was opened on its own
// Zillow homedetails page and confirmed "For sale" at the listed price
// that evening. Prices and availability change; every address links to
// the live listing so it can be re-checked in one click. Refresh by
// re-running the same Zillow searches, not from email alerts.

export const ZILLOW_PICKS = {
  "Walnut Creek": [
    { address: "2493 Warren Rd", price: 789000, beds: 4, baths: 5, sqft: 2941, lot: "0.31-acre lot", type: "House", days: 2, note: "", url: "https://www.zillow.com/homedetails/2493-Warren-Rd-Walnut-Creek-CA-94595/18417927_zpid/" },
    { address: "3055 Arbolado Dr", price: 995000, beds: 4, baths: 3, sqft: 2376, lot: "0.30-acre lot", type: "House", days: 4, note: "", url: "https://www.zillow.com/homedetails/3055-Arbolado-Dr-Walnut-Creek-CA-94598/18377486_zpid/" },
    { address: "2861 Buena Vista Ave", price: 899000, beds: 3, baths: 2, sqft: 1196, lot: "0.25-acre lot", type: "House", days: 5, note: "", url: "https://www.zillow.com/homedetails/2861-Buena-Vista-Ave-Walnut-Creek-CA-94597/18407147_zpid/" },
  ],
  "San Bruno": [
    { address: "998 Hensley Ave", price: 1195000, beds: 5, baths: 3, sqft: 1913, lot: "2,499 sqft lot", type: "House", days: 3, note: "", url: "https://www.zillow.com/homedetails/998-Hensley-Ave-San-Bruno-CA-94066/15496375_zpid/" },
    { address: "698 Masson Ave", price: 1188000, beds: 3, baths: 2, sqft: 1530, lot: "2,499 sqft lot", type: "House", days: 32, note: "Price cut $61,000 on Oct 27.", url: "https://www.zillow.com/homedetails/698-Masson-Ave-San-Bruno-CA-94066/15496631_zpid/" },
    { address: "1055 San Mateo Ave", price: 1198000, beds: 5, baths: 3, sqft: 1500, lot: "5,000 sqft lot", type: "House", days: 46, note: "Price cut $97,000 on Oct 10.", url: "https://www.zillow.com/homedetails/1055-San-Mateo-Ave-San-Bruno-CA-94066/15488972_zpid/" },
  ],
  "Milpitas": [
    { address: "1306 Mount Shasta Ave", price: 1199888, beds: 2, baths: 2, sqft: 1187, lot: "5,040 sqft lot", type: "House", days: 15, note: "The only single-family house under $1.2M in Milpitas.", url: "https://www.zillow.com/homedetails/1306-Mount-Shasta-Ave-Milpitas-CA-95035/19482966_zpid/" },
    { address: "1418 Lavender Loop", price: 998000, beds: 3, baths: 3, sqft: 1631, lot: "1,294 sqft lot", type: "Townhouse", days: 30, note: "", url: "https://www.zillow.com/homedetails/1418-Lavender-Loop-Milpitas-CA-95035/300480687_zpid/" },
    { address: "180 Marylinn Dr", price: 995000, beds: 4, baths: 2, sqft: 1505, lot: "", type: "Condo", days: 4, note: "", url: "https://www.zillow.com/homedetails/180-Marylinn-Dr-Milpitas-CA-95035/19472199_zpid/" },
  ],
  "San Jose": [
    { address: "706 S Jackson Ave", price: 899888, beds: 4, baths: 2, sqft: 1242, lot: "6,000 sqft lot", type: "House", days: null, note: "", url: "https://www.zillow.com/homedetails/706-S-Jackson-Ave-San-Jose-CA-95116/19723964_zpid/" },
    { address: "221 Beegum Way", price: 1149900, beds: 3, baths: 3, sqft: 1546, lot: "5,000 sqft lot", type: "House", days: null, note: "Price cut $50,000 on Oct 20.", url: "https://www.zillow.com/homedetails/221-Beegum-Way-San-Jose-CA-95123/19828107_zpid/" },
    { address: "1139 Bendmill Way", price: 999000, beds: 4, baths: 2, sqft: 1542, lot: "6,420 sqft lot", type: "House", days: 1, note: "", url: "https://www.zillow.com/homedetails/1139-Bendmill-Way-San-Jose-CA-95121/19741369_zpid/" },
  ],
  "Fremont": [
    { address: "42650 Isle Royal St", price: 1100000, beds: 3, baths: 2, sqft: 1581, lot: "5,700 sqft lot", type: "House", days: 11, note: "", url: "https://www.zillow.com/homedetails/42650-Isle-Royal-St-Fremont-CA-94538/25040188_zpid/" },
    { address: "3864 Jamestown Rd", price: 1198000, beds: 3, baths: 2, sqft: 1112, lot: "5,310 sqft lot", type: "House", days: 24, note: "", url: "https://www.zillow.com/homedetails/3864-Jamestown-Rd-Fremont-CA-94538/25041104_zpid/" },
    { address: "39656 Iolani Ct", price: 1199900, beds: 3, baths: 2, sqft: 1067, lot: "5,723 sqft lot", type: "House", days: 30, note: "Price cut $50,000 on Nov 5.", url: "https://www.zillow.com/homedetails/39656-Iolani-Ct-Fremont-CA-94538/25044465_zpid/" },
  ],
  "San Mateo": [
    { address: "221 N Delaware St", price: 1198000, beds: 3, baths: 2, sqft: 1070, lot: "6,038 sqft lot", type: "House", days: 22, note: "", url: "https://www.zillow.com/homedetails/221-N-Delaware-St-San-Mateo-CA-94401/15522187_zpid/" },
    { address: "3419 La Selva St", price: 998000, beds: 2, baths: 2, sqft: 1190, lot: "1,612 sqft lot", type: "House", days: 43, note: "Listing page shows a $555/mo HOA.", url: "https://www.zillow.com/homedetails/3419-La-Selva-St-San-Mateo-CA-94403/15541037_zpid/" },
    { address: "927 Shoreline Dr", price: 1150000, beds: 3, baths: 2, sqft: 1570, lot: "", type: "Condo", days: 23, note: "Price cut $48,000 on Nov 4.", url: "https://www.zillow.com/homedetails/927-Shoreline-Dr-San-Mateo-CA-94404/15630107_zpid/" },
  ],
  "Redwood City": [
    { address: "827 Chestnut St", price: 989000, beds: 2, baths: 1, sqft: 1160, lot: "5,020 sqft lot", type: "House", days: 15, note: "", url: "https://www.zillow.com/homedetails/827-Chestnut-St-Redwood-City-CA-94063/15566021_zpid/" },
    { address: "930 Haven Ave", price: 998000, beds: 2, baths: 1, sqft: 1000, lot: "5,000 sqft lot", type: "House", days: 5, note: "", url: "https://www.zillow.com/homedetails/930-Haven-Ave-Redwood-City-CA-94063/15568572_zpid/" },
    { address: "327 Center St", price: 898000, beds: 2, baths: 1, sqft: 800, lot: "6,098 sqft lot", type: "House", days: 2, note: "", url: "https://www.zillow.com/homedetails/327-Center-St-Redwood-City-CA-94061/15566443_zpid/" },
  ],
  "Castro Valley": [
    { address: "18639 Lake Chabot Rd", price: 1098000, beds: 3, baths: 2, sqft: 1996, lot: "5,000 sqft lot", type: "House", days: 2, note: "", url: "https://www.zillow.com/homedetails/18639-Lake-Chabot-Rd-Castro-Valley-CA-94546/24906652_zpid/" },
    { address: "16972 Rolando Ave", price: 998000, beds: 4, baths: 2, sqft: 1665, lot: "6,344 sqft lot", type: "House", days: 44, note: "", url: "https://www.zillow.com/homedetails/16972-Rolando-Ave-Castro-Valley-CA-94546/24894405_zpid/" },
    { address: "17494 Ehle St", price: 880000, beds: 3, baths: 2, sqft: 1509, lot: "6,098 sqft lot", type: "House", days: 22, note: "Price cut $15,000 on Nov 6.", url: "https://www.zillow.com/homedetails/17494-Ehle-St-Castro-Valley-CA-94546/24905185_zpid/" },
  ],
};

// Dashboard place names that are neighbourhoods of a Zillow search city.
export const PLACE_ALIASES = { "Contra Costa Centre": "Walnut Creek" };

export const PICKS_NOTE =
  "Pulled from live Zillow searches on Nov 7, 2026 with a $1.2M cap; every " +
  "pick was opened on its Zillow page and confirmed for sale at this price " +
  "that evening. Listings change fast, so each address links straight to " +
  "the live Zillow listing.";
