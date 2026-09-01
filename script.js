console.log("SCRIPT.JS IS WORKING");

document.addEventListener("DOMContentLoaded", function () {

  const newGameBtn = document.getElementById("newGameBtn");
  const startScreen = document.getElementById("startScreen");
  const characterScreen = document.getElementById("characterScreen");

  console.log("New Game Button:", newGameBtn);
  console.log("Start Screen:", startScreen);
  console.log("Character Screen:", characterScreen);

  if (!newGameBtn) {
    console.error("ERROR: newGameBtn was not found!");
    return;
  }

  newGameBtn.addEventListener("click", function () {

    console.log("BEGIN YOUR ADVENTURE CLICKED!");

    startScreen.classList.remove("active");
    characterScreen.classList.add("active");

  });

});
