// src/components/Footer.jsx
import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa'; // Import the icons
import './Footer.css'; // We will create this CSS file next

// This component takes your personal URLs as props
function Footer({ githubUrl, linkedinUrl }) {
  return (
    <footer className="site-footer">
      <div className="footer-links">
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="footer-link">
          <FaGithub />
          <span>View Source on GitHub</span>
        </a>
        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="footer-link">
          <FaLinkedin />
          <span>Connect via LinkedIn</span>
        </a>
      </div>
      <div className="creator-credit">
        Made by Shubhi Sharma
      </div>
    </footer>
  );
}

export default Footer;