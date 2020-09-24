var animated = (game.options.menu.showHeirloomAnimations.enabled) ? "animated " : "";
var hrlmProtBtn1=document.createElement('DIV');hrlmProtBtn1.setAttribute('class','noselect heirloomBtnActive heirBtn'),hrlmProtBtn1.setAttribute('onclick','protectHeirloom(this, true)'),hrlmProtBtn1.innerHTML='Protect/Unprotect',hrlmProtBtn1.id='protectHeirloomBTN1';var hrlmProtBtn2=document.createElement('DIV');hrlmProtBtn2.setAttribute('class','noselect heirloomBtnActive heirBtn'),hrlmProtBtn2.setAttribute('onclick','protectHeirloom(this, true)'),hrlmProtBtn2.innerHTML='Protect/Unprotect',hrlmProtBtn2.id='protectHeirloomBTN2';var hrlmProtBtn3=document.createElement('DIV');hrlmProtBtn3.setAttribute('class','noselect heirloomBtnActive heirBtn'),hrlmProtBtn3.setAttribute('onclick','protectHeirloom(this, true)'),hrlmProtBtn3.innerHTML='Protect/Unprotect',hrlmProtBtn3.id='protectHeirloomBTN3',document.getElementById('equippedHeirloomsBtnGroup').appendChild(hrlmProtBtn1),document.getElementById('carriedHeirloomsBtnGroup').appendChild(hrlmProtBtn2),document.getElementById('extraHeirloomsBtnGroup').appendChild(hrlmProtBtn3);
function protectHeirloom(a,b){var c=game.global.selectedHeirloom,d=c[1],e=game.global[d];if(-1!=c[0])var e=e[c[0]];b&&(e.protected=!e.protected),a||(d.includes("Equipped")?a=document.getElementById("protectHeirloomBTN1"):"heirloomsCarried"==d?a=document.getElementById("protectHeirloomBTN2"):"heirloomsExtra"==d&&(a=document.getElementById("protectHeirloomBTN3"))),a&&(a.innerHTML=e.protected?"UnProtect":"Protect")}
function newSelectHeirloom(a,b,c){selectHeirloom(a,b,c),protectHeirloom()}
function highdmgshield(){for(loom of game.global.heirloomsCarried)if(loom.name==getPageSetting('highdmg'))return loom;}
function lowdmgshield(){for(loom of game.global.heirloomsCarried)if(loom.name==getPageSetting('lowdmg'))return loom;}
function dhighdmgshield(){for(loom of game.global.heirloomsCarried)if(loom.name==getPageSetting('dhighdmg'))return loom;}
function dlowdmgshield(){for(loom of game.global.heirloomsCarried)if(loom.name==getPageSetting('dlowdmg'))return loom;}

function getHeirloomEff(name, type) {
  if (type == "staff") {
    if (getPageSetting('slot1modst') == name) return 5;
    else if (getPageSetting('slot2modst') == name) return 5;
    else if (getPageSetting('slot3modst') == name) return 5;
    else if (getPageSetting('slot4modst') == name) return 5;
    else if (getPageSetting('slot5modst') == name) return 5;
    else if (getPageSetting('slot6modst') == name) return 5;
	else return 0;
  }
  else if (type == "shield") {
    if (getPageSetting('slot1modsh') == name) return 5;
    else if (getPageSetting('slot2modsh') == name) return 5;
    else if (getPageSetting('slot3modsh') == name) return 5;
    else if (getPageSetting('slot4modsh') == name) return 5;
    else if (getPageSetting('slot5modsh') == name) return 5;
    else if (getPageSetting('slot6modsh') == name) return 5;
	else return 0;
  }
  else if (type == "core") {
    if (getPageSetting('slot1modcr') == name) return 5;
    else if (getPageSetting('slot2modcr') == name) return 5;
    else if (getPageSetting('slot3modcr') == name) return 5;
    else if (getPageSetting('slot4modcr') == name) return 5;
	else return 0;
  }
}

function evaluateHeirloomMods2(loom, location) {

  var index = loom;
  var eff = 0;
  var name;
  var type;
  var rarity;
  var raretokeep = getPageSetting('raretokeep');
	if (raretokeep == 'Any' || raretokeep == 'Common') raretokeep = 0;
	else if (raretokeep == 'Uncommon') raretokeep = 1;
	else if (raretokeep == 'Rare') raretokeep = 2;
	else if (raretokeep == 'Epic') raretokeep = 3;
	else if (raretokeep == 'Legendary') raretokeep = 4;
	else if (raretokeep == 'Magnificent') raretokeep = 5;
	else if (raretokeep == 'Ethereal') raretokeep = 6;
	else if (raretokeep == 'Magmatic') raretokeep = 7;
	else if (raretokeep == 'Plagued') raretokeep = 8;
	else if (raretokeep == 'Radiating') raretokeep = 9;
        else if (raretokeep == 'Hazardous') raretokeep = 10;

  if (location.includes('Equipped'))
    loom = game.global[location];
  else
    loom = game.global[location][loom];

  for (var m in loom.mods) {
    name = loom.mods[m][0];
    type = loom.type;
    rarity = loom.rarity;
    if (type == "Shield") {
      eff += getHeirloomEff(name, "shield");
    }
    if (type == "Staff") {
      eff += getHeirloomEff(name, "staff");
    }
    if (type == "Core") {
      eff += getHeirloomEff(name, "core");
    }
    if (name == "empty" && type == "Shield") {
        eff *= 4;
    }
    if (name == "empty" && type == "Staff") {
        eff *= 4;
    }
    if (name == "empty" && type == "Core") {
        eff *= 4;
    }
    if (rarity >= raretokeep) {
       eff *= 100;
    }
    else if (rarity < raretokeep) {
       eff /= 100;
    }
  }
  return eff;
}

var worth3 = {'Shield': [], 'Staff': [], 'Core': []};
function worthOfHeirlooms3(){
    worth3 = {'Shield': [], 'Staff': [], 'Core': []};
    for (var index in game.global.heirloomsExtra) {
        var theLoom = game.global.heirloomsExtra[index];
        var data = {'location': 'heirloomsExtra', 'index': index, 'rarity': theLoom.rarity, 'eff': evaluateHeirloomMods2(index, 'heirloomsExtra')};
        worth3[theLoom.type].push(data);
    }
    var valuesort = function(a, b){return b.eff - a.eff;};
    worth3['Shield'].sort(valuesort);
    worth3['Staff'].sort(valuesort);
    worth3['Core'].sort(valuesort);
}

function autoheirlooms3() {

    if(!heirloomsShown && game.global.heirloomsExtra.length > 0){
        var originalLength = game.global.heirloomsCarried.length;
        for(var index=0; index < originalLength; index++) {
            selectHeirloom(0, 'heirloomsCarried');
            stopCarryHeirloom();
        }

	//CARRY
        var originalLength = game.global.heirloomsExtra.length;
        for(var index=0; index < originalLength; index++) {
            var theLoom = game.global.heirloomsExtra[index];
            if ((theLoom.protected) && (game.global.heirloomsCarried.length < getMaxCarriedHeirlooms())){
                selectHeirloom(index, 'heirloomsExtra');
                carryHeirloom();
                index--; originalLength--;
            }
        }

	//SHIELD
	if (getPageSetting('typetokeep') == 1) {
       		 while ((game.global.heirloomsCarried.length < getMaxCarriedHeirlooms()) && game.global.heirloomsExtra.length > 0){
                        worthOfHeirlooms3();
                        if (worth3["Shield"].length > 0){
                            var carryshield = worth3["Shield"].shift();
                            selectHeirloom(carryshield.index, 'heirloomsExtra');
                            carryHeirloom();
                        }
			else break;
                }
	}

	//STAFF
	else if (getPageSetting('typetokeep') == 2) {
       		 while ((game.global.heirloomsCarried.length < getMaxCarriedHeirlooms()) && game.global.heirloomsExtra.length > 0){
                        worthOfHeirlooms3();
                        if (worth3["Staff"].length > 0){
                            var carrystaff = worth3["Staff"].shift();
                            selectHeirloom(carrystaff.index, 'heirloomsExtra');
                            carryHeirloom();
                        }
			else break;
                }
	}

	//CORE
	else if (getPageSetting('typetokeep') == 3) {
       		 while ((game.global.heirloomsCarried.length < getMaxCarriedHeirlooms()) && game.global.heirloomsExtra.length > 0){
                        worthOfHeirlooms3();
                        if (worth3["Core"].length > 0){
                            var carrycore = worth3["Core"].shift();
                            selectHeirloom(carrycore.index, 'heirloomsExtra');
                            carryHeirloom();
                        }
			else break;
                }
	}

	//ALL
	else if (getPageSetting('typetokeep') == 4) {
       		 while ((game.global.heirloomsCarried.length < getMaxCarriedHeirlooms()) && game.global.heirloomsExtra.length > 0){
            		worthOfHeirlooms3();
            		if (worth3["Shield"].length > 0){
                	    var carryshield = worth3["Shield"].shift();
                	    selectHeirloom(carryshield.index, 'heirloomsExtra');
                            carryHeirloom();
              		}
                        worthOfHeirlooms3();
                        if (worth3["Staff"].length > 0){
                            var carrystaff = worth3["Staff"].shift();
                            selectHeirloom(carrystaff.index, 'heirloomsExtra');
                            carryHeirloom();
                        }
                        worthOfHeirlooms3();
                        if (worth3["Core"].length > 0){
                            var carrycore = worth3["Core"].shift();
                            selectHeirloom(carrycore.index, 'heirloomsExtra');
                            carryHeirloom();
                        }
                }
	}
    }
}

//Loom Swapping

function lowHeirloom() {
	if (lowdmgshield() != undefined && game.global.ShieldEquipped.name != getPageSetting('lowdmg')) {
        selectHeirloom(game.global.heirloomsCarried.indexOf(loom), "heirloomsCarried", true);
        equipHeirloom();
	}
}
function dlowHeirloom() {
	if (dlowdmgshield() != undefined && game.global.ShieldEquipped.name != getPageSetting('dlowdmg')) {
        selectHeirloom(game.global.heirloomsCarried.indexOf(loom), "heirloomsCarried", true);
        equipHeirloom();
	}
}
function highHeirloom() {
	if (highdmgshield() != undefined && game.global.ShieldEquipped.name != getPageSetting('highdmg')) {
        selectHeirloom(game.global.heirloomsCarried.indexOf(loom), "heirloomsCarried", true);
        equipHeirloom();
	}
}
function dhighHeirloom() {
	if (dhighdmgshield() != undefined && game.global.ShieldEquipped.name != getPageSetting('dhighdmg')) {
        selectHeirloom(game.global.heirloomsCarried.indexOf(loom), "heirloomsCarried", true);
        equipHeirloom();
	}
}

//Nu

function calcLoomNu(slot) {
	nuloom();
	var heirloom = getSelectedHeirloom();
	var tot = 0;
	var thisMod = heirloom.mods[slot];
	var dummyHeirloom = setupDummyHeirloom(heirloom, thisMod);
	tot = countPriceOfUpgrades(dummyHeirloom, heirloom.mods[slot][3]);
	var result = Math.floor(tot) + Math.floor(game.heirlooms.values[heirloom.rarity] / 2);
	if (isNumberBad(result)) return 0;
	return result;
}

function calcLoomNuInfinity(slot) {
	nuloom();
	var heirloom = getSelectedHeirloom();
	if (Math.ceil(getModUpgradeCost(heirloom, slot, 1)) != "Infinity") {
		return true;
	} else { 
		return false;
	}
}

function calcAutoNuRatio(slot) {
	nuloom();
	var heirloom = getSelectedHeirloom();
	
	//Shield
	if (heirloom.mods[slot][0] == "critChance")
		return 100;
	else if (heirloom.mods[slot][0] == "voidMaps")
		return 95;
	else if (heirloom.mods[slot][0] == "plaguebringer")
		return 85;
	else if (heirloom.mods[slot][0] == "trimpAttack")
		return 75;
	else if (heirloom.mods[slot][0] == "critDamage")
		return 54;
	else if (heirloom.mods[slot][0] == "trimpHealth")
		return 50;
	else if (heirloom.mods[slot][0] == "storageSize")
		return 7;
	else if (heirloom.mods[slot][0] == "trimpBlock")
		return 4;
	else if (heirloom.mods[slot][0] == "trainerEfficiency")
		return 2.8;
	else if (heirloom.mods[slot][0] == "breedSpeed")
		return 2;
	else if (heirloom.mods[slot][0] == "playerEfficiency")
		return 0.3;
	else if (heirloom.mods[slot][0] == "prismatic")
		return 50;
	else if (heirloom.mods[slot][0] == "gammaBurst")
		return 25;
	
	//Staff
	else if (heirloom.mods[slot][0] == "FluffyExp")
		return 100;
	else if (heirloom.mods[slot][0] == "fragmentsDrop")
		return 8;
	else if (heirloom.mods[slot][0] == "ExplorerSpeed")
		return 7;
	else if (heirloom.mods[slot][0] == "metalDrop")
		return 6;
	else if (heirloom.mods[slot][0] == "minerSpeed")
		return 5;
	else if (heirloom.mods[slot][0] == "woodDrop")
		return 1;
	else if (heirloom.mods[slot][0] == "LumberjackSpeed")
		return 0.8;
	else if (heirloom.mods[slot][0] == "foodDrop")
		return 0.2;
	else if (heirloom.mods[slot][0] == "FarmerSpeed")
		return 0.05;
	else if (heirloom.mods[slot][0] == "DragimpSpeed")
		return 0.04;
	else if (heirloom.mods[slot][0] == "gemsDrop")
		return 0.03;
	else if (heirloom.mods[slot][0] == "ScientistSpeed")
		return 0.03;

	//Core
	else if (heirloom.mods[slot][0] == "fireTrap")
		return 50;
	else if (heirloom.mods[slot][0] == "poisonTrap")
		return 50;
	else if (heirloom.mods[slot][0] == "lightningTrap")
		return 100;
	else if (heirloom.mods[slot][0] == "runestones")
		return 85;
	else if (heirloom.mods[slot][0] == "strengthEffect")
		return 50;
	else if (heirloom.mods[slot][0] == "condenserEffect")
		return 150;
}

function nuRatio() {

    //Find Nu Ratio
    var slot1, slot1r, slot2, slot2r, slot3, slot3r, slot4, slot4r, slot5, slot6, slot5r, slot6r, slot1spend, slot1spendr, slot2spend, slot2spendr, slot3spend, slot3spendr, slot4spend, slot4spendr, slot5spend, slot5spendr, slot6spend, slot6spendr;

    slot1 = calcLoomNuInfinity(0) ? calcLoomNu(0) : 0;
    slot2 = calcLoomNuInfinity(1) ? calcLoomNu(1) : 0;
    slot3 = calcLoomNuInfinity(2) ? calcLoomNu(2) : 0;
    slot4 = calcLoomNuInfinity(3) ? calcLoomNu(3) : 0;
    slot5 = calcLoomNuInfinity(4) ? calcLoomNu(4) : 0;
    slot6 = calcLoomNuInfinity(5) ? calcLoomNu(5) : 0;

    var total = (slot1 + slot2 + slot3 + slot4 + slot5 + slot6);

    slot1r = (slot1 != 0 && calcLoomNuInfinity(0)) ? ((slot1 / total)*100) : 1;
    slot2r = (slot2 != 0 && calcLoomNuInfinity(1)) ? ((slot2 / total)*100) : 1;
    slot3r = (slot3 != 0 && calcLoomNuInfinity(2)) ? ((slot3 / total)*100) : 1;
    slot4r = (slot4 != 0 && calcLoomNuInfinity(3)) ? ((slot4 / total)*100) : 1;
    slot5r = (slot5 != 0 && calcLoomNuInfinity(4)) ? ((slot5 / total)*100) : 1;
    slot5r = (slot6 != 0 && calcLoomNuInfinity(5)) ? ((slot6 / total)*100) : 1;

    //Find Player ratio
    if (getPageSetting('autonu') == true && getPageSetting('rationu') == 0 && getPageSetting('heirloomnu') != undefined) { 
	slot1spend = (getPageSetting('slot1nu') > 0 && calcLoomNuInfinity(0)) ? getPageSetting('slot1nu') : 0;
	slot2spend = (getPageSetting('slot2nu') > 0 && calcLoomNuInfinity(1)) ? getPageSetting('slot2nu') : 0;
	slot3spend = (getPageSetting('slot3nu') > 0 && calcLoomNuInfinity(2)) ? getPageSetting('slot3nu') : 0;
	slot4spend = (getPageSetting('slot4nu') > 0 && calcLoomNuInfinity(3)) ? getPageSetting('slot4nu') : 0;
	slot5spend = (getPageSetting('slot5nu') > 0 && calcLoomNuInfinity(4)) ? getPageSetting('slot5nu') : 0;
	slot5spend = (getPageSetting('slot6nu') > 0 && calcLoomNuInfinity(5)) ? getPageSetting('slot6nu') : 0;
	}
	
    if (getPageSetting('autonu') == true && getPageSetting('rationu') == 1 && getPageSetting('heirloomnu') != undefined) { 
	slot1spend = (calcLoomNuInfinity(0)) ? calcAutoNuRatio(0) : 0;
	slot2spend = (calcLoomNuInfinity(1)) ? calcAutoNuRatio(1) : 0;
	slot3spend = (calcLoomNuInfinity(2)) ? calcAutoNuRatio(2) : 0;
	slot4spend = (calcLoomNuInfinity(3)) ? calcAutoNuRatio(3) : 0;
	slot5spend = (calcLoomNuInfinity(4)) ? calcAutoNuRatio(4) : 0;
	slot5spend = (calcLoomNuInfinity(5)) ? calcAutoNuRatio(5) : 0;
	}

    var totalspend = (slot1spend + slot2spend + slot3spend + slot4spend + slot5spend + slot6spend);

    slot1spendr = (slot1spend > 0) ? ((slot1spend / totalspend)*100) : 0;
    slot2spendr = (slot2spend > 0) ? ((slot2spend / totalspend)*100) : 0;
    slot3spendr = (slot3spend > 0) ? ((slot3spend / totalspend)*100) : 0;
    slot4spendr = (slot4spend > 0) ? ((slot4spend / totalspend)*100) : 0;
    slot5spendr = (slot5spend > 0) ? ((slot5spend / totalspend)*100) : 0;
    slot6spendr = (slot6spend > 0) ? ((slot6spend / totalspend)*100) : 0;

    //Find Next Spend
    var slot1final = slot1spendr - slot1r;
    var slot2final = slot2spendr - slot2r;
    var slot3final = slot3spendr - slot3r;
    var slot4final = slot4spendr - slot4r;
    var slot5final = slot5spendr - slot5r;
    var slot6final = slot6spendr - slot6r;

    var ratios = [];
    if (slot1final != -1) {
	ratios.push(slot1final);
    }
    if (slot2final != -1) {
	ratios.push(slot2final);
    }
    if (slot3final != -1) {
	ratios.push(slot3final);
    }
    if (slot4final != -1) {
	ratios.push(slot4final);
    }
    if (slot5final != -1) {
	ratios.push(slot5final);
    }
    if (slot6final != -1) {
	ratios.push(slot6final);
    }

    if (ratios.length > 0) {
        ratios.sort(function(a, b){return b-a;});
    }

    //Return Next Spend
    if (ratios[0] == slot1final)
	return 0;
    if (ratios[0] == slot2final)
	return 1;
    if (ratios[0] == slot3final)
	return 2;
    if (ratios[0] == slot4final)
	return 3;
    if (ratios[0] == slot5final)
	return 4;
    if (ratios[0] == slot6final)
	return 5;
}

function spendNu() {
	nuloom();
	var slot = nuRatio();
	if (game.global.nullifium >= (getModUpgradeCost(getSelectedHeirloom(), slot, 1))) {
	    selectMod(slot);
	    upgradeMod(true, 1);
	}
}

function generateHeirloomIcon(heirloom, location, number){
    if (typeof heirloom.name === 'undefined') return "<span class='icomoon icon-sad3'></span>";
    var icon = getHeirloomIcon(heirloom);
    var animated = (game.options.menu.showHeirloomAnimations.enabled) ? "animated " : "";
    var html = '<span class="heirloomThing ' + animated + 'heirloomRare' + heirloom.rarity;
    if (location == "Equipped") html += ' equipped';
    var locText = "";
    if (location == "Equipped") locText += '-1,\'' + heirloom.type + 'Equipped\'';
    else locText += number + ', \'heirlooms' + location + '\'';
    html += '" onmouseover="tooltip(\'Heirloom\', null, event, null, ' + locText + ')" onmouseout="tooltip(\'hide\')" onclick="newSelectHeirloom(';
    html += locText + ', this)"> <span class="' + icon + '"></span></span>';
    return html;
}

//Radon
function Rhsshield1(){for(loom of game.global.heirloomsCarried)if(loom.name==getPageSetting('Rhsh1'))return loom;}
function Rhsshield2(){for(loom of game.global.heirloomsCarried)if(loom.name==getPageSetting('Rhsh2'))return loom;}
function Rhsstaff1(){for(loom of game.global.heirloomsCarried)if(loom.name==getPageSetting('Rhst1'))return loom;}
function Rhsstaff2(){for(loom of game.global.heirloomsCarried)if(loom.name==getPageSetting('Rhst2'))return loom;}

function Rhsequip1() {
	if (Rhsshield1() != "undefined" && game.global.ShieldEquipped.name != getPageSetting('Rhsh1')) {
            selectHeirloom(game.global.heirloomsCarried.indexOf(loom), "heirloomsCarried", true);
            equipHeirloom();
	}
}

function Rhsequip2() {
	if (Rhsshield2() != "undefined" && game.global.ShieldEquipped.name != getPageSetting('Rhsh2')) {
            selectHeirloom(game.global.heirloomsCarried.indexOf(loom), "heirloomsCarried", true);
            equipHeirloom();
	}
}

function Rhsequip3() {
	if (Rhsstaff1() != "undefined" && game.global.StaffEquipped.name != getPageSetting('Rhst2')) {
            selectHeirloom(game.global.heirloomsCarried.indexOf(loom), "heirloomsCarried", true);
            equipHeirloom();
	}
}


function Rhsequip4() {
	if (Rhsstaff2() != "undefined" && game.global.StaffEquipped.name != getPageSetting('Rhst1')) {
            selectHeirloom(game.global.heirloomsCarried.indexOf(loom), "heirloomsCarried", true);
            equipHeirloom();
	}
}

function Rheirloomswap() {
	if (getPageSetting('Rhshz') > 0 && game.global.world < getPageSetting('Rhshz')) {
	    Rhsequip1();
	}
	if (getPageSetting('Rhshz') > 0 && game.global.world >= getPageSetting('Rhshz')) {
	    Rhsequip2();
	}
	if (getPageSetting('Rhst1') != "undefined" && game.global.mapsActive == false) {
	    Rhsequip3();
	}
	if (getPageSetting('Rhst2') != "undefined" && game.global.mapsActive == false) {
	    Rhsequip4();
	}
}1
