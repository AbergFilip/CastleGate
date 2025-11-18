import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { OnboardingCheck } from './components/OnboardingCheck'
import { useAuth } from './contexts/AuthContext'
import Home from './pages/Home'
import AuthLanding from './pages/AuthLanding'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import BankIDAuth from './pages/BankIDAuth'
import Onboarding from './pages/Onboarding'
import Profile from './pages/Profile'
import Accounts from './pages/Accounts'
import PrivateAccount from './pages/PrivateAccount'
import StocksAndFunds from './pages/StocksAndFunds'
import Offers from './pages/Offers'
import Mailbox from './pages/Mailbox'
import Settings from './pages/Settings'
import Documents from './pages/Documents'
import Properties from './pages/Properties'
import Marketplace from './pages/Marketplace'
import Requests from './pages/Requests'
import Notifications from './pages/Notifications'
import Network from './pages/Network'
import ConnectBank from './pages/ConnectBank'
import Cards from './pages/Cards'
import PropertyHome from './pages/PropertyHome'
import Assets from './pages/Assets'
import Health from './pages/Health'
import Contracts from './pages/Contracts'
import PersonalDocuments from './pages/PersonalDocuments'
import School, { EnglishPreschool } from './pages/School'
import EnglishPreschoolAgreements from './pages/EnglishPreschoolAgreements'
import Grades from './pages/Grades'
import InCaseOfEmergency from './pages/Ice'
import Inventories from './pages/Inventories'
import InventoryItemBigChill from './pages/InventoryItemBigChill'
import InventoryReceipt from './pages/InventoryReceipt'
import InventoryFaultReport from './pages/InventoryFaultReport'
import InventoryReceiptOffers from './pages/InventoryReceiptOffers'
import Vehicles from './pages/Vehicles'
import VehicleVolvoXC90 from './pages/VehicleVolvoXC90'
import Boats from './pages/Boats'
import BoatAquador26HT from './pages/BoatAquador26HT'
import Insurances from './pages/Insurances'
import HomeInsurance from './pages/HomeInsurance'

function App() {
  const { user, loading } = useAuth()

  // Visa loading medan vi kontrollerar auth state
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          backgroundColor: '#F5F5F5',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              border: '4px solid #E6E6E6',
              borderTop: '4px solid #146D7B',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px',
            }}
          />
          <p style={{ color: '#4F4F4F', fontSize: '16px' }}>Laddar...</p>
        </div>
      </div>
    )
  }

  return (
    <Layout>
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
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <OnboardingCheck>
                <Home />
              </OnboardingCheck>
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
          path="/connect-bank"
          element={
            <ProtectedRoute>
              <ConnectBank />
            </ProtectedRoute>
          }
        />
        <Route
          path="/accounts/privatkonto"
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
          path="/accounts/assets"
          element={
            <ProtectedRoute>
              <Assets />
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
      </Routes>
    </Layout>
  )
}

export default App

