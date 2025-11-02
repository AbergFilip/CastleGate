# Contributing to CastleGate

Tack för ditt intresse att bidra till CastleGate! Denna guide hjälper dig att komma igång.

## Kodstandard

### TypeScript
- Använd strict mode
- Definiera typer för alla funktioner
- Använd interfaces för objektstrukturer
- Undvik `any` när möjligt

### Code Style
- Indentering: 2 spaces
- Max line length: 120 chars
- Använd ESLint + Prettier
- Skriv kommentarer för komplexa funktioner

### Git Commits
Använd konventionella commit-meddelanden:
- `feat:` Ny funktion
- `fix:` Bugfix
- `docs:` Dokumentation
- `refactor:` Kodrefaktorisering
- `test:` Test
- `chore:` Underhåll

Exempel:
```
feat: add BankID authentication endpoint
fix: resolve wallet balance calculation error
docs: update API documentation
```

## Utvecklingssetup

### Krav
- Node.js 20+
- npm eller yarn
- Git
- MongoDB (lokalt eller cloud)
- Xcode (för iOS)
- Android Studio (för Android)

### Installation

```bash
# Klona repot
git clone https://github.com/castlegate/castlegate.git
cd castlegate

# Installera dependencies
npm run install:all

# Starta backend
npm run dev:backend

# Starta mobile (nytt terminalfönster)
npm run dev:mobile

# Starta web (nytt terminalfönster)
npm run dev:web
```

## Testing

```bash
# Kör alla tester
npm test

# Kör backend tester
npm run test:backend

# Kör mobile tester
npm run test:mobile

# Coverage
npm run test:coverage
```

## Pull Request Process

1. Skapa en branch från `main`
   ```bash
   git checkout -b feature/my-feature
   ```

2. Gör dina ändringar
3. Commit med konventionella meddelanden
4. Push till GitHub
   ```bash
   git push origin feature/my-feature
   ```
5. Skapa Pull Request
6. Vänta på code review
7. Merge efter godkännande

## Checklist för PR

- [ ] Kod följer styleguide
- [ ] Tester går igenom
- [ ] Dokumentation uppdaterad
- [ ] Ingen console.log kvar
- [ ] Security: Inga secrets exposerade
- [ ] Performance: Inga prestandaproblem

## Security

**VIKTIGT**: Exponera ALDRIG secrets i kod:
- API keys
- Private keys
- Database credentials
- JWT secrets

Använd alltid miljövariabler!

## Frågor?

Öppna en issue eller kontakta utvecklingsteamet.

Tack för ditt bidrag! 🏰

