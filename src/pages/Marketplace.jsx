import React, { useState, useRef, useEffect, useContext } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import "./../styles/Marketplace.css";

import { LanguageContext } from "../contexts/LanguageContext";
import { languages } from "../utils/languages";

const Marketplace = () => {
  const { lang } = useContext(LanguageContext);
  const t = languages[lang]; // translations

  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    quantityValue: "",
    quantityUnit: "kg",
    seller: "",
    location: "",
    image: ""
  });
  const [editingProductId, setEditingProductId] = useState(null);

  // Image crop states
  const [selectedImage, setSelectedImage] = useState(null);
  const [crop, setCrop] = useState();
  const imgRef = useRef(null);

  // Load products from localStorage
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(savedProducts);
  }, []);

  // Save products to localStorage
  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  const handleInput = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setCrop(undefined);
    }
  };

  const onImageLoad = (e) => {
    const { width, height } = e.currentTarget;
    const crop = makeAspectCrop(
      { unit: "%", width: 90 },
      1,
      width,
      height
    );
    setCrop(centerCrop(crop, width, height));
  };

  const getCroppedImage = async () => {
    if (!imgRef.current || !crop?.width || !crop?.height) return;
    const canvas = document.createElement("canvas");
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      imgRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const croppedUrl = URL.createObjectURL(blob);
        setNewProduct({ ...newProduct, image: croppedUrl });
        setSelectedImage(null);
        resolve(croppedUrl);
      }, "image/jpeg");
    });
  };

  const handleSaveProduct = () => {
    if (newProduct.name && newProduct.price && newProduct.seller) {
      const productToSave = {
        ...newProduct,
        id: editingProductId || Date.now(),
        quantity: `${newProduct.quantityValue} ${newProduct.quantityUnit}`
      };
      if (editingProductId) {
        setProducts(
          products.map((p) => (p.id === editingProductId ? productToSave : p))
        );
      } else {
        setProducts([...products, productToSave]);
      }
      setEditingProductId(null);
      resetForm();
    }
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleEditProduct = (product) => {
    const [value, unit] = product.quantity.split(" ");
    setEditingProductId(product.id);
    setNewProduct({ ...product, quantityValue: value, quantityUnit: unit || "kg" });
  };

  const resetForm = () => {
    setNewProduct({
      name: "",
      price: "",
      quantityValue: "",
      quantityUnit: "kg",
      seller: "",
      location: "",
      image: ""
    });
  };

  return (
    <div className="marketplace-container">
      <h1 className="marketplace-title">{t.marketplaceTitle}</h1>

      {/* Product List */}
      <div className="marketplace-product-list">
        {products.map((product) => (
          <div key={product.id} className="marketplace-product-card">
            {product.image && (
              <img
                src={product.image}
                alt={product.name}
                className="marketplace-product-image"
              />
            )}
            <h3 className="marketplace-product-name">{product.name}</h3>
            <p className="marketplace-product-price">💰 {t.price}: ₹{product.price}</p>
            <p className="marketplace-product-quantity">📦 {t.quantity}: {product.quantity}</p>
            <p className="marketplace-product-seller">👨‍🌾 {t.sellerName}: {product.seller}</p>
            <p className="marketplace-product-location">📍 {t.location}: {product.location}</p>
            <div className="marketplace-actions">
              <button
                onClick={() => handleEditProduct(product)}
                className="marketplace-button-edit"
              >
                {t.edit}
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)}
                className="marketplace-button-delete"
              >
                {t.delete}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      <div className="marketplace-add-product">
        <h2 className="marketplace-add-title">
          {editingProductId ? t.updateProduct : t.sellYourProduct}
        </h2>

        <input
          type="text"
          name="name"
          placeholder={t.productName}
          value={newProduct.name}
          onChange={handleInput}
          className="marketplace-input"
        />

        <input
          type="number"
          name="price"
          placeholder={t.price}
          value={newProduct.price}
          onChange={handleInput}
          className="marketplace-input"
        />

        <div className="marketplace-quantity-group">
          <input
            type="number"
            name="quantityValue"
            placeholder={t.quantity}
            value={newProduct.quantityValue}
            onChange={handleInput}
            className="marketplace-input"
          />
          <select
            name="quantityUnit"
            value={newProduct.quantityUnit}
            onChange={handleInput}
            className="marketplace-select"
          >
            <option value="kg">kg</option>
            <option value="grams">grams</option>
            <option value="quintal">quintal</option>
            <option value="ton">ton</option>
          </select>
        </div>

        <input
          type="text"
          name="seller"
          placeholder={t.sellerName}
          value={newProduct.seller}
          onChange={handleInput}
          className="marketplace-input"
        />

        <input
          type="text"
          name="location"
          placeholder={t.location}
          value={newProduct.location}
          onChange={handleInput}
          className="marketplace-input"
        />

        <p>{t.uploadImage}</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="marketplace-input-file"
        />

        {selectedImage && (
          <div>
            <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={1}>
              <img ref={imgRef} src={selectedImage} alt="Crop me" onLoad={onImageLoad} />
            </ReactCrop>
            <button onClick={getCroppedImage} className="marketplace-button add">
              {t.cropSave}
            </button>
          </div>
        )}

        {newProduct.image && (
          <div className="marketplace-preview">
            <img src={newProduct.image} alt="Preview" />
          </div>
        )}

        <button
          onClick={handleSaveProduct}
          className={`marketplace-button ${editingProductId ? "update" : "add"}`}
        >
          {editingProductId ? t.updateProductBtn : t.addProduct}
        </button>
      </div>
    </div>
  );
};

export default Marketplace;
