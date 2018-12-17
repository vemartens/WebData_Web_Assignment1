
//Gives an alert with the instructions when this function is called
function instructionButton() {
    
    var textString = "The Codemaker sets a secret code, then the Codebreaker tries to match the code using logic,"
        + " deduction, and maybe even a little bit of luck. \nAfter each move, the Codemaker must give clues that help the Codebreaker."
        + " Can you crack the code in 10 moves or less.. and can you come up with a code that will last for 10 moves? \n"
        + "\n"
        + "In the game you can change the colors of the balls by clicking on it. For the combinations, there are 8 colors in total. "
        + "After clicking 9 times, the ball is gray again, which means it is empty. "
        + "When you are done, you click on ready to pass the turn to the other player. "
        + "You need to fill all the balls before you can click on ready. \n"
        + "\n"
        + "If you are the codemaker, you also need to check the guesses of the codebreaker. "
        + "You do this by clicking on the small balls next to play board in the middel. "
        + "This time there are 2 colors: a white pin means that a certain color in the guess is correct, "
        + "but is not in the right place (as in the target combination); a red pin means that both the color and placement is correct. ";
    
    alert(textString);
}
