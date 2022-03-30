// updates the view based on the .json's content every 500 ms 
window.onload = () => { fetchBracketData(); setInterval(fetchBracketData, 500) };

// fetches bracket .json and sets the view accordingly
function fetchBracketData() {
	var req = new XMLHttpRequest();

	// sets the bracket once the .json has been loaded
	req.addEventListener("load", () => { setRoundData(req.responseText) });

	req.open("GET", `Resources/bracket.json`);
	req.send();
}

// helper function to set rounds data
function setRoundData(response) {
	const bracket = JSON.parse(response);

	// iterates through every round in the json
	for (var r of Object.keys(bracket["sets"])) {
		const current_round = document.getElementById(r);

		// sets characters
		current_round.children[1].children[0].src = `Resources/Characters/${bracket["game"]}/${bracket["sets"][r]["player-1"]["character"]}.png`
		current_round.children[3].children[0].src = `Resources/Characters/${bracket["game"]}/${bracket["sets"][r]["player-2"]["character"]}.png`

		// sets nicknames
		current_round.children[1].children[1].innerText = bracket["sets"][r]["player-1"]["nickname"]
		current_round.children[3].children[1].innerText = bracket["sets"][r]["player-2"]["nickname"]

		// sets scores
		current_round.children[1].children[2].innerText = bracket["sets"][r]["player-1"]["score"]
		current_round.children[3].children[2].innerText = bracket["sets"][r]["player-2"]["score"]

		// handles winning scores
		const winning_scores = {
			3: 2,
			5: 3,
			7: 4
		}

		if (current_round.children[1].children[2].innerText == winning_scores[bracket["sets"][r]["bestOf"]]) {
			current_round.children[1].children[2].classList.add('winning-score');
		} else {
			current_round.children[1].children[2].classList.remove('winning-score');
		}

		if (current_round.children[3].children[2].innerText == winning_scores[bracket["sets"][r]["bestOf"]]) {
			current_round.children[3].children[2].classList.add('winning-score');
		} else {
			current_round.children[3].children[2].classList.remove('winning-score');
		}
	}


	// handles grand final reset
	if (bracket["sets"]["grand-finals-reset"]["player-1"]["nickname"] ||
		bracket["sets"]["grand-finals-reset"]["player-2"]["nickname"]
	) {
		document.getElementById('grand-finals-reset').style.display = 'block';
		document.getElementById('gf-gfr').style.display = 'block';
	} else {
		document.getElementById('grand-finals-reset').style.display = 'none';
		document.getElementById('gf-gfr').style.display = 'none';
	}
}