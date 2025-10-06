import { useState } from "react";
import { useBalance } from "../context/BalanceContext";
import { RuleCard } from "../components/RuleCard";

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "⭐", "💎", "7️⃣"];

export const SlotsPage = () => {
  const { balance, setBalance } = useBalance();
  const [reels, setReels] = useState(["🎰", "🎰", "🎰"]);
  const [spinning, setSpinning] = useState(false);
  const [message, setMessage] = useState("Good luck!");
  const [bet] = useState(10);
  const [lastWin, setLastWin] = useState(0);

  const spin = () => {
    if (spinning || balance < bet) {
      if (balance < bet) setMessage("Not enough balance!");
      return;
    }

    setBalance(balance - bet);
    setSpinning(true);
    setMessage("Spinning...");
    setLastWin(0);

    const interval = setInterval(() => {
      setReels([
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ]);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      const finalReels = [
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
      ];
      setReels(finalReels);
      setSpinning(false);

      let winAmount = 0;
      if (finalReels[0] === finalReels[1] && finalReels[1] === finalReels[2]) {
        if (finalReels[0] === "💎") {
          winAmount = bet * 50;
          setMessage("💎 MEGA JACKPOT! YOU WIN $" + winAmount + "! 💎");
        } else {
          winAmount = bet * 10;
          setMessage("🎉 JACKPOT! YOU WIN $" + winAmount + "! 🎉");
        }
      } else if (
        finalReels[0] === finalReels[1] ||
        finalReels[1] === finalReels[2] ||
        finalReels[0] === finalReels[2]
      ) {
        winAmount = bet * 2;
        setMessage("✨ Two of a kind! You win $" + winAmount + "! ✨");
      } else {
        setMessage("Try again!");
      }

      if (winAmount > 0) {
        setBalance((prev: number) => prev + winAmount);
        setLastWin(winAmount);
      }
    }, 2000);
  };

  return (
    <div className="game-container p-6">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold casino-title mb-2">
          🎰 Slot Machine 🎰
        </h2>
        <p className="text-gray-300 text-lg">Spin to win big!</p>
      </div>

      <div className="slot-machine max-w-2xl mx-auto">
        <div className="flex justify-center gap-4 mb-8">
          {reels.map((symbol, index) => (
            <div
              key={index}
              className={`slot-reel ${spinning ? "animate-pulse" : ""}`}
              style={{
                animation: spinning ? "spin-slow 0.5s linear infinite" : "none",
              }}
            >
              {symbol}
            </div>
          ))}
        </div>

        <div className="text-center space-y-4">
          <div
            className="text-2xl font-bold"
            style={{
              color: message.includes("JACKPOT")
                ? "#FFD700"
                : message.includes("win")
                ? "#10b981"
                : "#f5f5f5",
              textShadow: message.includes("JACKPOT")
                ? "0 0 20px #FFD700"
                : "none",
            }}
          >
            {message}
          </div>

          <div className="flex justify-center gap-4 items-center">
            <div className="text-gray-300 text-lg">
              Bet: <span className="text-yellow-400 font-bold">${bet}</span>
            </div>
            {lastWin > 0 && (
              <div className="text-green-400 text-lg font-bold">
                Won: ${lastWin}
              </div>
            )}
          </div>

          <button
            onClick={spin}
            disabled={spinning}
            className="btn text-xl px-12 py-4"
            style={{
              opacity: spinning ? 0.6 : 1,
              cursor: spinning ? "not-allowed" : "pointer",
            }}
          >
            {spinning ? "🎰 SPINNING..." : "🎲 SPIN NOW"}
          </button>
        </div>
      </div>

      <div className="text-center mt-8">
        <div className="flex justify-center">
          <RuleCard game="slots" />
        </div>
      </div>
    </div>
  );
};
