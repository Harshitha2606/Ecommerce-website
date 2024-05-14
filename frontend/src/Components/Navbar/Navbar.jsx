import React, { useContext } from 'react'
import './Navbar.css';
import logo from '../Assets/logo.png';
import cart_icon from '../Assets/cart_icon.png';
import nav_dropdown from '../Assets/dropdown_icon.png'
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import { useRef } from 'react';

const Navbar = () => {
    const [menu, SetMenu] = useState("shop");
    const {getTotalCartItems} = useContext(ShopContext);
    const menuRef = useRef();

    const dropdown_toggle = (e) => {
        menuRef.current.classList.toggle('nav-menu-visible');
        e.target.classList.toggle('open');
    }

  return (
    <div className='navbar'>
        <div className='nav-logo'>
            <img src={logo} alt=""/>
            <p>SHOPPER</p>
        </div>
        <img src={nav_dropdown} onClick={dropdown_toggle} className='nav-dropdown' alt=""/>
        <ul ref={menuRef} className="nav-menu">
            <li onClick={()=> SetMenu("shop")}><Link style={{ textDecoration: 'none'}} to='/'>Shop</Link> {menu==="shop" ? <hr /> : <></>}</li>
            <li onClick={()=> SetMenu("men")}><Link style={{ textDecoration: 'none'}} to='/men'>Men</Link> {menu==="men" ? <hr /> : <></>}</li>
            <li onClick={()=> SetMenu("women")}><Link style={{ textDecoration: 'none'}} to='/women'>Women</Link> {menu==="women" ? <hr /> : <></>}</li>
            <li onClick={()=> SetMenu("kids")}><Link style={{ textDecoration: 'none'}} to='/kids'>Kids</Link> {menu==="kids" ? <hr /> : <></>}</li>
        </ul>
        <div className='nav-login-cart'>
            {localStorage.getItem('auth-token') 
            ? <button onClick={()=>{localStorage.removeItem('auth-token'); window.location.replace("/");}}>Logout</button>
            : <Link to='/login'><button>Login</button></Link>}
            <Link to='/cart'><img src={cart_icon} alt="" /></Link>
            <div className='nav-cart-count'>{getTotalCartItems()}</div>
        </div>
    </div>
  )
}

export default Navbar
