var numTeams = 0;
var numFields = 1;
var numGroups = 1;
var tournament;
var tournamentname = "3. Neuhofner Knittelturnier";
teams = new Array();

function updatenumTeams(inputField){
	var desiredTeams = Math.abs(parseInt(inputField.value)) || 0;
	if (desiredTeams>numTeams) {
		for (var i = numTeams; i < desiredTeams; ++i){
			var input = document.createElement('input');
			input.setAttribute("id", "team"+i);
			teams[i] = "Team "+(i+1);
			input.setAttribute("value", teams[i]);
			input.setAttribute("onkeyup", "updateTeams(this);");
			input.setAttribute("onchange", "updateTeams(this);");
			document.getElementById('teamArea').appendChild(input);
		}
	}else{
		for (var i = desiredTeams; i < numTeams; ++i){
			var node = document.getElementById("team"+i);
			var docBody = document.getElementById("teamArea");
			docBody.removeChild(node);
		}
	}
	numTeams = desiredTeams;
	teams.length = desiredTeams;
	tournament = generateTournament(numTeams, numFields, numGroups);
	outputData();
}
function updatenumFields(inputField){
	var desiredFields = Math.abs(parseInt(inputField.value)) || 0;
	numFields = desiredFields;
	tournament = generateTournament(numTeams, numFields, numGroups);
	outputData();
}
function updatenumGroups(inputField){
	var desiredGroups = Math.abs(parseInt(inputField.value)) || 0;
	numGroups = desiredGroups;
	tournament = generateTournament(numTeams, numFields, numGroups);
	outputData();
}
function updateTeams(teamInput) {
	teams[teamInput.id.slice(4)] = teamInput.value;
	outputData();
}
function updateTournamentName(input) {
	tournamentname = input.value;
	outputData();
}

function outputData(){
	var tournamentTablePagePrototype = document.getElementById("tournamentTablePagePrototype");
	var myNode = document.getElementById('tables');
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	}
	
	////////// Overview of games
	var overviewPage = document.createElement('div');
	var newTable = overviewPage.appendChild(document.createElement('table'));
	newTable.setAttribute("class","tableStyle");
	
	var tableHead = newTable.appendChild(document.createElement('thead'));
	var tr = tableHead.insertRow(-1);
	for (var i = 0; i < numFields; ++i){
		var td = tr.insertCell(-1);
		td.innerHTML = "Feld "+(i+1);
	}
	for (var i = 0; i < tournament.rounds.length; ++i){
		var tr = newTable.insertRow(-1);
		for (var j = 0; j < tournament.rounds[i].length; ++j){
			var td = tr.insertCell(-1);
			if (tournament.rounds[i][j][0]!=-1){
				td.innerHTML = teams[tournament.rounds[i][j][0]]+" : "+teams[tournament.rounds[i][j][1]];
				td.setAttribute("class","tableStyle");
			}else{
				td.innerHTML = "X"
				td.setAttribute("class", "pause tableStyle");
			}

		}
	}
	pageBreak = document.createElement('div');
	pageBreak.setAttribute("class","page-break");
	overviewPage.appendChild(pageBreak);
	document.getElementById('tables').appendChild(overviewPage);
	
	////////// Pages for the Teams
	for (var i = 0; i < numTeams; ++i){
		var newTablePage = tournamentTablePagePrototype.cloneNode(true);
		newTablePage.style.display = "inline";
		newTablePage.id = "tournamentTablePage"+i;
		var newTable = newTablePage.getElementsByTagName('table')[0];
		newTable.id = "tournamentTable"+i;
		for (var j = 0; j < tournament.roundTeamField.length; ++j){
			var tr = newTable.insertRow(-1);
			var td = tr.insertCell(-1);
			if (tournament.roundTeamField[j][i]!=-1){
				td.innerHTML = 1+tournament.roundTeamField[j][i];
				var td = tr.insertCell(-1);
				td.innerHTML = teams[tournament.rounds[j][tournament.roundTeamField[j][i]][0]];
				var td = tr.insertCell(-1);
				td.innerHTML = teams[tournament.rounds[j][tournament.roundTeamField[j][i]][1]];
				for (var k = 0; k < 17; ++k){
					var td = tr.insertCell(-1);
				}
			}else{
				tr.setAttribute("class", "pause");
				td.innerHTML = "PAUSE";
				td.setAttribute("colspan", 42);
			}

		}
		var teamname = newTablePage.getElementsByClassName('teamname')[0];
		teamname.innerHTML = teams[i];
		var teamname = newTablePage.getElementsByClassName('tournamentname')[0];
		teamname.innerHTML = tournamentname;
		document.getElementById('tables').appendChild(newTablePage);
	}
}