/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/AuthContext";
import { Form, Button, Image, Row, Col } from "react-bootstrap";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import "../../styles/update-profile.css";
import avatar from "../../assets/images/avatar.jpg";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/config";

const UpdateProfile = () => {
  const { user, updateUser } = useGlobalContext();
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [originalImage, setOriginalImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingName, setEditingName] = useState(false);
  const [editingPhoneNo, setEditingPhoneNo] = useState(false);
  const [editingImage, setEditingImage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);
  const [password,setPassword] = useState("")
  const [newPassword,setNewPassword] = useState("")
  useEffect(() => {
    setName(user?.name);
    setImage(user?.image);
    setOriginalImage(user?.image);
    setLoading(false);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    let src = originalImage;
    try {
      if (image !== originalImage) {
        // If image has been added or updated, upload the new image
        const formData = new FormData();
        formData.append("images", image);

        const data = await axios.post(`${BASE_URL}/tours/uploadImage`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            
          },
          withCredentials:true
        });

        const newSrc = data.data.images[0];
        src = newSrc;
        toast.success("Image Updated Successfully");
      }
    } catch (error) {
      const msg = error.response.data.msg;
      toast.error(msg ? msg : "An error occured");
    }

    const userData = { name, image: src };
    axios
      .put(`${BASE_URL}/users/updateUser`, userData,{withCredentials:true})
      .then((response) => {
        const { data } = response.data;
        // check if data and data.user exist
        updateUser(response.data.user);
        toast.success("Profile updated successfully!");
        setEditingName(false);
        setEditingPhoneNo(false);
        setEditingImage(false);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <div className="update-profile">
      <h1 className="header text-center" style={{ color: "#4b6584" }}>
        Update Your Profile
      </h1>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {!loading && (
        <Form onSubmit={handleSubmit} className="profile-form">
          <Form.Group controlId="formBasicImage" className="image-container">
            {editingImage ? (
              <Form.Control
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            ) : (
              <div>
                {image ? (
                  <Image
                    src={image}
                    roundedCircle
                    className="profile-image"
                    alt={avatar}
                  />
                ) : (
                  <Image
                    src={avatar}
                    roundedCircle
                    className="profile-image"
                    alt={image}
                  />
                )}
              </div>
            )}
            <FontAwesomeIcon
              icon={faEdit}
              onClick={() => setEditingImage(!editingImage)}
              className="edit-icon"
            />
          </Form.Group>
          <Form.Group controlId="formBasicName" className="field-group">
            <Form.Label>
              <strong>Name</strong>
            </Form.Label>
            {editingName ? (
              <Form.Control
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <Row className="field-row">
                <div className="justify-content-centerr">
                  <div>{name}</div>
                  <Col xs="auto" className="edit-icon-col">
                    <FontAwesomeIcon
                      icon={faEdit}
                      onClick={() => setEditingName(true)}
                      className="edit-icon"
                    />
                  </Col>
                </div>
              </Row>
            )}
          </Form.Group>
          {(editingName || editingPhoneNo || editingImage) && (
            <Button variant="primary" type="submit" className="submit-btn">
              Save Changes
            </Button>
          )}
        </Form>
      )}
    </div>
  );
};

export default UpdateProfile;
