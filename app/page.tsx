"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [message, setMessage] = useState("");

  

  useEffect(() => {
    axios
      .get("http://localhost:9092/api/flash-sale/products")
      .then((res) => {
        setProducts(res.data.content);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const handleQuantityChange = (productId, value) => {
    console.log("change input", value)
    setQuantities({
      ...quantities,
      [productId]: value,
    });
  };

  const handleBuyProduct = async (productId) => {
    console.log("quantities", quantities);
    
    try {
    const quantity = Number(quantities[productId]);

      const response = await axios.post(
        "http://localhost:9092/api/flash-sale/order",
        {
          productId,
          userId: 57,
          quantity,
        },
      );

      setMessage(response.data.message);
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Có lỗi xảy ra vui lòng thử lại!");
      }
    }
  };

  return (
    <div>
      <h1>🔥 Flash Sale Hôm Nay</h1>

      <div className="container">
        {products.map((product) => (
          <div key={product.id} className="card">
            <h3>{product.name}</h3>

            <div className="price-box">
              <span className="original-price">
                {product.originalPrice} đ
              </span>

              <span className="flash-price">
                {product.flashSalePrice} đ
              </span>
            </div>

            <p className="stock-info">Chỉ còn: {product.stock} sản phẩm</p>

            <div className="order-row">
              <input
                type="number"
                min="0"
                max={product.stock}
                value={quantities[product.id] || 0}
                onChange={(e) =>
                  handleQuantityChange(product.id, e.target.value)
                }
              />

              <button onClick={() => handleBuyProduct(product.id)}>
                MUA NGAY
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="message">{message}</div>
    </div>
  );
}
