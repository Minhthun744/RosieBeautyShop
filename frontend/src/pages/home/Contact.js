import React, { useState } from "react";

const bgStyle = {
  background: "linear-gradient(135deg, #ffb6b9 0%, #fcdff0 100%)",
  minHeight: "100vh",
  padding: "48px 0 32px 0",
  fontFamily: "'Quicksand', 'Roboto', Arial, sans-serif"
};

const formWrapper = {
  background: "rgba(255,255,255,0.94)",
  borderRadius: 18,
  boxShadow: "0 4px 24px rgba(255,182,185,0.13)",
  maxWidth: 600,
  margin: "0 auto",
  padding: "40px 32px",
  color: "#6d6d6d"
};

const titleStyle = {
  fontSize: 28,
  fontWeight: 700,
  marginBottom: 16,
  color: "#d46a92",
  letterSpacing: 1
};

const descStyle = {
  fontSize: 17,
  marginBottom: 28,
  color: "#555",
  lineHeight: 1.6
};

const inputStyle = {
  width: "100%",
  padding: "16px 18px",
  border: "1.5px solid #f9c0c0",
  borderRadius: 8,
  fontSize: 16,
  marginBottom: 20,
  outline: "none",
  transition: "border-color 0.2s"
};

const inputRow = {
  display: "flex",
  gap: 16,
  marginBottom: 20
};

const textareaStyle = {
  ...inputStyle,
  minHeight: 140,
  resize: "vertical"
};

const btnStyle = {
  width: 220,
  background: "#ffb6b9",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  padding: "16px 0",
  fontWeight: 600,
  fontSize: 20,
  cursor: "pointer",
  marginTop: 10,
  transition: "background 0.2s"
};

const btnHoverStyle = {
  background: "#ff9776"
};

function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [hover, setHover] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 2500);
    setForm({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <div style={bgStyle}>
      <div style={formWrapper}>
        <div style={titleStyle}>THÔNG TIN LIÊN HỆ</div>
        <div style={descStyle}>
          Bạn hãy điền nội dung tin nhắn vào form dưới đây và gửi cho chúng tôi.<br />
          Chúng tôi sẽ trả lời bạn sau khi nhận được.
        </div>
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            style={inputStyle}
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={form.name}
            onChange={handleChange}
            required
          />
          <div style={inputRow}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              type="text"
              name="phone"
              placeholder="Số điện thoại"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              style={{ ...inputStyle, flex: 1 }}
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <textarea
            style={textareaStyle}
            name="message"
            placeholder="Nội dung"
            value={form.message}
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            style={hover ? { ...btnStyle, ...btnHoverStyle } : btnStyle}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Gửi tin nhắn
          </button>
          {sent && (
            <div style={{ color: "#ff7a7a", marginTop: 18, fontWeight: 500, fontSize: 17 }}>Đã gửi tin nhắn thành công!</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Contact;
