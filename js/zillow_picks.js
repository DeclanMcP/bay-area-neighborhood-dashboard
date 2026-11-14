// Top picks from Zillow for the ranked areas.
// Pulled from live Zillow search on 2026-11-07 (evening PT) with a
// $1,200,000 price cap in every city: each pick was opened on its own
// Zillow homedetails page and confirmed "For sale" at the listed price
// that evening. Hercules, Dublin, Martinez and Petaluma picks were
// pulled the same way on 2026-11-09 (morning PT). Newark, Castro Valley,
// San Mateo and Fremont picks were refreshed the same way on 2026-11-10
// (morning PT). Walnut Creek, San Jose, Dublin and Hercules picks were
// refreshed the same way on 2026-11-11 (morning PT). San Bruno, Redwood
// City, Martinez and Petaluma picks were refreshed the same way on
// 2026-11-12 (morning PT). Milpitas, Newark, Castro Valley and San Mateo
// picks were refreshed the same way on 2026-11-13 (morning PT). Walnut Creek,
// San Jose, Dublin and Hercules picks were refreshed the same way on
// 2026-11-14 (morning PT). Prices and availability
// change; every address links to the live listing so it can be re-checked
// in one click. Refresh by re-running the same Zillow searches, not from
// email alerts.

export const ZILLOW_PICKS = {
  "Walnut Creek": [
    { address: "2365 Parish Dr", price: 1050000, beds: 3, baths: 2, sqft: 1502, lot: "9,583 sqft lot", type: "House", days: 16, note: "Price cut $50,000 on Nov 13.", url: "https://www.zillow.com/homedetails/2365-Parish-Dr-Walnut-Creek-CA-94598/18384442_zpid/" },
    { address: "2520 San Miguel Dr", price: 1198000, beds: 3, baths: 2, sqft: 1350, lot: "6,534 sqft lot", type: "House", days: 40, note: "", url: "https://www.zillow.com/homedetails/2520-San-Miguel-Dr-Walnut-Creek-CA-94596/18415833_zpid/" },
    { address: "2573 Decca Ln", price: 1080000, beds: 4, baths: 4, sqft: 1678, lot: "0.28-acre lot", type: "House", days: 128, note: "", url: "https://www.zillow.com/homedetails/2573-Decca-Ln-Walnut-Creek-CA-94597/18408060_zpid/" },
    { address: "1941 Argonne Dr", price: 1198000, beds: 4, baths: 3, sqft: 2030, lot: "10,018 sqft lot", type: "House", days: 114, note: "", url: "https://www.zillow.com/homedetails/1941-Argonne-Dr-Walnut-Creek-CA-94598/18384134_zpid/" },
    { address: "1942 Almond Ave", price: 1035000, beds: 2, baths: 1, sqft: 681, lot: "10,018 sqft lot", type: "House", days: 15, note: "", url: "https://www.zillow.com/homedetails/1942-Almond-Ave-Walnut-Creek-CA-94596/18413091_zpid/" },
    { address: "40 Rodrigues Ln", price: 525000, beds: null, baths: null, sqft: null, lot: "1.83 acres", type: "Land", days: 3, note: "Unimproved land in a gated community, marketed as a build-your-dream-home lot.", url: "https://www.zillow.com/homedetails/40-Rodrigues-Ln-Walnut-Creek-CA-94597/95395286_zpid/" },
    { address: "1549 Arkell Rd", price: 429000, beds: null, baths: null, sqft: null, lot: "8,276 sqft", type: "Land", days: 18, note: "Rare flat lot, newly created parcel.", url: "https://www.zillow.com/homedetails/1549-Arkell-Rd-Walnut-Creek-CA-94598/466142072_zpid/" },
  ],
  "San Bruno": [
    { address: "1094 Montgomery Ave", price: 849000, beds: 2, baths: 2, sqft: 1059, lot: "2,500 sqft lot", type: "House", days: 13, note: "", url: "https://www.zillow.com/homedetails/1094-Montgomery-Ave-San-Bruno-CA-94066/15488941_zpid/" },
    { address: "998 Hensley Ave", price: 1195000, beds: 5, baths: 3, sqft: 1913, lot: "2,499 sqft lot", type: "House", days: 7, note: "", url: "https://www.zillow.com/homedetails/998-Hensley-Ave-San-Bruno-CA-94066/15496375_zpid/" },
    { address: "698 Masson Ave", price: 1188000, beds: 3, baths: 2, sqft: 1530, lot: "2,499 sqft lot", type: "House", days: 37, note: "Price cut $61,000 on Oct 27.", url: "https://www.zillow.com/homedetails/698-Masson-Ave-San-Bruno-CA-94066/15496631_zpid/" },
    { address: "1055 San Mateo Ave", price: 1198000, beds: 5, baths: 3, sqft: 1500, lot: "5,000 sqft lot", type: "House", days: 50, note: "Price cut $97,000 on Oct 23.", url: "https://www.zillow.com/homedetails/1055-San-Mateo-Ave-San-Bruno-CA-94066/15488972_zpid/" },
  ],
  "Milpitas": [
    { address: "1306 Mount Shasta Ave", price: 1199888, beds: 2, baths: 2, sqft: 1187, lot: "5,040 sqft lot", type: "House", days: 20, note: "The only single-family house under $1.2M in Milpitas.", url: "https://www.zillow.com/homedetails/1306-Mount-Shasta-Ave-Milpitas-CA-95035/19482966_zpid/" },
    { address: "1418 Lavender Loop", price: 998000, beds: 3, baths: 3, sqft: 1631, lot: "1,294 sqft lot", type: "Townhouse", days: 30, note: "", url: "https://www.zillow.com/homedetails/1418-Lavender-Loop-Milpitas-CA-95035/300480687_zpid/" },
    { address: "180 Marylinn Dr", price: 995000, beds: 4, baths: 2, sqft: 1505, lot: "", type: "Condo", days: 4, note: "", url: "https://www.zillow.com/homedetails/180-Marylinn-Dr-Milpitas-CA-95035/19472199_zpid/" },
  ],
  "San Jose": [
    { address: "221 Beegum Way", price: 1149900, beds: 3, baths: 3, sqft: 1546, lot: "5,000 sqft lot", type: "House", days: 104, note: "Price cut $50,000 on Oct 20.", url: "https://www.zillow.com/homedetails/221-Beegum-Way-San-Jose-CA-95123/19828107_zpid/" },
    { address: "2440 Poplar Dr", price: 1079950, beds: 4, baths: 2, sqft: 1516, lot: "5,500 sqft lot", type: "House", days: 112, note: "", url: "https://www.zillow.com/homedetails/2440-Poplar-Dr-San-Jose-CA-95122/19727282_zpid/" },
    { address: "2869 Corda Dr", price: 1199000, beds: 4, baths: 3, sqft: 1593, lot: "3,280 sqft lot", type: "House", days: 38, note: "", url: "https://www.zillow.com/homedetails/2869-Corda-Dr-San-Jose-CA-95122/19802503_zpid/" },
    { address: "252 Ketchum Dr", price: 1150000, beds: 4, baths: 2, sqft: 1568, lot: "6,534 sqft lot", type: "House", days: 62, note: "", url: "https://www.zillow.com/homedetails/252-Ketchum-Dr-San-Jose-CA-95127/19722318_zpid/" },
    { address: "376 Hull Ave", price: 1150000, beds: 3, baths: 2, sqft: 1484, lot: "6,072 sqft lot", type: "House", days: 0, note: "Willow Glen; listed Nov 14.", url: "https://www.zillow.com/homedetails/376-Hull-Ave-San-Jose-CA-95125/19578072_zpid/" },
    { address: "819 Boulder Dr", price: 288000, beds: null, baths: null, sqft: null, lot: "0.47 acres", type: "Land", days: 2, note: "Level residential lot, zoned R1B1, public sewer.", url: "https://www.zillow.com/homedetails/819-Boulder-Dr-San-Jose-CA-95132/153466762_zpid/" },
    { address: "915 E Julian St", price: 550000, beds: null, baths: null, sqft: null, lot: "4,356 sqft", type: "Land", days: 44, note: "Downtown infill lot; price cut $50,000 on Oct 8. Photos show a small existing florist building on the lot.", url: "https://www.zillow.com/homedetails/915-E-Julian-St-San-Jose-CA-95112/448917472_zpid/" },
  ],
  "Fremont": [
    { address: "36846 Niles Blvd", price: 1050000, beds: 3, baths: 2, sqft: 1700, lot: "5,350 sqft lot", type: "House", days: 20, note: "Fixer-upper opportunity.", url: "https://www.zillow.com/homedetails/36846-Niles-Blvd-Fremont-CA-94536/25016491_zpid/" },
    { address: "42650 Isle Royal St", price: 1100000, beds: 3, baths: 2, sqft: 1581, lot: "5,700 sqft lot", type: "House", days: 14, note: "Patio area and additional family room.", url: "https://www.zillow.com/homedetails/42650-Isle-Royal-St-Fremont-CA-94538/25040188_zpid/" },
    { address: "33866 Gannet Ter", price: 1020000, beds: 2, baths: 3, sqft: 1407, lot: "2,700 sqft lot", type: "House", days: 97, note: "Price cut $50,000 on Nov 5; $260/mo HOA.", url: "https://www.zillow.com/homedetails/33866-Gannet-Ter-Fremont-CA-94555/25056996_zpid/" },
    { address: "3279 Washington Blvd", price: 1199000, beds: null, baths: null, sqft: null, lot: "8,572 sqft", type: "Land", days: 164, note: "Level lot in Mission San Jose; cut from $1,300,000 in June.", url: "https://www.zillow.com/homedetails/3279-Washington-Blvd-Fremont-CA-94539/299072505_zpid/" },
    { address: "Undisclosed address, 94538", price: 199999, beds: null, baths: null, sqft: null, lot: "3,000 sqft", type: "Land", days: 58, note: "Undeveloped raw land, surveyed.", url: "https://www.zillow.com/homedetails/Fremont-CA-94538/444776316_zpid/" },
  ],
  "San Mateo": [
    { address: "221 N Delaware St", price: 1198000, beds: 3, baths: 2, sqft: 1070, lot: "6,038 sqft lot", type: "House", days: 28, note: "Extra-deep lot with two units; built 1907.", url: "https://www.zillow.com/homedetails/221-N-Delaware-St-San-Mateo-CA-94401/15522187_zpid/" },
    { address: "3419 La Selva St", price: 998000, beds: 2, baths: 2, sqft: 1190, lot: "1,612 sqft lot", type: "House", days: 48, note: "Listing page shows a $555/mo HOA; attached unit, townhouse-like.", url: "https://www.zillow.com/homedetails/3419-La-Selva-St-San-Mateo-CA-94403/15541037_zpid/" },
    { address: "927 Shoreline Dr", price: 1150000, beds: 3, baths: 2, sqft: 1570, lot: "", type: "Condo", days: 23, note: "Price cut $48,000 on Nov 4.", url: "https://www.zillow.com/homedetails/927-Shoreline-Dr-San-Mateo-CA-94404/15630107_zpid/" },
    { address: "0 Parrott Dr", price: 699000, beds: null, baths: null, sqft: null, lot: "0.92 acres", type: "Land", days: 283, note: "Residential lot, zoned R1-A. The only San Mateo lot under the cap.", url: "https://www.zillow.com/homedetails/0-Parrott-Dr-San-Mateo-CA-94402/460029256_zpid/" },
  ],
  "Redwood City": [
    { address: "614 Warrington Ave", price: 849000, beds: 2, baths: 2, sqft: 760, lot: "2,500 sqft lot", type: "House", days: 48, note: "Price cut $40,000 on Oct 19.", url: "https://www.zillow.com/homedetails/614-Warrington-Ave-Redwood-City-CA-94063/15567265_zpid/" },
    { address: "327 Center St", price: 898000, beds: 2, baths: 1, sqft: 800, lot: "6,098 sqft lot", type: "House", days: 7, note: "", url: "https://www.zillow.com/homedetails/327-Center-St-Redwood-City-CA-94061/15566443_zpid/" },
    { address: "827 Chestnut St", price: 989000, beds: 2, baths: 1, sqft: 1160, lot: "5,020 sqft lot", type: "House", days: 19, note: "", url: "https://www.zillow.com/homedetails/827-Chestnut-St-Redwood-City-CA-94063/15566021_zpid/" },
    { address: "344 E St", price: 1198000, beds: 2, baths: 2, sqft: 820, lot: "5,100 sqft lot", type: "House", days: 5, note: "", url: "https://www.zillow.com/homedetails/344-E-St-Redwood-City-CA-94063/15563541_zpid/" },
    { address: "2 Laurel Way", price: 520000, beds: null, baths: null, sqft: null, lot: "8,633 sqft", type: "Land", days: 16, note: "Emerald Lake Hills lot, marketed as build-your-dream-home.", url: "https://www.zillow.com/homedetails/2-Laurel-Way-Redwood-City-CA-94062/466189081_zpid/" },
    { address: "Undisclosed address (Lot 80), 94062", price: 545000, beds: null, baths: null, sqft: null, lot: "9,100 sqft", type: "Land", days: 16, note: "Quiet cul-de-sac lot; price cut $304,000 on Nov 7.", url: "https://www.zillow.com/homedetails/Redwood-City-CA-94062/466189082_zpid/" },
  ],
  "Castro Valley": [
    { address: "2375 Vegas Ave", price: 828000, beds: 3, baths: 1, sqft: 1031, lot: "5,865 sqft lot", type: "House", days: 0, note: "Listed today.", url: "https://www.zillow.com/homedetails/2375-Vegas-Ave-Castro-Valley-CA-94546/24963451_zpid/" },
    { address: "18662 Stanton Ave", price: 899000, beds: 3, baths: 2, sqft: 1014, lot: "7,503 sqft lot", type: "House", days: 2, note: "Listed Nov 12.", url: "https://www.zillow.com/homedetails/18662-Stanton-Ave-Castro-Valley-CA-94546/24906144_zpid/" },
    { address: "3443 Middleton Ave", price: 879000, beds: 3, baths: 1, sqft: 1106, lot: "6,250 sqft lot", type: "House", days: 3, note: "", url: "https://www.zillow.com/homedetails/3443-Middleton-Ave-Castro-Valley-CA-94546/24911906_zpid/" },
    { address: "4848 Mancini Dr", price: 975000, beds: 3, baths: 2, sqft: 1311, lot: "5,762 sqft lot", type: "House", days: 7, note: "", url: "https://www.zillow.com/homedetails/4848-Mancini-Dr-Castro-Valley-CA-94546/24909933_zpid/" },
    { address: "3466 Arcadian Dr", price: 1198000, beds: 3, baths: 3, sqft: 1823, lot: "6,969 sqft lot", type: "House", days: 7, note: "New listing.", url: "https://www.zillow.com/homedetails/3466-Arcadian-Dr-Castro-Valley-CA-94546/24911459_zpid/" },
    { address: "6733 Sunnyslope Ave", price: 425000, beds: null, baths: null, sqft: null, lot: "0.49 acres", type: "Land", days: 86, note: "Fenced, sloped lot in the Sunnyslope Village subdivision.", url: "https://www.zillow.com/homedetails/6733-Sunnyslope-Ave-Castro-Valley-CA-94552/299077212_zpid/" },
    { address: "21479 Eden Canyon Rd", price: 699800, beds: null, baths: null, sqft: null, lot: "9.81 acres", type: "Land", days: 65, note: "Large canyon parcel with panoramic views.", url: "https://www.zillow.com/homedetails/21479-Eden-Canyon-Rd-Castro-Valley-CA-94552/440132289_zpid/" },
  ],
  "Hercules": [
    { address: "586 Dutch Elm Dr", price: 1160000, beds: 3, baths: 3, sqft: 2394, lot: "5,227 sqft lot", type: "House", days: 150, note: "", url: "https://www.zillow.com/homedetails/586-Dutch-Elm-Dr-Hercules-CA-94547/59399893_zpid/" },
    { address: "457 Violet Rd", price: 1099000, beds: 4, baths: 3, sqft: 2328, lot: "9,461 sqft lot", type: "House", days: 57, note: "", url: "https://www.zillow.com/homedetails/457-Violet-Rd-Hercules-CA-94547/18503524_zpid/" },
    { address: "151 Skelly", price: 950000, beds: 4, baths: 3, sqft: 2115, lot: "0.27-acre lot", type: "House", days: 9, note: "", url: "https://www.zillow.com/homedetails/151-Skelly-Hercules-CA-94547/18499308_zpid/" },
    { address: "1902 Shasta Ln", price: 983000, beds: 4, baths: 4, sqft: 2419, lot: "2,178 sqft lot", type: "House", days: 73, note: "", url: "https://www.zillow.com/homedetails/1902-Shasta-Ln-Hercules-CA-94547/241643169_zpid/" },
    { address: "650 Turquoise Dr", price: 939000, beds: 5, baths: 3, sqft: 2928, lot: "6,534 sqft lot", type: "House", days: 11, note: "", url: "https://www.zillow.com/homedetails/650-Turquoise-Dr-Hercules-CA-94547/18505113_zpid/" },
  ],
  "Dublin": [
    { address: "7597 Canterbury Ln", price: 1175000, beds: 3, baths: 2, sqft: 1544, lot: "7,405 sqft lot", type: "House", days: 39, note: "", url: "https://www.zillow.com/homedetails/7597-Canterbury-Ln-Dublin-CA-94568/25063737_zpid/" },
    { address: "6933 Cedar Ln", price: 1164999, beds: 3, baths: 2, sqft: 1592, lot: "5,399 sqft lot", type: "House", days: 37, note: "", url: "https://www.zillow.com/homedetails/6933-Cedar-Ln-Dublin-CA-94568/25065581_zpid/" },
    { address: "6963 Portage Rd", price: 1149000, beds: 4, baths: 2, sqft: 1592, lot: "6,012 sqft lot", type: "House", days: 24, note: "", url: "https://www.zillow.com/homedetails/6963-Portage-Rd-Dublin-CA-94568/25065768_zpid/" },
    { address: "8044 Tamarack Dr", price: 1150000, beds: 3, baths: 2, sqft: 1116, lot: "6,534 sqft lot", type: "House", days: 169, note: "", url: "https://www.zillow.com/homedetails/8044-Tamarack-Dr-Dublin-CA-94568/25063845_zpid/" },
    { address: "6861 Brighton Dr", price: 1199000, beds: 3, baths: 2, sqft: 1288, lot: "6,534 sqft lot", type: "House", days: 101, note: "", url: "https://www.zillow.com/homedetails/6861-Brighton-Dr-Dublin-CA-94568/25065000_zpid/" },
  ],
  "Martinez": [
    { address: "2214 Pacheco Blvd", price: 658500, beds: 3, baths: 2, sqft: 1316, lot: "3,920 sqft lot", type: "House", days: 6, note: "Price cut $1,400 on Nov 6.", url: "https://www.zillow.com/homedetails/2214-Pacheco-Blvd-Martinez-CA-94553/18490327_zpid/" },
    { address: "2295 S Crest Ave", price: 688000, beds: 3, baths: 3, sqft: 1484, lot: "8,485 sqft lot", type: "House", days: 82, note: "", url: "https://www.zillow.com/homedetails/2295-S-Crest-Ave-Martinez-CA-94553/18490561_zpid/" },
    { address: "80 Gilrix Dr", price: 879000, beds: 3, baths: 3, sqft: 1905, lot: "0.26-acre lot", type: "House", days: 6, note: "Price cut $20,000 on Nov 6.", url: "https://www.zillow.com/homedetails/80-Gilrix-Dr-Martinez-CA-94553/18492487_zpid/" },
    { address: "5636 Vineta Ct", price: 888000, beds: 3, baths: 2, sqft: 1570, lot: "6,969 sqft lot", type: "House", days: 7, note: "", url: "https://www.zillow.com/homedetails/5636-Vineta-Ct-Martinez-CA-94553/18487999_zpid/" },
    { address: "4209 Alhambra Way", price: 975000, beds: 4, baths: 3, sqft: 2259, lot: "10,454 sqft lot", type: "House", days: 28, note: "", url: "https://www.zillow.com/homedetails/4209-Alhambra-Way-Martinez-CA-94553/18492442_zpid/" },
    { address: "0 Palm Ave", price: 275000, beds: null, baths: null, sqft: null, lot: "2.66 acres", type: "Land", days: 8, note: "", url: "https://www.zillow.com/homedetails/0-Palm-Ave-Martinez-CA-94553/446403003_zpid/" },
    { address: "Warren St", price: 100000, beds: null, baths: null, sqft: null, lot: "7,873 sqft", type: "Land", days: 89, note: "", url: "https://www.zillow.com/homedetails/Warren-St-Martinez-CA-94553/249602261_zpid/" },
  ],
  "Petaluma": [
    { address: "128 Burlington Dr", price: 635000, beds: 3, baths: 2, sqft: 1400, lot: "6,298 sqft lot", type: "House", days: 48, note: "Price cut $15,000 on Oct 26.", url: "https://www.zillow.com/homedetails/128-Burlington-Dr-Petaluma-CA-94952/15752344_zpid/" },
    { address: "2032 Easton Dr", price: 678000, beds: 3, baths: 3, sqft: 1232, lot: "1,838 sqft lot", type: "House", days: 96, note: "Price cut $21,000 on Oct 15.", url: "https://www.zillow.com/homedetails/2032-Easton-Dr-Petaluma-CA-94952/54787487_zpid/" },
    { address: "901 Catalpa Way", price: 839000, beds: 4, baths: 3, sqft: 1924, lot: "7,801 sqft lot", type: "House", days: 104, note: "Price cut $21,000 on Sep 24.", url: "https://www.zillow.com/homedetails/901-Catalpa-Way-Petaluma-CA-94954/15748817_zpid/" },
    { address: "204 Sutter St", price: 850000, beds: 4, baths: 2, sqft: 1560, lot: "6,298 sqft lot", type: "House", days: 62, note: "", url: "https://www.zillow.com/homedetails/204-Sutter-St-Petaluma-CA-94954/15846759_zpid/" },
    { address: "1854 Heather Ln", price: 875000, beds: 3, baths: 2, sqft: 1508, lot: "5,728 sqft lot", type: "House", days: 9, note: "", url: "https://www.zillow.com/homedetails/1854-Heather-Ln-Petaluma-CA-94954/15836076_zpid/" },
    { address: "1170 I St", price: 500000, beds: null, baths: null, sqft: null, lot: "0.56 acres", type: "Land", days: 18, note: "", url: "https://www.zillow.com/homedetails/1170-I-St-Petaluma-CA-94952/96058853_zpid/" },
    { address: "4663 Hillsborough Dr", price: 775000, beds: null, baths: null, sqft: null, lot: "15.34 acres", type: "Land", days: 52, note: "", url: "https://www.zillow.com/homedetails/4663-Hillsborough-Dr-Petaluma-CA-94954/300264816_zpid/" },
  ],
  "Newark": [
    { address: "8220 Juniper Ave", price: 998000, beds: 3, baths: 2, sqft: 1080, lot: "6,359 sqft lot", type: "House", days: 0, note: "Newest listing; open house Nov 14-15.", url: "https://www.zillow.com/homedetails/8220-Juniper-Ave-Newark-CA-94560/24921666_zpid/" },
    { address: "6649 Mayhews Landing Rd", price: 1158000, beds: 2, baths: 2, sqft: 1167, lot: "8,712 sqft lot", type: "House", days: 4, note: "", url: "https://www.zillow.com/homedetails/6649-Mayhews-Landing-Rd-Newark-CA-94560/24923680_zpid/" },
    { address: "7880 Hazelnut Dr", price: 1169999, beds: 3, baths: 2, sqft: 1346, lot: "6,386 sqft lot", type: "House", days: 9, note: "Price cut $30,001 on Nov 5.", url: "https://www.zillow.com/homedetails/7880-Hazelnut-Dr-Newark-CA-94560/24922729_zpid/" },
    { address: "6435 Normandy Dr", price: 1099000, beds: 4, baths: 3, sqft: 2031, lot: "6,100 sqft lot", type: "House", days: 10, note: "Relisted Nov 3 at $1,099,000, down from $1,198,000 in May.", url: "https://www.zillow.com/homedetails/6435-Normandy-Dr-Newark-CA-94560/24924479_zpid/" },
    { address: "36173 Cedar Blvd", price: 999000, beds: 3, baths: 2, sqft: 1464, lot: "6,000 sqft lot", type: "House", days: 52, note: "Price cut $150,000 on Oct 16.", url: "https://www.zillow.com/homedetails/36173-Cedar-Blvd-Newark-CA-94560/24926200_zpid/" },
  ],
};

// Dashboard place names that are neighbourhoods of a Zillow search city.
export const PLACE_ALIASES = { "Contra Costa Centre": "Walnut Creek" };

export const PICKS_NOTE =
  "Pulled from live Zillow searches on Nov 7, 2026 with a $1.2M cap; every " +
  "pick was opened on its Zillow page and confirmed for sale at this price " +
  "that evening. Hercules, Dublin, Martinez and Petaluma picks were added " +
  "the same way on Nov 9. Newark, Castro Valley, San Mateo and Fremont " +
  "picks were refreshed the same way on Nov 10. Walnut Creek, San Jose, " +
  "Dublin and Hercules picks were refreshed the same way on Nov 11. San " +
  "Bruno, Redwood City, Martinez and Petaluma picks were refreshed the " +
  "same way on Nov 12. Milpitas, Newark, Castro Valley and San Mateo " +
  "picks were refreshed the same way on Nov 13. Listings change fast, so each address links straight to " +
  "the live Zillow listing. Each home also carries its own Home score: " +
  "50% the score of the tract the home actually sits in, 50% the home " +
  "itself (price vs the tract's typical value, fit, and freshness). " +
  "Expand a listing to see its breakdown. The property-type filter " +
  "applies to these picks; the ranking itself scores whole " +
  "neighborhoods across all types.";
