import HeroCarousel from "../components/HeroCarousel";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

function FarmerHome() {
  const slides = [
    {
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef",
      title: "Rent Equipment Easily Whenever Needed",
      description: "Access modern agricultural tools anytime."
    },
    {
      image: "https://cdn.pixabay.com/photo/2025/06/18/08/31/wheat-9666681_1280.jpg",
      title: "Save Costs",
      description: "Pay only when you need it."
    }
  ];

  const steps = [
    { title: "Browse Equipment", desc: "Find available tools nearby." },
    { title: "Request Rental", desc: "Send rental request easily." },
    { title: "Use & Rate", desc: "Complete work and rate owner." }
  ];

  return (
    <>
      <HeroCarousel slides={slides} />
      <HowItWorks steps={steps} />
      <Footer />
    </>
  );
}

export default FarmerHome;
