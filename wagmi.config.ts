//ref vid

"use client"

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { basecampTestnet } from "viem/chains";

export const config = getDefaultConfig({
    appName: "Auctor - Proof of Provenance",
    projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "your-project-id", // Get from https://cloud.walletconnect.com
    chains: [basecampTestnet],
});