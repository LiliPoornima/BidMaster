// Updated AboutUs.js file
import React from 'react';
import Nav from '../Nav/Nav';
import './AboutUs.css';


function AboutUs() {
  const values = [
    {
      title: 'Integrity',
      description: 'Transparent processes you can trust',
    },
    {
      title: 'Innovation',
      description: 'Cutting-edge tools for seamless bidding',
    },
    {
      title: 'Community',
      description: 'Connecting people through shared passions',
    },
    {
      title: 'Excellence',
      description: 'Unmatched service and quality',
    },
  ];

  return (
    <div className="aboutus-container">
      
      <Nav/>
      {/* Hero Section */}
      <div className="aboutus-hero-section">
        <div className="aboutus-hero-overlay">
          <h1 className="aboutus-title">About BidMaster</h1>
          <p className="aboutus-tagline">
            Discover a world of opportunities where every bid brings you closer 
            to extraordinary finds and exceptional value.
          </p>
        </div>
      </div>

      {/* Content Sections */}
      <div className="aboutus-content-wrapper">
        {/* Welcome Section */}
        <section className="aboutus-intro-section">
          <h2 className="aboutus-section-title">Welcome to BidMaster</h2>
          <p className="aboutus-section-text">
            BidMaster is your premier destination for online auctions, connecting passionate 
            buyers and sellers worldwide. Established in 2025, we have built a sophisticated 
            yet user-friendly platform that transforms the auction experience. Our commitment 
            to security, transparency, and innovation ensures every transaction is smooth, 
            safe, and satisfying.
          </p>
        </section>

        {/* Our Mission Section */}
        <section className="aboutus-section aboutus-mission-section">
          <h2 className="aboutus-section-title">Our Mission</h2>
          <div className="aboutus-mission-content">
            <p className="aboutus-section-text">
              We strive to revolutionize online auctions by creating a dynamic marketplace 
              that is accessible to everyone. From rare collectibles to everyday essentials, 
              we empower our community to bid confidently and sell effortlessly. Our goal is 
              to deliver excitement, value, and trust in every click—making auctions not just 
              a transaction, but an experience.
            </p>
            <div className="aboutus-mission-image"></div>
          </div>
        </section>

        {/* Our Journey Section */}
        <section className="aboutus-section aboutus-journey-section">
          <h2 className="aboutus-section-title">Our Journey</h2>
          <p className="aboutus-section-text">
            Since our inception in 2025, BidMaster has evolved from a bold vision into 
            a thriving global platform. Our team of dedicated professionals—auction specialists, 
            tech innovators, and customer advocates—works tirelessly to enhance your experience. 
            With cutting-edge features like real-time bidding, comprehensive item verification, 
            and 24/7 support, we are proud to serve a growing community of enthusiasts and 
            professionals alike.
          </p>
        </section>

        {/* Our Values Section */}
        <section className="aboutus-section aboutus-values-section">
          <h2 className="aboutus-section-title">Our Values</h2>
          <div className="aboutus-values-grid">
            {values.map((value, index) => (
              <div key={index} className="aboutus-value-item">
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </section>

         {/* Team Stats Section */}
      <section className="aboutus-stats-section">
        <h2 className="aboutus-stats-title">Our Team</h2>
        <div className="aboutus-stats-grid">
          <div className="aboutus-stat-item">
          <img src="/images/durangiProfile.jpg" alt="hrProfile" className="aboutus-profile" />
            <h2>HR Manager</h2>
            <p>Durangi Abeykoon</p>
           
          </div>
          <div className="aboutus-stat-item">
          <img src="/images/pamoProfile.jpg" alt="ispectionProfile" className="aboutus-profile" />
            <h2>Inspection Manager</h2>
            <p>Pamodini Perera</p>
          </div>
          <div className="aboutus-stat-item">
          <img src="/images/lahiProfile.jpg" alt="shippingProfile" className="aboutus-profile" />
            <h2>Shipping Manager</h2>
            <p>Lahiruni Ariyawansa</p>
          </div>
          <div className="aboutus-stat-item">
          <img src="/images/poomaProfile.jpg" alt="FinancialProfile" className="aboutus-profile" />
            <h2>Financial Manager</h2>
            <p>Poornima Liyanage</p>
          </div>
          <div className="aboutus-stat-item">
          <img src="/images/sewProfile.jpg" alt="customcareProfile" className="aboutus-profile" />
            <h2>Custom Care</h2>
            <p>Sewwandi Koodituwakku</p>
          </div>
        </div>
      </section>
      </div>
    </div>
  );
}

export default AboutUs;