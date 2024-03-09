/* eslint-disable react/prop-types */
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import registerImg from "../../assets/images/register.png";
import { useFormik } from "formik";
import { validationSchema } from "../../utils/validationSchema";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../utils/config";
const RegisterForm = ({
  loading,
  setLoading,
}) => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await axios.post(`${BASE_URL}/auth/register`, values,{withCredentials:true});
        formik.resetForm(); 
        toast.success("Registration Successful")
        setTimeout(() => {
          navigate('/login');
        }, 2500)
      } catch (error) {
        const { msg } = error.response.data;
        toast.error(msg?msg:"An Error Ocurred")
      }
      setLoading(false);
    },
  });

  return (
    <section>
      <Container>
        <Row>
          <Col lg="9" className="m-auto">
            <div className="login__container d-flex justify-content-between">
              <div className="login__img my-auto">
                <img src={registerImg} alt="" />
              </div>
              <div className="login__form">
                <h2>Register</h2>
                {alert.show && (
                  <div className={`alert alert-${alert.type}`}>
                    {alert.text}
                  </div>
                )}
                  <Form
                    className={loading ? "form form-loading" : "form"}
                    onSubmit={formik.handleSubmit}
                  >
                    <Form.Group controlId="name" className="mt-3 mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Enter your full name"
                        {...formik.getFieldProps("name")}
                      />
                      {formik.touched.name && formik.errors.name && (
                        <div className="error-message mx-1">
                          {formik.errors.name}
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group controlId="email" className="mt-3 mb-3">
                      <Form.Control
                        type="email"
                        placeholder="example@domain.com"
                        {...formik.getFieldProps("email")}
                      />
                      {formik.touched.email && formik.errors.email && (
                        <div className="error-message mx-1">
                          {formik.errors.email}
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group className="mt-3 mb-3">
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        {...formik.getFieldProps("password")}
                      />
                      {formik.touched.password && formik.errors.password && (
                        <div className="error-message mx-1">
                          {formik.errors.password}
                        </div>
                      )}
                    </Form.Group>

                    <Button
                      className="btn secondary__btn auth__btn"
                      type="submit"
                      disabled={formik.isSubmitting}
                    >
                      {formik.isSubmitting ? "Loading..." : "Register"}
                    </Button>
                  </Form>
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default RegisterForm;
