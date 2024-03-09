import "../../styles/tour-details.css";
import Carousel from "react-bootstrap/Carousel";
import { Container, Row, Col } from "reactstrap";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import {
  FaMapMarkedAlt,
  FaMoneyBillWave,
} from "react-icons/fa";
import Spinner from "../../components/Spinner/Spinner";
import { BASE_URL } from "../../utils/config";
const TourDetails = () => {
  const { id } = useParams(); 

  // fetch data from database
  const { data, loading, error } = useFetch(`${BASE_URL}/tours/${id}`);
  const tour = data?.tour;
  console.log(tour);

  if (loading) {
    return <Spinner />;
  }

  const {
    images,
    title,
    description,
    price,
    city,
  } = tour;
  return (
    <>
      <section>
        <Container className="mt-5 pt-2">
          {loading && <Spinner />}
          {error && <h4 className="text-center pt-5">{error}</h4>}
          {!loading && !error && (
            <Row className="align-items-center justify-content-center">
              <Col lg="8">
                <div className="tour__content">
                  <Carousel>
                    {images?.map((photo, index) => (
                      <Carousel.Item key={index}>
                        <img alt="tour" className="tour-image" src={photo} />
                      </Carousel.Item>
                    ))}
                  </Carousel>

                  <div className="tour__info text-center">
                    <h2>{title}</h2>

                    <div className="d-flex gap-5 tour-detail-icons">
                    </div>

                    <div className="tour__extra-details">
                      <span>
                        <FaMapMarkedAlt className="tour-icon" /> {city}
                      </span>
                      <span>
                        <FaMoneyBillWave className="tour-icon" /> Dollar {price}{" "}
                        /per person
                      </span>
                    </div>
                    <h5 className="mt-4">Description</h5>
                    <p>{description}</p>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </Container>
      </section>
    </>
  );
};

export default TourDetails;
