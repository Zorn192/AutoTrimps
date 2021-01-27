var critCC = 1;
var critDD = 1;
var trimpAA = 1;

//Helium

function getTrimpAttack() {
	var dmg = 6;
        var equipmentList = ["Dagger", "Mace", "Polearm", "Battleaxe", "Greatsword", "Arbalest"];
        for(var i = 0; i < equipmentList.length; i++){
            if(game.equipment[equipmentList[i]].locked !== 0) continue;
            var attackBonus = game.equipment[equipmentList[i]].attackCalculated;
            var level       = game.equipment[equipmentList[i]].level;
            dmg += attackBonus*level;
        }
	if (mutations.Magma.active()){
		dmg *= mutations.Magma.getTrimpDecay();
	}
	dmg *= game.resources.trimps.maxSoldiers;
	if (game.portal.Power.level > 0) {
		dmg += (dmg * game.portal.Power.level * game.portal.Power.modifier);
	}
    if (game.portal.Power_II.level > 0) {
		dmg *= (1 + (game.portal.Power_II.modifier * game.portal.Power_II.level));
	}
	if (game.global.formation !== 0){
		dmg *= (game.global.formation == 2) ? 4 : 0.5;
	}
	return dmg;
}

function calcOurHealth(stance) {
    var health = 50;

    if (game.resources.trimps.maxSoldiers > 0) {
        var equipmentList = ["Shield", "Boots", "Helmet", "Pants", "Shoulderguards", "Breastplate", "Gambeson"];
        for(var i = 0; i < equipmentList.length; i++){
            if(game.equipment[equipmentList[i]].locked !== 0) continue;
            var healthBonus = game.equipment[equipmentList[i]].healthCalculated;
            var level       = game.equipment[equipmentList[i]].level;
            health += healthBonus*level;
        }
    }
    health *= game.resources.trimps.maxSoldiers;
    if (game.goldenUpgrades.Battle.currentBonus > 0) {
        health *= game.goldenUpgrades.Battle.currentBonus + 1;
    }
    if (game.portal.Toughness.level > 0) {
        health *= ((game.portal.Toughness.level * game.portal.Toughness.modifier) + 1);
    }
    if (game.portal.Toughness_II.level > 0) {
        health *= ((game.portal.Toughness_II.level * game.portal.Toughness_II.modifier) + 1);
    }
    if (game.portal.Resilience.level > 0) {
        health *= (Math.pow(game.portal.Resilience.modifier + 1, game.portal.Resilience.level));
    }
    var geneticist = game.jobs.Geneticist;
    if (geneticist.owned > 0) {
        health *= (Math.pow(1.01, game.global.lastLowGen));
    }
    if (stance && game.global.formation > 0) {
        var formStrength = 0.5;
        if (game.global.formation == 1) formStrength = 4;
        health *= formStrength;
    }
    if (game.global.challengeActive == "Life") {
        health *= game.challenges.Life.getHealthMult();
    } else if (game.global.challengeActive == "Balance") {
        health *= game.challenges.Balance.getHealthMult();
    } else if (typeof game.global.dailyChallenge.pressure !== 'undefined') {
        health *= (dailyModifiers.pressure.getMult(game.global.dailyChallenge.pressure.strength, game.global.dailyChallenge.pressure.stacks));
    }
    if (mutations.Magma.active()) {
        var mult = mutations.Magma.getTrimpDecay();
        var lvls = game.global.world - mutations.Magma.start() + 1;
        health *= mult;
    }
    var heirloomBonus = calcHeirloomBonus("Shield", "trimpHealth", 0, true);
    if (heirloomBonus > 0) {
        health *= ((heirloomBonus / 100) + 1);
    }
    if (game.global.radioStacks > 0) {
        health *= (1 - (game.global.radioStacks * 0.1));
    }
    if (game.global.totalSquaredReward > 0) {
        health *= (1 + (game.global.totalSquaredReward / 100));
    }
    if (game.jobs.Amalgamator.owned > 0) {
        health *= game.jobs.Amalgamator.getHealthMult();
    }
    if (game.talents.voidPower.purchased && game.global.voidBuff) {
        var amt = (game.talents.voidPower2.purchased) ? ((game.talents.voidPower3.purchased) ? 65 : 35) : 15;
        health *= (1 + (amt / 100));
    }
    return health;
}

function highDamageShield() {
	if (game.global.challengeActive != "Daily" && game.global.ShieldEquipped.name == getPageSetting('highdmg')) {
		critCC = getPlayerCritChance();
		critDD = getPlayerCritDamageMult();
		trimpAA = (calcHeirloomBonus("Shield", "trimpAttack", 1, true)/100);
	}
	if (game.global.challengeActive == "Daily" && game.global.ShieldEquipped.name == getPageSetting('dhighdmg')) {
		critCC = getPlayerCritChance();
		critDD = getPlayerCritDamageMult();
		trimpAA = (calcHeirloomBonus("Shield", "trimpAttack", 1, true)/100);
	}
}

function getCritMulti(high) {

    var critChance = getPlayerCritChance();
    var CritD = getPlayerCritDamageMult();
	
    if (
	high && 
	(getPageSetting('AutoStance') == 3 && getPageSetting('highdmg') != undefined && game.global.challengeActive != "Daily") || 
	(getPageSetting('use3daily') == true && getPageSetting('dhighdmg') != undefined && game.global.challengeActive == "Daily")
       ) {
	 highDamageShield();
	 critChance = critCC;
	 CritD = critDD;
       }

    var lowTierMulti = getMegaCritDamageMult(Math.floor(critChance));
    var highTierMulti = getMegaCritDamageMult(Math.ceil(critChance));
    var highTierChance = critChance - Math.floor(critChance)

    return ((1 - highTierChance) * lowTierMulti + highTierChance * highTierMulti) * CritD
}

function calcOurBlock(stance) {
    var block = 0;
    var gym = game.buildings.Gym;
    if (gym.owned > 0) {
        var gymStrength = gym.owned * gym.increase.by;
        block += gymStrength;
    }
    var shield = game.equipment.Shield;
    if (shield.blockNow && shield.level > 0) {
        var shieldStrength = shield.level * shield.blockCalculated;
        block += shieldStrength;
    }
    var trainer = game.jobs.Trainer;
    if (trainer.owned > 0) {
        var trainerStrength = trainer.owned * (trainer.modifier / 100);
        trainerStrength = calcHeirloomBonus("Shield", "trainerEfficiency", trainerStrength);
        block *= (trainerStrength + 1);
    }
    block *= game.resources.trimps.maxSoldiers;
    if (stance && game.global.formation == 3) {
        block *= 4;
    }
    var heirloomBonus = calcHeirloomBonus("Shield", "trimpBlock", 0, true);
    if (heirloomBonus > 0) {
        block *= ((heirloomBonus / 100) + 1);
    }
    if (game.global.radioStacks > 0) {
        block *= (1 - (game.global.radioStacks * 0.1));
    }
    return block;
}

function calcOurDmg(minMaxAvg, incStance, incFlucts) {
  var number = getTrimpAttack();
  var fluctuation = .2;
	var maxFluct = -1;
	var minFluct = -1;
	if (game.jobs.Amalgamator.owned > 0){
		number *= game.jobs.Amalgamator.getDamageMult();
	}
	if (game.challenges.Electricity.stacks > 0) {
		number *= (1 - (game.challenges.Electricity.stacks * 0.1));
	}
	if (getPageSetting('45stacks') == false && game.global.antiStacks > 0) {
		number *= ((game.global.antiStacks * game.portal.Anticipation.level * game.portal.Anticipation.modifier) + 1);
	}
	if (getPageSetting('45stacks') == true && game.global.antiStacks > 0) {
		number *= ((45 * game.portal.Anticipation.level * game.portal.Anticipation.modifier) + 1);
	}
	if (game.global.mapBonus > 0){
	    var mapBonus = game.global.mapBonus;
            if (game.talents.mapBattery.purchased && mapBonus == 10) mapBonus *= 2;
		number *= ((mapBonus * .2) + 1);
	}
	if (game.global.achievementBonus > 0){
		number *= (1 + (game.global.achievementBonus / 100));
	}
	if (game.global.challengeActive == "Discipline"){
		fluctuation = .995;
	}
	else if (game.portal.Range.level > 0){
		minFluct = fluctuation - (.02 * game.portal.Range.level);
	}
	if (game.global.challengeActive == "Decay"){
		number *= 5;
		number *= Math.pow(0.995, game.challenges.Decay.stacks);
	}
	if (game.global.roboTrimpLevel > 0){
		number *= ((0.2 * game.global.roboTrimpLevel) + 1);
	}
	if (game.global.challengeActive == "Lead" && ((game.global.world % 2) == 1)){
		number *= 1.5;
	}
	if (game.goldenUpgrades.Battle.currentBonus > 0) {
		number *= game.goldenUpgrades.Battle.currentBonus + 1;
	}
	if (game.talents.voidPower.purchased && game.global.voidBuff) {
		var vpAmt = (game.talents.voidPower2.purchased) ? ((game.talents.voidPower3.purchased) ? 65 : 35) : 15;
		number *= ((vpAmt / 100) + 1);
	}
	if (game.global.totalSquaredReward > 0) {
		number *= ((game.global.totalSquaredReward / 100) + 1);
	}
	if (getPageSetting('fullice') == true && getEmpowerment() == "Ice") {
		number *= (Fluffy.isRewardActive('naturesWrath') ? 3 : 2);
	}
	if (getPageSetting('fullice') == false && getEmpowerment() == "Ice") {
		number *= (game.empowerments.Ice.getDamageModifier()+1);
	}
	if (getEmpowerment() == "Poison" && getPageSetting('addpoison') == true) {
		number *= (1 + game.empowerments.Poison.getModifier());
		number *= 4;
	}
	if (game.talents.magmamancer.purchased) {
		number *= game.jobs.Magmamancer.getBonusPercent();
	}
	if (game.talents.stillRowing2.purchased) {
		number *= ((game.global.spireRows * 0.06) + 1);
	}
	if (game.global.voidBuff && game.talents.voidMastery.purchased){
		number *= 5;
	}
	if (game.talents.healthStrength.purchased && mutations.Healthy.active()) {
		number *= ((0.15 * mutations.Healthy.cellCount()) + 1);
	}
	if (game.talents.herbalist.purchased) {
	        number *= game.talents.herbalist.getBonus();
	}
	if (game.global.sugarRush > 0) {
		number *= sugarRush.getAttackStrength();
	}
	if (playerSpireTraps.Strength.owned) {
			var strBonus = playerSpireTraps.Strength.getWorldBonus();
			number *= (1 + (strBonus / 100));
	}
	if (Fluffy.isRewardActive('voidSiphon') && game.stats.totalVoidMaps.value) {
			number *= (1 + (game.stats.totalVoidMaps.value * 0.05));
	}
	if (game.global.challengeActive == "Life") {
		number *= game.challenges.Life.getHealthMult();
	}
	if (game.singleRunBonuses.sharpTrimps.owned){
		number *= 1.5;
	}
	if (game.global.uberNature == "Poison") {
		number *= 3;
	}
	if (incStance && game.talents.scry.purchased && game.global.formation == 4 && (mutations.Healthy.active() || mutations.Corruption.active())){
		number *= 2;
	}
	if (game.global.challengeActive == "Daily" && game.talents.daily.purchased){
		number *= 1.5;
	}
    	if (game.global.challengeActive == 'Lead' && game.global.world % 2 == 1 && game.global.world != 179) {
        	number /= 1.5;
    	}
	if (game.global.challengeActive == "Daily"){
		if (typeof game.global.dailyChallenge.minDamage !== 'undefined'){
			if (minFluct == -1) minFluct = fluctuation;
			minFluct += dailyModifiers.minDamage.getMult(game.global.dailyChallenge.minDamage.strength);
		}
		if (typeof game.global.dailyChallenge.maxDamage !== 'undefined'){
			if (maxFluct == -1) maxFluct = fluctuation;
			maxFluct += dailyModifiers.maxDamage.getMult(game.global.dailyChallenge.maxDamage.strength);
		}
		if (typeof game.global.dailyChallenge.oddTrimpNerf !== 'undefined' && ((game.global.world % 2) == 1)){
				number *= dailyModifiers.oddTrimpNerf.getMult(game.global.dailyChallenge.oddTrimpNerf.strength);
		}
		if (typeof game.global.dailyChallenge.evenTrimpBuff !== 'undefined' && ((game.global.world % 2) == 0)){
				number *= dailyModifiers.evenTrimpBuff.getMult(game.global.dailyChallenge.evenTrimpBuff.strength);
		}
		if (typeof game.global.dailyChallenge.rampage !== 'undefined'){
			number *= dailyModifiers.rampage.getMult(game.global.dailyChallenge.rampage.strength, game.global.dailyChallenge.rampage.stacks);
		}
	}
	number = calcHeirloomBonus("Shield", "trimpAttack", number)
	if (Fluffy.isActive()){
		number *= Fluffy.getDamageModifier();
	}
	if (getHeirloomBonus("Shield", "gammaBurst") > 0 && (calcOurHealth() / (calcBadGuyDmg(null, getEnemyMaxAttack(game.global.world, 50, 'Snimp', 1.0))) >= 5)) {
	    	number *= ((getHeirloomBonus("Shield", "gammaBurst") / 100) + 1) / 5;
	}


  if (!incStance && game.global.formation != 0) {
    number /= (game.global.formation == 2) ? 4 : 0.5;
  }

  var min = number;
  var max = number;
  var avg = number;

  min *= (getCritMulti(false)*0.8);
  avg *= getCritMulti(false);
  max *= (getCritMulti(false)*1.2);

  if (incFlucts) {
    if (minFluct > 1) minFluct = 1;
    if (maxFluct == -1) maxFluct = fluctuation;
    if (minFluct == -1) minFluct = fluctuation;

    min *= (1 - minFluct);
    max *= (1 + maxFluct);
    avg *= 1 + (maxFluct - minFluct)/2;
  }

  if (minMaxAvg == "min") return min;
  else if (minMaxAvg == "max") return max;
  else if (minMaxAvg == "avg") return avg;
}

function calcDailyAttackMod(number) {
    if (game.global.challengeActive == "Daily"){
        if (typeof game.global.dailyChallenge.badStrength !== 'undefined'){
            number *= dailyModifiers.badStrength.getMult(game.global.dailyChallenge.badStrength.strength);
        }
        if (typeof game.global.dailyChallenge.badMapStrength !== 'undefined' && game.global.mapsActive){
            number *= dailyModifiers.badMapStrength.getMult(game.global.dailyChallenge.badMapStrength.strength);
        }
        if (typeof game.global.dailyChallenge.bloodthirst !== 'undefined'){
            number *= dailyModifiers.bloodthirst.getMult(game.global.dailyChallenge.bloodthirst.strength, game.global.dailyChallenge.bloodthirst.stacks);
        }
    }
    return number;
}

function calcSpire(cell, name, what) {
	var exitCell = cell;
	if (game.global.challengeActive != "Daily" && isActiveSpireAT() && getPageSetting('ExitSpireCell') > 0 && getPageSetting('ExitSpireCell') <= 100)
		exitCell = (getPageSetting('ExitSpireCell') - 1);
	if (game.global.challengeActive == "Daily" && disActiveSpireAT() && getPageSetting('dExitSpireCell') > 0 && getPageSetting('dExitSpireCell') <= 100)
		exitCell = (getPageSetting('dExitSpireCell') - 1);
	var enemy = cell == 99 ? (exitCell == 99 ? game.global.gridArray[99].name : "Snimp") : name;
	var base = (what == "attack") ? game.global.getEnemyAttack(exitCell, enemy, false) : (calcEnemyBaseHealth(game.global.world, exitCell, enemy) * 2);
	var mod = (what == "attack") ? 1.17 : 1.14;
    	var spireNum = Math.floor((game.global.world-100)/100);
	if (spireNum > 1){
		var modRaiser = 0;
		modRaiser += ((spireNum - 1) / 100);
		if (what == "attack") modRaiser *= 8;
		if (what == "health") modRaiser *= 2;
		mod += modRaiser;
	}
	base *= Math.pow(mod, exitCell);
	base *= game.badGuys[enemy][what];
	return base;
}

function calcBadGuyDmg(enemy,attack,daily,maxormin,disableFlucts) {
    var number;
    if (enemy)
        number = enemy.attack;
    else
        number = attack;
    var fluctuation = .2;
    var maxFluct = -1;
    var minFluct = -1;

    if (!enemy && game.global.challengeActive){
        if (game.global.challengeActive == "Coordinate"){
            number *= getBadCoordLevel();
        }
        else if (game.global.challengeActive == "Meditate"){
            number *= 1.5;
        }
        else if (enemy && game.global.challengeActive == "Nom" && typeof enemy.nomStacks !== 'undefined'){
            number *= Math.pow(1.25, enemy.nomStacks);
        }
        else if (game.global.challengeActive == "Watch") {
            number *= 1.25;
        }
        else if (game.global.challengeActive == "Lead"){
            number *= (1 + (game.challenges.Lead.stacks * 0.04));
        }
        else if (game.global.challengeActive == "Scientist" && getScientistLevel() == 5) {
            number *= 10;
        }
        else if (game.global.challengeActive == "Corrupted"){
            number *= 3;
	}
        else if (game.global.challengeActive == "Domination"){
            	if (game.global.lastClearedCell == 98) {
		    number *= 2.5;
	    	}
		else number *= 0.1;
	}
        else if (game.global.challengeActive == "Obliterated" || game.global.challengeActive == "Eradicated"){
			var oblitMult = (game.global.challengeActive == "Eradicated") ? game.challenges.Eradicated.scaleModifier : 1e12;
			var zoneModifier = Math.floor(game.global.world / game.challenges[game.global.challengeActive].zoneScaleFreq);
			oblitMult *= Math.pow(game.challenges[game.global.challengeActive].zoneScaling, zoneModifier);
			number *= oblitMult;
	}
        if (daily)
            number = calcDailyAttackMod(number);
    }
    if (!enemy && game.global.usingShriek) {
        number *= game.mapUnlocks.roboTrimp.getShriekValue();
    }

    if (!disableFlucts) {
        if (minFluct > 1) minFluct = 1;
        if (maxFluct == -1) maxFluct = fluctuation;
        if (minFluct == -1) minFluct = fluctuation;
        var min = Math.floor(number * (1 - minFluct));
        var max = Math.ceil(number + (number * maxFluct));
        return maxormin ? max : min;
    }
    else
        return number;
}

function calcEnemyBaseHealth(zone, level, name) {
    var health = 0;
    health += 130 * Math.sqrt(zone) * Math.pow(3.265, zone / 2);
    health -= 110;
    if (zone == 1 || zone == 2 && level < 10) {
        health *= 0.6;
        health = (health * 0.25) + ((health * 0.72) * (level / 100));
    }
    else if (zone < 60)
        health = (health * 0.4) + ((health * 0.4) * (level / 110));
    else {
        health = (health * 0.5) + ((health * 0.8) * (level / 100));
        health *= Math.pow(1.1, zone - 59);
    }
    if (zone < 60) {
	health *= 0.75;
        health *= game.badGuys[name].health;
    }
    return health;
}

function calcEnemyHealth(world, map) {
    world = !world ? game.global.world : world;
    var health = calcEnemyBaseHealth(world, 50, "Snimp");
    var corrupt = mutations.Corruption.active();
    var healthy = mutations.Healthy.active();
    if (map) {
	corrupt = false;
	healthy = false;
	if (game.global.universe == 1) {
	    health *= 0.5;
	}
    }
    if (corrupt && !healthy) {
        var cptnum = getCorruptedCellsNum();
        var cpthlth = getCorruptScale("health");
        var cptpct = cptnum / 100;
        var hlthprop = cptpct * cpthlth;
        if (hlthprop >= 1)
            health *= hlthprop;
    }
    if (healthy) {
    var scales = Math.floor((game.global.world - 150) / 6);
    health *= 14*Math.pow(1.05, scales);
    health *= 1.15;
    }
    if (game.global.challengeActive == "Obliterated" || game.global.challengeActive == "Eradicated") {
        var oblitMult = (game.global.challengeActive == "Eradicated") ? game.challenges.Eradicated.scaleModifier : 1e12;
        var zoneModifier = Math.floor(game.global.world / game.challenges[game.global.challengeActive].zoneScaleFreq);
        oblitMult *= Math.pow(game.challenges[game.global.challengeActive].zoneScaling, zoneModifier);
        health *= oblitMult;
    }
    if (game.global.challengeActive == "Coordinate"){
	health *= getBadCoordLevel();
    }
    if (game.global.challengeActive == "Toxicity") {
        health *= 2;
    }
    if (game.global.challengeActive == 'Lead') {
        health *= (1 + (game.challenges.Lead.stacks * 0.04));
    }
    if (game.global.challengeActive == 'Balance') {
        health *= 2;
    }
    if (game.global.challengeActive == 'Meditate') {
        health *= 2;
    }
    if (game.global.challengeActive == 'Life') {
        health *= 10;
    }
    if (game.global.challengeActive == "Domination") {
        if (game.global.lastClearedCell == 98) {
            health *= 7.5;
        } else health *= 0.1;
    }
    if (game.global.spireActive) {
	health = calcSpire(99, game.global.gridArray[99].name, 'health');
    }
    return health;
}

function calcHDratio(map) {
    var ratio = 0;
    var ourBaseDamage = calcOurDmg("avg", false, true);

    //Shield
    highDamageShield();
    if (getPageSetting('AutoStance') == 3 && getPageSetting('highdmg') != undefined && game.global.challengeActive != "Daily" && game.global.ShieldEquipped.name != getPageSetting('highdmg')) {
	ourBaseDamage /= getCritMulti(false);
        ourBaseDamage *= trimpAA;
	ourBaseDamage *= getCritMulti(true);
    }
    if (getPageSetting('use3daily') == true && getPageSetting('dhighdmg') != undefined && game.global.challengeActive == "Daily" && game.global.ShieldEquipped.name != getPageSetting('dhighdmg')) {
	ourBaseDamage /= getCritMulti(false);
        ourBaseDamage *= trimpAA;
	ourBaseDamage *= getCritMulti(true);
    }
    if (!map || map < 1) {
        ratio = calcEnemyHealth() / ourBaseDamage;
    }
    if (map || map >= 1)
	ratio = calcEnemyHealth(map, true) / ourBaseDamage;
    return ratio;
}

function calcCurrentStance() {
    if (game.global.uberNature == "Wind" && getEmpowerment() == "Wind" && !game.global.mapsActive &&
	(
	 (
	  (game.global.challengeActive != "Daily" && calcHDratio() < getPageSetting('WindStackingMinHD')) ||
	  (game.global.challengeActive == "Daily" && calcHDratio() < getPageSetting('dWindStackingMinHD'))
	 ) &&
	 (
	  (game.global.challengeActive != "Daily" && game.global.world >= getPageSetting('WindStackingMin')) ||
          (game.global.challengeActive == "Daily" && game.global.world >= getPageSetting('dWindStackingMin')))
         ) ||
	 (game.global.uberNature == "Wind" && getEmpowerment() == "Wind" && !game.global.mapsActive && checkIfLiquidZone() && getPageSetting('liqstack') == true)
	)
	{
	return 15;
    }
    else {

    //Base Calc
    var ehealth = 1;
    if (game.global.fighting) {
        ehealth = (getCurrentEnemy().maxHealth - getCurrentEnemy().health);
    }
    var attacklow = calcOurDmg("max", false, true);
    var attackhigh = calcOurDmg("max", false, true);

    //Heirloom Calc
    highDamageShield();
    if (getPageSetting('AutoStance') == 3 && getPageSetting('highdmg') != undefined && game.global.challengeActive != "Daily" && game.global.ShieldEquipped.name != getPageSetting('highdmg')) {
        attackhigh *= trimpAA;
	attackhigh *= getCritMulti(true);
    }
    if (getPageSetting('use3daily') == true && getPageSetting('dhighdmg') != undefined && game.global.challengeActive == "Daily" && game.global.ShieldEquipped.name != getPageSetting('dhighdmg')) {
        attackhigh *= trimpAA;
	attackhigh *= getCritMulti(true);
    }

    //Heirloom Switch
    if (ehealth > 0) {
        var hitslow = (ehealth / attacklow);
        var hitshigh = (ehealth / attackhigh);
        var stacks = 190;
        var usehigh = false;
	var stacksleft = 1;

        if (game.global.challengeActive != "Daily" && getPageSetting('WindStackingMax') > 0) {
            stacks = getPageSetting('WindStackingMax');
	}
        if (game.global.challengeActive == "Daily" && getPageSetting('dWindStackingMax') > 0) {
            stacks = getPageSetting('dWindStackingMax');
	}
	if (game.global.uberNature == "Wind") {
	    stacks += 100;
	}
	if (getEmpowerment() == "Wind") {
	    stacksleft = (stacks - game.empowerments.Wind.currentDebuffPower);
	}

	//Use High
        if (
            (getEmpowerment() != "Wind") ||
            (game.empowerments.Wind.currentDebuffPower >= stacks) ||
            (hitshigh >= stacksleft) ||
            (game.global.mapsActive) ||
            (game.global.challengeActive != "Daily" && game.global.world < getPageSetting('WindStackingMin')) ||
            (game.global.challengeActive == "Daily" && game.global.world < getPageSetting('dWindStackingMin'))
        ) {
            usehigh = true;
	}
        if (
                (getPageSetting('wsmax') > 0 && game.global.world >= getPageSetting('wsmax') && !game.global.mapsActive && getEmpowerment() == "Wind" && game.global.challengeActive != "Daily" && getPageSetting('wsmaxhd') > 0 && calcHDratio() < getPageSetting('wsmaxhd')) ||
                (getPageSetting('dwsmax') > 0 && game.global.world >= getPageSetting('dwsmax') && !game.global.mapsActive && getEmpowerment() == "Wind" && game.global.challengeActive == "Daily" && getPageSetting('dwsmaxhd') > 0 && calcHDratio() < getPageSetting('dwsmaxhd'))
        ) {
	    usehigh = false;
	}

	//Low
        if (!usehigh) {
            if (
                (game.empowerments.Wind.currentDebuffPower >= stacks) ||
                ((hitslow * 4) > stacksleft)
            ) {
                return 2;
	    }
            else if ((hitslow) > stacksleft) {
                return 0;
	    }
            else {
                return 1;
	    }
	
	//High
        } else if (usehigh) {
	    if (
                (getEmpowerment() != "Wind") ||
                (game.empowerments.Wind.currentDebuffPower >= stacks) ||
                ((hitshigh * 4) > stacksleft) ||
                (game.global.mapsActive) ||
                (game.global.challengeActive != "Daily" && game.global.world < getPageSetting('WindStackingMin')) ||
                (game.global.challengeActive == "Daily" && game.global.world < getPageSetting('dWindStackingMin'))
            ) {
                return 12;
	    }
            else if ((hitshigh) > stacksleft) {
                return 10;
	    }
            else {
                return 11;
	    }
        }
    }
    }
}

//Radon

function RgetCritMulti() {

    var critChance = getPlayerCritChance();
    var CritD = getPlayerCritDamageMult();

    var lowTierMulti = getMegaCritDamageMult(Math.floor(critChance));
    var highTierMulti = getMegaCritDamageMult(Math.ceil(critChance));
    var highTierChance = critChance - Math.floor(critChance)

    return ((1 - highTierChance) * lowTierMulti + highTierChance * highTierMulti) * CritD
}

function RcalcOurDmg(minMaxAvg, equality) {

    // Base + equipment
    var number = 6;
    var equipmentList = ["Dagger", "Mace", "Polearm", "Battleaxe", "Greatsword", "Arbalest"];
    for(var i = 0; i < equipmentList.length; i++){
        if(game.equipment[equipmentList[i]].locked !== 0) continue;
        var attackBonus = game.equipment[equipmentList[i]].attackCalculated;
        var level       = game.equipment[equipmentList[i]].level;
        number += attackBonus*level;
    }

    // Soldiers
    number *= game.resources.trimps.maxSoldiers;
    
    // Smithies
    number *= Math.pow(1.25, game.buildings.Smithy.owned);
    
    // Achievement bonus
    number *= 1 + (game.global.achievementBonus / 100);
    
    // Power
    number += (number * game.portal.Power.radLevel * game.portal.Power.modifier);

    // Map Bonus
    var mapBonus = game.global.mapBonus;
    if (game.talents.mapBattery.purchased && mapBonus == 10) mapBonus *= 2;
    number *= 1 + (mapBonus * .2);
    
    // Tenacity
    number *= game.portal.Tenacity.getMult();
    
    // Hunger
    number *= game.portal.Hunger.getMult();
	
    // Ob
    number *= game.portal.Observation.getMult();

    // Robotrimp
    number *= 1 + (0.2 * game.global.roboTrimpLevel);
    
    // Mayhem Completions
    number *= game.challenges.Mayhem.getTrimpMult();
    
    // Heirloom
    number *= 1 + calcHeirloomBonus('Shield','trimpAttack',1,true) / 100;
    
    // Frenzy perk
    //number *= (game.portal.Frenzy.frenzyTime) ? game.portal.Frenzy.getAttackMult() : 1;
	
    // Golden Upgrade
    number *= 1 + game.goldenUpgrades.Battle.currentBonus;
    
    // Herbalist Mastery
    if (game.talents.herbalist.purchased) {
        number *= game.talents.herbalist.getBonus();
    }
	
    // Challenge 2 or 3 reward
    number *= 1 + (game.global.totalSquaredReward / 100);
	  
    // Fluffy Modifier
    number *= Fluffy.getDamageModifier();
    
    // Pspire Strength Towers
    number *= 1 + (playerSpireTraps.Strength.getWorldBonus() / 100);
    
    // Sharp Trimps
    if (game.singleRunBonuses.sharpTrimps.owned){
	number *= 1.5;
    }
    
    // Sugar rush event bonus
    if (game.global.sugarRush) {
	number *= sugarRush.getAttackStrength();
    }
    
    // Challenges
    if (game.global.challengeActive == "Melt") {number *= 5 * Math.pow(0.99, game.challenges.Melt.stacks);}
    if (game.global.challengeActive == "Unbalance") {number *= game.challenges.Unbalance.getAttackMult();}
    if (game.global.challengeActive == "Quagmire") {number *= game.challenges.Quagmire.getExhaustMult();}
    if (game.global.challengeActive == "Revenge") {number *= game.challenges.Revenge.getMult();}
    if (game.global.challengeActive == "Quest") {number *= game.challenges.Quest.getAttackMult();}
    if (game.global.challengeActive == "Archaeology") {number *= game.challenges.Archaeology.getStatMult("attack");}
    if (game.global.challengeActive == "Berserk") {number *= game.challenges.Berserk.getAttackMult();}
    if (game.challenges.Nurture.boostsActive() == true) {number *= game.challenges.Nurture.getStatBoost();}   

    // Dailies
    var minDailyMod = 1;
    var maxDailyMod = 1;
    if (game.global.challengeActive == "Daily") {
        // Legs for Days mastery
        if (game.talents.daily.purchased){
            number *= 1.5;
        }
        
        // Min damage reduced (additive)
	if (typeof game.global.dailyChallenge.minDamage !== 'undefined') {
	    minDailyMod -= dailyModifiers.minDamage.getMult(game.global.dailyChallenge.minDamage.strength);
        }
        // Max damage increased (additive)
	if (typeof game.global.dailyChallenge.maxDamage !== 'undefined') {
	    maxDailyMod += dailyModifiers.maxDamage.getMult(game.global.dailyChallenge.maxDamage.strength);
        }
        
        // Minus attack on odd zones
	if (typeof game.global.dailyChallenge.oddTrimpNerf !== 'undefined' && ((game.global.world % 2) == 1)) {
	    number *= dailyModifiers.oddTrimpNerf.getMult(game.global.dailyChallenge.oddTrimpNerf.strength);
        }
        // Bonus attack on even zones
	if (typeof game.global.dailyChallenge.evenTrimpBuff !== 'undefined' && ((game.global.world % 2) == 0)) {
	    number *= dailyModifiers.evenTrimpBuff.getMult(game.global.dailyChallenge.evenTrimpBuff.strength);
        }
        // Rampage Daily mod
	if (typeof game.global.dailyChallenge.rampage !== 'undefined') {
	    number *= dailyModifiers.rampage.getMult(game.global.dailyChallenge.rampage.strength, game.global.dailyChallenge.rampage.stacks);
	}
    }

    // Equality
    if (getPageSetting('Rcalcmaxequality') == 1 && !equality) {
        number *= Math.pow(game.portal.Equality.modifier, game.portal.Equality.scalingCount);
    } else if (getPageSetting('Rcalcmaxequality') == 0 && !equality) {
        number *= game.portal.Equality.getMult();
    } else {
        number *= 1;
    }

    // Gamma Burst
    if (getHeirloomBonus("Shield", "gammaBurst") > 0 && (RcalcOurHealth() / (RcalcBadGuyDmg(null, RgetEnemyMaxAttack(game.global.world, 50, 'Snimp', 1.0))) >= 5)) {
        number *= 1 + (getHeirloomBonus("Shield", "gammaBurst") / 100) / 5;
    }

    // Average out crit damage
    number *= RgetCritMulti();

    switch (minMaxAvg) {
        case 'min':
            return number * (game.portal.Range.radLevel * 0.02 + 0.8) * minDailyMod;
        case 'max':
            return number * 1.2 * maxDailyMod;
        case 'avg':
            return number;
    }

    return number;
}

function RcalcOurHealth() {
	
    //Health
	
    var health = 50;
    if (game.resources.trimps.maxSoldiers > 0) {
        var equipmentList = ["Shield", "Boots", "Helmet", "Pants", "Shoulderguards", "Breastplate", "Gambeson"];
        for(var i = 0; i < equipmentList.length; i++){
            if(game.equipment[equipmentList[i]].locked !== 0) continue;
            var healthBonus = game.equipment[equipmentList[i]].healthCalculated;
            var level       = game.equipment[equipmentList[i]].level;
            health += healthBonus*level;
        }
    }
    health *= game.resources.trimps.maxSoldiers;
    if (game.buildings.Smithy.owned > 0) {
		health *= Math.pow(1.25, game.buildings.Smithy.owned);
    }
    if (game.portal.Toughness.radLevel > 0) {
        health *= ((game.portal.Toughness.radLevel * game.portal.Toughness.modifier) + 1);
    }
    if (game.portal.Resilience.radLevel > 0) {
        health *= (Math.pow(game.portal.Resilience.modifier + 1, game.portal.Resilience.radLevel));
    }
    if (game.portal.Observation.radLevel > 0) {
    	health *= game.portal.Observation.getMult();
    }
    if (Fluffy.isRewardActive("healthy")) {
		health *= 1.5;
    }
    health = calcHeirloomBonus("Shield", "trimpHealth", health);
    if (game.goldenUpgrades.Battle.currentBonus > 0) {
        health *= game.goldenUpgrades.Battle.currentBonus + 1;
    }
    if (game.global.totalSquaredReward > 0) {
        health *= (1 + (game.global.totalSquaredReward / 100));
    }
    if (game.global.challengeActive == "Revenge" && game.challenges.Revenge.stacks > 0) {
	health *= game.challenges.Revenge.getMult();
    }
    if (game.global.challengeActive == "Wither" && game.challenges.Wither.trimpStacks > 0) {
	health *= game.challenges.Wither.getTrimpHealthMult();
    }
    if (game.global.mayhemCompletions > 0) {
	health *= game.challenges.Mayhem.getTrimpMult();
    }
    if (game.global.challengeActive == "Insanity") {
	health *= game.challenges.Insanity.getHealthMult();
    }
    if (game.global.challengeActive == "Berserk") {
	if (game.challenges.Berserk.frenzyStacks > 0) {
	    health *= 0.5;
	}
	if (game.challenges.Berserk.frenzyStacks <= 0) {
	    health *= game.challenges.Berserk.getHealthMult(true);
	}
    }
    if (game.challenges.Nurture.boostsActive() == true) {
	health *= game.challenges.Nurture.getStatBoost();
    }
    if (typeof game.global.dailyChallenge.pressure !== 'undefined') {
        health *= (dailyModifiers.pressure.getMult(game.global.dailyChallenge.pressure.strength, game.global.dailyChallenge.pressure.stacks));
    }
	
    //Pris
	
    health *= (getEnergyShieldMult() + 1);
	
    return health;
}

function RcalcDailyAttackMod(number) {
    if (game.global.challengeActive == "Daily"){
        if (typeof game.global.dailyChallenge.badStrength !== 'undefined'){
            number *= dailyModifiers.badStrength.getMult(game.global.dailyChallenge.badStrength.strength);
        }
        if (typeof game.global.dailyChallenge.badMapStrength !== 'undefined' && game.global.mapsActive){
            number *= dailyModifiers.badMapStrength.getMult(game.global.dailyChallenge.badMapStrength.strength);
        }
        if (typeof game.global.dailyChallenge.bloodthirst !== 'undefined'){
            number *= dailyModifiers.bloodthirst.getMult(game.global.dailyChallenge.bloodthirst.strength, game.global.dailyChallenge.bloodthirst.stacks);
        }
    }
    return number;
}

function RcalcBadGuyDmg(enemy, attack, equality) {
    var number;
    if (enemy)
        number = enemy.attack;
    else
        number = attack;
    if (getPageSetting('Rexterminateon') == true && getPageSetting('Rexterminatecalc') == true) {
	number = RgetEnemyMaxAttack(game.global.world, 90, 'Mantimp', 1.0)
    }
    if (game.portal.Equality.radLevel > 0 && getPageSetting('Rcalcmaxequality') == 0 && !equality) {
        number *= game.portal.Equality.getMult();
    }
    else if (game.portal.Equality.radLevel > 0 && getPageSetting('Rcalcmaxequality') >= 1 && game.portal.Equality.scalingCount > 0 && !equality) {
        number *= Math.pow(game.portal.Equality.modifier, game.portal.Equality.scalingCount);
    }
    if (game.global.challengeActive == "Daily") {
        number = RcalcDailyAttackMod(number);
    }
    if (game.global.challengeActive == "Unbalance") {
	number *= 1.5;
    }
    if (game.global.challengeActive == "Wither" && game.challenges.Wither.enemyStacks > 0) {
	number *= game.challenges.Wither.getEnemyAttackMult();
    }
    if (game.global.challengeActive == "Archaeology") {
	number *= game.challenges.Archaeology.getStatMult("enemyAttack");
    }
    if (game.global.challengeActive == "Mayhem") {
	number *= game.challenges.Mayhem.getEnemyMult();
	number *= game.challenges.Mayhem.getBossMult();
    }
    if (game.global.challengeActive == "Storm") {
	number *= game.challenges.Storm.getAttackMult();
    }
    if (game.global.challengeActive == "Berserk") {
	number *= 1.5;
    }
    if (game.global.challengeActive == "Exterminate") {
	number *= game.challenges.Exterminate.getSwarmMult();
    }
    if (game.global.challengeActive == "Nurture") {
	number *= 2;
	if (game.buildings.Laboratory.owned > 0) {
	    number *= game.buildings.Laboratory.getEnemyMult();
	}
    }
    if (!enemy && game.global.usingShriek) {
        number *= game.mapUnlocks.roboTrimp.getShriekValue();
    }
    return number;
}

function RcalcEnemyBaseHealth(world, level, name) {
			var amt = 0;
			var healthBase = (game.global.universe == 2) ? 10e7 : 130;
			amt += healthBase * Math.sqrt(world) * Math.pow(3.265, world / 2);
			amt -= 110;
			if (world == 1 || world == 2 && level < 10){
				amt *= 0.6;
			amt = (amt * 0.25) + ((amt * 0.72) * (level / 100));
			}
			else if (world < 60)
				amt = (amt * 0.4) + ((amt * 0.4) * (level / 110));
			else{
				amt = (amt * 0.5) + ((amt * 0.8) * (level / 100));
				amt *= Math.pow(1.1, world - 59);
			}
			if (world < 60) amt *= 0.75;
			if (world > 5 && game.global.mapsActive) amt *= 1.1;
		        amt *= game.badGuys[name].health;
			if (game.global.universe == 2) {
				var part1 = (world > 60) ? 60 : world;
				var part2 = (world - 60);
				if (part2 < 0) part2 = 0;
				amt *= Math.pow(1.4, part1);
				amt *= Math.pow(1.32, part2);
			}
			return Math.floor(amt);
}

function RcalcEnemyHealth(world) {
    if (world == false) world = game.global.world;
    var health = RcalcEnemyBaseHealth(world, 50, "Snimp");
    if (getPageSetting('Rexterminateon') == true && getPageSetting('Rexterminatecalc') == true) {
	health = RcalcEnemyBaseHealth(world, 90, "Beetlimp");
    }
    if (game.global.challengeActive == "Unbalance") {
	health *= 2;
    }
    if (game.global.challengeActive == "Quest"){
	health *= game.challenges.Quest.getHealthMult();
    }
    if (game.global.challengeActive == "Revenge" && game.global.world % 2 == 0) {
	health *= 10;
    }
    if (game.global.challengeActive == "Archaeology") {
	
    }
    if (game.global.challengeActive == "Mayhem") {
	health *= game.challenges.Mayhem.getEnemyMult();
	health *= game.challenges.Mayhem.getBossMult();
    }
    if (game.global.challengeActive == "Storm") {
	health *= game.challenges.Storm.getHealthMult();
    }
    if (game.global.challengeActive == "Berserk") {
	health *= 1.5;
    }
    if (game.global.challengeActive == "Exterminate") {
	health *= game.challenges.Exterminate.getSwarmMult();
    }
    if (game.global.challengeActive == "Nurture") {
	health *= 2;
	if (game.buildings.Laboratory.owned > 0) {
	    health *= game.buildings.Laboratory.getEnemyMult();
	}
    }
    return health;
}

function RcalcEnemyHealthMod(world, cell, name) {
    if (world == false) world = game.global.world;
    var health = RcalcEnemyBaseHealth(world, cell, name);
    if (game.global.challengeActive == "Unbalance") {
	health *= 2;
    }
    if (game.global.challengeActive == "Quest"){
	health *= game.challenges.Quest.getHealthMult();
    }
    if (game.global.challengeActive == "Revenge" && game.global.world % 2 == 0) {
	health *= 10;
    }
    if (game.global.challengeActive == "Archaeology") {
	
    }
    if (game.global.challengeActive == "Mayhem") {
	health *= game.challenges.Mayhem.getEnemyMult();
	health *= game.challenges.Mayhem.getBossMult();
    }
    if (game.global.challengeActive == "Storm") {
	health *= game.challenges.Storm.getHealthMult();
    }
    if (game.global.challengeActive == "Berserk") {
	health *= 1.5;
    }
    if (game.global.challengeActive == "Exterminate") {
	health *= game.challenges.Exterminate.getSwarmMult();
    }
    if (game.global.challengeActive == "Nurture") {
	number *= 2;
	if (game.buildings.Laboratory.owned > 0) {
	    number *= game.buildings.Laboratory.getEnemyMult();
	}
    }
    return health;
}

function RcalcHDratio() {
    var ratio = 0;
    var ourBaseDamage = RcalcOurDmg("avg", false, true);

    ratio = RcalcEnemyHealth(game.global.world) / ourBaseDamage;
    return ratio;
}

function getTotalHealthMod() {
    var healthMulti = 1;
 
    // Smithies
    healthMulti *= game.buildings.Smithy.getMult();
 
    // Perks
    healthMulti *= 1 + (game.portal.Toughness.radLevel * game.portal.Toughness.modifier);
    healthMulti *= Math.pow(1 + game.portal.Resilience.modifier, game.portal.Resilience.radLevel);
    healthMulti *= game.portal.Observation.getMult();
 
    // Scruffy's +50% health bonus
    healthMulti *= (Fluffy.isRewardActive("healthy") ? 1.5 : 1);
 
    // Heirloom Health bonus
    healthMulti *= 1 + calcHeirloomBonus('Shield', 'trimpHealth',1, true) / 100;
 
    // Golden Upgrades
    healthMulti *= 1 + game.goldenUpgrades.Battle.currentBonus;
 
    // C2/3
    healthMulti *= 1 + game.global.totalSquaredReward / 100;
 
    // Challenge Multis
    healthMulti *= (game.global.challengeActive == 'Revenge') ? game.challenges.Revenge.getMult() : 1;
    healthMulti *= (game.global.challengeActive == 'Wither') ? game.challenges.Wither.getTrimpHealthMult() : 1;
    healthMulti *= (game.global.challengeActive == 'Insanity') ? game.challenges.Insanity.getHealthMult() : 1;
    healthMulti *= (game.global.challengeActive == 'Berserk') ?
        (game.challenges.Berserk.frenzyStacks > 0) ? 0.5 : game.challenges.Berserk.getHealthMult(true)
        : 1;
    healthMulti *= (game.challenges.Nurture.boostsActive() == true) ? game.challenges.Nurture.getStatBoost() : 1;

    // Daily mod
    healthMulti *= (typeof game.global.dailyChallenge.pressure !== 'undefined') ? dailyModifiers.pressure.getMult(game.global.dailyChallenge.pressure.strength, game.global.dailyChallenge.pressure.stacks) : 1;
 
    // Mayhem
    healthMulti *= game.challenges.Mayhem.getTrimpMult();
 
    // Prismatic
    healthMulti *= 1 + getEnergyShieldMult();
 
    return healthMulti;
}

function stormdynamicHD() {
    var stormzone = 0;
    var stormHD = 0;
    var stormmult = 0;
    var stormHDzone = 0;
    var stormHDmult = 1;
    if (getPageSetting('Rstormon') == true && game.global.world > 5 && (game.global.challengeActive == "Storm" && getPageSetting('Rstormzone') > 0 && getPageSetting('RstormHD') > 0 && getPageSetting('Rstormmult') > 0)) {
        stormzone = getPageSetting('Rstormzone');
        stormHD = getPageSetting('RstormHD');
        stormmult = getPageSetting('Rstormmult');
	stormHDzone = (game.global.world - stormzone);
	stormHDmult = (stormHDzone == 0) ? stormHD : Math.pow(stormmult, stormHDzone) * stormHD;
    }
    return stormHDmult;
}
