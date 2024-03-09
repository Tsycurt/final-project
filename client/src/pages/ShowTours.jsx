import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { BASE_URL } from "./../utils/config";
import { useGlobalContext } from "./../context/AuthContext";
import "../styles/show-tours.css";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner/Spinner";
const ShowTours = () => {
  const [data, setData] = useState([]);
  const [loading,setLoading]=useState(false)
  const { user } = useGlobalContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  useEffect(() => {
      setLoading(true);
      axios
        .get(`${BASE_URL}/tours`)
        .then((response) => {
          setData(response.data.tours);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          toast.error(error);
        });
  }, [user]);

  const handleDelete = (id) => {
    axios
      .delete(`${BASE_URL}/tours/${id}`, { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setData(data.filter((t) => t._id !== id));
      })
      .catch((err) => console.log(err));
  };


  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const getCurrentItems = () => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    return data.slice(indexOfFirstItem, indexOfLastItem);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <>
      {loading ? (<Spinner/>): (
        <Container className="show-tours-container">
      <div className="tours-container">
        <h1 className="mb-4">Tour Packages</h1>
        <div className="table-responsive">
          <Table striped bordered hover className="tours-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>City Name</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {getCurrentItems().map((tour) => (
                <tr key={tour.id}>
                  <td>
                    <Link className="custom-link" to={`/tour/${tour.id}`}>
                      {tour.title}
                    </Link>
                  </td>
                  <td>{tour.city}</td>
                  <td>
                    <Link
                      className="action-link"
                      to={`/${user?.role}/dashboard/update-tour/${tour._id}`}
                    >
                      <Button className="action-button update-button">
                        Update
                      </Button>
                    </Link>
                  </td>
                 
                  <td>
                    <Button
                      className="action-button delete-button"
                      onClick={() => handleDelete(tour._id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      {/* Custom pagination */}
      <div className="custom-pagination-container text-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          className={`btn btn-outline-warning mx-1 ${
            currentPage === 1 ? "disabled" : ""
          }`}
        >
          &lt; Prev
        </button>
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`btn ${
              currentPage === index + 1
                ? "btn-warning active__page"
                : "btn-outline-warning"
            } mx-1`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          className={`btn btn-outline-warning mx-1 ${
            currentPage === totalPages ? "disabled" : ""
          }`}
        >
          Next &gt;
        </button>
      </div>
    </Container >
      )}
            </>
  );
};

export default ShowTours;
