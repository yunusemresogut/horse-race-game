export const RACE_DISTANCES = [1200, 1400, 1600, 1800, 2000, 2200];

export function selectRandomHorses(horses, count = 10) {
  if (horses.length < count) {
    return horses;
  }

  const shuffled = [...horses].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export function generateProgram(horses) {
  if (horses.length === 0) {
    return [];
  }

  return RACE_DISTANCES.map((distance, index) => {
    const selectedHorses = selectRandomHorses(horses, 10);

    return {
      raceNumber: index + 1,
      distance: distance,
      horses: selectedHorses.map((horse, pos) => ({
        position: pos + 1,
        name: horse.name,
        horseId: horse.id
      }))
    };
  });
}

