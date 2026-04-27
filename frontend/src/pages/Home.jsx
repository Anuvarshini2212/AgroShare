import FarmerHome from "./FarmerHome";
import OwnerHome from "./OwnerHome";
import TransportHome from "./TransportHome";

function Home() {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) return null;

  const user = JSON.parse(storedUser);

  switch (user.role) {
    case "farmer":
      return <FarmerHome />;
    case "owner":
      return <OwnerHome />;
    case "transport":
      return <TransportHome />;
    default:
      return null;
  }
}

export default Home;
