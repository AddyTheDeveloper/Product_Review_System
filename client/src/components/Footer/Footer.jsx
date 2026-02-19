import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-copyright">
          © 2026 Product Review System. All rights reserved.
        </div>

        <div className="footer-links">
          <Link to="/" className="footer-link">Home</Link>
          <span className="separator">|</span>
          <Link to="/write-review" className="footer-link">Write a Review</Link>
          <span className="separator">|</span>
          <Link to="/login" className="footer-link">Login</Link>
          <span className="separator">|</span>
          <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
          <span className="separator">|</span>
          <Link to="/terms-of-service" className="footer-link">Terms of Service</Link>
        </div>

        <div className="footer-social">
          <a href="https://github.com/AddyTheDeveloper/Product_Review_System" target="_blank" rel="noopener noreferrer" className="footer-link">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
