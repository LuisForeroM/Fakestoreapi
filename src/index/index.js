import React, { useEffect, useState } from 'react';
import StoreService from '../services/fakestoreapi';
import './css/index.scss';
import { FaChevronDown, FaReply, FaTimes } from 'react-icons/fa';
const storeService = new StoreService();

function Principal() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({});
  const [pageStatus, setPageStatus] = useState('');
  const [productsToShow, setProductsToShow] = useState(6);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [cartshowing, setCartsShowing] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const maxProductsCount = 20;
  const userId = 8;

  const handleRemoveItem = (itemId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
  };
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
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const total = calculateTotal();

  const handleAddToCart = () => {
    const updatedCartItems = [...cartItems];
    const existingCartItemIndex = updatedCartItems.findIndex(item => item.id === selectedProduct.id);

    if (existingCartItemIndex !== -1) {
      updatedCartItems[existingCartItemIndex].quantity += 1;
    } else {
      updatedCartItems.push({ ...selectedProduct, quantity: 1 });
    }

    setCartItems(updatedCartItems);
    localStorage.setItem('cart', JSON.stringify(updatedCartItems));
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
          <nav class="navbar">
            <div className="navbar_left">
              <h2>Ecommerce</h2>
            </div>
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
          </nav>
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
          <nav class="navbar">
            <div className="navbar_left">
              <h2>Ecommerce</h2>
            </div>
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
          </nav>
          <button className="back_button" onClick={handleGoBack}>
            <FaReply /> Volver
          </button>
          <div className="cart_content">
            <h2 class="cart_title">Contenido del carrito:</h2>
            <ul>
              <table class="cart_table">
                <thead>
                  <td>Eliminar Producto</td>
                  <td>Producto</td>
                  <td>Precio unitario</td>
                  <td>Cantidad</td>
                  <td>Precio total</td>

                </thead>
                {cartItems.map((item) => (
                  <tbody key={item.id}>
                    <tr>
                      <td>
                        <button class="cart_remove" onClick={() => handleRemoveItem(item.id)}><FaTimes></FaTimes></button>
                      </td>
                      <td>
                        <img className="cart_image" src={item.image} alt={item.title} />
                        {item.title}
                      </td>
                      <td>${item.price}</td>
                      <td>{item.quantity}</td>
                      <td>${item.price * item.quantity}</td>

                    </tr>
                  </tbody>
                ))}

                <tfoot>
                  <tr>
                    <td colSpan="4">Total</td>
                    <td>${total}</td>
                  </tr>
                </tfoot>
              </table>
            </ul>
          </div>

        </div>
      );
    }

    return (
      <div className="page">
        <nav class="navbar">
          <div className="navbar_left">
            <h2>Ecommerce</h2>
          </div>
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
        </nav>
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
              <FaChevronDown></FaChevronDown>
            </button>
          )}
        </div>

      </div>
    );
  }
}

export default Principal;
