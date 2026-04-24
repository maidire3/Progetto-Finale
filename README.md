# Study Tracker

Study Tracker e una web app pensata per aiutare studenti universitari a organizzare materie, task, esami e appunti in un'unica dashboard.

Il progetto e nato come progetto finale frontend, ma nel tempo e stato esteso con un backend Node.js + Express + MongoDB per gestire autenticazione e dati reali per utente.

Frontend online su Netlify:
[https://creative-entremet-c8df0d.netlify.app/](https://creative-entremet-c8df0d.netlify.app/)

Backend online su Render:
[https://progetto-finale-ff13.onrender.com/](https://progetto-finale-ff13.onrender.com/)

## Nota importante sul backend deployato

Il backend e deployato su Render piano gratuito, quindi puo andare in sleep dopo un periodo di inattivita.

Prima di usare l'app online:

1. apri il backend
   [https://progetto-finale-ff13.onrender.com/api/health](https://progetto-finale-ff13.onrender.com/api/health)
2. attendi qualche secondo che il server si riattivi
3. usa normalmente il frontend

Senza questo passaggio, login, registrazione e chiamate API potrebbero fallire al primo tentativo.

## Obiettivo del progetto

L'idea alla base di Study Tracker e offrire uno spazio unico dove:

- pianificare la settimana di studio
- gestire task e scadenze
- organizzare materie con colori e programmazione settimanale
- tenere traccia degli esami
- scrivere appunti collegati alle materie

L'interfaccia e stata progettata con uno stile moderno, dark mode inclusa, con una dashboard centrale e un calendario settimanale interattivo.

## Funzionalita principali

### Autenticazione

- registrazione utente
- login con JWT
- logout
- protezione delle route private
- recupero sessione al refresh

### Dashboard

- card riepilogo con materie, task aperte e prossimo esame
- calendario settimanale interattivo
- task panel rapido
- sezione "In arrivo" con task ed esami da monitorare

### Materie

- creazione, modifica ed eliminazione
- scelta colore visuale
- programmazione settimanale base
- modal con riepilogo task collegate

### Task

- creazione, modifica, completamento ed eliminazione
- supporto a data, ora inizio, ora fine e note
- sincronizzazione con il calendario
- gestione anche dal task panel e dal click sulle celle del planner

### Esami

- creazione, modifica ed eliminazione
- collegamento a materia
- visualizzazione nella dashboard

### Appunti

- lista note reali dal backend
- pagina dedicata `/notes/:id`
- modifica e salvataggio contenuto
- eliminazione

### Search

- ricerca live tra:
  - materie
  - task
  - esami
  - appunti

## Stack utilizzato

### Frontend

- React
- React Router
- CSS custom
- Vite

### Backend

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- dotenv
- cors
- helmet
- express-rate-limit

## Struttura del progetto

```text
Progetto Finale/
|-- src/
|   |-- components/
|   |-- context/
|   |-- pages/
|   |-- router/
|   |-- styles/
|   `-- utils/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   `-- utils/
|   `-- .env.example
|-- package.json
`-- README.md
```

## Stato attuale del progetto

Attualmente il progetto ha:

- frontend e backend separati
- autenticazione base completa
- route protette lato frontend e backend
- CRUD reali per:
  - user settings
  - subjects
  - tasks
  - exams
  - notes

Le sezioni principali sono collegate al database e filtrate per utente autenticato.

## Sicurezza e robustezza backend

Nelle ultime revisioni il backend e stato reso piu solido con alcune patch mirate:

- rate limiting su `POST /api/auth/login` e `POST /api/auth/register`
  - riduce il rischio di brute-force e tentativi ripetuti sulle credenziali
- CORS fail-closed
  - `CLIENT_URL` e obbligatoria
  - il backend non usa piu fallback permissivi a `*`
  - vengono accettate solo le origin configurate
- validazioni piu strette lato API
  - `task.status` accetta solo valori ammessi
  - `language`, `weekStart`, `plannerStartHour` e `plannerEndHour` vengono validati
  - gli orari task e planner vengono controllati per formato e coerenza
- header HTTP di sicurezza base con `helmet`
- filtro dati per utente autenticato su tutte le risorse principali
- password sempre hashate con `bcrypt`
- dati sensibili come la password non vengono mai restituiti nelle response

Queste scelte non rendono il progetto "enterprise-ready", ma lo portano a un livello piu robusto e coerente per un progetto finale junior fatto bene.

## Avvio in locale

### 1. Frontend

Dalla root del progetto:

```bash
npm install
npm run dev
```

Il frontend parte di default su:

```text
http://localhost:5173
```

### 2. Backend

Apri un secondo terminale:

```bash
cd backend
npm install
npm start
```

Il backend parte di default su:

```text
http://localhost:5000
```

Health check:

```text
http://localhost:5000/api/health
```

## Variabili ambiente backend

Nel file `backend/.env` puoi usare una configurazione di questo tipo:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/study-tracker?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=una_chiave_jwt_lunga_e_sicura
CLIENT_URL=http://localhost:5173
MONGODB_DNS_SERVERS=1.1.1.1,8.8.8.8
```

In deploy puoi usare anche piu origin separate da virgola per `CLIENT_URL`, ad esempio:

```env
CLIENT_URL=http://localhost:5173,https://tuo-frontend.netlify.app
```

Puoi partire dal file:

```text
backend/.env.example
```

## Script disponibili

### Root

```bash
npm run dev
npm run build
```

### Backend

```bash
npm start
```

## Flusso di autenticazione

Il frontend:

- salva `token` e `user` in `localStorage`
- sincronizza il contesto utente dopo login e register
- protegge le route private con route guards

Il backend:

- verifica il token JWT
- recupera l'utente autenticato
- limita ogni risorsa all'utente proprietario

## Design e UX

La UI e stata sviluppata con un approccio progressivo:

- layout desktop a dashboard
- adattamento mobile della dashboard
- dark mode
- drawer mobile per sidebar e task panel
- calendario settimanale scrollabile su smartphone

## Possibili sviluppi futuri

- gestione token piu avanzata con cookie `httpOnly` e refresh token
- centralizzazione migliore della gestione globale dei `401` lato frontend
- miglioramento responsive delle altre pagine oltre la dashboard
- verifica account tramite email
- filtri e ordinamenti piu avanzati
- audit e hardening sicurezza piu approfonditi

## Autore

Progetto sviluppato da **Davide** come progetto finale, con focus su:

- organizzazione del codice
- UX/UI moderna
- integrazione frontend/backend
- crescita graduale del progetto senza overengineering
