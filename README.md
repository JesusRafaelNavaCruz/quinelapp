# Cancha 26 — Quiniela Mundial 2026

App web para gestionar una quiniela del Mundial 2026 (México · USA · Canadá). Permite crear grupos privados, pronosticar resultados partido a partido, competir en una tabla de posiciones en tiempo real y recibir notificaciones push cuando se actualizan resultados.

---

## Stack

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Estilos | Tailwind CSS |
| Base de datos | Cloud Firestore (Firebase) |
| Autenticación | Firebase Authentication (Email/Contraseña + Google) |
| Notificaciones push | Firebase Cloud Messaging (FCM) |
| Fuentes | Bebas Neue (display) · DM Sans (body) via `next/font` |
| Íconos | Lucide React |

---

## Funcionalidades

- **Autenticación** — registro e inicio de sesión con email/contraseña o cuenta Google
- **Pronósticos por partido** — marcador exacto y ganador inferido automáticamente
- **Pronóstico de campeón** del torneo (5 pts extra)
- **Tabla de posiciones en tiempo real** por grupo (Firestore `onSnapshot`)
- **Grupos privados** — crea o únete con código de 6 caracteres
- **Link de invitación** para compartir el grupo (`/unirse/[id]`)
- **Notificaciones push** (FCM) y **campana in-app** al actualizarse resultados
- **Panel de administrador** en `/admin` para cargar resultados

---

## Sistema de puntos

| Acierto | Puntos |
|---|---|
| Marcador exacto | **3 pts** |
| Solo ganador / empate correcto | **1 pt** |
| Campeón del torneo | **5 pts** |

---

## Estructura del proyecto

```
src/
├── app/
│   ├── page.tsx               # Home — menú principal (requiere autenticación)
│   ├── login/page.tsx         # Inicio de sesión y registro (email + Google)
│   ├── grupos/page.tsx        # Crear y unirse a grupos, copiar link de invitación
│   ├── pronosticos/page.tsx   # Pronosticar partidos por fase, elegir campeón
│   ├── tabla/page.tsx         # Tabla de posiciones del grupo
│   ├── admin/page.tsx         # Panel admin — actualizar resultados
│   ├── unirse/[id]/page.tsx   # Unirse automáticamente al abrir link de invitación
│   └── api/
│       ├── results/route.ts   # POST: registrar resultado + calcular puntos + notificar
│       ├── notifications/     # POST: registrar token FCM del dispositivo
│       └── seed/route.ts      # GET: poblar Firestore con los partidos del mundial
├── components/
│   ├── Providers.tsx          # Wrapper del AuthProvider para el layout raíz
│   └── NotificationBell.tsx   # Campana con badge de no leídas
└── lib/
    ├── AuthContext.tsx         # Contexto de autenticación Firebase (signIn/signUp/Google/signOut)
    ├── firebase.ts             # Inicialización cliente Firebase (Client SDK)
    ├── firebase-admin.ts       # Inicialización Admin SDK (solo servidor)
    ├── db.ts                   # Helpers de lectura/escritura Firestore
    ├── user.ts                 # Helpers de perfil de usuario
    ├── useNotifications.ts     # Hook para solicitar permiso y registrar FCM token
    ├── matches-data.ts         # Calendario completo del Mundial 2026
    └── ../types/index.ts       # Interfaces TypeScript de todos los modelos
```

---

## Modelo de datos (Firestore)

```
users/              {id, name, email, avatar, fcmToken?, createdAt}
groups/             {id, name, adminId, members[], createdAt}
matches/            {id, homeTeam, awayTeam, homeCode, awayCode, date, phase, group?, homeScore?, awayScore?, status}
predictions/        {id, userId, matchId, groupId, winner, predictedHomeScore, predictedAwayScore, points?, updatedAt}
champion_predictions/ {id, userId, groupId, teamName, points?, updatedAt}
standings/          {userId, userName, groupId, totalPoints, exactScores, correctWinners}
notifications/      {id, userId, title, body, read, createdAt, type, relatedId?}
```

---

## API Routes

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/results` | Registra resultado, calcula puntos, actualiza standings y envía notificaciones FCM |
| `POST` | `/api/notifications` | Registra el FCM token de un dispositivo |
| `GET` | `/api/seed?secret=xxx` | Pobla Firestore con todos los partidos del mundial (usar solo una vez) |

---

## Flujo principal

1. **Usuario llega** → si no está autenticado, es redirigido a `/login`
2. **Registro / Login** → con email y contraseña, o con Google
3. **Crea un grupo** → obtiene código de 6 letras → comparte el link
4. **Otros se unen** → con el código manual o abriendo el link de invitación
5. **Todos pronostican** → marcador de cada partido (se bloquea automáticamente al iniciar)
6. **Admin actualiza resultado** → desde `/admin` → llama a `POST /api/results`
7. **Sistema calcula puntos** → actualiza standings en tiempo real
8. **Notificaciones** → todos los miembros reciben push notification y alerta in-app

---

## Instalación y configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con los valores reales:

```env
# Firebase Client SDK — desde Firebase Console > Configuración del proyecto > Tu app web
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_VAPID_KEY=     # Firebase Console > Cloud Messaging > Web Push certificates

# Firebase Admin SDK — del JSON de service account (Cuentas de servicio > Generar nueva clave)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# URL base del sitio (para links de invitación)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Protege el endpoint /api/seed en producción
SEED_SECRET=una-clave-secreta-larga
```

### 3. Habilitar Firebase Authentication

En Firebase Console → Authentication → Sign-in method, habilita:
- **Email/Password**
- **Google** (configura el dominio autorizado en producción)

### 4. Service Worker (notificaciones push)

El archivo `public/firebase-messaging-sw.js` necesita las credenciales Firebase hardcodeadas porque los Service Workers no tienen acceso a variables de entorno. Edítalo con los mismos valores del Client SDK.

### 5. Desplegar reglas e índices de Firestore

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules,firestore:indexes
```

### 6. Poblar los partidos del mundial

Una sola vez, con el servidor corriendo:

```bash
# Desarrollo
curl http://localhost:3000/api/seed

# Producción
curl "https://tu-dominio.com/api/seed?secret=TU_SEED_SECRET"
```

### 7. Correr en desarrollo

```bash
npm run dev
```

---

## Despliegue en producción

```bash
npm run build   # verificar que compile sin errores
vercel --prod   # o el proveedor de tu elección
```

Configura todas las variables de entorno en el dashboard del proveedor. La app es compatible con cualquier plataforma que soporte Next.js 14 (Vercel, Netlify, Railway, etc.).

---

## Notas de seguridad

- La autenticación usa **Firebase Authentication** — las identidades son gestionadas por Firebase, no por la aplicación.
- El panel `/admin` no tiene protección de rol. Se recomienda agregar un check de `uid` autorizado antes de pasar a producción.
- Las Firestore Security Rules deben actualizarse para validar `request.auth.uid` en escrituras sensibles.
- El endpoint `/api/seed` está protegido por `SEED_SECRET` en producción.
- Archivos excluidos de git por `.gitignore`: `.env.local`, `.env.dev`, `.env.prod` y el JSON de service account.
