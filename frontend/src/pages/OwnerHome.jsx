import HeroCarousel from "../components/HeroCarousel";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

function OwnerHome() {
  const slides = [
    {
      image: "https://static.vecteezy.com/system/resources/previews/055/303/594/large_2x/modern-green-tractor-plowing-fertile-soil-on-agricultural-land-free-photo.jpg",
      title: "List Your Equipment",
      description: "Earn by sharing your agricultural tools."
    },
    {
      image: "https://wallpapercave.com/wp/wp10389738.jpg",
      title: "Approve Requests",
      description: "Manage rental requests easily."
    }
  ];

  const steps = [
    { title: "List Equipment", desc: "Add your equipment details." },
    { title: "Approve Rentals", desc: "Accept or reject requests." },
    { title: "Earn Income", desc: "Grow revenue efficiently." }
  ];

  return (
    <>
      <HeroCarousel slides={slides} />
      <HowItWorks steps={steps} />
      <Footer />
    </>
  );
}

export default OwnerHome;
