import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import { PageTransition } from './components/PageTransition'
import { ScrollToTop } from './components/ScrollToTop'
import { ProtectedRoute } from './components/ProtectedRoute'
import { FullScreenLoader } from './components/LoadingSpinner'
import { useAuth } from './contexts/AuthContext'
import { preloadAllRoutes } from './lib/route-preloader'
import { LinkPrefetcher } from './components/LinkPrefetcher'

const Home = lazy(() => import('./pages/Home'))
const Onboarding = lazy(() => import('./pages/Onboarding'))
const AuthLanding = lazy(() => import('./pages/AuthLanding'))
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'))
const ResetPassword = lazy(() => import('./pages/ResetPassword'))
const BankIDAuth = lazy(() => import('./pages/BankIDAuth'))
const AuthCallback = lazy(() => import('./pages/AuthCallback'))
const Profile = lazy(() => import('./pages/Profile'))
const Accounts = lazy(() => import('./pages/Accounts'))
const Invoices = lazy(() => import('./pages/Invoices'))
const Receipts = lazy(() => import('./pages/Receipts'))
const PrivateAccount = lazy(() => import('./pages/PrivateAccount'))
const StocksAndFunds = lazy(() => import('./pages/StocksAndFunds'))
const Loans = lazy(() => import('./pages/Loans'))
const Offers = lazy(() => import('./pages/Offers'))
const Mailbox = lazy(() => import('./pages/Mailbox'))
const Settings = lazy(() => import('./pages/Settings'))
const Documents = lazy(() => import('./pages/Documents'))
const Properties = lazy(() => import('./pages/Properties'))
const Marketplace = lazy(() => import('./pages/Marketplace'))
const Requests = lazy(() => import('./pages/Requests'))
const Notifications = lazy(() => import('./pages/Notifications'))
const Network = lazy(() => import('./pages/Network'))
const UserProfile = lazy(() => import('./pages/UserProfile'))
const ConnectBank = lazy(() => import('./pages/ConnectBank'))
const ConnectBankCallback = lazy(() => import('./pages/ConnectBankCallback'))
const Cards = lazy(() => import('./pages/Cards'))
const ConnectCards = lazy(() => import('./pages/ConnectCards'))
const ConnectLoans = lazy(() => import('./pages/ConnectLoans'))
const ConnectProperties = lazy(() => import('./pages/ConnectProperties'))
const PropertyHome = lazy(() => import('./pages/PropertyHome'))
const Assets = lazy(() => import('./pages/Assets'))
const Pension = lazy(() => import('./pages/Pension'))
const OrangeaKuvertet = lazy(() => import('./pages/OrangeaKuvertet'))
const Pensionsforsakringar = lazy(() => import('./pages/Pensionsforsakringar'))
const Abonnemang = lazy(() => import('./pages/Abonnemang'))
const TeliaKundkonto = lazy(() => import('./pages/TeliaKundkonto'))
const AbonnemangDetail = lazy(() => import('./pages/AbonnemangDetail'))
const AbonnemangKvitto = lazy(() => import('./pages/AbonnemangKvitto'))
const AbonnemangProviderPlaceholder = lazy(() => import('./pages/AbonnemangProviderPlaceholder'))
const SkatterDeklaration = lazy(() => import('./pages/SkatterDeklaration'))
const DeklarationDetail = lazy(() => import('./pages/DeklarationDetail'))
const Kuponger = lazy(() => import('./pages/Kuponger'))
const Health = lazy(() => import('./pages/Health'))
const Contracts = lazy(() => import('./pages/Contracts'))
const PersonalDocuments = lazy(() => import('./pages/PersonalDocuments'))
const School = lazy(() => import('./pages/School'))
const EnglishPreschool = lazy(() => import('./pages/School').then(m => ({ default: m.EnglishPreschool })))
const EnglishPreschoolAgreements = lazy(() => import('./pages/EnglishPreschoolAgreements'))
const Grades = lazy(() => import('./pages/Grades'))
const InCaseOfEmergency = lazy(() => import('./pages/Ice'))
const Inventories = lazy(() => import('./pages/Inventories'))
const InventoryItemBigChill = lazy(() => import('./pages/InventoryItemBigChill'))
const InventoryReceipt = lazy(() => import('./pages/InventoryReceipt'))
const InventoryFaultReport = lazy(() => import('./pages/InventoryFaultReport'))
const InventoryReceiptOffers = lazy(() => import('./pages/InventoryReceiptOffers'))
const Vehicles = lazy(() => import('./pages/Vehicles'))
const VehicleVolvoXC90 = lazy(() => import('./pages/VehicleVolvoXC90'))
const Boats = lazy(() => import('./pages/Boats'))
const BoatAquador26HT = lazy(() => import('./pages/BoatAquador26HT'))
const Insurances = lazy(() => import('./pages/Insurances'))
const HomeInsurance = lazy(() => import('./pages/HomeInsurance'))

function App() {
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      preloadAllRoutes()
    }
  }, [loading, user])

  if (loading) {
    return <FullScreenLoader />
  }

  return (
    <Layout>
      <ScrollToTop />
      <LinkPrefetcher />
      <PageTransition>
      <Suspense fallback={null}>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/home" replace /> : <AuthLanding />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate to="/home" replace /> : <ForgotPassword />}
        />
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />
        <Route
          path="/bankid-auth"
          element={<BankIDAuth />}
        />
        <Route
          path="/auth/callback"
          element={<AuthCallback />}
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts"
          element={
            <ProtectedRoute>
              <Accounts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <Invoices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/receipts"
          element={
            <ProtectedRoute>
              <Receipts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connect-bank"
          element={
            <ProtectedRoute>
              <ConnectBank />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connect-bank/callback"
          element={
            <ProtectedRoute>
              <ConnectBankCallback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/:accountId"
          element={
            <ProtectedRoute>
              <PrivateAccount />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/stocks"
          element={
            <ProtectedRoute>
              <StocksAndFunds />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/loans"
          element={
            <ProtectedRoute>
              <Loans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connect-loans"
          element={
            <ProtectedRoute>
              <ConnectLoans />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/assets"
          element={
            <ProtectedRoute>
              <Assets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pension"
          element={
            <ProtectedRoute>
              <Pension />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pension/orange-kuvert"
          element={
            <ProtectedRoute>
              <OrangeaKuvertet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pension/forsakringar"
          element={
            <ProtectedRoute>
              <Pensionsforsakringar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/abonnemang"
          element={
            <ProtectedRoute>
              <Abonnemang />
            </ProtectedRoute>
          }
        />
        <Route
          path="/abonnemang/telia"
          element={
            <ProtectedRoute>
              <TeliaKundkonto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/abonnemang/telia/12gb"
          element={
            <ProtectedRoute>
              <AbonnemangDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/abonnemang/telia/kvitto/:receiptId"
          element={
            <ProtectedRoute>
              <AbonnemangKvitto />
            </ProtectedRoute>
          }
        />
        <Route
          path="/abonnemang/:providerId"
          element={
            <ProtectedRoute>
              <AbonnemangProviderPlaceholder />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skatter"
          element={
            <ProtectedRoute>
              <SkatterDeklaration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/skatter/deklaration/:year"
          element={
            <ProtectedRoute>
              <DeklarationDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kuponger"
          element={
            <ProtectedRoute>
              <Kuponger />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cards"
          element={
            <ProtectedRoute>
              <Cards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connect-cards"
          element={
            <ProtectedRoute>
              <ConnectCards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/offers"
          element={
            <ProtectedRoute>
              <Offers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mailbox"
          element={
            <ProtectedRoute>
              <Mailbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Documents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/contracts"
          element={
            <ProtectedRoute>
              <Contracts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/personal"
          element={
            <ProtectedRoute>
              <PersonalDocuments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/grades"
          element={
            <ProtectedRoute>
              <Grades />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/ice"
          element={
            <ProtectedRoute>
              <InCaseOfEmergency />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/health"
          element={
            <ProtectedRoute>
              <Health />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/school"
          element={
            <ProtectedRoute>
              <School />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/school/english-preschool"
          element={
            <ProtectedRoute>
              <EnglishPreschool />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/school/english-preschool/agreements"
          element={
            <ProtectedRoute>
              <EnglishPreschoolAgreements />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties"
          element={
            <ProtectedRoute>
              <Properties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/inventories"
          element={
            <ProtectedRoute>
              <Inventories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/inventories/big-chill"
          element={
            <ProtectedRoute>
              <InventoryItemBigChill />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/inventories/big-chill/receipt"
          element={
            <ProtectedRoute>
              <InventoryReceipt />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/inventories/big-chill/fault-report"
          element={
            <ProtectedRoute>
              <InventoryFaultReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/inventories/big-chill/receipt-offers"
          element={
            <ProtectedRoute>
              <InventoryReceiptOffers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/inventories/big-chill/reclaim"
          element={
            <ProtectedRoute>
              <InventoryFaultReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/inventories/big-chill/dna"
          element={
            <ProtectedRoute>
              <InventoryFaultReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/vehicles"
          element={
            <ProtectedRoute>
              <Vehicles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/vehicles/volvo-xc90"
          element={
            <ProtectedRoute>
              <VehicleVolvoXC90 />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/boats"
          element={
            <ProtectedRoute>
              <Boats />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/boats/aquador-26ht"
          element={
            <ProtectedRoute>
              <BoatAquador26HT />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/insurances"
          element={
            <ProtectedRoute>
              <Insurances />
            </ProtectedRoute>
          }
        />
        <Route
          path="/properties/insurances/home"
          element={
            <ProtectedRoute>
              <HomeInsurance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/connect-properties"
          element={
            <ProtectedRoute>
              <ConnectProperties />
            </ProtectedRoute>
          }
        />
        <Route
          path="/property-home"
          element={
            <ProtectedRoute>
              <PropertyHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute>
              <Marketplace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/network"
          element={
            <ProtectedRoute>
              <Network />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:userId"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Routes>
      </Suspense>
      </PageTransition>
    </Layout>
  )
}

export default App
