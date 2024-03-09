/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import { Container } from "react-bootstrap";
import useLocalState from "../../utils/localState";
import axios from "axios";
import { useLoadScript, StandaloneSearchBox } from "@react-google-maps/api";
import "../../styles/create-tour.css";
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
import Spinner from "../../components/Spinner/Spinner";
import { BASE_URL } from "../../utils/config";

const CreateTour = () => {
  const searchBoxRef = useRef(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("");
  const [images, setImages] = useState([]); 
  const [formValidated, setFormValidated] = useState(false);


  const { alert, showAlert, loading, setLoading, hideAlert } = useLocalState();
  const navigate = useNavigate();
 const { isLoaded } = useLoadScript({
   googleMapsApiKey: apiKey,
   libraries: ["places"],
 });
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      // Upload the image first
      const formData = new FormData();
      images.forEach((image) => {
        formData.append("images", image);
      });

      try {
        // Upload the images to the server
        const response = await axios.post(
          `${BASE_URL}/tours/uploadImage`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials:true
          }
        );

        const imageUrls = response.data.images;
       
        // Continue with creating the tour using the image URLs
        const tourData = {
          title,
          price,
          description,
          city,
          images: imageUrls, 
        };

        await axios.post(`${BASE_URL}/tours`, tourData,{withCredentials:true});

        showAlert({
          text: `Tour created successfully!`,
          type: "success",
        });
        setLoading(false);
        setTimeout(() => {
          navigate("/tours");
        }, 2000);
      } catch (error) {
        setImages(null);
        showAlert({ text: error.response.data.msg });
        setLoading(false);
      }
    } else {
      // Form is invalid, mark it as validated to show error messages
      setFormValidated(true);
      setLoading(false);
    }
  };

  

  const handlePlacesChanged = async () => {
    if (!searchBoxRef.current) {
      return;
    }

    const places = searchBoxRef.current.getPlaces();
    if (places && places.length > 0) {
      const addressComponents = places[0].address_components;
      let cityName = "";
      for (let i = 0; i < addressComponents.length; i++) {
        const component = addressComponents[i];
        if (component.types.includes("locality")) {
          cityName = component.long_name;
        }
      }
      if (cityName) {
        setCity(cityName);
      }
    } else {
      console.log("City not found");
    }
  };

    if (!isLoaded) {
      return <Spinner />;
    }

  return (
    
        <Container className="create-tour-container mt-5 pt-2 mb-5 pb-5">
          <div className="create-tour-heading text-center mb-5">
            <h1>Create a Tour Package</h1>
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
                    placeholder="Enter price of your tour"
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
                <Form.Group
                  controlId="city"
                  className="create-tour-form-group mb-3"
                >
                  <Form.Label>City:</Form.Label>
                  <StandaloneSearchBox
                    ref={searchBoxRef}
                    onLoad={(ref) => (searchBoxRef.current = ref)}
                    onPlacesChanged={handlePlacesChanged}
                  >
                    <Form.Control
                      type="text"
                      className=""
                      placeholder="Enter city name of the tour"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </StandaloneSearchBox>
                </Form.Group>

                <Form.Group
                  controlId="images"
                  className="create-tour-form-group mb-3"
                >
                  <Form.Label>Images:</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={(e) => setImages(Array.from(e.target.files))}
                    multiple
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide an image.
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="text-center my-4">
                  <Button
                    variant="outline-dark"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Loading..." : "Create Tour"}
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
    
  );
};

export default CreateTour;
