type RuleProps = {
  title: string;
  detail: string;
};

const SLOTS_RULES: RuleProps[] = [
  {
    title: "🎰 Three of a kind:",
    detail: "10x bet",
  },
  {
    title: "✨ Two of a kind:",
    detail: "2x bet",
  },
  {
    title: "💎 Three diamonds:",
    detail: "MEGA JACKPOT!",
  },
];

const BLACKJACK_RULES: RuleProps[] = [
  {
    title: "🎰 Blackjack (21 with 2 cards):",
    detail: "Pays 2.5x your bet!",
  },
  {
    title: "🎊 Win:",
    detail: "Pays 2x your bet (double your money)",
  },
  {
    title: "🤝 Push (Tie):",
    detail: "Your bet is returned",
  },
  {
    title: "💰 Double Down:",
    detail: "Double your bet, take 1 card, then stand",
  },
  {
    title: "📋 Dealer:",
    detail: "Must hit on 16 or less, stands on 17+",
  },
];

type GameProps = {
  id: string;
  name: string;
  rules: RuleProps[];
};

export const GAMES: GameProps[] = [
  { id: "slots", name: "Slots", rules: SLOTS_RULES },
  { id: "blackjack", name: "Blackjack", rules: BLACKJACK_RULES },
];
