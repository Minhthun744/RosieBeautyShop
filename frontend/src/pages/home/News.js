import React from "react";

const pageStyle = {
  background: "linear-gradient(135deg, #ffb6b9 0%, #fcdff0 100%)",
  minHeight: "100vh",
  padding: "36px 0 24px 0",
  fontFamily: "'Quicksand', 'Roboto', Arial, sans-serif"
};

const containerStyle = {
  background: "rgba(255,255,255,0.78)",
  borderRadius: 16,
  boxShadow: "0 2px 16px rgba(60,60,60,0.07)",
  maxWidth: 900,
  margin: "0 auto",
  padding: "32px 24px 28px 24px",
  backdropFilter: "blur(6px)",
  WebkitBackdropFilter: "blur(6px)"
};

const titleStyle = {
  fontSize: 32,
  fontWeight: 800,
  marginBottom: 8,
  color: "#d46a92",
  textAlign: "left",
  letterSpacing: 0.5
};

const descStyle = {
  fontSize: 17,
  marginBottom: 28,
  color: "#888",
  textAlign: "left"
};

const newsListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: 28
};

const newsItemStyle = {
  display: "flex",
  flexDirection: "row",
  alignItems: "stretch",
  background: "#f9f9fb",
  borderRadius: 12,
  boxShadow: "0 1px 8px rgba(60,60,60,0.06)",
  transition: "box-shadow 0.18s, transform 0.18s",
  cursor: "pointer",
  overflow: "hidden"
};

const newsItemHoverStyle = {
  boxShadow: "0 4px 24px rgba(60,60,60,0.11)",
  transform: "translateY(-2px) scale(1.01)"
};

const imgStyle = {
  width: 180,
  height: 140,
  objectFit: "cover",
  borderRadius: "12px 0 0 12px",
  flexShrink: 0,
  background: "#eaeaea"
};

const contentStyle = {
  padding: "18px 24px 18px 20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  flex: 1
};

const newsTitle = {
  fontSize: 20,
  fontWeight: 700,
  color: "#232323",
  marginBottom: 6,
  transition: "color 0.18s, text-decoration 0.18s"
};

const newsTitleHover = {
  color: "#1877f2",
  textDecoration: "underline"
};

const dateStyle = {
  fontSize: 14,
  color: "#888",
  marginBottom: 8
};

const newsDesc = {
  fontSize: 15,
  color: "#444",
  lineHeight: 1.5
};

const newsData = [
  {
    id: 1,
    title: "Dầu gội – Bí quyết chăm sóc tóc chắc khỏe, suôn mượt từ gốc đến ngọn",
    desc: `Dầu gội không chỉ đơn thuần là sản phẩm làm sạch mà còn đóng vai trò quan trọng trong việc nuôi dưỡng và bảo vệ mái tóc khỏi tác động của môi trường. Việc lựa chọn dầu gội phù hợp với từng loại tóc (dầu, khô, nhuộm, gãy rụng...) giúp cân bằng độ ẩm, làm sạch nhẹ nhàng mà không gây khô xơ. Ngoài ra, các thành phần tự nhiên như tinh dầu bưởi, argan, keratin, vitamin B5... còn hỗ trợ phục hồi tóc hư tổn, giảm gãy rụng và mang lại mái tóc óng ả, chắc khỏe. Để đạt hiệu quả tối ưu, nên kết hợp massage da đầu nhẹ nhàng khi gội để kích thích tuần hoàn máu, giúp tóc phát triển tốt hơn.`,
    date: "29/06/2025",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80" // tóc đẹp, dầu gội
  },
  {
    id: 2,
    title: "Kem dưỡng da – Chìa khóa cho làn da căng mịn, rạng rỡ mỗi ngày",
    desc: `Kem dưỡng là bước không thể thiếu trong chu trình skincare giúp cấp ẩm, khóa nước và nuôi dưỡng làn da từ sâu bên trong. Việc sử dụng kem dưỡng phù hợp giúp da luôn mềm mại, hạn chế tình trạng khô ráp, bong tróc, đồng thời tăng cường hàng rào bảo vệ tự nhiên của da. Nên ưu tiên các sản phẩm có thành phần như hyaluronic acid, ceramide, chiết xuất thiên nhiên (lô hội, trà xanh, hoa cúc...) để vừa dưỡng ẩm vừa làm dịu da, chống lão hóa. Đừng quên thoa kem dưỡng đều đặn sáng – tối và kết hợp massage nhẹ để dưỡng chất thẩm thấu sâu hơn, mang lại hiệu quả tối ưu.`,
    date: "28/06/2025",
    img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=600&q=80" // kem dưỡng, skincare
  },
  {
    id: 3,
    title: "Sữa tắm – Bí quyết làm sạch và nuôi dưỡng làn da toàn thân",
    desc: `Sữa tắm không chỉ giúp làm sạch bụi bẩn, mồ hôi mà còn cung cấp độ ẩm và dưỡng chất cho da. Lựa chọn sữa tắm dịu nhẹ, không chứa sulfate, paraben sẽ giúp bảo vệ lớp màng ẩm tự nhiên, tránh khô da. Các loại sữa tắm chiết xuất từ sữa, mật ong, dầu dừa, vitamin E... vừa làm sạch vừa nuôi dưỡng, giúp da sáng mịn, mềm mại sau mỗi lần sử dụng. Để tăng hiệu quả, có thể dùng bông tắm massage nhẹ nhàng theo vòng tròn, sau đó tắm lại bằng nước mát để se khít lỗ chân lông và giúp da săn chắc hơn.`,
    date: "27/06/2025",
    img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80" // sữa tắm, body care
  },
  {
    id: 4,
    title: "Sữa rửa mặt – Bước khởi đầu cho làn da sạch sâu, tươi sáng",
    desc: `Sữa rửa mặt là bước đầu tiên và quan trọng nhất giúp loại bỏ bụi bẩn, dầu thừa, lớp trang điểm trên da. Việc chọn sữa rửa mặt phù hợp sẽ giúp làm sạch nhẹ nhàng mà không làm mất cân bằng độ ẩm tự nhiên. Ưu tiên sản phẩm có độ pH 5.5, chứa các thành phần như trà xanh, nha đam, vitamin C, chiết xuất gạo... giúp làm dịu, sáng da và hỗ trợ kiểm soát dầu. Rửa mặt đúng cách (2 lần/ngày, massage nhẹ nhàng, không chà xát mạnh) sẽ giúp da thông thoáng, hấp thu dưỡng chất tốt hơn ở các bước dưỡng tiếp theo.`,
    date: "26/06/2025",
    img: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=600&q=80" // sữa rửa mặt, skincare
  }
];

function News() {
  const [hoveredId, setHoveredId] = React.useState(null);
  const [titleHoverId, setTitleHoverId] = React.useState(null);

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={titleStyle}>TIN TỨC VÀ BÀI VIẾT</div>
        <div style={descStyle}>
          Cập nhật thông tin, bí quyết làm đẹp và xu hướng mới nhất từ Rosie Beauty.
        </div>
        <div style={newsListStyle}>
          {newsData.map(news => (
            <div
              key={news.id}
              style={hoveredId === news.id ? { ...newsItemStyle, ...newsItemHoverStyle } : newsItemStyle}
              onMouseEnter={() => setHoveredId(news.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <img src={news.img} alt={news.title} style={imgStyle} />
              <div style={contentStyle}>
                <div
                  style={titleHoverId === news.id ? { ...newsTitle, ...newsTitleHover } : newsTitle}
                  onMouseEnter={() => setTitleHoverId(news.id)}
                  onMouseLeave={() => setTitleHoverId(null)}
                >
                  {news.title}
                </div>
                <div style={dateStyle}>{news.date}</div>
                <div style={newsDesc}>{news.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default News;
