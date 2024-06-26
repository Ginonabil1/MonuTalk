import React from 'react'
import { Container , Nav , Navbar , Button} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { HashLink } from 'react-router-hash-link'

const Nav__bar = () => {
  return (
    <>
    <Navbar  expand="lg">

        <Container>
        <Link to='/' className='title'><h1 >MonuTalk</h1></Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">

          <Nav className="m-auto navlinks">
            <HashLink to="/#">Home</HashLink>
            <HashLink to="/#About">About</HashLink>
            <HashLink to="/#Museums">Museums</HashLink>
            <HashLink to="/#contact">Contact Us</HashLink>
            <Link className='hidden' to="LoginRegister">Login</Link>

          </Nav>

          
        </Navbar.Collapse>
        <Link to='/LoginRegister' className='login'><Button>Login</Button></Link>
      </Container>
      </Navbar>
      </>
  )
}

export default Nav__bar



