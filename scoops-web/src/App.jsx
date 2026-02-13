import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; 
import { CartProvider } from "./context/CartContext"; 
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Orders from "./pages/Orders";
import AdminOrders from "./pages/AdminOrders";
import WhatsAppButton from './components/WhatsAppButton'; 
import InstagramButton from './components/InstagramButton';
import ConfirmPage from "./pages/ConfirmPage";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import AdminProducts from "./pages/AdminProducts";
import ProductDetails from "./pages/ProductDetails";
import AdminSuppliers from "./pages/AdminSuppliers";
import AdminDeliveries from "./pages/AdminDeliveries";
import AdminDeliveriesHistory from "./pages/AdminDeliveriesHistory";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* --- ROTAS PÚBLICAS --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetails />} /> {/* Usei o singular */}
            <Route path="/confirm" element={<ConfirmPage />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* --- ROTAS PROTEGIDAS (CLIENTE) --- */}
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="/payment/:id" element={<PrivateRoute><Payment /></PrivateRoute>} />
            <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />

            {/* --- ROTAS PROTEGIDAS (ADMIN) --- */}
            <Route path="/admin" element={<PrivateRoute role="ADMIN"><Admin /></PrivateRoute>} />
            <Route path="/admin-dashboard" element={<PrivateRoute role="ADMIN"><Dashboard /></PrivateRoute>} />
            <Route path="/admin-products" element={<PrivateRoute role="ADMIN"><AdminProducts /></PrivateRoute>} />
            <Route path="/admin-orders" element={<PrivateRoute role="ADMIN"><AdminOrders /></PrivateRoute>} />
            <Route path="/admin-suppliers" element={<PrivateRoute role="ADMIN"><AdminSuppliers /></PrivateRoute>} />
            <Route path="/admin-deliveries" element={<PrivateRoute role="ADMIN"><AdminDeliveries /></PrivateRoute>} />
            <Route path="/admin-deliveries-history" element={<PrivateRoute role="ADMIN"><AdminDeliveriesHistory /></PrivateRoute>} />
          </Routes>

          <InstagramButton />
          <WhatsAppButton />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;