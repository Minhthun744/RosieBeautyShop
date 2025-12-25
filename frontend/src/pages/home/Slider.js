import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Card, Carousel } from "react-bootstrap";

// Ảnh slide
import slide1 from "../../assets/images/banners/banner1.webp";
import slide2 from "../../assets/images/banners/banner2.webp"; // nên dùng ảnh khác nhau

const Slider = () => {
  return (
    <section className="section-main py-3">
      <Card className="border-0">
        <Card.Body className="p-0">
          <Carousel fade interval={3000} pause={false}>
            {[slide1, slide2].map((imgSrc, idx) => (
              <Carousel.Item key={idx}>
                <img
                  src={imgSrc}
                  alt={`Slide ${idx + 1}`}
                  className="d-block w-100"
                  style={{
                    height: "70vh",
                    objectFit: "cover",
                    borderRadius: "0.5rem",
                  }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Card.Body>
      </Card>
    </section>
  );
};

export default Slider;
