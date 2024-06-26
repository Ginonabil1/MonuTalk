import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';

const MyVerticallyCenteredModal = ({ show, onHide, museum }) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
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
        <h4>{museum.name}</h4>
        <p id='des'>{museum.description}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

const Cards = () => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedMuseum, setSelectedMuseum] = useState(null);
  const [museums, setMuseums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    axios.get('https://monu-talk-production.up.railway.app/museums')
      .then((res) => {
        setMuseums(res.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className='cards'>
      <h1 id='title'>Museums</h1>
      <Container>
        <Row>
          {museums.map((museum) => (
            <Col lg={4} md={4} sm={12} key={museum.id}>
              <Card sx={{ maxWidth: 400 }} className='card wow fadeInUp' data-wow-duration="1s" data-wow-delay="0.5s">
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="200"
                    image={museum.imageUrl}
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div" className='card_name'>
                      {museum.name}
                    </Typography>
                    <Typography variant="body2" className='card_p'>
                      <span>Location: </span>{museum.location}
                    </Typography>
                    <Typography variant="body2" className='card_p'>
                      <span>Open: </span>{museum.openingTime}
                    </Typography>
                    <Typography variant="body2" className='card_p'>
                      <span>Close: </span>{museum.closingTime}
                    </Typography>
                    <Typography variant="body2" className='card_p'>
                      <span>Ticket Price: </span>{museum.ticketPrice} EGP
                    </Typography>
                    <Button className="card_button" variant="primary" onClick={() => {setSelectedMuseum(museum);setModalShow(true);}}>
                      Description
                    </Button>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
      {selectedMuseum && (
        <MyVerticallyCenteredModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          museum={selectedMuseum}
        />
      )}
    </div>
  );
};

export default Cards;
