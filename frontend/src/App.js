import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter, routes, route, Routes, Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import men_banner from './Components/Assets/banner_mens.png';
import women_banner from './Components/Assets/banner_women.png';
import kids_banner from './Components/Assets/banner_kids.png';
import Footer from './Components/Footer/Footer';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
            <Route path='/' element={<Shop />}/>
            <Route path='/men' element={<ShopCategory banner={men_banner} category="men"/>}/>
            <Route path='/women' element={<ShopCategory banner={women_banner} category="women"/>}/>
            <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kid"/>}/>
            <Route path = "/product" element={<Product />}>
              <Route path = ":productId" element={<Product />} />
            </Route>
            <Route path = "/cart" element={<Cart />}></Route>
            <Route path = "/login" element={<LoginSignup />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
