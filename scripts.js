var participant_id  = getParameterByName( 'participantId' );
var participant_url = 'https://www.extra-life.org/index.cfm?fuseaction=donorDrive.participant&participantID=' + participant_id + '&format=json';
var participant_json;

var team_id;
var team_url;
var team_json;

var countdown_date = new Date( 'Nov 5, 2017 00:00:00' ).getTime();
var one_minute = 60000;
var one_second = 1000;

getTeamUrl();
getParticipantData();

setInterval( getTeamData, 		 one_minute );
setInterval( getParticipantData, one_minute );
setInterval( countdown,			 one_second );

/**
 * assigns the team_url based on a get request to the participant's data
 */
function getTeamUrl() {

	httpGet( participant_url, function( response ) { 

		team_id	  = response.teamID;
		team_url  = 'https://www.extra-life.org/index.cfm?fuseaction=donorDrive.team&teamID=' + team_id + '&format=json';
		getTeamData();
	});
}

/**
 * gets the team's data and calls a function to replace data on the page
 */
function getTeamData() {

	httpGet( team_url, function( response ) {

		team_json = response;
		replaceTeam();
	});
}

/**
 * gets the participant's data and calls a function to replace data on the page
 */
function getParticipantData() {

	httpGet( participant_url, function( response ) {

		participant_json = response;
		replaceParticipant();
	});
}

/**
 * get request to a given url that returns parsed JSON response when the request is ready
 * 
 * @param {*} url 
 * @param {*} callback 
 */
function httpGet( url, callback ) {

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {

		if( xhr.readyState == 4 && xhr.status == 200 ) {

			callback( JSON.parse( xhr.responseText ) );
		}
	}

	xhr.open( 'GET', url, true );
	xhr.send( null );
}

/**
 * replaces team content on the page with JSON received
 */
function replaceTeam() {

	var name  = document.getElementById( 'team_name'  );
	var goal  = document.getElementById( 'team_goal'  );
	var total = document.getElementById( 'team_total' );

	if( team_json != undefined ) {

		name.innerHTML  = team_json.name;
		goal.innerHTML  = '$' + team_json.fundraisingGoal;
		total.innerHTML = '$' + team_json.totalRaisedAmount;
	}
}

/**
 * replaces participant content on the page with JSON received
 */
function replaceParticipant() {

	var name  = document.getElementById( 'participant_name'  );
	var goal  = document.getElementById( 'participant_goal'  );
	var total = document.getElementById( 'participant_total' );

	if( participant_json != undefined ) {

		name.innerHTML  = participant_json.displayName;
		goal.innerHTML  = '$' + participant_json.fundraisingGoal;
		total.innerHTML = '$' + participant_json.totalRaisedAmount;
	}
}

/**
 * with a passed-in parameter from a query string, finds the value
 * 
 * @param {*} name 
 */
function getParameterByName( name ) {

    var url 	= window.location.href;
    var name 	= name.replace( /[\[\]]/g, "\\$&" );
    var regex   = new RegExp( "[?&]" + name + "(=([^&#]*)|&|#|$)" );
	var results = regex.exec( url );

    if( ! results )    return null;
    if( ! results[2] ) return '';

    return decodeURIComponent( results[2].replace( /\+/g, " " ) );
}

/**
 * counts down to countdown_date and replaces on page
 */
function countdown() {

	var now 			  = new Date().getTime();
	var distance 		  = countdown_date - now;
	var hours_in_day 	  = 24;
	var minutes_in_hour   = 60;
	var seconds_in_minute = 60;

	var days 	= Math.floor(   distance / ( 1000 * seconds_in_minute * minutes_in_hour * hours_in_day ) );
	var hours   = Math.floor( ( distance % ( 1000 * seconds_in_minute * minutes_in_hour * hours_in_day ) ) / ( 1000 * seconds_in_minute * minutes_in_hour ) );
	var minutes = Math.floor( ( distance % ( 1000 * seconds_in_minute * minutes_in_hour ) ) / ( 1000 * minutes_in_hour ) );
	var seconds = Math.floor( ( distance % ( 1000 * seconds_in_minute ) ) / 1000 );

	document.getElementById( 'time_left' ).innerHTML = days + ' days, ' + hours + ' hours, ' + minutes + ' minutes, and ' + seconds + ' seconds';

	if( distance < 0 ) {

		clearInterval( x );
		document.getElementById( 'time_left' ).innerHTML = 'EXPIRED';
	}
}