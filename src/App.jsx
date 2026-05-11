import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import Delivery from './pages/Delivery';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Backup from './pages/Backup';
import Banners from './pages/Banners';
import Settings from './pages/Settings';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="customers" element={<Customers />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetails />} />
            <Route path="delivery" element={<Delivery />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="banners" element={<Banners />} />
            <Route path="reports" element={<Reports />} />
            <Route path="backup" element={<Backup />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
