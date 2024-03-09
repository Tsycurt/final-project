/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { Container, Image } from "react-bootstrap";
import useLocalState from "../../utils/localState";
import axios from "axios";
import "../../styles/create-tour.css";
import { useGlobalContext } from "../../context/AuthContext";
import { useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import { toast } from "react-toastify";
import Carousel from "react-bootstrap/Carousel";
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
import Spinner from "../../components/Spinner/Spinner";
import { BASE_URL } from "../../utils/config";


const UpdateTour = () => {
  const searchBoxRef = useRef(null);
  const [tour, setTour] = useState(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [images, setImages] = useState([]);
  const [imgValue, setImgValue] = useState([]);
  const [formValidated, setFormValidated] = useState(false);
  const { alert, showAlert, loading, setLoading, hideAlert } = useLocalState();
  const navigate = useNavigate();
  const tourId = useParams().id;

  const { user } = useGlobalContext();
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tours/${tourId}`, {
          withCredentials: true,
        });
        const {
          title,
          price,
          description,
          city,
          images,
        } = response.data.tour;
        setTitle(title);
        setPrice(price);
        setDescription(description);
        setCity(city);
        setImgValue(images);
        setTour(response.data.tour);
      } catch (error) {
        const { msg } = error.response.data;
        toast.error(msg ? msg : "An error Occured");
      }
    };
    fetchTour();
  }, [tourId, user]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    let updatedImages = imgValue;
    hideAlert();
    setLoading(true);
    const form = e.currentTarget;
    if (form.checkValidity()) {
      // Form is valid, continue with form submission
      if (price < 500) {
        showAlert({ text: "Price must be greater than 500" });
        setLoading(false);
        return;
      }

      if (images?.length > 0) {
        const formData = new FormData();
        images.forEach((image) => {
          formData.append(`images`, image);
        });
        try {
          const response = await axios.post(
            `${BASE_URL}/tours/uploadImage`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true,
            }
          );
          updatedImages = response.data.images;
        } catch (error) {
          showAlert({ text: error.response.data.msg });
          setLoading(false);
          return;
        }
      }
      // Update the tour with the new data
      const tourData = {
        title,
        price,
        description,
        city,
        images: updatedImages,
      };

      try {
        await axios.patch(`${BASE_URL}/tours/${tourId}`, tourData, {
          withCredentials: true,
        });
        showAlert({
          text: `Tour updated successfully!`,
          type: "success",
        });
        setLoading(false);
        setTimeout(() => {
          navigate("/tours");
        }, 2000);
      } catch (error) {
        showAlert({ text: error.response.data.msg });
        setLoading(false);
      }
    } else {
      // Form is invalid, mark it as validated to show error messages
      setFormValidated(true);
      setLoading(false);
    }
  };


  return (
    <>
      <Container className="create-tour-container mt-5 pt-5">
        <div className="create-tour-heading text-center mb-5">
          <h2>Update this Tour Package</h2>
        </div>
        <Row>
          <Col lg="8" className="m-auto">
            {alert.show && (
              <div
                className={`create-tour-alert text-center alert alert-${alert.type}`}
              >
                {alert.text}
              </div>
            )}
            <Form
              onSubmit={handleSubmit}
              noValidate
              validated={formValidated}
              className={
                loading ? "create-tour-form form-loading" : "create-tour-form"
              }
            >
              <Form.Group
                controlId="title"
                className="create-tour-form-group mb-3"
              >
                <Form.Label>Title:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter a title for your tour package"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a title.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                controlId="price"
                className="create-tour-form-group mb-3"
              >
                <Form.Label>Price:</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a price.
                </Form.Control.Feedback>
                {formValidated && price <= 500 && (
                  <Form.Text className="text-danger">
                    Price must be greater than 500.
                  </Form.Text>
                )}
              </Form.Group>
              <Form.Group
                controlId="description"
                className="create-tour-form-group mb-3"
              >
                <Form.Label>Description:</Form.Label>
                <Form.Control
                  as="textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a description.
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="image" className="mb-3">
                <Form.Label>
                  <b>Images:</b>
                </Form.Label>
                {imgValue && (
                  <div className="text-center">
                    <Carousel>
                      {imgValue?.map((photo, index) => (
                        <Carousel.Item key={index}>
                          <img
                            alt="tour"
                            className="tour-image"
                            src={photo}
                            style={{ height: "40vh", width: "40vw" }}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  </div>
                )}
                <Form.Control
                  type="file"
                  multiple
                  onChange={(e) => setImages(Array.from(e.target.files))}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide an image.
                </Form.Control.Feedback>
              </Form.Group>

              <div className="text-center my-4">
                <Button variant="outline-dark" type="submit" disabled={loading}>
                  {loading ? "Loading..." : "Update"}
                </Button>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default UpdateTour;
