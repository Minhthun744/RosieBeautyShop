import React from "react";

const aboutBg = {
  background: "linear-gradient(135deg, #ffb6b9 0%, #fcdff0 100%)",
  minHeight: "100vh",
  padding: "48px 0 32px 0",
  fontFamily: "'Quicksand', 'Roboto', Arial, sans-serif"
};

const cardStyle = {
  background: "rgba(255,255,255,0.88)",
  borderRadius: "18px",
  boxShadow: "0 4px 24px rgba(255,182,185,0.13)",
  maxWidth: 900,
  margin: "0 auto",
  padding: "40px 32px",
  color: "#d46a92"
};

const titleStyle = {
  fontSize: 38,
  fontWeight: 700,
  marginBottom: 8,
  color: "#ff7a7a"
};

const sloganStyle = {
  fontSize: 22,
  fontWeight: 500,
  marginBottom: 24,
  color: "#ff9776"
};

const sectionTitle = {
  fontSize: 20,
  fontWeight: 600,
  margin: "24px 0 12px 0",
  color: "#ff7a7a"
};

const articleStyle = {
  background: "#fff6f8",
  borderRadius: 14,
  padding: "22px 24px",
  marginBottom: 18,
  color: "#b85c7c",
  fontSize: 17,
  lineHeight: 1.8,
  boxShadow: "0 2px 10px #ffd1e0"
};

const coreValueStyle = {
  background: "#ffe3ec",
  borderRadius: 12,
  padding: "18px 20px",
  marginBottom: 12,
  color: "#e57373"
};

const contactStyle = {
  background: "#fff0f5",
  borderRadius: 12,
  padding: "16px 20px",
  color: "#d46a92"
};

const About = () => (
  <div style={aboutBg}>
    <div style={cardStyle}>
      <div style={{ textAlign: "center" }}>
        
        <h1 style={titleStyle}>Rosie Beauty</h1>
        <div style={sloganStyle}>
          "Chăm sóc làn da, nâng niu mái tóc, lan tỏa yêu thương!"
        </div>
      </div>
      <div style={{ fontSize: 17, marginBottom: 18, lineHeight: 1.7 }}>
        Rosie Beauty là địa chỉ tin cậy cho mọi nhu cầu làm đẹp của bạn. Chúng tôi chuyên cung cấp các sản phẩm <b>sữa rửa mặt</b>, <b>sữa tắm</b>, <b>dầu gội</b>, <b>kem dưỡng</b> chính hãng, an toàn, phù hợp với mọi loại da và tóc. Đội ngũ tư vấn tận tâm luôn đồng hành cùng bạn trên hành trình chăm sóc bản thân.
      </div>
      <div style={sectionTitle}>Triết lý thương hiệu</div>
      <div style={articleStyle}>
        <b>"Đẹp từ bên trong, rạng rỡ bên ngoài"</b> là phương châm của Rosie Beauty. Chúng tôi tin rằng mỗi người phụ nữ đều xứng đáng được yêu thương và chăm sóc. Sản phẩm của Rosie Beauty không chỉ giúp bạn làm sạch, dưỡng ẩm, mà còn mang lại cảm giác thư giãn, tự tin mỗi ngày.
      </div>
      <div style={sectionTitle}>Bài viết nổi bật</div>
      <div style={articleStyle}>
        <b>1. Bí quyết chọn sữa rửa mặt phù hợp từng loại da</b><br />
        Việc lựa chọn sữa rửa mặt đúng là bước đầu tiên quan trọng trong quy trình skincare. Da dầu nên ưu tiên sản phẩm tạo bọt nhẹ, kiểm soát nhờn. Da khô phù hợp với sữa rửa mặt dạng kem, cấp ẩm sâu. Đừng quên massage nhẹ nhàng và rửa lại bằng nước mát để se khít lỗ chân lông.
      </div>
      <div style={articleStyle}>
        <b>2. Dưỡng thể toàn diện với sữa tắm thiên nhiên</b><br />
        Sữa tắm không chỉ giúp làm sạch mà còn nuôi dưỡng làn da mềm mại, sáng khỏe. Hãy chọn sản phẩm chiết xuất tự nhiên như hoa hồng, yến mạch, bơ hạt mỡ để tăng cường cấp ẩm và bảo vệ da khỏi tác nhân môi trường.
      </div>
      <div style={articleStyle}>
        <b>3. Chăm sóc tóc chắc khỏe với dầu gội thảo dược</b><br />
        Dầu gội thảo dược giúp làm sạch nhẹ nhàng, giảm gãy rụng, kích thích mọc tóc và cân bằng da đầu. Kết hợp massage da đầu đều đặn sẽ giúp tóc chắc khỏe, bóng mượt tự nhiên.
      </div>
      <div style={articleStyle}>
        <b>4. Kem dưỡng – Bí quyết giữ gìn làn da tuổi thanh xuân</b><br />
        Kem dưỡng ẩm giúp khóa ẩm, phục hồi hàng rào bảo vệ da, làm mờ nếp nhăn và chống lão hóa. Hãy lựa chọn kem dưỡng phù hợp với từng mùa và nhu cầu riêng của làn da bạn.
      </div>
      
      <div style={sectionTitle}>Giá trị cốt lõi</div>
      <div style={coreValueStyle}>🌸 Sản phẩm an toàn, nguồn gốc rõ ràng</div>
      <div style={coreValueStyle}>🌸 Đặt khách hàng làm trung tâm</div>
      <div style={coreValueStyle}>🌸 Đội ngũ tư vấn tận tâm, chuyên nghiệp</div>
      <div style={coreValueStyle}>🌸 Ưu đãi hấp dẫn, giao hàng nhanh chóng</div>
      <div style={sectionTitle}>Liên hệ</div>
      <div style={contactStyle}>
        <b>Địa chỉ:</b> 123 Hoa Hồng, Quận 1, TP.HCM<br />
        <b>Hotline:</b> 0988 123 456<br />
        <b>Email:</b> rosiebeauty@gmail.com<br />
        <b>Facebook:</b> <a href="https://facebook.com/rosiebeauty" target="_blank" rel="noopener noreferrer" style={{ color: "#ff7a7a" }}>facebook.com/rosiebeauty</a>
      </div>
    </div>
  </div>
);

export default About;
