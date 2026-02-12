import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; 
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

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin-suppliers" element={<AdminSuppliers />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/admin-orders" element={<AdminOrders />} />
          <Route path="/admin-products" element={<AdminProducts />} />
          <Route path="/confirm" element={<ConfirmPage />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/admin-deliveries" element={<AdminDeliveries />} />
          <Route path="/admin-deliveries-history" element={<AdminDeliveriesHistory />} />
        </Routes>


        <InstagramButton />
        <WhatsAppButton />

      </BrowserRouter>
    </CartProvider>
  );
}

export default App;