# Auctor — Real-World Asset Registry with Proof of Possession

## 📌 Overview
Auctor is a real-world asset registry that enables anyone to **register, verify, co-own, and transfer** physical items onchain.

It is powered by [Camp Network's Origin SDK](https://docs.camp.network/) to provide:
- **Tamperproof Proof of Possession Documents (PPD)**
- **Full ownership history tracking**
- **User & Proof Verification**
- **Co-ownership management**

> **Problem:** Physical ownership proof is broken. Bills fade, receipts get lost, and screenshots can be forged.  
> **Solution:** Auctor creates a permanent, verifiable, and transferable onchain record for your assets.

---

## 🚀 Features (MVP Scope)
- Register physical items (electronics, vehicles, instruments, etc.)
- Verification of bills & IDs by Persona
- Mint **Origin IP Artifact** 
- Generate **Proof of Possession Document (PPD)** with:
  - Verified metadata (title, category, value)
  - Co-owner list
  - Transfer history
- Co-ownership management (add/remove with provenance tracking)
- XP rewards for verified listings

---

## 🛠 Architecture Overview

![Auctor Architecture](./public/auctor-architecture-userflow.png)

Auctor uses a **hybrid onchain–offchain** architecture:

**Onchain (via Camp Origin SDK)**
- Origin artifact creation 
- Metadata storage: title, category, est. value, co-owners
- Provenance tracking for edits/transfers

**Offchain**
- Verification data (invoice, ID) stored temporarily on IPFS via Pinata
- Persona - Verification processing
- XP & monthly credits tracking

---

## 🔗 Tech Stack
- **Frontend:** Next.js (latest) + Tailwind + Framer Motion + shadcn/ui
- **Backend:** Node.js / Express
- **Blockchain:** Camp Network (Basecamp Testnet) + Wagmi
- **Storage:** IPFS via Pinata
- **Database/Auth:** Supabase
- **AI:** Tesseract OCR / Google Vision API + LLM summarization

---

## 📄 Proof of Possession Document (PPD)
The PPD is a downloadable PDF that includes:
- Item metadata
- Verified owner(s) & co-owners
- Onchain Origin ID
- Complete transfer history

---

## ⚙️ Origin SDK Usage
We used:
- mint assets as NFT and IP registry then stored on Pinata IPFS
- Metadata storage for title, category, est. value, verification, and co-owners
- Provenance tracking for co-owner changes
- Planned resale & royalty logic in v2

---

## 📹 Demo Video
[Watch the Demo](x.com/0xshubh4m)  

---

## 🌍 Live Deployment
[Live Project Link](auctor-camp.vercel.app)

---

## 📂 Repository Structure
```
/app     # Next.js UI, API and frontend files
/contracts      # Smart contract
/hooks      # reusable React logic
/lib         # utility functions, SDK configs, and integrations
```

---

## 👥 Team
- Khushi (@smilewithkhushi)
- Shubham (@0xshubh4m)

---
