import React from "react";
import { Link } from "react-router-dom";

export default function Product(props) {
  const { product } = props;
  return (
    <div className="card" key={product._id}>
      <Link to={`/product/${product._id}`}>
        <img className="medium" src={product.images[0]} alt="product" />
      </Link>
      <div className="card-body">
        <Link to={`/product/${product._id}`}>
          <h2>{product.name}</h2>
        </Link>
        <div className="category">{product.category}</div>
        <div className="price">
          {product.finalPrice
            ? product.finalPrice.toFixed(2)
            : product.finalPrice}
          €
        </div>
      </div>
    </div>
  );
}
