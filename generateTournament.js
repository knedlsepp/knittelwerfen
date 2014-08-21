function pairTeams(teams){
	var numTeams = teams.length;

	var refPairs = new Array();
	for (var j = 0; j < numTeams; ++j){
		for (var i = 0; i < j; ++i){
			refPairs.push([i,j]);
		}
	}
	var fairness = new Array(numTeams);
	for (var i = 0; i < numTeams; ++i)
		fairness[i]=0;

	for (var i = 0; i<refPairs.length; ++i){
		if (fairness[refPairs[i][0]]<fairness[refPairs[i][1]]) {
			var tmp = refPairs[i][0];
			refPairs[i][0] = refPairs[i][1];
			refPairs[i][1] = tmp;
		}
		fairness[refPairs[i][0]] = fairness[refPairs[i][0]]-1;
		fairness[refPairs[i][1]] = fairness[refPairs[i][1]]+1;
	}
	var pairs = new Array(refPairs.length);
	for (var i = 0; i < refPairs.length; ++i){
		pairs[i] = [teams[refPairs[i][0]], teams[refPairs[i][1]]];
	}
	return pairs;
}
//////////////
//////////////
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};
function schedule(games, numFields){
	if (numFields<1){
		return [];
	}
	var unplayedGames = games.slice(0);
	var rounds = new Array();// 0 -by- numFields -by- 2
	var numUnplayedGames = new Array(numTeams);
	for (var i = 0; i < games.length; ++i){
		for (var j = 0; j < games[i].length; ++j){
			numUnplayedGames[games[i][j]] = ++numUnplayedGames[games[i][j]] || 1;
		}
	}
	while (unplayedGames.length!=0){
		var availableGames = unplayedGames.slice(0);
		rounds.push(new Array(numFields));
		for (var i = 0; i < numFields; ++i){
			rounds[rounds.length-1][i] = new Array(2);
			rounds[rounds.length-1][i][0] = -1;
			rounds[rounds.length-1][i][1] = -1;
		}
		for (var i = 0; i < numFields; ++i){
			availableGames = sortByUrgency(availableGames, numUnplayedGames);
	
	
			if (availableGames.length==0)
				break;
			teamA = availableGames[0][0];
			teamB = availableGames[0][1];
			rounds[rounds.length-1][i][0] = availableGames[0][0];
			rounds[rounds.length-1][i][1] = availableGames[0][1];
			availableGames = removeTeams(availableGames, teamA, teamB);
			unplayedGames = removeGame(unplayedGames, teamA, teamB);
			numUnplayedGames[teamA] = numUnplayedGames[teamA]-1;
			numUnplayedGames[teamB] = numUnplayedGames[teamB]-1;      
		}
	}
	return rounds;
};
function sortByUrgency(availableGames, numUnplayedGames){
	for (var i = 0; i < availableGames.length; i++)
		availableGames[i].position = i; //initialize it with 0,1,2,3...

	availableGames.sort(function (a,b) {
		tmp =  numUnplayedGames[b[0]]
			 + numUnplayedGames[b[1]] 
			 - numUnplayedGames[a[0]]
			 - numUnplayedGames[a[1]];
		return (tmp) ? tmp : a.position - b.position;
		if (tmp!=0)
			return tmp;
		else
			return a.position - b.position; 
			 });
	return availableGames;
};
function removeTeams(availableGames, teamA, teamB){
	return availableGames.filter(function(a){
		if (a[0]==teamA || a[1]==teamA){
			return false;
		}else if(a[0]==teamB || a[1]==teamB){
			return false;
		}else
			return true;
		});
}
function removeGame(unplayedGames, teamA, teamB){
	return unplayedGames.filter(function(a){
		if ((a[0]==teamA && a[1]==teamB) ||
			(a[1]==teamB && a[0]==teamA))
			return false;
		else
			return true;});
};

//////////////
//////////////
function generateTournament(numTeams, numFields, numGroups){
	groupSizes = new Array(numGroups);
	for (var i = 0; i < groupSizes.length; ++i){
		groupSizes[i] = Math.floor(numTeams/numGroups) + (i<(numTeams%numGroups) ? 1:0);
	}
	groups = new Array(numGroups);
	groupNum = 0;
	for (var i = 0; i < groups.length; ++i){
		groups[i] = new Array(groupSizes);
		for (var j = 0; j < groupSizes[i]; ++j){
			groups[i][j] = groupNum++;
		}
	}
	games = new Array();

	for (var i = 0; i < groups.length; ++i){
		var tmp = pairTeams(groups[i]);
		games.push.apply(games, tmp);
	}

	var rounds = schedule(games, numFields);
	// rounds = numRounds -by- fields array
	var numRounds = rounds.length;
	var roundTeamField = new Array(numRounds);
	// Iterate over array rounds
	for (var i = 0; i < roundTeamField.length; ++i){
		roundTeamField[i] = new Array(numTeams);
		for (var j = 0; j < numTeams; ++j)
			roundTeamField[i][j] = -1;
		for (var j = 0; j < numFields; ++j){
			roundTeamField[i][rounds[i][j][0]] = j;
			roundTeamField[i][rounds[i][j][1]] = j;
		}
	}
	////////

	return {
		rounds : rounds,
		roundTeamField: roundTeamField,
	};
}