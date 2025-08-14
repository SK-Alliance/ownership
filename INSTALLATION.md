# Auctor — Installation & Setup

## 1️⃣ Prerequisites
- Node.js v18+
- npm or yarn
- Git
- Camp Network wallet (Basecamp testnet)
- Pinata account for IPFS uploads
- Supabase account for DB/auth

---

## 2️⃣ Clone the Repo
```bash
git clone https://github.com/SK-Alliance/ownership.git
cd ownership
```

---

## 3️⃣ Install Dependencies
```bash
cd frontend
npm install

cd ../backend
npm install
```

---

## 4️⃣ Environment Variables
Create `.env` files in both `/frontend` and `/backend`.

**Frontend:**
```
NEXT_PUBLIC_CAMP_NETWORK_URL=<camp-node-endpoint>
NEXT_PUBLIC_PINATA_GATEWAY_URL=https://gateway.pinata.cloud
```

**Backend:**
```
PINATA_JWT=<your-pinata-jwt>
OPENAI_API_KEY=<optional-if-using-ai>
CAMP_PRIVATE_KEY=<wallet-private-key-for-testnet>
SUPABASE_URL=<supabase-url>
SUPABASE_KEY=<supabase-anon-key>
```

---

## 5️⃣ Run the App Locally
Frontend:
```bash
cd frontend
npm run dev
```
Backend:
```bash
cd backend
npm run dev
```

---

## 6️⃣ Access the App
Open your browser at:
```
http://localhost:3000
```

---

## ⚠️ Notes
- Current deployment is on **Basecamp Testnet**
- Request faucet tokens from the [Basecamp Faucet](https://faucet.basecamp.camp.network/)
