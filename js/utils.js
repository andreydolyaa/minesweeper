'use strict';


function getRandomIntInclusive(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }



  function createArray(numOfCells) {
    var nums = [];
    for (var i = 0; i <= numOfCells; i++) {
        nums.push(i);
    }
    return nums;
}



function shuffle(nums) {
    nums.sort(function () {
        return 0.5 - Math.random();
    });
    return nums.pop();
}