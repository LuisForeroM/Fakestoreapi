import React, { useEffect, useState } from 'react';
import StoreService from '../services/fakestoreapi';
import './css/index.scss'


const storeService = new StoreService();

function Principal () {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({});
  const [pageStatus, setPageStatus] = useState('');
  const [productsToShow, setProductsToShow] = useState(6);
  const maxProductsCount = 20;
  const userId = 8;

  const loadInitialData = async () => {
    setPageStatus('loading');

    try {
      const userData = await storeService.getUser(userId);
      const productData = await storeService.getProducts(maxProductsCount);

      setUser(userData);
      setProducts(productData);
      setPageStatus('success');
    } catch (error) {
      setPageStatus('error');
    }
  };

  const showMoreProducts = () => {
    setProductsToShow(productsToShow + 4);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  if (pageStatus === 'loading') {
    return <div className="status_message">Loading...</div>;
  } else if (pageStatus === 'error') {
    return <div className="status_message">Error occurred while fetching data</div>;
  } else if (pageStatus === 'success') {
    const firstNameInitial = user.name?.firstname?.[0]?.toUpperCase() || '';
    const lastNameInitial = user.name?.lastname?.[0]?.toUpperCase() || '';

    return (
      <div className="page">
        <div className="top_bar">
          <div className="user_icon">
            <span>
              {firstNameInitial}
              {lastNameInitial}
            </span>
          </div>
        </div>

        <div className="page_content">
          <div className="product_list">
            {products.slice(0, productsToShow).map((product) => (
              <div className="product_box" key={product.id}>
                <div className="product_image">
                  <img src={product.image} alt={product.title} />
                </div>

                <div className="product_info">
                  <div className="product_name">
                    <span>{product.title}</span>
                  </div>
                  <div className="product_price">
                    <span>$ {product.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bottom_area">
          {productsToShow < maxProductsCount && (
            <button className="load_more_button" onClick={showMoreProducts}>
              Show more
            </button>
          )}
        </div>
      </div>
    );
  }
};

export default Principal;
