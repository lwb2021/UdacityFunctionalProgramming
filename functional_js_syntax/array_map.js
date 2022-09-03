// 1. Write a map function to reverse this array:
const start = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// your code
const result = start.map((elem) => start.length - elem + 1);
console.log(result);
// expected output: Array [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]

// ----------------------------------------------------------
// 2. Write a map function to print the Job: Name:
const shipMates = [
  ["Mal", "Captain"],
  ["Wash", "Pilot"],
  ["Zoey", "1st Mate"],
  ["Jayne", "Public Relations"],
];

// your code
const names = shipMates.map((pair) => `${pair[1]} ${pair[0]}`);
console.log(names);

// expected output: Array ["Captain: Mal", etc...]

// ----------------------------------------------------------
// 3. Write a map function that prints the name: even|odd
const awayTeam = ["Picard", "Riker", "Troy", "Data"];

// your code
const res = awayTeam.map(
  (name, idx) => `${name}: ${idx % 2 === 0 ? "even" : "odd"}`
);
console.log(res);

// expected output: Array: ["Picard: even", "Riker: odd", etc...]

// ----------------------------------------------------------
// 4. Create a multidimensional array of each item and its index in the original Array.

const sci_fi_shows = [
  "Manedlorian",
  "Enterprise",
  "Firefly",
  "Battlestar Galactica",
];

// your code
const result2 = sci_fi_shows.map((show, index) => [show, index]);
console.log(result2);
// expected output: Array [['Manedlorian', 0], ['Enterprise', 1], ['Firefly', 2], ['Battlestar Galactica', 3]]

// ----------------------------------------------------------
// 5. For each item in this array, create a multidimensional array containing the entire original array.

const numbers = [1, 2, 3, 4];

// your code
const result3 = numbers.map((name, idx, arr) => arr);
console.log(result3);
// expected output: Array [[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]

// Having trouble with creating a 2D array?
// Take a closer look at the last two arguments of map, one of them might be able to help
