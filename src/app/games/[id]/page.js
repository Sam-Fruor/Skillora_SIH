import PeriodicTableGame from "@/components/PeriodicTableGame";
import MotorWorksGame from "@/components/MotorWorksGame";
import HumanBodyGame from "@/components/HumanBodyGame";
import PerfectPourGame from "@/components/PerfectPourGame";
import IndustryArchitectGame from "@/components/IndustryArchitectGame";
import MelodySculptorGame from "@/components/MelodySculptorGame";

const gamesList = [
  { id: 1, title: "Periodic Table Treasure Hunt", description: "An alchemy-themed chemistry puzzle." },
  { id: 2, title: "Motor Works", description: "Build a DC motor and see physics in action." },
  { id: 3, title: "Human Body Explorer", description: "Solve medical mysteries in this biology game." },
  { id: 4, title: "The Perfect Pour", description: "A business sim about math and lassi." },
  { id: 5, title: "Industry Architect", description: "A geography puzzle of resource management." },
  { id: 6, title: "Melody Sculptor", description: "A 3D sandbox for building musical sculptures." },
];

export default function GamePage({ params }) {
  const game = gamesList.find(g => g.id === parseInt(params.id));

  if (!game) { 
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4 text-white">
            <h1 className="text-4xl font-bold">Game Not Found!</h1>
            <p className="mt-4">The game you are looking for does not exist.</p>
        </div>
    );
  }

  let GameComponent = null;

  if (game.id === 1) {
    GameComponent = <PeriodicTableGame />;
  } else if (game.id === 2) {
    GameComponent = <MotorWorksGame />;
  } else if (game.id === 3) {
    GameComponent = <HumanBodyGame />;
  } else if (game.id === 4) {
    GameComponent = <PerfectPourGame />;
  } else if (game.id === 5) {
    GameComponent = <IndustryArchitectGame />;
  } else if (game.id === 6) {
    GameComponent = <MelodySculptorGame />;
  }

  return (
    // Note: The Melody Sculptor game has its own background styling,
    // so we only apply the default gray background if it's not that game.
    <div className={`flex flex-col items-center justify-center min-h-screen p-4 ${game.id !== 6 ? 'bg-gray-900' : ''}`}>
      {GameComponent ? (
        GameComponent
      ) : (
        <div className="bg-white p-10 rounded-xl shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-800">{game.title}</h1>
            <p className="text-lg text-gray-600 mt-4">{game.description}</p>
            <p className="mt-8 text-gray-400 animate-pulse">
              This game is under construction!
            </p>
         </div>
      )}
    </div>
  );
}

