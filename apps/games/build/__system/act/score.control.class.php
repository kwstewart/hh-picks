<?php

class scoreControl extends baseController {
  
  public function get__before($args = array()) {
   
   	
    // Only update the scores when requested
    if(@$this->__data['update']) {
      
      // Grab the scores
      $scores = $this->getScoreFeed();
      
	    // Grab the week out of the first record
	    $week = $scores[0][12];
	    
	    // Check if the week is current	    
	    if($week != $this->xDB->getRecord("season","week")) $this->xDB->query("UPDATE season SET week = '".$week."'");
	
	    // For getting the date when inserting records
	    $daysOfWeek = array(
	    	"Tue" => 0,
	    	"Wed" => 1,
	    	"Thu" => 2,
	    	"Fri" => 3,
	    	"Sat" => 4,
	    	"Sun" => 5,
	    	"Mon" => 6
	    );
	    $currDate = 0;
	    
	    // Load the game controller
	    $gameControl = getApiController("games","game");
	    
	    // Loop through each score
	    foreach($scores as $feedInfo) {
	      
	      // Get a list of teams by their abbr
	      $abbrList = $this->xDB->query("SELECT id, abbr FROM teams","abbr");
	      
	      // Set variables for the away and home team ids
	      $awayTeamId = $abbrList[$feedInfo[4]]['id'];
	      $homeTeamId = $abbrList[$feedInfo[6]]['id'];
	      
	      
	      // Find the matching game and score in the database, if it doesn't exist add it
	      if(!$gameId = $this->xDB->getRecord("games","id","year = ".$feedInfo[13]." AND awayTeamId = ".$awayTeamId." AND homeTeamId = ".$homeTeamId)) {
	      	
	      	$insertInfo = array(
	      		"awayTeamId" => $awayTeamId,
	      		"homeTeamId" => $homeTeamId,
	      		"venueId" => $homeTeamId,
	      		"week" => $feedInfo[12],
	      		"year" => $feedInfo[13]
	      	);
	      	
	      	if(!$currDate) {
	      		// Get the current date of today at midnight
	      		$currDate = strtotime(date("m/d/y",time()));
	      		$currDayOfWeek = date("D",time());
	      	}
	      	
	      	$dayOffset = $daysOfWeek[$feedInfo[0]] - $daysOfWeek[$currDayOfWeek];
	      	
	      	// Number of seconds past midnight for the game (all times are PM)
	      	$secondsInDay = strtotime("Jan 1 1970 ".$feedInfo[1]. date("T",time())) + date("Z",time()) + 43200;
	      	
	      	// Parse date into timestamp
	      	$insertInfo['startTime'] = $currDate + $secondsInDay + ($dayOffset * 86400);
	      	
	      	$gameId = $gameControl->xDB->insertIntoTable("picks.games",$insertInfo);
	      
		      // Add to scores table
		      $insertInfo = array("gameId" => $gameId);
		      $this->xDB->insertIntoTable("picks.scores",$insertInfo);
	      }
	      
	      $scoreInfo = $this->xDB->getRecord("scores","*","gameId = ".$gameId);
	      
	      // If this score is already stored as a final, skip
	      if(substr(strtolower($scoreInfo['gameState']),0,5) == "final") continue;
	      
	      // Assemble the data to update the scores table
	      $updateArray = array(
	        "gameId" => $gameId,
	        "awayScore" => $feedInfo[5],
	        "homeScore" => $feedInfo[7],
	        "gameState" => $feedInfo[2],
	        "gameTime" => $feedInfo[3]
	      );
      
	      // Update the scores table
	      $this->xDB->updateTable("scores",$updateArray,"gameId");
	      
	      // If the game is in final and not in PREseason, update the winning team in the game table
	      if(substr(strtolower($feedInfo[2]),0,5) == "final" && substr($week,0,3) != "PRE") {
	       
	        // Calculate the winning team
	        if($updateArray['awayScore'] > $updateArray['homeScore']) { 
	          $winningTeamId = $awayTeamId; 
	          $losingTeamId = $homeTeamId; 
	        }
	        elseif($updateArray['awayScore'] < $updateArray['homeScore']) { 
	          $winningTeamId = $homeTeamId; 
	          $losingTeamId = $awayTeamId; 
	        }
	        elseif($updateArray['awayScore'] == $updateArray['homeScore']) $winningTeamId = 0;	     
	        
	        // Post the data
	        $gameControl->xDB->updateTable("games",array("id" => $gameId, "winningTeamId" => $winningTeamId)); 
	        
	        // Update records
	        // If it was a tie
	        if($winningTeamId == 0) $gameControl->xDB->query("UPDATE records SET draws = draws + 1 WHERE season = ".$feedInfo[13]." AND teamId IN (".$awayTeamId.",".$homeTeamId.")");
	        else {
	          // Update the winner
	          $gameControl->xDB->query("UPDATE records SET wins = wins + 1 WHERE season = ".$feedInfo[13]." AND teamId = ".$winningTeamId);
	          
	          // Update the loser
	          $gameControl->xDB->query("UPDATE records SET losses = losses + 1 WHERE season = ".$feedInfo[13]." AND teamId = ".$losingTeamId);
	          
	        }
	        
	      }
	    }
	  }
  }
  
  public function getScoreFeed() {
    
    // Get the scores from NFL
    $scoreFeed = doCurl("http://www.nfl.com/liveupdate/scorestrip/scorestrip.json");
    
    // Replace their empty array items with empty quotes (twice to get all occurances)
	  $scoreFeed = str_replace(",,",",\"\",",$scoreFeed);
	  $scoreFeed = str_replace(",,",",\"\",",$scoreFeed);
	  
	  $scores = json_decode($scoreFeed);
	  
	  return $scores->ss;
	  
	  /* Key of JSON response
	  // [0]  - Day part (Thu)
	  // [1]  - Time, in EST PM (8:25)
	  // [2]  - Game state (PreGame, 1, 2, 3, 4, OT, Final, Final OT)
	  // [3]  - Time left in Quarter
	  // [4]  - Away team abbr (NYG)
	  // [5]  - Away team score (10)
	  // [6]  - Home team abbr (NE) 
	  // [7]  - Home team score (13)
	  // [8]  - ???
	  // [9]  - ???
	  // [10] - Game id (55853)
	  // [11] - ???
	  // [12] - Season Week (REG2)
	  // [13] - Season Year (2013)
	  */ // END Key    
  }  
}

?>