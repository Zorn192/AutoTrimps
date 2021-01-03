MODULES["buildings"] = {};
MODULES["buildings"].storageMainCutoff = 0.85;
MODULES["buildings"].storageLowlvlCutoff1 = 0.7;
MODULES["buildings"].storageLowlvlCutoff2 = 0.5;

//Helium

var housingList = ['Hut', 'House', 'Mansion', 'Hotel', 'Resort', 'Gateway', 'Collector', 'Warpstation'];

function safeBuyBuilding(building) {
    if (isBuildingInQueue(building))
        return false;
    if (game.buildings[building].locked)
        return false;
    var oldBuy = preBuy2();

  if (game.talents.deciBuild.purchased) {
        game.global.buyAmt = 10;
    if (!canAffordBuilding(building)) {
        game.global.buyAmt = 2;
	if (!canAffordBuilding(building))
            game.global.buyAmt = 1;
     }
  }
  else if (bwRewardUnlocked("DoubleBuild")) {
        game.global.buyAmt = 2;
  	if (!canAffordBuilding(building)) 
        game.global.buyAmt = 1;
  }        
  else game.global.buyAmt = 1;

  if (!canAffordBuilding(building)) {
      postBuy2(oldBuy);
      return false;
  }

    game.global.firing = false;
	
    if (building == 'Gym' && getPageSetting('GymWall')) {
        game.global.buyAmt = 1;
    }
    if (building == 'Warpstation' && !game.buildings[building].locked && canAffordBuilding(building)) {
        if (game.buildings.Warpstation.owned < 2) {
            game.global.buyAmt = 'Max';
            game.global.maxSplit = 1;
        } else {
            game.global.buyAmt = 1;
        }
        buyBuilding(building, true, true);
        debug('Building ' + game.global.buyAmt + ' ' + building + 's', "buildings", '*rocket');
        postBuy2(oldBuy);
        return;
    }
    debug('Building ' + building, "buildings", '*hammer2');
    if (!game.buildings[building].locked && canAffordBuilding(building)) {
	buyBuilding(building, true, true);
    }
    postBuy2(oldBuy);
    return true;
}

function buyFoodEfficientHousing() {
    var foodHousing = ["Hut", "House", "Mansion", "Hotel", "Resort"];
    var unlockedHousing = [];
    for (var house in foodHousing) {
        if (game.buildings[foodHousing[house]].locked === 0) {
            unlockedHousing.push(foodHousing[house]);
        }
    }
    var buildorder = [];
    for (var house in unlockedHousing) {
        var building = game.buildings[unlockedHousing[house]];
        var cost = getBuildingItemPrice(building, "food", false, 1);
        var ratio = cost / building.increase.by;
        buildorder.push({
            'name': unlockedHousing[house],
            'ratio': ratio
        });
        document.getElementById(unlockedHousing[house]).style.border = "1px solid #FFFFFF";
    }
    buildorder.sort(function (a, b) {
        return a.ratio - b.ratio;
    });
    var bestfoodBuilding = null;
    var bb = buildorder[0];
    var max = getPageSetting('Max' + bb.name);
    if (game.buildings[bb.name].owned < max || max == -1) {
        bestfoodBuilding = bb.name;
    }
    if (bestfoodBuilding) {
        document.getElementById(bestfoodBuilding).style.border = "1px solid #00CC01";
        safeBuyBuilding(bestfoodBuilding);
    }
}

function buyGemEfficientHousing() {
    var gemHousing = ["Hotel", "Resort", "Gateway", "Collector", "Warpstation"];
    var unlockedHousing = [];
    for (var house in gemHousing) {
        if (game.buildings[gemHousing[house]].locked === 0) {
            unlockedHousing.push(gemHousing[house]);
        }
    }
    var obj = {};
    for (var house in unlockedHousing) {
        var building = game.buildings[unlockedHousing[house]];
        var cost = getBuildingItemPrice(building, "gems", false, 1);
        var ratio = cost / building.increase.by;
	if (unlockedHousing[house] == "Gateway" && !canAffordBuilding('Gateway'))
            continue;
        obj[unlockedHousing[house]] = ratio;
        document.getElementById(unlockedHousing[house]).style.border = "1px solid #FFFFFF";
    }
    var keysSorted = Object.keys(obj).sort(function (a, b) {
            return obj[a] - obj[b];
        });
    bestBuilding = null;
    for (var best in keysSorted) {
        var max = getPageSetting('Max' + keysSorted[best]);
        if (max === false) max = -1;
        if (game.buildings[keysSorted[best]].owned < max || max == -1) {
            bestBuilding = keysSorted[best];
            document.getElementById(bestBuilding).style.border = "1px solid #00CC00";
            var skipWarp = false;
            if (getPageSetting('WarpstationCap') && bestBuilding == "Warpstation") {
                if (game.buildings.Warpstation.owned >= (Math.floor(game.upgrades.Gigastation.done * getPageSetting('DeltaGigastation')) + getPageSetting('FirstGigastation')))
                    skipWarp = true;
            }
            var warpwallpct = getPageSetting('WarpstationWall3');
            if (warpwallpct > 1 && bestBuilding == "Warpstation") {
                if (getBuildingItemPrice(game.buildings.Warpstation, "metal", false, 1) * Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level) > (game.resources.metal.owned / warpwallpct))
                    skipWarp = true;
            }
            if (skipWarp)
                bestBuilding = null;
            var getcoord = getPageSetting('WarpstationCoordBuy');
            if (getcoord && skipWarp) {
                var toTip = game.buildings.Warpstation;
                if (canAffordBuilding("Warpstation")) {
                    var howMany = calculateMaxAfford(game.buildings["Warpstation"], true);
                    var needCoord = game.upgrades.Coordination.allowed - game.upgrades.Coordination.done > 0;
                    var coordReplace = (game.portal.Coordinated.level) ? (25 * Math.pow(game.portal.Coordinated.modifier, game.portal.Coordinated.level)).toFixed(3) : 25;
                    if (!canAffordCoordinationTrimps()){
                        var nextCount = (game.portal.Coordinated.level) ? game.portal.Coordinated.currentSend : game.resources.trimps.maxSoldiers;
                        var amtToGo = ((nextCount * 3) - game.resources.trimps.realMax());
                        var increase = toTip.increase.by;
                        if (game.portal.Carpentry.level && toTip.increase.what == "trimps.max") increase *= Math.pow(1.1, game.portal.Carpentry.level);
                        if (game.portal.Carpentry_II.level && toTip.increase.what == "trimps.max") increase *= (1 + (game.portal.Carpentry_II.modifier * game.portal.Carpentry_II.level));
                        if (amtToGo < increase*howMany)
                            bestBuilding = "Warpstation";
                    }
                }
            }
            break;
        }
    }
    if (bestBuilding) {
        safeBuyBuilding(bestBuilding);
    }
}

function buyBuildings() {
    if ((game.jobs.Miner.locked && game.global.challengeActive != 'Metal') || (game.jobs.Scientist.locked && game.global.challengeActive != "Scientist")) return;
    var customVars = MODULES["buildings"];
    var oldBuy = preBuy2();
    var hidebuild = (getPageSetting('BuyBuildingsNew')===0 && getPageSetting('hidebuildings')==true);
    game.global.buyAmt = 1;
    if (!hidebuild) {
    buyFoodEfficientHousing();
    buyGemEfficientHousing();
  	}
    if (!hidebuild && getPageSetting('MaxWormhole') > 0 && game.buildings.Wormhole.owned < getPageSetting('MaxWormhole') && !game.buildings.Wormhole.locked) {
        safeBuyBuilding('Wormhole');
    }

    //Gyms:
    if (!game.buildings.Gym.locked && (getPageSetting('MaxGym') > game.buildings.Gym.owned || getPageSetting('MaxGym') == -1)) {
        var skipGym = false;
        if (getPageSetting('DynamicGyms')) {
            if (!game.global.preMapsActive && calcOurBlock(true) > calcBadGuyDmg(getCurrentEnemy(), null, true,true))
                skipGym = true;
        }
        var gymwallpct = getPageSetting('GymWall');
        if (gymwallpct > 1) {
            if (getBuildingItemPrice(game.buildings.Gym, "wood", false, 1) * Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level) > (game.resources.wood.owned / gymwallpct))
                skipGym = true;
        }
        //ShieldBlock cost Effectiveness:
        if (game.equipment['Shield'].blockNow) {
            var gymEff = evaluateEquipmentEfficiency('Gym');
            var shieldEff = evaluateEquipmentEfficiency('Shield');
            if ((gymEff.Wall) || (gymEff.Factor <= shieldEff.Factor && !gymEff.Wall))
                skipGym = true;
        }
        if (needGymystic) skipGym = true;
        if (!skipGym)
            safeBuyBuilding('Gym');
       	    needGymystic = false;
    }
    //Tributes:
    if (!game.buildings.Tribute.locked && !hidebuild &&(getPageSetting('MaxTribute') > game.buildings.Tribute.owned || getPageSetting('MaxTribute') == -1)) {
        safeBuyBuilding('Tribute');
    }
    //Nurseries
    if (game.buildings.Nursery.locked == 0 && (!hidebuild &&( game.global.world >= getPageSetting('NoNurseriesUntil') || getPageSetting('NoNurseriesUntil') < 1) && (getPageSetting('MaxNursery') > game.buildings.Nursery.owned || getPageSetting('MaxNursery') == -1)) || (game.global.challengeActive != "Daily" && getPageSetting('PreSpireNurseries') > game.buildings.Nursery.owned && isActiveSpireAT()) || (game.global.challengeActive == "Daily" && getPageSetting('dPreSpireNurseries') > game.buildings.Nursery.owned && disActiveSpireAT())) {
	safeBuyBuilding('Nursery');
    }

    postBuy2(oldBuy);
}

function buyStorage() {
    var customVars = MODULES["buildings"];
    var packMod = 1 + game.portal.Packrat.level * game.portal.Packrat.modifier;
    var Bs = {
        'Barn': 'food',
        'Shed': 'wood',
        'Forge': 'metal'
    };
    for (var B in Bs) {
        var jest = 0;
        var owned = game.resources[Bs[B]].owned;
        var max = game.resources[Bs[B]].max * packMod;
        max = calcHeirloomBonus("Shield", "storageSize", max);
        if (game.global.mapsActive && game.unlocks.imps.Jestimp) {
            jest = simpleSeconds(Bs[B], 45);
            jest = scaleToCurrentMap(jest);
        }
        if ((game.global.world == 1 && owned > max * customVars.storageLowlvlCutoff1) ||
            (game.global.world >= 2 && game.global.world < 10 && owned > max * customVars.storageLowlvlCutoff2) ||
            (owned + jest > max * customVars.storageMainCutoff)) {
            if (canAffordBuilding(B) && game.triggers[B].done) {
                safeBuyBuilding(B);
            }
        }
    }
}

//Radon

var RhousingList = ['Hut', 'House', 'Mansion', 'Hotel', 'Resort', 'Gateway', 'Collector'];

function RsafeBuyBuilding(building) {
    if (isBuildingInQueue(building))
        return false;
    if (game.buildings[building].locked)
        return false;
    var oldBuy = preBuy2();

  if (game.talents.deciBuild.purchased) {
        game.global.buyAmt = 10;
    if (!canAffordBuilding(building)) {
        game.global.buyAmt = 2;
	if (!canAffordBuilding(building))
            game.global.buyAmt = 1;
     }
  }
  else if (bwRewardUnlocked("DoubleBuild")) {
        game.global.buyAmt = 2;
  	if (!canAffordBuilding(building)) 
        game.global.buyAmt = 1;
  }        
  else game.global.buyAmt = 1;

  if (!canAffordBuilding(building)) {
      postBuy2(oldBuy);
      return false;
  }

    game.global.firing = false;
	
    debug('Building ' + building, "buildings", '*hammer2');
    if (!game.buildings[building].locked && canAffordBuilding(building)) {
	    buyBuilding(building, true, true);
    }
    postBuy2(oldBuy);
    return true;
}

function RbuyFoodEfficientHousing() {
    var foodHousing = ["Hut", "House", "Mansion", "Hotel", "Resort"];
    var unlockedHousing = [];
    for (var house in foodHousing) {
        if (game.buildings[foodHousing[house]].locked === 0) {
            unlockedHousing.push(foodHousing[house]);
        }
    }
    var buildorder = [];
    if (unlockedHousing.length > 0) {
    for (var house in unlockedHousing) {
        var building = game.buildings[unlockedHousing[house]];
        var cost = getBuildingItemPrice(building, "food", false, 1);
        var ratio = cost / building.increase.by;
        buildorder.push({
            'name': unlockedHousing[house],
            'ratio': ratio
        });
        document.getElementById(unlockedHousing[house]).style.border = "1px solid #FFFFFF";
    }
    buildorder.sort(function (a, b) {
        return a.ratio - b.ratio;
    });
    var bestfoodBuilding = null;
    var bb = buildorder[0];
    var max = getPageSetting('RMax' + bb.name);
    if (game.buildings[bb.name].owned < max || max == -1) {
        bestfoodBuilding = bb.name;
    }
    if (smithylogic(bestfoodBuilding, 'wood', false) && bestfoodBuilding) {
        document.getElementById(bestfoodBuilding).style.border = "1px solid #00CC01";
        RsafeBuyBuilding(bestfoodBuilding);
    }
    }
}

function RbuyGemEfficientHousing() {
    var gemHousing = ["Mansion", "Hotel", "Resort", "Gateway", "Collector"];
    var unlockedHousing = [];
    for (var house in gemHousing) {
        if (game.buildings[gemHousing[house]].locked === 0) {
            unlockedHousing.push(gemHousing[house]);
        }
    }
    var obj = {};
    for (var house in unlockedHousing) {
        var building = game.buildings[unlockedHousing[house]];
        var cost = getBuildingItemPrice(building, "gems", false, 1);
        var ratio = cost / building.increase.by;
        obj[unlockedHousing[house]] = ratio;
        document.getElementById(unlockedHousing[house]).style.border = "1px solid #FFFFFF";
    }
    var keysSorted = Object.keys(obj).sort(function (a, b) {
            return obj[a] - obj[b];
        });
    bestBuilding = null;
    for (var best in keysSorted) {
        var max = getPageSetting('RMax' + keysSorted[best]);
        if (max === false) max = -1;
        if (game.buildings[keysSorted[best]].owned < max || max == -1) {
            bestBuilding = keysSorted[best];
            document.getElementById(bestBuilding).style.border = "1px solid #00CC00";
            break;
        }
    }
    if (smithylogic(bestBuilding, 'gems', false) && bestBuilding) {
        RsafeBuyBuilding(bestBuilding);
    }
}

var smithybought = 0;

function mostEfficientHousing() {

    //Housing
    var HousingTypes = ['Hut', 'House', 'Mansion', 'Hotel', 'Resort', 'Gateway', 'Collector'];

    // Which houses we actually want to check
    var housingTargets = [];
    for (var house of HousingTypes) {
        var maxHousing = (getPageSetting('RMax' + house) === -1 ? Infinity : getPageSetting('RMax' + house));
        if (!game.buildings[house].locked && game.buildings[house].owned < maxHousing) {
            housingTargets.push(house);
        }
    }

    var mostEfficient = {
        name: "",
        time: Infinity
    }

    for (var housing of housingTargets) {

        var worstTime = -Infinity;
        var currentOwned = game.buildings[housing].owned;
        for (var resource in game.buildings[housing].cost) {

            // Get production time for that resource
            var baseCost = game.buildings[housing].cost[resource][0];
            var costScaling = game.buildings[housing].cost[resource][1];
            var avgProduction = getPsString(resource, true);
	    if (avgProduction <= 0) avgProduction = 1;
            var housingBonus = game.buildings.Hut.increase.by;
            if (!game.buildings.Hub.locked) { housingBonus += 500;}

            // Only keep the slowest producer, aka the one that would take the longest to generate resources for
            worstTime = Math.max(baseCost * Math.pow(costScaling, currentOwned - 1) / (avgProduction * housingBonus), worstTime);
        }

        if (mostEfficient.time > worstTime) {
            mostEfficient.name = housing;
            mostEfficient.time = worstTime;
        }
    }
    if (mostEfficient.name == "") mostEfficient.name = null;

    return mostEfficient.name;
}

function RbuyBuildings() {
 
    // Storage, shouldn't be needed anymore that autostorage is lossless
    if (!game.global.autoStorage) {toggleAutoStorage(false);}
 
    //Smithy
    if (!game.buildings.Smithy.locked && canAffordBuilding('Smithy')) {
        // On quest challenge
        if (game.global.challengeActive == 'Quest') {
            if (smithybought > game.global.world) {smithybought = 0;}
 
            if (smithybought < game.global.world && (questcheck() == 7 || (RcalcHDratio() * 10 >= getPageSetting('Rmapcuntoff')))) {
                buyBuilding("Smithy", true, true, 1);
                smithybought = game.global.world;
            }
        } else {
            buyBuilding("Smithy", true, true, 1);
        }
    }
 
    //Microchip
    if (!game.buildings.Microchip.locked && canAffordBuilding('Microchip')) {
        buyBuilding('Microchip', true, true, 1);
    }
 
    //Housing
    var HousingTypes = ['Hut', 'House', 'Mansion', 'Hotel', 'Resort', 'Gateway', 'Collector'];
 
    // Which houses we actually want to check
    var housingTargets = [];
    for (var house in HousingTypes) {
        var maxHousing = (getPageSetting('RMax' + house) === -1 ? Infinity : getPageSetting('RMax' + house));
        if (!game.buildings[HousingTypes[house]].locked && game.buildings[HousingTypes[house]].owned < maxHousing) {
            housingTargets.push(house);
        }
    }
 
    var boughtHousing = false;
 
    do {
 
        boughtHousing = false;
        var housing = mostEfficientHousing();
 
        if (housing != null && canAffordBuilding(housing) && game.buildings[housing].purchased < (getPageSetting('RMax' + housing) === -1 ? Infinity : getPageSetting('RMax' + housing))) {
            buyBuilding(housing, true, true, 1);
            boughtHousing = true;
        }
    } while (boughtHousing)
 
    //Tributes
    if (!game.buildings.Tribute.locked) {
        var buyTributeCount = getMaxAffordable(Math.pow(1.05, game.buildings.Tribute.owned) * 10000, game.resources.food.owned,1.05,true);
        
        if (getPageSetting('RMaxTribute') > game.buildings.Tribute.owned) {
            buyTributeCount = Math.min(buyTributeCount, getPageSetting('RMaxTribute') - game.buildings.Tribute.owned);
        }
 	if (getPageSetting('RMaxTribute') < 0 || (getPageSetting('RMaxTribute') > game.buildings.Tribute.owned)) {
            buyBuilding('Tribute', true, true, buyTributeCount);
	}
    }
}
