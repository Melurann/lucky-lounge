import { Link } from "react-router";

export const LandingPage = () => {
  return (
    <div className="game-container space-y-8 p-6">
      <div className="text-center space-y-4">
        <h1
          className="text-7xl font-bold casino-title mb-4"
          style={{ animation: "glow 2s ease-in-out infinite" }}
        >
          🎰 LUCKY LOUNGE 🎰
        </h1>
        <p
          className="text-2xl text-yellow-200 font-semibold"
          style={{ textShadow: "0 0 10px rgba(255, 215, 0, 0.5)" }}
        >
          Where Fortune Favors the Bold!
        </p>
        <p className="text-lg text-gray-300 italic">
          Choose your game and let the chips fall where they may...
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-12">
        <Link
          to="/slots"
          className="card group hover:scale-105 transition-transform"
        >
          <div className="text-center space-y-4 p-6">
            <div className="text-6xl group-hover:animate-spin-slow transition-all">
              🎰
            </div>
            <h2 className="text-3xl font-bold text-yellow-400">Slots</h2>
            <p className="text-gray-300">Spin the reels of fortune!</p>
            <div className="btn mt-4">Play Now</div>
          </div>
        </Link>

        <Link
          to="/blackjack"
          className="card group hover:scale-105 transition-transform"
        >
          <div className="text-center space-y-4 p-6">
            <div className="text-6xl">🃏</div>
            <h2 className="text-3xl font-bold text-yellow-400">Blackjack</h2>
            <p className="text-gray-300">Beat the dealer at 21!</p>
            <div className="btn mt-4">Play Now</div>
          </div>
        </Link>
      </div>

      <div className="text-center mt-12 opacity-75">
        <p className="text-sm text-gray-400">
          ✨ Remember to gamble responsibly ✨
        </p>
      </div>
    </div>
  );
};
