// Map of country names to ISO 3166-1 alpha-2 codes
const countryToCode: { [key: string]: string } = {
  Afghanistan: "af",
  Albania: "al",
  Algeria: "dz",
  "American Samoa": "as",
  Andorra: "ad",
  Angola: "ao",
  "Antigua and Barbuda": "ag",
  Argentina: "ar",
  Armenia: "am",
  Australia: "au",
  Austria: "at",
  Azerbaijan: "az",
  Bahamas: "bs",
  Bahrain: "bh",
  Bangladesh: "bd",
  Barbados: "bb",
  Belarus: "by",
  Belgium: "be",
  Belize: "bz",
  Benin: "bj",
  Bhutan: "bt",
  Bolivia: "bo",
  "Bosnia and Herzegovina": "ba",
  Botswana: "bw",
  Brazil: "br",
  Brunei: "bn",
  Bulgaria: "bg",
  "Burkina Faso": "bf",
  Burundi: "bi",
  "Cabo Verde": "cv",
  Cambodia: "kh",
  Cameroon: "cm",
  Canada: "ca",
  "Central African Republic": "cf",
  Chad: "td",
  Chile: "cl",
  China: "cn",
  Colombia: "co",
  Comoros: "km",
  "Congo, Democratic Republic of the": "cd",
  "Congo, Republic of the": "cg",
  "Costa Rica": "cr",
  Croatia: "hr",
  Cuba: "cu",
  Cyprus: "cy",
  "Czech Republic": "cz",
  Dagestan: "ru", // Dagestan is part of Russia
  Denmark: "dk",
  Djibouti: "dj",
  Dominica: "dm",
  "Dominican Republic": "do",
  Ecuador: "ec",
  Egypt: "eg",
  "El Salvador": "sv",
  England: "gb-eng",
  "Equatorial Guinea": "gq",
  Eritrea: "er",
  Estonia: "ee",
  Eswatini: "sz",
  Ethiopia: "et",
  "Faroe Islands": "fo",
  Fiji: "fj",
  Finland: "fi",
  France: "fr",
  "French Polynesia": "pf",
  Gabon: "ga",
  Gambia: "gm",
  Georgia: "ge",
  Germany: "de",
  Ghana: "gh",
  Greece: "gr",
  Greenland: "gl",
  Grenada: "gd",
  Guam: "gu",
  Guatemala: "gt",
  Honduras: "hn",
  "Hong Kong": "hk",
  Hungary: "hu",
  Iceland: "is",
  India: "in",
  Indonesia: "id",
  Iran: "ir",
  Iraq: "iq",
  Ireland: "ie",
  Israel: "il",
  Italy: "it",
  Jamaica: "jm",
  Japan: "jp",
  Jordan: "jo",
  Kazakhstan: "kz",
  Kenya: "ke",
  Kiribati: "ki",
  "Korea, North": "kp",
  "Korea, South": "kr",
  Kosovo: "xk",
  Kuwait: "kw",
  Kyrgyzstan: "kg",
  Laos: "la",
  Latvia: "lv",
  Lebanon: "lb",
  Lesotho: "ls",
  Liberia: "lr",
  Libya: "ly",
  Liechtenstein: "li",
  Lithuania: "lt",
  Luxembourg: "lu",
  Macau: "mo",
  Madagascar: "mg",
  Malawi: "mw",
  Malaysia: "my",
  Maldives: "mv",
  Mali: "ml",
  Malta: "mt",
  "Marshall Islands": "mh",
  Mauritania: "mr",
  Mauritius: "mu",
  Mexico: "mx",
  Micronesia: "fm",
  Moldova: "md",
  Monaco: "mc",
  Mongolia: "mn",
  Montenegro: "me",
  Morocco: "ma",
  Mozambique: "mz",
  Myanmar: "mm",
  Namibia: "na",
  Nauru: "nr",
  Nepal: "np",
  Netherlands: "nl",
  "New Caledonia": "nc",
  "New Zealand": "nz",
  Nicaragua: "ni",
  Niger: "ne",
  Nigeria: "ng",
  "Northern Ireland": "gb-nir",
  "North Macedonia": "mk",
  Norway: "no",
  Oman: "om",
  Pakistan: "pk",
  Palau: "pw",
  Palestine: "ps",
  Panama: "pa",
  "Papua New Guinea": "pg",
  Paraguay: "py",
  Peru: "pe",
  Philippines: "ph",
  Poland: "pl",
  Portugal: "pt",
  "Puerto Rico": "pr",
  Qatar: "qa",
  Romania: "ro",
  Russia: "ru",
  Rwanda: "rw",
  "Saint Kitts and Nevis": "kn",
  "Saint Lucia": "lc",
  "Saint Vincent and the Grenadines": "vc",
  Samoa: "ws",
  "San Marino": "sm",
  "Sao Tome and Principe": "st",
  "Saudi Arabia": "sa",
  Scotland: "gb-sct",
  Senegal: "sn",
  Serbia: "rs",
  Seychelles: "sc",
  "Sierra Leone": "sl",
  Singapore: "sg",
  Slovakia: "sk",
  Slovenia: "si",
  "Solomon Islands": "sb",
  Somalia: "so",
  "South Africa": "za",
  "South Sudan": "ss",
  Spain: "es",
  "Sri Lanka": "lk",
  Sudan: "sd",
  Suriname: "sr",
  Sweden: "se",
  Switzerland: "ch",
  Syria: "sy",
  Taiwan: "tw",
  Tajikistan: "tj",
  Tanzania: "tz",
  Thailand: "th",
  "Timor-Leste": "tl",
  Togo: "tg",
  Tonga: "to",
  "Trinidad and Tobago": "tt",
  Tunisia: "tn",
  Turkey: "tr",
  Turkmenistan: "tm",
  Tuvalu: "tv",
  Uganda: "ug",
  Ukraine: "ua",
  "United Arab Emirates": "ae",
  "United States": "us",
  Uruguay: "uy",
  Uzbekistan: "uz",
  Vanuatu: "vu",
  "Vatican City": "va",
  Venezuela: "ve",
  Vietnam: "vn",
  Wales: "gb-wls",
  Yemen: "ye",
  Zambia: "zm",
  Zimbabwe: "zw",
  // Note: Tibet and Western Sahara don't have official ISO codes
  // Using commonly used alternatives
  Tibet: "xz", // Unofficial code
  "Western Sahara": "eh",
};

export function getCountryCode(countryName: string): string | undefined {
  return countryToCode[countryName];
}
