<?php

class gameControl extends baseController {
  

	function buildGrid($games, $uid = 0) {
		$html = ""; 
		$cnt = 0;
		$pickCnt = 0;
		if(!$uid) {
			$uid = $this->me->id;
			$header = true;
		}
		foreach($games as $gameInfo) {
			$cnt++;
			$gameClass = "";
			//print_r($gameInfo);
			if(@$GLOBALS['users'][$uid]['picks'][$gameInfo['gid']]['pid']) {
				$tid = @$GLOBALS['users'][$uid]['picks'][$gameInfo['gid']]['tid'];
				$pickCnt++;
			}
			else $tid = false;
			
			if(time() < $gameInfo['time']) { 
				$state = "pre";
				if($tid) $gameClass = ""; 
				else $gameClass = "picks-grid-game-open";
			}
			elseif($gameInfo['wtid'] == null) { 
				$state = "in"; 
				if(@$GLOBALS['scores'][$gameInfo['gid']]['atp'] == @$GLOBALS['scores'][$gameInfo['gid']]['htp']) 
					$gameClass = "picks-grid-game-locked"; 
				elseif($GLOBALS['scores'][$gameInfo['gid']]['atp'] > $GLOBALS['scores'][$gameInfo['gid']]['htp'] && $tid == $gameInfo['atid'])
					$gameClass = "picks-grid-game-winning"; 
				elseif($GLOBALS['scores'][$gameInfo['gid']]['htp'] > $GLOBALS['scores'][$gameInfo['gid']]['atp'] && $tid == $gameInfo['htid'])
					$gameClass = "picks-grid-game-winning"; 
				else $gameClass = "picks-grid-game-losing"; 
			}
			elseif($gameInfo['wtid'] == @$GLOBALS['users'][$uid]['picks'][$gameInfo['gid']]['tid']) { $state = "post"; $gameClass = "picks-grid-game-correct"; }
			else { $state = "post"; $gameClass = "picks-grid-game-wrong"; }
			
			$html .= "<div class='gid-".$gameInfo['gid']." picks-".(@$header ? "header" : "grid")."-game $gameClass' state='$state' title='".intval(@$GLOBALS['scores'][$gameInfo['gid']]['atp'])." - ".intval(@$GLOBALS['scores'][$gameInfo['gid']]['htp'])."'>";
			$html .= "<div class='picks-grid-game-overlay'>";
			if(!@$header) $html .= "<div class='picks-grid-matchup'>".$gameInfo['away_abbr']." @ ".$gameInfo['home_abbr']."</div>";
			$html .= "<img tid='".@$tid."' class='picks-grid-game-helmet' src='/nfl/static/images/helmets/".(@$tid ? $tid : 0)."_small.png'>";			
			$html .= "</div>";
			$html .= "</div>";
			
			if($cnt == count($games)) $html .= "<div class='picks-grid-game-score'>".@$GLOBALS['users'][$uid]['picks'][$gameInfo['gid']]['score']."</div>";
		}
		if(!$pickCnt && !@$header) return false;
		return $html;
	}
  
}

?>