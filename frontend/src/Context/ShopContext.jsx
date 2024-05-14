import React, { createContext } from "react";
import { useEffect } from "react";
import { useState } from "react";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for(let index=0; index < 300+1 ;index++){
        cart[index] = 0;
    }
    return cart;
}

const ShopContextProvider = (props) => {
    const [all_products, SetAll_products] = useState([]);
    const [cartItems, setCartItems] = useState(getDefaultCart());

    useEffect(()=> {
        fetch('http://localhost:4000/allproducts')
        .then((res)=> res.json())
        .then((data)=>SetAll_products(data))

        if(localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/getcart',{
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: ""
            })
            .then((res)=> res.json())
            .then((data)=>setCartItems(data)) 
        }
    }, [])

    const addToCart = (itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}));
        if(localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/addtocart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"itemId": itemId})
            })
            .then((res) => res.json())
            .then((data) => console.log(data));
        }
    }

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for(const item in cartItems) {
            if(cartItems[item]>0){
                let itemInfo = all_products.find((product)=>product.id===Number(item));
                totalAmount += itemInfo.new_price*cartItems[item];
            }
        }
        return totalAmount;
    }

    const getTotalCartItems = () => {
        let totalitems = 0;
        for(const item in cartItems) {
            if(cartItems[item]>0){
                totalitems += cartItems[item];
            } 
        }
        return totalitems;
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]-1}));
        if(localStorage.getItem('auth-token')) {
            fetch('http://localhost:4000/removefromcart', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'auth-token': `${localStorage.getItem('auth-token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"itemId": itemId})
            })
            .then((res) => res.json())
            .then((data) => console.log(data));
        }
    }
     
    const contextValue = {all_products, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems};

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;