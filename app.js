document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const statbombs = document.querySelector('.bombs');
    const statflags = document.querySelector('.flags');
    const status = document.querySelector('.status');
    let width = 10;
    let squares = [];
    let bombAmount = 20;
    let isGOver = false;
    let flags = 0;

    // board
    function createBoard() {

        // random array of bombs
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width*width - bombAmount).fill('valid');

        // mix these arrays to randomize bombs and non-bombs squares
        const gameArray = emptyArray.concat(bombsArray);
        let rand = Math.random() -0.5;
        const shuffledArray = gameArray.sort( () => Math.random() -0.5)

        for(let i = 0; i < width*width; i++){
            const square = document.createElement('div');
            square.setAttribute('id', i);
            square.classList.add(shuffledArray[i])
            grid.appendChild(square);
            squares.push(square);

            // add click listener
            square.addEventListener('click', function(e){
                click(square)
            })

            // right-click event listener - place flag
            square.oncontextmenu = function(e) {
                e.preventDefault()
                addFlag(square);
            }

        }

        // add numbers
        for(let i = 0; i < squares.length; i++) {
            let total = 0;
            const isL = (i % width === 0);
            const isR = (i % width === width -1);
            if(squares[i].classList.contains('valid')) {
                // check L:
                if (i > 0 && !isL && squares[i -1].classList.contains('bomb')) total ++;
                // check TR
                if (i > 9 && !isR && squares[i +1 -width].classList.contains('bomb')) total ++;
                // check T
                if (i > 10 && squares[i - width].classList.contains('bomb')) total ++;
                // check TL
                if (i > 11 && !isL && squares[i -1 -width].classList.contains('bomb')) total ++;
                // check R
                if (i < 98 && !isR && squares[i +1].classList.contains('bomb')) total ++;
                // check BL
                if (i < 90 && !isL && squares[i -1 +width].classList.contains('bomb')) total ++;
                // check BR
                if (i < 88 && !isR && squares[i +1 +width].classList.contains('bomb')) total ++;
                // check B
                if (i < 89 && squares[i +width].classList.contains('bomb')) total ++;
                squares[i].setAttribute('data', total); 
                
                
                
                // if (i > 0 && !isRight && squares[i+1-width].classList.contains('bomb')) total++;
 
            }
        }
        statbombs.innerHTML = `Bombs: ${bombAmount}`;
        statflags.innerHTML = `Flags: ${flags}`;
   }

    createBoard();

    function addFlag(sq) {
        if(isGOver) return;
        if(!sq.classList.contains('checked') && (flags < bombAmount)) {
            if(!sq.classList.contains('flag')) {
                sq.classList.add('flag');
                sq.innerHTML = '<div class="indiv">🚩</div>'
                flags++;
                checkForWin(); 
            } else {
                sq.classList.remove('flag'); 
                sq.innerHTML = ''
                flags --; 
            }
        }
        statflags.innerHTML = `Flags: ${flags}`;
    }

    function click(sq) {
        let sqId = sq.id
        if (isGOver) return;
        if (sq.classList.contains('checked') || sq.classList.contains('flag')) return;
        if (sq.classList.contains('bomb')) {
            gameOver(sq);
        } else {
            let total = sq.getAttribute('data');
            if(total != 0) {
                sq.classList.add('checked');
                sq.innerHTML = '<div class="indiv">'+total+'</div>';
                return; 
            }
            checkSquare(sq, sqId); 
        }
        sq.classList.add('checked')
    }

    // check neighboring squares
    function checkSquare(sq, sqId) {
        const isL = (sqId % width === 0);
        const isR = (sqId % width === width -1); 

        setTimeout(() => {
            // check L:
            if (sqId > 0 && !isL) {
                const newId = squares[parseInt(sqId) -1].id;
                const newSq = document.getElementById(newId);
                click(newSq); 
            }
            if (sqId > 9 && !isR) {
                const newId = squares[parseInt(sqId) +1 -width].id;
                const newSq = document.getElementById(newId);
                click(newSq); 
            }
            if (sqId > 10) {
                const newId = squares[parseInt(sqId -width)].id;
                const newSq = document.getElementById(newId);
                click(newSq); 
            }
            if (sqId > 11 && !isL) {
                const newId = squares[parseInt(sqId) -1 -width].id;
                const newSq = document.getElementById(newId);
                click(newSq); 
            }
            if (sqId < 98 && !isR) {
                const newId = squares[parseInt(sqId) +1].id;
                const newSq = document.getElementById(newId);
                click(newSq); 
            }
            if (sqId < 90 && !isL) {
                const newId = squares[parseInt(sqId) -1 +width].id;
                const newSq = document.getElementById(newId);
                click(newSq); 
            }
            if (sqId < 88 && !isR) {
                const newId = squares[parseInt(sqId) +1 +width].id;
                const newSq = document.getElementById(newId);
                click(newSq); 
            }
            if (sqId < 89) {
                const newId = squares[parseInt(sqId) +width].id;
                const newSq = document.getElementById(newId);
                click(newSq); 
            }
        })

    }

    function gameOver(sq) {
        isGOver = true;

        // show all bombs
        squares.forEach(sq => {
            if(sq.classList.contains('bomb')) {
                sq.innerHTML = '<div class="indiv">💣</div>';
                sq.classList.remove('bomb');
                sq.classList.remove('checked');
            }
        })
        status.innerHTML = 'You Lost!';
    }

    // check for win
    function checkForWin() {
        
        let matches = 0;

        for(let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches ++;
            }

        }
        // console.log('matches: '+matches);
        // console.log('bombAmount: '+bombAmount);
        if(matches === bombAmount) {
           status.innerHTML = 'You Won!'
           isGOver = true;
        }
        statbombs.innerHTML = `Bombs: ${bombAmount}`;
    }


















})