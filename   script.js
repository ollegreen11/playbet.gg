const { useState, useEffect } = React;

function GamblingSite() {
    const [crashMultiplier, setCrashMultiplier] = useState(1.0);
    const [isCrashed, setIsCrashed] = useState(false);
    const [balance, setBalance] = useState(100);
    const [bets, setBets] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [rouletteResult, setRouletteResult] = useState('');

    // Ljudinställningar
    const winSound = new Howl({ src: ['win-sound.mp3'] });
    const crashSound = new Howl({ src: ['crash-sound.mp3'] });

    useEffect(() => {
        const fakeBets = [
            { user: 'Player123', amount: 50, game: 'Crash' },
            { user: 'RobloxKing', amount: 100, game: 'Roulette' },
            { user: 'ProGamer', amount: 200, game: 'Blackjack' }
        ];

        const interval = setInterval(() => {
            const newBet = fakeBets[Math.floor(Math.random() * fakeBets.length)];
            setBets(prev => [newBet, ...prev.slice(0, 9)]);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const startCrash = () => {
        setIsCrashed(false);
        let multiplier = 1.0;
        const interval = setInterval(() => {
            multiplier += 0.1;
            setCrashMultiplier(multiplier);
            if (Math.random() < 0.05) {
                setIsCrashed(true);
                crashSound.play();  // Spela crash ljud
                clearInterval(interval);
            }
        }, 500);
    };

    const cashOut = () => {
        if (!isCrashed) {
            setBalance(balance * crashMultiplier);
            setIsCrashed(true);
            winSound.play(); // Spela ljud när användaren cashar ut och vinner
        }
    };

    const playRoulette = () => {
        const result = Math.floor(Math.random() * 37); // Roulette numbers 0-36
        let outcome = '';
        
        if (result === 0) {
            outcome = 'Green 0';
        } else if (result % 2 === 0) {
            outcome = `Red ${result}`;
        } else {
            outcome = `Black ${result}`;
        }

        setRouletteResult(outcome);
    };

    const toggleAdminPanel = () => {
        setIsAdmin(!isAdmin);
    };

    console.log("Rendering GamblingSite component...");

    return (
        <div className="min-h-screen bg-zinc-900 text-white flex flex-col items-center justify-center gap-8 p-4">
            <h1 className="text-4xl font-bold">Roblox Gambling Site 🎯</h1>

            <div className="w-96 bg-gray-800 p-6 rounded-lg">
                <div className="text-3xl">
                    🚀 Crash: {crashMultiplier.toFixed(2)}x
                </div>
                {isCrashed && <span className="text-red-500">CRASHED!</span>}
                <button onClick={startCrash} disabled={!isCrashed} className="bg-blue-500 py-2 px-4 rounded mt-4">
                    Start Crash
                </button>
                <button onClick={cashOut} disabled={isCrashed} className="bg-green-500 py-2 px-4 rounded mt-4">
                    Cash Out
                </button>
                <div className="text-lg mt-4">Balance: {balance.toFixed(2)} Robux</div>
            </div>

            {/* Roulette Section */}
            <div className="w-96 bg-gray-800 p-6 rounded-lg mt-8">
                <h2 className="text-3xl">🎰 Roulette</h2>
                <button onClick={playRoulette} className="bg-yellow-500 py-2 px-4 rounded mt-4">
                    Spin Roulette
                </button>
                <div className="mt-4 text-xl">{rouletteResult}</div>
            </div>

            {/* Fake Bets Section */}
            <div className="w-full max-w-3xl bg-black p-4 rounded-lg text-center mt-8">
                <h2 className="text-xl font-bold">Fake Bets 💸</h2>
                {bets.map((bet, index) => (
                    <div key={index} className="text-sm">
                        {bet.user} bet {bet.amount} Robux on {bet.game}
                    </div>
                ))}
            </div>

            {/* Admin Panel Toggle */}
            <button className="bg-purple-500 py-2 px-4 rounded mt-4" onClick={toggleAdminPanel}>
                {isAdmin ? 'Hide Admin Panel' : 'Admin Panel'}
            </button>

            {/* Admin Panel (only visible to admins) */}
            {isAdmin && (
                <div className="mt-6 bg-gray-700 p-4 rounded-lg w-96">
                    <h3 className="text-xl font-bold text-yellow-400">Admin Panel</h3>
                    <div className="text-white mt-4">
                        <p>Admin Actions Here</p>
                    </div>
                </div>
            )}
        </div>
    );
}

console.log("Starting ReactDOM render...");

ReactDOM.render(<GamblingSite />, document.getElementById('root'));


