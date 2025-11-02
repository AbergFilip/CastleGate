# CastleGate Architecture

## Systemöversikt

CastleGate är uppdelat i tre huvudkomponenter:
1. **Backend API** - Node.js/Express server
2. **Mobile App** - React Native (iOS/Android)
3. **Web Dashboard** - B2B plattform (kommande)

---

## Backend Architecture

### Tech Stack
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (tillfällig, byts ut mot blockchain)
- **Blockchain**: Ethers.js / Web3.js
- **Authentication**: JWT + BankID integration
- **Logging**: Winston

### Projektstruktur
```
backend/
├── src/
│   ├── index.ts              # Entry point
│   ├── config/               # Configuration
│   │   └── logger.ts
│   ├── middleware/           # Express middleware
│   │   ├── auth.ts          # JWT authentication
│   │   ├── errorHandler.ts  # Error handling
│   │   └── rateLimiter.ts   # Rate limiting
│   ├── routes/              # API routes
│   │   ├── auth.ts          # BankID auth
│   │   ├── users.ts         # User management
│   │   ├── documents.ts     # Document storage
│   │   ├── blockchain.ts    # Blockchain ops
│   │   ├── ai.ts            # AI assistant
│   │   └── marketplace.ts   # Marketplace
│   ├── controllers/         # Route handlers
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── documents.ts
│   │   ├── blockchain.ts
│   │   ├── ai.ts
│   │   └── marketplace.ts
│   └── models/              # Data models (kommande)
├── package.json
└── tsconfig.json
```

### API Endpoints

#### Authentication
- `POST /api/auth/bankid` - Initiate BankID login
- `POST /api/auth/bankid/verify` - Verify BankID token

#### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

#### Documents
- `POST /api/documents` - Upload document
- `GET /api/documents` - List documents
- `GET /api/documents/:id` - Get document
- `PUT /api/documents/:id` - Update document
- `DELETE /api/documents/:id` - Delete document

#### Blockchain
- `POST /api/blockchain/wallet/generate` - Generate wallet
- `GET /api/blockchain/wallet/address` - Get address
- `POST /api/blockchain/contract/create` - Create contract
- `POST /api/blockchain/contract/execute` - Execute contract
- `GET /api/blockchain/coins/balance` - Get CGC balance
- `POST /api/blockchain/coins/transfer` - Transfer coins

#### AI Assistant
- `GET /api/ai/assistant` - Get AI info
- `POST /api/ai/ask` - Ask AI
- `POST /api/ai/compare` - Compare products
- `GET /api/ai/contracts` - Monitored contracts
- `GET /api/ai/recommendations` - Recommendations

#### Marketplace
- `GET /api/marketplace` - Get marketplace
- `POST /api/marketplace/add` - Add item
- `DELETE /api/marketplace/:id` - Remove item
- `PUT /api/marketplace/settings` - Update settings
- `GET /api/marketplace/preferences` - Get preferences

---

## Mobile App Architecture

### Tech Stack
- **Framework**: React Native 0.72+
- **Language**: TypeScript
- **Navigation**: React Navigation
- **UI**: React Native Paper
- **State Management**: Context API
- **Storage**: AsyncStorage + Keychain
- **Blockchain**: Ethers.js
- **HTTP**: Axios

### Projektstruktur
```
mobile/
├── src/
│   ├── App.tsx              # Root component
│   ├── config/
│   │   └── api.ts          # API configuration
│   ├── contexts/
│   │   └── AuthContext.tsx # Auth state
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── DocumentsScreen.tsx
│   │   ├── WalletScreen.tsx
│   │   ├── AIScreen.tsx
│   │   ├── MarketplaceScreen.tsx
│   │   └── ProfileScreen.tsx
│   └── theme/
│       └── theme.ts        # Theme configuration
├── package.json
└── tsconfig.json
```

### Navigation Flow
```
Login → Home (Tabs)
         ├── Documents
         ├── Wallet
         ├── AI Assistant
         ├── Marketplace
         └── Profile
```

---

## Security Architecture

### Private Key Management
- Private keys lagras ALDRIG i klartext
- Används biometrics (iOS Touch/Face ID, Android Fingerprint) för att skydda keys
- Keys krypteras med AES-256
- Hårdvaru-backup (Keychain/Keystore)

### Authentication Flow
1. BankID inloggning initieras
2. Användare verifierar i BankID app
3. Backend verifierar BankID token
4. Backend genererar JWT
5. Mobile app sparar JWT i Keychain
6. Biometric prompt för framtida inloggningar

### Data Encryption
- All data krypterad at rest
- TLS 1.3 för data in transit
- Documents krypteras före uppladdning
- Blockchain transaktioner signeras med private key

---

## Blockchain Integration

### Castlegate Coins (CGC)
- ERC-20 token på Ethereum/compatible chain
- Smart contracts för säker token management
- Biometric-autentiserade transaktioner

### Smart Contracts
- Document storage verification
- Permission marketing agreements
- Marketplace transactions
- Loyalty/rewards system

### Network Choice
- Testnet: Sepolia
- Mainnet: (TBD - Ethereum/Arbitrum/Polygon?)

---

## AI Integration

### Ethical GAI (Generative AI)
- Permission-based conversations
- Privacy-first design
- No user data training
- Transparent AI decisions

### Use Cases
1. **Product Comparison** - AI jämför produkter baserat på användarens behov
2. **Contract Monitoring** - AI övervakar avtal och försäkringar
3. **Recommendations** - AI föreslår bättre deals
4. **Security** - AI upptäcker bedrägeriförsök

### Planned Integrations
- OpenAI GPT-4
- Anthropic Claude
- Local models för känslig data

---

## Deployment Architecture

### Backend
```
Cloud Provider (AWS/GCP/Azure)
├── Load Balancer
├── API Servers (Container)
├── MongoDB Cluster
├── Blockchain Node
└── Storage Bucket
```

### Mobile
- iOS: App Store
- Android: Google Play Store
- FOTA updates via CodePush

---

## Development Roadmap

### Fas 1 - Data (15 MSEK)
- [x] Basic backend structure
- [x] Mobile app shell
- [ ] BankID integration
- [ ] Document storage
- [ ] Private key management
- [ ] Biometric auth

### Fas 2 - Kontroll (50-100 MSEK)
- [ ] Full document management
- [ ] Blockchain wallet
- [ ] Smart contracts
- [ ] Asset management
- [ ] Advanced security

### Fas 3 - Reklam
- [ ] AI assistant
- [ ] Permission marketing
- [ ] Product comparison
- [ ] Recommendation engine

### Fas 4 - Marknadsplats
- [ ] B2B web platform
- [ ] Marketplace functionality
- [ ] Castlegate Coins integration
- [ ] Revenue sharing

---

## Contact
För frågor om arkitektur, kontakta utvecklingsteamet.

