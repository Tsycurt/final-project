import "../styles/home.css";
import { Container, Row, Col } from "react-bootstrap";
import experienceImg from "../assets/images/hero11.jpg";
import Subtitle from "./../shared/Subtitle";
import MasonryImagesGallery from "../components/Image-gallery/MasonryImagesGallery";

const AboutUs = () => {
  return (
    <>
    
      <section>
        <Container className="mt-5 pt-5">
          <Row>
            <Col lg="6">
              <div className="experience__content">
                <Subtitle subtitle={"Experience"} />
                <h2>
                  Discover Unforgettable Experiences <br /> Tailored Just for
                  You
                </h2>
                <p>
                  At our travel agency, we are dedicated to curating
                  extraordinary experiences that will leave you spellbound. With
                  our extensive knowledge and passion for travel, we have
                  crafted a diverse range of tours that cater to every traveler
                  a unique preferences. Whether you crave thrilling adventures,
                  cultural immersions, or serene retreats, our expert tour
                  companies will take you on a journey of a lifetime. We
                  meticulously handpick the top attractions of each destination,
                  ensuring that you uncover hidden gems and create cherished
                  memories.
                </p>
              </div>

              <div className="counter__wrapper d-flex align-items-center gap-5 ">
                <div className="counter__box ">
                  <span>3+</span>
                  <h6>Years experience</h6>
                </div>
                <div className="counter__box ">
                  <span>100+</span>
                  <h6>Professional Tour Vendors</h6>
                </div>
              </div>
            </Col>
            <Col lg="6">
              <div className="experience__img">
                <img src={experienceImg} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      {/* ============ experience section end ============= */}

      {/* ============ gallery section start =============== */}
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <Subtitle subtitle={"Gallery"} />
              <h2 className="gallery__title">
                Visit our customers tour gallery
              </h2>
            </Col>
            <Col lg="12">
              <MasonryImagesGallery />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default AboutUs;
