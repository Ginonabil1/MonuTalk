import React from 'react'
import  Navbar  from './Nav__bar'
import { Container , Row , Col } from 'react-bootstrap'
import { HashLink } from 'react-router-hash-link'
import Card from './Cards'
import Scrollbar from './Scrollbar'
import Comments from './Comments'
import Footer from './Footer'





const Home = () => {
  return (
        <>
    
        <header className='Home '>
        <Navbar/>
            <Container>
                <Row>
                    <Col lg={12} md={12} sm={12} className='slogan wow slideInRight' data-wow-duration="1s" data-wow-delay="0.1s">
                        <h3>
                            Now You Can Know Everything About Ancient Egyptians.
                        </h3>
                        <HashLink to="/#About" className='Us'>About Us &darr;</HashLink>
                    </Col>
                </Row>
            </Container>
        </header>

        <section className='About' id='About'>
            <h1 id='title' className='wow fadeInUp' data-wow-duration="1s" data-wow-delay="0.3s">MonuTalk</h1>
            <p id='p_title' className='wow fadeInUp' data-wow-duration="1s" data-wow-delay="0.5s">"MonuTalk" is a fusion of the words "Monuments" and "Talking".</p>
            <Container className='sec1'>
                <Row>
                    <Col lg={6} md={4} sm={12} className='des wow slideInLeft' data-wow-duration="0.7s" data-wow-delay="0.7s">
                            <p>
                                The project aims to create an intelligent chatbot that can help tourists find and search for any ancient monument in Egypt.
                                 The chatbot will allow users to chat directly with the monuments and receive information about them.
                                  The chatbot will be animated, with each monument having its own character.
                                   This will enable users to interact with the monuments in a fun and engaging way.
                                    The chatbot can also be used in Museums to provide information about specific exhibits or to answer general questions about the Museum.
                                    </p>
                    </Col>
                    <Col lg={6} md={4} sm={12} className='tablet wow slideInRight' data-wow-duration="0.7s" data-wow-delay="0.7s">
                        <img src="imgs/Tablet.png" alt="pic" />
                        <video autoPlay muted loop>
                            <source src="imgs/video2.mp4"/>
                        </video>
                    </Col>
                </Row>
            </Container>
        </section>

        <section className='sec2'>
            <Container>
                <Row>
                    <Col lg={3} md={3} sm={3}>
                        <img src="imgs/p1.png" alt="pic" id='pic1' className='c_p'/>
                    </Col>
                    <Col lg={4} md={4} sm={4}>
                        <div className='center'>
                            <div className='c1'>
                                <h1>81</h1>
                                <p>Egypt has 81 Museums</p>
                            </div>
                            <div>
                                <h1>170K+</h1>
                                <p>over 170,000 artifacts in The Egyptian Museum</p>
                            </div>
                        </div>
                    </Col>
                    <Col lg={3} md={3} sm={3}>
                        <img src="imgs/p2.png" alt="pic" id='pic2' className='c_p'/>
                    </Col>
                </Row>
            </Container>
        </section>

        <section id='Museums'>
            <Card/>
        </section>
        
        <section>
            <Scrollbar/>
        </section>
        <section id='Comments'>
            <Comments/>
        </section>
        <section id='contact'>
            <Footer/>
        </section>
        </> 

  )
}
export default Home
