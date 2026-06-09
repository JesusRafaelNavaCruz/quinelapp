import type { Match } from "@/types";
import { nanoid } from "nanoid";

// Mundial FIFA 2026 — partidos de ejemplo (fase de grupos completa + eliminatorias)
// Fechas aproximadas, ajusta según el calendario oficial cuando se publique
export const WORLD_CUP_2026_MATCHES: Omit<Match, "homeScore" | "awayScore">[] = [
  // ─── Grupo A ───────────────────────────────────────────────────────────────
  { id: "m001", homeTeam: "México", awayTeam: "Polonia", homeCode: "mx", awayCode: "pl", date: new Date("2026-06-12T18:00:00-06:00").getTime(), phase: "grupos", group: "A", status: "upcoming" },
  { id: "m002", homeTeam: "Argentina", awayTeam: "Arabia Saudita", homeCode: "ar", awayCode: "sa", date: new Date("2026-06-12T12:00:00-06:00").getTime(), phase: "grupos", group: "A", status: "upcoming" },
  { id: "m003", homeTeam: "México", awayTeam: "Argentina", homeCode: "mx", awayCode: "ar", date: new Date("2026-06-17T18:00:00-06:00").getTime(), phase: "grupos", group: "A", status: "upcoming" },
  { id: "m004", homeTeam: "Polonia", awayTeam: "Arabia Saudita", homeCode: "pl", awayCode: "sa", date: new Date("2026-06-17T12:00:00-06:00").getTime(), phase: "grupos", group: "A", status: "upcoming" },
  { id: "m005", homeTeam: "México", awayTeam: "Arabia Saudita", homeCode: "mx", awayCode: "sa", date: new Date("2026-06-22T12:00:00-06:00").getTime(), phase: "grupos", group: "A", status: "upcoming" },
  { id: "m006", homeTeam: "Polonia", awayTeam: "Argentina", homeCode: "pl", awayCode: "ar", date: new Date("2026-06-22T12:00:00-06:00").getTime(), phase: "grupos", group: "A", status: "upcoming" },

  // ─── Grupo B ───────────────────────────────────────────────────────────────
  { id: "m007", homeTeam: "Brasil", awayTeam: "Serbia", homeCode: "br", awayCode: "rs", date: new Date("2026-06-13T12:00:00-06:00").getTime(), phase: "grupos", group: "B", status: "upcoming" },
  { id: "m008", homeTeam: "Suiza", awayTeam: "Camerún", homeCode: "ch", awayCode: "cm", date: new Date("2026-06-13T18:00:00-06:00").getTime(), phase: "grupos", group: "B", status: "upcoming" },
  { id: "m009", homeTeam: "Brasil", awayTeam: "Suiza", homeCode: "br", awayCode: "ch", date: new Date("2026-06-18T12:00:00-06:00").getTime(), phase: "grupos", group: "B", status: "upcoming" },
  { id: "m010", homeTeam: "Serbia", awayTeam: "Camerún", homeCode: "rs", awayCode: "cm", date: new Date("2026-06-18T18:00:00-06:00").getTime(), phase: "grupos", group: "B", status: "upcoming" },
  { id: "m011", homeTeam: "Brasil", awayTeam: "Camerún", homeCode: "br", awayCode: "cm", date: new Date("2026-06-23T12:00:00-06:00").getTime(), phase: "grupos", group: "B", status: "upcoming" },
  { id: "m012", homeTeam: "Serbia", awayTeam: "Suiza", homeCode: "rs", awayCode: "ch", date: new Date("2026-06-23T12:00:00-06:00").getTime(), phase: "grupos", group: "B", status: "upcoming" },

  // ─── Grupo C ───────────────────────────────────────────────────────────────
  { id: "m013", homeTeam: "Francia", awayTeam: "Australia", homeCode: "fr", awayCode: "au", date: new Date("2026-06-13T15:00:00-06:00").getTime(), phase: "grupos", group: "C", status: "upcoming" },
  { id: "m014", homeTeam: "Dinamarca", awayTeam: "Túnez", homeCode: "dk", awayCode: "tn", date: new Date("2026-06-14T12:00:00-06:00").getTime(), phase: "grupos", group: "C", status: "upcoming" },
  { id: "m015", homeTeam: "Francia", awayTeam: "Dinamarca", homeCode: "fr", awayCode: "dk", date: new Date("2026-06-19T12:00:00-06:00").getTime(), phase: "grupos", group: "C", status: "upcoming" },

  // ─── Grupo D ───────────────────────────────────────────────────────────────
  { id: "m016", homeTeam: "España", awayTeam: "Costa Rica", homeCode: "es", awayCode: "cr", date: new Date("2026-06-14T15:00:00-06:00").getTime(), phase: "grupos", group: "D", status: "upcoming" },
  { id: "m017", homeTeam: "Alemania", awayTeam: "Japón", homeCode: "de", awayCode: "jp", date: new Date("2026-06-14T18:00:00-06:00").getTime(), phase: "grupos", group: "D", status: "upcoming" },
  { id: "m018", homeTeam: "España", awayTeam: "Alemania", homeCode: "es", awayCode: "de", date: new Date("2026-06-19T18:00:00-06:00").getTime(), phase: "grupos", group: "D", status: "upcoming" },

  // ─── Grupo E ───────────────────────────────────────────────────────────────
  { id: "m019", homeTeam: "Portugal", awayTeam: "Ghana", homeCode: "pt", awayCode: "gh", date: new Date("2026-06-15T12:00:00-06:00").getTime(), phase: "grupos", group: "E", status: "upcoming" },
  { id: "m020", homeTeam: "Uruguay", awayTeam: "Corea del Sur", homeCode: "uy", awayCode: "kr", date: new Date("2026-06-15T18:00:00-06:00").getTime(), phase: "grupos", group: "E", status: "upcoming" },

  // ─── Grupo F ───────────────────────────────────────────────────────────────
  { id: "m021", homeTeam: "Bélgica", awayTeam: "Canadá", homeCode: "be", awayCode: "ca", date: new Date("2026-06-15T15:00:00-06:00").getTime(), phase: "grupos", group: "F", status: "upcoming" },
  { id: "m022", homeTeam: "Marruecos", awayTeam: "Croacia", homeCode: "ma", awayCode: "hr", date: new Date("2026-06-16T12:00:00-06:00").getTime(), phase: "grupos", group: "F", status: "upcoming" },

  // ─── Grupo G ───────────────────────────────────────────────────────────────
  { id: "m023", homeTeam: "Estados Unidos", awayTeam: "Gales", homeCode: "us", awayCode: "gb-wls", date: new Date("2026-06-16T18:00:00-06:00").getTime(), phase: "grupos", group: "G", status: "upcoming" },
  { id: "m024", homeTeam: "Senegal", awayTeam: "Países Bajos", homeCode: "sn", awayCode: "nl", date: new Date("2026-06-16T15:00:00-06:00").getTime(), phase: "grupos", group: "G", status: "upcoming" },

  // ─── Grupo H ───────────────────────────────────────────────────────────────
  { id: "m025", homeTeam: "Ecuador", awayTeam: "Qatar", homeCode: "ec", awayCode: "qa", date: new Date("2026-06-17T15:00:00-06:00").getTime(), phase: "grupos", group: "H", status: "upcoming" },
  { id: "m026", homeTeam: "Países Bajos", awayTeam: "Senegal", homeCode: "nl", awayCode: "sn", date: new Date("2026-06-21T12:00:00-06:00").getTime(), phase: "grupos", group: "H", status: "upcoming" },

  // ─── Eliminatorias (placeholder) ─────────────────────────────────────────
  { id: "m049", homeTeam: "1A", awayTeam: "2B", homeCode: "un", awayCode: "un", date: new Date("2026-07-03T12:00:00-06:00").getTime(), phase: "octavos", status: "upcoming" },
  { id: "m050", homeTeam: "1C", awayTeam: "2D", homeCode: "un", awayCode: "un", date: new Date("2026-07-03T18:00:00-06:00").getTime(), phase: "octavos", status: "upcoming" },
  { id: "m051", homeTeam: "1E", awayTeam: "2F", homeCode: "un", awayCode: "un", date: new Date("2026-07-04T12:00:00-06:00").getTime(), phase: "octavos", status: "upcoming" },
  { id: "m052", homeTeam: "1G", awayTeam: "2H", homeCode: "un", awayCode: "un", date: new Date("2026-07-04T18:00:00-06:00").getTime(), phase: "octavos", status: "upcoming" },

  { id: "m057", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-10T12:00:00-06:00").getTime(), phase: "cuartos", status: "upcoming" },
  { id: "m058", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-10T18:00:00-06:00").getTime(), phase: "cuartos", status: "upcoming" },

  { id: "m061", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-14T18:00:00-06:00").getTime(), phase: "semis", status: "upcoming" },
  { id: "m062", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-15T18:00:00-06:00").getTime(), phase: "semis", status: "upcoming" },

  { id: "m063", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-18T12:00:00-06:00").getTime(), phase: "tercer", status: "upcoming" },
  { id: "m064", homeTeam: "TBD", awayTeam: "TBD", homeCode: "un", awayCode: "un", date: new Date("2026-07-19T12:00:00-06:00").getTime(), phase: "final", status: "upcoming" },
];

export const WORLD_CUP_TEAMS = [
  "Argentina", "Brasil", "Francia", "España", "Alemania",
  "Portugal", "Inglaterra", "Bélgica", "Países Bajos", "Uruguay",
  "México", "Estados Unidos", "Canadá", "Marruecos", "Senegal",
  "Japón", "Croacia", "Dinamarca", "Polonia", "Suiza",
  "Corea del Sur", "Ecuador", "Qatar", "Gales", "Australia",
  "Serbia", "Ghana", "Túnez", "Costa Rica", "Arabia Saudita",
  "Camerún", "Irán",
];
