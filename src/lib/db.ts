import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  Group,
  Match,
  Prediction,
  ChampionPrediction,
  Standing,
  Notification,
  User,
  POINTS,
} from "@/types";
import { POINTS as PTS } from "@/types";

// ─── Usuarios ────────────────────────────────────────────────────────────────
export async function upsertUser(user: User) {
  await setDoc(doc(db, "users", user.id), user, { merge: true });
}

export async function getUser(userId: string): Promise<User | null> {
  const snap = await getDoc(doc(db, "users", userId));
  return snap.exists() ? (snap.data() as User) : null;
}

// ─── Grupos ──────────────────────────────────────────────────────────────────
export async function createGroup(group: Group) {
  await setDoc(doc(db, "groups", group.id), group);
}

export async function getGroup(groupId: string): Promise<Group | null> {
  const snap = await getDoc(doc(db, "groups", groupId));
  return snap.exists() ? (snap.data() as Group) : null;
}

export async function joinGroup(groupId: string, userId: string): Promise<boolean> {
  const groupRef = doc(db, "groups", groupId);
  const snap = await getDoc(groupRef);
  if (!snap.exists()) return false;
  const group = snap.data() as Group;
  if (!group.members.includes(userId)) {
    await updateDoc(groupRef, { members: [...group.members, userId] });
  }
  return true;
}

export async function getUserGroups(userId: string): Promise<Group[]> {
  const q = query(collection(db, "groups"), where("members", "array-contains", userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Group);
}

// ─── Partidos ────────────────────────────────────────────────────────────────
export async function getMatches(): Promise<Match[]> {
  const snap = await getDocs(query(collection(db, "matches"), orderBy("date", "asc")));
  return snap.docs.map((d) => d.data() as Match);
}

export function subscribeMatches(cb: (matches: Match[]) => void): Unsubscribe {
  return onSnapshot(
    query(collection(db, "matches"), orderBy("date", "asc")),
    (snap) => cb(snap.docs.map((d) => d.data() as Match))
  );
}

// ─── Pronósticos ─────────────────────────────────────────────────────────────
export async function savePrediction(pred: Prediction) {
  await setDoc(doc(db, "predictions", pred.id), pred, { merge: true });
}

export async function getUserPredictions(userId: string, groupId: string): Promise<Prediction[]> {
  const q = query(
    collection(db, "predictions"),
    where("userId", "==", userId),
    where("groupId", "==", groupId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Prediction);
}

export async function getGroupPredictionsForMatch(
  matchId: string,
  groupId: string
): Promise<Prediction[]> {
  const q = query(
    collection(db, "predictions"),
    where("matchId", "==", matchId),
    where("groupId", "==", groupId)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Prediction);
}

export function subscribePredictions(
  userId: string,
  groupId: string,
  cb: (preds: Prediction[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "predictions"),
    where("userId", "==", userId),
    where("groupId", "==", groupId)
  );
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as Prediction)));
}

// ─── Campeón ─────────────────────────────────────────────────────────────────
export async function saveChampionPrediction(pred: ChampionPrediction) {
  await setDoc(doc(db, "champion_predictions", pred.id), pred, { merge: true });
}

export async function getChampionPrediction(
  userId: string,
  groupId: string
): Promise<ChampionPrediction | null> {
  const id = `${userId}_${groupId}_champion`;
  const snap = await getDoc(doc(db, "champion_predictions", id));
  return snap.exists() ? (snap.data() as ChampionPrediction) : null;
}

// ─── Tabla de posiciones ──────────────────────────────────────────────────────
export function subscribeStandings(
  groupId: string,
  cb: (standings: Standing[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "standings"),
    where("groupId", "==", groupId),
    orderBy("totalPoints", "desc")
  );
  return onSnapshot(q, (snap) => {
    const standings = snap.docs.map((d, i) => ({
      ...(d.data() as Standing),
      rank: i + 1,
    }));
    cb(standings);
  });
}

// ─── Notificaciones ──────────────────────────────────────────────────────────
export function subscribeNotifications(
  userId: string,
  cb: (notifs: Notification[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => d.data() as Notification)));
}

export async function markNotificationRead(notifId: string) {
  await updateDoc(doc(db, "notifications", notifId), { read: true });
}

// ─── Cálculo de puntos (usado desde API routes) ───────────────────────────────
export function calculatePoints(
  pred: Prediction,
  homeScore: number,
  awayScore: number
): number {
  const exactMatch =
    pred.predictedHomeScore === homeScore && pred.predictedAwayScore === awayScore;
  if (exactMatch) return PTS.EXACT_SCORE;

  const actualWinner =
    homeScore > awayScore ? "home" : homeScore < awayScore ? "away" : "draw";
  if (pred.winner === actualWinner) return PTS.CORRECT_WINNER;

  return 0;
}
