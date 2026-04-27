function Footer() {
  return (
    <footer className="footer" style={styles.footer}>
      
      <div style={styles.container}>
        
        {/* About Section */}
        <div style={styles.section}>
          <h3>AgroShare</h3>
          <p>
            AgroShare connects farmers and equipment owners to make agriculture
            smarter, faster, and more efficient through shared resources.
          </p>
        </div>

        {/* Our Services */}
        <div style={styles.section}>
          <h4>Our Services</h4>
          <p>🚜 Equipment Rental</p>
          <p>🤝 Farmer-Owner Connection</p>
          <p>🚛 Transport Assistance</p>
          <p>📊 Smart Resource Management</p>
        </div>


        {/* Contact Info */}
        <div style={styles.section}>
          <h4>Contact</h4>
          <p>📍 India</p>
          <p>📞 +91 9XXXXXXXXX</p>
          <p>📧 support@agroshare.com</p>
        </div>

        {/* Social Media */}
        <div style={styles.section}>
          <h4>Follow Us</h4>
          <p>🌐 Facebook</p>
          <p>📸 Instagram</p>
          <p>🐦 Twitter</p>
          <p>💼 LinkedIn</p>
        </div>

      </div>

      {/* Bottom Line */}
      <div style={styles.bottom}>
        <p>© 2026 AgroShare | All Rights Reserved</p>
      </div>

    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#03552d",
    color: "#fff",
    padding: "30px 20px",
    marginTop: "40px"
  },
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px"
  },
  section: {
    fontSize: "14px"
  },
  bottom: {
    textAlign: "center",
    marginTop: "20px",
    borderTop: "1px solid #444",
    paddingTop: "10px",
    fontSize: "13px"
  }
};

export default Footer;