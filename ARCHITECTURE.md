# Auctor — Architecture & Origin SDK Integration

## 🏗 System Overview
Auctor is built on a **hybrid architecture** combining:
- **Onchain:** Camp Network Origin SDK for immutable ownership proofs
- **Offchain:** Backend services for verification & AI features

---

## 🔄 Asset Lifecycle
1. **Register Item**
   - User enters metadata (title, category, est. value)
   - Uploads bill & ID
   - OCR + NLP extract data for verification

2. **Verification**
   - AI cross-checks bill & ID details
   - Marks verification status

3. **Onchain Minting**
   - Calls `origin.register()` with verified metadata
   - Stores co-owner list, timestamps, provenance data

4. **Proof of Possession Document (PPD)**
   - Auto-generated PDF summarizing ownership & history
   - Downloadable anytime

5. **Co-Ownership & Transfers**
   - Add/remove co-owners with onchain provenance updates
   - Planned resale & royalties in v2

---

## 📌 Origin SDK Usage in Auctor
- **origin.register()**
- Metadata storage
- Provenance tracking
- Future resale module (planned)

---

## 🔐 Data Handling
- Bills & IDs stored on IPFS (via Pinata) for temporary verification
- Only hashes stored in the database for reference
- No sensitive data stored permanently offchain

---

## 📊 Future Improvements
- Resale marketplace with automatic ownership transfer
- Royalty logic for recurring sales
- Full AI chatbot assistant for ownership & dispute resolution
