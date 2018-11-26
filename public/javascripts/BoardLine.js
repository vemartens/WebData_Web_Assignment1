const AVAIL = 1;
const UNAVAIL = -1;
//TA: 
// $(".Bolletje").click(function() { //css class
//     this.addClass("clicked");
// });
// $("#sol1").click(function() { //id van het bolletje sol1
//     this.addClass("clicked");
// });

function BoardLine() {
    this.lines = undefined;

    this.initialize = function() {
        this.lines = {
            line1: UNAVAIL,
            line2: UNAVAIL,
            line3: UNAVAIL,
            line4: UNAVAIL,
            line5: UNAVAIL,
            line6: UNAVAIL,
            line7: UNAVAIL,
            line8: UNAVAIL,
            line9: UNAVAIL,
            line10: UNAVAIL,
            lineCombination: UNAVAIL
        };
    };

    this.makeLetterUnAvailable = function(line){
        if(this.isLetter(letter)){

            this.letters[letter] = USED;



            //visually switch off the UI element by simply adding a classname

            document.getElementById(letter).className += " alphabetUsed";

        }

    };
    
}