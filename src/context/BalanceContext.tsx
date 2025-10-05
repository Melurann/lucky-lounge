import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type BalanceContextType = {
  balance: number;
  setBalance: (value: number | ((prev: number) => number)) => void;
};

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(100);

  return (
    <BalanceContext value={{ balance, setBalance }}>{children}</BalanceContext>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (!context) {
    throw new Error("useBalance must be used within BalanceProvider");
  }
  return context;
};
