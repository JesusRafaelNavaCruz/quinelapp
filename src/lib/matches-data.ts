import type { Match } from "@/types";

// FIFA World Cup 2026 — calendario completo
// 48 equipos · 12 grupos de 4 · 104 partidos en total
// Sede: México, Estados Unidos, Canadá · Jun 11 – Jul 19, 2026
export const WORLD_CUP_2026_MATCHES: Omit<Match, "homeScore" | "awayScore">[] = [

  // ─── Grupo A: México · Sudáfrica · Corea del Sur · Rep. Checa ───────────────
  { id: "m001", homeTeam: "México",        awayTeam: "Sudáfrica",    homeCode: "mx",     awayCode: "za",    date: 1781204400000, phase: "grupos", group: "A", status: "upcoming" },
  { id: "m002", homeTeam: "Corea del Sur", awayTeam: "Rep. Checa",   homeCode: "kr",     awayCode: "cz",    date: 1781229600000, phase: "grupos", group: "A", status: "upcoming" },
  { id: "m025", homeTeam: "Rep. Checa",    awayTeam: "Sudáfrica",    homeCode: "cz",     awayCode: "za",    date: 1781794800000, phase: "grupos", group: "A", status: "upcoming" },
  { id: "m028", homeTeam: "México",        awayTeam: "Corea del Sur",homeCode: "mx",     awayCode: "kr",    date: 1781827200000, phase: "grupos", group: "A", status: "upcoming" },
  { id: "m053", homeTeam: "Sudáfrica",     awayTeam: "Corea del Sur",homeCode: "za",     awayCode: "kr",    date: 1782345600000, phase: "grupos", group: "A", status: "upcoming" },
  { id: "m054", homeTeam: "Rep. Checa",    awayTeam: "México",       homeCode: "cz",     awayCode: "mx",    date: 1782345600000, phase: "grupos", group: "A", status: "upcoming" },

  // ─── Grupo B: Canadá · Bosnia y H. · Qatar · Suiza ─────────────────────────
  { id: "m003", homeTeam: "Canadá",        awayTeam: "Bosnia y H.",  homeCode: "ca",     awayCode: "ba",    date: 1781290800000, phase: "grupos", group: "B", status: "upcoming" },
  { id: "m005", homeTeam: "Qatar",         awayTeam: "Suiza",        homeCode: "qa",     awayCode: "ch",    date: 1781377200000, phase: "grupos", group: "B", status: "upcoming" },
  { id: "m026", homeTeam: "Suiza",         awayTeam: "Bosnia y H.",  homeCode: "ch",     awayCode: "ba",    date: 1781805600000, phase: "grupos", group: "B", status: "upcoming" },
  { id: "m027", homeTeam: "Canadá",        awayTeam: "Qatar",        homeCode: "ca",     awayCode: "qa",    date: 1781816400000, phase: "grupos", group: "B", status: "upcoming" },
  { id: "m049", homeTeam: "Bosnia y H.",   awayTeam: "Qatar",        homeCode: "ba",     awayCode: "qa",    date: 1782324000000, phase: "grupos", group: "B", status: "upcoming" },
  { id: "m050", homeTeam: "Suiza",         awayTeam: "Canadá",       homeCode: "ch",     awayCode: "ca",    date: 1782324000000, phase: "grupos", group: "B", status: "upcoming" },

  // ─── Grupo C: Brasil · Marruecos · Haití · Escocia ─────────────────────────
  { id: "m006", homeTeam: "Brasil",        awayTeam: "Marruecos",    homeCode: "br",     awayCode: "ma",    date: 1781388000000, phase: "grupos", group: "C", status: "upcoming" },
  { id: "m007", homeTeam: "Haití",         awayTeam: "Escocia",      homeCode: "ht",     awayCode: "gb-sct",date: 1781398800000, phase: "grupos", group: "C", status: "upcoming" },
  { id: "m030", homeTeam: "Escocia",       awayTeam: "Marruecos",    homeCode: "gb-sct", awayCode: "ma",    date: 1781906400000, phase: "grupos", group: "C", status: "upcoming" },
  { id: "m031", homeTeam: "Brasil",        awayTeam: "Haití",        homeCode: "br",     awayCode: "ht",    date: 1781915400000, phase: "grupos", group: "C", status: "upcoming" },
  { id: "m051", homeTeam: "Escocia",       awayTeam: "Brasil",       homeCode: "gb-sct", awayCode: "br",    date: 1782334800000, phase: "grupos", group: "C", status: "upcoming" },
  { id: "m052", homeTeam: "Marruecos",     awayTeam: "Haití",        homeCode: "ma",     awayCode: "ht",    date: 1782334800000, phase: "grupos", group: "C", status: "upcoming" },

  // ─── Grupo D: EE. UU. · Paraguay · Australia · Turquía ─────────────────────
  { id: "m004", homeTeam: "EE. UU.",       awayTeam: "Paraguay",     homeCode: "us",     awayCode: "py",    date: 1781312400000, phase: "grupos", group: "D", status: "upcoming" },
  { id: "m008", homeTeam: "Australia",     awayTeam: "Turquía",      homeCode: "au",     awayCode: "tr",    date: 1781409600000, phase: "grupos", group: "D", status: "upcoming" },
  { id: "m029", homeTeam: "EE. UU.",       awayTeam: "Australia",    homeCode: "us",     awayCode: "au",    date: 1781895600000, phase: "grupos", group: "D", status: "upcoming" },
  { id: "m032", homeTeam: "Turquía",       awayTeam: "Paraguay",     homeCode: "tr",     awayCode: "py",    date: 1781924400000, phase: "grupos", group: "D", status: "upcoming" },
  { id: "m059", homeTeam: "Turquía",       awayTeam: "EE. UU.",      homeCode: "tr",     awayCode: "us",    date: 1782435600000, phase: "grupos", group: "D", status: "upcoming" },
  { id: "m060", homeTeam: "Paraguay",      awayTeam: "Australia",    homeCode: "py",     awayCode: "au",    date: 1782435600000, phase: "grupos", group: "D", status: "upcoming" },

  // ─── Grupo E: Alemania · Curazao · Costa de Marfil · Ecuador ───────────────
  { id: "m009", homeTeam: "Alemania",      awayTeam: "Curazao",         homeCode: "de", awayCode: "cw",    date: 1781454000000, phase: "grupos", group: "E", status: "upcoming" },
  { id: "m011", homeTeam: "Costa de Marfil", awayTeam: "Ecuador",       homeCode: "ci", awayCode: "ec",    date: 1781475600000, phase: "grupos", group: "E", status: "upcoming" },
  { id: "m034", homeTeam: "Alemania",      awayTeam: "Costa de Marfil", homeCode: "de", awayCode: "ci",    date: 1781982000000, phase: "grupos", group: "E", status: "upcoming" },
  { id: "m035", homeTeam: "Ecuador",       awayTeam: "Curazao",         homeCode: "ec", awayCode: "cw",    date: 1781996400000, phase: "grupos", group: "E", status: "upcoming" },
  { id: "m055", homeTeam: "Ecuador",       awayTeam: "Alemania",        homeCode: "ec", awayCode: "de",    date: 1782414000000, phase: "grupos", group: "E", status: "upcoming" },
  { id: "m056", homeTeam: "Curazao",       awayTeam: "Costa de Marfil", homeCode: "cw", awayCode: "ci",    date: 1782414000000, phase: "grupos", group: "E", status: "upcoming" },

  // ─── Grupo F: Países Bajos · Japón · Suecia · Túnez ────────────────────────
  { id: "m010", homeTeam: "Países Bajos",  awayTeam: "Japón",        homeCode: "nl",     awayCode: "jp",    date: 1781464800000, phase: "grupos", group: "F", status: "upcoming" },
  { id: "m012", homeTeam: "Suecia",        awayTeam: "Túnez",        homeCode: "se",     awayCode: "tn",    date: 1781486400000, phase: "grupos", group: "F", status: "upcoming" },
  { id: "m033", homeTeam: "Países Bajos",  awayTeam: "Suecia",       homeCode: "nl",     awayCode: "se",    date: 1781971200000, phase: "grupos", group: "F", status: "upcoming" },
  { id: "m036", homeTeam: "Túnez",         awayTeam: "Japón",        homeCode: "tn",     awayCode: "jp",    date: 1782010800000, phase: "grupos", group: "F", status: "upcoming" },
  { id: "m057", homeTeam: "Japón",         awayTeam: "Suecia",       homeCode: "jp",     awayCode: "se",    date: 1782424800000, phase: "grupos", group: "F", status: "upcoming" },
  { id: "m058", homeTeam: "Túnez",         awayTeam: "Países Bajos", homeCode: "tn",     awayCode: "nl",    date: 1782424800000, phase: "grupos", group: "F", status: "upcoming" },

  // ─── Grupo G: Bélgica · Egipto · Irán · Nueva Zelanda ──────────────────────
  { id: "m014", homeTeam: "Bélgica",       awayTeam: "Egipto",       homeCode: "be",     awayCode: "eg",    date: 1781547600000, phase: "grupos", group: "G", status: "upcoming" },
  { id: "m016", homeTeam: "Irán",          awayTeam: "Nueva Zelanda",homeCode: "ir",     awayCode: "nz",    date: 1781569200000, phase: "grupos", group: "G", status: "upcoming" },
  { id: "m038", homeTeam: "Bélgica",       awayTeam: "Irán",         homeCode: "be",     awayCode: "ir",    date: 1782064800000, phase: "grupos", group: "G", status: "upcoming" },
  { id: "m040", homeTeam: "Nueva Zelanda", awayTeam: "Egipto",       homeCode: "nz",     awayCode: "eg",    date: 1782086400000, phase: "grupos", group: "G", status: "upcoming" },
  { id: "m065", homeTeam: "Nueva Zelanda", awayTeam: "Bélgica",      homeCode: "nz",     awayCode: "be",    date: 1782538800000, phase: "grupos", group: "G", status: "upcoming" },
  { id: "m066", homeTeam: "Egipto",        awayTeam: "Irán",         homeCode: "eg",     awayCode: "ir",    date: 1782538800000, phase: "grupos", group: "G", status: "upcoming" },

  // ─── Grupo H: España · Cabo Verde · Arabia Saudita · Uruguay ───────────────
  { id: "m013", homeTeam: "España",        awayTeam: "Cabo Verde",    homeCode: "es",    awayCode: "cv",    date: 1781536800000, phase: "grupos", group: "H", status: "upcoming" },
  { id: "m015", homeTeam: "Arabia Saudita",awayTeam: "Uruguay",       homeCode: "sa",    awayCode: "uy",    date: 1781558400000, phase: "grupos", group: "H", status: "upcoming" },
  { id: "m037", homeTeam: "España",        awayTeam: "Arabia Saudita",homeCode: "es",    awayCode: "sa",    date: 1782054000000, phase: "grupos", group: "H", status: "upcoming" },
  { id: "m039", homeTeam: "Uruguay",       awayTeam: "Cabo Verde",    homeCode: "uy",    awayCode: "cv",    date: 1782075600000, phase: "grupos", group: "H", status: "upcoming" },
  { id: "m063", homeTeam: "Uruguay",       awayTeam: "España",        homeCode: "uy",    awayCode: "es",    date: 1782528000000, phase: "grupos", group: "H", status: "upcoming" },
  { id: "m064", homeTeam: "Cabo Verde",    awayTeam: "Arabia Saudita",homeCode: "cv",    awayCode: "sa",    date: 1782528000000, phase: "grupos", group: "H", status: "upcoming" },

  // ─── Grupo I: Francia · Senegal · Irak · Noruega ───────────────────────────
  { id: "m017", homeTeam: "Francia",       awayTeam: "Senegal",      homeCode: "fr",     awayCode: "sn",    date: 1781623200000, phase: "grupos", group: "I", status: "upcoming" },
  { id: "m018", homeTeam: "Irak",          awayTeam: "Noruega",      homeCode: "iq",     awayCode: "no",    date: 1781634000000, phase: "grupos", group: "I", status: "upcoming" },
  { id: "m042", homeTeam: "Francia",       awayTeam: "Irak",         homeCode: "fr",     awayCode: "iq",    date: 1782158400000, phase: "grupos", group: "I", status: "upcoming" },
  { id: "m043", homeTeam: "Noruega",       awayTeam: "Senegal",      homeCode: "no",     awayCode: "sn",    date: 1782169200000, phase: "grupos", group: "I", status: "upcoming" },
  { id: "m061", homeTeam: "Senegal",       awayTeam: "Irak",         homeCode: "sn",     awayCode: "iq",    date: 1782510000000, phase: "grupos", group: "I", status: "upcoming" },
  { id: "m062", homeTeam: "Noruega",       awayTeam: "Francia",      homeCode: "no",     awayCode: "fr",    date: 1782510000000, phase: "grupos", group: "I", status: "upcoming" },

  // ─── Grupo J: Argentina · Argelia · Austria · Jordania ─────────────────────
  { id: "m019", homeTeam: "Argentina",     awayTeam: "Argelia",      homeCode: "ar",     awayCode: "dz",    date: 1781644800000, phase: "grupos", group: "J", status: "upcoming" },
  { id: "m020", homeTeam: "Austria",       awayTeam: "Jordania",     homeCode: "at",     awayCode: "jo",    date: 1781655600000, phase: "grupos", group: "J", status: "upcoming" },
  { id: "m041", homeTeam: "Argentina",     awayTeam: "Austria",      homeCode: "ar",     awayCode: "at",    date: 1782144000000, phase: "grupos", group: "J", status: "upcoming" },
  { id: "m044", homeTeam: "Jordania",      awayTeam: "Argelia",      homeCode: "jo",     awayCode: "dz",    date: 1782180000000, phase: "grupos", group: "J", status: "upcoming" },
  { id: "m071", homeTeam: "Jordania",      awayTeam: "Argentina",    homeCode: "jo",     awayCode: "ar",    date: 1782618000000, phase: "grupos", group: "J", status: "upcoming" },
  { id: "m072", homeTeam: "Argelia",       awayTeam: "Austria",      homeCode: "dz",     awayCode: "at",    date: 1782618000000, phase: "grupos", group: "J", status: "upcoming" },

  // ─── Grupo K: Portugal · RD Congo · Uzbekistán · Colombia ──────────────────
  { id: "m021", homeTeam: "Portugal",      awayTeam: "RD Congo",     homeCode: "pt",     awayCode: "cd",    date: 1781698800000, phase: "grupos", group: "K", status: "upcoming" },
  { id: "m024", homeTeam: "Uzbekistán",    awayTeam: "Colombia",     homeCode: "uz",     awayCode: "co",    date: 1781731200000, phase: "grupos", group: "K", status: "upcoming" },
  { id: "m045", homeTeam: "Portugal",      awayTeam: "Uzbekistán",   homeCode: "pt",     awayCode: "uz",    date: 1782230400000, phase: "grupos", group: "K", status: "upcoming" },
  { id: "m048", homeTeam: "Colombia",      awayTeam: "RD Congo",     homeCode: "co",     awayCode: "cd",    date: 1782262800000, phase: "grupos", group: "K", status: "upcoming" },
  { id: "m069", homeTeam: "Colombia",      awayTeam: "Portugal",     homeCode: "co",     awayCode: "pt",    date: 1782609000000, phase: "grupos", group: "K", status: "upcoming" },
  { id: "m070", homeTeam: "RD Congo",      awayTeam: "Uzbekistán",   homeCode: "cd",     awayCode: "uz",    date: 1782609000000, phase: "grupos", group: "K", status: "upcoming" },

  // ─── Grupo L: Inglaterra · Croacia · Ghana · Panamá ────────────────────────
  { id: "m022", homeTeam: "Inglaterra",    awayTeam: "Croacia",      homeCode: "gb-eng", awayCode: "hr",    date: 1781709600000, phase: "grupos", group: "L", status: "upcoming" },
  { id: "m023", homeTeam: "Ghana",         awayTeam: "Panamá",       homeCode: "gh",     awayCode: "pa",    date: 1781720400000, phase: "grupos", group: "L", status: "upcoming" },
  { id: "m046", homeTeam: "Inglaterra",    awayTeam: "Ghana",        homeCode: "gb-eng", awayCode: "gh",    date: 1782241200000, phase: "grupos", group: "L", status: "upcoming" },
  { id: "m047", homeTeam: "Panamá",        awayTeam: "Croacia",      homeCode: "pa",     awayCode: "hr",    date: 1782252000000, phase: "grupos", group: "L", status: "upcoming" },
  { id: "m067", homeTeam: "Croacia",       awayTeam: "Ghana",        homeCode: "hr",     awayCode: "gh",    date: 1782600000000, phase: "grupos", group: "L", status: "upcoming" },
  { id: "m068", homeTeam: "Panamá",        awayTeam: "Inglaterra",   homeCode: "pa",     awayCode: "gb-eng",date: 1782600000000, phase: "grupos", group: "L", status: "upcoming" },

  // ─── Ronda de 32 (Jul 4–9) ─────────────────────────────────────────────────
  { id: "m073", homeTeam: "1A", awayTeam: "2B", homeCode: "un", awayCode: "un", date: new Date("2026-07-04T12:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },
  { id: "m074", homeTeam: "1C", awayTeam: "2D", homeCode: "un", awayCode: "un", date: new Date("2026-07-04T16:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },
  { id: "m075", homeTeam: "1E", awayTeam: "2F", homeCode: "un", awayCode: "un", date: new Date("2026-07-04T20:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },
  { id: "m076", homeTeam: "1G", awayTeam: "2H", homeCode: "un", awayCode: "un", date: new Date("2026-07-05T12:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },
  { id: "m077", homeTeam: "1B", awayTeam: "2A", homeCode: "un", awayCode: "un", date: new Date("2026-07-05T16:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },
  { id: "m078", homeTeam: "1D", awayTeam: "2C", homeCode: "un", awayCode: "un", date: new Date("2026-07-05T20:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },
  { id: "m079", homeTeam: "1F", awayTeam: "2E", homeCode: "un", awayCode: "un", date: new Date("2026-07-06T12:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },
  { id: "m080", homeTeam: "1H", awayTeam: "2G", homeCode: "un", awayCode: "un", date: new Date("2026-07-06T16:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },
  { id: "m081", homeTeam: "1I", awayTeam: "2J", homeCode: "un", awayCode: "un", date: new Date("2026-07-06T20:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },
  { id: "m082", homeTeam: "1K", awayTeam: "2L", homeCode: "un", awayCode: "un", date: new Date("2026-07-07T12:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },
  { id: "m083", homeTeam: "1J", awayTeam: "2I", homeCode: "un", awayCode: "un", date: new Date("2026-07-07T16:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },
  { id: "m084", homeTeam: "1L", awayTeam: "2K", homeCode: "un", awayCode: "un", date: new Date("2026-07-07T20:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },
  { id: "m085", homeTeam: "3er Grupo", awayTeam: "3er Grupo", homeCode: "un", awayCode: "un", date: new Date("2026-07-08T12:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },
  { id: "m086", homeTeam: "3er Grupo", awayTeam: "3er Grupo", homeCode: "un", awayCode: "un", date: new Date("2026-07-08T16:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },
  { id: "m087", homeTeam: "3er Grupo", awayTeam: "3er Grupo", homeCode: "un", awayCode: "un", date: new Date("2026-07-08T20:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },
  { id: "m088", homeTeam: "3er Grupo", awayTeam: "3er Grupo", homeCode: "un", awayCode: "un", date: new Date("2026-07-09T12:00:00-05:00").getTime(), phase: "ronda32", status: "upcoming" },

  // ─── Octavos de final (Jul 9–12) ────────────────────────────────────────────
  { id: "m089", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-09T16:00:00-05:00").getTime(), phase: "octavos", status: "upcoming" },
  { id: "m090", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-09T20:00:00-05:00").getTime(), phase: "octavos", status: "upcoming" },
  { id: "m091", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-10T16:00:00-05:00").getTime(), phase: "octavos", status: "upcoming" },
  { id: "m092", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-10T20:00:00-05:00").getTime(), phase: "octavos", status: "upcoming" },
  { id: "m093", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-11T16:00:00-05:00").getTime(), phase: "octavos", status: "upcoming" },
  { id: "m094", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-11T20:00:00-05:00").getTime(), phase: "octavos", status: "upcoming" },
  { id: "m095", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-12T16:00:00-05:00").getTime(), phase: "octavos", status: "upcoming" },
  { id: "m096", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-12T20:00:00-05:00").getTime(), phase: "octavos", status: "upcoming" },

  // ─── Cuartos de final (Jul 14–15) ───────────────────────────────────────────
  { id: "m097", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-14T16:00:00-05:00").getTime(), phase: "cuartos", status: "upcoming" },
  { id: "m098", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-14T20:00:00-05:00").getTime(), phase: "cuartos", status: "upcoming" },
  { id: "m099", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-15T16:00:00-05:00").getTime(), phase: "cuartos", status: "upcoming" },
  { id: "m100", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-15T20:00:00-05:00").getTime(), phase: "cuartos", status: "upcoming" },

  // ─── Semifinales (Jul 17–18) ────────────────────────────────────────────────
  { id: "m101", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-17T18:00:00-05:00").getTime(), phase: "semis", status: "upcoming" },
  { id: "m102", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-18T18:00:00-05:00").getTime(), phase: "semis", status: "upcoming" },

  // ─── Tercer lugar (Jul 19) ──────────────────────────────────────────────────
  { id: "m103", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-19T14:00:00-05:00").getTime(), phase: "tercer", status: "upcoming" },

  // ─── Gran Final (Jul 19) ────────────────────────────────────────────────────
  { id: "m104", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-19T18:00:00-05:00").getTime(), phase: "final", status: "upcoming" },
];

export const WORLD_CUP_TEAMS = [
  "Alemania",
  "Arabia Saudita",
  "Argelia",
  "Argentina",
  "Australia",
  "Austria",
  "Bélgica",
  "Bosnia y H.",
  "Brasil",
  "Cabo Verde",
  "Canadá",
  "Colombia",
  "Corea del Sur",
  "Costa de Marfil",
  "Croacia",
  "Curazao",
  "Ecuador",
  "EE. UU.",
  "Egipto",
  "Escocia",
  "España",
  "Francia",
  "Ghana",
  "Haití",
  "Inglaterra",
  "Irak",
  "Irán",
  "Japón",
  "Jordania",
  "Marruecos",
  "México",
  "Nigeria",
  "Noruega",
  "Nueva Zelanda",
  "Países Bajos",
  "Panamá",
  "Paraguay",
  "Portugal",
  "Qatar",
  "RD Congo",
  "Rep. Checa",
  "Senegal",
  "Sudáfrica",
  "Suecia",
  "Suiza",
  "Túnez",
  "Turquía",
  "Uruguay",
  "Uzbekistán",
];
