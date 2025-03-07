import React from 'react';
import { Container} from 'react-bootstrap';

import Search from '../components/Search';
import ProductSection from '../components/ProductSection';
import AboutUs from '../components/AboutUs';
import Categories from '../components/Categories';
import '../Styles/Shop.css';
import ScrollToTopButton from '../components/ScrollToTopButton';

const Shop = () => {
  return (
    <div className="shop-background">
      <Container className="mt-4 shop-content nav-p">
        
        <Search />

        <ProductSection />

        <AboutUs />

        <Categories />

        <ScrollToTopButton />
      </Container>
    </div>
  );
};

export default Shop;
