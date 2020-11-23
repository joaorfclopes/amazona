import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { detailsProduct } from "../actions/productActions";
import { sizes } from "../utils";

export default function ProductScreen(props) {
  const dispatch = useDispatch();
  const productId = props.match.params.id;
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, product, error } = productDetails;
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("XS");

  useEffect(() => {
    dispatch(detailsProduct(productId));
  }, [dispatch, productId]);

  const addToCartHandler = async () => {
    if (!product.isClothing) {
      await props.history.push(`/cart/${productId}?qty=${qty}`);
    } else {
      await props.history.push(`/cart/${productId}?qty=${qty}&size=${size}`);
    }
    props.history.push(`/cart`);
  };

  const availability = (val) => {
    return val > 0 ? (
      <span className="success">In Stock</span>
    ) : (
      <span className="danger">Unavailable</span>
    );
  };

  const qtyAddCart = (val) => {
    return (
      val > 0 && (
        <>
          <li>
            <div className="row">
              <div>Qty</div>
              <div>
                <select value={qty} onChange={(e) => setQty(e.target.value)}>
                  {[...Array(val >= 5 ? 5 : val).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </li>
          <li>
            <button onClick={addToCartHandler} className="primary block">
              Add to Cart
            </button>
          </li>
        </>
      )
    );
  };

  return (
    <>
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div className="row top">
          <div className="col-2">
            <img className="large" src={product.image} alt={product.name} />
          </div>
          <div className="col-1">
            <ul>
              <li>
                <h1>{product.name}</h1>
              </li>
              <li>Category: {product.category}</li>
              <li>
                Price:{" "}
                {product.finalPrice
                  ? product.finalPrice.toFixed(2)
                  : product.finalPrice}
                €
              </li>
              <li>Description: {product.description}</li>
            </ul>
          </div>
          <div className="col-1">
            <div className="card card-body">
              <ul>
                <li>
                  <div className="row">
                    <div>Price</div>
                    <div className="price">
                      {product.finalPrice
                        ? product.finalPrice.toFixed(2)
                        : product.finalPrice}
                      €
                    </div>
                  </div>
                </li>
                {product.isClothing && (
                  <li>
                    <div className="row">
                      <div>Size</div>
                      <div>
                        <select
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                        >
                          {sizes.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </li>
                )}
                <li>
                  <div className="row">
                    <div>Status</div>
                    <div>
                      {!product.isClothing
                        ? availability(product.countInStock.stock)
                        : size === "XS"
                        ? availability(product.countInStock.xs)
                        : size === "S"
                        ? availability(product.countInStock.s)
                        : size === "M"
                        ? availability(product.countInStock.m)
                        : size === "L"
                        ? availability(product.countInStock.l)
                        : size === "XL"
                        ? availability(product.countInStock.xl)
                        : size === "XXL" &&
                          availability(product.countInStock.xxl)}
                    </div>
                  </div>
                </li>
                {!product.isClothing
                  ? qtyAddCart(product.countInStock.stock)
                  : size === "XS"
                  ? qtyAddCart(product.countInStock.xs)
                  : size === "S"
                  ? qtyAddCart(product.countInStock.s)
                  : size === "M"
                  ? qtyAddCart(product.countInStock.m)
                  : size === "L"
                  ? qtyAddCart(product.countInStock.l)
                  : size === "XL"
                  ? qtyAddCart(product.countInStock.xl)
                  : size === "XXL" && qtyAddCart(product.countInStock.xxl)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
