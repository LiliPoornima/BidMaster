import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

import { useNavigate } from 'react-router-dom';


const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour countdown
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const navigate = useNavigate();


  const auctionItems = [
    {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      title: 'Modern Villa',
      currentBid: '$120000',
      bids: 15,
    },
    {
      image: 'https://pocket-watch.net/cdn/shop/articles/pexels-photo-678248.jpg?v=1602205506',
      title: 'Antique Pocket Watch',
      currentBid: '$250',
      bids: 22,
    },
    {
      image: 'https://media.cnn.com/api/v1/images/stellar/prod/220919154524-01-brad-pitt-sculpture-exhibition.jpg?q=w_2000,c_fill',
      title: 'Modern Art Sculpture',
      currentBid: '$450',
      bids: 30,
    },
  ];

  const services = [
    {
      image: 'https://janineshroff.co.uk/wp-content/uploads/2017/08/janineshroff_projects_live-auctioneers0.jpg?w=1568',
      title: 'Live Auctions',
      description: 'Participate in real-time auctions from anywhere in the world.',
    },
    {
      image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=300&q=80',
      title: 'Secure Transactions',
      description: 'Enjoy safe and reliable payment processing for every bid.',
    },
    {
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=300&q=80',
      title: 'Global Marketplace',
      description: 'Connect with a worldwide community of buyers and sellers.',
    },
  ];

  // Carousel auto-slide
  useEffect(() => {
    if (isImageLoaded) {
      const slideInterval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % auctionItems.length);
      }, 5000);
      return () => clearInterval(slideInterval);
    }
  }, [auctionItems.length, isImageLoaded]);

  // Countdown timer
  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 3600));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const goToNextImage = () => setCurrentImageIndex((prev) => (prev + 1) % auctionItems.length);
  const goToPrevImage = () => setCurrentImageIndex((prev) => (prev === 0 ? auctionItems.length - 1 : prev - 1));

  
  
  const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="home-page">
     {/* Banner Section */}
<section className="hp-banner-section">
  <div className="hp-banner-container">
    <h1 className="hp-hero-title">Bid Smarter. Win Bigger.</h1>
<p className="hp-hero-subtitle">Your Trusted Auction Platform for Unique Finds & Fair Deals</p>
<h2 className="hp-hero-tagline">A World of Auctions at Your Fingertips</h2>
<p className="hp-hero-description">
  Discover a global marketplace where transparency, speed, and security drive every transaction.
</p>

    <button className="hp-banner-button" onClick={() => navigate('/register')}>Start Bidding Now</button>
  </div>
</section>


      {/* Hero Section */}
      <section className="hp-hero-section" id="hero">
        <div className="hp-hero-content">
         
          

          {/* Carousel */}
          <div className="hp-carousel">
            <button className="hp-carousel-btn prev" onClick={goToPrevImage} aria-label="Previous item">
              &larr;
            </button>
            <div className="hp-carousel-image-wrapper">
              <img
                src={auctionItems[currentImageIndex].image}
                alt={auctionItems[currentImageIndex].title}
                className="hp-carousel-image"
                onLoad={() => setIsImageLoaded(true)}
              />
              <div className="hp-bid-info">
                <div className="hp-bid-details">
                  <h3>{auctionItems[currentImageIndex].title}</h3>
                  <p>Current Bid: <span>{auctionItems[currentImageIndex].currentBid}</span></p>
                  <p>Bids: {auctionItems[currentImageIndex].bids}</p>
                  <p className="hp-countdown">Time Left: <span>{formatTime(timeLeft)}</span></p>
                </div>
                <button 
                        className="hp-bid-button" 
                        onClick={() => navigate('/login')}
                      >
                        Bid Now
                      </button>

              </div>
            </div>
            <button className="hp-carousel-btn next" onClick={goToNextImage} aria-label="Next item">
              &rarr;
            </button>
          </div>

          <div className="hp-hero-buttons">
            <button className="hp-cta-button"  onClick={() => navigate('/register')}>Get Started</button>
            <button className="hp-learn-more-btn" onClick={() => scrollToSection('features')}>
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="hp-features-section" id="features">
        <div className="hp-section-container">
          <h2 className="hp-section-title">Why BidMaster Stands Out</h2>
          <div className="hp-features-grid">
            <div className="hp-feature-item">
              <div className="hp-feature-icon">
                <span>🔍</span>
              </div>
              <h3>Intuitive Bidding</h3>
              <p>Effortlessly place bids and track auctions with our user-friendly interface.</p>
            </div>
            <div className="hp-feature-item">
              <div className="hp-feature-icon">
                <span>⚡</span>
              </div>
              <h3>Real-Time Insights</h3>
              <p>Stay updated with live notifications and auction progress.</p>
            </div>
            <div className="hp-feature-item">
              <div className="hp-feature-icon">
                <span>🔒</span>
              </div>
              <h3>Trusted Security</h3>
              <p>Enjoy peace of mind with our encrypted payment system.</p>
            </div>
            <div className="hp-feature-item">
              <div className="hp-feature-icon">
                <span>🌍</span>
              </div>
              <h3>Global Reach</h3>
              <p>Connect with buyers and sellers worldwide in one vibrant marketplace.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services Section */}
      <section className="hp-services-section" id="services">
        <div className="hp-section-container">
          <h2 className="hp-section-title">Our Services</h2>
          <div className="hp-services-grid">
            {services.map((service, index) => (
              <div key={index} className="hp-service-card">
                <div className="hp-service-image-container">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="hp-service-image"
                  />
                  <div className="hp-service-overlay">
                    <span className="service-icon">{service.title[0]}</span>
                  </div>
                </div>
                <div className="hp-service-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="hp-stats-section">
        <div className="hp-section-container">
          <h2 className="hp-section-title">Our Impact</h2>
          <div className="hp-stats-grid">
            <div className="hp-stat-item">
              <h3>10K+</h3>
              <p>Active Users</p>
            </div>
            <div className="hp-stat-item">
              <h3>5K+</h3>
              <p>Auctions Completed</p>
            </div>
            <div className="hp-stat-item">
              <h3>$1M+</h3>
              <p>Total Bids Value</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="hp-testimonials-section">
        <div className="hp-section-container">
          <h2 className="hp-section-title">What Our Users Say</h2>
          <div className="hp-testimonials-grid">
            <div className="hp-testimonial-item">
              <div className="hp-testimonial-quote">"</div>
              <p>BidMaster made selling my old guitar so easy and profitable!</p>
              <h4>- Sarah M.</h4>
            </div>
            <div className="hp-testimonial-item">
              <div className="hp-testimonial-quote">"</div>
              <p>I found a rare collectible at an amazing price. Love this platform!</p>
              <h4>- James T.</h4>
            </div>
          </div>
          <Link to="/aboutus" className="hp-explore-more">Explore Our Story</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;