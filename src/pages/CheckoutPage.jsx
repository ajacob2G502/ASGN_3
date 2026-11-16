import { useState } from "react";
import { Link } from "react-router-dom";

const TAX_RATE = 0.06;

const EMPTY_FORM = {
  fullName: "",
  address: "",
  city: "",
  postalCode: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

const validate = (data) => {
  const errors = {};
  if (!data.fullName.trim()) errors.fullName = "Full name is required.";
  if (!data.address.trim()) errors.address = "Address is required.";
  if (!data.city.trim()) errors.city = "City is required.";
  if (!/^\d{5}$/.test(data.postalCode.trim()))
    errors.postalCode = "Enter a 5-digit postal code.";
  if (!/^\d{16}$/.test(data.cardNumber.replace(/\s/g, "")))
    errors.cardNumber = "Enter a 16-digit card number.";
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(data.expiry.trim()))
    errors.expiry = "Use MM/YY format.";
  if (!/^\d{3,4}$/.test(data.cvv.trim()))
    errors.cvv = "Enter a 3 or 4-digit CVV.";
  return errors;
};

const CheckoutPage = ({ cart, onClearCart }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + taxes;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate(formData);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setIsSubmitted(true);
    onClearCart();
  };

  if (isSubmitted) {
    return (
      <div className="checkout-success">
        <h2>Order Confirmed</h2>
        <p>
          Thank you, {formData.fullName}. Your records will ship to{" "}
          {formData.address}, {formData.city} {formData.postalCode}.
        </p>
        <Link className="btn btn-primary" to="/">
          Back to Catalog
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart-page">
        <h2>Your cart is empty.</h2>
        <Link className="btn btn-secondary" to="/">
          Browse the catalog
        </Link>
      </div>
    );
  }

  const field = (name, label, props = {}) => (
    <div className="form-group">
      <label htmlFor={name}>{label} *</label>
      <input
        type="text"
        name={name}
        id={name}
        value={formData[name]}
        onChange={handleChange}
        aria-invalid={errors[name] ? "true" : "false"}
        {...props}
      />
      {errors[name] && <span className="field-error">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-grid">
        <form className="checkout-form" onSubmit={handleSubmit} noValidate>
          <h2>Shipping Information</h2>
          {field("fullName", "Full Name", { autoComplete: "name" })}
          {field("address", "Address", { autoComplete: "street-address" })}
          {field("city", "City", { autoComplete: "address-level2" })}
          {field("postalCode", "Postal Code", {
            inputMode: "numeric",
            maxLength: 5,
          })}

          <h2>Payment</h2>
          {field("cardNumber", "Card Number", {
            inputMode: "numeric",
            placeholder: "1234 5678 9012 3456",
            autoComplete: "cc-number",
          })}
          {field("expiry", "Expiry (MM/YY)", {
            placeholder: "MM/YY",
            maxLength: 5,
            autoComplete: "cc-exp",
          })}
          {field("cvv", "CVV", {
            inputMode: "numeric",
            maxLength: 4,
            autoComplete: "cc-csc",
          })}

          <button type="submit" className="btn btn-primary btn-block">
            Place Order (${total.toFixed(2)})
          </button>
        </form>

        <aside className="order-summary-card">
          <h3>Order Summary</h3>
          <ul className="summary-list">
            {cart.map((item) => (
              <li key={item.id} className="summary-row">
                <span>
                  {item.title} &times; {item.quantity}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <hr />
          <div className="summary-row">
            <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row">
            <span>Estimated Tax ({TAX_RATE * 100}%):</span>{" "}
            <span>${taxes.toFixed(2)}</span>
          </div>
          <div className="summary-row total-row">
            <span>Total:</span> <span>${total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
