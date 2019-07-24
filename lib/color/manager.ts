export const globalColors = [
  '#2D728F',
  '#3B8EA5',
  '#f85a40',
  '#F49E4C',
  '#AB3428',
  '#995D81',
  '#484A47',
]

function getRandomArbitrary(min, max): number {
  return Math.random() * (max - min) + min
}

export const getRandomColor = () => {
  return globalColors[
    Math.round(getRandomArbitrary(0, globalColors.length - 1))
  ]
}
