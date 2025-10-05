import { Link } from "react-router";

type HeaderProps = {
  balance: number;
};

export const Header = ({ balance }: HeaderProps) => {
  return (
    <header className="mb-6 card">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <nav className="flex gap-6">
          <Link to="/" className="nav-link text-lg">
            🏠 Home
          </Link>
          <Link to="/slots" className="nav-link text-lg">
            🎰 Slots
          </Link>
          <Link to="/blackjack" className="nav-link text-lg">
            🃏 Blackjack
          </Link>
        </nav>
        <div className="balance-display">
          💰 Balance:{" "}
          <span style={{ fontSize: "1.5rem" }}>${balance.toFixed(2)}</span>
        </div>
      </div>
    </header>
  );
};
