import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link'
import { FaComments, FaLandmark, FaRegGem } from "react-icons/fa";
import axios from "axios";
import "chart.js/auto";
import "./Admin.css";

const Admin = () => {
  const [categories, setCategories] = useState([]);
  const [museums, setMuseums] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [commentsCount, setCommentsCount] = useState(0);
  const [museumsCount, setMuseumsCount] = useState(0);
  const [artifactsCount, setArtifactsCount] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentAction, setCurrentAction] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    userName: "", // Initialize userName
    museumName: "", // Initialize museumName
    rating: "", // Initialize rating
    comment: "", // Initialize comment
    name: "",
    description: "",
    imageUrlList: "",
    imageUrl: "",
    openingTime: "",
    closingTime: "",
    ticketPrice: "",
    id: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [commentsRes, museumsRes, artifactsRes, categoriesRes] =
        await Promise.all([
          axios.get("https://monu-talk-production.up.railway.app/reviews"),
          axios.get("https://monu-talk-production.up.railway.app/museums"),
          axios.get("https://monu-talk-production.up.railway.app/artifacts"),
          axios.get("https://monu-talk-production.up.railway.app/categories"),
        ]);

      setCommentsCount(commentsRes.data.length);
      setMuseumsCount(museumsRes.data.length);
      setArtifactsCount(artifactsRes.data.length);
      setCategories(categoriesRes.data);
      setMuseums(museumsRes.data);
      setReviews(commentsRes.data); // Set reviews data
      setArtifacts(artifactsRes.data); // Set artifacts data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleAdd = async () => {
    const {
      type,
      name,
      location,
      openingTime,
      closingTime,
      ticketPrice,
      categoryId,
      description,
      image,
      museumId,
      images,
      userId,
      rating,
      comment,
    } = formData;

    try {
      let response;
      const formData = new FormData();

      if (type === "museum") {
        formData.append("name", name);
        formData.append("location", location);
        formData.append("openingTime", openingTime);
        formData.append("closingTime", closingTime);
        formData.append("ticketPrice", parseInt(ticketPrice));
        formData.append("categoryId", categoryId);
        formData.append("description", description);
        formData.append("image", image);

        response = await axios.post(
          "https://monu-talk-production.up.railway.app/museums",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else if (type === "artifact") {
        formData.append("name", name);
        formData.append("museumId", museumId);
        formData.append("description", description);

        // Append multiple images if needed
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }

        response = await axios.post(
          "https://monu-talk-production.up.railway.app/artifacts",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      } else if (type === "comment") {
        formData.append("userId", userId);
        formData.append("museumId", museumId);
        formData.append("rating", rating);
        formData.append("comment", comment);

 

        response = await axios.post(
          "https://monu-talk-production.up.railway.app/reviews",
          formData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      console.log("Response:", response); // Log the response from the server

      if (response && (response.status === 200 || response.status === 201)) {
        console.log("Item added successfully:", response.data);
        await fetchData(); // Refetch data after adding
        setShowAddModal(false);
        setFormData({
          type: "",
          name: "",
          location: "",
          openingTime: "",
          closingTime: "",
          ticketPrice: "",
          categoryId: "",
          description: "",
          image: null,
          museumId: "",
          images: [],
          userId: "",
          rating: "",
          comment: "",
        });
      } else {
        console.error(
          "Failed to add item:",
          response ? response.status : "unknown error",
          response ? response.data : "unknown data"
        );
      }
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleDelete = async () => {
    const { type, id } = formData;
    try {
      if (type === "comment") {
        await axios.delete(
          `https://monu-talk-production.up.railway.app/reviews/${id}`
        );
      } else if (type === "museum") {
        await axios.delete(
          `https://monu-talk-production.up.railway.app/museums/${id}`
        );
      } else if (type === "artifact") {
        await axios.delete(
          `https://monu-talk-production.up.railway.app/artifacts/${id}`
        );
      }
      setShowDeleteModal(false);
      setFormData({
        type: "",
        name: "",
        location: "",
        openingTime: "",
        closingTime: "",
        ticketPrice: "",
        categoryId: "",
        description: "",
        image: null,
        museumId: "",
        images: [],
        userId: "",
        rating: "",
        comment: "",
        id: "",
      });
      await fetchData(); // Refetch data after deleting
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleShowDeleteModal = (type) => {
    setCurrentAction(type);
    setFormData({ ...formData, type });
    setShowDeleteModal(true);
  };

  const handleShowAddModal = (type) => {
    setCurrentAction(type);
    setFormData({ ...formData, type });
    setShowAddModal(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"];

  const barData = {
    labels: [
      "The Egyptian Museum",
      "Bibliotheca Alexandria",
      "Grand Egyptian Museum",
      "Coptic Museum",
      "Luxor Museum",
    ],
    datasets: [
      {
        label: "Museums",
        backgroundColor: colors,
        borderColor: colors.map((color) => color.replace("0.2", "1")),
        borderWidth: 1,
        hoverBackgroundColor: colors.map((color) =>
          color.replace("0.2", "0.6")
        ),
        hoverBorderColor: colors.map((color) => color.replace("0.2", "1")),
        data: [75, 65, 82, 55, 65],
      },
    ],
  };

  const pieData = {
    labels: [
      "The Egyptian Museum",
      "Bibliotheca Alexandria",
      "Grand Egyptian Museum",
      "Coptic Museum",
      "Luxor Museum",
    ],
    datasets: [
      {
        data: [75, 65, 82, 55, 65],
        backgroundColor: colors,
        hoverBackgroundColor: colors,
      },
    ],
  };

  return (
    <div className="admin">
      <Container className="admin-dashboard">
        <Link to="/" className="Back">
          <button>&larr; Back</button>
        </Link>
        <h2 className="text-center mb-4">Admin Dashboard</h2>
        <Row>
          <Col md={6} className="mb-4">
            <div className="chart-container">
              <Bar
                data={barData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 2000,
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: "#ffffff",
                      },
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: colors,
                      },
                    },
                    y: {
                      ticks: {
                        color: "white",
                      },
                    },
                  },
                }}
              />
            </div>
          </Col>
          <Col md={6} className="mb-4">
            <div className="chart-container">
              <Pie
                data={pieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  animation: {
                    duration: 2000,
                  },
                  plugins: {
                    legend: {
                      labels: {
                        color: "#ffffff",
                      },
                    },
                  },
                }}
              />
            </div>
          </Col>
        </Row>
        <Row className="mt-5 text-center">
          <Col>
            <FaComments size={70} />
            <h4>Reviews</h4>
            <p>{commentsCount}</p>
            <HashLink to="/#Comments">
            <Button
              variant="primary"
            >
              View Reviews
            </Button>
            </HashLink>
            <Button
              variant="danger"
              className="ml-2"
              onClick={() => handleShowDeleteModal("comment")}
            >
              Delete Review
            </Button>
          </Col>
          <Col>
            <FaLandmark size={70} />
            <h4>Museums</h4>
            <p>{museumsCount}</p>
            <Button
              variant="primary"
              onClick={() => handleShowAddModal("museum")}
            >
              Add Museum
            </Button>
            <Button
              variant="danger"
              className="ml-2"
              onClick={() => handleShowDeleteModal("museum")}
            >
              Delete Museum
            </Button>
          </Col>
          <Col>
            <FaRegGem size={70} />
            <h4>Artifacts</h4>
            <p>{artifactsCount}</p>
            <Button
              variant="primary"
              onClick={() => handleShowAddModal("artifact")}
            >
              Add Artifact
            </Button>
            <Button
              variant="danger"
              className="ml-2"
              onClick={() => handleShowDeleteModal("artifact")}
            >
              Delete Artifact
            </Button>
          </Col>
        </Row>

        {/* Add Modal */}
        <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add {currentAction}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {currentAction === "comment" ? (
                <>
                  <Form.Group controlId="formUserId">
                    <Form.Label>User ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter user ID"
                      name="userId"
                      value={formData.userId}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formMuseumId" className="mt-3">
                    <Form.Label>Museum</Form.Label>
                    <Form.Select
                      name="museumId"
                      value={formData.museumId}
                      onChange={handleChange}
                    >
                      <option>Select Museum</option>
                      {museums.map((museums) => (
                        <option value={museums.id}>{museums.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="formRating" className="mt-3">
                    <Form.Label>Rating (1-5)</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter rating"
                      name="rating"
                      value={formData.rating}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formComment" className="mt-3">
                    <Form.Label>Comment</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter comment"
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </>
              ) : currentAction === "museum" ? (
                <>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formLocation" className="mt-3">
                    <Form.Label>Location</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formOpeningTime" className="mt-3">
                    <Form.Label>Opening Time</Form.Label>
                    <Form.Control
                      type="time"
                      placeholder="Enter opening time"
                      name="openingTime"
                      value={formData.openingTime}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formClosingTime" className="mt-3">
                    <Form.Label>Closing Time</Form.Label>
                    <Form.Control
                      type="time"
                      placeholder="Enter closing time"
                      name="closingTime"
                      value={formData.closingTime}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formTicketPrice" className="mt-3">
                    <Form.Label>Ticket Price</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="Enter ticket price"
                      name="ticketPrice"
                      value={formData.ticketPrice}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formCategoryId" className="mt-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleChange}
                    >
                      <option>Select Category</option>
                      {categories.map((category) => (
                        <option value={category.id}>{category.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="formDescription" className="mt-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formImage" className="mt-3">
                    <Form.Label>Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="image"
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.files[0] })
                      }
                    />
                  </Form.Group>
                </>
              ) : (
                <>
                  <Form.Group controlId="formName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formMuseumId" className="mt-3">
                    <Form.Label>Museum</Form.Label>
                    <Form.Select
                      name="museumId"
                      value={formData.museumId}
                      onChange={handleChange}
                    >
                      <option>Select Museum</option>
                      {museums.map((museums) => (
                        <option value={museums.id}>{museums.name}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group controlId="formDescription" className="mt-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="formImages" className="mt-3">
                    <Form.Label>Images</Form.Label>
                    <Form.Control
                      type="file"
                      name="images"
                      multiple
                      onChange={(e) =>
                        setFormData({ ...formData, images: e.target.files })
                      }
                    />
                  </Form.Group>
                </>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAdd}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Delete {currentAction}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {currentAction === "museum" && (
                <Form.Group controlId="formId">
                  <Form.Label>Museum</Form.Label>
                  <Form.Select
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                  >
                    <option>Select Museum</option>
                    {museums.map((museum) => (
                      <option key={museum.id} value={museum.id}>
                        {museum.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
              {currentAction === "artifact" && (
                <Form.Group controlId="formId">
                  <Form.Label>Artifact</Form.Label>
                  <Form.Select
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                  >
                    <option>Select Artifact</option>
                    {artifacts.map((artifact) => (
                      <option key={artifact.id} value={artifact.id}>
                        {artifact.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
              {currentAction === "comment" && (
                <Form.Group controlId="formId">
                  <Form.Label>Review</Form.Label>
                  <Form.Select
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                  >
                    <option>Select Review</option>
                    {reviews.map((review) => (
                      <option key={review.id} value={review.id}>
                        {review.comment}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Close
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Admin;
