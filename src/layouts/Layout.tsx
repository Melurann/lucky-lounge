import { Outlet } from "react-router";
import { Header } from "../components/Header";
import { useBalance } from "../context/BalanceContext";

export const Layout = () => {
  const { balance } = useBalance();

  return (
    <div className="p-6">
      <Header balance={balance} />
      <Outlet />
    </div>
  );
};
