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
        <Route path="/documents/health" element={<Health />} />
        <Route path="/properties" element={<Properties />} />
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

