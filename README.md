# Study Tracker

Study Tracker e una web app pensata per aiutare studenti universitari a organizzare materie, task, esami e appunti in un'unica dashboard.

Il progetto e nato come progetto finale frontend, ma nel tempo e stato esteso con un backend Node.js + Express + MongoDB per gestire autenticazione e dati reali per utente.

Frontend visionabile su Netlify: https://creative-entremet-c8df0d.netlify.app/

Backend su OnRender: https://progetto-finale-ff13.onrender.com/

⚠️ Nota importante (Backend)

Il backend è deployato su Render (piano gratuito), quindi va in sleep dopo un periodo di inattività.

👉 Prima di utilizzare l’app:

Apri il link del backend: https://progetto-finale-ff13.onrender.com/
Attendi qualche secondo che il server si riattivi
Poi utilizza normalmente il frontend

⚡ Senza questo passaggio, login/registrazione e le funzionalità principali potrebbero non funzionare. 

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

## Struttura del progetto

```text
Progetto Finale/
├─ src/
│  ├─ components/
│  ├─ context/
│  ├─ pages/
│  ├─ router/
│  ├─ styles/
│  └─ utils/
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  ├─ controllers/
│  │  ├─ middleware/
│  │  ├─ models/
│  │  ├─ routes/
│  │  └─ utils/
│  └─ .env.example
├─ package.json
└─ README.md
```

## Stato attuale del progetto

Attualmente il progetto ha:

- frontend e backend separati
- autenticazione completa base
- route protette lato frontend e backend
- CRUD reali per:
  - user settings
  - subjects
  - tasks
  - exams
  - notes

Le sezioni principali sono gia collegate al database e filtrate per utente autenticato.

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

## Variabili ambiente backend

Nel file `backend/.env` puoi usare una configurazione di questo tipo:

```env
PORT=5000
MONGODB_URI=mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/study-tracker?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=una_chiave_jwt_lunga_e_sicura
CLIENT_URL=http://localhost:5173
MONGODB_DNS_SERVERS=1.1.1.1,8.8.8.8
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

## Flusso autenticazione

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

- miglioramento responsive delle altre pagine oltre la dashboard
- verifica dell’account tramite email (email di conferma alla registrazione)
- filtri e ordinamenti piu avanzati
- validazioni piu forti lato backend
- gestione globale dei 401 lato frontend
- miglioramento UX della sezione search e dashboard

## Autore

Progetto sviluppato da **Davide** come progetto finale, con focus su:

- organizzazione del codice
- UX/UI moderna
- integrazione frontend/backend
- crescita graduale del progetto senza overengineering
