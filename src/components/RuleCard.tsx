import { GAMES } from "../data/gameRules";

type RuleCardProps = {
  game: string;
};

export const RuleCard = ({ game }: RuleCardProps) => {
  const currentGame = GAMES.find((x) => x.id === game);
  if (!currentGame) {
    return (
      <div className="card inline-block max-w-xl w-full text-center">
        <div className="text-sm text-gray-300">No rules found for "{game}"</div>
      </div>
    );
  }

  return (
    <div className="card inline-block max-w-xl w-full text-center">
      <h3 className="text-xl font-bold text-yellow-400 mb-3">
        Rules & Payouts
      </h3>
      <div className="text-sm text-gray-300 space-y-2 text-left">
        {currentGame.rules.map((rule) => (
          <div key={rule.title}>
            <p>
              <strong>{rule.title}</strong> {rule.detail}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
