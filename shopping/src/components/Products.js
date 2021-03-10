import React, { useState, useEffect } from "react";
import axios from "axios";

const Products = () => {
  // Store products from API results

  const [products, updateProducts] = useState([]);

  // Store products in cart

  const [cart, updateCart] = useState([]);

  // Cart total

  const [total, updateTotal] = useState(0);

  //   Store Quantities of each product
  const [quantities, updateQuantities] = useState({
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  });

  // fetch products from API

  useEffect(() => {
    axios.get(`https://fakestoreapi.com/products`).then((resp) => {
      updateProducts(resp.data);
    });
  }, []);

  // Add to cart

  function handleAddToCart(i) {
    const newCart = [...cart];
    const productIndex = i - 1;

    //  Check if product is already in cart before pushing

    const presentCheck = newCart.indexOf(products[productIndex]);
    if (presentCheck < 0) {
      newCart.push(products[productIndex]);
      const data = {
        ...quantities,
        [i]: 1,
      };

      updateQuantities(data);
    }
    updateCart(newCart);
  }

  //  Caculate total

  function handleTotal() {
    let newTotal = 0;
    for (let i = 0; i < cart.length; i++) {
      const id = cart[i].id;
      const itemQuantity = quantities[id];
      const itemPrice = cart[i].price;
      const priceToAdd = itemPrice * itemQuantity;
      newTotal = newTotal + priceToAdd;
    }
    updateTotal(newTotal.toFixed(2));
  }

  //  Clear Total
  function handleClear() {
    const newQuantities = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }
    updateQuantities(newQuantities)
    updateTotal(0)
  }

  //   handle quantity change

  function handleQuantityChange(event) {
    const name = event.target.name;

    const value = event.target.value;

    const data = {
      ...quantities,
      [name]: Number(value),
    };

    updateQuantities(data);
  }

  // Loading screen while fetching products

  if (!products[0]) {
    return (
      <div className="section">
        <div className="container is-fluid">
          <div className="title">Loading ...</div>
          <progress className="progress is-large is-success" max="100">
            60%
          </progress>
        </div>
      </div>
    );
  }

  // JSX

  return (
    <div className="App">
      <div className="container is-fluid">
        <div className="columns mt-6">
          {/* Left Column */}

          <div className="column is-two-thirds pb-6">
            <div className="container is-fluid">
              <p className="is-size-1 has-text-centered has-text-black pt-3 pb-5">
                Product List
              </p>
              <div className="container">
                {products.slice(0, 5).map((product, index) => {
                  return (
                    <article
                      className="media has-background-success"
                      key={index}
                    >
                      <figure className="media-left">
                        <p className="image is-32x32">
                          <img src={product.image} alt={product.name} />
                        </p>
                      </figure>
                      <div className="media-content">
                        <div className="content">
                          <p>
                            {product.title.length < 13
                              ? product.title
                              : product.title.substring(0, 12) + "..."}
                          </p>
                          <p>{product.id}</p>
                        </div>
                      </div>
                      <div className="media-right">
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className="button is-primary"
                        >
                          Add to cart
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column */}

          <div className="column is-one-quarter">
            <p className="is-size-1 has-text-centered has-text-black pt-3 pb-5">
              Cart
            </p>
            <div className="container">
              {!cart[0] && <p>Add a product to your basket</p>}
              {cart.map((product, index) => {
                return (
                  <article className="media" key={index}>
                    <div className="media-content">
                      <div className="content">
                        <p>{product.title.substring(0, 25)}</p>
                      </div>
                    </div>
                    <div className="media-right">
                      <p>£{product.price}</p>
                      <input
                        className="input"
                        type="number"
                        value={quantities[product.id]}
                        name={product.id}
                        onChange={handleQuantityChange}
                        min="0"
                      />
                    </div>
                  </article>
                );
              })}
            </div>
            <div>
              <p className="is-size-3 has-text-centered has-text-black pt-5">
                Total: £{total}
              </p>
              <div className="cart-buttons">
                <button className="button" onClick={() => handleTotal()}>
                  Update Total
                </button>
                <button className="button" onClick={() => handleClear()}>
                  clear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Products;
