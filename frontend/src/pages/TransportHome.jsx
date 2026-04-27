import HeroCarousel from "../components/HeroCarousel";
import HowItWorks from "../components/HowItWorks";
import Footer from "../components/Footer";

function TransportHome() {
  const slides = [
    {
      image: "https://5.imimg.com/data5/SELLER/Default/2024/2/388906190/QS/CP/BM/212485950/agriculture-equipment-transport-services.jpeg",
      title: "Provide Transport Services",
      description: "Help farmers move equipment efficiently."
    },
    {
      image: "https://ronaktransport.com/images/truck.jpg",
      title: "Earn by Helping",
      description: "Accept transport requests and grow income."
    }
  ];

  const steps = [
    { title: "Register Vehicle", desc: "Add your transport details." },
    { title: "Accept Requests", desc: "View and manage requests." },
    { title: "Complete Delivery", desc: "Transport equipment safely." }
  ];

  return (
    <>
      <HeroCarousel slides={slides} />
      <HowItWorks steps={steps} />
      <Footer />
    </>
  );
}

export default TransportHome;
