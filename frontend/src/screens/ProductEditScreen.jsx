import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  detailsProduct,
  listProducts,
  updateProduct,
} from "../actions/productActions";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

export default function ProductEditScreen(props) {
  const dispatch = useDispatch();

  const productId = props.match.params.id;

  const userSignin = useSelector((state) => state.userSignin);
  const { userInfo } = userSignin;
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, product, error } = productDetails;
  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    success: successUpdate,
    error: errorUpdate,
  } = productUpdate;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [sizable, setSizable] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [countInStockXS, setCountInStockXS] = useState("");
  const [countInStockS, setCountInStockS] = useState("");
  const [countInStockM, setCountInStockM] = useState("");
  const [countInStockL, setCountInStockL] = useState("");
  const [countInStockXL, setCountInStockXL] = useState("");
  const [countInStockXXL, setCountInStockXXL] = useState("");
  const [description, setDescription] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [errorUpload, setErrorUpload] = useState("");
  const [taxPrice, setTaxPrice] = useState("");
  const [finalPrice, setFinalPrice] = useState("");

  const clothingOptions = ["T-Shirts", "Hoodies", "Lenços", "Bags"];

  const categoryOptions = [
    "Carteiras",
    "Diskettes",
    "Pinturas",
    "Prints",
    "Tapetes",
    "Jóias",
  ];

  useEffect(() => {
    if (successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch(listProducts());
      props.history.push("/productlist");
    }
    if (!product || product._id !== productId || successUpdate) {
      dispatch({ type: PRODUCT_UPDATE_RESET });
      dispatch(detailsProduct(productId));
    } else {
      setName(product.name);
      setPrice(product.price);
      setImage(product.image);
      setCategory(product.category || "T-Shirts");
      if (product.category === "T-Shirts" || product.category === "Hoodies") {
        setSizable(true);
      } else {
        setSizable(false);
      }
      if (product.countInStock) {
        setCountInStock(product.countInStock.stock);
        setCountInStockXS(product.countInStock.xs);
        setCountInStockS(product.countInStock.s);
        setCountInStockM(product.countInStock.m);
        setCountInStockL(product.countInStock.l);
        setCountInStockXL(product.countInStock.xl);
        setCountInStockXXL(product.countInStock.xxl);
      }
      setDescription(product.description);
      setTaxPrice(product.taxPrice);
      setFinalPrice(product.finalPrice);
    }
  }, [dispatch, product, productId, successUpdate, props]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        category,
        sizable,
        countInStock: {
          stock: countInStock,
          xs: countInStockXS,
          s: countInStockS,
          m: countInStockM,
          l: countInStockL,
          xl: countInStockXL,
          xxl: countInStockXXL,
        },
        description,
        taxPrice,
        finalPrice,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("image", file);
    setLoadingUpload(true);
    try {
      const { data } = await Axios.post("/api/uploads/s3", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
      setImage(data);
      setLoadingUpload(false);
    } catch (error) {
      setErrorUpload(error.message);
      setLoadingUpload(false);
    }
  };

  const setPriceAndTax = (val) => {
    setPrice(val);
    setTaxPrice((0.23 * val).toFixed(2));
    setFinalPrice((parseFloat(val) + parseFloat(0.23 * val)).toFixed(2));
  };

  const setCategoryAndSizable = (e) => {
    setCategory(e.target.value);
    if (e.target.value === "T-Shirts" || e.target.value === "Hoodies") {
      setSizable(true);
    } else {
      setSizable(false);
    }
  };

  return (
    <>
      <form className="form" onSubmit={submitHandler}>
        <div>
          <h1>Edit {name}</h1>
        </div>
        {loadingUpdate && <LoadingBox />}
        {errorUpdate && <MessageBox variant="danger">{errorUpdate}</MessageBox>}
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="price">Price</label>
              <input
                type="number"
                step="0.01"
                id="price"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPriceAndTax(e.target.value)}
              />
              {price && (
                <>
                  <div className="danger">IVA: {taxPrice}€</div>
                  <div>Final Price: {finalPrice}€</div>
                </>
              )}
            </div>
            <div>
              <label htmlFor="imageFile">Image File</label>
              {image && (
                <img className="preview" src={image} alt="imagePreview" />
              )}
              <input
                type="file"
                id="imageFile"
                label="Choose image"
                onChange={uploadFileHandler}
              />
              {loadingUpload && <LoadingBox />}
              {errorUpload &&
                !image(<MessageBox variant="danger">{errorUpload}</MessageBox>)}
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <select
                value={category}
                onChange={(e) => setCategoryAndSizable(e)}
              >
                <optgroup label="Clothing">
                  {clothingOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </optgroup>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            {category === "T-Shirts" || category === "Hoodies" ? (
              <div>
                <label>Count In Stock</label>
                <input
                  type="number"
                  id="countInStockXS"
                  placeholder="XS"
                  value={countInStockXS}
                  onChange={(e) => setCountInStockXS(e.target.value)}
                />
                <br />
                <input
                  type="number"
                  id="countInStockS"
                  placeholder="S"
                  value={countInStockS}
                  onChange={(e) => setCountInStockS(e.target.value)}
                />
                <br />
                <input
                  type="number"
                  id="countInStockM"
                  placeholder="M"
                  value={countInStockM}
                  onChange={(e) => setCountInStockM(e.target.value)}
                />
                <br />
                <input
                  type="number"
                  id="countInStockL"
                  placeholder="L"
                  value={countInStockL}
                  onChange={(e) => setCountInStockL(e.target.value)}
                />
                <br />
                <input
                  type="number"
                  id="countInStockXL"
                  placeholder="XL"
                  value={countInStockXL}
                  onChange={(e) => setCountInStockXL(e.target.value)}
                />
                <br />
                <input
                  type="number"
                  id="countInStockXXL"
                  placeholder="XXL"
                  value={countInStockXXL}
                  onChange={(e) => setCountInStockXXL(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <label htmlFor="countInStock">Count In Stock</label>
                <input
                  type="number"
                  id="countInStock"
                  placeholder="Enter count in stock"
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                />
              </div>
            )}
            <div>
              <label htmlFor="description">Description</label>
              <textarea
                type="text"
                rows="3"
                id="description"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div>
              <label />
              <button className="primary" type="submit">
                Update
              </button>
            </div>
          </>
        )}
      </form>
    </>
  );
}
