import { State, City } from "country-state-city";

export const CITY_FAMOUS_AREAS: Record<string, string[]> = {
  // Rajasthan
  "Jaipur": ["C-Scheme", "Malviya Nagar", "Mansarovar", "Vaishali Nagar", "MI Road", "Tonk Road", "Raja Park", "Jagatpura", "Bani Park", "Vidyadhar Nagar"],
  "Jodhpur": ["Shastri Nagar", "Ratanada", "Residency Road", "Pal Road", "Chopasni Housing Board", "Paota"],
  "Udaipur": ["Hiran Magri", "Sukher Industrial Area", "Panchwati", "Shobhagpura", "Fatehpura", "Madan Mohan Malviya Marg"],
  "Kota": ["Vigyan Nagar", "Talwandi", "Rajeev Gandhi Nagar", "Indraprastha Industrial Area", "Kotri Road"],
  "Ajmer": ["Panchsheel Nagar", "Vaishali Nagar", "Civil Lines", "Makarwali Road"],
  "Bikaner": ["Karni Industrial Area", "Jayanarayan Vyas Nagar", "Rani Bazar", "Sadul Ganj"],
  "Alwar": ["MIA Industrial Area", "Neemrana Tech Zone", "Bhiwadi Industrial Belt", "Vijay Nagar"],

  // Haryana & NCR
  "Gurugram": ["DLF Cyber City", "Golf Course Road", "Golf Course Extension", "Sector 44", "Sector 32 Institutional Area", "Udyog Vihar Phase 1-5", "Sohna Road", "MG Road"],
  "Faridabad": ["Mathura Road Industrial Area", "Sector 15", "Sector 16", "NH-5 NIT", "Surajkund Road"],
  "Panipat": ["Industrial Area Sector 25", "GT Road", "Model Town", "Gharaunda Hub"],
  "Ambala": ["Ambala Cantt Commercial Hub", "Model Town", "Cloth Market Zone"],

  // Delhi NCR
  "New Delhi": ["Connaught Place", "Barakhamba Road", "Nehru Place", "Bhikaji Cama Place", "Rajendra Place", "Jasola District Centre", "Saket District Centre", "Aerocity"],
  "Noida": ["Sector 62 IT Hub", "Sector 16 Film City", "Sector 125 Tech Park", "Sector 132 Express Trade Tower", "Sector 18 Commercial Hub", "Sector 63"],
  "Greater Noida": ["Knowledge Park 1-3", "Tech Zone 4", "Omega 1 Industrial Area", "Pari Chowk"],
  "Ghaziabad": ["Kaushambi Tech Zone", "Vaishali Sector 4", "Indirapuram Industrial Area", "Raj Nagar District Centre"],

  // Karnataka
  "Bengaluru": ["Indiranagar", "Koramangala", "HSR Layout", "MG Road / Brigade Road", "Whitefield ITPL", "Electronic City Phase 1 & 2", "Outer Ring Road (Marathahalli-Bellandur)", "Manyata Tech Park", "Hebbal", "JP Nagar"],
  "Mysuru": ["Hebbal Industrial Area", "Vijayanagar", "Gokulam", "KRS Road Tech Zone"],
  "Hubballi": ["IT Park Navanagar", "Railway Junction Suite", "Deshpande Nagar", "Gokul Road", "Vidyanagar"],
  "Mangaluru": ["Kottara Chowki", "Kadri Hills", "Mall Road", "Kodialbail", "Hampankatta"],

  // Maharashtra
  "Mumbai": ["BKC (Bandra Kurla Complex)", "Lower Parel (Kamala Mills)", "Andheri East (MIDC & JB Nagar)", "Powai (Hiranandani Business Park)", "Nariman Point", "Malad West (Mindspace)", "Worli Commercial Hub", "Vikhroli West"],
  "Navi Mumbai": ["Vashi Sector 17", "Belapur CBD", "Airoli Mindspace", "Mahape Millennium Business Park"],
  "Thane": ["Wagle Estate Industrial Area", "Ghodbunder Road Tech Park", "Thane West Thane One"],
  "Pune": ["Hinjewadi Phase 1-3", "Viman Nagar", "Kharadi EON Free Zone", "Baner Road", "Aundh", "SB Road", "Hadapsar Magarpatta City", "Bhosari MIDC"],

  // Telangana
  "Hyderabad": ["HITEC City", "Gachibowli", "Madhapur", "Kondapur", "Banjara Hills", "Jubilee Hills", "Financial District Nanakramguda", "Kukatpally", "Begumpet"],

  // Tamil Nadu
  "Chennai": ["OMR (Old Mahabalipuram Road)", "Guindy Industrial Estate", "T. Nagar", "Nungambakkam", "Mount Road (Anna Salai)", "Porur DLF IT Park", "Perungudi", "Ambattur Industrial Estate"],
  "Coimbatore": ["TIDEL Park Peelamedu", "RS Puram", "Avinashi Road", "Gandhipuram"],

  // West Bengal
  "Kolkata": ["Salt Lake Sector V", "Rajarhat New Town", "Park Street", "Camac Street", "Dalhousie BBD Bagh", "EM Bypass Commercial Corridor"],

  // Uttar Pradesh
  "Lucknow": ["Vibhuti Khand Gomti Nagar", "Hazratganj", "Aliganj Commercial Complex", "Transport Nagar"],
  "Kanpur": ["Civil Lines", "Swaroop Nagar", "Panki Industrial Area", "Mall Road"],

  // Gujarat
  "Ahmedabad": ["SG Highway", "Prahlad Nagar", "CG Road", "Bodakdev", "GIFT City Gandhinagar Corridor", "Ashram Road"],
  "Surat": ["Ring Road Textile Hub", "Vesu", "Ghod Dod Road", "Hazira Industrial Belt"],
  "Vadodara": ["Alkapuri", "Race Course Road", "Makarpura MIDC", "Gotri Road"],

  // Punjab & Chandigarh
  "Chandigarh": ["Sector 17 Commercial Complex", "Industrial Area Phase 1 & 2", "IT Park Kishangarh"],
  "Mohali (SAS Nagar)": ["Sector 67 IT City", "Phase 8 Industrial Area", "Quark Atrium Zone"],
  "Ludhiana": ["Ferozepur Road", "Focal Point Industrial Area", "Model Town"]
};

// Country ISO Code for India is "IN"
export const getIndianStates = () => {
  return State.getStatesOfCountry("IN").map((s) => s.name);
};

export const getCitiesOfState = (stateName: string) => {
  const states = State.getStatesOfCountry("IN");
  const stateObj = states.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
  if (!stateObj) return [];
  const cities = City.getCitiesOfState("IN", stateObj.isoCode);
  return cities.map((c) => c.name);
};

export const getAreasOfCity = (cityName: string): string[] => {
  const match = Object.keys(CITY_FAMOUS_AREAS).find((c) => c.toLowerCase() === cityName.toLowerCase());
  if (match && CITY_FAMOUS_AREAS[match].length > 0) {
    return CITY_FAMOUS_AREAS[match];
  }
  // Standard corporate/commercial locality suggestions if city specific mapping is custom
  return [
    `Central Business District (${cityName})`,
    `IT Park & Tech Zone`,
    `Commercial Belt Sector 1`,
    `Industrial Area Phase 1`,
    `Main Station Corridor`,
    `Financial Hub (${cityName})`
  ];
};


