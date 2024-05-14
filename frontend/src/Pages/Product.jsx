import React from 'react'
import { useContext } from 'react'
import { useParams } from 'react-router-dom';
import Breadcrum from '../Components/Breadcrumbs/Breadcrum';
import DescriptionBox from '../Components/Descriptionbox/DescriptionBox';
import ProductDisplay from '../Components/ProductDisplay/ProductDisplay';
import RelatedProducts from '../Components/RelatedProducts/RelatedProducts';
import { ShopContext } from '../Context/ShopContext'

const Product = () => {
  const {all_products} = useContext(ShopContext);
  const {productId} = useParams();
  const product = all_products.find((e)=>e.id===Number(productId));
  return (
    <div className='product'>
        <Breadcrum product={product}/>
        <ProductDisplay product={product} />
        <DescriptionBox />
        <RelatedProducts />
    </div>
  )
}

export default Product
