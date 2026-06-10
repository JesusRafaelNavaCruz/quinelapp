// ─── Usuarios ────────────────────────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  fcmToken?: string;
  createdAt: number;
}

// ─── Grupos ──────────────────────────────────────────────────────────────────
export interface Group {
  id: string;          // código corto (6 chars) para invitar
  name: string;
  adminId: string;
  members: string[];   // array de userId
  createdAt: number;
}

// ─── Partidos ────────────────────────────────────────────────────────────────
export type Phase = "grupos" | "octavos" | "cuartos" | "semis" | "tercer" | "final";

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeCode: string;    // ISO 3166-1 alpha-2 para banderas
  awayCode: string;
  date: number;        // timestamp Unix ms
  phase: Phase;
  group?: string;      // "A" | "B" … sólo en fase de grupos
  homeScore?: number;  // undefined = no jugado aún
  awayScore?: number;
  status: "upcoming" | "live" | "finished";
}

// ─── Pronósticos ─────────────────────────────────────────────────────────────
export interface Prediction {
  id: string;          // `${userId}_${matchId}`
  userId: string;
  matchId: string;
  groupId: string;
  // Ganador del partido
  winner: "home" | "draw" | "away";
  // Marcador exacto
  predictedHomeScore: number;
  predictedAwayScore: number;
  // Puntos calculados (se llena al actualizar resultado)
  points?: number;
  updatedAt: number;
}

// ─── Pronóstico campeón ───────────────────────────────────────────────────────
export interface ChampionPrediction {
  id: string;          // `${userId}_${groupId}_champion`
  userId: string;
  groupId: string;
  teamName: string;
  points?: number;
  updatedAt: number;
}

// ─── Tabla de posiciones ──────────────────────────────────────────────────────
export interface Standing {
  userId: string;
  userName: string;
  groupId: string;
  totalPoints: number;
  exactScores: number;    // marcadores exactos acertados
  correctWinners: number; // solo ganador/empate acertado
  rank?: number;
}

// ─── Notificaciones ──────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: number;
  type: "match_reminder" | "result_updated" | "group_invite" | "ranking_update";
  relatedId?: string;
}

// ─── Sistema de puntos ───────────────────────────────────────────────────────
export const POINTS = {
  EXACT_SCORE: 3,       // marcador exacto (también incluye ganador)
  CORRECT_WINNER: 1,    // solo acertó ganador/empate
  CHAMPION: 5,          // campeón del torneo
} as const;
