import React from 'react';

const Footer = () => {
  const footerStyles = {
    backgroundColor: '#483C32', 
    color: '#eeece6', 
    padding: '25px',
    width: '100vw',
    boxSizing: 'border-box',
    minHeight: '140px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    
  };

  const columnStyles = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  };

  const logoColumnStyles = {
    display: 'flex',
    alignItems: 'center',
  };

  const navStyles = {
    listStyle: 'none',
    padding: 0,
    textAlign: 'right',
  };

  const navItemStyles = {
    margin: '5px 0',
  };

  const linkStyles = {
    color: '#eeece6', // Light beige text
    textDecoration: 'none',
  };

  return (
    <footer style={footerStyles}>
      <div style={logoColumnStyles}>
        <img
          src="https://seeklogo.com/images/A/airx-logo-4084F724C2-seeklogo.com.png"
          alt="Logo"
          style={{ height: '50px' }}
        />
      </div>

      <div style={columnStyles}>
        <h2>Sammie Creations</h2>
        <p>
          5678 Dreamscape Avenue<br />
          Aurora, California 90210
        </p>
        <p>Phone: 310.777.2024</p>
      </div>

      <nav>
        <ul style={navStyles}>
          <li style={navItemStyles}>
            <a href="/" style={linkStyles}>Home</a>
          </li>
          <li style={navItemStyles}>
            <a href="/blog" style={linkStyles}>Blog</a>
          </li>
          <li style={navItemStyles}>
            <a href="/contact" style={linkStyles}>Contact</a>
          </li>
          <li style={navItemStyles}>
            <a href="/privacy-policy" style={linkStyles}>Privacy</a>
          </li>
        </ul>
      </nav>
    </footer>
  );
};

export default Footer;
