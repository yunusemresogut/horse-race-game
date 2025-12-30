import { colors } from "./colors";
import { names } from "./names";

function shuffleArray(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

function generateHorses() {
    const shuffledColors = shuffleArray(colors);
    const shuffledNames = shuffleArray(names);

    return Array.from({ length: 20 }, (_, index) => ({
        id: index + 1,
        name: shuffledNames[index],
        condition: Math.floor(Math.random() * 100),
        color: shuffledColors[index]
    }));
}

export default generateHorses;