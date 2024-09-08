import View from "./view.js";

const App = {
    // All of our selected HTML elements
    $: {
        menu: document.querySelector('[data-id = "menu"]'),
        menuItems: document.querySelector('[data-id = "menu-items"]'),
        resetBtn: document.querySelector('[data-id = "reset-btn"]'),
        newRoundBtn: document.querySelector('[data-id = "new-round-btn"]'),   
        squares: document.querySelectorAll('[data-id = "square"]'),  
        modal : document.querySelector('[data-id = "modal"]'),
        modalText: document.querySelector('[data-id = "modal-text"]'),
        modalBtn: document.querySelector('[data-id = "modal-btn"]'),
        turn: document.querySelector('[data-id = "turn"]')
    },

    state: {
        moves: [],
        // May need to refactor
    },

    getGameStatus(moves){

        const p1Moves = moves.filter((move) => move.playerId ===1).map(move => +move.squareId)
        const p2Moves = moves.filter((move) => move.playerId ===2).map(move => +move.squareId)

        const winningPatterns = [
            [1,2,3],
            [1,5,9],
            [1,4,7],
            [2,5,8],
            [4,5,6],
            [3,6,9],
            [3,5,7],
            [7,8,9],
        ];

        let winner = null;

        winningPatterns.forEach(pattern => {

            console.log({pattern, p1Moves, p2Moves});
            const p1Wins = pattern.every((v) => p1Moves.includes(v));
            const p2Wins = pattern.every((v) => p2Moves.includes(v));

            if (p1Wins) winner = 1;
            if (p2Wins) winner = 2;

        });
        return{
            status: moves.length === 9 || winner != null ? 'complete': 'in-progress', // in progress || complete
            winner // 1 | 2 | null
        };
    },

    init(){
        App.registerEventListeners();     
    },

    registerEventListeners(){
        // Done
        console.log(App.$.squares);
        
        App.$.menu.addEventListener("click", (event)=>{
            App.$.menuItems.classList.toggle('hidden');
        });   

        // To-do

        App.$.resetBtn.addEventListener('click', (event) => {
            console.log('Reset the Game!');

        });

        // To-do

        App.$.newRoundBtn.addEventListener('click', (event) => {
            console.log('Add a New Round.');

        });

        App.$.modalBtn.addEventListener('click', (event) => {
            App.state.moves = [];
            App.$.squares.forEach( square => square.replaceChildren())
            App.$.modal.classList.add('hidden');
        } );

        App.$.squares.forEach((square) => {
            square.addEventListener("click", (event) => {
                console.log(`Square with id ${event.target.id} was clicked`);
                console.log(`Current player is ${App.state.currentPlayer}`);

                // Check if there is already a play, if so, return early

                const hasMove = (squareId) => {
                    const existingMove = App.state.moves.find(move => move.squareId === squareId)
                    return existingMove !== undefined
                }

                if (hasMove(+square.id)){
                    return;
                }

                // Determine which player icon to add to the square
                const lastMove = App.state.moves.at(-1);
                const getOppositePlayer = (playerId) => (playerId === 1 ? 2 : 1);
                const currentPlayer = 
                App.state.moves.length === 0 
                ? 1 
                : getOppositePlayer(lastMove.playerId);

                const nextPlayer = getOppositePlayer(currentPlayer)
                
                const squareIcon = document.createElement('i');
                const turnIcon = document.createElement('i')
                const turnLabel = document.createElement('p');
                turnLabel.innerText = `Player ${nextPlayer}, you are up!`
                

                if (currentPlayer === 1){
                    squareIcon.classList.add("fa-solid", "fa-x", "yellow");
                    turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
                    turnLabel.classList = 'turquoise'
                    
                }

                else{
                    squareIcon.classList.add("fa-solid", "fa-o", "turquoise");
                    turnIcon.classList.add("fa-solid", "fa-x", "yellow");
                    turnLabel.classList = 'yellow'
            
                }

                App.$.turn.replaceChildren(turnIcon, turnLabel);

                App.state.moves.push({
                    squareId: +square.id,
                    playerId: currentPlayer,
                })

                App.state.currentPlayer = currentPlayer === 1 ? 2 : 1;
                
                console.log(App.state);
 
                square.replaceChildren(squareIcon);

                // Check for winner or tie
                const game = App.getGameStatus(App.state.moves);

                if (game.status === 'complete'){
                    App.$.modal.classList.remove('hidden');

                    let message = '';

                    if(game.winner){
                         message = `Player ${game.winner} wins!`;
                        
                    } else{
                        message = 'Tie Game!';        
                    }

                    App.$.modalText.textContent = message;

                }

                
            });
        });

    }
};

window.addEventListener('load',App.init);

function init(){

    const view = new View();

    console.log(view.$.turn);

}

window.addEventListener('load', init);
