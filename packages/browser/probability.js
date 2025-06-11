/**
 * Random number generator utility for testing probability distributions.
 * Generates random numbers between 0 and 100.
 * 
 * @returns {number} Random number between 0 and 100
 */
function rand() {
  return Math.random() * 100
}

// Test script: generates 10,000 random numbers for probability analysis
for (let i = 0; i < 10000; i++) {
  console.log(rand())
}
