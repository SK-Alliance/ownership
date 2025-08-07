# Auctor 🏕️

> **Own it. Prove it. Build it.**

Auctor is a Web3 platform for proving ownership of real-world assets through tamperproof digital certificates. Built on Camp Network, we're creating the future of verifiable IP ownership.

## What is Auctor?

Traditional ownership lacks digital proof - we lose receipts, bills fade, and ownership becomes a mess. Auctor fixes this by allowing you to:

- **Register** any high-value item with proof
- **Mint** it as verifiable IP onchain
- **Transfer** ownership seamlessly
- **Co-own** assets with others
- **Resell** with preserved authenticity

## How It Works

1. **Upload** your bill + ID for proof
2. **We verify** authenticity and ownership
3. **We mint** your item as an origin IP artifact
4. **You control** viewing, co-ownership, and transfers

## Tech Stack

- **Framework**: Next.js 15.4.6 with App Router
- **Styling**: Tailwind CSS 4 with custom design system
- **Animations**: Framer Motion 12.23.12
- **Web3**: @campnetwork/origin, Viem
- **State**: React Query, Apollo Client
- **UI**: Custom liquid glass components
- **Icons**: Lucide React

## Getting Started

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project
cd camp-project

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
src/
├── app/                 # Next.js App Router
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── HeroSection.tsx
│   ├── ProblemSolutionSection.tsx
│   ├── HowItWorksSection.tsx
│   └── Footer.tsx
├── lib/                # Utilities
└── fonts/              # Custom fonts
```

## Features

- ✨ **Liquid Glass Design System** - Premium morphism UI
- 🎨 **Responsive Design** - Works on all devices
- ⚡ **Smooth Animations** - Framer Motion powered
- 🔗 **Web3 Integration** - Built on Camp Network
- 🎯 **Component Architecture** - Clean, modular code

## Development

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## Design System

The project uses a custom design system with:
- **Colors**: Gold (#FFD66B), Green (#6BEFA5), Blue (#6BCBFF)
- **Typography**: Clash for headings, DM Sans for body
- **Effects**: Liquid glass morphism throughout
- **Animations**: Smooth, purposeful micro-interactions

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Built With ❤️ by

**[SK Alliance](https://sk-alliance.com)** - Building the future of digital ownership

---

*Auctor - Beyond NFTs, Beyond Hype. Real ownership for real assets.*
