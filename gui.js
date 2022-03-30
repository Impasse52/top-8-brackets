const fs = require('fs');

// loads previously saved data on startup and fills character selection menu
window.onload = () => {
    fillPlayer1CharacterSelectionMenu();
    fillPlayer2CharacterSelectionMenu();
    loadBracketJson();
};

// laoded at each onchange event to prevent mismatches (e.g.: by manually editing the file)
document.getElementById('round').onchange = loadBracketJson;

// updates bracket.json and the view when clicking on the update button
document.getElementById('update-button').onclick = updateBracketJson;
document.getElementById('reset-button').onclick = resetSet;

// opens up character selection screen
document.getElementById('player1-character').onclick = () => showCharacterSelectionMenu("1");
document.getElementById('player2-character').onclick = () => showCharacterSelectionMenu("2");

// changes character list on game change
document.getElementById('game').onchange = () => {
    fillPlayer1CharacterSelectionMenu();
    fillPlayer2CharacterSelectionMenu();

    // resets characters
    document.getElementById('player1-character').style.backgroundImage = "";
    document.getElementById('player2-character').style.backgroundImage = "";
};

// is called at startup and whenever a set is selected
function loadBracketJson() {
    let bracketString;

    if (process.env.PORTABLE_EXECUTABLE_DIR !== undefined) {
        bracketString = fs.readFileSync(`${process.env.PORTABLE_EXECUTABLE_DIR}/Resources/bracket.json`);
    } else {
        bracketString = fs.readFileSync(`${__dirname}/Resources/bracket.json`);
    }

    localStorage.setItem('bracket', bracketString);

    const currentRound = document.getElementById('round').value;
    const bracketObject = JSON.parse(bracketString);

    document.getElementById('game').value = bracketObject["game"];
    document.getElementById('best-of').value = bracketObject["sets"][currentRound].bestOf;
    document.getElementById('player1-nickname').value = bracketObject["sets"][currentRound]["player-1"]["nickname"];
    document.getElementById('player1-score').value = bracketObject["sets"][currentRound]["player-1"]["score"];
    document.getElementById('player1-character').style.backgroundImage = `url("Resources/Characters/${bracketObject["game"]}/${bracketObject["sets"][currentRound]["player-1"]["character"]}.png`;
    document.getElementById('player2-nickname').value = bracketObject["sets"][currentRound]["player-2"]["nickname"];
    document.getElementById('player2-score').value = bracketObject["sets"][currentRound]["player-2"]["score"];
    document.getElementById('player2-character').style.backgroundImage = `url("Resources/Characters/${bracketObject["game"]}/${bracketObject["sets"][currentRound]["player-2"]["character"]}.png`;
}

// updates bracket.json, hence updating the view itself
function updateBracketJson() {
    // a few useful values
    const roundName = document.getElementById('round').value;
    const game = document.getElementById('game').value;
    const bestOf = document.getElementById('best-of').value;
    const p1Nickname = document.getElementById('player1-nickname').value;
    const p1Score = document.getElementById('player1-score').value;
    const p1Character = document.getElementById('player1-character').style.backgroundImage
    const p2Nickname = document.getElementById('player2-nickname').value;
    const p2Score = document.getElementById('player2-score').value;
    const p2Character = document.getElementById('player2-character').style.backgroundImage

    const bracketObject = JSON.parse(localStorage.getItem('bracket'));

    if (p1Character != "")
        var p1CharacterURL = p1Character.split("/")[3].replace('.png")', '');

    if (p2Character != "")
        var p2CharacterURL = p2Character.split("/")[3].replace('.png")', '');


    bracketObject["game"] = game;
    bracketObject["sets"][roundName]["bestOf"] = bestOf;
    bracketObject["sets"][roundName]["player-1"]["nickname"] = p1Nickname;
    bracketObject["sets"][roundName]["player-1"]["score"] = p1Score;
    bracketObject["sets"][roundName]["player-1"]["character"] = p1Character == "" ? "None" : p1CharacterURL;
    bracketObject["sets"][roundName]["player-2"]["nickname"] = p2Nickname;
    bracketObject["sets"][roundName]["player-2"]["score"] = p2Score;
    bracketObject["sets"][roundName]["player-2"]["character"] = p2Character == "" ? "None" : p2CharacterURL;


    const bracketString = JSON.stringify(bracketObject, null, 4);

    if (process.env.PORTABLE_EXECUTABLE_DIR !== undefined) {
        fs.writeFileSync(`${process.env.PORTABLE_EXECUTABLE_DIR}/Resources/bracket.json`, bracketString);
    } else {
        fs.writeFileSync(`${__dirname}/Resources/bracket.json`, bracketString);
    }
}

// TODO: merge into a single function

// fills up character selection menu for p1
function fillPlayer1CharacterSelectionMenu() {
    const oldCharactersTable = document.querySelector('#player1-character-selection-menu > table');
    const selectedGame = document.querySelector('#game').value;

    // creates new table
    const charactersTable = document.createElement('table');

    fs.readdir(`${__dirname}/Resources/Characters/${selectedGame}`, (_, files) => {
        var index = 0;

        // creates the first row
        var charactersRow = document.createElement('tr');

        for (let f of files) {
            // ignore blank file
            if (f == "None.png")
                continue;

            // creates new row each 4 characters
            if (index == 4) {
                charactersTable.appendChild(charactersRow);
                charactersRow = document.createElement('tr');
                index = 0;
            }


            var characterEntry = document.createElement('td');
            characterEntry.style.backgroundImage = `url('Resources/Characters/${selectedGame}/${f}')`;
            characterEntry.classList.add('character-selection-entry');
            characterEntry.onclick = () => selectCharacter("1", f);

            charactersRow.appendChild(characterEntry);
            index++;
        }

        // appends the last row and quits
        charactersTable.appendChild(charactersRow);
    });

    oldCharactersTable.replaceWith(charactersTable);
}

// fills up character selection menu for p2
function fillPlayer2CharacterSelectionMenu() {
    const oldCharactersTable = document.querySelector('#player2-character-selection-menu > table');
    const selectedGame = document.querySelector('#game').value;

    // creates new table
    const charactersTable = document.createElement('table');

    fs.readdir(`${__dirname}/Resources/Characters/${selectedGame}`, (_, files) => {
        var index = 0;

        // creates the first row
        var charactersRow = document.createElement('tr');

        for (let f of files) {
            // ignore blank file
            if (f == "None.png")
                continue;

            // creates new row each 4 characters
            if (index == 4) {
                charactersTable.appendChild(charactersRow);
                charactersRow = document.createElement('tr');
                index = 0;
            }


            var characterEntry = document.createElement('td');
            characterEntry.style.backgroundImage = `url('Resources/Characters/${selectedGame}/${f}')`;
            characterEntry.classList.add('character-selection-entry');
            characterEntry.onclick = () => selectCharacter("2", f);

            charactersRow.appendChild(characterEntry);
            index++;
        }

        // appends the last row and quits
        charactersTable.appendChild(charactersRow);
    });

    oldCharactersTable.replaceWith(charactersTable);
}


function showCharacterSelectionMenu(playerIndex) {
    const menu = document.getElementById(`player${playerIndex}-character-selection-menu`);
    const character = document.getElementById(`player${playerIndex}-character`);

    // shows character selection menu
    menu.style.display = "block";

    character.onclick = () => {
        menu.style.display = "none";
        character.onclick = () => showCharacterSelectionMenu(playerIndex);
    }
}

function selectCharacter(playerIndex, character) {
    const button = document.getElementById(`player${playerIndex}-character`);
    const menu = document.getElementById(`player${playerIndex}-character-selection-menu`);
    const selectedGame = document.getElementById('game').value;

    menu.style.display = 'none';
    button.onclick = () => showCharacterSelectionMenu(playerIndex);
    button.style.backgroundImage = `url('Resources/Characters/${selectedGame}/${character}')`
}

function resetSet() {
    document.getElementById('player1-nickname').value = "";
    document.getElementById('player1-score').value = "";
    document.getElementById('player1-character').style.backgroundImage = "";
    document.getElementById('player2-nickname').value = "";
    document.getElementById('player2-score').value = "";
    document.getElementById('player2-character').style.backgroundImage = "";
}