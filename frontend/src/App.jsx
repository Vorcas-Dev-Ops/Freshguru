import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Partners from './pages/Partners';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Delivery from './pages/Delivery';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Backup from './pages/Backup';
import Banners from './pages/Banners';
import Settings from './pages/Settings';
import Logs from './pages/Logs';
import FarmInventory from './pages/FarmInventory';
import Login from './pages/Login';
import Invoice from './pages/Invoice';

// Insights Pages
import BusinessOverview from './pages/insights/BusinessOverview';
import SalesAnalytics from './pages/insights/SalesAnalytics';
import InventoryInsights from './pages/insights/InventoryInsights';
import CustomerInsights from './pages/insights/CustomerInsights';
import PaymentInsights from './pages/insights/PaymentInsights';
import DeliveryInsights from './pages/insights/DeliveryInsights';
import BranchPerformance from './pages/insights/BranchPerformance';
import ProductPerformance from './pages/insights/ProductPerformance';
import FinancialInsights from './pages/insights/FinancialInsights';
import ForecastTrends from './pages/insights/ForecastTrends';

import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/invoice/:id" element={<Invoice />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="partners" element={<Partners />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="orders" element={<Orders />} />
              <Route path="orders/:id" element={<OrderDetails />} />
              <Route path="delivery" element={<Delivery />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="banners" element={<Banners />} />
              <Route path="reports" element={<Reports />} />
              <Route path="insights">
                <Route index element={<Navigate to="overview" replace />} />
                <Route path="overview" element={<BusinessOverview />} />
                <Route path="sales" element={<SalesAnalytics />} />
                <Route path="inventory" element={<InventoryInsights />} />
                <Route path="customers" element={<CustomerInsights />} />
                <Route path="payments" element={<PaymentInsights />} />
                <Route path="delivery" element={<DeliveryInsights />} />
                <Route path="branches" element={<BranchPerformance />} />
                <Route path="products" element={<ProductPerformance />} />
                <Route path="financial" element={<FinancialInsights />} />
                <Route path="forecast" element={<ForecastTrends />} />
              </Route>
              <Route path="backup" element={<Backup />} />
              <Route path="settings" element={<Settings />} />
              <Route path="logs" element={<Logs />} />
              <Route path="farm-inventory" element={<FarmInventory />} />
            </Route>
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
