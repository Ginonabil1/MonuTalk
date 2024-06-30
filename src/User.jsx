import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  Tab,
  Tabs,
  Card,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Form,
  Accordion,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { BsClock } from "react-icons/bs";
import { FaMapMarkerAlt ,FaMicrophone } from "react-icons/fa";
import { TiMediaRecord } from "react-icons/ti";
import { RxReset } from "react-icons/rx";




import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

import "./User.css";

const User = () => {
  const [museums, setMuseums] = useState([]);
  const [selectedMuseum, setSelectedMuseum] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [selectedRecMuseum, setSelectedRecMuseum] = useState(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [selectedMuseumDetails, setSelectedMuseumDetails] = useState(null);

  // CNN
  const [selectedImage, setSelectedImage] = useState(null);
  const [name, setName] = useState("");
  const [info, setInfo] = useState("");
  const [questionsList, setQuestionsList] = useState([]);

  // Interaction
  const [message, setMessage] = useState("");
  // const [transcript, setTranscript] = useState("");

  // const [isSpeaking, setIsSpeaking] = useState(false);
  const characterImageRef = useRef(null);
  const speakingIntervalRef = useRef(null);

  useEffect(() => {
    axios
      .get(
        "https://flask-server-monutalk-production.up.railway.app/museum-options"
      )
      .then((res) => {
        setMuseums(res.data.museums);
        console.log(res.data.museums);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  async function handleImageUpload() {
    const colabUrl = "https://4115-34-69-130-221.ngrok-free.app";

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(`${colabUrl}/upload`, formData);

      setName(response.data.name);
      setInfo(response.data.info);
      setQuestionsList(response.data.questions);
    } catch (err) {
      console.log(err);
    }
  }

  async function recommend() {
    if (selectedMuseum === "") {
      alert("Please select a museum.");
      return;
    }

    const response = await axios.post(
      "https://flask-server-monutalk-production.up.railway.app/recommend",
      {
        museum: selectedMuseum,
      }
    );

    setSelectedMuseumDetails(response.data.museum);

    setRecommendations(response.data.museums);
    console.log(response.data.museums);
  }

  async function chat() {
    try {
      const newMessage = { text: text, sender: "user" };
      setMessages((prevMessages) => [...prevMessages, newMessage]);

      const response = await axios.post(
        "https://flask-server-monutalk-production.up.railway.app/chat",
        { text }
      );

      const botResponse = response.data.output;
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: botResponse, sender: "bot" },
      ]);

      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  function handleTextChange(event) {
    setText(event.target.value);
  }

  function handleShowModal(museum) {
    setSelectedRecMuseum(museum);
    setModalShow(true);
  }

  function handleCloseModal() {
    setModalShow(false);
    setSelectedRecMuseum(null);
  }

  // Interaction
   
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const startListening = () =>
    SpeechRecognition.startListening({ continuous: true });

  const stopListening = () => {
    SpeechRecognition.stopListening();

    setMessage(transcript);
  };

  // Handle user input
  async function handleUserInput() {
    // value = document.getElementById("user_inp").value;

    console.log("User said:", message);

    const response = await axios.post(
      "https://flask-server-monutalk-production.up.railway.app/chat",
      { text: message }
    );

    const chatBotResponse = response.data.output;

    console.log("Chatbot said:", chatBotResponse);

    speak(chatBotResponse);

    setMessage('')
  }

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);

    utterance.voice = window.speechSynthesis
      .getVoices()
      .find((voice) => voice.lang === "en-US");
    window.speechSynthesis.speak(utterance);

    startSpeakingAnimation();

    utterance.onend = () => {
      stopSpeakingAnimation(); // Revert to original image after speaking
    };
  }

  function startSpeakingAnimation() {
    // setIsSpeaking(true);
    // let toggle = true;
    characterImageRef.current.src = "imgs/d2.gif";
    // speakingIntervalRef.current = setInterval(() => {
    //   if (characterImageRef.current) {
    //     characterImageRef.current.src = toggle ? "imgs/d1.png" : "imgs/d2.gif";
    //   }
    //   toggle = !toggle;
    // }, 350); // Switch images every 350ms
  }

  // Stop speaking animation
  function stopSpeakingAnimation() {
      characterImageRef.current.src = "/imgs/d1.png"; // Revert to idle image

    // if (speakingIntervalRef.current) {
    //   clearInterval(speakingIntervalRef.current);
    //   speakingIntervalRef.current = null; // Ensure the interval is cleared
    // }
    // if (characterImageRef.current) {
    //   characterImageRef.current.src = "/imgs/d1.png"; // Revert to idle image
    // }
    // setIsSpeaking(false);
  }

  useEffect(() => {
    return () => {
      // Cleanup interval on component unmount
      if (speakingIntervalRef.current) {
        clearInterval(speakingIntervalRef.current);
      }
    };
  }, []);

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <section className="userr">
      <Link to="/LoginRegister" className="Log_out">
        <button>Log out</button>
      </Link>
      <div className="cont">
        <Tabs
          defaultActiveKey="home"
          id="fill-tab-example"
          className="mb-3"
          fill
        >
          <Tab eventKey="home" title="Home" className="container tab1">
            <div className="design">
              <h1>Recommendation System</h1>
              <p>

              Monument Talk's recommendation system personalizes your museum 
              journey using cosine similarity, a technique that measures 
              the angle between vectors representing museums and exhibits
               in a multi-dimensional space. By translating user preferences
                into vectors and comparing them with those of museums,
                 the system recommends highly similar museums and exhibits
                  based on past visits and interests, ensuring a personalized exploration experience.
              </p>
            </div>
            <div className="design">
              <h1>Chatbot</h1>
              <p>
              MonuTalk is an advanced chatbot that provides engaging conversations about
               ancient Egyptians and the pharaohs. Using natural language processing (NLP)
                and machine learning (ML), MonuTalk accurately understands and responds to user queries,
                 simulating human-like interactions. It supports both text and voice interactions,
                  offering a flexible and immersive experience. 
                  By analyzing questions and identifying user intent, MonuTalk delivers tailored,
                   informative, and engaging responses, 
                   continuously improving its accuracy and context-awareness over time.
              </p>
            </div>
            <div className="design">
              <h1>Image Recognition</h1>
              <p>
              MonuTalk leverages deep learning for image recognition,
               a core technology in computer vision. Specifically,
                it uses a Convolutional Neural Network (CNN) called EfficientNetB1
                 to identify historical artifacts and landmarks.
                 This model excels at analyzing images and extracting key features to recognize objects.
                  MonuTalk takes pre-trained EfficientNetB1,
                   which has already learned from a massive image database (ImageNet),
                    and fine-tunes it to focus on identifying ancient Egyptian monuments.
                     This approach prioritizes efficiency (both computational power and model size)
                      while maintaining high accuracy.
              
              </p>
            </div>
            <div className="design">
              <h1>Dialogue</h1>
              <p>
              MonuTalk bridges the gap between users and historical knowledge.
               This NLP-powered chatbot fosters interactive dialogues about historical figures,
                landmarks, and events. Users engage through natural speech,
                 receiving insightful and informative responses tailored to their understanding level.
                  Ideal for history enthusiasts, educators, and casual learners,
                   MonuTalk personalizes the exploration of the past.
              </p>
            </div>
          </Tab>

          <Tab eventKey="Recommendation System" title="Recommendation System">
            <div className="rec mb-5">
              <h2>Choose Museum:</h2>
              <div className="selc">
                <select
                  value={selectedMuseum}
                  onChange={(e) => setSelectedMuseum(e.target.value)}
                  className="form-select"
                >
                  <option value="" disabled>
                    Select a Museum
                  </option>
                  {Array.isArray(museums) &&
                    museums.map((museum, index) => (
                      <option key={index} value={museum}>
                        {museum}
                      </option>
                    ))}
                </select>
                <button onClick={recommend} className="btn btn-primary">
                  Recommend
                </button>
              </div>
            </div>

            {selectedMuseumDetails && (
              <>
                <h3>Selected Museum:</h3>
                <div className="selected recommendations mb-5">
                  <Card style={{ width: "100%" }} className="card">
                    <Card.Body>
                      <Card.Title className="card_name">
                        {selectedMuseumDetails.name}
                      </Card.Title>
                      <Card.Subtitle className="card_p">
                        <span>Category:</span> {selectedMuseumDetails.category}
                      </Card.Subtitle>
                      <Card.Text className="card_p">
                        <span>Location:</span> {selectedMuseumDetails.location}
                      </Card.Text>
                      <Button
                        className="card_button"
                        variant="primary"
                        onClick={() => handleShowModal(selectedMuseumDetails)}
                      >
                        Description
                      </Button>

                      <Button className="card_button2" variant="primary">
                        <Link to={selectedMuseumDetails.locationUrl} target="_blank">
                          <span>Directions</span>
                          <FaMapMarkerAlt />
                        </Link>
                      </Button>
                    </Card.Body>
                  </Card>
                </div>
              </>
            )}

            {recommendations.length > 0 && (
              <div className="recommendations">
                <h3>Recommended Museums:</h3>
                <Container>
                  <Row>
                    {recommendations.map((rec, index) => (
                      <Col lg={4} md={6} sm={12} key={index} className="mb-4">
                        <Card style={{ width: "100%" }} className="card">
                          <Card.Body>
                            <Card.Title className="card_name">
                              {rec.name}
                            </Card.Title>
                            <Card.Subtitle className="card_p">
                              <span>Category:</span> {rec.category}
                            </Card.Subtitle>
                            <Card.Text className="card_p">
                              <span>Location:</span> {rec.location}
                            </Card.Text>

                            <Button
                              className="card_button"
                              variant="primary"
                              onClick={() => handleShowModal(rec)}
                            >
                              Description
                            </Button>

                            <Button className="card_button2">
                              <Link to={rec.locationUrl} target="_blank">
                                <span>Directions</span>
                                <FaMapMarkerAlt />
                              </Link>
                            </Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </Container>
              </div>
            )}
          </Tab>

          <Tab eventKey="chatbot" title="Chatbot">
            <Container fluid className="py-5 gradient-custom">
              <Row>
                <Col md="12" lg="12" xl="12">
                  <div className="chat-container">
                    <ul>
                      {messages.map((message, index) => (
                        <li
                          key={index}
                          className={`d-flex justify-content-between mb-4 ${
                            message.sender === "user" ? "flex-row-reverse" : ""
                          }`}
                        >
                          <Card className="mask-custom">
                            <Card.Header
                              className="d-flex justify-content-between p-3 msg_head"
                              style={{
                                borderBottom: "1px solid rgba(255,255,255,.3)",
                              }}
                            >
                              <p className="fw-bold mb-0 Monu">
                                {message.sender === "user"
                                  ? "User"
                                  : "MonuTalk"}
                              </p>
                              <p className="text-light small mb-0">
                                <BsClock /> a few seconds ago
                              </p>
                            </Card.Header>
                            <Card.Body>
                              <p className={`mb-0 msg ${message.sender}`}>
                                {message.text}
                              </p>
                            </Card.Body>
                          </Card>
                        </li>
                      ))}
                      <li>
                        <div className="input-container">
                          <input
                            type="text"
                            value={text}
                            onChange={handleTextChange}
                            className="form-control"
                            placeholder="Ask about ancient Egyptians or pharaohs"
                          />
                          <button onClick={chat} className="btn btn-primary">
                            Send
                          </button>
                        </div>
                      </li>
                    </ul>
                  </div>
                </Col>
              </Row>
            </Container>
          </Tab>

          <Tab eventKey="Image Recognition" title="Image Recognition" className="recognition">
            <Form.Group controlId="formImage">
              <Form.Label id="txt">Upload Image:</Form.Label>
              <div className="upload">
              <Form.Control
                type="file"
                name="image"
                className="form-select"
                onChange={(e) => setSelectedImage(e.target.files[0])}
              />
            <Button variant="primary" onClick={handleImageUpload}>
              Upload
            </Button>
              </div>

            </Form.Group>


            {questionsList && (
              <>
                <div className="reco_info">
                  <h2>{name}</h2>
                  <p>{info}</p>
                </div>

                <Accordion data-bs-theme="dark">
                  {questionsList.map((question) => (
                    <Accordion.Item
                      eventKey={question.question}
                      key={question.question}
                    >
                      <Accordion.Header>{question.question}</Accordion.Header>
                      <Accordion.Body>{question.answer}</Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </>
            )}
          </Tab>

          <Tab eventKey="Dialogue" title="Dialogue" className="dialogue">
            <Form.Group controlId="formInteraction">
              <div className="voice_txt">
              <Form.Control
                type="text"
                placeholder="Start Voice Chat"
                value={message}
                className="form-dialogue"
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button onClick={handleUserInput}>Send</Button>
              </div>

            </Form.Group>

            <div>
              <p>Microphone: {listening ? "on" : "off"}</p>
              <div className="buttons">
                <Button variant="primary" id="start" onClick={startListening}>
                <FaMicrophone /> Start
                
                </Button>
                <Button variant="dark" id="stop" onClick={stopListening}>
                <TiMediaRecord /> Stop
                </Button>
                <Button variant="primary"  onClick={resetTranscript}>
                  Reset <RxReset />
                </Button>
              </div>
              <p>{transcript}</p>
            </div>
            <div className="dialogue_img">
            <img src="/imgs/pyr.png" alt="pic" width={"700"} height={"380"} />
            <img
              width="380"
              height="450"
              ref={characterImageRef}
              src="/imgs/d1.png"
              alt="pic"
            />
            </div>

          </Tab>
        </Tabs>

        <Modal
          show={modalShow}
          onHide={handleCloseModal}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Description
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedRecMuseum && (
              <>
                <h4>{selectedRecMuseum.name}</h4>
                <p id="des">{selectedRecMuseum.description}</p>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </section>
  );
};

export default User;
