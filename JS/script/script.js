var score = 0;
var counter = 0;
var num_of_icons_in_row = 8;
var candies_arr = [];
var candy_imgs = [
  "url(../IMG/imgs/1.png)",
  "url(../IMG/imgs/2.png)",
  "url(../IMG/imgs/3.png)",
  "url(../IMG/imgs/4.png)",
  "url(../IMG/imgs/5.png)",
  "url(../IMG/imgs/6.png)",
];
var game_board = document.querySelector(".game_board");
var scoreDisplay = document.getElementById("score");
var timerDisplay = document.getElementById("timer");
var startscreen = document.querySelector(".start-screen");
var candyDraggedImg;
var candyDroppedOnImg;
var candyDraggedId;
var candyDroppedOnId;


//first wait half second to load
setTimeout(function () {
  counter = 0;
  reset();
}, 500);
function reset() {
  score = 0;
  scoreDisplay.innerHTML = score;
  counter = 0;
}
//to display the timer
var timer2 = setInterval(function () {
  timerDisplay.innerHTML = 100 - counter;
  counter++;
}, 1000);
function newGame() {
  reset();
  startscreen.style.opacity = 0;
  setTimeout(function () {
    startscreen.style.height = 0;
  }, 1000);
}
function startBoard() {
  for (var i = 0; i < num_of_icons_in_row * num_of_icons_in_row; i++) {
    var candy = document.createElement("div");
    candy.setAttribute("draggable", true);
    candy.setAttribute("id", i);
    var random_candy = Math.floor(Math.random() * candy_imgs.length);
    candy.style.backgroundImage = candy_imgs[random_candy];
    game_board.appendChild(candy);
    candies_arr.push(candy);
  }
}
startBoard();

for (var i = 0; i < candies_arr.length; i++) {
  //getting the element dragged
  candies_arr[i].addEventListener("dragstart", function () {
    candyDraggedImg = this.style.backgroundImage;
    candyDraggedId = parseInt(this.id);
  });
  //when entering another element
  candies_arr[i].addEventListener("dragenter", function (e) {
    e.preventDefault();
  });
  //which element Iam over
  candies_arr[i].addEventListener("dragover", function (e) {
    e.preventDefault();
  });
//the element where it is dropped on
  candies_arr[i].addEventListener("drop", function () {
    candyDroppedOnImg = this.style.backgroundImage;
    candyDroppedOnId = parseInt(this.id);
    //switch the dragged and dropped elements' colors
    this.style.backgroundImage = candyDraggedImg;
    candies_arr[candyDraggedId].style.backgroundImage = candyDroppedOnImg;
  });
  //after drop
  candies_arr[i].addEventListener("dragend", function () {
    var validMoves = [candyDraggedId - 1, candyDraggedId - num_of_icons_in_row, candyDraggedId + 1, candyDraggedId + num_of_icons_in_row];
    if (!validMoves.includes(candyDroppedOnId)) {
      candies_arr[candyDroppedOnId].style.backgroundImage = candyDroppedOnImg;
      candies_arr[candyDraggedId].style.backgroundImage = candyDraggedImg;
    }
  });
}


//to fill the gap
function squareDown() {
  for (i = 0; i < 56; i++) {
    //if the square below has no image
    if (candies_arr[i + num_of_icons_in_row].style.backgroundImage === "") {
      //give it the image of the upper one
      candies_arr[i + num_of_icons_in_row].style.backgroundImage =
        candies_arr[i].style.backgroundImage;
      //and delete the image of the upper one
      candies_arr[i].style.backgroundImage = "";
    }
    //if the square has no image and it is in the first row then generate random candies
    var firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
    var isFirstRow = firstRow.includes(i);
    if (isFirstRow && candies_arr[i].style.backgroundImage === "") {
      var random_candy = Math.floor(Math.random() * candy_imgs.length);
      console.log(random_candy + " " + i);
      candies_arr[i].style.backgroundImage = candy_imgs[random_candy];
    }
  }
}

//for row of Four
//(num_of_icons_in_row * num_of_icons_in_row) - 3 = 61 => the last three will never have 3 similar after
function checkFourInRow() {

  for (i = 0; i < (num_of_icons_in_row * num_of_icons_in_row) - 3; i++) {
    var rowOfFour = [i, i + 1, i + 2, i + 3];
    var candy_img_check = candies_arr[i].style.backgroundImage; //the color to check for

    //these are the not valid elements to check in each row for example row one from 0->7
    //at 5 and 6 and 7 there will be no 4 items ater and it will continue in the second row
    var notValid = [
      5, 6, 7, 13, 14, 15, 21, 22, 23, 29, 30, 31, 37, 38, 39, 45, 46, 47, 53,
      54, 55,
    ];
    if (notValid.includes(i)) continue;

    if (
      candies_arr[rowOfFour[0]].style.backgroundImage === candy_img_check &&
      candies_arr[rowOfFour[1]].style.backgroundImage === candy_img_check &&
      candies_arr[rowOfFour[2]].style.backgroundImage === candy_img_check &&
      candies_arr[rowOfFour[3]].style.backgroundImage === candy_img_check &&
      candies_arr[i].style.backgroundImage !== ""
    ) {
      score += 4;
      scoreDisplay.innerHTML = score;
      for (var i in rowOfFour) {
        candies_arr[rowOfFour[i]].style.backgroundImage = "";
      }
    }
  }
}
checkFourInRow();

//for column of Four
//num_of_icons_in_row * num_of_icons_in_row - 3*num_of_icons_in_row = 40 => the last three rows will not have 4 similar in column
function checkFourInColumn() {
  for (i = 0; i < num_of_icons_in_row * num_of_icons_in_row - 3*num_of_icons_in_row; i++) {
    var columnOfFour = [
      i,
      i + num_of_icons_in_row,
      i + num_of_icons_in_row * 2,
      i + num_of_icons_in_row * 3,
    ];
    var candy_img_check = candies_arr[i].style.backgroundImage;

    if (
      candies_arr[columnOfFour[0]].style.backgroundImage === candy_img_check &&
      candies_arr[columnOfFour[1]].style.backgroundImage === candy_img_check &&
      candies_arr[columnOfFour[2]].style.backgroundImage === candy_img_check &&
      candies_arr[columnOfFour[3]].style.backgroundImage === candy_img_check &&
      candies_arr[i].style.backgroundImage !== ""
    ) {
      score += 4;
      scoreDisplay.innerHTML = score;
      for (var i in columnOfFour) {
        candies_arr[columnOfFour[i]].style.backgroundImage = "";
      }
    }
  }
}
checkFourInColumn();

//for row of Three
//(num_of_icons_in_row * num_of_icons_in_row) - 2 => the last two will never have 2 similar after
function checkThreeInRow() {
  for (i = 0; i < (num_of_icons_in_row * num_of_icons_in_row) - 2; i++) {
    var rowOfThree = [i, i + 1, i + 2];
    var candy_img_check = candies_arr[i].style.backgroundImage;

    var notValid = [6, 7, 14, 15, 22, 23, 30, 31, 38, 39, 46, 47, 54, 55];
    if (notValid.includes(i)) 
      continue;

    if (
      candies_arr[rowOfThree[0]].style.backgroundImage === candy_img_check &&
      candies_arr[rowOfThree[1]].style.backgroundImage === candy_img_check &&
      candies_arr[rowOfThree[2]].style.backgroundImage === candy_img_check &&
      candies_arr[i].style.backgroundImage !== ""
    ) {
      score += 3;
      scoreDisplay.innerHTML = score;
      for (var i in rowOfThree) {
        candies_arr[rowOfThree[i]].style.backgroundImage = "";
      }
    }
  }
}
checkThreeInRow();

//for column of Three
//num_of_icons_in_row * num_of_icons_in_row - 2 * num_of_icons_in_row = 48 which is 6 rows
function checkThreeInCoumn() {
  for (i = 0; i < num_of_icons_in_row * num_of_icons_in_row - 2 * num_of_icons_in_row; i++) {
    var columnOfThree = [
      i,
      i + num_of_icons_in_row,
      i + num_of_icons_in_row * 2,
    ];
    var candy_img_check = candies_arr[i].style.backgroundImage;

    if (
      candies_arr[columnOfThree[0]].style.backgroundImage === candy_img_check &&
      candies_arr[columnOfThree[1]].style.backgroundImage === candy_img_check &&
      candies_arr[columnOfThree[2]].style.backgroundImage === candy_img_check &&
      candies_arr[i].style.backgroundImage !== ""
    ) {
      score += 3;
      scoreDisplay.innerHTML = score;
      for (var i in columnOfThree) {
        candies_arr[columnOfThree[i]].style.backgroundImage = "";
      }
    }
  }
}
checkThreeInCoumn();

var timer = setInterval(function () {
  checkFourInRow();
  checkFourInColumn();
  checkThreeInRow();
  checkThreeInCoumn();
  squareDown();
}, 200);

var isfirstwin = true;
var isfirstlose = true;
var timer3 = setInterval(function () {
  var result = document.getElementById("welcome");
  if (score >= 100 && counter < 100) {
    result.innerHTML = "You Win!";
    startscreen.style.opacity = 1;
    startscreen.style.height = "100%";
    isfirstwin = false;
  } else if (
    counter > 100 &&
    result.innerHTML == "You Win!" &&
    startscreen.style.opacity == 1
  ) {
    result.innerHTML = "You Win!";
  } else if (counter > 100 && startscreen.style.opacity == 0) {
    result.innerHTML = "Game Over!";
    startscreen.style.opacity = 1;
    startscreen.style.height = "100%";
  } else if (counter > 100 && !isfirstwin) {
    result.innerHTML = "Game Over!";
    startscreen.style.opacity = 1;
    startscreen.style.height = "100%";
  }
}, 100);

