import { NavLink } from "react-router";

const NavItems = [
  { to: "/", label: "🏠 Home" },
  { to: "/slots", label: "🎰 Slots" },
  { to: "/blackjack", label: "🃏 Blackjack" },
];

type HeaderProps = {
  balance: number;
};

export const Header = ({ balance }: HeaderProps) => {
  return (
    <header className="px-4 py-2 border border-gray-700 rounded-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <nav className="flex gap-6">
          {NavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `px-4 py-2 rounded-2xl text-lg transition-all duration-200 ease-in-out font-semibold hover:text-[color:var(--casino-gold)] hover:scale-105 hover:bg-[#ffd7001a] ${
                  isActive ? "text-[color:var(--casino-gold)]" : "text-gray-300"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="shadow-[0_4px_15px_#0596694d] bg-linear-120 from-[#05966933] to-[#05966966] rounded-full text-xl font-bold py-3 px-6 border border-[color:var(--casino-green)] text-[color:var(--casino-gold)]">
          💰 Balance: <span className="text-2xl">${balance.toFixed(2)}</span>
        </div>
      </div>
    </header>
  );
};
