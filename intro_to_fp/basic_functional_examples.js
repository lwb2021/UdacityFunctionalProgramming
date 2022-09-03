// -----------------------------------------------------------------
// Exercise 1
// Directions: Write a pure function that prints "good afternoon" if
//       its afternoon and "good morning" any other time of the day.
// Hint - this will help with time of day: new Date().getHours()
// -----------------------------------------------------------------

function f() {
  const time = new Date().getHours();
  if (time >= 12 && time <= 18) console.log("good afternoon");
  else console.log("good morning");
}
f();

// -----------------------------------------------------------------
// Exercise 2
// Directions: Write a pure function that takes in a number and
//       returns an array of items counting down from that number to
//       zero.
// -----------------------------------------------------------------
function f2(number) {
  let array = [];
  while (number >= 0) {
    array.push(number);
    number--;
  }
  return array;
}

console.log(f2(10));
