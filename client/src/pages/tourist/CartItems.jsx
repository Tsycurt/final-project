import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Spinner from "../../components/Spinner/Spinner";
import "../../styles/manage-users.css";
import { BASE_URL } from "../../utils/config";
import { toast } from "react-toastify";
function CartItems() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    axios
      .get(`${BASE_URL}/cart`, { withCredentials: true })
      .then((response) => {
        const result = response.data.cart;
        setCart(result);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);
console.log(cart);

  const removeFromCart = async(id) => {
    try {
      const res = await axios.delete(`${BASE_URL}/cart/${id}`, { withCredentials: true })
       setCart(cart.filter((t) => t._id !== id));
      toast.success('Tour Removed From Cart')
    } catch (error) {
      toast.error(error.response.data.message)
    }
  };

  if (loading) {
    return <Spinner />;
  }


  return (
    <div className="container mt-5">
      <h1 className="text-center mb-3 custom-header">Cart</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Tour Title</th>
            <th scope="col">Tour City</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {cart?.map((c) => (
            <tr key={c?._id}>
              <td>
                <Link
                  className="custom-link"
                  target="_blank"
                  to={`/tours/${c?.tour._id}`}
                >
                  {c?.tour?.title}
                </Link>
              </td>
              <td>{c?.tour?.city}</td>
              <td>
                {" "}
                <button
                  className={"btn btn-danger" }
                  onClick={() => removeFromCart(c?._id)}
                >
                  Remove From Cart
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CartItems;
