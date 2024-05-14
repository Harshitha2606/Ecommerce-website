import React from 'react'
import './DescriptionBox.css';

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className='descriptionbox-navigator'>
            <div className='descriptionbox-nav-box'>Description</div>
            <div className='descriptionbox-nav-box fade'>Reviews (122)</div>
        </div>
        <div className='descriptionbox-description'>
                <p>
                    An e-commerce website is an online platform that facilitates
                    buying and selling of products or services over the internet
                    that serve as a virtual marketplace where individuals and marketplaces 
                    show their products, interact with customers and conduct transactions whithout
                    the need for physical presence. E-commerce websites have gained immense popularity 
                    due to their convenient accesibility, and the global reach they offer.
                </p>
                <p>
                    E-commerce websites typically display products or services along with detailed descriptions, prices, images
                    and any available variations (e.g sizes, colors). Each product has its own dedicated page with relevant information.
                </p>
            </div>
    </div>
  )
}

export default DescriptionBox
