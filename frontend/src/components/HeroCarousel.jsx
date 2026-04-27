import { useState, useEffect } from "react";

function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="hero">
      <img src={slides[index].image} alt="slide" />
      <div className="hero-text">
        <h1>{slides[index].title}</h1>
        <p>{slides[index].description}</p>
      </div>
    </div>
  );
}

export default HeroCarousel;
