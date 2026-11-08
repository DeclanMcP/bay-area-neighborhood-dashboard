// Census tract for each Zillow pick, keyed by ZPID, from the Census
// Geocoder (scripts/geocode_picks.mjs, 2026-11-08).
// The listing scorer uses this to give each home its own tract's score.
// 30 of 35 picks matched. Unmatched: 1418 Lavender Loop (new-build
// street), 0 Parrott Dr, 21479 Eden Canyon Rd - the Census Geocoder
// has no match; 2 further picks have undisclosed addresses. Those five
// score without an area component (listing layer only, badged), rather
// than guessing a tract from the ZIP.
export const PICK_TRACTS = {
  "15488972": "06081604200",
  "15496375": "06081604104",
  "15496631": "06081604104",
  "15522187": "06081606201",
  "15541037": "06081608400",
  "15566021": "06081610201",
  "15566443": "06081610700",
  "15568572": "06081610400",
  "15630107": "06081607900",
  "18377486": "06013355302",
  "18407147": "06013340001",
  "18417927": "06013341000",
  "19472199": "06085504507",
  "19482966": "06085504416",
  "19723964": "06085504002",
  "19741369": "06085503212",
  "19828107": "06085512029",
  "24894405": "06001430600",
  "24905185": "06001430500",
  "24906652": "06001430600",
  "25040188": "06001442900",
  "25041104": "06001443001",
  "25044465": "06001442800",
  "95395286": "06013340004",
  "153466762": "06085504308",
  "299072505": "06001442200",
  "299077212": "06001430101",
  "448917472": "06085501200",
  "466142072": "06013338201",
  "466189081": "06081610700"
};
