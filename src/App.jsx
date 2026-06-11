import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from './pages/Home'
import "./App.css";
import UserViewProducts from './components/Viewproducts'
import UserViewCart from './components/Viewmycart'
import UserViewOrders from './components/Myorders'
import SmartCartLanding from './components/Landingpage'


import AdminDashboard from './components/Admin/Dashboard'
import AddProducts from './components/Admin/Add_products'
import ViewProducts from './components/Admin/View_products'
import EditProduct from './components/Admin/Editproducts'
import ViewAllUsers from './components/Admin/Viewallusers'
import ViewOrders from './components/Admin/Vieworders'
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