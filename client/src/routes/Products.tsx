import { Outlet } from 'react-router-dom';
import { ReactNode } from 'react';
import ProductList from '../components/products/ProductList';

const ProductsRoute = (): ReactNode => {
  return (
    <div className="products-layout">
      <ProductList />
    </div>
  );
};

export default ProductsRoute;
