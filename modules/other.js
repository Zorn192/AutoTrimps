MODULES["other"] = {};
MODULES["other"].enableRoboTrimpSpam = true;  //set this to false to stop Spam of "Activated Robotrimp MagnetoShriek Ability"
var prestraid = false;
var failpraid = false;
var bwraided = false;
var failbwraid = false;
var perked = false;
var prestraidon = false;
var mapbought = false;
var failpvoidraid = false;
var prestvoid = false;
var mapboughtvoid = false;
var bwraidon = false;

//Activate Robo Trimp (will activate on the first zone after liquification)
function autoRoboTrimp() {
    //exit if the cooldown is active, or we havent unlocked robotrimp.
    if (game.global.roboTrimpCooldown > 0 || !game.global.roboTrimpLevel) return;
    var robotrimpzone = parseInt(getPageSetting('AutoRoboTrimp'));
    //exit if we have the setting set to 0
    if (robotrimpzone == 0) return;
    //activate the button when we are above the cutoff zone, and we are out of cooldown (and the button is inactive)
    if (game.global.world >= robotrimpzone && !game.global.useShriek){
        magnetoShriek();
        if (MODULES["other"].enableRoboTrimpSpam)
            debug("Activated Robotrimp MagnetoShriek Ability @ z" + game.global.world, "graphs", '*podcast');
    }
}

function isBelowThreshold(currentValue) {
  return currentValue != game.global.world;
}

//Version 3.6 Golden Upgrades
    //setting param : get the numerical value of the selected index of the dropdown box
function autoGoldenUpgradesAT(setting) {
    var num = getAvailableGoldenUpgrades();
    if (num == 0) return;       //if we have nothing to buy, exit.
    //Challenge^2 cant Get/Buy Helium, so adapt - do Derskagg mod.
    var challSQ = game.global.runningChallengeSquared;
    //Default: True = Always get 60% void by skipping the 12% upgrade then buying 14%/16%
    var goldStrat = getPageSetting('goldStrat');
    //Try to achieve 60% Void    
    if (setting == "Void" && goldStrat == "Max then Helium") {
      var nextVoidAmt = game.goldenUpgrades.Void.nextAmt().toFixed(2);
      if (nextVoidAmt == 0.12)   //skip the 6th void upgrade
        setting = "Helium";
      if (challSQ)  //always buy battle during max then helium mode.
        setting = "Battle";
    }
    //buy one upgrade per loop.
    var success = buyGoldenUpgrade(setting);

    var doDerskaggChallSQ = false;
    if (setting == ("Helium" || "Void") && challSQ)
        {doDerskaggChallSQ = true; setting = (challSQ) ? "Battle" : "Helium"}
    // DZUGAVILI MOD - SMART VOID GUs
    // Assumption: buyGoldenUpgrades is not an asynchronous operation and resolves completely in function execution.
    // Assumption: "Locking" game option is not set or does not prevent buying Golden Void
    var noBat = getPageSetting('goldNoBattle');  //true = no battle = buy helium
  //In 'Alternating' mode : instead of alternating between buying Helium and Battle, with this on it will only buy Helium.
    if (!success && setting == "Void" || doDerskaggChallSQ) {
        num = getAvailableGoldenUpgrades(); //recheck availables.
        if (num == 0) return;
        // DerSkagg Mod - Instead of Voids, For every Helium upgrade buy X-1 battle upgrades to maintain speed runs
        if (goldStrat == "Alternating") {
            var goldAlternating = getPageSetting('goldAlternating');
            setting = (game.global.goldenUpgrades%goldAlternating == 0 || noBat) ? "Helium" : "Battle";
        } else if (goldStrat == "Zone") {
            var goldZone = getPageSetting('goldZone');
            setting = (game.global.world <= goldZone || noBat) ? "Helium" : "Battle";
        } else if (goldStrat == "Max then Helium") {
            setting = (challSQ) ? "Battle" : "Helium";
        } else
            setting = (challSQ) ? "Battle" : "Helium";
        buyGoldenUpgrade(setting);
    }
    // END OF DerSkagg & DZUGAVILI MOD
//} catch(err) { debug("Error in autoGoldenUpgrades: " + err.message, "general"); }
}

//auto spend nature tokens
function autoNatureTokens() {
    var changed = false;
    for (var nature in game.empowerments) {
        var empowerment = game.empowerments[nature];
        var setting = getPageSetting('Auto' + nature);
        if (!setting || setting == 'Off') continue;

        //buy/convert once per nature per loop
        if (setting == 'Empowerment') {
            var cost = getNextNatureCost(nature);
            if (empowerment.tokens < cost)
                continue;
            empowerment.tokens -= cost;
            empowerment.level++;
            changed = true;
            debug('Upgraded Empowerment of ' + nature, 'nature');
        }
        else if (setting == 'Transfer') {
            if (empowerment.retainLevel >= 80)
                continue;
            var cost = getNextNatureCost(nature, true);
            if (empowerment.tokens < cost) continue;
            empowerment.tokens -= cost;
            empowerment.retainLevel++;
            changed = true;
            debug('Upgraded ' + nature + ' transfer rate', 'nature');
        }
        else if (setting == 'Convert to Both') {
            if (empowerment.tokens < 20) continue;
            for (var targetNature in game.empowerments) {
                if (targetNature == nature) continue;
                empowerment.tokens -= 10;
                var convertRate = (game.talents.nature.purchased) ? ((game.talents.nature2.purchased) ? 8 : 6) : 5;
                game.empowerments[targetNature].tokens += convertRate;
                changed = true;
                debug('Converted ' + nature + ' tokens to ' + targetNature, 'nature');
            }
        }
        else {
            if (empowerment.tokens < 10)
                continue;
            var match = setting.match(/Convert to (\w+)/);
            var targetNature = match ? match[1] : null;
            //sanity check
            if (!targetNature || targetNature === nature || !game.empowerments[targetNature]) continue;
            empowerment.tokens -= 10;
            var convertRate = (game.talents.nature.purchased) ? ((game.talents.nature2.purchased) ? 8 : 6) : 5;
            game.empowerments[targetNature].tokens += convertRate;
            changed = true;
            debug('Converted ' + nature + ' tokens to ' + targetNature, 'nature');
        }
    }
    if (changed)
        updateNatureInfoSpans();
}

//Check if currently in a Spire past IgnoreSpiresUntil
function isActiveSpireAT() {
    return game.global.spireActive && game.global.world >= getPageSetting('IgnoreSpiresUntil');
}

//Exits the Spire after completing the specified cell.
function exitSpireCell() {
    if(isActiveSpireAT() && game.global.lastClearedCell >= getPageSetting('ExitSpireCell')-1)
        endSpire();
}

function plusPres() {
        document.getElementById("biomeAdvMapsSelect").value = "Random";
        document.getElementById('advExtraLevelSelect').value = plusMapToRun(game.global.world);
        document.getElementById('advSpecialSelect').value = "p";
        document.getElementById("lootAdvMapsRange").value = 0;
        document.getElementById("difficultyAdvMapsRange").value = 9;
        document.getElementById("sizeAdvMapsRange").value = 9;
        document.getElementById('advPerfectCheckbox').checked = false;
	document.getElementById("mapLevelInput").value = game.global.world;
        updateMapCost();
        }
    
function plusMapToRun(zone) {   
    if (zone % 10 == 9)
        return 6;
    else if (zone % 10 <5)
        return 5 - zone % 10;
    else
        return 11 - zone % 10;
    }

function findLastBionic() {
         for (var i = game.global.mapsOwnedArray.length -1; i>=0; i--) {
              if (game.global.mapsOwnedArray[i].location === "Bionic") {
                  return game.global.mapsOwnedArray[i];
                  }
              }
         }

//Praiding

function Praiding() {
   // if (autoTrimpSettings.Praidingzone.value ) {
        //for (var x = 0; x < autoTrimpSettings.Praidingzone.value.length; x++) {

   	        if (autoTrimpSettings.Praidingzone.value.some(x => x == game.global.world) && !prestraid && !failpraid) {
	        prestraidon = true; 
                
                if (getPageSetting('AutoMaps') == 1 && !prestraid && !failpraid) {
                autoTrimpSettings["AutoMaps"].value = 0;
                }
                if (!game.global.preMapsActive && !game.global.mapsActive && !prestraid && !failpraid) { 
                    mapsClicked();
		    if (!game.global.preMapsActive) {
                        mapsClicked();
                    }
		    debug("Beginning Prestige Raiding...");
                }
                if (game.options.menu.repeatUntil.enabled!=2 && !prestraid && !failpraid) {
                    game.options.menu.repeatUntil.enabled = 2;
                }
                if (game.global.preMapsActive && !prestraid && !failpraid) { 
                plusPres();
                if ((updateMapCost(true) <= game.resources.fragments.owned)) {
                    buyMap();
                    failpraid = false;
		    mapbought = true;
                }
                    else if ((updateMapCost(true) > game.resources.fragments.owned)) {
                        if (getPageSetting('AutoMaps') == 0 && !prestraid) {
                            autoTrimpSettings["AutoMaps"].value = 1;
                            failpraid = true;
			    prestraidon = false;
			    mapbought = false;
                            debug("Failed to prestige raid. Looks like you can't afford to..");
                    }
                    return;

                }
	}
		if (mapbought == true) {
                selectMap(game.global.mapsOwnedArray[game.global.mapsOwnedArray.length-1].id);
		runMap();
                }
                if (!prestraid && !failpraid && !game.global.repeatMap) {
                    repeatClicked();
	            
                }
		prestraid = true;
		prestraidon = false;
		mapbought = false;
	        }
	     // }
	    
	 // }
    if (getPageSetting('AutoMaps') == 0 && game.global.preMapsActive && prestraid && !failpraid) {
             autoTrimpSettings["AutoMaps"].value = 1;
	     debug("Turning AutoMaps back on");
    	     }
    if (!autoTrimpSettings.Praidingzone.value.some(x => x == game.global.world) && prestraid && !failpraid) {
             prestraid = false;
	     prestraidon = false;
             mapbought = false;
             }	 
        }
 


//BWraiding
//BWrmn
//BWrmx
function BWraiding() {
    if (!prestraidon && game.global.world == getPageSetting('BWraidingz') && !bwraided && !failbwraid && getPageSetting('BWraid')) {
        if (getPageSetting('AutoMaps') == 1 && game.global.world >= getPageSetting('BWraidingz') && !bwraided && !failbwraid) {
            autoTrimpSettings["AutoMaps"].value = 0;
        }
        if (!game.global.preMapsActive && !game.global.mapsActive && game.global.world >= getPageSetting('BWraidingz') && !bwraided && !failbwraid) { 
            mapsClicked();
 	    if (!game.global.preMapsActive) {
                mapsClicked();
            }
        }
        if (game.options.menu.repeatUntil.enabled != 2 && game.global.world >= getPageSetting('BWraidingz') && !bwraided && !failbwraid) {
            game.options.menu.repeatUntil.enabled = 2;
        }
        if (game.global.world >= getPageSetting('BWraidingz') && game.global.preMapsActive && !bwraided && !failbwraid) {
        selectMap(findLastBionic().id);
        failbwraid = false;
	debug("Beginning BW Raiding...");
        }
        else if (game.global.world >= getPageSetting('BWraidingz') && game.global.preMapsActive && !bwraided && !failbwraid) {
                 if (getPageSetting('AutoMaps') == 0 && game.global.world >= getPageSetting('BWraidingz') && !bwraided) {
                     autoTrimpSettings["AutoMaps"].value = 1;
                     failbwraid = true;
                     debug("Failed to BW raid. Looks like you don't have a BW to raid...");
                     }
                     return;
        
        }
	if (findLastBionic().level <= getPageSetting('BWraidingmax') && !bwraided && !failbwraid && game.global.preMapsActive) {
        runMap();
	}
        if (!game.global.repeatMap && game.global.world >= getPageSetting('BWraidingz') && !bwraided && !failbwraid && getCurrentMapObject().level > getPageSetting('BWraidingz') && game.global.mapsActive) {
            repeatClicked();
	}
	else if (game.global.repeatMap && game.global.world >= getPageSetting('BWraidingz') && !bwraided && !failbwraid && getCurrentMapObject().level <= getPageSetting('BWraidingz') && game.global.mapsActive) {
                 repeatClicked();
	}
	if (findLastBionic().level > getPageSetting('BWraidingmax') && !bwraided && !failbwraid) {
            bwraided = true;
            failbwraid = false;
            debug("...Successfully BW raided!");
        if (getPageSetting('AutoMaps') == 0 && game.global.preMapsActive && game.global.world >= getPageSetting('BWraidingz') && bwraided && !failbwraid) {
            autoTrimpSettings["AutoMaps"].value = 1;
        }
    }
    }
	else if (getPageSetting('AutoMaps') == 0 && game.global.preMapsActive && bwraided && !failbwraid) {
             autoTrimpSettings["AutoMaps"].value = 1;
	     debug("Turning AutoMaps back on");
	}
	     if (bwraided == true && game.global.world !== getPageSetting('BWraidingz')) {
             bwraided = false;
             }
    
 }
//VoidPraid
//Prest before voids
    function Praidingvoid() {
	     var dailyvoidpraid = getPageSetting('DailyVoidMod');
	     var VMzone = getPageSetting('VoidMaps');
	     if ((game.global.challengeActive == "Daily") && (getPageSetting('AutoFinishDailyNew') != 999) && (getPageSetting('DailyVoidMod'))) {
                 (VMzone += dailyvoidpraid);
   	     }
   	     if (game.global.world == VMzone && getPageSetting('VoidPraid') == true && !prestvoid && !failpvoidraid) {
		if (getPageSetting('AutoMaps') == 1 && !prestvoid && !failpvoidraid) {
                autoTrimpSettings["AutoMaps"].value = 0;
                }
                if (!game.global.preMapsActive && !game.global.mapsActive && !prestvoid && !failpvoidraid) { 
                    mapsClicked();
		    if (!game.global.preMapsActive) {
                        mapsClicked();
                    }
		    debug("Beginning Prestige Raiding for Voids...");
                }
                if (game.options.menu.repeatUntil.enabled!=2 && !prestvoid && !failpvoidraid) {
                    game.options.menu.repeatUntil.enabled = 2;
                }
                if (game.global.preMapsActive && !prestvoid && !failpvoidraid) { 
                plusPres();
                if ((updateMapCost(true) <= game.resources.fragments.owned)) {
                    buyMap();
                    failpvoidraid = false;
		    mapboughtvoid = true;
                }
                    else if ((updateMapCost(true) > game.resources.fragments.owned)) {
                        if (getPageSetting('AutoMaps') == 0 && !prestvoid) {
                            autoTrimpSettings["AutoMaps"].value = 1;
                            failpvoidraid = true;
			    mapboughtvoid = false;
                            debug("Failed to prestige raid for Voids. Looks like you can't afford to..");
                    }
                    return;

                }
	}
		if (mapboughtvoid == true) {
                selectMap(game.global.mapsOwnedArray[game.global.mapsOwnedArray.length-1].id);
		runMap();
                }
                if (!prestvoid && !failpvoidraid && !game.global.repeatMap) {
                    repeatClicked();
		    debug("...Successfully prestiged!");
                }
	        prestvoid = true;
		mapboughtvoid = false;
	}
    if (getPageSetting('AutoMaps') == 0 && game.global.preMapsActive && prestvoid && !failpvoidraid) {
             autoTrimpSettings["AutoMaps"].value = 1;
	     debug("Turning AutoMaps back on");
    	     }
    if (prestvoid == true && game.global.world !== VMzone) {
             prestvoid = false;
             mapboughtvoid = false;
             }
			 
}
//AutoAllocate Looting II
function lootdump() {
if (game.global.world==getPageSetting('lootdumpz') && !perked && getPageSetting('AutoAllocatePerks')==2 && getPageSetting('lootdumpa') > 0 && getPageSetting('lootdumpz') > 0) {
	    viewPortalUpgrades();
	    game.global.lastCustomAmt = getPageSetting('lootdumpa');
	    numTab(5, true);
	    if (getPortalUpgradePrice("Looting_II")+game.resources.helium.totalSpentTemp <= game.resources.helium.respecMax) {
		buyPortalUpgrade('Looting_II');
		activateClicked();
		cancelPortal();
		debug('Bought ' + getPageSetting('lootdumpa') + ' Looting II');
	     }
	else {
	     perked = true;
	     cancelPortal();
	     debug("Done buying Looting II");
	     }
	}
else if (perked == true && game.global.world !== getPageSetting('lootdumpz')) {
         perked = false;
             }
}

function buyWeps() {
	preBuy();
	game.global.buyAmt = 1;
        if (game.equipment.Dagger.level < getPageSetting('CapEquip2') && canAffordBuilding('Dagger', null, null, true)) {
	    buyEquipment('Dagger', true, true);
    	}
	if (game.equipment.Mace.level < getPageSetting('CapEquip2') && canAffordBuilding('Mace', null, null, true)) {
	    buyEquipment('Mace', true, true);
    	}
        if (game.equipment.Polearm.level < getPageSetting('CapEquip2') && canAffordBuilding('Polearm', null, null, true)) {
	    buyEquipment('Polearm', true, true);
    	}
        if (game.equipment.Battleaxe.level < getPageSetting('CapEquip2') && canAffordBuilding('Battleaxe', null, null, true)) {
	    buyEquipment('Battleaxe', true, true);
    	}
        if (game.equipment.Greatsword.level < getPageSetting('CapEquip2') && canAffordBuilding('Greatsword', null, null, true)) {
	    buyEquipment('Greatsword', true, true);
    	}
        if (game.equipment.Arbalest.level < getPageSetting('CapEquip2') && canAffordBuilding('Arbalest', null, null, true)) {
	    buyEquipment('Arbalest', true, true);
    	}
	postBuy();
}

function buyArms() {
	preBuy();
	game.global.buyAmt = 10;
        if (game.equipment.Shield.level < getPageSetting('CapEquip2') && canAffordBuilding('Shield', null, null, true)) {
	    buyEquipment('Shield', true, true);
    	}
	if (game.equipment.Boots.level < getPageSetting('CapEquip2') && canAffordBuilding('Boots', null, null, true)) {
	    buyEquipment('Boots', true, true);
    	}
        if (game.equipment.Helmet.level < getPageSetting('CapEquip2') && canAffordBuilding('Helmet', null, null, true)) {
	    buyEquipment('Helmet', true, true);
    	}
        if (game.equipment.Pants.level < getPageSetting('CapEquip2') && canAffordBuilding('Pants', null, null, true)) {
	    buyEquipment('Pants', true, true);
    	}
        if (game.equipment.Shoulderguards.level < getPageSetting('CapEquip2') && canAffordBuilding('Shoulderguards', null, null, true)) {
	    buyEquipment('Shoulderguards', true, true);
    	}
        if (game.equipment.Breastplate.level < getPageSetting('CapEquip2') && canAffordBuilding('Breastplate', null, null, true)) {
	    buyEquipment('Breastplate', true, true);
    	}
 	if (game.equipment.Gambeson.level < getPageSetting('CapEquip2') && canAffordBuilding('Gambeson', null, null, true)) {
	    buyEquipment('Gambeson', true, true);
    	}
	postBuy();
}
