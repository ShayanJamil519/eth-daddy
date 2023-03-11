import { ethers } from "ethers";
import logo from "../assets/logo.svg";

const Navigation = ({ account, setAccount }) => {
  return (
    <nav>
      <p> {account} </p>
    </nav>
  );
};

export default Navigation;
