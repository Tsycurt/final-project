/* eslint-disable react/prop-types */
import { Card, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import "./tour-card.css";
import axios from "axios";
import { BASE_URL } from "../utils/config";
import { toast } from "react-toastify";
const TourCard = ({ tour }) => {
  const { _id, title, city, images, price } = tour;

  const handleClick = async(tour) => {
    try {
      const response = await axios.post(`${BASE_URL}/cart`, {tour}, { withCredentials: true });
      toast.success('Tour Added to cart Successfully')
    } catch (error) {
      toast.error(error.response.data.msg?error.response.data.msg:'Error Adding tour to cart')
    }
  };

  return (
    <div className="tour__card">
      <Card>
        <div className="tour__img">
          <img src={images[0]} alt="tour" />
        </div>

        <CardBody>
          <div className="card__top d-flex align-items-center justify-content-between">
            <div className="tour__location d-flex align-items-center gap-1">
              <i className="ri-map-pin-line"></i> {city}
            </div>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-end pt-2"></div>
              {/* <span>
                <img
                  className="vendor-img"
                  src={vendor?.image}
                  onClick={() => navigate(`/users/${vendor._id}`)}
                  alt=""
                />
              </span> */}
            </div>
          </div>

          <span className="tour__title ">
            <Link className="tour-link" to={`/tours/${_id}`}>
              {title}
            </Link>
          </span>

          <div className="card__bottom d-flex align-items-center justify-content-between mt-3">
            <h5>
              Dollar {price} <span> /per person</span>
            </h5>

            <button
              className="btn booking__btn"
              onClick={() => handleClick(_id)}
            >
              <Link to={`/tours/${_id}`}>Add to cart</Link>
            </button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default TourCard;
