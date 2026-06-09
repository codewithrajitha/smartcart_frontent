import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";
import Home from './pages/Home'
import "./App.css";
import UserViewProducts from './components/viewproducts'
import UserViewCart from './components/viewmycart'
import UserViewOrders from './components/myorders'
import SmartCartLanding from './components/landingpage'


import AdminDashboard from './components/Admin/dashboard'
import AddProducts from './components/Admin/add_products'
import ViewProducts from './components/Admin/view_products'
import EditProduct from './components/Admin/editproducts'
import ViewAllUsers from './components/Admin/viewallusers'
import ViewOrders from './components/Admin/vieworders'
import 'bootstrap/dist/css/bootstrap.min.css';
import SkinScanner from "./components/SkinScanner";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<SmartCartLanding />} />
        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/userviewproducts" element={<UserViewProducts />} />
        <Route path="/skinscanner" element={<SkinScanner />} />
        
        <Route path="/userviewcart" element={<UserViewCart onContinueShopping={() => window.location.href = '/userviewproducts'} />} />
     <Route
            path="/uservieworders"
            element={
              <UserViewOrders
                onGoShopping={() => window.location.href = '/userviewproducts'}
              />
            }
          />






        <Route path="/AdminHome" element={<AdminDashboard />} />
        <Route path="/AddProducts" element={<AddProducts />} />
        <Route path="/ViewProducts" element={<ViewProducts />} />
        <Route path="/EditProduct/:id" element={<EditProduct />} />
        <Route path="/ViewAllUsers" element={<ViewAllUsers />} />
        <Route path="/ViewOrders" element={<ViewOrders />} />


      </Routes>

    </BrowserRouter>
  );
}

export default App;