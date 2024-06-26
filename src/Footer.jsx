import React from 'react';
import { HashLink } from 'react-router-hash-link'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h1>MonuTalk</h1>
        </div>
        <div className="footer-section links">
          <h3>Quick Links</h3>
          <ul>
            <li><HashLink to="/#">Home</HashLink></li>
            <li><HashLink to="/#About">About</HashLink></li>
            <li><HashLink to="/#Museums">Museums</HashLink></li>
            <li><HashLink to="/#contact">Contact Us</HashLink></li>
          </ul>
        </div>
        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>Email: georginonabil3@gmail.com</p>
          <p>Phone: +20 1284015143</p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} MonuTalk | Designed by Georgino Nabil
      </div>
    </footer>
  );
};

export default Footer;
