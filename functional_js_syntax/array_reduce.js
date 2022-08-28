// 1. Take this disjointed sentence and turn it into a single string
const text = [
  "The ships",
  "hung in the sky,",
  "much the way",
  "that bricks don`t",
];
console.log(text.reduce((prev, curr) => prev + " " + curr, ""));
// Your Code Here

// expected output: "The ships hung in the sky, much the way that bricks don't"

// ----------------------------------------------------------

// 2. Return the winning team
const scores = [
  {
    team: "A",
    score: 20,
  },
  {
    team: "B",
    score: 17,
  },
  {
    team: "C",
    score: 23,
  },
  {
    team: "D",
    score: 13,
  },
];

// Your Code Here
console.log(
  scores.reduce((prev, curr) => {
    if (curr.score > prev.score) {
      return curr;
    } else return prev;
  })
);

// expected output: "C"

// ----------------------------------------------------------
//    REAL LIFE EXAMPLE
// Reduce can sometimes save us a lot of time -- if we remember to use it.
// Instead of writing a complicated map or filter method and then calling the
// name of the ship out of the retuned array, Return the name of the fastest
// star ship

const ships = [
  {
    name: "Serenity",
    speed: "4.2G",
  },
  {
    name: "Cylon Raider",
    speed: "7.5G",
  },
  {
    name: "Swordfish II",
    speed: "50G",
  },
  {
    name: "Tie Fighters",
    speed: "4100G",
  },
];

// Your Code Here
console.log(
  ships.reduce((prev, curr) => {
    if (parseFloat(curr.speed) > parseFloat(prev.speed)) {
      return curr;
    } else return prev;
  })
);
// Expected output: Tie Fighters
