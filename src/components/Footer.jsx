
import React from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa'; 
import './Footer.css'; 


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
        Made by Saksham Neema
      </div>
    </footer>
  );
}

export default Footer;