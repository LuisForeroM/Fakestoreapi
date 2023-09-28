import React, { useEffect, useState } from 'react';
import StoreService from '../services/fakestoreapi';
import './css/index.scss';
import { FaReply, FaUndo } from 'react-icons/fa';
const storeService = new StoreService();

function Principal() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({});
  const [pageStatus, setPageStatus] = useState('');
  const [productsToShow, setProductsToShow] = useState(6);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [cartshowing, setCartsShowing] = useState(false);
  const [cartItems, setCartItems] = useState([]); // Nuevo estado para el carrito
  const maxProductsCount = 20;
  const userId = 8;

  const handleProductClick = (productId) => {
    const product = products.find((product) => product.id === productId);
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  const handleGoBack = () => {
    setShowProductDetails(false);
    setSelectedProduct(null);
    setCartsShowing(false);
  };

  const handleAddToCart = () => {

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];


    cartItems.push(selectedProduct);


    localStorage.setItem('cart', JSON.stringify(cartItems));
    alert('Producto añadido al carrito');
  };

  const handleShowCart = () => {

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cartItems);
    setCartsShowing(true);

  };

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

    if (showProductDetails && selectedProduct && !cartshowing) {
      return (
        <div className="page">
          <div className="top_bar">
            <button className="cart_button" onClick={handleShowCart}>
              Carrito
            </button>
            <div className="user_icon">
              <span>
                {firstNameInitial}
                {lastNameInitial}
              </span>
            </div>

          </div>
          <button className="back_button" onClick={handleGoBack}>
            <FaReply /> Volver
          </button>
          <div className="card">
            <div className="product_details">
              <div className="product_image">
                <img src={selectedProduct.image} alt={selectedProduct.title} />
              </div>

              <div className="product_info">
                <div className="product_name">
                  <span>{selectedProduct.title}</span>
                </div>
                <div className="product_price">
                  <span>$ {selectedProduct.price}</span>
                </div>
                <div className="product_description">
                  <span>{selectedProduct.description}</span>
                </div>
              </div>
            </div>

            <button className="buy_button" onClick={handleAddToCart}>
              Añadir al carrito
            </button>
          </div>

        </div>
      );
    } else if (cartshowing) {
      return (
        <div className="page">
          <div className="top_bar">
            <button className="cart_button" onClick={handleShowCart}>
              Carrito

            </button>

            <div className="user_icon">
              <span>
                {firstNameInitial}
                {lastNameInitial}
              </span>
            </div>

          </div>
          <button className="back_button" onClick={handleGoBack}>
            <FaReply /> Volver
          </button>
          <div className="cart_content">
            <h2>Contenido del carrito:</h2>
            <ul>
              <table class="cart_table">
                <thead>

                  <td>Producto</td>
                  <td>Precio</td>

                </thead>
                {cartItems.map((item, index) => (


                  <tbody>
                    <tr key={index}>
                      <td> <img class="cart_image" src={item.image} alt={item.title} />{item.title}</td>
                      <td>{item.price}</td>
                    </tr>
                  </tbody>
                

              ))}
              </table>
            </ul>
          </div>

        </div>
      );
    }

    return (
      <div className="page">
        <div className="top_bar">
          <button className="cart_button" onClick={handleShowCart}>
            Carrito
          </button>
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
              <div className="product_box" key={product.id} onClick={() => handleProductClick(product.id)}>
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
              Ver mas
            </button>
          )}
        </div>

      </div>
    );
  }
}

export default Principal;
