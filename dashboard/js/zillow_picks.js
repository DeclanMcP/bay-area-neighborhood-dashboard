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
// 2026-11-14 (morning PT). San Bruno, Redwood City, Martinez and
// Petaluma picks were refreshed the same way on 2026-11-15 (morning PT).
// Fremont, Castro Valley, San Mateo and Newark picks were refreshed the
// same way on 2026-11-16 (morning PT); 42650 Isle Royal St, Fremont
// went pending and was dropped. Milpitas, Dublin, San Jose and Hercules
// picks were refreshed the same way on 2026-11-17 (morning PT);
// 1306 Mount Shasta Ave, Milpitas went under contract and 650 Turquoise
// Dr, Hercules went pending, both dropped, and 2440 Poplar Dr, San Jose
// cut $80,000 on Nov 16. No house under $1.2M is currently for sale in
// Milpitas.
// Prices and availability
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
    { address: "264 Santa Inez Ave", price: 995000, beds: 3, baths: 1, sqft: 910, lot: "3,636 sqft lot", type: "House", days: 1, note: "Listed Nov 14; the only new San Bruno house under the cap.", url: "https://www.zillow.com/homedetails/264-Santa-Inez-Ave-San-Bruno-CA-94066/15500935_zpid/" },
    { address: "1094 Montgomery Ave", price: 849000, beds: 2, baths: 2, sqft: 1059, lot: "2,500 sqft lot", type: "House", days: 16, note: "", url: "https://www.zillow.com/homedetails/1094-Montgomery-Ave-San-Bruno-CA-94066/15488941_zpid/" },
    { address: "998 Hensley Ave", price: 1195000, beds: 5, baths: 3, sqft: 1913, lot: "2,499 sqft lot", type: "House", days: 10, note: "", url: "https://www.zillow.com/homedetails/998-Hensley-Ave-San-Bruno-CA-94066/15496375_zpid/" },
    { address: "698 Masson Ave", price: 1098000, beds: 3, baths: 2, sqft: 1530, lot: "2,499 sqft lot", type: "House", days: 39, note: "Price cut $90,000 on Nov 13.", url: "https://www.zillow.com/homedetails/698-Masson-Ave-San-Bruno-CA-94066/15496631_zpid/" },
    { address: "1055 San Mateo Ave", price: 1198000, beds: 5, baths: 3, sqft: 1500, lot: "5,000 sqft lot", type: "House", days: 53, note: "Price cut $97,000 on Oct 23.", url: "https://www.zillow.com/homedetails/1055-San-Mateo-Ave-San-Bruno-CA-94066/15488972_zpid/" },
  ],
  "Milpitas": [
    { address: "1418 Lavender Loop", price: 998000, beds: 3, baths: 3, sqft: 1631, lot: "1,294 sqft lot", type: "Townhouse", days: 30, note: "", url: "https://www.zillow.com/homedetails/1418-Lavender-Loop-Milpitas-CA-95035/300480687_zpid/" },
    { address: "180 Marylinn Dr", price: 995000, beds: 4, baths: 2, sqft: 1505, lot: "", type: "Condo", days: 4, note: "", url: "https://www.zillow.com/homedetails/180-Marylinn-Dr-Milpitas-CA-95035/19472199_zpid/" },
  ],
  "San Jose": [
    { address: "2440 Poplar Dr", price: 999950, beds: 4, baths: 2, sqft: 1516, lot: "5,500 sqft lot", type: "House", days: 115, note: "Price cut $80,000 on Nov 16.", url: "https://www.zillow.com/homedetails/2440-Poplar-Dr-San-Jose-CA-95122/19727282_zpid/" },
    { address: "2869 Corda Dr", price: 1199000, beds: 4, baths: 3, sqft: 1593, lot: "3,280 sqft lot", type: "House", days: 41, note: "", url: "https://www.zillow.com/homedetails/2869-Corda-Dr-San-Jose-CA-95122/19802503_zpid/" },
    { address: "376 Hull Ave", price: 1150000, beds: 3, baths: 2, sqft: 1484, lot: "6,072 sqft lot", type: "House", days: 3, note: "Willow Glen; listed Nov 14.", url: "https://www.zillow.com/homedetails/376-Hull-Ave-San-Jose-CA-95125/19578072_zpid/" },
    { address: "417 Vaughn Ave", price: 990000, beds: 3, baths: 1, sqft: 1095, lot: "3,998 sqft lot", type: "House", days: 4, note: "Listed Nov 13.", url: "https://www.zillow.com/homedetails/417-Vaughn-Ave-San-Jose-CA-95128/19585093_zpid/" },
    { address: "5710 Orchard Park Dr", price: 1198000, beds: 3, baths: 2, sqft: 1286, lot: "6,060 sqft lot", type: "House", days: 5, note: "Listed Nov 12.", url: "https://www.zillow.com/homedetails/5710-Orchard-Park-Dr-San-Jose-CA-95123/19829113_zpid/" },
    { address: "819 Boulder Dr", price: 288000, beds: null, baths: null, sqft: null, lot: "0.47 acres", type: "Land", days: 2, note: "Level residential lot, zoned R1B1, public sewer.", url: "https://www.zillow.com/homedetails/819-Boulder-Dr-San-Jose-CA-95132/153466762_zpid/" },
    { address: "915 E Julian St", price: 550000, beds: null, baths: null, sqft: null, lot: "4,356 sqft", type: "Land", days: 44, note: "Downtown infill lot; price cut $50,000 on Oct 8. Photos show a small existing florist building on the lot.", url: "https://www.zillow.com/homedetails/915-E-Julian-St-San-Jose-CA-95112/448917472_zpid/" },
  ],
  "Fremont": [
    { address: "36846 Niles Blvd", price: 1050000, beds: 3, baths: 2, sqft: 1700, lot: "5,350 sqft lot", type: "House", days: 26, note: "Fixer-upper opportunity.", url: "https://www.zillow.com/homedetails/36846-Niles-Blvd-Fremont-CA-94536/25016491_zpid/" },
    { address: "33866 Gannet Ter", price: 1020000, beds: 2, baths: 3, sqft: 1407, lot: "2,700 sqft lot", type: "House", days: 103, note: "Price cut $50,000 on Nov 5; $260/mo HOA.", url: "https://www.zillow.com/homedetails/33866-Gannet-Ter-Fremont-CA-94555/25056996_zpid/" },
    { address: "37062 Dutra Way", price: 850000, beds: 3, baths: 1, sqft: 1050, lot: "5,429 sqft lot", type: "House", days: 19, note: "Listed Nov 16.", url: "https://www.zillow.com/homedetails/37062-Dutra-Way-Fremont-CA-94536/25006001_zpid/" },
    { address: "37275 Dondero Way", price: 999888, beds: 3, baths: 2, sqft: 1143, lot: "5,429 sqft lot", type: "House", days: 38, note: "Listed Nov 16.", url: "https://www.zillow.com/homedetails/37275-Dondero-Way-Fremont-CA-94536/25006016_zpid/" },
    { address: "3864 Jamestown Rd", price: 1198000, beds: 3, baths: 2, sqft: 1112, lot: "5,310 sqft lot", type: "House", days: 33, note: "Listed Nov 16.", url: "https://www.zillow.com/homedetails/3864-Jamestown-Rd-Fremont-CA-94538/25041104_zpid/" },
    { address: "3279 Washington Blvd", price: 1199000, beds: null, baths: null, sqft: null, lot: "8,572 sqft", type: "Land", days: 164, note: "Level lot in Mission San Jose; cut from $1,300,000 in June.", url: "https://www.zillow.com/homedetails/3279-Washington-Blvd-Fremont-CA-94539/299072505_zpid/" },
    { address: "Undisclosed address, 94538", price: 199999, beds: null, baths: null, sqft: null, lot: "3,000 sqft", type: "Land", days: 58, note: "Undeveloped raw land, surveyed.", url: "https://www.zillow.com/homedetails/Fremont-CA-94538/444776316_zpid/" },
  ],
  "San Mateo": [
    { address: "221 N Delaware St", price: 1198000, beds: 3, baths: 2, sqft: 1070, lot: "6,038 sqft lot", type: "House", days: 31, note: "Extra-deep lot with two units; built 1907.", url: "https://www.zillow.com/homedetails/221-N-Delaware-St-San-Mateo-CA-94401/15522187_zpid/" },
    { address: "3419 La Selva St", price: 998000, beds: 2, baths: 2, sqft: 1190, lot: "1,612 sqft lot", type: "House", days: 51, note: "Listing page shows a $555/mo HOA; attached unit, townhouse-like.", url: "https://www.zillow.com/homedetails/3419-La-Selva-St-San-Mateo-CA-94403/15541037_zpid/" },
    { address: "927 Shoreline Dr", price: 1150000, beds: 3, baths: 2, sqft: 1570, lot: "", type: "Condo", days: 23, note: "Price cut $48,000 on Nov 4.", url: "https://www.zillow.com/homedetails/927-Shoreline-Dr-San-Mateo-CA-94404/15630107_zpid/" },
    { address: "0 Parrott Dr", price: 699000, beds: null, baths: null, sqft: null, lot: "0.92 acres", type: "Land", days: 283, note: "Residential lot, zoned R1-A. The only San Mateo lot under the cap.", url: "https://www.zillow.com/homedetails/0-Parrott-Dr-San-Mateo-CA-94402/460029256_zpid/" },
  ],
  "Redwood City": [
    { address: "614 Warrington Ave", price: 849000, beds: 2, baths: 2, sqft: 760, lot: "2,500 sqft lot", type: "House", days: 51, note: "Price cut $40,000 on Oct 19.", url: "https://www.zillow.com/homedetails/614-Warrington-Ave-Redwood-City-CA-94063/15567265_zpid/" },
    { address: "327 Center St", price: 898000, beds: 2, baths: 1, sqft: 800, lot: "6,098 sqft lot", type: "House", days: 7, note: "", url: "https://www.zillow.com/homedetails/327-Center-St-Redwood-City-CA-94061/15566443_zpid/" },
    { address: "827 Chestnut St", price: 989000, beds: 2, baths: 1, sqft: 1160, lot: "5,020 sqft lot", type: "House", days: 22, note: "", url: "https://www.zillow.com/homedetails/827-Chestnut-St-Redwood-City-CA-94063/15566021_zpid/" },
    { address: "344 E St", price: 1198000, beds: 2, baths: 2, sqft: 820, lot: "5,100 sqft lot", type: "House", days: 8, note: "", url: "https://www.zillow.com/homedetails/344-E-St-Redwood-City-CA-94063/15563541_zpid/" },
    { address: "Undisclosed address, 94063", price: 899000, beds: 2, baths: 1, sqft: 660, lot: "5,497 sqft lot", type: "House", days: 3, note: "Listed Nov 11; street address not disclosed on Zillow (investor/developer listing, built 1924).", url: "https://www.zillow.com/homedetails/Redwood-City-CA-94063/15564551_zpid/" },
    { address: "424 5th Ave", price: 875000, beds: 2, baths: 1, sqft: 1000, lot: "2,999 sqft lot", type: "House", days: 72, note: "Price cut $25,000 on Nov 14.", url: "https://www.zillow.com/homedetails/424-5th-Ave-Redwood-City-CA-94063/15578984_zpid/" },
    { address: "2 Laurel Way", price: 520000, beds: null, baths: null, sqft: null, lot: "8,633 sqft", type: "Land", days: 16, note: "Emerald Lake Hills lot, marketed as build-your-dream-home.", url: "https://www.zillow.com/homedetails/2-Laurel-Way-Redwood-City-CA-94062/466189081_zpid/" },
    { address: "Undisclosed address (Lot 80), 94062", price: 545000, beds: null, baths: null, sqft: null, lot: "9,100 sqft", type: "Land", days: 16, note: "Quiet cul-de-sac lot; price cut $304,000 on Nov 7.", url: "https://www.zillow.com/homedetails/Redwood-City-CA-94062/466189082_zpid/" },
  ],
  "Castro Valley": [
    { address: "2375 Vegas Ave", price: 828000, beds: 3, baths: 1, sqft: 1031, lot: "5,865 sqft lot", type: "House", days: 3, note: "Listed Nov 14.", url: "https://www.zillow.com/homedetails/2375-Vegas-Ave-Castro-Valley-CA-94546/24963451_zpid/" },
    { address: "18662 Stanton Ave", price: 899000, beds: 3, baths: 2, sqft: 1014, lot: "7,503 sqft lot", type: "House", days: 5, note: "Listed Nov 12.", url: "https://www.zillow.com/homedetails/18662-Stanton-Ave-Castro-Valley-CA-94546/24906144_zpid/" },
    { address: "3443 Middleton Ave", price: 879000, beds: 3, baths: 1, sqft: 1106, lot: "6,250 sqft lot", type: "House", days: 6, note: "", url: "https://www.zillow.com/homedetails/3443-Middleton-Ave-Castro-Valley-CA-94546/24911906_zpid/" },
    { address: "4848 Mancini Dr", price: 975000, beds: 3, baths: 2, sqft: 1311, lot: "5,762 sqft lot", type: "House", days: 10, note: "", url: "https://www.zillow.com/homedetails/4848-Mancini-Dr-Castro-Valley-CA-94546/24909933_zpid/" },
    { address: "20114 Normandy Ct", price: 850000, beds: 2, baths: 2, sqft: 1194, lot: "4,680 sqft lot", type: "House", days: null, note: "Listed Nov 16; days on Zillow not shown.", url: "https://www.zillow.com/homedetails/20114-Normandy-Ct-Castro-Valley-CA-94546/24908121_zpid/" },
    { address: "6733 Sunnyslope Ave", price: 425000, beds: null, baths: null, sqft: null, lot: "0.49 acres", type: "Land", days: 86, note: "Fenced, sloped lot in the Sunnyslope Village subdivision.", url: "https://www.zillow.com/homedetails/6733-Sunnyslope-Ave-Castro-Valley-CA-94552/299077212_zpid/" },
    { address: "21479 Eden Canyon Rd", price: 699800, beds: null, baths: null, sqft: null, lot: "9.81 acres", type: "Land", days: 65, note: "Large canyon parcel with panoramic views.", url: "https://www.zillow.com/homedetails/21479-Eden-Canyon-Rd-Castro-Valley-CA-94552/440132289_zpid/" },
  ],
  "Hercules": [
    { address: "586 Dutch Elm Dr", price: 1160000, beds: 3, baths: 3, sqft: 2394, lot: "5,227 sqft lot", type: "House", days: 153, note: "", url: "https://www.zillow.com/homedetails/586-Dutch-Elm-Dr-Hercules-CA-94547/59399893_zpid/" },
    { address: "457 Violet Rd", price: 1099000, beds: 4, baths: 3, sqft: 2328, lot: "9,461 sqft lot", type: "House", days: 60, note: "", url: "https://www.zillow.com/homedetails/457-Violet-Rd-Hercules-CA-94547/18503524_zpid/" },
    { address: "151 Skelly", price: 950000, beds: 4, baths: 3, sqft: 2115, lot: "0.27-acre lot", type: "House", days: 12, note: "", url: "https://www.zillow.com/homedetails/151-Skelly-Hercules-CA-94547/18499308_zpid/" },
    { address: "1902 Shasta Ln", price: 983000, beds: 4, baths: 4, sqft: 2419, lot: "2,178 sqft lot", type: "House", days: 76, note: "Price cut $15,000 on Oct 6.", url: "https://www.zillow.com/homedetails/1902-Shasta-Ln-Hercules-CA-94547/241643169_zpid/" },
    { address: "301 Violet Rd", price: 849000, beds: 4, baths: 3, sqft: 2326, lot: "8,000 sqft lot", type: "House", days: 7, note: "Listed Nov 10; offers due noon Nov 17.", url: "https://www.zillow.com/homedetails/301-Violet-Rd-Hercules-CA-94547/18503296_zpid/" },
  ],
  "Dublin": [
    { address: "7597 Canterbury Ln", price: 1175000, beds: 3, baths: 2, sqft: 1544, lot: "7,405 sqft lot", type: "House", days: 42, note: "", url: "https://www.zillow.com/homedetails/7597-Canterbury-Ln-Dublin-CA-94568/25063737_zpid/" },
    { address: "6933 Cedar Ln", price: 1164999, beds: 3, baths: 2, sqft: 1592, lot: "5,399 sqft lot", type: "House", days: 40, note: "Price cut $84,001 on Oct 20.", url: "https://www.zillow.com/homedetails/6933-Cedar-Ln-Dublin-CA-94568/25065581_zpid/" },
    { address: "6963 Portage Rd", price: 1149000, beds: 4, baths: 2, sqft: 1592, lot: "6,012 sqft lot", type: "House", days: 27, note: "", url: "https://www.zillow.com/homedetails/6963-Portage-Rd-Dublin-CA-94568/25065768_zpid/" },
    { address: "6830 Amador Valley Blvd", price: 999998, beds: 3, baths: 2, sqft: 1276, lot: "5,265 sqft lot", type: "House", days: 4, note: "Listed Nov 13.", url: "https://www.zillow.com/homedetails/6830-Amador-Valley-Blvd-Dublin-CA-94568/25065334_zpid/" },
    { address: "8398 Cypress Ct", price: 1068000, beds: 4, baths: 2, sqft: 1440, lot: "5,013 sqft lot", type: "House", days: 11, note: "Listed Nov 6.", url: "https://www.zillow.com/homedetails/8398-Cypress-Ct-Dublin-CA-94568/25069583_zpid/" },
  ],
  "Martinez": [
    { address: "2214 Pacheco Blvd", price: 658500, beds: 3, baths: 2, sqft: 1316, lot: "3,920 sqft lot", type: "House", days: 9, note: "Price cut $1,400 on Nov 6.", url: "https://www.zillow.com/homedetails/2214-Pacheco-Blvd-Martinez-CA-94553/18490327_zpid/" },
    { address: "100 Silva Ct", price: 975000, beds: 4, baths: 3, sqft: 2526, lot: "8,712 sqft lot", type: "House", days: 1, note: "Listed Nov 14.", url: "https://www.zillow.com/homedetails/100-Silva-Ct-Martinez-CA-94553/89029427_zpid/" },
    { address: "1040 Veale Ave", price: 650000, beds: 2, baths: 1, sqft: 1066, lot: "4,791 sqft lot", type: "House", days: 2, note: "Listed Nov 13.", url: "https://www.zillow.com/homedetails/1040-Veale-Ave-Martinez-CA-94553/18491499_zpid/" },
    { address: "132 Sundance Pl", price: 799000, beds: 4, baths: 3, sqft: 1667, lot: "3,049 sqft lot", type: "House", days: 2, note: "Listed Nov 13.", url: "https://www.zillow.com/homedetails/132-Sundance-Pl-Martinez-CA-94553/54627142_zpid/" },
    { address: "80 Gilrix Dr", price: 879000, beds: 3, baths: 3, sqft: 1905, lot: "0.26-acre lot", type: "House", days: 9, note: "Price cut $20,000 on Nov 6.", url: "https://www.zillow.com/homedetails/80-Gilrix-Dr-Martinez-CA-94553/18492487_zpid/" },
    { address: "0 Palm Ave", price: 275000, beds: null, baths: null, sqft: null, lot: "2.66 acres", type: "Land", days: 8, note: "", url: "https://www.zillow.com/homedetails/0-Palm-Ave-Martinez-CA-94553/446403003_zpid/" },
    { address: "Warren St", price: 100000, beds: null, baths: null, sqft: null, lot: "7,873 sqft", type: "Land", days: 89, note: "", url: "https://www.zillow.com/homedetails/Warren-St-Martinez-CA-94553/249602261_zpid/" },
  ],
  "Petaluma": [
    { address: "128 Burlington Dr", price: 635000, beds: 3, baths: 2, sqft: 1400, lot: "6,298 sqft lot", type: "House", days: 51, note: "Price cut $15,000 on Oct 26.", url: "https://www.zillow.com/homedetails/128-Burlington-Dr-Petaluma-CA-94952/15752344_zpid/" },
    { address: "2032 Easton Dr", price: 678000, beds: 3, baths: 3, sqft: 1232, lot: "1,838 sqft lot", type: "House", days: 99, note: "Price cut $21,000 on Oct 15.", url: "https://www.zillow.com/homedetails/2032-Easton-Dr-Petaluma-CA-94952/54787487_zpid/" },
    { address: "1904 Pico St", price: 1050000, beds: 4, baths: 3, sqft: 2661, lot: "3,571 sqft lot", type: "House", days: 1, note: "Listed Nov 14.", url: "https://www.zillow.com/homedetails/1904-Pico-St-Petaluma-CA-94952/337915333_zpid/" },
    { address: "1818 Hartman Ln", price: 865000, beds: 3, baths: 2, sqft: 1508, lot: "5,401 sqft lot", type: "House", days: 1, note: "Listed Nov 14.", url: "https://www.zillow.com/homedetails/1818-Hartman-Ln-Petaluma-CA-94954/15836482_zpid/" },
    { address: "612 English St", price: 999000, beds: 2, baths: 1, sqft: 1165, lot: "5,549 sqft lot", type: "House", days: 5, note: "Listed Nov 10.", url: "https://www.zillow.com/homedetails/612-English-St-Petaluma-CA-94952/15753715_zpid/" },
    { address: "1170 I St", price: 500000, beds: null, baths: null, sqft: null, lot: "0.56 acres", type: "Land", days: 18, note: "", url: "https://www.zillow.com/homedetails/1170-I-St-Petaluma-CA-94952/96058853_zpid/" },
    { address: "4663 Hillsborough Dr", price: 775000, beds: null, baths: null, sqft: null, lot: "15.34 acres", type: "Land", days: 52, note: "", url: "https://www.zillow.com/homedetails/4663-Hillsborough-Dr-Petaluma-CA-94954/300264816_zpid/" },
  ],
  "Newark": [
    { address: "8220 Juniper Ave", price: 998000, beds: 3, baths: 2, sqft: 1080, lot: "6,359 sqft lot", type: "House", days: null, note: "Days on Zillow not shown on Nov 16 check; still active.", url: "https://www.zillow.com/homedetails/8220-Juniper-Ave-Newark-CA-94560/24921666_zpid/" },
    { address: "6649 Mayhews Landing Rd", price: 1158000, beds: 2, baths: 2, sqft: 1167, lot: "8,712 sqft lot", type: "House", days: 7, note: "", url: "https://www.zillow.com/homedetails/6649-Mayhews-Landing-Rd-Newark-CA-94560/24923680_zpid/" },
    { address: "7880 Hazelnut Dr", price: 1169999, beds: 3, baths: 2, sqft: 1346, lot: "6,386 sqft lot", type: "House", days: 12, note: "Price cut $30,001 on Nov 5.", url: "https://www.zillow.com/homedetails/7880-Hazelnut-Dr-Newark-CA-94560/24922729_zpid/" },
    { address: "6435 Normandy Dr", price: 1099000, beds: 4, baths: 3, sqft: 2031, lot: "6,100 sqft lot", type: "House", days: 13, note: "Relisted Nov 3 at $1,099,000, down from $1,198,000 in May.", url: "https://www.zillow.com/homedetails/6435-Normandy-Dr-Newark-CA-94560/24924479_zpid/" },
    { address: "35564 Biscay Pl", price: 1199000, beds: 4, baths: 2, sqft: 1450, lot: "7,392 sqft lot", type: "House", days: 28, note: "Listed Nov 16.", url: "https://www.zillow.com/homedetails/35564-Biscay-Pl-Newark-CA-94560/24924214_zpid/" },
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
  "picks were refreshed the same way on Nov 13. Walnut Creek, San Jose, " +
  "Dublin and Hercules picks were refreshed the same way on Nov 14. San " +
  "Bruno, Redwood City, Martinez and Petaluma picks were refreshed the " +
  "same way on Nov 15. Fremont, Castro Valley, San Mateo and Newark " +
  "picks were refreshed the same way on Nov 16. Milpitas, Dublin, San " +
  "Jose and Hercules picks were refreshed the same way on Nov 17; 1306 " +
  "Mount Shasta Ave, Milpitas went under contract and 650 Turquoise Dr, " +
  "Hercules went pending, both dropped, and 2440 Poplar Dr, San Jose " +
  "cut $80,000 on Nov 16. Listings change fast, so each address links straight to " +
  "the live Zillow listing. Each home also carries its own Home score: " +
  "50% the score of the tract the home actually sits in, 50% the home " +
  "itself (price vs the tract's typical value, fit, and freshness). " +
  "Expand a listing to see its breakdown. The property-type filter " +
  "applies to these picks; the ranking itself scores whole " +
  "neighborhoods across all types.";
