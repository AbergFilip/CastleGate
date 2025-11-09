import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
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
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/connect-bank" element={<ConnectBank />} />
        <Route path="/accounts/privatkonto" element={<PrivateAccount />} />
        <Route path="/accounts/stocks" element={<StocksAndFunds />} />
        <Route path="/accounts/assets" element={<Assets />} />
        <Route path="/cards" element={<Cards />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/mailbox" element={<Mailbox />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/documents/contracts" element={<Contracts />} />
        <Route path="/documents/personal" element={<PersonalDocuments />} />
        <Route path="/documents/grades" element={<Grades />} />
        <Route path="/documents/ice" element={<InCaseOfEmergency />} />
        <Route path="/documents/health" element={<Health />} />
        <Route path="/documents/school" element={<School />} />
        <Route path="/documents/school/english-preschool" element={<EnglishPreschool />} />
        <Route path="/documents/school/english-preschool/agreements" element={<EnglishPreschoolAgreements />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/properties/inventories" element={<Inventories />} />
        <Route path="/properties/inventories/big-chill" element={<InventoryItemBigChill />} />
        <Route path="/properties/inventories/big-chill/receipt" element={<InventoryReceipt />} />
        <Route path="/properties/inventories/big-chill/fault-report" element={<InventoryFaultReport />} />
        <Route path="/properties/inventories/big-chill/receipt-offers" element={<InventoryReceiptOffers />} />
        <Route path="/properties/inventories/big-chill/reclaim" element={<InventoryFaultReport />} />
        <Route path="/properties/inventories/big-chill/dna" element={<InventoryFaultReport />} />
        <Route path="/properties/vehicles" element={<Vehicles />} />
        <Route path="/properties/vehicles/volvo-xc90" element={<VehicleVolvoXC90 />} />
        <Route path="/properties/boats" element={<Boats />} />
        <Route path="/properties/boats/aquador-26ht" element={<BoatAquador26HT />} />
        <Route path="/properties/insurances" element={<Insurances />} />
        <Route path="/properties/insurances/home" element={<HomeInsurance />} />
        <Route path="/property-home" element={<PropertyHome />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/network" element={<Network />} />
      </Routes>
    </Layout>
  )
}

export default App

