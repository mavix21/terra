# Terra

Fractional ownership for specialty coffee microlots. Producers tokenize microlots as ERC-1155 assets, buyers acquire fractional tokens transparently, and everyone tracks provenance and activity in real time.

### Why it matters

- **For producers**: Upfront liquidity and global reach by selling fractions of a lot.
- **For buyers/roasters**: Transparent provenance and the ability to support specific farms and lots.
- **For the ecosystem**: Open, on-chain settlement optionality with real-time off-chain UX.

---

## 📦 Monorepo Structure

This repository is a pnpm monorepo. It consists of the following main parts:

- `apps/web`: Next.js 15 application (UI, pages, API routes, auth, providers).
- `packages/ui`: Shared UI library (shadcn/ui-based) published as `@terra/ui`.
- `packages/s-contracts`: Hardhat project containing the ERC-1155 smart contract(s) for Lisk Sepolia.
- `packages/convex`: Convex backend code (schema, functions, tables, storage, auth adapter).
- `tooling/`: Shared configs for ESLint, Prettier, TypeScript, etc.

## 🧰 Tech Stack

- **Next.js 15 & Turbopack**
- **Auth**: NextAuth.js (Credentials flow from wallet auth via Dynamic)
- **Web3**: Wagmi + Viem, Lisk Sepolia network
- **Backend**: Convex (functions, tables, storage, auth integration)
- **i18n**: next-intl
- **UI**: shadcn/ui via `@terra/ui`, Tailwind v4
- **Forms/Validation**: react-hook-form + zod
- **IPFS**: Pinata (JWT), configurable gateway

## ✨ Core Features

- **Wallet sign-in** with Dynamic; session persisted via NextAuth (credentials provider).
- **Producers create microlots** with variety, altitude, processing, price, supply, image, and metadata URI.
- **Buyers purchase fractions**; holdings and purchases are recorded and visible in the dashboard.
- **Real-time updates** via Convex React client and storage-backed media.
- **On-chain contract** (ERC-1155) included for tokenization, with deployment scripts to Lisk Sepolia.

Note: The included smart contract (`TerraFactory`) supports fractional contributions and distribution. The current web app records purchases in Convex; on-chain settlement can be wired via Viem calls as a next step.

## 🚀 Getting Started

Follow these steps to run Terra locally.

### Prerequisites

- Node.js 20+ (see `.nvmrc`)
- pnpm (see `packageManager` in `package.json`)
- A Convex project (or use `convex dev` locally)
- A Dynamic Labs project (for wallet auth)
- A Pinata account (for IPFS uploads)

### 1) Install dependencies

```bash
pnpm install
```

### 2) Configure environment

Create a `.env` file at the monorepo root (the web app loads `../../.env`). Use this template and fill in your values:

```bash
# ---------- Public (client) ----------
NEXT_PUBLIC_CONVEX_URL="https://<your-convex>.convex.cloud"
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID="<dynamic_environment_id>"
NEXT_PUBLIC_GATEWAY_URL="https://gateway.pinata.cloud/ipfs/"

# ---------- Server (web) ----------
AUTH_SECRET="<nextauth_secret>"
CONVEX_AUTH_PRIVATE_KEY="<rsa_pkcs8_private_key_for_RS256>"
CONVEX_AUTH_ADAPTER_SECRET="<long_random_string>"
NEXT_DYNAMIC_BEARER_TOKEN="<dynamic_server_bearer_token>"
PINATA_JWT="<pinata_jwt>"

# ---------- Convex (CLI/hosting) ----------
CONVEX_DEPLOY_KEY="<optional_if_deploying>"
CONVEX_SITE_URL="https://<your-convex>.site"

# ---------- Optional (production) ----------
NEXTAUTH_URL="https://your-deployment.example"
PORT=3000
```

How to obtain values:

- **Convex**: Run `pnpm -F @terra/convex dev` to bootstrap a dev instance and copy the printed URL for `NEXT_PUBLIC_CONVEX_URL`. In hosted projects, get URLs and deploy keys from the Convex dashboard.
- **Dynamic**: Create a project, then copy the Environment ID (client) and a bearer token (server) for `NEXT_DYNAMIC_BEARER_TOKEN`.
- **Auth secrets**: Generate with `openssl rand -base64 32` (or use NextAuth tool) for `AUTH_SECRET` and `CONVEX_AUTH_ADAPTER_SECRET`.
- **Pinata**: Create a JWT in Pinata settings.
- **RSA key**: `CONVEX_AUTH_PRIVATE_KEY` should be an RSA PKCS#8 private key string used to mint Convex identities in the session callback.

### 3) Start the app

From the monorepo root:

```bash
pnpm dev
```

The web app will be available at `http://localhost:3000`.

If you prefer running services individually:

```bash
# Start Convex dev (prints a dev URL)
pnpm -F @terra/convex dev

# In another terminal, start the web app
pnpm -F web dev
```

## 🧪 Smart Contracts (Lisk Sepolia)

Contracts live in `packages/s-contracts`.

- Main contract: `contracts/Terra.sol` (ERC-1155 fractionalization via `TerraFactory`)
- Networks: `liskSepolia` configured; Hardhat also includes Sepolia as example

Common commands:

```bash
# From repo root or package dir
pnpm -F s-contracts build
pnpm -F s-contracts compile

# Show signer (requires DEPLOYER_PRIVATE_KEY in .env)
pnpm -F s-contracts node scripts/show-signer.ts

# Deploy via Ignition/script (ensure RPC + key are set)
pnpm -F s-contracts node scripts/deployOptions.mjs
```

Required env for contracts:

```bash
DEPLOYER_PRIVATE_KEY="<hex_private_key>"   # with or without 0x prefix
```

Hardhat uses the public Lisk Sepolia RPC `https://rpc.sepolia-api.lisk.com` by default.

## 🗄️ Convex Backend

- Schema: `packages/convex/convex/schema.ts`
- Key tables: `users`, `microlots`, `microlotPurchases`, `tokenHoldings`, `producers`, `coffeeShops`, `buyerVerifications`
- Auth adapter: `packages/convex/convex/authAdapter.ts` and `auth.config.ts`
- Selected functions:
  - `users.createUserIfNotExists`, `users.getUserIdByEmail`
  - `microlots.createMicrolot`, `microlots.listMicrolotsPaginated`, `microlots.buyTokens`

Run locally:

```bash
pnpm -F @terra/convex dev
```

## 🔑 Authentication Flow

- Wallet connection and auth handled by Dynamic (`apps/web/app/(app)/_providers/dynamic-wrapper.tsx`).
- On successful wallet auth, a credentials token is posted to NextAuth.
- Session callback (see `apps/web/auth.ts`) ensures the user exists in Convex and attaches the Convex subject to the session.

## 📊 App Highlights

- Responsive dashboard and UI components from `@terra/ui`.
- Charts and tables for marketplace and ownership views.
- i18n-ready routing under `apps/web/app/(app)/[locale]/*`.

## 📜 Scripts

Root scripts:

```bash
pnpm dev           # Start monorepo dev (web, etc.)
pnpm build         # Build all
pnpm typecheck     # Type-check all
pnpm lint          # Lint all
pnpm format        # Prettier check
```

Web app scripts (`apps/web`):

```bash
pnpm -F web dev        # Next.js dev with Turbopack
pnpm -F web build
pnpm -F web start
```

Convex scripts (`packages/convex`):

```bash
pnpm -F @terra/convex dev
pnpm -F @terra/convex setup
```

Smart contracts (`packages/s-contracts`): see Smart Contracts section above.

## ✅ Development Tips

- Ensure `.env` is at the repo root (the web app reads `../../.env`).
- If auth fails locally, verify `AUTH_SECRET`, `CONVEX_AUTH_PRIVATE_KEY`, and `CONVEX_AUTH_ADAPTER_SECRET` are set and consistent.
- After starting Convex dev, update `NEXT_PUBLIC_CONVEX_URL` with the printed URL.
- For Lisk Sepolia, add the network to your wallet if not present.

## 📄 License

MIT (or project-appropriate). Replace this line with the chosen license if different.

## 🙋 Project Links (for judges)

- Live demo: https://terra-sandy.vercel.app/
- Demo video: <add link>
