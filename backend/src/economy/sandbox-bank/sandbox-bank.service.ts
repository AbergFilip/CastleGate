import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';

interface SandboxSession {
  id: string;
  bankId: string;
  bankName: string;
  createdAt: number;
  accounts: SandboxAccount[];
}

export interface SandboxAccount {
  id: string;
  name: string;
  iban: string;
  accountNumber: string;
  currency: string;
  balance: number;
  type: string;
  ownerName: string;
}

export interface SandboxBank {
  id: string;
  name: string;
  logo: string;
  bic: string;
}

const SWEDISH_BANKS: SandboxBank[] = [
  { id: 'handelsbanken', name: 'Handelsbanken', logo: '🏦', bic: 'HANDSESS' },
  { id: 'swedbank', name: 'Swedbank', logo: '🟠', bic: 'SWEDSESS' },
  { id: 'nordea', name: 'Nordea', logo: '🔵', bic: 'NDEASESS' },
  { id: 'seb', name: 'SEB', logo: '🟢', bic: 'ESSESESS' },
  { id: 'icabanken', name: 'ICA Banken', logo: '🔴', bic: 'ICABSESS' },
  { id: 'lansforsakringar', name: 'Länsförsäkringar', logo: '🛡️', bic: 'ELLFSESS' },
  { id: 'skandia', name: 'Skandia', logo: '💎', bic: 'SKIASESS' },
  { id: 'avanza', name: 'Avanza Bank', logo: '📈', bic: 'AVABSESS' },
];

const ACCOUNT_TEMPLATES: Array<{
  name: string;
  type: string;
  balanceMin: number;
  balanceMax: number;
}> = [
  { name: 'Lönekonto', type: 'checking', balanceMin: 8500, balanceMax: 85000 },
  { name: 'Sparkonto', type: 'savings', balanceMin: 25000, balanceMax: 450000 },
  { name: 'Buffertkonto', type: 'savings', balanceMin: 10000, balanceMax: 120000 },
  { name: 'ISK', type: 'investment', balanceMin: 15000, balanceMax: 350000 },
  { name: 'Kreditkonto', type: 'credit', balanceMin: 5000, balanceMax: 75000 },
  { name: 'Resekassa', type: 'savings', balanceMin: 2000, balanceMax: 35000 },
];

export interface SandboxCard {
  id: string;
  cardType: 'debit' | 'credit';
  cardName: string;
  bankName: string;
  lastFour: string;
  balance: number;
  creditLimit?: number;
  availableCredit?: number;
  currency: string;
  expiryDate: string;
  ownerName: string;
}

const CARD_TEMPLATES: Array<{
  name: string;
  type: 'debit' | 'credit';
  balanceMin?: number;
  balanceMax?: number;
  creditLimitMin?: number;
  creditLimitMax?: number;
}> = [
  { name: 'Bankkort', type: 'debit', balanceMin: 8500, balanceMax: 75000 },
  { name: 'Privatkort', type: 'debit', balanceMin: 5000, balanceMax: 45000 },
  { name: 'Visa Gold', type: 'credit', creditLimitMin: 20000, creditLimitMax: 100000 },
  { name: 'Mastercard', type: 'credit', creditLimitMin: 15000, creditLimitMax: 80000 },
  { name: 'Företagskort', type: 'debit', balanceMin: 15000, balanceMax: 120000 },
];

export interface SandboxLoan {
  id: string;
  loanType: 'mortgage' | 'personal' | 'car' | 'student';
  loanName: string;
  bankName: string;
  amount: number;
  remainingAmount: number;
  interestRate: number;
  monthlyPayment: number;
  currency: string;
}

export interface SandboxProperty {
  id: string;
  address: string;
  city: string;
  postal_code: string;
  property_type: string;
  size_sqm: number;
  rooms: number;
  floor?: string;
  purchase_price: number;
  current_value: number;
  purchase_date: string;
}

const PROPERTY_TEMPLATES: Array<{
  address: string;
  city: string;
  postal_code: string;
  property_type: string;
  sizeMin: number;
  sizeMax: number;
  roomsMin: number;
  roomsMax: number;
  valueMin: number;
  valueMax: number;
}> = [
  { address: 'Storgatan 12', city: 'Stockholm', postal_code: '111 23', property_type: 'Lägenhet', sizeMin: 65, sizeMax: 95, roomsMin: 3, roomsMax: 4, valueMin: 3500000, valueMax: 5500000 },
  { address: 'Kungsgatan 45', city: 'Stockholm', postal_code: '111 56', property_type: 'Lägenhet', sizeMin: 45, sizeMax: 75, roomsMin: 2, roomsMax: 3, valueMin: 2500000, valueMax: 4200000 },
  { address: 'Linnégatan 8', city: 'Stockholm', postal_code: '114 47', property_type: 'Lägenhet', sizeMin: 85, sizeMax: 120, roomsMin: 4, roomsMax: 5, valueMin: 5500000, valueMax: 8500000 },
  { address: 'Sveavägen 102', city: 'Stockholm', postal_code: '113 57', property_type: 'Lägenhet', sizeMin: 55, sizeMax: 80, roomsMin: 2, roomsMax: 4, valueMin: 2800000, valueMax: 4800000 },
  { address: 'Vasagatan 22', city: 'Göteborg', postal_code: '411 24', property_type: 'Lägenhet', sizeMin: 60, sizeMax: 90, roomsMin: 3, roomsMax: 4, valueMin: 2200000, valueMax: 3800000 },
  { address: 'Avenyn 15', city: 'Göteborg', postal_code: '411 36', property_type: 'Lägenhet', sizeMin: 70, sizeMax: 100, roomsMin: 3, roomsMax: 5, valueMin: 3200000, valueMax: 5200000 },
  { address: 'Ekelundsgatan 4', city: 'Malmö', postal_code: '211 33', property_type: 'Lägenhet', sizeMin: 55, sizeMax: 85, roomsMin: 2, roomsMax: 4, valueMin: 1800000, valueMax: 3200000 },
  { address: 'Möllevångsgatan 28', city: 'Malmö', postal_code: '214 24', property_type: 'Lägenhet', sizeMin: 65, sizeMax: 95, roomsMin: 3, roomsMax: 4, valueMin: 2200000, valueMax: 3800000 },
  { address: 'Björkvägen 7', city: 'Uppsala', postal_code: '754 45', property_type: 'Villa', sizeMin: 120, sizeMax: 180, roomsMin: 5, roomsMax: 7, valueMin: 4200000, valueMax: 6500000 },
  { address: 'Solvägen 3', city: 'Lund', postal_code: '223 61', property_type: 'Radhus', sizeMin: 95, sizeMax: 130, roomsMin: 4, roomsMax: 5, valueMin: 3500000, valueMax: 5200000 },
  { address: 'Strandvägen 18', city: 'Helsingborg', postal_code: '252 23', property_type: 'Fritidshus', sizeMin: 45, sizeMax: 75, roomsMin: 2, roomsMax: 3, valueMin: 950000, valueMax: 1800000 },
  { address: 'Skogsvägen 12', city: 'Norrtälje', postal_code: '761 92', property_type: 'Fritidshus', sizeMin: 55, sizeMax: 90, roomsMin: 3, roomsMax: 4, valueMin: 1200000, valueMax: 2200000 },
];

export interface SandboxInvestment {
  id: string;
  provider: string;
  account_name: string;
  investment_type: 'stock' | 'fund' | 'etf';
  symbol: string;
  amount: number;
  quantity: number;
  purchase_price: number;
  current_price: number;
  currency: string;
  growth_percent: number;
  account_type: string;
}

const INVESTMENT_TEMPLATES: Array<{
  name: string;
  symbol: string;
  type: 'stock' | 'fund' | 'etf';
  priceMin: number;
  priceMax: number;
  quantityMin: number;
  quantityMax: number;
}> = [
  { name: 'Volvo B', symbol: 'VOLV-B.ST', type: 'stock', priceMin: 200, priceMax: 280, quantityMin: 20, quantityMax: 200 },
  { name: 'Ericsson B', symbol: 'ERIC-B.ST', type: 'stock', priceMin: 60, priceMax: 90, quantityMin: 50, quantityMax: 400 },
  { name: 'H&M B', symbol: 'HM-B.ST', type: 'stock', priceMin: 130, priceMax: 190, quantityMin: 30, quantityMax: 150 },
  { name: 'Atlas Copco A', symbol: 'ATCO-A.ST', type: 'stock', priceMin: 150, priceMax: 220, quantityMin: 10, quantityMax: 100 },
  { name: 'Investor B', symbol: 'INVE-B.ST', type: 'stock', priceMin: 200, priceMax: 280, quantityMin: 15, quantityMax: 80 },
  { name: 'Swedbank Robur Ny Teknik', symbol: 'ROBUR-NT', type: 'fund', priceMin: 80, priceMax: 150, quantityMin: 50, quantityMax: 500 },
  { name: 'Avanza Global', symbol: 'AVA-GLOBAL', type: 'fund', priceMin: 150, priceMax: 250, quantityMin: 30, quantityMax: 300 },
  { name: 'Länsförsäkringar Global Index', symbol: 'LF-GI', type: 'fund', priceMin: 200, priceMax: 350, quantityMin: 20, quantityMax: 200 },
  { name: 'SEB Sverige Indexfond', symbol: 'SEB-SVI', type: 'fund', priceMin: 100, priceMax: 200, quantityMin: 40, quantityMax: 250 },
  { name: 'Handelsbanken Hållbar Energi', symbol: 'SHB-HE', type: 'fund', priceMin: 90, priceMax: 160, quantityMin: 30, quantityMax: 200 },
  { name: 'XACT OMXS30', symbol: 'XACT-OMX', type: 'etf', priceMin: 250, priceMax: 350, quantityMin: 10, quantityMax: 100 },
  { name: 'iShares MSCI World', symbol: 'EUNL', type: 'etf', priceMin: 70, priceMax: 110, quantityMin: 20, quantityMax: 150 },
];

const LOAN_TEMPLATES: Array<{
  name: string;
  type: SandboxLoan['loanType'];
  amountMin: number;
  amountMax: number;
  rateMin: number;
  rateMax: number;
}> = [
  { name: 'Bostad', type: 'mortgage', amountMin: 1500000, amountMax: 5500000, rateMin: 1.5, rateMax: 3.8 },
  { name: 'Fritidshus', type: 'mortgage', amountMin: 800000, amountMax: 3000000, rateMin: 2.0, rateMax: 4.0 },
  { name: 'Privatlån', type: 'personal', amountMin: 20000, amountMax: 150000, rateMin: 5.0, rateMax: 12.0 },
  { name: 'Billån', type: 'car', amountMin: 50000, amountMax: 400000, rateMin: 3.0, rateMax: 7.0 },
  { name: 'Studielån', type: 'student', amountMin: 100000, amountMax: 400000, rateMin: 0.5, rateMax: 1.5 },
];

export interface SandboxVehicle {
  id: string;
  type: 'car' | 'motorcycle' | 'trailer';
  make: string;
  model: string;
  registration_number: string;
  year: number;
  color: string;
  vin: string;
  purchase_price: number;
  current_value: number;
}

const VEHICLE_TEMPLATES: Array<{
  type: 'car' | 'motorcycle' | 'trailer';
  make: string;
  model: string;
  colors: string[];
  yearMin: number;
  yearMax: number;
  priceMin: number;
  priceMax: number;
}> = [
  { type: 'car', make: 'Volvo', model: 'XC60', colors: ['Svart', 'Vit', 'Grå', 'Blå'], yearMin: 2019, yearMax: 2025, priceMin: 350000, priceMax: 650000 },
  { type: 'car', make: 'Volvo', model: 'XC90', colors: ['Svart', 'Vit', 'Silver'], yearMin: 2018, yearMax: 2025, priceMin: 500000, priceMax: 850000 },
  { type: 'car', make: 'Volvo', model: 'V60', colors: ['Grå', 'Vit', 'Blå', 'Röd'], yearMin: 2019, yearMax: 2025, priceMin: 280000, priceMax: 480000 },
  { type: 'car', make: 'BMW', model: '3-Serie', colors: ['Svart', 'Vit', 'Mineralgrå'], yearMin: 2018, yearMax: 2025, priceMin: 300000, priceMax: 550000 },
  { type: 'car', make: 'Audi', model: 'A4 Avant', colors: ['Svart', 'Grå', 'Vit'], yearMin: 2019, yearMax: 2025, priceMin: 320000, priceMax: 520000 },
  { type: 'car', make: 'Tesla', model: 'Model 3', colors: ['Vit', 'Svart', 'Röd', 'Blå'], yearMin: 2020, yearMax: 2025, priceMin: 380000, priceMax: 580000 },
  { type: 'car', make: 'Volkswagen', model: 'Passat', colors: ['Silver', 'Svart', 'Blå'], yearMin: 2018, yearMax: 2024, priceMin: 220000, priceMax: 420000 },
  { type: 'car', make: 'Toyota', model: 'RAV4', colors: ['Vit', 'Silver', 'Grön'], yearMin: 2019, yearMax: 2025, priceMin: 280000, priceMax: 480000 },
  { type: 'motorcycle', make: 'Husqvarna', model: 'Svartpilen 401', colors: ['Svart', 'Silver'], yearMin: 2020, yearMax: 2025, priceMin: 55000, priceMax: 85000 },
  { type: 'motorcycle', make: 'BMW', model: 'R 1250 GS', colors: ['Vit/Blå', 'Svart'], yearMin: 2019, yearMax: 2025, priceMin: 180000, priceMax: 280000 },
  { type: 'trailer', make: 'Brenderup', model: '4260 STB', colors: ['Galvad'], yearMin: 2015, yearMax: 2024, priceMin: 15000, priceMax: 35000 },
];

export interface SandboxBoat {
  id: string;
  type: 'motorboat' | 'sailboat';
  make: string;
  model: string;
  registration_number: string;
  year: number;
  length: number;
  engine_type: string;
  engine_power: string;
  mooring_location: string;
  purchase_price: number;
  current_value: number;
}

const BOAT_TEMPLATES: Array<{
  type: 'motorboat' | 'sailboat';
  make: string;
  model: string;
  lengthMin: number;
  lengthMax: number;
  engine_type: string;
  powerMin: number;
  powerMax: number;
  yearMin: number;
  yearMax: number;
  priceMin: number;
  priceMax: number;
  moorings: string[];
}> = [
  { type: 'motorboat', make: 'Aquador', model: '26 HT', lengthMin: 8.0, lengthMax: 8.5, engine_type: 'Diesel', powerMin: 200, powerMax: 300, yearMin: 2018, yearMax: 2025, priceMin: 800000, priceMax: 1400000, moorings: ['Djurgården, Stockholm', 'Saltsjöbaden'] },
  { type: 'motorboat', make: 'Nimbus', model: '305 Coupé', lengthMin: 9.0, lengthMax: 9.5, engine_type: 'Diesel', powerMin: 260, powerMax: 370, yearMin: 2018, yearMax: 2025, priceMin: 1200000, priceMax: 2000000, moorings: ['Sandhamn', 'Vaxholm'] },
  { type: 'motorboat', make: 'Yamarin', model: '63 DC', lengthMin: 6.0, lengthMax: 6.5, engine_type: 'Bensin', powerMin: 115, powerMax: 150, yearMin: 2019, yearMax: 2025, priceMin: 350000, priceMax: 600000, moorings: ['Nacka Strand', 'Lidingö'] },
  { type: 'motorboat', make: 'Buster', model: 'XL', lengthMin: 5.5, lengthMax: 6.0, engine_type: 'Bensin', powerMin: 80, powerMax: 115, yearMin: 2017, yearMax: 2024, priceMin: 180000, priceMax: 350000, moorings: ['Dalarö', 'Nynäshamn'] },
  { type: 'sailboat', make: 'Hallberg-Rassy', model: '40C', lengthMin: 12.0, lengthMax: 12.5, engine_type: 'Diesel', powerMin: 40, powerMax: 55, yearMin: 2015, yearMax: 2023, priceMin: 2500000, priceMax: 4500000, moorings: ['Långedrag, Göteborg', 'Marstrand'] },
  { type: 'sailboat', make: 'Najad', model: '355', lengthMin: 10.5, lengthMax: 11.0, engine_type: 'Diesel', powerMin: 30, powerMax: 40, yearMin: 2012, yearMax: 2022, priceMin: 1200000, priceMax: 2200000, moorings: ['Styrsö', 'Hönö'] },
];

export interface SandboxInsurance {
  id: string;
  category: string;
  type: string;
  insurance_company: string;
  policy_number: string;
  coverage_amount: number;
  premium: number;
  premium_frequency: string;
  start_date: string;
  expiry_date: string;
  deductible: number;
}

const INSURANCE_COMPANIES = [
  { id: 'if', name: 'If Skadeförsäkring' },
  { id: 'folksam', name: 'Folksam' },
  { id: 'trygg-hansa', name: 'Trygg-Hansa' },
  { id: 'lansforsakringar', name: 'Länsförsäkringar' },
  { id: 'dina-forsakringar', name: 'Dina Försäkringar' },
  { id: 'moderna', name: 'Moderna Försäkringar' },
  { id: 'aktsam', name: 'Aktsam' },
];

const INSURANCE_TEMPLATES: Array<{
  category: string;
  type: string;
  coverageMin: number;
  coverageMax: number;
  premiumMin: number;
  premiumMax: number;
  deductibleMin: number;
  deductibleMax: number;
}> = [
  { category: 'property', type: 'Hemförsäkring', coverageMin: 500000, coverageMax: 2000000, premiumMin: 150, premiumMax: 400, deductibleMin: 1500, deductibleMax: 3000 },
  { category: 'property', type: 'Bostadsrättstillägg', coverageMin: 1000000, coverageMax: 5000000, premiumMin: 100, premiumMax: 300, deductibleMin: 1500, deductibleMax: 5000 },
  { category: 'property', type: 'Villaförsäkring', coverageMin: 3000000, coverageMax: 8000000, premiumMin: 350, premiumMax: 800, deductibleMin: 3000, deductibleMax: 7000 },
  { category: 'vehicle', type: 'Bilförsäkring – Helförsäkring', coverageMin: 200000, coverageMax: 800000, premiumMin: 300, premiumMax: 800, deductibleMin: 3000, deductibleMax: 7000 },
  { category: 'vehicle', type: 'Bilförsäkring – Halvförsäkring', coverageMin: 100000, coverageMax: 400000, premiumMin: 200, premiumMax: 500, deductibleMin: 3000, deductibleMax: 5000 },
  { category: 'vehicle', type: 'MC-försäkring', coverageMin: 50000, coverageMax: 200000, premiumMin: 100, premiumMax: 350, deductibleMin: 2000, deductibleMax: 5000 },
  { category: 'boat', type: 'Båtförsäkring', coverageMin: 200000, coverageMax: 2000000, premiumMin: 200, premiumMax: 600, deductibleMin: 3000, deductibleMax: 8000 },
  { category: 'healthcare', type: 'Sjukvårdsförsäkring', coverageMin: 0, coverageMax: 0, premiumMin: 200, premiumMax: 500, deductibleMin: 0, deductibleMax: 500 },
  { category: 'income', type: 'Inkomstförsäkring', coverageMin: 0, coverageMax: 0, premiumMin: 150, premiumMax: 400, deductibleMin: 0, deductibleMax: 0 },
  { category: 'travel', type: 'Reseförsäkring', coverageMin: 100000, coverageMax: 500000, premiumMin: 50, premiumMax: 200, deductibleMin: 1000, deductibleMax: 3000 },
  { category: 'alarm', type: 'Trygghetspaket med larm', coverageMin: 0, coverageMax: 0, premiumMin: 300, premiumMax: 600, deductibleMin: 0, deductibleMax: 0 },
];

const OWNER_NAMES = [
  'Filip Åberg',
  'Test Testsson',
  'Anna Svensson',
  'Erik Johansson',
];

@Injectable()
export class SandboxBankService {
  private readonly logger = new Logger(SandboxBankService.name);
  private sessions = new Map<string, SandboxSession>();

  getBanks(): SandboxBank[] {
    return SWEDISH_BANKS;
  }

  createSession(bankId: string): SandboxSession {
    const bank = SWEDISH_BANKS.find((b) => b.id === bankId);
    if (!bank) {
      throw new Error(`Okänd bank: ${bankId}`);
    }

    const numAccounts = 2 + Math.floor(Math.random() * 3);
    const shuffled = [...ACCOUNT_TEMPLATES]
      .sort(() => Math.random() - 0.5)
      .slice(0, numAccounts);

    const ownerName =
      OWNER_NAMES[Math.floor(Math.random() * OWNER_NAMES.length)];

    const accounts: SandboxAccount[] = shuffled.map((tpl) => {
      const balance =
        Math.round(
          (tpl.balanceMin +
            Math.random() * (tpl.balanceMax - tpl.balanceMin)) *
            100,
        ) / 100;

      const clearingNumber = (1000 + Math.floor(Math.random() * 8999)).toString();
      const accountDigits = Array.from({ length: 7 }, () =>
        Math.floor(Math.random() * 10),
      ).join('');
      const accountNumber = `${clearingNumber}-${accountDigits}`;

      const ibanDigits = clearingNumber + accountDigits + '00';
      const ibanCheck = 98 - (parseInt(ibanDigits.slice(0, 10)) % 97);
      const iban = `SE${ibanCheck.toString().padStart(2, '0')} ${clearingNumber} 0000 ${accountDigits.slice(0, 3)} ${accountDigits.slice(3)}`;

      return {
        id: randomUUID(),
        name: tpl.name,
        iban,
        accountNumber,
        currency: 'SEK',
        balance,
        type: tpl.type,
        ownerName,
      };
    });

    const session: SandboxSession = {
      id: randomUUID(),
      bankId,
      bankName: bank.name,
      createdAt: Date.now(),
      accounts,
    };

    this.sessions.set(session.id, session);

    this.cleanupOldSessions();

    this.logger.log(
      `Sandbox session ${session.id}: ${bank.name}, ${accounts.length} konton`,
    );
    return session;
  }

  getSession(sessionId: string): SandboxSession | null {
    return this.sessions.get(sessionId) ?? null;
  }

  refreshBalance(
    accountId: string,
  ): { value: number; currency: string } | null {
    for (const session of this.sessions.values()) {
      const account = session.accounts.find((a) => a.id === accountId);
      if (account) {
        const change = (Math.random() - 0.4) * 500;
        account.balance = Math.round((account.balance + change) * 100) / 100;
        return { value: account.balance, currency: account.currency };
      }
    }
    return null;
  }

  generateLoans(bankId: string): SandboxLoan[] {
    const bank = SWEDISH_BANKS.find((b) => b.id === bankId);
    if (!bank) throw new Error(`Okänd bank: ${bankId}`);

    const shuffled = [...LOAN_TEMPLATES].sort(() => Math.random() - 0.5);
    const count = 1 + Math.floor(Math.random() * 3);
    const picked = shuffled.slice(0, count);

    return picked.map((tpl) => {
      const amount =
        Math.round(
          (tpl.amountMin + Math.random() * (tpl.amountMax - tpl.amountMin)) / 1000,
        ) * 1000;
      const paidOff = Math.random() * 0.35;
      const remaining = Math.round(amount * (1 - paidOff));
      const rate =
        Math.round((tpl.rateMin + Math.random() * (tpl.rateMax - tpl.rateMin)) * 100) / 100;
      const monthlyInterest = (remaining * (rate / 100)) / 12;
      const amortization = tpl.type === 'mortgage' ? remaining / (30 * 12) : remaining / (5 * 12);
      const monthly = Math.round(monthlyInterest + amortization);

      return {
        id: randomUUID(),
        loanType: tpl.type,
        loanName: tpl.name,
        bankName: bank.name,
        amount,
        remainingAmount: remaining,
        interestRate: rate,
        monthlyPayment: monthly,
        currency: 'SEK',
      };
    });
  }

  generateCards(bankId: string): SandboxCard[] {
    const bank = SWEDISH_BANKS.find((b) => b.id === bankId);
    if (!bank) throw new Error(`Okänd bank: ${bankId}`);

    const ownerName =
      OWNER_NAMES[Math.floor(Math.random() * OWNER_NAMES.length)];

    const cards: SandboxCard[] = [];

    const debitTpl =
      CARD_TEMPLATES.filter((t) => t.type === 'debit').sort(() => Math.random() - 0.5)[0];
    cards.push(this.buildCard(debitTpl, bank.name, ownerName));

    if (Math.random() > 0.3) {
      const creditTpl =
        CARD_TEMPLATES.filter((t) => t.type === 'credit').sort(() => Math.random() - 0.5)[0];
      cards.push(this.buildCard(creditTpl, bank.name, ownerName));
    }

    if (Math.random() > 0.6) {
      const extraTpl =
        CARD_TEMPLATES.filter((t) => t.type !== cards[cards.length - 1]?.cardType)
          .sort(() => Math.random() - 0.5)[0];
      if (extraTpl) cards.push(this.buildCard(extraTpl, bank.name, ownerName));
    }

    return cards;
  }

  generateInvestments(bankId: string): SandboxInvestment[] {
    const bank = SWEDISH_BANKS.find((b) => b.id === bankId);
    if (!bank) throw new Error(`Okänd bank: ${bankId}`);

    const shuffled = [...INVESTMENT_TEMPLATES].sort(() => Math.random() - 0.5);
    const count = 2 + Math.floor(Math.random() * 4); // 2-5 investments
    const picked = shuffled.slice(0, count);

    return picked.map((tpl) => {
      const purchasePrice =
        Math.round((tpl.priceMin + Math.random() * (tpl.priceMax - tpl.priceMin)) * 100) / 100;
      const changePercent = -15 + Math.random() * 40; // -15% to +25%
      const currentPrice =
        Math.round(purchasePrice * (1 + changePercent / 100) * 100) / 100;
      const quantity =
        tpl.quantityMin + Math.floor(Math.random() * (tpl.quantityMax - tpl.quantityMin));
      const amount = Math.round(currentPrice * quantity * 100) / 100;
      const growthPercent = Math.round(changePercent * 100) / 100;

      return {
        id: randomUUID(),
        provider: bank.name,
        account_name: tpl.type === 'stock' ? 'ISK' : tpl.type === 'etf' ? 'ISK' : 'Fondkonto',
        investment_type: tpl.type,
        symbol: tpl.symbol,
        amount,
        quantity,
        purchase_price: purchasePrice,
        current_price: currentPrice,
        currency: 'SEK',
        growth_percent: growthPercent,
        account_type: 'ISK',
      };
    });
  }

  generateProperties(): SandboxProperty[] {
    const shuffled = [...PROPERTY_TEMPLATES].sort(() => Math.random() - 0.5);
    const count = 1 + Math.floor(Math.random() * 2);
    const picked = shuffled.slice(0, count);

    return picked.map((tpl) => {
      const size = Math.round(
        tpl.sizeMin + Math.random() * (tpl.sizeMax - tpl.sizeMin),
      );
      const rooms =
        tpl.roomsMin + Math.floor(Math.random() * (tpl.roomsMax - tpl.roomsMin + 1));
      const purchasePrice = Math.round(
        (tpl.valueMin + Math.random() * (tpl.valueMax - tpl.valueMin)) / 50000,
      ) * 50000;
      const appreciation = 0.05 + Math.random() * 0.25;
      const currentValue = Math.round(purchasePrice * (1 + appreciation) / 50000) * 50000;
      const yearsAgo = 2 + Math.floor(Math.random() * 8);
      const purchaseDate = new Date();
      purchaseDate.setFullYear(purchaseDate.getFullYear() - yearsAgo);
      purchaseDate.setMonth(Math.floor(Math.random() * 12));
      purchaseDate.setDate(1);

      return {
        id: randomUUID(),
        address: tpl.address,
        city: tpl.city,
        postal_code: tpl.postal_code,
        property_type: tpl.property_type,
        size_sqm: size,
        rooms,
        floor: tpl.property_type === 'Lägenhet' ? `${1 + Math.floor(Math.random() * 5)} tr` : undefined,
        purchase_price: purchasePrice,
        current_value: currentValue,
        purchase_date: purchaseDate.toISOString().slice(0, 10),
      };
    });
  }

  getInsuranceCompanies() {
    return INSURANCE_COMPANIES;
  }

  generateVehicles(): SandboxVehicle[] {
    const shuffled = [...VEHICLE_TEMPLATES].sort(() => Math.random() - 0.5);
    const count = 1 + Math.floor(Math.random() * 3);
    const picked = shuffled.slice(0, count);

    return picked.map((tpl) => {
      const year = tpl.yearMin + Math.floor(Math.random() * (tpl.yearMax - tpl.yearMin + 1));
      const color = tpl.colors[Math.floor(Math.random() * tpl.colors.length)];
      const purchasePrice = Math.round((tpl.priceMin + Math.random() * (tpl.priceMax - tpl.priceMin)) / 5000) * 5000;
      const depreciation = 0.05 + Math.random() * 0.25;
      const currentValue = Math.round(purchasePrice * (1 - depreciation) / 5000) * 5000;
      const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
      const regLetter = () => letters[Math.floor(Math.random() * letters.length)];
      const regNum = () => Math.floor(Math.random() * 10);
      const registration = `${regLetter()}${regLetter()}${regLetter()} ${regNum()}${regNum()}${regLetter()}`;
      const vinChars = '0123456789ABCDEFGHJKLMNPRSTUVWXYZ';
      const vin = Array.from({ length: 17 }, () => vinChars[Math.floor(Math.random() * vinChars.length)]).join('');

      return {
        id: randomUUID(),
        type: tpl.type,
        make: tpl.make,
        model: tpl.model,
        registration_number: registration,
        year,
        color,
        vin,
        purchase_price: purchasePrice,
        current_value: currentValue,
      };
    });
  }

  generateBoats(): SandboxBoat[] {
    const shuffled = [...BOAT_TEMPLATES].sort(() => Math.random() - 0.5);
    const count = 1 + Math.floor(Math.random() * 2);
    const picked = shuffled.slice(0, count);

    return picked.map((tpl) => {
      const year = tpl.yearMin + Math.floor(Math.random() * (tpl.yearMax - tpl.yearMin + 1));
      const length = Math.round((tpl.lengthMin + Math.random() * (tpl.lengthMax - tpl.lengthMin)) * 10) / 10;
      const power = tpl.powerMin + Math.floor(Math.random() * (tpl.powerMax - tpl.powerMin));
      const purchasePrice = Math.round((tpl.priceMin + Math.random() * (tpl.priceMax - tpl.priceMin)) / 10000) * 10000;
      const depreciation = 0.05 + Math.random() * 0.2;
      const currentValue = Math.round(purchasePrice * (1 - depreciation) / 10000) * 10000;
      const mooring = tpl.moorings[Math.floor(Math.random() * tpl.moorings.length)];
      const regNum = String(10000 + Math.floor(Math.random() * 89999));

      return {
        id: randomUUID(),
        type: tpl.type,
        make: tpl.make,
        model: tpl.model,
        registration_number: `SE${regNum}`,
        year,
        length,
        engine_type: tpl.engine_type,
        engine_power: `${power} hk`,
        mooring_location: mooring,
        purchase_price: purchasePrice,
        current_value: currentValue,
      };
    });
  }

  generateInsurances(companyId: string): SandboxInsurance[] {
    const company = INSURANCE_COMPANIES.find((c) => c.id === companyId);
    if (!company) throw new Error(`Okänt försäkringsbolag: ${companyId}`);

    const shuffled = [...INSURANCE_TEMPLATES].sort(() => Math.random() - 0.5);
    const count = 2 + Math.floor(Math.random() * 3);
    const picked = shuffled.slice(0, count);

    const now = new Date();

    return picked.map((tpl) => {
      const coverage = tpl.coverageMax > 0
        ? Math.round((tpl.coverageMin + Math.random() * (tpl.coverageMax - tpl.coverageMin)) / 10000) * 10000
        : 0;
      const premium = Math.round(tpl.premiumMin + Math.random() * (tpl.premiumMax - tpl.premiumMin));
      const deductible = Math.round((tpl.deductibleMin + Math.random() * (tpl.deductibleMax - tpl.deductibleMin)) / 500) * 500;
      const startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 10));
      const expiryDate = new Date(startDate);
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);
      const policyNum = `${company.id.toUpperCase().slice(0, 3)}-${100000 + Math.floor(Math.random() * 899999)}`;

      return {
        id: randomUUID(),
        category: tpl.category,
        type: tpl.type,
        insurance_company: company.name,
        policy_number: policyNum,
        coverage_amount: coverage,
        premium,
        premium_frequency: 'monthly',
        start_date: startDate.toISOString().slice(0, 10),
        expiry_date: expiryDate.toISOString().slice(0, 10),
        deductible,
      };
    });
  }

  private buildCard(
    tpl: (typeof CARD_TEMPLATES)[number],
    bankName: string,
    ownerName: string,
  ): SandboxCard {
    const lastFour = String(1000 + Math.floor(Math.random() * 8999));
    const expiryYear = 2027 + Math.floor(Math.random() * 3);
    const expiryMonth = 1 + Math.floor(Math.random() * 12);
    const expiry = `${expiryYear}-${String(expiryMonth).padStart(2, '0')}-01`;

    if (tpl.type === 'credit') {
      const limit =
        Math.round(
          (tpl.creditLimitMin! +
            Math.random() * (tpl.creditLimitMax! - tpl.creditLimitMin!)) /
            1000,
        ) * 1000;
      const used = Math.round(Math.random() * limit * 0.4);
      return {
        id: randomUUID(),
        cardType: 'credit',
        cardName: tpl.name,
        bankName,
        lastFour,
        balance: 0,
        creditLimit: limit,
        availableCredit: limit - used,
        currency: 'SEK',
        expiryDate: expiry,
        ownerName,
      };
    }

    const balance =
      Math.round(
        (tpl.balanceMin! + Math.random() * (tpl.balanceMax! - tpl.balanceMin!)) * 100,
      ) / 100;
    return {
      id: randomUUID(),
      cardType: 'debit',
      cardName: tpl.name,
      bankName,
      lastFour,
      balance,
      currency: 'SEK',
      expiryDate: expiry,
      ownerName,
    };
  }

  private cleanupOldSessions(): void {
    const maxAge = 24 * 60 * 60 * 1000;
    const now = Date.now();
    for (const [id, session] of this.sessions) {
      if (now - session.createdAt > maxAge) {
        this.sessions.delete(id);
      }
    }
  }
}
