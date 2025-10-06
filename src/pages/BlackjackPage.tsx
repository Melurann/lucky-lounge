import { useState } from "react";
import { useBalance } from "../context/BalanceContext";
import { RuleCard } from "../components/RuleCard";

type Card = { suit: string; value: string; numValue: number };

const SUITS = ["♠️", "♥️", "♦️", "♣️"];
const VALUES = [
  { value: "A", numValue: 11 },
  { value: "2", numValue: 2 },
  { value: "3", numValue: 3 },
  { value: "4", numValue: 4 },
  { value: "5", numValue: 5 },
  { value: "6", numValue: 6 },
  { value: "7", numValue: 7 },
  { value: "8", numValue: 8 },
  { value: "9", numValue: 9 },
  { value: "10", numValue: 10 },
  { value: "J", numValue: 10 },
  { value: "Q", numValue: 10 },
  { value: "K", numValue: 10 },
];

export const BlackjackPage = () => {
  const { balance, setBalance } = useBalance();
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [dealerVisibleCards, setDealerVisibleCards] = useState(2);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("Place your bet to start!");
  const [bet, setBet] = useState(20);
  const [currentBet, setCurrentBet] = useState(0);
  const [canDouble, setCanDouble] = useState(false);
  const [hasBlackjack, setHasBlackjack] = useState(false);
  const [isAnimatingDealer, setIsAnimatingDealer] = useState(false);

  const drawCard = (): Card => {
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
    const valueObj = VALUES[Math.floor(Math.random() * VALUES.length)];
    return { suit, value: valueObj.value, numValue: valueObj.numValue };
  };

  const calculateTotal = (hand: Card[]): number => {
    let total = hand.reduce((sum, card) => sum + card.numValue, 0);
    let aces = hand.filter((card) => card.value === "A").length;

    while (total > 21 && aces > 0) {
      total -= 10;
      aces--;
    }
    return total;
  };

  const checkBlackjack = (hand: Card[]): boolean => {
    return hand.length === 2 && calculateTotal(hand) === 21;
  };

  const startGame = () => {
    if (balance < bet) {
      setMessage("Not enough balance!");
      return;
    }

    setBalance(balance - bet);
    setCurrentBet(bet);

    const newPlayerHand = [drawCard(), drawCard()];
    const newDealerHand = [drawCard(), drawCard()];
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setGameStarted(true);
    setGameOver(false);
    setCanDouble(true);
    setDealerVisibleCards(2);
    setIsAnimatingDealer(false);

    const playerBJ = checkBlackjack(newPlayerHand);
    const dealerBJ = checkBlackjack(newDealerHand);

    if (playerBJ || dealerBJ) {
      setGameOver(true);
      setCanDouble(false);

      if (playerBJ && dealerBJ) {
        // both blackjack - push
        setBalance((prev: number) => prev + bet);
        setMessage("🤝 Both Blackjack! Push - bet returned!");
        setHasBlackjack(true);
      } else if (playerBJ) {
        // player blackjack - pays 2.5x (bet back + 1.5x bet)
        const winAmount = Math.floor(bet * 2.5);
        setBalance((prev: number) => prev + winAmount);
        setMessage("🎰 BLACKJACK! You win $" + winAmount + "!");
        setHasBlackjack(true);
      } else {
        // dealer blackjack - player loses
        setMessage("😞 Dealer Blackjack! You lose $" + bet + "!");
      }
    } else {
      setMessage("Hit or Stand?");
      setHasBlackjack(false);
    }
  };

  const hit = () => {
    const newHand = [...playerHand, drawCard()];
    setPlayerHand(newHand);
    setCanDouble(false);
    const total = calculateTotal(newHand);

    if (total > 21) {
      setGameOver(true);
      setMessage("💥 BUST! You lose $" + currentBet + "!");
    } else if (total === 21) {
      setMessage("Perfect 21! Standing...");
      setTimeout(() => standWithHand(newHand), 1000);
    }
  };

  // TODO: dont know if double down works like that irl
  const doubleDown = () => {
    if (balance < currentBet) {
      setMessage("Not enough balance to double!");
      return;
    }

    // double bet
    setBalance(balance - currentBet);
    const newBet = currentBet * 2;
    setCurrentBet(newBet);

    // take and stand
    const newHand = [...playerHand, drawCard()];
    setPlayerHand(newHand);
    setCanDouble(false);

    const total = calculateTotal(newHand);
    if (total > 21) {
      setGameOver(true);
      setMessage("💥 BUST! You lose $" + newBet + "!");
    } else {
      setMessage("Double Down! Taking one card...");
      setTimeout(() => standWithHand(newHand), 1500);
    }
  };

  const standWithHand = (handToUse: Card[]) => {
    setCanDouble(false);
    setIsAnimatingDealer(true);
    setMessage("Dealer's turn...");

    let newDealerHand = [...dealerHand];

    // dealer draws until 17 or higher
    while (calculateTotal(newDealerHand) < 17) {
      newDealerHand.push(drawCard());
    }

    setDealerHand(newDealerHand);

    const totalCards = newDealerHand.length;
    let currentCard = 2;

    setDealerVisibleCards(2); // show first 2 cards (one hidden initially)

    const revealInterval = setInterval(() => {
      currentCard++;
      setDealerVisibleCards(currentCard);

      if (currentCard >= totalCards) {
        clearInterval(revealInterval);

        setTimeout(() => {
          setIsAnimatingDealer(false);
          setGameOver(true);

          const playerTotal = calculateTotal(handToUse);
          const dealerTotal = calculateTotal(newDealerHand);

          let result: "dealerBust" | "win" | "lose" | "push";

          if (dealerTotal > 21) result = "dealerBust";
          else if (playerTotal > dealerTotal) result = "win";
          else if (playerTotal < dealerTotal) result = "lose";
          else result = "push";

          const outcomes = {
            dealerBust: {
              delta: currentBet * 2,
              message: `🎉 Dealer busts! You win $${currentBet * 2}!`,
            },
            win: {
              delta: currentBet * 2,
              message: `🎊 You win $${currentBet * 2}!`,
            },
            lose: {
              delta: 0,
              message: `😞 Dealer wins! You lose $${currentBet}!`,
            },
            push: {
              delta: currentBet,
              message: "🤝 Push! It's a tie! Bet returned.",
            },
          };

          const { delta, message } = outcomes[result];

          if (delta > 0) setBalance((prev: number) => prev + delta);
          setMessage(message);
        }, 300);
      }
    }, 600);
  };

  const stand = () => {
    standWithHand(playerHand);
  };

  return (
    <div className="game-container p-6">
      <div className="text-center mb-8">
        <h2 className="text-5xl font-bold casino-title mb-2">
          🃏 Blackjack 🃏
        </h2>
        <p className="text-gray-300 text-lg">Beat the dealer to 21!</p>
      </div>

      <div className="blackjack-table max-w-4xl mx-auto">
        {/* Dealer's Hand */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-4 text-yellow-400">
            Dealer{" "}
            {gameStarted &&
              `(${
                gameOver || isAnimatingDealer
                  ? calculateTotal(dealerHand.slice(0, dealerVisibleCards))
                  : "?"
              })`}
            {gameOver && checkBlackjack(dealerHand) && (
              <span className="text-xl ml-2 animate-pulse">🎰 BLACKJACK!</span>
            )}
          </h3>
          <div className="flex justify-center gap-3 flex-wrap">
            {dealerHand.map((card, index) => {
              const shouldHideCard =
                index === 1 && !gameOver && !isAnimatingDealer;
              const shouldShow = index < dealerVisibleCards || gameOver;

              if (!shouldShow && index >= 2) {
                return null;
              }

              return (
                <div
                  key={index}
                  className={`playing-card ${
                    ["♥️", "♦️"].includes(card.suit) ? "red" : ""
                  }`}
                  style={{
                    display: shouldHideCard ? "none" : "flex",
                    animation:
                      gameOver && checkBlackjack(dealerHand)
                        ? "pulse-gold 1s infinite"
                        : index >= 2 && shouldShow && isAnimatingDealer
                        ? "slideIn 0.4s ease-out"
                        : "none",
                    opacity: shouldShow ? 1 : 0,
                    transform: shouldShow ? "scale(1)" : "scale(0.8)",
                    transition:
                      "opacity 0.4s ease-out, transform 0.4s ease-out",
                  }}
                >
                  <div>{card.value}</div>
                  <div className="text-3xl">{card.suit}</div>
                </div>
              );
            })}
            {gameStarted &&
              !gameOver &&
              !isAnimatingDealer &&
              dealerHand.length > 1 && (
                <div
                  className="playing-card"
                  style={{
                    background: "linear-gradient(135deg, #dc2626, #991b1b)",
                  }}
                >
                  <div className="text-white text-4xl">🂠</div>
                </div>
              )}
          </div>
        </div>

        {/* Player's Hand */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-4 text-yellow-400">
            You {gameStarted && `(${calculateTotal(playerHand)})`}
            {hasBlackjack && (
              <span className="text-xl ml-2 animate-pulse">🎰 BLACKJACK!</span>
            )}
          </h3>
          <div className="flex justify-center gap-3 flex-wrap mb-6">
            {playerHand.map((card, index) => (
              <div
                key={index}
                className={`playing-card ${
                  ["♥️", "♦️"].includes(card.suit) ? "red" : ""
                }`}
                style={{
                  animation: hasBlackjack ? "pulse-gold 1s infinite" : "none",
                }}
              >
                <div>{card.value}</div>
                <div className="text-3xl">{card.suit}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Game Controls */}
      <div className="text-center mt-8 space-y-6">
        <div
          className="text-3xl font-bold"
          style={{
            color:
              message.includes("win") || message.includes("Win")
                ? "#10b981"
                : message.includes("BUST") || message.includes("loses")
                ? "#dc2626"
                : "#FFD700",
            textShadow: "0 0 10px rgba(255, 215, 0, 0.5)",
          }}
        >
          {message}
        </div>

        {!gameStarted ? (
          <div>
            <div className="mb-6">
              <div className="text-2xl text-gray-300 mb-4">
                Select Your Bet:{" "}
                <span className="text-yellow-400 font-bold">${bet}</span>
              </div>
              <div className="flex justify-center gap-4 mb-6">
                <div
                  className="chip chip-red cursor-pointer"
                  onClick={() => setBet(5)}
                  style={{ transform: bet === 5 ? "scale(1.2)" : "scale(1)" }}
                >
                  $5
                </div>
                <div
                  className="chip chip-blue cursor-pointer"
                  onClick={() => setBet(10)}
                  style={{ transform: bet === 10 ? "scale(1.2)" : "scale(1)" }}
                >
                  $10
                </div>
                <div
                  className="chip chip-green cursor-pointer"
                  onClick={() => setBet(25)}
                  style={{ transform: bet === 25 ? "scale(1.2)" : "scale(1)" }}
                >
                  $25
                </div>
                <div
                  className="chip chip-black cursor-pointer"
                  onClick={() => setBet(50)}
                  style={{ transform: bet === 50 ? "scale(1.2)" : "scale(1)" }}
                >
                  $50
                </div>
              </div>
            </div>
            <button
              onClick={startGame}
              className="btn text-xl px-12 py-4"
              disabled={balance < bet}
              style={{ opacity: balance < bet ? 0.5 : 1 }}
            >
              🎲 DEAL CARDS
            </button>
            {balance < bet && (
              <p className="text-red-400 mt-2">
                Insufficient balance for this bet!
              </p>
            )}
          </div>
        ) : !gameOver || isAnimatingDealer ? (
          <div className="space-y-4">
            <div className="text-xl text-gray-300">
              Current Bet:{" "}
              <span className="text-yellow-400 font-bold">${currentBet}</span>
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={hit}
                className="btn text-xl px-8 py-3"
                disabled={isAnimatingDealer}
                style={{
                  opacity: isAnimatingDealer ? 0.5 : 1,
                  cursor: isAnimatingDealer ? "not-allowed" : "pointer",
                }}
              >
                👊 HIT
              </button>
              <button
                onClick={stand}
                className="btn text-xl px-8 py-3"
                disabled={isAnimatingDealer}
                style={{
                  opacity: isAnimatingDealer ? 0.5 : 1,
                  cursor: isAnimatingDealer ? "not-allowed" : "pointer",
                }}
              >
                ✋ STAND
              </button>
              {canDouble && balance >= currentBet && !isAnimatingDealer && (
                <button onClick={doubleDown} className="btn text-xl px-8 py-3">
                  💰 DOUBLE DOWN
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4 text-xl text-gray-300">
              Final Bet:{" "}
              <span className="text-yellow-400 font-bold">${currentBet}</span>
            </div>
            <button onClick={startGame} className="btn text-xl px-12 py-4">
              🔄 NEW GAME
            </button>
          </div>
        )}
      </div>

      {/* Game Rules */}
      <div className="text-center mt-12">
        <div className="flex justify-center">
          <RuleCard game="blackjack" />
        </div>
      </div>
    </div>
  );
};
