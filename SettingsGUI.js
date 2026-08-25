function automationMenuInit() {
    var settingBtnSrch = document.getElementsByClassName("btn btn-default");
    for (var i = 0; i < settingBtnSrch.length; i++) {
        if (settingBtnSrch[i].getAttribute("onclick") === "toggleSettingsMenu()")
            settingBtnSrch[i].setAttribute("onclick", "autoPlusSettingsMenu()");
    }
    var newItem = document.createElement("TD");
    newItem.appendChild(document.createTextNode("AutoTrimps"));
    newItem.setAttribute("class", "btn btn-default");
    newItem.setAttribute("onclick", "autoToggle()");
    var settingbarRow = document.getElementById("settingsTable").firstElementChild.firstElementChild;
    settingbarRow.insertBefore(newItem, settingbarRow.childNodes[10]);

    var newContainer = document.createElement("DIV");
    newContainer.setAttribute("style", "margin-top: 0.2vw; display: block; font-size: 1.1vw; height: 1.5em; text-align: center; border-radius: 4px");
    newContainer.setAttribute("id", "autoMapBtn");
    newContainer.setAttribute("class", "noselect settingsBtn");
    newContainer.setAttribute("onClick", "toggleAutoMaps()");
    newContainer.setAttribute("onmouseover", 'tooltip(\"Toggle Automapping\", \"customText\", event, \"Toggle automapping on and off.\")');
    newContainer.setAttribute("onmouseout", 'tooltip("hide")');
    var abutton = document.createElement("SPAN");
    abutton.appendChild(document.createTextNode("Auto Maps"));
    abutton.setAttribute("id", "autoMapLabel");
    var fightButtonCol = document.getElementById("battleBtnsColumn");
    newContainer.appendChild(abutton);
    fightButtonCol.appendChild(newContainer);

    newContainer = document.createElement("DIV");
    newContainer.setAttribute("style", "display: block; font-size: 1.1vw; text-align: center; background-color: rgba(0,0,0,0.3);");
    if (game.global.universe == 1) {
        newContainer.setAttribute("onmouseover", 'tooltip(\"Health to Damage ratio\", \"customText\", event, \"This status box displays the current mode Automaps is in. The number usually shown here during Farming or Want more Damage modes is the \'HDratio\' meaning EnemyHealth to YourDamage Ratio (in X stance). Above 16 will trigger farming, above 4 will trigger going for Map bonus up to 10 stacks.<p><b>enoughHealth: </b>\" + enoughHealth + \"<br><b>enoughDamage: </b>\" + enoughDamage +\"<br><b>shouldFarm: </b>\" + shouldFarm +\"<br><b>H:D ratio = </b>\" + calcHDratio() + \"<br>\")');
    }
    if (game.global.universe == 2) {
        newContainer.setAttribute("onmouseover", 'tooltip(\"Health to Damage ratio\", \"customText\", event, \"This status box displays the current mode Automaps is in. The number usually shown here during Farming or Want more Damage modes is the \'HDratio\' meaning EnemyHealth to YourDamage Ratio (in X stance). Above 16 will trigger farming, above 4 will trigger going for Map bonus up to 10 stacks.<p><b>enoughHealth: </b>\" + RenoughHealth + \"<br><b>enoughDamage: </b>\" + RenoughDamage +\"<br><b>shouldFarm: </b>\" + RshouldFarm +\"<br><b>H:D ratio = </b>\" + RcalcHDratio() + \"<br>\")');
    }
    newContainer.setAttribute("onmouseout", 'tooltip("hide")');
    abutton = document.createElement("SPAN");
    abutton.id = 'autoMapStatus';
    newContainer.appendChild(abutton);
    fightButtonCol.appendChild(newContainer);

    newContainer = document.createElement("DIV");
    newContainer.setAttribute("style", "display: block; font-size: 1vw; text-align: center; margin-top: 2px; background-color: rgba(0,0,0,0.3);");
    if (game.global.universe == 1)
        newContainer.setAttribute("onmouseover", 'tooltip(\"Helium/Hr Info\", \"customText\", event, \"1st is Current He/hr % out of Lifetime He(not including current+unspent).<br> 0.5% is an ideal peak target. This can tell you when to portal... <br>2nd is Current run Total He earned / Lifetime He(not including current)<br>\" + getDailyHeHrStats())');
    else if (game.global.universe == 2)
        newContainer.setAttribute("onmouseover", 'tooltip(\"Radon/Hr Info\", \"customText\", event, \"1st is Current Rn/hr % out of Lifetime Rn(not including current+unspent).<br> 0.5% is an ideal peak target. This can tell you when to portal... <br>2nd is Current run Total Rn earned / Lifetime Rn(not including current)<br>\" + getDailyRnHrStats())');
    newContainer.setAttribute("onmouseout", 'tooltip("hide")');
    abutton = document.createElement("SPAN");
    abutton.id = 'hiderStatus';
    newContainer.appendChild(abutton);
    fightButtonCol.appendChild(newContainer);

    var $portalTimer = document.getElementById('portalTimer');
    $portalTimer.setAttribute('onclick', 'toggleSetting(\'pauseGame\')');
    $portalTimer.setAttribute('style', 'cursor: default');

    var btns = document.getElementsByClassName("fightBtn");
    for (var x = 0; x < btns.length; x++) {
        btns[x].style.padding = "0.01vw 0.01vw";
    }
}
automationMenuInit();

function modifyParentNode(setting, id) {
    var elem = document.getElementById(id).parentNode.parentNode.children;
    for (i = 0; i < elem.length; i++) {
        if (document.getElementById(id).parentNode.parentNode.children[i].children[0] === undefined) {
            continue
        } else {
            if (document.getElementById(id).parentNode.parentNode.children[i].children[0].id === id) {
                if (autoTrimpSettings[setting].enabled) {
                    if (elem.length > (i + 1)) {
                        if (document.getElementById(id).parentNode.parentNode.children[(i + 1)].style.length == 0) {
                            document.getElementById(id).parentNode.parentNode.children[(i + 1)].remove()
                            break;
                        }
                    }
                } else {
                    document.getElementById(id).parentNode.parentNode.children[i].insertAdjacentHTML('afterend', '<br>');
                }
            }

        }
    }
}

function automationMenuSettingsInit() {
    var a = document.getElementById("settingsRow"),
        b = document.createElement("DIV");
    b.id = "autoSettings", b.setAttribute("style", "display: none; max-height: 92.5vh;overflow: auto;"), b.setAttribute("class", "niceScroll"), a.appendChild(b)
}
automationMenuSettingsInit();
var link1 = document.createElement("link");
link1.rel = "stylesheet", link1.type = "text/css", link1.href = basepath + "tabs.css", document.head.appendChild(link1);

function createTabs(a, b) {
    var c = document.createElement("li"),
        d = document.createElement("a");
    d.className = "tablinks", d.setAttribute("onclick", "toggleTab(event, '" + a + "')"), d.href = "#", d.appendChild(document.createTextNode(a)), c.id = "tab" + a, c.appendChild(d), addtabsUL.appendChild(c), createTabContents(a, b)
}

function createTabContents(a, b) {
    var c = document.createElement('div');
    c.className = 'tabcontent', c.id = a;
    var d = document.createElement('div');
    d.setAttribute('style', 'margin-left: 1vw; margin-right: 1vw;');
    var e = document.createElement('h4');
    e.setAttribute('style', 'font-size: 1.2vw;'), e.appendChild(document.createTextNode(b)), d.appendChild(e), c.appendChild(d), addTabsDiv.appendChild(c)
}

function toggleTab(a, b) {
    -1 < a.currentTarget.className.indexOf(" active") ? (document.getElementById(b).style.display = "none", a.currentTarget.className = a.currentTarget.className.replace(" active", "")) : (document.getElementById(b).style.display = "block", a.currentTarget.className += " active")
}

function minimizeAllTabs() {
    for (var a = document.getElementsByClassName("tabcontent"), b = 0, c = a.length; b < c; b++) a[b].style.display = "none";
    for (var d = document.getElementsByClassName("tablinks"), b = 0, c = d.length; b < c; b++) d[b].className = d[b].className.replace(" active", "")
}

function maximizeAllTabs() {
    for (var a = document.getElementsByClassName("tabcontent"), b = 0, c = a.length; b < c; b++) a[b].style.display = "block";
    for (var d = document.getElementsByClassName("tablinks"), b = 0, c = d.length; b < c; b++) d[b].style.display = "block", d[b].className.includes(" active") || (d[b].className += " active")
}

function nuloom(slot) {
    var nuloom = getPageSetting('heirloomnu');
    if (game.global.ShieldEquipped.name == nuloom) {
        selectHeirloom(-1, 'ShieldEquipped', true);
        if (slot == 0) {
            return game.global.ShieldEquipped.mods[0][0];
        }
        if (slot == 1) {
            return game.global.ShieldEquipped.mods[1][0];
        }
        if (slot == 2) {
            return game.global.ShieldEquipped.mods[2][0];
        }
        if (slot == 3) {
            return game.global.ShieldEquipped.mods[3][0];
        }
        if (slot == 4) {
            return game.global.ShieldEquipped.mods[4][0];
        }
        if (slot == 5) {
            return game.global.ShieldEquipped.mods[5][0];
        }
    }

    if (game.global.StaffEquipped.name == nuloom) {
        selectHeirloom(-1, 'StaffEquipped', true);
        if (slot == 0) {
            return game.global.StaffEquipped.mods[0][0];
        }
        if (slot == 1) {
            return game.global.StaffEquipped.mods[1][0];
        }
        if (slot == 2) {
            return game.global.StaffEquipped.mods[2][0];
        }
        if (slot == 3) {
            return game.global.StaffEquipped.mods[3][0];
        }
        if (slot == 4) {
            return game.global.StaffEquipped.mods[4][0];
        }
        if (slot == 5) {
            return game.global.StaffEquipped.mods[5][0];
        }
    }

    if (game.global.StaffEquipped.name != nuloom && game.global.ShieldEquipped.name != nuloom) {
        for (var loom of game.global.heirloomsCarried) {
            if (loom.name == getPageSetting('heirloomnu')) {
                selectHeirloom(game.global.heirloomsCarried.indexOf(loom), "heirloomsCarried", true);
                if (slot == 0) {
                    return loom.mods[0][0];
                }
                if (slot == 1) {
                    return loom.mods[1][0];
                }
                if (slot == 2) {
                    return loom.mods[2][0];
                }
                if (slot == 3) {
                    return loom.mods[3][0];
                }
                if (slot == 4) {
                    return loom.mods[4][0];
                }
                if (slot == 5) {
                    return loom.mods[5][0];
                }
            }
        }
    }
}

var addTabsDiv;
var addtabsUL;

function initializeAllTabs() {
    addTabsDiv = document.createElement('div');
    addtabsUL = document.createElement('ul');
    addtabsUL.className = "tab";
    addtabsUL.id = 'autoTrimpsTabBarMenu';
    addtabsUL.style.display = "none";
    var sh = document.getElementById("settingsRow")
    sh.insertBefore(addtabsUL, sh.childNodes[2]);
    createTabs("Core", "Core - Main Controls for the script");
    createTabs("Buildings", "Building Settings");
    createTabs("Jobs", "Jobs - Worker Settings");
    createTabs("Gear", "Gear - Equipment Settings");
    createTabs("Maps", "Maps - AutoMaps & VoidMaps Settings");
    createTabs("Spire", "Spire - Settings for Spires");
    createTabs("Raiding", "Raiding - Settings for Raiding");
    createTabs("Daily", "Dailies - Settings for Dailies");
    createTabs("C2", "C2 - Settings for C2s");
    createTabs("Challenges", "Challenges - Settings for Specific Challenges");
    createTabs("Combat", "Combat & Stance Settings");
    createTabs("Windstacking", "Windstacking Settings");
    createTabs("ATGA", "Geneticassist Settings");
    createTabs("Scryer", "Scryer Settings");
    createTabs("Magma", "Dimensional Generator & Magmite Settings");
    createTabs("Heirlooms", "Heirloom Settings");
    createTabs("Golden", "Golden Upgrade Settings");
    createTabs("SA", "SA Settings");
    createTabs("Nature", "Nature Settings");
    createTabs("Display", "Display & Spam Settings");
    createTabs("Import Export", "Import & Export Settings");
    var li_0 = document.createElement('li');
    var a_0 = document.createElement('a');
    a_0.className = "tablinks minimize";
    a_0.setAttribute('onclick', 'minimizeAllTabs();');
    a_0.href = "#";
    a_0.appendChild(document.createTextNode("-"));
    li_0.appendChild(a_0);
    li_0.setAttribute("style", "float:right!important;");
    li_0.setAttribute("onmouseover", 'tooltip("Minimize all tabs", "customText", event, "Minimize all AT settings tabs.")');
    li_0.setAttribute("onmouseout", 'tooltip("hide")');
    var li_1 = document.createElement('li');
    var a_1 = document.createElement('a');
    a_1.className = "tablinks maximize";
    a_1.setAttribute('onclick', 'maximizeAllTabs();');
    a_1.href = "#";
    a_1.appendChild(document.createTextNode("+"));
    li_1.appendChild(a_1);
    li_1.setAttribute("style", "float:right!important;");
    li_1.setAttribute("onmouseover", 'tooltip("Maximize all tabs", "customText", event, "Maximize all AT settings tabs.")');
    li_1.setAttribute("onmouseout", 'tooltip("hide")');
    var li_2 = document.createElement('li');
    var a_2 = document.createElement('a');
    a_2.className = "tablinks tabclose";
    a_2.setAttribute('onclick', 'autoToggle();');
    a_2.href = "#";
    a_2.appendChild(document.createTextNode("x"));
    li_2.appendChild(a_2);
    li_2.setAttribute("style", "float:right!important;");
    li_2.setAttribute("onmouseover", 'tooltip("Exit (duplicate)", "customText", event, "Closes/toggles/hides AutoTrimps (just a UI shortcut)")');
    li_2.setAttribute("onmouseout", 'tooltip("hide")');
    addtabsUL.appendChild(li_2);
    addtabsUL.appendChild(li_1);
    addtabsUL.appendChild(li_0);
    document.getElementById("autoSettings").appendChild(addTabsDiv);
    document.getElementById("Core").style.display = "block";
    document.getElementsByClassName("tablinks")[0].className += " active";
}
initializeAllTabs();

function initializeAllSettings() {

    //Core

    //Line 1
    createSetting('ManualGather2', ['Manual Gather/Build', 'Auto Gather/Build', 'Mining/Building Only', 'Science Research OFF'], 'Controls what you gather/build do. Manual does nothing<br>Auto Gathering of Food,Wood,Metal(w/turkimp) & Science. Auto speed-Builds your build queue. <br>Mining/Building only does exactly what it says. Only use if you are passed the early stages of the game and have the mastery foremany unlocked (No longer need to trap, food and wood are useless). <br>You can disable science researching for the achievement: Reach Z120 without using manual research.', 'multitoggle', 1, null, "Core");
    createSetting('gathermetal', 'Metal Only', 'For use with Mining/Gather Only. Only gathers Metal if you have foremany unlocked. ', 'boolean', false, null, "Core");
    createSetting('BuyUpgradesNew', ['Manual Upgrades', 'Buy All Upgrades', 'Upgrades no Coords'], 'Autobuys non-equipment upgrades (equipment is controlled in the Gear tab). The second option does NOT buy coordination (use this <b>ONLY</b> if you know what you\'re doing).', 'multitoggle', 1, null, "Core");
    createSetting('amalcoord', 'Amal Boost', 'Boost your Amal count for more Mi. Will not buy coords until your H:D ratio is below a certain value. This means that you will get amals quicker. Will not activate higher than your Amal Boost End Zone Setting! ', 'boolean', false, null, "Core");
    createSetting('amalcoordt', 'Amal Target', 'Set the amount of Amals you wish to aim for. Once this target is reached, it will buy coords below your Amal ratio regardless of your H:D, just enough to keep the Amal. -1 to disable and use H:D for entire boost. ', 'value', -1, null, "Core");
    createSetting('amalcoordhd', 'Amal Boost H:D', 'Set your H:D for Amal Boost here. The higher it is the less coords AT will buy. 0.0000025 is the default. ', 'value', 0.0000025, null, "Core");
    createSetting('amalcoordz', 'Amal Boost End Z', 'Amal Boost End Zone. Set the zone you want to stop Amal Boosting. -1 to do it infinitely. ', 'value', -1, null, "Core");
    createSetting('AutoAllocatePerks', ['Auto Allocate Off', 'Auto Allocate On', 'Dump into Looting II'], 'Uses the AutoPerks ratio based preset system to automatically allocate your perks to spend whatever helium you have when you AutoPortal. Does not change Fixed Perks: siphonology, anticipation, meditation, relentlessness, range, agility, bait, trumps, packrat, capable. NEW: Dump into Looting II, dumps all loot gained from previous portal at specified zone', 'multitoggle', 0, null, 'Core');

    //Line 2
    createSetting('fastallocate', 'Fast Allocate', 'Turn on if your helium is above 500Qa. Not recommended for low amounts of helium. ', 'boolean', false, null, 'Core');
    createSetting('TrapTrimps', 'Trap Trimps', 'Automatically trap trimps when needed, including building traps. (when you turn this off, you may aswell turn off the in-game autotraps button, think of the starving trimps that could eat that food!)', 'boolean', true, null, "Core");
    createSetting('AutoEggs', 'AutoEggs', 'Click easter egg if it exists, upon entering a new zone. Warning: Quite overpowered. Please solemnly swear that you are up to no good.', 'boolean', false, null, 'Core');
    createSetting('AutoBoneChargeMax', ['Manual Bone Charge', 'Bone Charge When Max', 'Bone Charge (Daily Only)'], 'Automatically uses a Bone Charge from the Bone Shrine if you are at max charges. The start zone can be configured under <i>Bone Charge Start Z.</i><br><br><b>Bone Charge (Daily Only)</b> as the name suggests; will only use a Bone Charge when at max and if on a daily challenge.<br><br><b>Default: Off (Manual Bone Charge).</b>', 'multitoggle', 0, null, "Core");
    createSetting('AutoBoneChargeMaxStartZone', 'Bone Charge Start Z', 'Enter the zone number at which you wish to <i>start</i> using Bone Charges.<br><br>Alternatively, set it to <i><b>-1</b></i> to automatically update the zone to 10% of your highest zone cleared. For example, if your highest zone cleared was 400, bone charges would be automatically used from zone 360 onwards.<br><br><b>Default: Automated (-1).</b>', 'value', -1, null, "Core");
    document.getElementById('AutoEggs').parentNode.insertAdjacentHTML('afterend', '<br>');

    //RCore

    //Line 1
    createSetting('RManualGather2', ['Manual Gather/Build', 'Auto Gather/Build', 'Mining/Building Only'], 'Controls what you gather/build do. Manual does nothing<br>Auto Gathering of Food,Wood,Metal(w/turkimp) & Science. Auto speed-Builds your build queue. <br>Mining/Building only does exactly what it says. Only use if you are passed the early stages of the game and have the mastery foremany unlocked (No longer need to trap, food and wood are useless). ', 'multitoggle', 1, null, "Core");
    createSetting('RTrapTrimps', 'Trap Trimps', 'Automatically trap trimps when needed, including building traps. (when you turn this off, you may aswell turn off the in-game autotraps button, think of the starving trimps that could eat that food!)', 'boolean', true, null, "Core");
    createSetting('RBuyUpgradesNew', ['Manual Upgrades', 'Buy All Upgrades', 'Upgrades no Coords'], 'Autobuys non-equipment upgrades (equipment is controlled in the Gear tab). The second option does NOT buy coordination (use this <b>ONLY</b> if you know what you\'re doing).', 'multitoggle', 1, null, "Core");
    createSetting('RAutoAllocatePerks', ['Auto Allocate Off', 'Auto Allocate On', 'Dump into Looting'], 'Uses the AutoPerks ratio based preset system to automatically allocate your perks to spend whatever helium you have when you AutoPortal. Does not change Fixed Perks: siphonology, anticipation, meditation, relentlessness, range, agility, bait, trumps, packrat, capable. NEW: Dump into Looting, dumps all loot gained from previous portal at specified zone', 'multitoggle', 0, null, 'Core');
    createSetting('Rdumpgreed', 'Greed Dump', 'Dump Radon into Greed instead. ', 'boolean', false, null, "Core");


    //Portal
    createSetting('AutoPortal', 'AutoPortal', 'Automatically portal. Will NOT auto-portal if you have a challenge active, the challenge setting dictates which challenge it will select for the next run. All challenge settings will portal right after the challenge ends, regardless. Helium Per Hour only <b>portals at cell 1</b> of the first level where your He/Hr went down even slightly compared to the current runs Best He/Hr. Take note, there is a Buffer option, which is like a grace percentage of how low it can dip without triggering. Setting a buffer will portal mid-zone if you exceed 5x of the buffer.  CAUTION: Selecting He/hr may immediately portal you if its lower-(use Pause AutoTrimps button to pause the script first to avoid this)', 'dropdown', 'Off', ['Off', 'Helium Per Hour', 'Balance', 'Decay', 'Electricity', 'Life', 'Crushed', 'Nom', 'Toxicity', 'Watch', 'Lead', 'Corrupted', 'Domination', 'Experience', 'Custom'], "Core");
    createSetting('HeliumHourChallenge', 'Portal Challenge', 'Automatically portal into this challenge when using helium per hour or custom autoportal. Custom portals after cell 100 of the zone specified. Do not choose a challenge if you havent unlocked it. ', 'dropdown', 'None', ['None', 'Balance', 'Decay', 'Electricity', 'Life', 'Crushed', 'Nom', 'Toxicity', 'Watch', 'Lead', 'Corrupted', 'Domination', 'Experience'], "Core");
    document.getElementById("HeliumHourChallengeLabel").innerHTML = "Portal Challenge:";
    createSetting('CustomAutoPortal', 'Custom Portal', 'Automatically portal AFTER clearing this level.(ie: setting to 200 would portal when you first reach level 201)', 'value', '999', null, "Core");
    createSetting('HeHrDontPortalBefore', 'Don\'t Portal Before', 'Do NOT allow Helium per Hour AutoPortal setting to portal BEFORE this level is reached. It is an additional check that prevents drops in helium/hr from triggering autoportal. Set to 0 or -1 to completely disable this check. (only shows up with Helium per Hour set)', 'value', '999', null, "Core");
    createSetting('HeliumHrBuffer', 'He/Hr Portal Buffer %', 'IMPORTANT SETTING. When using the He/Hr Autoportal, it will portal if your He/Hr drops by this amount of % lower than your best for current run, default is 0% (ie: set to 5 to portal at 95% of your best). Now with stuck protection - Allows portaling midzone if we exceed set buffer amount by 5x. (ie a normal 2% buffer setting would now portal mid-zone you fall below 10% buffer).', 'value', '0', null, 'Core');

    //RPortal
    document.getElementById('Rdumpgreed').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('RAutoPortal', 'AutoPortal', 'Automatically portal. Will NOT auto-portal if you have a challenge active, the challenge setting dictates which challenge it will select for the next run. All challenge settings will portal right after the challenge ends, regardless. Radon Per Hour only <b>portals at cell 1</b> of the first level where your Rn/Hr went down even slightly compared to the current runs Best Rn/Hr. Take note, there is a Buffer option, which is like a grace percentage of how low it can dip without triggering. Setting a buffer will portal mid-zone if you exceed 5x of the buffer.  CAUTION: Selecting Rn/hr may immediately portal you if its lower-(use Pause AutoTrimps button to pause the script first to avoid this)', 'dropdown', 'Off', ['Off', 'Radon Per Hour', 'Bublé', 'Melt', 'Quagmire', 'Archaeology', 'Insanity', 'Nurture', 'Alchemy', 'Hypothermia', 'Custom'], "Core");
    createSetting('RadonHourChallenge', 'Portal Challenge', 'Automatically portal into this challenge when using radon per hour or custom autoportal. Custom portals after cell 100 of the zone specified. Do not choose a challenge if you havent unlocked it. ', 'dropdown', 'None', ['None', 'Bublé', 'Melt', 'Quagmire', 'Archaeology', 'Insanity', 'Nurture', 'Alchemy', 'Hypothermia'], "Core");
    createSetting('RCustomAutoPortal', 'Custom Portal', 'Automatically portal AFTER clearing this level.(ie: setting to 200 would portal when you first reach level 201)', 'value', '999', null, "Core");
    createSetting('RnHrDontPortalBefore', 'Don\'t Portal Before', 'Do NOT allow Radon per Hour AutoPortal setting to portal BEFORE this level is reached. It is an additional check that prevents drops in radon/hr from triggering autoportal. Set to 0 or -1 to completely disable this check. (only shows up with Radon per Hour set)', 'value', '999', null, "Core");
    createSetting('RadonHrBuffer', 'Rn/Hr Portal Buffer %', 'IMPORTANT SETTING. When using the Rn/Hr Autoportal, it will portal if your Rn/Hr drops by this amount of % lower than your best for current run, default is 0% (ie: set to 5 to portal at 95% of your best). Now with stuck protection - Allows portaling midzone if we exceed set buffer amount by 5x. (ie a normal 2% buffer setting would now portal mid-zone you fall below 10% buffer).', 'value', '0', null, 'Core');


    //Pause + Switch
    createSetting('PauseScript', 'Pause AutoTrimps', 'Pause AutoTrimps Script (not including the graphs module)', 'boolean', null, null, 'Core');
    var $pauseScript = document.getElementById('PauseScript');
    $pauseScript.parentNode.style.setProperty('float', 'right');
    $pauseScript.parentNode.style.setProperty('margin-right', '1vw');
    $pauseScript.parentNode.style.setProperty('margin-left', '0');
    createSetting('radonsettings', ['Helium', 'Radon'], 'Switch between Helium (U1) and Radon (U2) settings. ', 'multitoggle', 0, null, 'Core');
    var $radonsettings = document.getElementById('radonsettings');
    $radonsettings.parentNode.style.setProperty('float', 'right');
    $radonsettings.parentNode.style.setProperty('margin-right', '1vw');
    $radonsettings.parentNode.style.setProperty('margin-left', '0');



    //Daily

    //Line 1
    createSetting('buyheliumy', 'Buy Heliumy %', 'Buys the Heliumy bonus for <b>100 bones</b> when Daily bonus is above the value set in this setting. Recommend anything above 475. Will not buy if you cant afford to, or value is -1. ', 'value', -1, null, 'Daily');
    createSetting('dfightforever', ['DFA: Off', 'DFA: Non-Empowered', 'DFA: All Dailies'], 'Daily Fight Always. Sends trimps to fight if they\'re not fighting in Daily challenges similar to Toxicity/Nom but not on Bloodthirst/Plagued/Bogged Dailies, regardless of BAF. Non-Empowered will only send to fight if the Daily is not Empowered. Essenitally the same as the one in combat, can use either if you wish, except this will only activate in these daily challenges (duh) ', 'multitoggle', '0', null, 'Daily');
    createSetting('avoidempower', 'Avoid Empower', 'Tries to avoid Empower stacks in Empower Dailies. No harm in this being on, so default is On. ', 'boolean', true, null, 'Daily');
    createSetting('darmormagic', ['Daily Armor Magic Off', 'DAM: Above 80%', 'DAM: H:D', 'DAM: Always'], 'Will buy Armor to try and prevent death on Bleed/Plague/Bogged Dailies under the 3 conditions. <br><b>Above 80%:</b> Will activate at and above 80% of your HZE. <br><b>H:D:</b> Will activate at and above the H:D you have defined in maps. <br><b>Always</b> Will activate always. <br>All options will activate at or <b>below 25% of your health.</b> ', 'multitoggle', 0, null, "Daily");
    createSetting('dscryvoidmaps', 'Daily VM Scryer', 'Only use in Dailies if you have Scryhard II, for er, obvious reasons. Works without the scryer options. ', 'boolean', false, null, 'Daily');

    //Spire
    document.getElementById('dscryvoidmaps').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('dIgnoreSpiresUntil', 'Daily Ignore Spires Until', 'Spire specific settings like end-at-cell are ignored until at least this zone is reached in Dailies (0 to disable). ', 'value', '200', null, 'Daily');
    createSetting('dExitSpireCell', 'Daily Exit Spire Cell', 'What cell to exit spire in dailys. ', 'value', -1, null, 'Daily');
    createSetting('dPreSpireNurseries', 'Daily Nurseries pre-Spire', 'Set the maximum number of Nurseries to build for Spires in Dailies. Overrides No Nurseries Until z and Max Nurseries so you can keep them seperate! Disable with -1.', 'value', -1, null, 'Daily');

    //Windstacking
    document.getElementById('dPreSpireNurseries').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('use3daily', 'Daily Windstacking', '<b> This must be on for Daily windstacking settings to appear!</b> Overrides your Autostance settings to use the WS stance on Dailies. Make sure Windstack HD is set otherwise this does nothing. ', 'boolean', false, null, 'Daily');
    createSetting('dWindStackingMin', 'Daily Windstack Min Zone', 'For use with Windstacking Stance, enables windstacking in zones above and inclusive of the zone set for dailys. (Get specified windstacks then change to D, kill bad guy, then repeat). This is designed to force S use until you have specified stacks in wind zones, overriding scryer settings. All windstack settings apart from Daily WS MAX work off this setting. ', 'value', '-1', null, 'Daily');
    createSetting('dWindStackingMinHD', 'Daily Windstack H:D', 'For use with Windstacking Stance in Dailies, fiddle with this to maximise your stacks in wind zones for Dailies. If H:D is above this setting it will not use W stance. If it is below it will. Use something like 10 decillion if you just want to use W stance. ', 'value', '1e33', null, 'Daily');
    createSetting('dWindStackingMax', 'Daily Windstack Stacks', 'For use with Windstacking Stance in Dailies. Amount of windstacks to obtain before switching to D stance. Default is 200, but I recommend anywhere between 175-190. In Wind Enlightenment it will add 100 stacks to your total automatically. So if this setting is 200 It will assume you want 300 stacks instead during enlightenment. ', 'value', '200', null, 'Daily');
    createSetting('dwindcutoff', 'Daily Wind Damage Cutoff', 'Set this value to optimise your windstacking in dailys. Can work without Windstacking Stance, but not recommended. AT normally uses 4 as its cutoff. I.e if the cutoff is above 4 it will buy max equipment. If you set this to 160, it will not get more damage till you are above x160. Essentially, the higher the value, the less damage AT wants to get, this will enable you to windstack to incredibly high amounts. -1 to disable/go back to default. Must set your windstacking min zone to use. ', 'value', '-1', null, 'Daily');
    createSetting('dwindcutoffmap', 'Daily Wind Map Cutoff', 'Set this value to optimise your windstacking in dailys. Can work without Windstacking Stance, but not recommended. AT normally uses 4 as its cutoff. I.e if the cutoff is above 4 it will do map bonus. If you set this to 160, it will not do maps till you are above x160. Essentially, the higher the value, the less damage AT wants to get, this will enable you to windstack to incredibly high amounts. -1 to disable/go back to default. Must set your windstacking min zone to use. ', 'value', '-1', null, 'Daily');
    createSetting('liqstack', 'Stack Liquification', 'Stack Wind zones during Wind Enlight during Liquification. ', 'boolean', false, null, 'Daily');
    createSetting('dwsmax', 'Daily WS MAX', 'For maximising Windstacking an entire Daily. Withholds damage to try and get your max windstacks every wind zone. Not recommended for terrible Dailies. ', 'value', '-1', null, 'Daily');
    createSetting('dwsmaxhd', 'Daily WSM H:D', 'Fiddle with this to maximise your DWSM settings. Default is 0.00025. ', 'value', '-1', null, 'Daily');

    //Raiding
    document.getElementById('dwsmaxhd').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('dPraidingzone', 'Daily P Raiding Z', 'Raids Maps for prestiges at zone specified in Dailies. Example: 495, will raid Maps at 501. Once all gear is obtained from the map, it will revert back to regular farming. Extremely helpful for spire. Best used in poison zones. <b>You can use multiple values like this 495,506,525! </b>', 'multiValue', [-1], null, 'Daily');
    createSetting('dPraidingcell', 'Daily P Raiding Cell', 'What Cell to start P Raiding at. Recommend below your BW Raiding cell if used together. -1 to Raid at cell 1. ', 'value', -1, null, 'Daily');
    createSetting('dPraidingHD', 'Daily P Raiding HD', 'Checks if you can raid the map. If your HD value (calculated using the maps you will raid) is below this value it will not buy the map and you will stop raiding. The higher this value the higher zones it will raid. Can raid up to +10 depending on the zone. -1 or 0 to remove this check.', 'value', -1, null, 'Daily');
    createSetting('dPraidingP', 'Daily P Raiding Poison', 'Maximum level of map to P Raid at in Poison. If this value is 10 it will be able to go to +10 maps in Poison. You should use this instead of the HD function if you feel the calculations are off, but you can use both if needed. -1 or 0 to have no max. ', 'value', -1, null, 'Daily');
    createSetting('dPraidingI', 'Daily P Raiding Ice', 'Maximum level of map to P Raid at in Ice. If this value is 10 it will be able to go to +10 maps in Ice. You should use this instead of the HD function if you feel the calculations are off, but you can use both if needed. -1 or 0 to have no max. ', 'value', -1, null, 'Daily');
    createSetting('dPraidHarder', 'Daily Hardcore P Raiding', '(EXPERIMENTAL) P Raid Harder: When enabled, always buys the highest prestige map we can afford when P raiding, with option to farm fragments for highest available prestige level.', 'boolean', false, null, 'Daily');
    createSetting('dMaxPraidZone', 'Daily Max P Raid Z', 'List of maximum zones to Praid on Dailies corresponding to the list specified in Daily Praiding Z.  e.g. if Daily P raiding Z setting is 491,495 and this setting is 495,505, AT will P raid up to 495 from 491, and 505 from 495.  Set to -1 to always buy highest available prestige map.  If no corrsponding value, or value is invalid, defaults to max available (up to +10)', 'multiValue', [-1], null, 'Daily');
    createSetting('dPraidFarmFragsZ', 'Daily Farm Frags Z', 'P Raiding harder: List of zones where we should farm fragments until we can afford the highest or target prestige map for P raiding. Set to -1 to never farm fragments.', 'multiValue', [-1], null, 'Daily');
    createSetting('dPraidBeforeFarmZ', 'Dy Raid bef farm Z', 'P Raiding harder: List of zones where we should P Raid as far as we can afford before trying to farm fragments to Praid the highest or target prestige map.  Only occasionally useful, e.g. if it picks up a Speedexplorer or farming fragments is slow due to low damage. Set to -1 to never raid prestiges before farming fragents.', 'multiValue', [-1], null, 'Daily');
    createSetting('Dailybwraid', 'Daily BW Raid', 'Toggle for Daily BW Raid settings. Turn off Climb BW. ', 'boolean', false, null, 'Daily');
    createSetting('dbwraidcell', 'Daily BW Raiding Cell', 'What Cell to start BW Raiding at. Recommend above your P Raiding cell if used together. -1 to Raid at cell 1. ', 'value', -1, null, 'Daily');
    createSetting('dBWraidingz', 'Daily Z to BW Raid', 'Raids BWs at zone specified in dailys. Example: 495, will raid all BWs for all gear starting from 495. Will skip lower BWs if you have enough damage. Once all gear is obtained, will return to regular farming. Accepts comma separated lists, and raids up to the value in the corrsponding position in the Max BW to raid setting. So if this is set to 480,495 and Daily Max BW to Raid is set to 500,515 AT will BW raid up to 500 from 480, and 515 from 495. Make sure these lists are the same length or BW raiding may fail.', 'multiValue', [-1], null, 'Daily');
    createSetting('dBWraidingmax', 'Daily Max BW to raid', 'Raids BWs until zone specified in dailys. Example: 515, will raid all BWs for all gear until 515. Will skip lower BWs if you have enough damage. Once all gear is obtained, will return to regular farming. Now accepts comma separated lists - see description of Daily Z to BW raid setting for details.', 'multiValue', [-1], null, 'Daily');

    //Shrine - U1 (Daily)
    document.getElementById('dBWraidingmax').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Hdshrine', ['Daily AutoShrine Off', 'Daily AutoShrine On', 'DAS: Normal'], 'Turn this on if you want to use Shrines automatically in Dailies. Use DAS: Normal if you want to use the settings in the Maps tab if do not wish to copy them here. ', 'multitoggle', 0, null, 'Daily');
    createSetting('Hdshrinemaz', 'Daily AutoShrine Settings', 'Click to open Daily AutoShrine settings. <br> <b>Zone:</b> What zone to use Bone Shrine charges. <br> <b>Cell:</b> What cell to use Bone Shrine charges at, if you use it after cell 80 you will get the benefit of all the books. to use. <br> <b>Amount:</b> How many Bone Shrine charges you wish to use. <br> <b>Example:</b> If you put Zone: 40\, Cell: 10\, Amount: 3\, you will use 3 Bone Shrine Charges at zone 40 at cell 10 in a Daily. ', 'infoclick', false, null, 'Daily');
    createSetting('Hdshrinezone', 'AutoShrine: Zone', 'zone', 'multiValue', [-1], null, 'Daily');
    createSetting('Hdshrinecell', 'AutoShrine: Cell', 'cell', 'multiValue', [-1], null, 'Daily');
    createSetting('Hdshrineamount', 'AutoShrine: Amount', 'amount', 'multiValue', [-1], null, 'Daily');

    //RDaily

    //Line 1
    createSetting('buyradony', 'Buy Radonculous %', 'Buys the Radonculous bonus for <b>100 bones</b> when Daily bonus is above the value set in this setting. Recommend anything above 475. Will not buy if you cant afford to, or value is -1. ', 'value', -1, null, 'Daily');
    createSetting('Rdfightforever', ['DFA: Off', 'DFA: Non-Empowered', 'DFA: All Dailies'], 'Daily Fight Always. Sends trimps to fight if they\'re not fighting in Daily challenges similar to Toxicity/Nom but not on Bloodthirst/Plagued/Bogged Dailies, regardless of BAF. Non-Empowered will only send to fight if the Daily is not Empowered. Essenitally the same as the one in combat, can use either if you wish, except this will only activate in these daily challenges (duh) ', 'multitoggle', '0', null, 'Daily');
    createSetting('Ravoidempower', 'Avoid Empower', 'Tries to avoid Empower stacks in Empower Dailies. No harm in this being on, so default is On. ', 'boolean', true, null, 'Daily');
    createSetting('Rdarmormagic', ['Daily Armor Magic Off', 'DAM: Above 80%', 'DAM: H:D', 'DAM: Always'], 'Will buy Armor to try and prevent death on Bleed/Plague/Bogged Dailies under the 3 conditions. <br><b>Above 80%:</b> Will activate at and above 80% of your HZE. <br><b>H:D:</b> Will activate at and above the H:D you have defined in maps. <br><b>Always</b> Will activate always. <br>All options will activate at or <b>below 25% of your health.</b> ', 'multitoggle', 0, null, "Daily");

    //dRaiding
    document.getElementById('Rdarmormagic').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('RdAMPraid', ['Daily Praiding Off', 'Daily Praiding On', 'DPR: Normal'], '<b>MASTER BUTTON</b><br>Toggle Daily Prestige Raiding. Use DPR: Zone, DPR: Raid and DPR: Cell to Raid Prestiges in higher Maps.<br> I.e: World is 95, DPR: Zone is [95,105], DPR: Raid is [105,115], DPR: Cell is 1. Will go into map creation at cell 1, create maps 101, 102, 103, 104, 105 with Prestige option. If you can\'t afford P maps, it will try without. If still unable to afford will buy the highest maps first without buying 101 and 102 for example. Raiding will take longer if you can\'t afford it. Once all maps are created it will run the lowest created then move onto the next till all created maps are finished. If you have enabled DPR: Recycle it will then recycle those maps. DPR: Normal will use the settings in Raiding tab so if they are the same you do not have to copy them over. ', 'multitoggle', 0, null, 'Daily');
    createSetting('RdAMPraidmaz', 'Daily Praiding Settings', 'Click to open the Daily Praiding settings. ', 'infoclick', false, null, 'Daily');
    createSetting('RdAMPraidzone', 'DPR: Zone', 'Zones to Prestige Raid. Can use 95,105,115! ', 'multiValue', [-1], null, 'Daily');
    createSetting('RdAMPraidraid', 'DPR: Raid', 'What Maps to Raid. Corrosponds to PR: Zone, so first value will corrospond to first value in PR: Zone. Can use 105,115,125! ', 'multiValue', [-1], null, 'Daily');
    createSetting('RdAMPraidcell', 'DPR: Cell', 'What Cell to start Prestige Raiding at. -1 to Raid at cell 1. ', 'multiValue', [-1], null, 'Daily');
    createSetting('RdAMPraidfrag', ['DPR: Frag', 'DPR: Frag Min', 'DPR: Frag Max'], 'Farm for fragments to afford the maps you want to create. DPR: Frag Min is used for absolute minimum frag costs (which includes no Prestige special, perfect sliders, random map and the difficulty and size options, however it will try to afford those options first!) and prioritises buying the most maps for a smoother sequential raid. DPR: Frag Max is used for the ultimate Raiding experience. This option will probably take the most time to farm but may save you time in the actual raid. I would recommend using Min Mode if you don\'t have frag drop or explorer effic on your heirloom and Max if you are confident in your Fragment gains. ', 'multitoggle', 0, null, 'Daily');
    createSetting('RdAMPraidrecycle', 'DPR: Recycle', 'Recycle maps created in Daily Prestige Raiding. ', 'boolean', false, null, 'Daily');

    //dTimefarm
    document.getElementById('RdAMPraidrecycle').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Rdtimefarm', ['Daily Time Farm Off', 'Daily Time Farm On', 'DTF: Normal'], 'Turn this on if you want to use Daily Time Farming. Use DTF: Normal if you want to use the settings in the Maps tab if do not wish to copy them here. ', 'multitoggle', 0, null, 'Daily');
    createSetting('Rdtimefarmmaz', 'DTM Settings', 'Click to open the Daily Time Farm settings. It will also put all your workers into what you are gathering. <br> <b>Zone:</b> What zone to start time farming. <br> <b>Cell:</b> What cell to start time farming at. <br> <b>Time:</b> How much time in Minutes to farm. <br> <b>Level:</b> How many map levels above your zone to use. <br> <b>Map:</b> What kind of map you want to use. <br> <b>Special:</b> What type of special you want to use. <br> <b>Gather:</b> What resource you would like to gather. <br> <b>Example:</b> If you put Zone: 60\, Cell: 10\, Time: 3\, Level: 5\, Map: Gardens\, Special: Large Metal Cache\, Gather: Metal\, while in a Daily you will farm at zone 60 at cell 10 for 3 minutes in a +5 Gardens map that has a Large Metal Cache while gathering metal. ', 'infoclick', false, null, 'Daily');
    createSetting('Rdtimefarmzone', 'DTF: Zone', 'zone', 'multiValue', [-1], null, 'Daily');
    createSetting('Rdtimefarmcell', 'DTF: Cell', 'cell', 'multiValue', [-1], null, 'Daily');
    createSetting('Rdtimefarmtime', 'DTF: Time', 'time', 'multiValue', [-1], null, 'Daily');
    createSetting('Rdtimefarmlevel', 'DTF: Map Level', 'level', 'multiValue', [0], null, 'Daily');
    createSetting('Rdtimefarmmap', 'DTF: Map Selection', 'map', 'textValue', 'undefined', null, 'Daily');
    createSetting('Rdtimefarmspecial', 'DTF: Special Selection', 'special', 'textValue', 'undefined', null, 'Daily');
    createSetting('Rdtimefarmgather', 'DTF: Gather Selection', 'gather', 'textValue', 'undefined', null, 'Daily');


    //Heirloom
    createSetting('dhighdmg', 'DHS: High Damage', '<b>HIGH DAMAGE HEIRLOOM</b><br><br>Enter the name of your high damage heirloom. This is your heirloom that you will use normally in dailies. ', 'textValue', 'undefined', null, 'Daily');
    createSetting('dlowdmg', 'DHS: Low Damage', '<b>LOW DAMAGE HEIRLOOM</b><br><br>Enter the name of your low damage heirloom. This is the heirloom that you will use for windstacking in dailies. ', 'textValue', 'undefined', null, 'Daily');


    //RHeirloom
    document.getElementById('dlowdmg').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Rdhs', ['DHS: Off', 'DHS: On', 'DHS: Normal'], 'Heirloom swapping master button for Dailies. Turn this on to allow heirloom swapping and its associated settings. Use DHS: Normal to use the non-daily settings. ', 'multitoggle', 0, null, 'Daily');

    //DShield Swapping
    document.getElementById('Rdhs').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Rdhsshield', 'Daily Shields', 'Toggle to swap Shields in Dailies', 'boolean', false, null, 'Daily');
    createSetting('Rdhsz', 'DHSh: Zone', 'Which zone to swap from your first heirloom you have defined to your second heirloom you have defined. I.e if this value is 75 it will switch to the second heirloom <b>on z75</b>', 'value', '-1', null, 'Daily');
    createSetting('Rdhs1', 'DHSh: First', '<b>First Heirloom to use</b><br><br>Enter the name of your first heirloom. This is the heirloom that you will use before swapping to the second heirloom at the zone you have defined in the HS: Zone. ', 'textValue', 'undefined', null, 'Daily');
    createSetting('Rdhs2', 'DHSh: Second', '<b>Second Heirloom to use</b><br><br>Enter the name of your second heirloom. This is the heirloom that you will use after swapping from the first heirloom at the zone you have defined in the HS: Zone. ', 'textValue', 'undefined', null, 'Daily');

    //DStaff Swapping
    document.getElementById('Rdhs2').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Rdhsstaff', 'Daily Staffs', 'Toggle to swap Staffs', 'boolean', false, null, 'Daily');
    createSetting('Rdhsworldstaff', 'DHSt: World', '<b>World Staff</b><br><br>Enter the name of your world staff for Dailies.', 'textValue', 'undefined', null, 'Daily');
    createSetting('Rdhsmapstaff', 'DHSt: Map', '<b>Mapping staff</b><br><br>Enter the name of your mapping staff for Dailies.', 'textValue', 'undefined', null, 'Daily');
    createSetting('Rdhstributestaff', 'DHSt: Tribute', '<b>Tribute farming staff</b><br><br>Enter the name of the staff you would like to equip during tribute farming for Dailies', 'textValue', 'undefined', null, 'Daily');

    //Shrine - U2 (Daily)
    document.getElementById('Rdhstributestaff').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Rdshrine', ['Daily AutoShrine Off', 'Daily AutoShrine On', 'DAS: Normal'], 'Turn this on if you want to use Shrines automatically in Dailies. Use DAS: Normal if you want to use the settings in the Maps tab if do not wish to copy them here. ', 'multitoggle', 0, null, 'Daily');
    createSetting('Rdshrinemaz', 'Daily AutoShrine Settings', 'Click to open Daily AutoShrine settings. <br> <b>Zone:</b> What zone to use Bone Shrine charges. <br> <b>Cell:</b> What cell to use Bone Shrine charges at, if you use it after cell 80 you will get the benefit of all the books. to use. <br> <b>Amount:</b> How many Bone Shrine charges you wish to use. <br> <b>Example:</b> If you put Zone: 40\, Cell: 10\, Amount: 3\, you will use 3 Bone Shrine Charges at zone 40 at cell 10 in a Daily. ', 'infoclick', false, null, 'Daily');
    createSetting('Rdshrinezone', 'AutoShrine: Zone', 'zone', 'multiValue', [-1], null, 'Daily');
    createSetting('Rdshrinecell', 'AutoShrine: Cell', 'cell', 'multiValue', [-1], null, 'Daily');
    createSetting('Rdshrineamount', 'AutoShrine: Amount', 'amount', 'multiValue', [-1], null, 'Daily');

    //Portal Line
    document.getElementById('Rdshrineamount').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('AutoStartDaily', 'Auto Start Daily', 'Starts Dailies for you. When you portal with this on, it will select the oldest Daily and run it. Use the settings in this tab to decide whats next. ', 'boolean', false, null, 'Daily');
    createSetting('u2daily', 'Daily in U2', 'If this is on, you will do your daily in U2. ', 'boolean', false, null, 'Daily');
    createSetting('AutoPortalDaily', ['Daily Portal Off', 'DP: He/Hr', 'DP: Custom'], '<b>DP: He/Hr:</b> Portals when your world zone is above the minium you set (if applicable) and the buffer falls below the % you have defined. <br><b>DP: Custom:</b> Portals after clearing the zone you have defined in Daily Custom Portal. ', 'multitoggle', '0', null, "Daily");
    createSetting('dHeliumHourChallenge', 'DP: Challenge', 'Automatically portal into this challenge when using helium per hour or custom autoportal in dailies when there are none left. Custom portals after cell 100 of the zone specified. Do not choose a challenge if you havent unlocked it. ', 'dropdown', 'None', ['None', 'Balance', 'Decay', 'Electricity', 'Life', 'Crushed', 'Nom', 'Toxicity', 'Watch', 'Lead', 'Corrupted', 'Domination', 'Experience'], "Daily");
    createSetting('dCustomAutoPortal', 'Daily Custom Portal', 'Automatically portal AFTER clearing this level in dailies. (ie: setting to 200 would portal when you first reach level 201)', 'value', '999', null, "Daily");
    createSetting('dHeHrDontPortalBefore', 'D: Don\'t Portal Before', 'Do NOT allow Helium per Hour Daily AutoPortal setting to portal BEFORE this level is reached in dailies. It is an additional check that prevents drops in helium/hr from triggering autoportal in dailies. Set to 0 or -1 to completely disable this check. (only shows up with Helium per Hour set in dailies)', 'value', '999', null, "Daily");
    createSetting('dHeliumHrBuffer', 'D: He/Hr Portal Buffer %', 'IMPORTANT SETTING. When using the Daily He/Hr Autoportal, it will portal if your He/Hr drops by this amount of % lower than your best for current run in dailies, default is 0% (ie: set to 5 to portal at 95% of your best in dailies). Now with stuck protection - Allows portaling midzone if we exceed set buffer amount by 5x. (ie a normal 2% buffer setting would now portal mid-zone you fall below 10% buffer).', 'value', '0', null, 'Daily');
    createSetting('DailyVoidMod', 'Daily Void Zone', 'What zone to do void maps in dailies. Disable with -1', 'value', -1, null, 'Daily');
    createSetting('dvoidscell', 'Daily Voids Cell', 'Run Voids at this Cell. -1 to run them at the default value, which is 70. ', 'value', '-1', null, 'Daily');
    createSetting('dRunNewVoidsUntilNew', 'Daily New Voids Mod', '<b>0 to disable. Positive numbers are added to your Void Map zone. -1 for no cap.</b> This allows you to run new Void Maps in Dailies obtained after your Void Map zone by adding this number to your Void Map zone. <br> <b>Example</b> Void map zone=187 and This setting=10. New Voids run until 197).<br>This means that any new void maps gained until Z197. CAUTION: May severely slow you down by trying to do too-high level void maps. Default 0 (OFF).', 'value', '0', null, 'Daily');
    createSetting('drunnewvoidspoison', 'New Voids Poison', 'Only run new voids in poison zones.', 'boolean', false, null, 'Daily');

    //RPortal Line
    document.getElementById('dlowdmg').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('RAutoStartDaily', 'Auto Start Daily', 'Starts Dailies for you. When you portal with this on, it will select the oldest Daily and run it. Use the settings in this tab to decide whats next. ', 'boolean', false, null, 'Daily');
    createSetting('u1daily', 'Daily in U1', 'If this is on, you will do your daily in U1. ', 'boolean', false, null, 'Daily');
    createSetting('RAutoPortalDaily', ['Daily Portal Off', 'DP: Rn/Hr', 'DP: Custom'], '<b>DP: Rn/Hr:</b> Portals when your world zone is above the minium you set (if applicable) and the buffer falls below the % you have defined. <br><b>DP: Custom:</b> Portals after clearing the zone you have defined in Daily Custom Portal. ', 'multitoggle', '0', null, "Daily");
    createSetting('RdHeliumHourChallenge', 'DP: Challenge', 'Automatically portal into this challenge when using radon per hour or custom autoportal in dailies when there are none left. Custom portals after cell 100 of the zone specified. Do not choose a challenge if you havent unlocked it. ', 'dropdown', 'None', ['None', 'Bublé', 'Melt', 'Quagmire', 'Archaeology', 'Insanity', 'Nurture', 'Alchemy', 'Hypothermia'], "Daily");
    createSetting('RdCustomAutoPortal', 'Daily Custom Portal', 'Automatically portal AFTER clearing this level in dailies. (ie: setting to 200 would portal when you first reach level 201)', 'value', '999', null, "Daily");
    createSetting('RdHeHrDontPortalBefore', 'D: Don\'t Portal Before', 'Do NOT allow Radon per Hour Daily AutoPortal setting to portal BEFORE this level is reached in dailies. It is an additional check that prevents drops in radon/hr from triggering autoportal in dailies. Set to 0 or -1 to completely disable this check. (only shows up with Radon per Hour set in dailies)', 'value', '999', null, "Daily");
    createSetting('RdHeliumHrBuffer', 'D: Rn/Hr Portal Buffer %', 'IMPORTANT SETTING. When using the Daily Rn/Hr Autoportal, it will portal if your Rn/Hr drops by this amount of % lower than your best for current run in dailies, default is 0% (ie: set to 5 to portal at 95% of your best in dailies). Now with stuck protection - Allows portaling midzone if we exceed set buffer amount by 5x. (ie a normal 2% buffer setting would now portal mid-zone you fall below 10% buffer).', 'value', '0', null, 'Daily');
    createSetting('RDailyVoidMod', 'Daily Void Zone', 'What zone to do void maps in dailies. Disable with -1', 'value', -1, null, 'Daily');
    createSetting('RdRunNewVoidsUntilNew', 'Daily New Voids Mod', '<b>0 to disable. Positive numbers are added to your Void Map zone. -1 for no cap.</b> This allows you to run new Void Maps in Dailies obtained after your Void Map zone by adding this number to your Void Map zone. <br> <b>Example</b> Void map zone=187 and This setting=10. New Voids run until 197).<br>This means that any new void maps gained until Z197. CAUTION: May severely slow you down by trying to do too-high level void maps. Default 0 (OFF).', 'value', '0', null, 'Daily');



    //C2

    //Line 1
    createSetting('FinishC2', 'Finish Challenge2', '<b>DONT USE THIS WITH C2 RUNNER</b><br>Finish / Abandon Challenge2 (any) when this zone is reached, if you are running one. For manual use. Recommended: Zones ending with 0 for most Challenge2. Disable with -1. Does not affect Non-Challenge2 runs.', 'value', -1, null, 'C2');
    createSetting('buynojobsc', 'No F/L/M in C2', 'Buys No Farmers, Lumberjacks or Miners in the C2 challenges Watch and Trapper. ', 'boolean', 'false', null, "C2");
    createSetting('cfightforever', 'Tox/Nom Fight Always', 'Sends trimps to fight if they\'re not fighting in the Toxicity and Nom Challenges, regardless of BAF. Essenitally the same as the one in combat, can use either if you wish, except this will only activate in these challenges (duh) ', 'boolean', 'false', null, 'C2');
    createSetting('carmormagic', ['C2 Armor Magic Off', 'CAM: Above 80%', 'CAM: H:D', 'CAM: Always'], 'Will buy Armor to try and prevent death on Nom/Tox Challenges under the 3 conditions. <br><b>Above 80%:</b> Will activate at and above 80% of your HZE and when your health is sufficiently low. <br><b>H:D:</b> Will activate at and above the H:D you have defined in maps. <br><b>Always</b> Will activate always. <br>All options will activate at or <b>below 25% of your health.</b> ', 'multitoggle', 0, null, "C2");
    createSetting('mapc2hd', 'Mapology H:D', 'Set your H:D ratio for Mapology. Will not go into maps unless your H:D ratio is above this. -1 to use normal behaviour. ', 'value', '-1', null, 'C2');
    createSetting('novmsc2', 'No VMs', 'Turn off VM running for C2s. Handy for the C2 Runner. ', 'boolean', 'false', null, "C2");

    //C2 Runner Line
    document.getElementById('novmsc2').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('c2runnerstart', 'C2 Runner', 'Runs the normal C2s in sequence according to difficulty. See C2Table for list. Once zone you have defined has been reached, will portal into next. I will advise you not to touch the challenges (abandoning, doing a different one, etc) if you are running this, it could break it. Only runs challenges that need updating, will not run ones close-ish to your HZE. ', 'boolean', false, null, 'C2');
    createSetting('c2runnerportal', 'C2 Runner Portal', 'Automatically portal AFTER clearing this level in C2 Runner. (ie: setting to 200 would portal when you first reach level 201)', 'value', '999', null, "C2");
    createSetting('c2runnerpercent', 'C2 Runner %', 'What percent Threshhold you want C2s to be over. E.g 85, will only run C2s with HZE% below this number. Default is 85%. Must have a value set for C2 Runner to... well, run. ', 'value', '85', null, "C2");
    createSetting('c2table', 'C2 Table', 'Display your C2s and C3s in a convenient table which is colour coded. <br><b>Green</b> = Not worth updating. <br><b>Yellow</b> = Consider updating. <br><b>Red</b> = Updating this C2/C3 is worth doing. <br><b>Blue</b> = You have not yet done/unlocked this C2/C3 challenge. ', 'infoclick', 'c2table', null, 'C2');



    //Buildings

    //Line 1
    createSetting('hidebuildings', 'Hide Buildings', 'If you have unlocked Autostructure and Decabuild, this setting will appear and enable you to hide the now obsolete building settings, so please use AutoStructure instead. The settings will only disappear if you disable the buy buildings button and turn this on. It will not hide the Gym settings as Autostructure does not allow you to customize how you buy them. ', 'boolean', false, null, "Buildings");
    createSetting('BuyBuildingsNew', ['Buy Neither', 'Buy Buildings & Storage', 'Buy Buildings', 'Buy Storage'], 'AutoBuys Storage when it is almost full (it even anticipates Jestimp) and Non-Storage Buildings (As soon as they are available). Takes cost efficiency into account before buying Non-Storage Buildings.', 'multitoggle', 1, null, "Buildings");
    createSetting('WarpstationCap', 'Warpstation Cap', 'Do not level Warpstations past Basewarp+DeltaGiga **. Without this, if a Giga wasnt available, it would level infinitely (wastes metal better spent on prestiges instead.) **The script bypasses this cap each time a new giga is bought, when it insta-buys as many as it can afford (since AT keeps available metal/gems to a low, overbuying beyond the cap to what is affordable at that first moment is not a bad thing). ', 'boolean', true, null, 'Buildings');
    createSetting('WarpstationCoordBuy', 'Buy Warp to Hit Coord', 'If we are very close to hitting the next coordination, and we can afford the warpstations it takes to do it, Do it! (even if we are over the Cap/Wall). Recommended with WarpCap/WarpWall. (has no point otherwise) ', 'boolean', true, null, 'Buildings');
    createSetting('MaxHut', 'Max Huts', 'Huts', 'value', '100', null, "Buildings");
    createSetting('MaxHouse', 'Max Houses', 'Houses', 'value', '100', null, "Buildings");
    createSetting('MaxMansion', 'Max Mansions', 'Mansions', 'value', '100', null, "Buildings");
    createSetting('MaxHotel', 'Max Hotels', 'Hotels', 'value', '100', null, "Buildings");

    //Line 2
    createSetting('MaxResort', 'Max Resorts', 'Resorts', 'value', '100', null, "Buildings");
    createSetting('MaxGateway', 'Max Gateways', 'Gateways', 'value', '25', null, "Buildings");
    createSetting('MaxWormhole', 'Max Wormholes', 'WARNING: Wormholes cost helium! Values below 0 do nothing.', 'value', '0', null, "Buildings");
    createSetting('MaxCollector', 'Max Collectors', 'recommend: -1', 'value', '-1', null, "Buildings");
    createSetting('MaxGym', 'Max Gyms', 'Advanced. recommend: -1', 'value', '-1', null, "Buildings");
    createSetting('MaxTribute', 'Max Tributes', 'Advanced. recommend: -1 ', 'value', '-1', null, "Buildings");
    createSetting('GymWall', 'Gym Wall', 'Conserves Wood. Only buys 1 Gym when you can afford <b>X</b> gyms wood cost (at the first one\'s price, simple math). -1 or 0 to disable. In other words, only allows gyms that cost less than 1/nth your currently owned wood. (to save wood for nurseries for new z230+ Magma nursery strategy). Takes decimal numbers. (Identical to the Warpstation wall setting which is why its called that). Setting to 1 does nothing besides stopping gyms from being bought 2 at a time due to the mastery.', 'value', -1, null, 'Buildings'); //remove?

    //Line 3
    createSetting('FirstGigastation', 'First Gigastation', 'How many warpstations to buy before your first gigastation', 'value', '20', null, "Buildings");
    createSetting('DeltaGigastation', 'Delta Gigastation', '<b>YOU MUST HAVE BUY UPGRADES ENABLED!</b><br> How many extra warpstations to buy for each gigastation. Supports decimal values. For example 2.5 will buy +2/+3/+2/+3...', 'value', '2', null, "Buildings");
    createSetting('AutoGigas', 'Auto Gigas', "Advanced. <br>If enabled, AT will buy its first Gigastation if: <br>A) Has more than 2 Warps & <br>B) Can't afford more Coords & <br>C) (Only if Custom Delta Factor > 20) Lacking Health or Damage & <br>D) (Only if Custom Delta Factor > 20) Has run at least 1 map stack or <br>E) If forced to by using the firstGiga(true) command in the console. <br>Then, it'll calculate the delta based on your Custom Delta Factor and your Auto Portal/VM zone (whichever is higher), or Daily Auto Portal/VM zone, or C2 zone, or Custom AutoGiga Zone.", 'boolean', 'true', null, 'Buildings');
    createSetting('CustomTargetZone', 'Custom Target Zone', 'To be used with Auto Gigas. <br>The zone to be used as a the target zone when calculating the Auto Gigas delta. <br>Values below 60 will be discarded.', 'value', '-1', null, "Buildings");
    createSetting('CustomDeltaFactor', 'Custom Delta Factor', 'Advanced. To be used with Auto Gigas. <br>This setting is used to calculate a better Delta. Think of this setting as how long your target zone takes to complete divided by the zone you bought your first giga in. <br>Basically, a higher number means a higher delta. Values below 1 will default to 10. <br><b>Recommended: 1-2 for very quick runs. 5-10 for regular runs where you slow down at the end. 20-100+ for very pushy runs.</b>', 'value', '-1', null, "Buildings");
    createSetting('WarpstationWall3', 'Warpstation Wall', 'Conserves Metal. Only buys 1 Warpstation when you can afford <b>X</b> warpstations metal cost (at the first one\'s price, simple math). -1, 0, 1 = disable. In other words, only allows warps that cost less than 1/nth your currently owned metal. (to save metal for prestiges)', 'value', -1, null, 'Buildings');
    createSetting('MaxNursery', 'Max Nurseries', 'Advanced. Recommend: -1 until you reach Magma (z230+)', 'value', '-1', null, "Buildings");

    //Line 4
    createSetting('NurseryWall', 'Nursery Wall', 'Only spends N% of resources on nurseries. N being this setting. ', 'value', -1, null, 'Buildings');
    createSetting('NoNurseriesUntil', 'No Nurseries Until z', 'Builds Nurseries starting from this zone. -1 to build from when they are unlocked. ', 'value', '-1', null, 'Buildings');

    //RBuildings

    //Line 1
    createSetting('RBuyBuildingsNew', 'AutoBuildings', 'Buys buildings in an efficient way. Also enables Vanilla AutoStorage if its off. ', 'boolean', 'true', null, "Buildings");
    createSetting('RMaxHut', 'Max Huts', 'Huts', 'value', '100', null, "Buildings");
    createSetting('RMaxHouse', 'Max Houses', 'Houses', 'value', '100', null, "Buildings");
    createSetting('RMaxMansion', 'Max Mansions', 'Mansions', 'value', '100', null, "Buildings");
    createSetting('RMaxHotel', 'Max Hotels', 'Hotels', 'value', '100', null, "Buildings");
    createSetting('RMaxResort', 'Max Resorts', 'Resorts', 'value', '100', null, "Buildings");
    createSetting('RMaxGateway', 'Max Gateways', 'Gateways', 'value', '25', null, "Buildings");

    //Line 2
    createSetting('RMaxCollector', 'Max Collectors', 'recommend: -1', 'value', '-1', null, "Buildings");
    createSetting('RMaxTribute', 'Max Tributes', 'Advanced. recommend: -1 ', 'value', '-1', null, "Buildings");
    createSetting('RMaxLabs', 'Max Labs', 'It is about 10 labs per level at level 10 plus. ', 'value', '0', null, "Buildings");
    createSetting('Rmeltsmithy', 'Melt Smithy', 'Run the Melting Point Map to gain one extra Smithy when at or above this value. ', 'value', '-1', null, "Buildings");
    createSetting('Rsmithylogic', 'Smithy Savings', '<b>ABSOLUTELY WILL NOT WORK IN TESTING!</b><br>Uses Smithy Saving logic when this is turned on. Make sure every SS setting is set above 0 or it wont work. This feature will stop using resources on items needed for Smithy when you have reached the targets you have selected.', 'boolean', 'false', null, "Buildings");
    createSetting('Rsmithynumber', 'SS: Number', 'Start SS at this number of Smithys. I.e 9, will buy anything regardless of Smithy before having 9 Smithys. After 9 has been reached will start to save up for them. ', 'value', '-1', null, "Buildings");
    createSetting('Rsmithypercent', 'SS: Percent', 'If you have SS enabled this value will allow items below this value to be purchased. I.e if this is set to 1, it will only buy items if that item is 1% of Smithys cost or lower. ', 'value', '-1', null, "Buildings");
    createSetting('Rsmithyseconds', 'SS: Seconds', 'How many seconds SS starts activating at. I.e 120, if your Smithy is 120 seconds away from being purchased SS will kick in. ', 'value', '-1', null, "Buildings");



    //Jobs

    //Line 1
    createSetting('fuckjobs', 'Hide Jobs', 'Hides obsolete settings when you have obtained the AutoJobs Mastery. It should be far better to use than AT, Especially on c2 Challenges like Watch. ', 'boolean', 'false', null, "Jobs");
    createSetting('BuyJobsNew', ['Don\'t Buy Jobs', 'Auto Worker Ratios', 'Manual Worker Ratios'], 'Manual Worker Ratios buys jobs for your trimps according to the ratios below, <b>Make sure they are all different values, if two of them are the same it might causing an infinite loop of hiring and firing!</b> Auto Worker ratios automatically changes these ratios based on current progress, <u>overriding your ratio settings</u>.<br>AutoRatios: 1/1/1 up to 300k trimps, 3/3/5 up to 3mil trimps, then 3/1/4 above 3 mil trimps, then 1/1/10 above 1000 tributes, then 1/2/22 above 1500 tributes, then 1/12/12 above 3000 tributes.<br>CAUTION: You cannot manually assign jobs with this, turn it off if you have to', 'multitoggle', 1, null, "Jobs");
    createSetting('AutoMagmamancers', 'Auto Magmamancers', 'Auto Magmamancer Management. Hires Magmamancers when the Current Zone time goes over 10 minutes. Does a one-time spend of at most 10% of your gem resources. Every increment of 10 minutes after that repeats the 10% hiring process. Magmamancery mastery is accounted for, with that it hires them at 5 minutes instead of 10. Disclaimer: May negatively impact Gem count.', 'boolean', true, null, 'Jobs');
    createSetting('FarmerRatio', 'Farmer Ratio', '', 'value', '1', null, "Jobs");
    createSetting('LumberjackRatio', 'Lumberjack Ratio', '', 'value', '1', null, "Jobs");
    createSetting('MinerRatio', 'Miner Ratio', '', 'value', '1', null, "Jobs");
    createSetting('MaxScientists', 'Max Scientists', 'Advanced. Cap your scientists (This is an absolute number not a ratio). recommend: -1 (infinite still controls itself)', 'value', '-1', null, "Jobs");
    createSetting('MaxExplorers', 'Max Explorers', 'Advanced. Cap your explorers (This is an absolute number not a ratio). recommend: -1', 'value', '-1', null, "Jobs");

    //Line 2
    createSetting('MaxTrainers', 'Max Trainers', 'Advanced. Cap your trainers (This is an absolute number not a ratio). recommend: -1', 'value', '-1', null, "Jobs");


    //RJobs

    //Line 1
    createSetting('RBuyJobsNew', ['Don\'t Buy Jobs', 'Auto Worker Ratios', 'Manual Worker Ratios'], 'Manual Worker Ratios buys jobs for your trimps according to the ratios below, <b>Make sure they are all different values, if two of them are the same it might causing an infinite loop of hiring and firing!</b> Auto Worker ratios automatically changes these ratios based on current progress, <u>overriding your ratio settings</u>.<br>AutoRatios: 1/1/1 up to 300k trimps, 3/3/5 up to 3mil trimps, then 3/1/4 above 3 mil trimps, then 1/1/10 above 1000 tributes, then 1/2/22 above 1500 tributes, then 1/12/12 above 3000 tributes.<br>CAUTION: You cannot manually assign jobs with this, turn it off if you have to', 'multitoggle', 1, null, "Jobs");
    createSetting('RFarmerRatio', 'Farmer Ratio', '', 'value', '1', null, "Jobs");
    createSetting('RLumberjackRatio', 'Lumberjack Ratio', '', 'value', '1', null, "Jobs");
    createSetting('RMinerRatio', 'Miner Ratio', '', 'value', '1', null, "Jobs");
    createSetting('RMaxExplorers', 'Max Explorers', 'Advanced. Cap your explorers (This is an absolute number not a ratio). recommend: -1', 'value', '-1', null, "Jobs");

    //Ships
    document.getElementById('RMaxExplorers').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Rshipfarmon', 'Ship Farming', 'Turn Ship Farming off or on. You need to have unlocked Large Savory Cache to use this. If you have not I would recommend Time Farm instead. ', 'boolean', 'false', null, "Jobs");
    createSetting('Rshipfarmzone', 'SF: Zone', 'Farms for specified worshippers in SF: Amount at zone according to this settings value. Can use 59,61,62. ', 'multiValue', [-1], null, 'Jobs');
    createSetting('Rshipfarmcell', 'SF: Cell', 'Ship Farm at this Cell. -1 to run them at the default value, which is 1. ', 'value', '-1', null, 'Jobs');
    createSetting('Rshipfarmamount', 'SF: Amount', 'How many Worshippers to farm up to at zone specified in SF. Can use 50,45,40. These values should match up to your SF zones. If using SF and SF: Amount examples (59 and 50 respectively) it will farm at z59 up to 50 Worshippers. Just use one 50 if you want it to farm to 50 everytime. ', 'multiValue', [-1], null, 'Jobs');
    createSetting('Rshipfarmlevel', 'SF: Map Level', 'What map level to use for SF. Can use -1,1,2. -1 to use a level down from world (Map Reducer mastery gives loot equal to world one level down), 0 to use world, 1 etc to use +maps. Using 0 by itself will use global level for all maps. ', 'multiValue', [0], null, 'Jobs');
    createSetting('Rshipfarmfrag', 'SF: Frags', '**Ship farming will create infinite maps if this isnt on** <br>Turn this on to farm fragments if you cannot afford the map you have selected for SF. ', 'boolean', 'false', null, 'Jobs');


    //Gear

    //Line 1
    createSetting('BuyArmorNew', ['Armor: Buy Neither', 'Armor: Buy Both', 'Armor: Prestiges', 'Armor: Levels'], 'AutoBuys Prestiges and Levels up the most cost efficient Armor available. Gymystic buying is controlled under this setting\'s prestige option', 'multitoggle', 1, null, "Gear"); //This should replace the two below
    createSetting('BuyWeaponsNew', ['Weapons: Buy Neither', 'Weapons: Buy Both', 'Weapons: Prestiges', 'Weapons: Levels'], 'AutoBuys Prestiges and Levels up the most cost efficient Weapon available.', 'multitoggle', 1, null, "Gear"); //This should replace the two below
    createSetting('CapEquip2', 'Weapon Level Cap', 'Do not level Weapons past this number. Helps stop wasting metal when the script levels-up equip High, only to prestige right after. Recommended value: earlygame 10, lategame: 100. Disable with -1 or 0. <b>NEW:</b> Also sub-caps to 10% of your number during liquified or overkilled(under 25sec) zones. This does not mean the script always hits the cap. Your Equip will now always be leveled to at least 2 since its the most effective level. It will only be leveled however if you dont have enoughDamage. But During Spire, everything will be leveled up to the cap.<br><b>Hidden var: </b>MODULES[\\"equipment\\"].capDivisor = 10; //number to divide your normal cap by.', 'value', 10, null, 'Gear');
    createSetting('CapEquiparm', 'Armor Level Cap', 'Do not level Armor past this number. Helps stop wasting metal when the script levels-up equip High, only to prestige right after. Recommended value: earlygame 10, lategame: 100. Disable with -1 or 0. <b>NEW:</b> Also sub-caps to 10% of your number during liquified or overkilled(under 25sec) zones. This does not mean the script always hits the cap. Your Equip will now always be leveled to at least 2 since its the most effective level. It will only be leveled however if you dont have enoughHealth. But During Spire, everything will be leveled up to the cap.<br><b>Hidden var: </b>MODULES[\\"equipment\\"].capDivisor = 10; //number to divide your normal cap by.', 'value', 10, null, 'Gear');
    createSetting('dmgcuntoff', 'Equipment Cut Off', 'Decides when to buy gear. 4 is default. This means it will take 1 hit to kill an enemy if in D stance. ', 'value', '4', null, 'Gear');
    createSetting('DynamicPrestige2', 'Dynamic Prestige z', 'Dynamic Prestige: <b>Set Target Zone number: Z #. (disable with 0 or -1)</b><br> Skip getting prestiges at first, and Gradually work up to the desired Prestige setting you have set (set the Prestige dropdown to the highest weapon you want to end up on at the target zone you set here). Runs with Dagger to save a significant amount of time until we need better gear, then starts increasing the prestige setting near the end of the run.  Examines which prestiges you have, how many missing ones youd need to achieve the desired target and starts running maps every zone (more maps for higher settings), Until the target prestige is reached. <b>Use Dagger or else</b>', 'value', -1, null, 'Gear');
    createSetting('Prestige', 'Prestige', 'Acquire prestiges through the selected item (inclusive) as soon as they are available in maps. Forces equip first mode. Automap must be enabled. THIS IS AN IMPORTANT SETTING related to speed climbing and should probably always be on something. If you find the script getting stuck somewhere, particularly where you should easily be able to kill stuff, setting this to an option lower down in the list will help ensure you are more powerful at all times, but will spend more time acquiring the prestiges in maps.', 'dropdown', 'Polierarm', ['Off', 'Supershield', 'Dagadder', 'Bootboost', 'Megamace', 'Hellishmet', 'Polierarm', 'Pantastic', 'Axeidic', 'Smoldershoulder', 'Greatersword', 'Bestplate', 'Harmbalest', 'GambesOP'], "Gear");

    //Line 2
    createSetting('ForcePresZ', 'Force Prestige Z', 'On and after this zone is reached, always try to prestige for everything immediately, ignoring Dynamic Prestige settings and overriding that of Linear Prestige. Prestige Skip mode will exit this. Disable with -1.', 'value', -1, null, 'Gear');
    createSetting('PrestigeSkip1_2', ['Prestige Skip Off', 'Prestige Skip 1 & 2', 'Prestige Skip 1', 'Prestige Skip 2'], '<b>Prestige Skip 1:</b> If there are more than 2 Unbought Prestiges (besides Shield), ie: sitting in your upgrades window but you cant afford them, AutoMaps will not enter Prestige Mode, and/or will exit from it. The amount of unboughts can be configured with this variable MODULES[\\"maps\\"].SkipNumUnboughtPrestiges = 2; <br><b>Prestige Skip 2:</b> If there are 2 or fewer <b>Unobtained Weapon Prestiges in maps</b>, ie: there are less than 2 types to run for, AutoMaps will not enter Prestige Mode, and/or will exit from it. For users who tends to not need the last few prestiges due to resource gain not keeping up. The amount of unboughts can be configured with MODULES.maps.UnearnedPrestigesRequired. If PrestigeSkipMode is enabled, both conditions need to be reached before exiting.', 'multitoggle', 0, null, "Gear");
    createSetting('DelayArmorWhenNeeded', 'Delay Armor Prestige', 'Delays buying armor prestige-upgrades during Want More Damage or Farming automap-modes, Although if you need health AND damage, it WILL buy armor prestiges tho. NOTE: <b>Applies to Prestiges only</b>', 'boolean', false, null, 'Gear');
    createSetting('BuyShieldblock', 'Buy Shield Block', 'Will buy the shield block upgrade. CAUTION: If you are progressing past zone 60, you probably don\'t want this :)', 'boolean', false, null, "Gear");
    createSetting('trimpsnotdie', 'Buy Armor on Death', 'Buys 10 levels of Armor when Trimps die. Useful when your trimps die frequentely. ', 'boolean', false, null, "Gear");
    createSetting('gearamounttobuy', 'Gear Levels to Buy', 'Set the amount of Gear Levels to buy for AT. I.e if set to 1 will buy 1 level at a time. Recommended value 1. <b>MUST ALWAYS HAVE A VALUE GREATER THAN 0! </b>', 'value', 1, null, "Gear");
    createSetting('always2', 'Always Level 2', 'Always buys level 2 of weapons and armor regardless of efficiency', 'boolean', false, null, "Gear");


    //RGear

    //Line 1
    createSetting('Requipon', 'AutoEquip', 'AutoEquip. Buys Prestiges and levels equipment according to various settings. Will only buy prestiges if it is worth it. Levels all eqiupment according to best efficiency. ', 'boolean', false, null, "Gear");
    createSetting('Rdmgcuntoff', 'AE: Cut-off', 'Decides when to buy gear. 1 is default. This means it will take 1 hit to kill an enemy. If zone is below the zone you have defined in AE: Zone then it will only buy equips when needed. ', 'value', '1', null, 'Gear');
    createSetting('Requipamount', 'AE: Amount', 'How much equipment to level per time. ', 'value', 1, null, "Gear");
    createSetting('Requipcapattack', 'AE: Weapon Cap', 'What level to stop buying Weapons at. ', 'value', 50, null, "Gear");
    createSetting('Requipcaphealth', 'AE: Armour Cap', 'What level to stop buying Armour at. ', 'value', 50, null, "Gear");
    createSetting('Requipzone', 'AE: Zone', 'What zone to stop caring about H:D and buy as much prestiges and equipment as possible. ', 'value', -1, null, "Gear");
    createSetting('Requippercent', 'AE: Percent', 'What percent of resources to spend on equipment before the zone you have set in AE: Zone', 'value', 1, null, "Gear");
    createSetting('Requip2', 'AE: 2', 'Always buys level 2 of weapons and armor regardless of efficiency', 'boolean', true, null, "Gear");
    document.getElementById('Requip2').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Requipfarmon', 'AE: Farm', 'AutoEquip Farm. Calculates metal needed to reach the target you have defined in the AEF settings. Will try to buy the best map you can make. Will never make a plus map as this is intended for us on deep push runs. ', 'boolean', false, null, "Gear");
    createSetting('Requipfarmzone', 'AEF: Zone', 'What zone to start AEF: H:D and AEF: Multiplier. ', 'value', '-1', null, 'Gear');
    createSetting('RequipfarmHD', 'AEF: H:D', 'What H:D to use for AEF target. ', 'value', '-1', null, 'Gear');
    createSetting('Requipfarmmult', 'AEF: Multiplier', 'Starting from the zone above AEF: Zone, this setting will multiply the H:D you have set in AEF: H:D. So if AEF: Zone was 100, AEF: H:D was 10, AEF: Multiplier was 1.2, at z101 your H:D target will be 12, then at z102 it will be 14.4 and so on. This way you can account for the zones getting stronger and you will not waste time farming for a really low H:D. ', 'value', '-1', null, 'Gear');
    createSetting('Requipfarmhits', 'AEF: Hits', 'How many hits do you want to kill an enemy in a AEF map. ', 'value', '-1', null, 'Gear');



    //Maps

    //Line 1
    createSetting('AutoMaps', ["Auto Maps Off", "Auto Maps On", "Auto Maps: Unique"], 'Automaps. Recommended ON. Do not use MaZ, it will not work. Automaps: Unique will unlock settings for each unique map. Select which unique maps you would like to run\, but otherwise functions the same. ', 'multitoggle', 1, null, "Maps");
    createSetting('AMUblock', 'AMU: The Block', 'Turn on to run this map every run. ', 'boolean', false, null, 'Maps');
    createSetting('AMUwall', 'AMU: The Wall', 'Turn on to run this map every run. ', 'boolean', false, null, 'Maps');
    createSetting('AMUanger', 'AMU: Dimension of Anger', 'Turn on to run this map every run. ', 'boolean', false, null, 'Maps');
    createSetting('AMUtrimple', 'AMU: Trimple', 'Turn on to run this map every run. ', 'boolean', false, null, 'Maps');
    createSetting('AMUprison', 'AMU: Prison', 'Turn on to run this map every run. ', 'boolean', false, null, 'Maps');
    createSetting('AMUbw', 'AMU: BW', 'Turn on to run this map every run. ', 'boolean', false, null, 'Maps');
    createSetting('AMUstar', 'AMU: Imploding Star', 'Turn on to run this map every run. ', 'boolean', false, null, 'Maps');
    createSetting('automapsportal', 'AM Portal', 'Makes sure Auto Maps is on on portal. ', 'boolean', false, null, 'Maps');
    createSetting('automapsalways', 'AM Always', 'Makes sure Auto Maps is on always. ', 'boolean', false, null, 'Maps');
    document.getElementById('automapsportal').parentNode.insertAdjacentHTML('afterend', '<br>');

    //Line 2
    createSetting('DynamicSiphonology', 'Dynamic Siphonology', 'Recommended Always ON. Use the right level of siphonology based on your damage output. IE: Only uses  siphonology if you are weak. With this OFF it means it ALWAYS uses the lowest siphonology map you can create. Siphonology is a perk you get at level 115-125ish, and means you receive map bonus stacks for running maps below your current zone - Up to 3 zones below (1 per perk level).', 'boolean', true, null, 'Maps');
    createSetting('PreferMetal', 'Prefer Metal Maps', 'Always prefer metal maps, intended for manual use, such as pre-spire farming. Remember to turn it back off after you\'re done farming!', 'boolean', false, null, 'Maps');
    createSetting('mapselection', 'Map Selection', 'Select which you prefer to use. Recommend Plentiful (Gardens) if you have unlocked it. ', 'dropdown', 'Mountain', ["Random", "Mountain", "Forest", "Sea", "Depths", "Gardens"], 'Maps');
    createSetting('MaxMapBonusAfterZone', 'Max MapBonus After', 'Always gets Max Map Bonus from this zone on. (inclusive and after).<br><b>NOTE:</b> Set -1 to disable entirely (default). Set 0 to use it always.<br><b>Advanced:</b>User can set a lower number than the default 10 maps with the AT hidden console command: MODULES[\\"maps\\"].maxMapBonusAfterZ = 9;', 'value', '-1', null, 'Maps');
    createSetting('MaxMapBonuslimit', 'Max MapBonus Limit', 'Limit the amount of Map Bonuses you get. Default is 10. ', 'value', '10', null, 'Maps');
    createSetting('MaxMapBonushealth', 'Max MapBonus Health', 'Limit the amount of map bonuses you get when AutoMaps requires more health. Default is 10. ', 'value', '10', null, 'Maps');
    createSetting('mapcuntoff', 'Map Cut Off', 'Decides when to get max map bonus. 4 is default. This means it will take 1 hit to kill an enemy if in D stance. ', 'value', '4', null, 'Maps');

    //Line 3
    createSetting('DisableFarm', 'Farming H:D', 'If H:D goes above this value, it will farm for Damage & Health. The lower this setting, the more it will want to farm. Default is <b>16<b/>. <b>-1 to disable farming!</b>', 'value', -1, null, 'Maps');
    createSetting('LowerFarmingZone', 'Lower Farming Zone', 'Lowers the zone used during Farming mode. Uses the dynamic siphonology code, to Find the minimum map level you can successfully one-shot, and uses this level for any maps done after the first 10 map stacks. The difference being it goes LOWER than what Siphonology gives you map-bonus for, but after 10 stacks you dont need bonus, you just want to do maps that you can one-shot. Goes as low as 10 below current zone if your damage is that bad, but this is extreme and indicates you should probably portal.', 'boolean', true, null, 'Maps');
    createSetting('FarmWhenNomStacks7', 'Farm on >7 NOMstacks', 'Optional. If Improbability already has 5 NOMstacks, stack 30 Anticipation. If the Improbability has >7 NOMstacks on it, get +200% dmg from MapBonus. If we still cant kill it, enter Farming mode at 30 stacks, Even with DisableFarming On! (exits when we get under 10x). Farms if we hit 100 stacks in the world. If we ever hit (100) nomstacks in a map (likely a voidmap), farm, (exit the voidmap) and (prevent void from running, until situation is clear). Restarts any voidmaps if we hit 100 stacks. ', 'boolean', false, null, 'Maps');
    createSetting('VoidMaps', 'Void Maps', '<b>0 to disable</b> The zone at which you want all your void maps to be cleared inclusive of the zone you type. Runs them at Cell 70. Use odd zones on Lead.<br>', 'value', '0', null, "Maps");
    createSetting('voidscell', 'Voids Cell', 'Run Voids at this Cell. -1 to run them at the default value, which is 70. ', 'value', '-1', null, 'Maps');
    createSetting('RunNewVoidsUntilNew', 'New Voids Mod', '<b>0 to disable. Positive numbers are added to your Void Map zone. -1 for no cap.</b> This allows you to run new Void Maps obtained after your Void Map zone by adding this number to your Void Map zone. <br> <b>Example</b> Void map zone=187 and This setting=10. New Voids run until 197).<br>This means that any new void maps gained until Z197. CAUTION: May severely slow you down by trying to do too-high level void maps. Default 0 (OFF).', 'value', '0', null, 'Maps');
    createSetting('runnewvoidspoison', 'New Voids Poison', 'Only run new voids in poison zones.', 'boolean', false, null, 'Maps');
    createSetting('onlystackedvoids', 'Stacked Voids Only', 'Only run stacked voids. ', 'boolean', false, null, 'Maps');

    //Line 4
    createSetting('TrimpleZ', 'Trimple Z', 'I don\'t really think doing this automatically is a good idea. You might want to farm for a bit before this, but I\'m not sure if it\'s meaningful at all to make a \'farm X minutes before trimple\' parameter to go along with it. Set it to the zone you want and it will run Trimple of Doom for Ancient Treasure AFTER farming and getting map stacks. If it is a negative number, this will be disabled after a successful run so you can set it differently next time.', 'valueNegative', 0, null, 'Maps');
    createSetting('AdvMapSpecialModifier', 'Map Special Modifier', '<b>BELOW 300 ONLY</b><br> Attempt to select the BEST map special modifier. When starting a map for <b>Prestige</b> it will use <i>Prestigious</i>. When starting a map for <b>Farming</b> (for equipment) it will use your best metal cache. In any other case (such as farming for map stacks) it will use <i>Fast Attacks</i>. In all cases it uses the best modifier that can be afforded.', 'boolean', true, null, 'Maps');
    createSetting('scryvoidmaps', 'VM Scryer', 'Only use if you have Scryhard II, for er, obvious reasons. Works without the scryer options. ', 'boolean', false, null, 'Maps');
    createSetting('buywepsvoid', 'VM Buy Weps', 'Buys gear in Void maps regardless of your H:D ratio. Useful if you want to overkill as much as possible. ', 'boolean', false, null, 'Maps');
    createSetting('farmWonders', 'Farm Wonders', 'Farms wonders until the selected amount and does BW at given zone to finish the challenge', 'boolean', false, null, 'Maps')
    createSetting('wondersAmount', 'Wonders Amount', 'Select the amount of Wonders you want to farm in each given run, <b> 0 to disable </b>', 'value', '0', null, "Maps");
    createSetting('maxExpZone', "Max XP Zone", 'Acquire Wonders from this zone down. <b>This must have a value or other Experience settings will not work.</b> If >z600, will complete Experience by running BW on this zone as well. For example, targeting three Wonders with a Max XP Zone of 600 will obtain the Wonders at: 600, 595, 590.', 'value', '600', null, 'Maps');
    createSetting('finishExpOnBw', 'Finish XP on BW', 'Finish Experience challenge by completing this level of BW. <b>This level of BW should already be in your inventory.</b> Use BW Raiding module if you want to raid to a specific level of BW before 601, or else you may accidentally complete the challenge at a lower or higher BW than intended using this setting. If this is an invalid BW value, it will run the next lowest valid BW zone (e.g. 606 will run 605).', 'value', '605', null, 'Maps');

    //Shrine - U1
    document.getElementById('finishExpOnBw').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Hshrine', 'AutoShrine', 'Turn this on if you want to use Shrines automatically. ', 'boolean', false, null, 'Maps');
    createSetting('Hshrinemaz', 'AutoShrine Settings', 'Click to open AutoShrine settings. <br> <b>Zone:</b> What zone to use Bone Shrine charges. <br> <b>Cell:</b> What cell to use Bone Shrine charges at, if you use it after cell 80 you will get the benefit of all the books. to use. <br> <b>Amount:</b> How many Bone Shrine charges you wish to use. <br> <b>Example:</b> If you put Zone: 40\, Cell: 10\, Amount: 3\, you will use 3 Bone Shrine Charges at zone 40 at cell 10. ', 'infoclick', false, null, 'Maps');
    createSetting('Hshrinezone', 'AutoShrine: Zone', 'zone', 'multiValue', [-1], null, 'Maps');
    createSetting('Hshrinecell', 'AutoShrine: Cell', 'cell', 'multiValue', [-1], null, 'Maps');
    createSetting('Hshrineamount', 'AutoShrine: Amount', 'amount', 'multiValue', [-1], null, 'Maps');
    createSetting('Hshrinecharge', 'AutoShrine: Charge', 'charge count you will never see this setting hehehehe', 'value', 0, null, 'Maps');

    //RMaps

    //Line 1
    createSetting('RAutoMaps', ["Auto Maps Off", "Auto Maps On", "Auto Maps No Unique"], 'Automaps. The no unique setting will not run unique maps such as dimensions of rage. Recommended ON. ', 'multitoggle', 1, null, "Maps");
    createSetting('Rautomapsportal', 'AM Portal', 'Makes sure Auto Maps is on portal. ', 'boolean', false, null, 'Maps');
    createSetting('Rautomapsalways', 'AM Always', 'Makes sure Auto Maps is on always. ', 'boolean', false, null, 'Maps');
    createSetting('Rmapselection', 'Map Selection', 'Select which you prefer to use. Recommend Plentiful (Gardens) if you have unlocked it. ', 'dropdown', 'Mountain', ["Random", "Mountain", "Forest", "Sea", "Depths", "Plentiful", "Farmlands"], 'Maps');
    createSetting('RMaxMapBonusAfterZone', 'Max MapBonus After', 'Always gets Max Map Bonus from this zone on. (inclusive and after).<br><b>NOTE:</b> Set -1 to disable entirely (default). Set 0 to use it always. ', 'value', '-1', null, 'Maps');
    createSetting('RMaxMapBonuslimit', 'Max MapBonus Limit', 'Limit the amount of Map Bonuses you get. Default is 10. ', 'value', '10', null, 'Maps');
    createSetting('RMaxMapBonushealth', 'Max MapBonus Health', 'Limit the amount of map bonuses you get when AutoMaps requires more health. Default is 10. ', 'value', '10', null, 'Maps');
    createSetting('Rhitssurvived', 'Hits Survived', 'Set this value to tell the script how many enemy attacks you wish to survive for. The default is 10. The lower this is the less health the script will get. If you set this too high it will farm too much so please be careful. ', 'value', '10', null, 'Maps');
    createSetting('Rmapcuntoff', 'Map Cut Off', 'Decides when to get max map bonus. 1 is default. This means it will take 1 hit to kill an enemy. ', 'value', '1', null, 'Maps');
    createSetting('RDisableFarm', 'Farming H:D', 'If H:D goes above this value, it will farm for Damage & Health. The lower this setting, the more it will want to farm. Default is <b>16<b/>. <b>-1 to disable farming!</b>', 'value', -1, null, 'Maps');

    //Line 2
    createSetting('RVoidMaps', 'Void Maps', '<b>0 to disable</b> The zone at which you want all your void maps to be cleared inclusive of the zone you type. Runs them at Cell 70. Use odd zones on Lead.<br>', 'value', '0', null, "Maps");
    createSetting('Rvoidscell', 'Voids Cell', 'Run Voids at this Cell. -1 to run them at the default value, which is 70. ', 'value', '-1', null, 'Maps');
    createSetting('RRunNewVoidsUntilNew', 'New Voids Mod', '<b>0 to disable. Positive numbers are added to your Void Map zone. -1 for no cap.</b> This allows you to run new Void Maps obtained after your Void Map zone by adding this number to your Void Map zone. <br> <b>Example</b> Void map zone=187 and This setting=10. New Voids run until 197).<br>This means that any new void maps gained until Z197. CAUTION: May severely slow you down by trying to do too-high level void maps. Default 0 (OFF).', 'value', '0', null, 'Maps');
    createSetting('Rprispalace', 'Prismatic Palace', 'Run Prismatic Palace when its unlocked. ', 'boolean', true, null, 'Maps');
    createSetting('Rmeltpoint', 'Melting Point', '-1 to disable. When to run the map Melting Point. Use it like this: 50,91. The first number is what zone Melting Point should be run at, the second number is what Cell to run it at. In this example AutoMaps would run Melting Point at z50 cell 91. Must define both values. Works in the challenges Melt and Trappapalooza. ', 'multiValue', [-1], null, 'Maps');
    createSetting('Rfrozencastle', 'Frozen Castle', '-1 to disable. When to run the map Frozen Castle. Use it like this: 200,91. The first number is what zone Frozen Castle should be run at, the second number is what Cell to run it at. In this example AutoMaps would run Frozen Castle at z200 cell 91. Must define both values. Works in any challenge so be careful. ', 'multiValue', [-1], null, 'Maps');

    //Timefarm
    document.getElementById('Rfrozencastle').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Rtimefarm', 'Time Farm', 'Turn this on if you want to use Time Farming. ', 'boolean', false, null, 'Maps');
    createSetting('Rtimefarmmaz', 'Time Farm Settings', 'Click to open the Time Farm settings. It will also put all your workers into what you are gathering. <br> <b>Zone:</b> What zone to start time farming. <br> <b>Cell:</b> What cell to start time farming at. <br> <b>Time:</b> How much time in Minutes to farm. <br> <b>Level:</b> How many map levels above your zone to use. <br> <b>Map:</b> What kind of map you want to use. <br> <b>Special:</b> What type of special you want to use. <br> <b>Gather:</b> What resource you would like to gather. <br> <b>Example:</b> If you put Zone: 60\, Cell: 10\, Time: 3\, Level: 5\, Map: Gardens\, Special: Large Metal Cache\, Gather: Metal\, you will farm at zone 60 at cell 10 for 3 minutes in a +5 Gardens map that has a Large Metal Cache while gathering metal. ', 'infoclick', false, null, 'Maps');
    createSetting('Rtimefarmzone', 'TF: Zone', 'zone', 'multiValue', [-1], null, 'Maps');
    createSetting('Rtimefarmcell', 'TF: Cell', 'cell', 'multiValue', [-1], null, 'Maps');
    createSetting('Rtimefarmtime', 'TF: Time', 'time', 'multiValue', [-1], null, 'Maps');
    createSetting('Rtimefarmlevel', 'TF: Map Level', 'level', 'multiValue', [0], null, 'Maps');
    createSetting('Rtimefarmmap', 'TF: Map Selection', 'map', 'textValue', 'undefined', null, 'Maps');
    createSetting('Rtimefarmspecial', 'TF: Special Selection', 'special', 'textValue', 'undefined', null, 'Maps');
    createSetting('Rtimefarmgather', 'TF: Gather Selection', 'gather', 'textValue', 'undefined', null, 'Maps');

    //Smithyfarm
    document.getElementById('Rtimefarmgather').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Rsmithyfarm', 'Smithy Farm', 'Turn this on if you want to use Smithy Farming. ', 'boolean', false, null, 'Maps');
    createSetting('Rsmithyfarmmaz', 'Smithy Farm Settings', 'Click to open the Smithy Farm settings. <br> <b>Zone:</b> What zone to start smithy farming.<br> <b>Cell:</b> What cell to start smithy farming at. <br> <b>Smithys:</b> How many smithys you want to have at that zone. <br> <b>Example:</b> If you put Zone: 60\, Cell: 10\, Smithys: 2\, you will farm at zone 60 at cell 10 for 2 total smithies in an autogenerated map that will fill your resource needs\, gather and job appropriately', 'infoclick', false, null, 'Maps');
    createSetting('Rsmithyfarmzone', 'SF: Zone', 'zone', 'multiValue', [-1], null, 'Maps');
    createSetting('Rsmithyfarmcell', 'SF: Cell', 'cell', 'multiValue', [-1], null, 'Maps');
    createSetting('Rsmithyfarmamount', 'SF: Smithys', 'smithys', 'multiValue', [-1], null, 'Maps');

    //Tributefarm
    document.getElementById('Rsmithyfarmamount').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Rtributefarm', 'Tribute Farm', 'Turn this on if you want to use Tribute Farming. ', 'boolean', false, null, 'Maps');
    createSetting('Rtributefarmmaz', 'Tribute Farm Settings', 'Click to open the Tribute Farm settings. <br> <b>Zone:</b> What zone to start tribute farming. It will also put all your workers into farming. <br> <b>Cell:</b> What cell to start tribute farming at. <br> <b>Tributes:</b> How many tributes to farm. <br> <b>Level:</b> How many map levels above your zone to use. <br> <b>Map:</b> What kind of map you want to use. <br> <b>Special:</b> What type of special you want to use. <br> <b>Gather:</b> What resource you would like to gather. <br> <b>Example:</b> If you put Zone: 40\, Cell: 10\, Tributes: 1000\, Level: 5\, Map: Gardens\, Special: Large Savory Cache\, Gather: Food\, you will farm at zone 40 at cell 10 for 1000 tributes in a +5 Gardens map that has a Large Savory Cache while gathering food. ', 'infoclick', false, null, 'Maps');
    createSetting('Rtributefarmzone', 'TrF: Zone', 'zone', 'multiValue', [-1], null, 'Maps');
    createSetting('Rtributefarmcell', 'TrF: Cell', 'cell', 'multiValue', [-1], null, 'Maps');
    createSetting('Rtributefarmamount', 'TrF: Tributes', 'tributes', 'multiValue', [-1], null, 'Maps');
    createSetting('Rtributefarmlevel', 'TrF: Map Level', 'level', 'multiValue', [0], null, 'Maps');
    createSetting('Rtributemapselection', 'TrF: Map Selection', 'map', 'textValue', 'undefined', null, 'Maps');
    createSetting('Rtributespecialselection', 'TrF: Special Selection', 'special', 'textValue', 'undefined', null, 'Maps');
    createSetting('Rtributegatherselection', 'TrF: Gather Selection', 'gather', 'textValue', 'undefined', null, 'Maps');

    //Shrine - U2
    document.getElementById('Rtributegatherselection').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Rshrine', 'AutoShrine', 'Turn this on if you want to use Shrines automatically. ', 'boolean', false, null, 'Maps');
    createSetting('Rshrinemaz', 'AutoShrine Settings', 'Click to open AutoShrine settings. <br> <b>Zone:</b> What zone to use Bone Shrine charges. <br> <b>Cell:</b> What cell to use Bone Shrine charges at, if you use it after cell 80 you will get the benefit of all the books. to use. <br> <b>Amount:</b> How many Bone Shrine charges you wish to use. <br> <b>Example:</b> If you put Zone: 40\, Cell: 10\, Amount: 3\, you will use 3 Bone Shrine Charges at zone 40 at cell 10. ', 'infoclick', false, null, 'Maps');
    createSetting('Rshrinezone', 'AutoShrine: Zone', 'zone', 'multiValue', [-1], null, 'Maps');
    createSetting('Rshrinecell', 'AutoShrine: Cell', 'cell', 'multiValue', [-1], null, 'Maps');
    createSetting('Rshrineamount', 'AutoShrine: Amount', 'amount', 'multiValue', [-1], null, 'Maps');
    createSetting('Rshrinecharge', 'AutoShrine: Charge', 'charge count you will never see this setting hehehehe', 'value', 0, null, 'Maps');


    //Spire

    //Line 1
    createSetting('MaxStacksForSpire', 'Max Map Bonus for Spire', 'Get max map bonus before running the Spire.', 'boolean', false, null, 'Spire');
    createSetting('MinutestoFarmBeforeSpire', 'Farm Before Spire', 'Farm level 200/199(or BW) maps for X minutes before continuing onto attempting Spire.<br><b>NOTE:</b> Set 0 to disable entirely (default). <br>Setting to -1/Infinite does not work here, set a very high number instead. **PLEASE DO NOT USE THIS IT MAY NOT WORK AND I CANNOT FIX IT**', 'value', '0', null, 'Spire');
    createSetting('IgnoreSpiresUntil', 'Ignore Spires Until', 'Spire specific settings like end-at-cell are ignored until at least this zone is reached (0 to disable).<br>Does not work with Run Bionic Before Spire.', 'value', '200', null, 'Spire');
    createSetting('ExitSpireCell', 'Exit Spire After Cell', 'Optional/Rare. Exits the Spire early, after completing cell X. example: 40 for Row 4. (use 0 or -1 to disable)', 'value', '-1', null, 'Spire');
    createSetting('SpireBreedTimer', 'Spire Breed Timer', '<b>ONLY USE IF YOU USE VANILLA GA</b>Set a time for your GA in spire. Recommend not touching GA during this time. ', 'value', -1, null, 'Spire');
    createSetting('PreSpireNurseries', 'Nurseries pre-Spire', 'Set the maximum number of Nurseries to build for Spires. Overrides No Nurseries Until z and Max Nurseries so you can keep them seperate! Will build nurseries before z200 for Spire 1, but only on the zone of Spires 2+ to avoid unnecessary burning. Disable with -1.', 'value', -1, null, 'Spire');
    createSetting('spireshitbuy', 'Buy Gear in Spire', 'Will buy Weapons and Armor in Spire regardless of your H:D ratio. Respects your max gear level and ignore spires setting. ', 'boolean', false, null, 'Spire');
    createSetting('SkipSpires', 'Skip Spires', 'Will disregard your H:D ratio after Farm Before Spire is done (if set). Useful to die in spires if farming takes too long', 'boolean', false, null, 'Spire');


    //Raiding

    //Line 1
    createSetting('Praidingzone', 'P Raiding Z', 'Raids Maps for prestiges at zone specified. Example: 495, will raid Maps at 501-505 sequentially. Once all gear is obtained from the maps, it will revert back to regular farming. Use P Raiding HD to determine how many extra maps you wish you raid. Extremely helpful for spire. Best used in poison zones. <b>You can use multiple values like this 495,506,525! </b>', 'multiValue', [-1], null, 'Raiding');
    createSetting('Praidingcell', 'P Raiding Cell', 'What Cell to start P Raiding at. Recommend below your BW Raiding cell if used together. -1 to Raid at cell 1. ', 'value', -1, null, 'Raiding');
    createSetting('PraidingHD', 'P Raiding HD', 'Checks if you can raid the map. If your HD value (calculated using the maps you will raid) is below this value it will not buy the map and you will stop raiding. The higher this value the higher zones it will raid. Can raid up to +10 depending on the zone. -1 or 0 to remove this check.', 'value', -1, null, 'Raiding');
    createSetting('PraidingP', 'P Raiding Poison', 'Maximum level of map to P Raid at in Poison. If this value is 10 it will be able to go to +10 maps in Poison. You should use this instead of the HD function if you feel the calculations are off, but you can use both if needed. -1 or 0 to have no max. ', 'value', -1, null, 'Raiding');
    createSetting('PraidingI', 'P Raiding Ice', 'Maximum level of map to P Raid at in Ice. If this value is 10 it will be able to go to +10 maps in Ice. You should use this instead of the HD function if you feel the calculations are off, but you can use both if needed. -1 or 0 to have no max. ', 'value', -1, null, 'Raiding');
    createSetting('PraidHarder', 'Hardcore P Raiding', '(EXPERIMENTAL) P Raid Harder: When enabled, always buys the highest prestige map we can afford when P raiding, with option to farm fragments for highest available prestige level.', 'boolean', false, null, 'Raiding');
    createSetting('MaxPraidZone', 'Max P Raid Zones', 'List of maximum zones to Praid corresponding to the list specified in Praiding zones.  e.g. if P raiding zones setting is 491,495 and this setting is 495,505, AT will P raid up to 495 from 491, and 505 from 495. Set to -1 to always buy highest available prestige map.  If no corrsponding value, or value is invalid, defaults to max available (up to +10)', 'multiValue', [-1], null, 'Raiding');
    createSetting('PraidFarmFragsZ', 'Farm Fragments Z', 'P Raiding harder: List of zones where we should farm fragments until we can afford the highest or target prestige map for P raiding. Set to -1 to never farm fragments. ', 'multiValue', [-1], null, 'Raiding');
    createSetting('PraidBeforeFarmZ', 'Raid before farm Z', 'P Raiding harder: List of zones where we should P Raid as far as we can afford before trying to farm fragments to Praid the highest or target prestige map.  Only occasionally useful, e.g. if it picks up a Speedexplorer or farming fragments is slow due to low damage. Set to -1 to never raid prestiges before farming fragents.', 'multiValue', [-1], null, 'Raiding');
    createSetting('BWraid', 'BW Raiding', 'Raids BW at zone specified in BW Raiding Z/max. Turn off Climb BW. ', 'boolean', false, null, 'Raiding');
    createSetting('bwraidcell', 'BW Raiding Cell', 'What Cell to start BW Raiding at. Recommend above your P Raiding cell if used together. -1 to Raid at cell 1. ', 'value', -1, null, 'Raiding');
    createSetting('BWraidingz', 'Z to BW Raid', 'Raids BWs at zone specified. Example: 495, will raid all BWs for all gear starting from 495. Will skip lower BWs if you have enough damage. Once all gear is obtained, will return to regular farming. Accepts comma separated lists, and raids up to the value in the corrsponding position in the Max BW to raid setting. So if this is set to 480,495 and Max BW to Raid is set to 500,515 AT will BW raid up to 500 from 480, and 515 from 495. Make sure these lists are the same length or BW raiding may fail.', 'multiValue', [-1], null, 'Raiding');
    createSetting('BWraidingmax', 'Max BW to raid', 'Raids BWs until zone specified. Example: 515, will raid all BWs for all gear until 515. Will skip lower BWs if you have enough damage. Once all gear is obtained, will return to regular farming. Now accepts comma separated lists - see description of Z to BW raid setting for details.', 'multiValue', [-1], null, 'Raiding');


    //RRaiding

    //Line 1
    createSetting('RAMPraid', 'Praiding', '<b>MASTER BUTTON</b><br>Toggle Prestige Raiding. Use PR: Zone, PR: Raid and PR: Cell to Raid Prestiges in higher Maps.<br> I.e: World is 95, PR: Zone is [95,105], PR: Raid is [105,115], PR: Cell is 1. Will go into map creation at cell 1, create maps 101, 102, 103, 104, 105 with Prestige option. If you can\'t afford P maps, it will try without. If still unable to afford will buy the highest maps first without buying 101 and 102 for example. Raiding will take longer if you can\'t afford it. Once all maps are created it will run the lowest created then move onto the next till all created maps are finished. If you have enabled PR: Recycle it will then recycle those maps. There may be more options in the future depending on content added. ', 'boolean', false, null, 'Raiding');
    createSetting('RAMPraidmaz', 'Praiding Settings', 'Click to open the Praiding settings. ', 'infoclick', false, null, 'Raiding');
    createSetting('RAMPraidzone', 'PR: Zone', 'zone', 'multiValue', [-1], null, 'Raiding');
    createSetting('RAMPraidraid', 'PR: Raid', 'raid', 'multiValue', [-1], null, 'Raiding');
    createSetting('RAMPraidcell', 'PR: Cell', 'cell', 'multiValue', [-1], null, 'Raiding');
    createSetting('RAMPraidfrag', ['PR: Frag', 'PR: Frag Min', 'PR: Frag Max'], 'Farm for fragments to afford the maps you want to create. PR: Frag Min is used for absolute minimum frag costs (which includes no Prestige special, perfect sliders, random map and the difficulty and size options, however it will try to afford those options first!) and prioritises buying the most maps for a smoother sequential raid. PR: Frag Max is used for the ultimate Raiding experience. This option will probably take the most time to farm but may save you time in the actual raid. I would recommend using Min Mode if you don\'t have frag drop or explorer effic on your heirloom and Max if you are confident in your Fragment gains. ', 'multitoggle', 0, null, 'Raiding');
    createSetting('RAMPraidrecycle', 'PR: Recycle', 'Recycle maps created in Prestige Raiding. ', 'boolean', false, null, 'Raiding');



    //Windstacking

    //Line 1
    createSetting('windstackingfiller', 'Use Daily Tab for Dailies!', 'These settings are for fillers ONLY. ', 'boolean', 'false', null, 'Windstacking');
    createSetting('turnwson', 'Turn WS On!', 'Turn on Windstacking Stance in Combat to see the settings! ', 'boolean', 'false', null, 'Windstacking');
    createSetting('WindStackingMin', 'Windstack Min Zone', 'For use with Windstacking Stance, enables windstacking in zones above and inclusive of the zone set. (Get specified windstacks then change to D, kill bad guy, then repeat). This is designed to force S use until you have specified stacks in wind zones, overriding scryer settings. All windstack settings apart from WS MAX work off this setting. ', 'value', '-1', null, 'Windstacking');
    createSetting('WindStackingMinHD', 'Windstack H:D', 'For use with Windstacking Stance, if your H:D is below this number it will use W inside windlight and S outside of it. If it is above it will start manually windstacking using heirloom swapping and stancing. If you just want to use W stance just set this to something impossibly high like 1e30. ', 'value', '-1', null, 'Windstacking');
    createSetting('WindStackingMax', 'Windstack Stacks', 'For use with Windstacking Stance. Amount of windstacks to obtain before switching to D stance. Default is 200, but I recommend anywhere between 175-190.  In Wind Enlightenment it will add 100 stacks to your total automatically. So if this setting is 200 It will assume you want 300 stacks instead during enlightenment. ', 'value', '200', null, 'Windstacking');
    createSetting('windcutoff', 'Wind Damage Cutoff', 'Set this value to optimise your windstacking. Can work without AS3, but not recommended. AT normally uses 4 as its cutoff. I.e if the cutoff is above 4 it will buy max equipment. If you set this to 160, it will not get more damage till you are above x160. Essentially, the higher the value, the less damage AT wants to get, this will enable you to windstack to incredibly high amounts. -1 to disable/go back to default. Must set your windstacking min zone to use. ', 'value', '-1', null, 'Windstacking');
    createSetting('windcutoffmap', 'Wind Map Cutoff', 'Set this value to optimise your windstacking. Can work without AS3, but not recommended. AT normally uses 4 as its cutoff. I.e if the cutoff is above 4 it will get map bonus. If you set this to 160, it will not get more map bonus till you are above x160. Essentially, the higher the value, the less damage AT wants to get, this will enable you to windstack to incredibly high amounts. -1 to disable/go back to default. Must set your windstacking min zone to use. ', 'value', '-1', null, 'Windstacking');
    createSetting('wsmax', 'WS MAX', 'For maximising Windstacking an entire run. Withholds damage to try and get your max windstacks every wind zone. Not recommended for normal usage. Good for BPs. ', 'value', '-1', null, 'Windstacking');
    createSetting('wsmaxhd', 'WSM H:D', 'Fiddle with this to maximise your WSM settings. Default is 0.00025. Same logic applies from the normal H:D setting. ', 'value', '-1', null, 'Windstacking');



    //ATGA

    //Line 1
    createSetting('ATGA2', 'ATGA', '<b>ATGA MASTER BUTTON</b><br>AT Geneticassist. Do not use vanilla GA, as it will conflict otherwise. May get fucky with super high values. ', 'boolean', 'false', null, 'ATGA');
    createSetting('ATGA2gen', 'ATGA: Gen %', '<b>ATGA: Geneassist %</b><br>ATGA will only hire geneticists if they cost less than this value. E.g if this setting is 1 it will only buy geneticists if they cost less than 1% of your food. Default is 1%. ', 'value', '1', null, 'ATGA');
    createSetting('ATGA2timer', 'ATGA: Timer', '<b>ATGA Timer</b><br>This is the default time your ATGA will use. ', 'value', '-1', null, 'ATGA');

    //Zone Timers
    document.getElementById('ATGA2timer').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('zATGA2timer', 'ATGA: T: Before Z', '<b>ATGA Timer: Before Z</b><br>ATGA will use the value you define in ATGA: T: BZT before the zone you have defined in this setting, overwriting your default timer. Useful for Liq or whatever. ', 'value', '-1', null, 'ATGA');
    createSetting('ztATGA2timer', 'ATGA: T: BZT', '<b>ATGA Timer: Before Z Timer</b><br>ATGA will use this value before the zone you have defined in ATGA: T: Before Z, overwriting your default timer. Useful for Liq or whatever. Does not work on challenges. ', 'value', '-1', null, 'ATGA');
    createSetting('ATGA2timerz', 'ATGA: T: After Z', '<b>ATGA Timer: After Z</b><br>ATGA will use the value you define in ATGA: T: AZT after the zone you have defined in this setting, overwriting your default timer. Useful for super push runs or whatever. Does not work on challenges. ', 'value', '-1', null, 'ATGA');
    createSetting('ATGA2timerzt', 'ATGA: T: AZT', '<b>ATGA Timer: After Z Timer</b><br>ATGA will use this value after the zone that has been defined in ATGA: T: After Z, overwriting your default timer. Useful for super push runs or whatever. ', 'value', '-1', null, 'ATGA');

    //Spire Timers
    document.getElementById('ATGA2timerzt').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('sATGA2timer', 'ATGA: T: Spire', '<b>ATGA Timer: Spire</b><br>ATGA will use this value in Spires. Respects your ignore Spires setting. Do not use this if you use the setting in the Spire tab! (As that uses vanilla GA) Nothing overwrites this except Daily Spire. ', 'value', '-1', null, 'ATGA');
    createSetting('dsATGA2timer', 'ATGA: T: Daily Spire', '<b>ATGA Timer: Daily Spire</b><br>ATGA will use this value in Daily Spires. Respects your ignore Spires setting. Do not use this if you use the setting in the Spire tab! (As that uses vanilla GA) Nothing overwrites this. ', 'value', '-1', null, 'ATGA');

    //Daily Timers
    document.getElementById('dsATGA2timer').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('dATGA2Auto', ['ATGA: Manual', 'ATGA: Auto No Spire', 'ATGA: Auto Dailies'], '<b>EXPERIMENTAL</b><br><b>ATGA Timer: Auto Dailies</b><br>ATGA will use automatically set breed timers in plague and bogged, overwriting your default timer.<br/>Set No Spire to not override in spire, respecting ignore spire settings.', 'multitoggle', 2, null, 'ATGA');
    createSetting('dATGA2timer', 'ATGA: T: Dailies', '<b>ATGA Timer: Normal Dailies</b><br>ATGA will use this value for normal Dailies such as ones without plague etc, overwriting your default timer. Useful for pushing your dailies that extra bit at the end. Overwrites Default, Before Z and After Z. ', 'value', '-1', null, 'ATGA');
    createSetting('dhATGA2timer', 'ATGA: T: D: Hard', '<b>ATGA Timer: Hard Dailies</b><br>ATGA will use this value in Dailies that are considered Hard. Such Dailies include plaged, bloodthirst and Dailies with a lot of negative mods. Overwrites Default, Before Z and After Z and normal Daily ATGA Timer. ', 'value', '-1', null, 'ATGA');

    //C2 Timers
    document.getElementById('dhATGA2timer').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('cATGA2timer', 'ATGA: T: C2', '<b>ATGA Timer: C2s</b><br>ATGA will use this value in C2s. Overwrites Default, Before Z and After Z. ', 'value', '-1', null, 'ATGA');
    createSetting('chATGA2timer', 'ATGA: T: C: Hard', '<b>ATGA Timer: Hard C2s</b><br>ATGA will use this value in C2s that are considered Hard. Electricity, Nom, Toxicity. Overwrites Default, Before Z and After Z and C2 ATGA', 'value', '-1', null, 'ATGA');



    //Challenges

    //Hide
    createSetting('Rchallengehide', 'Hide Stuff', 'Enable seeing the hide challenges buttons. Feel free to turn this off once you are done. ', 'boolean', false, null, 'Challenges');
    createSetting('Rchallengehidequag', 'Quag', 'Set this on if you wish to hide the Quagmire challenge settings. ', 'boolean', false, null, 'Challenges');
    createSetting('Rchallengehidearch', 'Arch', 'Set this on if you wish to hide the Archaeology challenge settings. ', 'boolean', false, null, 'Challenges');
    createSetting('Rchallengehidemayhem', 'Mayhem', 'Set this on if you wish to hide the Mayhem challenge settings. ', 'boolean', false, null, 'Challenges');
    createSetting('Rchallengehidestorm', 'Storm', 'Set this on if you wish to hide the Storm challenge settings. ', 'boolean', false, null, 'Challenges');
    createSetting('Rchallengehideinsanity', 'Insanity', 'Set this on if you wish to hide the Insanity challenge settings. ', 'boolean', false, null, 'Challenges');
    createSetting('Rchallengehideexterminate', 'Exterminate', 'Set this on if you wish to hide the Exterminate challenge settings. ', 'boolean', false, null, 'Challenges');
    createSetting('Rchallengehidenurture', 'Nurture', 'Set this on if you wish to hide the Nurture challenge settings. ', 'boolean', false, null, 'Challenges');
    createSetting('Rchallengehidepanda', 'Pandemonium', 'Set this on if you wish to hide the Pandemonium challenge settings. ', 'boolean', false, null, 'Challenges');
    createSetting('Rchallengehidealchemy', 'Alchemy', 'Set this on if you wish to hide the Alchemy challenge settings. ', 'boolean', false, null, 'Challenges');
    createSetting('Rchallengehidehypothermia', 'Hypothermia', 'Set this on if you wish to hide the Hypothermia challenge settings. ', 'boolean', false, null, 'Challenges');
    createSetting('Rchallengehidedeso', 'Desolation', 'Set this on if you wish to hide the Desolation challenge settings. ', 'boolean', false, null, 'Challenges');

    //Quagmire
    document.getElementById('Rchallengehidedeso').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Rblackbog', 'Quagmire', 'Enable Bog Running for Quagmire. ', 'boolean', false, null, 'Challenges');
    createSetting('Rblackbogmaz', 'Quagmire Settings', 'Click to open the Quagmire settings. <br> <b>Zone:</b> What zone to start bogging. <br> <b>Black Bogs:</b> How many Black Bogs to at specified zones. <br> <b>Example:</b> If you put Zone: 40\, Black Bogs: 10\, you will run 10 black bogs at zone 40. ', 'infoclick', false, null, 'Challenges');
    createSetting('Rblackbogzone', 'Zone', 'zone', 'multiValue', [-1], null, 'Challenges');
    createSetting('Rblackbogamount', 'Amount', 'black bogs', 'multiValue', [-1], null, 'Challenges');

    //Nurture
    createSetting('Rnurtureon', 'Nurture', 'Enables the Lab setting in Buildings and building labs through it. ', 'boolean', 'false', null, 'Challenges');

    //Arch
    createSetting('Rarchon', 'Archaeology', 'Turn on Archaeology settings. ', 'boolean', 'false', null, 'Challenges');
    createSetting('Rarchstring1', 'First String', 'First string to use in Archaeology. Put the zone you want to stop using this string and start using the second string (Make sure the second string has a value) at the start. I.e: 70,10a,10e ', 'textValue', 'undefined', null, 'Challenges');
    createSetting('Rarchstring2', 'Second String', 'Second string to use in Archaeology. Put the zone you want to stop using this string and start using the third string (Make sure the third string has a value) at the start. I.e: 94,10a,10e ', 'textValue', 'undefined', null, 'Challenges');
    createSetting('Rarchstring3', 'Third String', 'Third string to use in Archaeology. Make sure this is just your Archaeology string and nothing else. I.e: 10a,10e ', 'textValue', 'undefined', null, 'Challenges');

    //Mayhem
    createSetting('Rmayhemon', 'Mayhem', 'Turn on Mayhem settings. ', 'boolean', 'false', null, 'Challenges');
    createSetting('Rmayhemattack', 'M: Attack', 'Turn this on to ignore your farm settings so It will do maps if you cannot survive the hits you have defined in Maps. ', 'boolean', 'false', null, 'Challenges');
    createSetting('Rmayhemhealth', 'M: Health', 'Turn this on to ignore your farm settings so It will do maps if your HD is above the target you have defined in Maps. ', 'boolean', 'false', null, 'Challenges');
    createSetting('Rmayhemabcut', 'M: Attack Boss', 'What cut-off to use when farming for the boss using M: Attack. If this setting is 100, the script will farm till you can kill the boss in 100 average hits. ', 'value', '-1', null, 'Challenges');
    createSetting('Rmayhemamcut', 'M: Attack Map', 'What cut-off to use when farming maps using M: Attack and M: Smart Map. If this setting is 10, the script will do maps you can kill cells in 10 average hits. ', 'value', '-1', null, 'Challenges');
    createSetting('Rmayhemhcut', 'M: Health Cut-off', 'What cut-off to use when using M: Health. ', 'value', '-1', null, 'Challenges');
    createSetting('Rmayhemmap', ['M: Maps Off', 'M: Highest Map', 'M: Smart Map'], 'Control what maps you do to farm M: Attack and/or M: Health. M: Highest map always selects the highest map you have whether it be from Praiding, Time Farming or any you have manually created. M: Smart Map attempts to create a map best suited to the situation. Will calculate if you can survive and kill the map, and will try to buy all the necessary map attributes such as FA. ', 'multitoggle', 0, null, 'Challenges');

    //Storm
    createSetting('Rstormon', 'Storm', 'Turn on Storm settings. This also controls the entireity of Storm settings. If you turn this off it will not do anything in Storm. ', 'boolean', 'false', null, 'Challenges');
    createSetting('Rstormzone', 'S: Zone', 'What zone to start S: H:D and S: Multiplier. ', 'value', '-1', null, 'Challenges');
    createSetting('RstormHD', 'S: H:D', 'What H:D to use inside Storm. ', 'value', '-1', null, 'Challenges');
    createSetting('Rstormmult', 'S: Multiplier', 'Starting from the zone above S: Zone, this setting will multiply the H:D you have set in S: H:D. So if S: Zone was 100, S: H:D was 10, S: Multiplier was 1.2, at z101 your H:D target will be 12, then at z102 it will be 14.4 and so on. This way you can account for the zones getting stronger and you will not waste time farming for a really low H:D. ', 'value', '-1', null, 'Challenges');

    //Insanity
    createSetting('Rinsanityon', 'Insanity', 'Turn on Insanity settings. This also controls the entireity of IF. If you turn this off it will not Insanity Farm. ', 'boolean', 'false', null, 'Challenges');
    createSetting('Rinsanitymaz', 'Insanity Settings', 'Click to open the Insanity settings. <br> <b>Zone:</b> What zone to farm insanity stacks in.<br> <b>Cell:</b> What cell to start farming insanity stacks on.<br> <b>Stacks:</b> Number of stacks you want. <br> <b>Level:</b> How many map levels you want above zone. <br> <b>Example:</b> If you put Zone: 60\, Cell: 50\, Stacks: 500\, Level: 5\, you will farm at zone 60\, on cell 50 until you have 500 insanity stacks\, in a +5 map. ', 'infoclick', false, null, 'Challenges');
    createSetting('Rinsanityfarmzone', 'Insanity Farming', 'zone', 'multiValue', [-1], null, 'Challenges');
    createSetting('Rinsanityfarmcell', 'IF: Cell', 'cell', 'multiValue', '-1', null, 'Challenges');
    createSetting('Rinsanityfarmstack', 'IF: Stacks', 'stacks', 'multiValue', [-1], null, 'Challenges');
    createSetting('Rinsanityfarmlevel', 'IF: Map Level', 'level', 'multiValue', [0], null, 'Challenges');
    createSetting('Rinsanityfarmfrag', 'IF: Frags', 'Turn this on to farm fragments if you cannot afford the map you have selected for IF. ', 'boolean', 'false', null, 'Challenges');

    //Exterminate
    createSetting('Rexterminateon', 'Exterminate', 'Turn on Exterminate settings. This also controls the entireity of Exterminate. If you turn this off it will not calculate Exterminate. ', 'boolean', 'false', null, 'Challenges');
    createSetting('Rexterminatecalc', 'E: Calc', 'Calculate Exterminate enemies instead of the usual ones. May improve your challenge experience. ', 'boolean', 'false', null, 'Challenges');
    createSetting('Rexterminateeq', 'E: Equality', 'Will manage your equality \'better\' inside the challenge. When you have the experienced buff it will turn it off, when you dont it will turn it on and let it build up. ', 'boolean', 'false', null, 'Challenges');

    //Panda
    createSetting('Rpandaon', 'Pandemonium', 'Turn on Pandemonium settings. ', 'boolean', 'false', null, 'Challenges');
    createSetting('Rpandamaps', 'P: Mapping', 'Turn this on to automate mapping Pandemonium starting at the zone defined in P: Zone. Use the P: Attacks to define the maximum amount of hits an enemy in a map should take to kill. ', 'boolean', 'false', null, 'Challenges');
    createSetting('Rpandazone', 'P: Zone', 'What zone to start Pandemonium mapping at. Will ignore Pandemonium stacks below this zone. ', 'value', '-1', null, 'Challenges');
    createSetting('Rpandahits', 'P: Hits', 'How many hits an enemy in a plus map should take to kill. Will select up to +6 levels. If you cannot kill an enemy in the maximum number of hits in any plus map, will try to run a +1 map anyway. ', 'value', '-1', null, 'Challenges');

    //Alch
    createSetting('Ralchon', 'Alchemy', 'Turn on Alchemy settings. This also controls the entireity of AF. If you turn this off it will not Alchemy Farm. ', 'boolean', 'false', null, 'Challenges');
    createSetting('Ralchfarmmaz', 'Alchemy Settings', 'Click to open the Alchemy settings. Do not use vanilla autobrew AF will buy potions for you. <br> <b>Zone:</b> What zone to farm herbs and potions in.<br> <b>Cell:</b> What cell to start farming herbs and potions on.<br> <b>Potion:</b> You must pair a potion with a level here. Example: h15\,g20\,s15. This will farm Herby potion up to level 15 on the first AF zone\, Gaseous potion to level 20 and so on. <br> <b>Level:</b> How many map levels you want above zone. <br> <b>Example:</b> If you put Zone: 81\, Cell: 50\, Potion: h15\, Level: 5\, Map: Farmlands\, you will farm at zone 81\, on cell 50 until you can afford 15 total herby potions\, in a +5 map\, using a farmlands map. ', 'infoclick', false, null, 'Challenges');
    createSetting('Ralchfarmzone', 'Alchemy Farming', 'zone', 'multiValue', [-1], null, 'Challenges');
    createSetting('Ralchfarmcell', 'AF: Cell', 'cell', 'multiValue', '[-1]', null, 'Challenges');
    createSetting('Ralchfarmstack', 'AF: Potion', 'potion', 'textValue', 'undefined', null, 'Challenges');
    createSetting('Ralchfarmlevel', 'AF: Map Level', 'level', 'multiValue', [0], null, 'Challenges');
    createSetting('Ralchfarmselection', 'AF: Map Selection', 'map', 'textValue', 'l', null, 'Challenges');
    createSetting('Ralchfarmfrag', 'AF: Frags', 'Turn this on to farm fragments if you cannot afford the map you have selected for AF. ', 'boolean', 'false', null, 'Challenges');

    //Hypo
    createSetting('Rhypoon', 'Hypothermia', 'Turn on Hypothermia settings. This also controls the entireity of HF. If you turn this off it will not Hypothermia Farm. ', 'boolean', 'false', null, 'Challenges');
    createSetting('Rhypofarmmaz', 'Hypothermia Settings', 'Click to open the Hypothermia settings. HF will not spend wood on zones you are farming bonfires or until you have achieved your bonfire goal. <br> <b>Zone:</b> What zone to farm bonfires in.<br> <b>Cell:</b> What cell to start farming bonfires on.<br> <b>Bonfire:</b> The number of total bonfires in the run you want at that zone.<br> <b>Level:</b> How many map levels you want above zone. <br> <b>Example:</b> If you put Zone: 17\, Cell: 50\, Bonfire: 5\, Level: 5\, you will farm at zone 17\, on cell 50 until you can afford 5 total bonfires\, in a +5 map. ', 'infoclick', false, null, 'Challenges');
    createSetting('Rhypofarmzone', 'Hypothermia Farming', 'zone', 'multiValue', [-1], null, 'Challenges');
    createSetting('Rhypofarmcell', 'HF: Cell', 'cell', 'multiValue', [-1], null, 'Challenges');
    createSetting('Rhypofarmstack', 'HF: Bonfire', 'bonfire', 'multiValue', 'undefined', null, 'Challenges');
    createSetting('Rhypofarmlevel', 'HF: Map Level', 'level', 'multiValue', [0], null, 'Challenges');
    createSetting('Rhypofarmfrag', 'HF: Frags', 'Turn this on to farm fragments if you cannot afford the map you have selected for HF. ', 'boolean', 'false', null, 'Challenges');
    createSetting('Rhypocastle', 'Frozen Castle', 'What zone you wish you run frozen castle on to complete the challenge. Will run castle after voids so make sure thats set up right. ', 'value', '-1', null, 'Challenges');
    createSetting('Rhypovoids', 'After Voids', 'Only run Frozen castle after all voids have been completed. ', 'boolean', true, null, 'Challenges');
    createSetting('Rhypostorage', 'Storage', 'Turn this on to disable buying sheds unless you need more wood for your HF: Bonfire target price (AT AutoBuildings). Essentially this means you wont get accidently bonfires but you may lose out on smithies and shield prestiges. If you use vanilla autobuildings this setting is pointless. Disables AutoStorage until the first Bonfire farm zone that you reach during the challenge.', 'boolean', 'false', null, 'Challenges');
    
    //Desolation
    createSetting('Rdesoon', 'Desolation', 'Turn on Desolation settings. This also controls the entireity of Desolation settings. If you turn this off it will not do anything in Desolation. ', 'boolean', 'false', null, 'Challenges');
    createSetting('Rdesozone', 'D: Zone', 'What zone to start D: H:D and D: Multiplier. ', 'value', '-1', null, 'Challenges');
    createSetting('RdesoHD', 'D: H:D', 'What H:D to use inside Desolation. ', 'value', '-1', null, 'Challenges');
    createSetting('Rdesomult', 'D: Multiplier', 'Starting from the zone above D: Zone, this setting will multiply the H:D you have set in D: H:D. So if D: Zone was 100, D: H:D was 10, D: Multiplier was 1.2, at z101 your H:D target will be 12, then at z102 it will be 14.4 and so on. This way you can account for the zones getting stronger and you will not waste time farming for a really low H:D. ', 'value', '-1', null, 'Challenges');



    //Combat

    //Line 1
    createSetting('BetterAutoFight', ['Better AutoFight OFF', 'Better Auto Fight', 'Vanilla'], '3-Way Button, Recommended. Will automatically handle fighting.<br>BAF = Old Algo (Fights if dead, new squad ready, new squad breed timer target exceeded, and if breeding takes under 0.5 seconds<br>BAF3 = Uses vanilla autofight and makes sure you fight on portal. <br> WARNING: If you autoportal with BetterAutoFight disabled, the game may sit there doing nothing until you click FIGHT. (not good for afk) ', 'multitoggle', 1, null, "Combat");
    createSetting('AutoStance', ['Auto Stance OFF', 'Auto Stance', 'D Stance', 'Windstacking'], '<b>Autostance:</b> Automatically swap stances to avoid death. <br><b>D Stance:</b> Keeps you in D stance regardless of Health. <br><b>Windstacking:</b> For use after nature (z230), and will keep you in D stance unless you are windstacking (Only useful if transfer is maxed out and wind empowerment is high). Manages your Heirloom swapping and stance to obtain wind stacks efficiently. You must set your High Dmg and Low Dmg Heirlooms, Windstack H:D or WSMAX H:D where relevant for this to work. ', 'multitoggle', 1, null, "Combat");
    createSetting('IgnoreCrits', ['Safety First', 'Ignore Void Strength', 'Ignore All Crits'], 'No longer switches to B against corrupted precision and/or void strength. <b>Basically we now treat \'crit things\' as regular in both autoStance and autoStance2</b>. In fact it no longer takes precision / strength into account and will manage like a normal enemy, thus retaining X / D depending on your needs. If you\'re certain your block is high enough regardless if you\'re fighting a crit guy in a crit daily, use this! Alternatively, manage the stances yourself.', 'multitoggle', 0, null, 'Combat');
    createSetting('PowerSaving', ['AutoAbandon', 'Don\'t Abandon', 'Only Rush Voids'], '<b>Autoabandon:</b> Considers abandoning trimps for void maps/prestiges.<br><b>Don\'t Abandon:</b> Will not abandon troops, but will still agressively autostance even if it will kill you (WILL NOT ABANDON TRIMPS TO DO VOIDS).<br><b>Only Rush Voids:</b> Considers abandoning trimps for void maps, but not prestiges, still autostances aggressively. <br>Made for Empower daily, and you might find this helpful if you\'re doing Workplace Safety feat. Then again with that I strongly recommend doing it fully manually. Anyway, don\'t blame me whatever happens.<br><b>Note:</b> AT will no longer be able to fix when your scryer gets stuck!', 'multitoggle', 0, null, 'Combat');
    createSetting('ForceAbandon', 'Trimpicide', 'If a new fight group is available and anticipation stacks aren\'t maxed, Trimpicide and grab a new group. Will not abandon in spire. Recommended ON. ', 'boolean', true, null, 'Combat');
    createSetting('DynamicGyms', 'Dynamic Gyms', 'Designed to limit your block to slightly more than however much the enemy attack is. If MaxGyms is capped or GymWall is set, those will still work, and this will NOT override those (works concurrently), but it will further limit them. In the future it may override, but the calculation is not easy to get right so I dont want it undo-ing other things yet. ', 'boolean', false, null, 'Combat');
    createSetting('AutoRoboTrimp', 'AutoRoboTrimp', 'Use RoboTrimps ability starting at this level, and every 5 levels thereafter. (set to 0 to disable. default 60.) 60 is a good choice for mostly everybody.', 'value', '60', null, 'Combat');

    //Line 2
    createSetting('fightforever', 'Fight Always', 'U1: -1 to disable. Sends trimps to fight if they\'re not fighting, regardless of BAF. Has 2 uses. Set to 0 to always send out trimps. Or set a number higher than 0 to enable the H:D function. If the H:D ratio is below this number it will send them out. I.e, this is set to 1, it will send out trimps regardless with the H:D ratio is below 1. ', 'value', '-1', null, 'Combat');
    createSetting('addpoison', 'Poison Calc', '<b>Experimental. </b><br>Adds poison to the battlecalc. May improve your poison zone speed. ', 'boolean', 'false', null, 'Combat');
    createSetting('fullice', 'Ice Calc', '<b>Experimental. </b><br>Always calculates your ice to be a consistent level instead of going by the enemy debuff. Stops H:D spazzing out. ', 'boolean', 'false', null, 'Combat');
    createSetting('45stacks', 'Antistack Calc', '<b>Experimental. </b><br>Always calcs your damage as having full antistacks. Useful for windstacking. ', 'boolean', 'false', null, 'Combat');


    //RCombat
    createSetting('Rfightforever', 'Fight Always', 'U2: -1 to disable. Sends trimps to fight if they\'re not fighting, regardless of BAF. Has 2 uses. Set to 0 to always send out trimps. Or set a number higher than 0 to enable the H:D function. If the H:D ratio is below this number it will send them out. I.e, this is set to 1, it will send out trimps regardless with the H:D ratio is below 1. ', 'value', '-1', null, 'Combat');
    createSetting('Rcalcmaxequality', ['Equality Calc Off', 'EC: On', 'EC: Health'], '<b>Experimental. </b><br>Adds Equality Scaling levels to the battlecalc. Will always calculate equality based on actual scaling levels when its turned off by other settings. Assumes you use Equality Scaling. Turning this on allows in-game Equality Scaling to adjust your Health accordingly. EC: Health only decreases enemies attack in the calculation which may improve speed. ', 'multitoggle', 0, null, 'Combat');
    createSetting('Rmanageequality', 'Manage Equality', 'Manages Equality for you. Sets Equality to 0 on Slow enemies, and Autoscaling on for Fast enemies. ', 'boolean', 'false', null, 'Combat');
    createSetting('Rcalcfrenzy', 'Frenzy Calc', '<b>Experimental. </b><br>Adds frenzy to the calc. Be warned\, it will not farm as much with this on as it expects 100% frenzy uptime. ', 'boolean', 'false', null, 'Combat');
    createSetting('Rmutecalc', 'Mute Calc', 'What zone to start calculating Mutations at. 0 to disable.', 'value', '-1', null, 'Combat');


    //Scryer

    //Line 1
    createSetting('UseScryerStance', 'Enable Scryer Stance', '<b>MASTER BUTTON</b> Activates all other scrying settings, and overrides AutoStance when scryer conditions are met. Leave regular Autostance on while this is active. Scryer gives 2x Resources (Non-Helium/Nullifium) and a chance for Dark Essence. Once this is on, priority for Scryer decisions goes as such:<br>NEVER USE, FORCE USE, OVERKILL, MIN/MAX ZONE<br><br><b>NO OTHER BUTTONS WILL DO ANYTHING IF THIS IS OFF.</b>', 'boolean', true, null, 'Scryer');
    createSetting('ScryerUseWhenOverkill', 'Use When Overkill', 'Overrides everything! Toggles stance when we can Overkill in S, giving us double loot with no speed penalty (minimum one overkill, if you have more than 1, it will lose speed) <b>NOTE:</b> This being on, and being able to overkill in S will override ALL other settings <u>(Except never use in spire)</u>. This is a boolean logic shortcut that disregards all the other settings including Min and Max Zone. If you ONLY want to use S during Overkill, as a workaround: turn this on and Min zone: to 9999 and everything else off(red). ', 'boolean', true, null, 'Scryer');
    createSetting('ScryerMinZone', 'Min Zone', 'Minimum zone to start using scryer in.(inclusive) Recommend:(60 or 181). Overkill ignores this. This needs to be On & Valid for the <i>MAYBE</i> option on all other Scryer settings to do anything if Overkill is off. Tip: Use 9999 to disable all Non-Overkill, Non-Force, scryer usage.', 'value', '181', null, 'Scryer');
    createSetting('ScryerMaxZone', 'Max Zone', '<b>0 or -1 to disable (Recommended)</b><br>Overkill ignores this. Zone to STOP using scryer at (not inclusive). Turning this ON with a positive number stops <i>MAYBE</i> use of all other Scryer settings.', 'value', '230', null, 'Scryer');
    createSetting('onlyminmaxworld', 'World Min & Max Only', 'Forces Scryer to only work in world regardless of other settings. ', 'boolean', false, null, 'Scryer');
    createSetting('ScryerUseinMaps2', ['Maps: NEVER', 'Maps: FORCE', 'Maps: MAYBE'], '<b>NEVER</b> Means what it says!!!<br><b>FORCE</b> means Scryer will ALWAYS activate in Maps<br><b>MAYBE</b> means that Overkill and Min/Max use are allowed.<br>This setting requires use on Corrupteds to be on after corruption/magma.<br><br>Recommend MAYBE.', 'multitoggle', 2, null, 'Scryer');
    createSetting('ScryerUseinVoidMaps2', ['VoidMaps: NEVER', 'VoidMaps: FORCE', 'VoidMaps: MAYBE'], '<b>NEVER</b> Means what it says!!!<br><b>FORCE</b> means Scryer will ALWAYS activate in Void Maps<br><b>MAYBE</b> means that Overkill and Min/Max use are allowed. ', 'multitoggle', 0, null, 'Scryer');

    //Line 2
    createSetting('ScryerUseinPMaps', ['P Maps: NEVER', 'P Maps: FORCE', 'P Maps: MAYBE'], '<b>NEVER</b> Means what it says!!!<br><b>FORCE</b> means Scryer will ALWAYS activate in maps higher than your zone<br><b>MAYBE</b> means that Overkill and Min/Max use are allowed.<br>Recommend NEVER.', 'multitoggle', 0, null, 'Scryer');
    createSetting('ScryerUseinBW', ['BW: NEVER', 'BW: FORCE', 'BW: MAYBE'], '<b>NEVER</b> Means what it says!!!<br><b>FORCE</b> means Scryer will ALWAYS activate in BW Maps<br><b>MAYBE</b> means that Overkill and Min/Max use are allowed.<br>This setting requires use in Maps to be on. <br><br>Recommend NEVER.', 'multitoggle', 0, null, 'Scryer');
    createSetting('ScryerUseinSpire2', ['Spire: NEVER', 'Spire: FORCE', 'Spire: MAYBE'], '<b>NEVER</b> Means what it says!!!<br><b>FORCE</b> means Scryer will ALWAYS activate in the Spire<br><b>MAYBE</b> means that Overkill and Min/Max use are allowed.<br>This setting requires use on Corrupteds to be on for corrupted enemies.<br><br>Recommend NEVER.', 'multitoggle', 0, null, 'Scryer');
    createSetting('ScryerSkipBoss2', ['Boss: NEVER (All Levels)', 'Boss: NEVER (Above VoidLevel)', 'Boss: MAYBE'], '<b>NEVER (All Levels)</b> will NEVER use S in cell 100 of the world!!!<br><b>NEVER (Above VoidLevel)</b> will NEVER use S in cell 100 of the world ABOVE the zone that your void maps are set to run at (Maps).<br><b>MAYBE</b> treats the cell no differently to any other, Overkill and Min/Max Scryer is allowed.<br><br>Recommend NEVER (There is little benefit to double NON-HELIUM resources and a small chance of DE).', 'multitoggle', 0, null, 'Scryer');
    createSetting('ScryerSkipCorrupteds2', ['Corrupted: NEVER', 'Corrupted: FORCE', 'Corrupted: MAYBE'], '<b>NEVER</b> Means what it says!!!<br><b>FORCE</b> means Scryer will ALWAYS activate against Corrupted enemies<br><b>MAYBE</b> means that Overkill and Min/Max use are allowed.<br><b>Magma maps and Corrupted Voidmaps are currently classified as corrupted</b> and NEVER here will override Maps and Voidmaps use of Scryer<br><br>Recommend MAYBE.', 'multitoggle', 2, null, 'Scryer');
    createSetting('ScryerSkipHealthy', ['Healthy: NEVER', 'Healthy: FORCE', 'Healthy: MAYBE'], '<b>NEVER</b> Means what it says!!!<br><b>FORCE</b> means Scryer will ALWAYS activate against Healthy enemies<br><b>MAYBE</b> means that Overkill and Min/Max use are allowed.<br><b>Corrupted Voidmaps are currently classified as Healthy (same as corrupted)</b> and NEVER here will override Maps and Voidmaps use of Scryer<br><br>Recommend MAYBE.', 'multitoggle', 2, null, 'Scryer');
    createSetting('ScryUseinPoison', 'Scry in Poison', 'Decides what you do in Poison. <br><b>-1</b> = Maybe <br><b>0</b> = Never <br><b>Above 0</b> = Max Zone you want it scrying ', 'value', -1, null, 'Scryer');

    //Line 3
    createSetting('ScryUseinWind', 'Scry in Wind', 'Decides what you do in Wind. <br><b>-1</b> = Maybe <br><b>0</b> = Never <br><b>Above 0</b> = Max Zone you want it scrying', 'value', -1, null, 'Scryer');
    createSetting('ScryUseinIce', 'Scry in Ice', 'Decides what you do in Ice. <br><b>-1</b> = Maybe <br><b>0</b> = Never <br><b>Above 0</b> = Max Zone you want it scrying', 'value', -1, null, 'Scryer');
    createSetting('ScryerDieZ', 'Die To Use S', '<b>-1 to disable.</b><br>Turning this on will switch you back to S even when doing so would kill you. Happens in scenarios where you used Skip Corrupteds that took you into regular Autostance X/H stance, killed the corrupted and reached a non-corrupted enemy that you wish to use S on, but you havent bred yet and you are too low on health to just switch back to S. So you\'d rather die, wait to breed, then use S for the full non-corrupted enemy, to maximize DE. NOTE: Use at your own risk.<br>Use this input to set the minimum zone that scryer activates in (You can use decimal values to specify what cell this setting starts from)', 'value', 230.60, null, 'Scryer');
    createSetting('screwessence', 'Remaining Essence Only', 'Why scry when theres no essence? Turns off scrying when the remaining enemies with essence drops to 0. ', 'boolean', false, null, 'Scryer');


    //Magma

    createSetting('UseAutoGen', 'Auto Generator', 'Turn this on to use these settings. ', 'boolean', false, null, 'Magma');
    createSetting('beforegen', ['Gain Mi', 'Gain Fuel', 'Hybrid'], '<b>MODE BEFORE FUELING: </b>Which mode to use before fueling. This is the mode which the generator will use if you fuel after z230. Using Hybrid mode before unlocking is very naughty and will be punished! ', 'multitoggle', 1, null, 'Magma');
    createSetting('fuellater', 'Start Fuel Z', 'Start fueling at this zone instead of 230. I would suggest you have a value lower than your max, for obvious reasons. Recommend starting at a value close-ish to your max supply. Use 230 to use your <b>BEFORE FUEL</b> setting. ', 'value', -1, null, 'Magma');
    createSetting('fuelend', 'End Fuel Z', 'End fueling at this zone. After this zone is reached, will follow your preference. -1 to fuel infinitely. ', 'value', -1, null, 'Magma');
    createSetting('defaultgen', ['Gain Mi', 'Gain Fuel', 'Hybrid'], '<b>MODE AFTER FUELING: </b>Which mode to use after fueling. Using Hybrid mode before unlocking is very naughty and will be punished! ', 'multitoggle', 1, null, 'Magma');
    createSetting('AutoGenDC', ['Daily: Normal', 'Daily: Fuel', 'Daily: Hybrid'], '<b>Normal:</b> Uses the AutoGen settings. <br><b>Fuel:</b> Fuels the entire Daily. <br><b>Hybrid:</b> Uses Hybrid for the entire Daily. Using Hybrid mode before unlocking is very naughty and will be punished! ', 'multitoggle', 1, null, 'Magma');
    createSetting('AutoGenC2', ['C2: Normal', 'C2: Fuel', 'C2: Hybrid'], '<b>Normal:</b> Uses the AutoGen settings. <br><b>Fuel:</b> Fuels the entire C2. <br><b>Hybrid:</b> Uses Hybrid for the entire C2. Using Hybrid mode before unlocking is very naughty and will be punished! ', 'multitoggle', 1, null, 'Magma');

    //Spend Mi
    document.getElementById('AutoGenC2').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('spendmagmite', ['Spend Magmite OFF', 'Spend Magmite (Portal)', 'Spend Magmite Always'], 'Auto Spends any unspent Magmite immediately before portaling. (Or Always, if toggled). Part 1 buys any permanent one-and-done upgrades in order from most expensive to least. Part 2 then analyzes Efficiency vs Capacity for cost/benefit, and buys Efficiency if its BETTER than Capacity. If not, if the PRICE of Capacity is less than the price of Supply, it buys Capacity. If not, it buys Supply. And then it repeats itself until you run out of Magmite and cant buy anymore. ', 'multitoggle', 1, null, 'Magma');
    createSetting('ratiospend', 'Ratio Spending', 'Spends Magmite in a Ratio you define. ', 'boolean', false, null, 'Magma');
    createSetting('effratio', 'Efficiency', 'Use -1 or 0 to not spend on this. Any value above 0 will spend. ', 'value', -1, null, 'Magma');
    createSetting('capratio', 'Capacity', 'Use -1 or 0 to not spend on this. Any value above 0 will spend. ', 'value', -1, null, 'Magma');
    createSetting('supratio', 'Supply', 'Use -1 or 0 to not spend on this. Any value above 0 will spend. ', 'value', -1, null, 'Magma');
    createSetting('ocratio', 'Overclocker', 'Use -1 or 0 to not spend on this. Any value above 0 will spend. ', 'value', -1, null, 'Magma');
    createSetting('SupplyWall', 'Throttle Supply (or Capacity)', 'Positive number NOT 1 e.g. 2.5: Consider Supply when its cost * 2.5 is < Capacity, instead of immediately when < Cap. Effectively throttles supply for when you don\'t need too many.<br><br>Negative number (-1 is ok) e.g. -2.5: Consider Supply if it costs < Capacity * 2.5, buy more supplys! Effectively throttling capacity instead.<br><br><b>Set to 1: DISABLE SUPPLY only spend magmite on Efficiency, Capacity and Overclocker. Always try to get supply close to your HZE. <br>Set to 0: IGNORE SETTING and use old behaviour (will still try to buy overclocker)</b>', 'valueNegative', 0.4, null, 'Magma');
    createSetting('spendmagmitesetting', ['Normal', 'Normal & No OC', 'OneTime Only', 'OneTime & OC'], '<b>Normal:</b> Spends Magmite Normally as Explained in Magmite spending behaviour. <br><b>Normal & No OC:</b> Same as normal, except skips OC afterbuying 1 OC upgrade. <br><b>OneTime Only:</b> Only Buys the One off upgrades except skips OC afterbuying 1 OC upgrade. <br><b>OneTime & OC:</b> Buys all One off upgrades, then buys OC only. ', 'multitoggle', 0, null, 'Magma');
    createSetting('MagmiteExplain', 'Magmite spending behaviour', '1. Buy one-and-done upgrades, expensive first, then consider 1st level of Overclocker;<br>2. Buy Overclocker IF AND ONLY IF we can afford it;<br>2.5. Exit if OneTimeOnly<br>3. Buy Efficiency if it is better than capacity;<br>4. Buy Capacity or Supply depending on which is cheaper, or based on SupplyWall', 'infoclick', 'MagmiteExplain', null, 'Magma');

    //Heirloom
    createSetting('highdmg', 'WS: High Damage', '<b>HIGH DAMAGE HEIRLOOM</b><br><br>Enter the name of your high damage heirloom. This is your heirloom that you will use normally. ', 'textValue', 'undefined', null, 'Heirlooms');
    createSetting('lowdmg', 'WS: Low Damage', '<b>LOW DAMAGE HEIRLOOM</b><br><br>Enter the name of your low damage heirloom. This is the heirloom that you will use for windstacking. ', 'textValue', 'undefined', null, 'Heirlooms');

    //Heirloom Swapping
    document.getElementById('lowdmg').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Rhs', 'Heirloom Swapping', 'Heirloom swapping master button. Turn this on to allow heirloom swapping and its associated settings. ', 'boolean', false, null, 'Heirlooms');

    //Shield Swapping
    document.getElementById('Rhs').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Rhsshield', 'Shields', 'Toggle to swap Shields', 'boolean', false, null, 'Heirlooms');
    createSetting('Rhsz', 'HS: Zone', 'Which zone to swap from your first heirloom you have defined to your second heirloom you have defined. I.e if this value is 75 it will switch to the second heirloom <b>on z75</b>', 'value', '-1', null, 'Heirlooms');
    createSetting('Rhs1', 'HS: First', '<b>First Heirloom to use</b><br><br>Enter the name of your first heirloom. This is the heirloom that you will use before swapping to the second heirloom at the zone you have defined in the HS: Zone. ', 'textValue', 'undefined', null, 'Heirlooms');
    createSetting('Rhs2', 'HS: Second', '<b>Second Heirloom to use</b><br><br>Enter the name of your second heirloom. This is the heirloom that you will use after swapping from the first heirloom at the zone you have defined in the HS: Zone. ', 'textValue', 'undefined', null, 'Heirlooms');

    //Staff Swapping
    document.getElementById('Rhs2').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Rhsstaff', 'Staffs', 'Toggle to swap Staffs', 'boolean', false, null, 'Heirlooms');
    createSetting('Rhsworldstaff', 'World', '<b>World Staff</b><br><br>Enter the name of your world staff.', 'textValue', 'undefined', null, 'Heirlooms');
    createSetting('Rhsmapstaff', 'Map', '<b>Mapping staff</b><br><br>Enter the name of your mapping staff.', 'textValue', 'undefined', null, 'Heirlooms');
    createSetting('Rhstributestaff', 'Tribute', '<b>Tribute farming staff</b><br><br>Enter the name of the staff you would like to equip during tribute farming.', 'textValue', 'undefined', null, 'Heirlooms');

    //Heirloom Line
    document.getElementById('Rhstributestaff').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('autoheirlooms', 'Auto Heirlooms', 'Auto Heirlooms master button. Turn this on to enable all Auto Heirloom settings. <br><br><b>The Modifier points will be explained here.</b> The more points an heirloom has, the better chance it has of being kept. If empty is selected, it will muliplty the score by 4. <br><br>E.g Mod 1 = CC (+5 if dropped, 1st modifier) <br>Mod 2 = CD (+5 if dropped, 2nd modifier) <br>Mod 3 = PB (+5 if dropped, 3rd modifier) <br>Mod 4 = Empty (x4 if dropped, +0 if not) <br>Mod 5 = Empty (x4 if dropped, +0 if not) <br><br>If an heirloom dropped with these exact modifiers, it would get a score of 192 (5+5+5*4*4=240). The highest point heirlooms will be kept. <br> <b>You MUST select at least one modifier. It will fill up the slots first then recycle the lowest rarity. </b>', 'boolean', false, null, 'Heirlooms');
    createSetting('typetokeep', ['None', 'Shields', 'Staffs', 'Cores', 'All'], '<b>Shields: </b>Keeps Shields and nothing else.<br><b>Staffs: </b>Keeps Staffs and nothing else.<br><b>Cores: </b>Keeps Cores and nothing else.<br><b>All: </b>Keeps 4 Shields and 3 Staffs and 3 Cores. If you have protected heirlooms in your inventory it will overrite one slot. E.g if one heirloom is protected, you will keep 4 Shields and 3 Staffs and 2 Cores. ', 'multitoggle', 0, null, 'Heirlooms');
    createSetting('raretokeep', 'Rarity to Keep', 'Auto Heirlooms. Keeps the selected rarity of heirloom, recycles all others when your inventory is full. You may keep lower rarity heirlooms if you have empty slots. ', 'dropdown', 'Any', ["Any", "Common", "Uncommon", "Rare", "Epic", "Legendary", "Magnificent", "Ethereal", "Magmatic", "Plagued", "Radiating", "Hazardous", "Enigmatic", "Mutated"], 'Heirlooms');

    //Shield Line
    document.getElementById('raretokeep').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('keepshields', 'Shields', 'Auto Heirlooms. Enables in-depth shield settings. ', 'boolean', false, null, 'Heirlooms');
    createSetting('slot1modsh', 'Shield: Modifier 1', 'Auto Heirlooms. Keeps Shields with selected Mod. Modifier 1 is worth 5 points. ', 'dropdown', 'empty', ["empty", "playerEfficiency", "trainerEfficiency", "storageSize", "breedSpeed", "trimpHealth", "trimpAttack", "trimpBlock", "critDamage", "critChance", "voidMaps", "plaguebringer", "prismatic", "gammaBurst", "inequality"], 'Heirlooms');
    createSetting('slot2modsh', 'Shield: Modifier 2', 'Auto Heirlooms. Keeps Shields with selected Mod. Modifier 2 is worth 5 points. ', 'dropdown', 'empty', ["empty", "playerEfficiency", "trainerEfficiency", "storageSize", "breedSpeed", "trimpHealth", "trimpAttack", "trimpBlock", "critDamage", "critChance", "voidMaps", "plaguebringer", "prismatic", "gammaBurst", "inequality"], 'Heirlooms');
    createSetting('slot3modsh', 'Shield: Modifier 3', 'Auto Heirlooms. Keeps Shields with selected Mod. Modifier 3 is worth 5 points. ', 'dropdown', 'empty', ["empty", "playerEfficiency", "trainerEfficiency", "storageSize", "breedSpeed", "trimpHealth", "trimpAttack", "trimpBlock", "critDamage", "critChance", "voidMaps", "plaguebringer", "prismatic", "gammaBurst", "inequality"], 'Heirlooms');
    createSetting('slot4modsh', 'Shield: Modifier 4', 'Auto Heirlooms. Keeps Shields with selected Mod. Modifier 4 is worth 5 points. ', 'dropdown', 'empty', ["empty", "playerEfficiency", "trainerEfficiency", "storageSize", "breedSpeed", "trimpHealth", "trimpAttack", "trimpBlock", "critDamage", "critChance", "voidMaps", "plaguebringer", "prismatic", "gammaBurst", "inequality"], 'Heirlooms');
    createSetting('slot5modsh', 'Shield: Modifier 5', 'Auto Heirlooms. Keeps Shields with selected Mod. Modifier 5 is worth 5 points. ', 'dropdown', 'empty', ["empty", "playerEfficiency", "trainerEfficiency", "storageSize", "breedSpeed", "trimpHealth", "trimpAttack", "trimpBlock", "critDamage", "critChance", "voidMaps", "plaguebringer", "prismatic", "gammaBurst", "inequality"], 'Heirlooms');
    createSetting('slot6modsh', 'Shield: Modifier 6', 'Auto Heirlooms. Keeps Shields with selected Mod. Modifier 6 is worth 5 points. ', 'dropdown', 'empty', ["empty", "playerEfficiency", "trainerEfficiency", "storageSize", "breedSpeed", "trimpHealth", "trimpAttack", "trimpBlock", "critDamage", "critChance", "voidMaps", "plaguebringer", "prismatic", "gammaBurst", "inequality"], 'Heirlooms');
    createSetting('slot7modsh', 'Shield: Modifier 7', 'Auto Heirlooms. Keeps Shields with selected Mod. Modifier 7 is worth 5 points. ', 'dropdown', 'empty', ["empty", "playerEfficiency", "trainerEfficiency", "storageSize", "breedSpeed", "trimpHealth", "trimpAttack", "trimpBlock", "critDamage", "critChance", "voidMaps", "plaguebringer", "prismatic", "gammaBurst", "inequality"], 'Heirlooms');

    //Staff Line
    document.getElementById('slot7modsh').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('keepstaffs', 'Staffs', 'Auto Heirlooms. Enables in-depth staff settings. ', 'boolean', false, null, 'Heirlooms');
    createSetting('slot1modst', 'Staff: Modifier 1', 'Auto Heirlooms. Keeps Staffs with selected Mod. Modifier 1 is worth 5 points. ', 'dropdown', 'empty', ["empty", "metalDrop", "foodDrop", "woodDrop", "gemsDrop", "fragmentsDrop", "minerSpeed", "FarmerSpeed", "LumberjackSpeed", "DragimpSpeed", "ExplorerSpeed", "ScientistSpeed", "FluffyExp", "ParityPower"], 'Heirlooms');
    createSetting('slot2modst', 'Staff: Modifier 2', 'Auto Heirlooms. Keeps Staffs with selected Mod. Modifier 2 is worth 5 points. ', 'dropdown', 'empty', ["empty", "metalDrop", "foodDrop", "woodDrop", "gemsDrop", "fragmentsDrop", "minerSpeed", "FarmerSpeed", "LumberjackSpeed", "DragimpSpeed", "ExplorerSpeed", "ScientistSpeed", "FluffyExp", "ParityPower"], 'Heirlooms');
    createSetting('slot3modst', 'Staff: Modifier 3', 'Auto Heirlooms. Keeps Staffs with selected Mod. Modifier 3 is worth 5 points. ', 'dropdown', 'empty', ["empty", "metalDrop", "foodDrop", "woodDrop", "gemsDrop", "fragmentsDrop", "minerSpeed", "FarmerSpeed", "LumberjackSpeed", "DragimpSpeed", "ExplorerSpeed", "ScientistSpeed", "FluffyExp", "ParityPower"], 'Heirlooms');
    createSetting('slot4modst', 'Staff: Modifier 4', 'Auto Heirlooms. Keeps Staffs with selected Mod. Modifier 4 is worth 5 points. ', 'dropdown', 'empty', ["empty", "metalDrop", "foodDrop", "woodDrop", "gemsDrop", "fragmentsDrop", "minerSpeed", "FarmerSpeed", "LumberjackSpeed", "DragimpSpeed", "ExplorerSpeed", "ScientistSpeed", "FluffyExp", "ParityPower"], 'Heirlooms');
    createSetting('slot5modst', 'Staff: Modifier 5', 'Auto Heirlooms. Keeps Staffs with selected Mod. Modifier 5 is worth 5 points. ', 'dropdown', 'empty', ["empty", "metalDrop", "foodDrop", "woodDrop", "gemsDrop", "fragmentsDrop", "minerSpeed", "FarmerSpeed", "LumberjackSpeed", "DragimpSpeed", "ExplorerSpeed", "ScientistSpeed", "FluffyExp", "ParityPower"], 'Heirlooms');
    createSetting('slot6modst', 'Staff: Modifier 6', 'Auto Heirlooms. Keeps Staffs with selected Mod. Modifier 6 is worth 5 points. ', 'dropdown', 'empty', ["empty", "metalDrop", "foodDrop", "woodDrop", "gemsDrop", "fragmentsDrop", "minerSpeed", "FarmerSpeed", "LumberjackSpeed", "DragimpSpeed", "ExplorerSpeed", "ScientistSpeed", "FluffyExp", "ParityPower"], 'Heirlooms');
    createSetting('slot7modst', 'Staff: Modifier 7', 'Auto Heirlooms. Keeps Staffs with selected Mod. Modifier 7 is worth 5 points. ', 'dropdown', 'empty', ["empty", "metalDrop", "foodDrop", "woodDrop", "gemsDrop", "fragmentsDrop", "minerSpeed", "FarmerSpeed", "LumberjackSpeed", "DragimpSpeed", "ExplorerSpeed", "ScientistSpeed", "FluffyExp", "ParityPower"], 'Heirlooms');

    //Core Line
    document.getElementById('slot7modst').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('keepcores', 'Cores', 'Auto Heirlooms. Enables in-depth core settings. ', 'boolean', false, null, 'Heirlooms');
    createSetting('slot1modcr', 'Cores: Modifier 1', 'Auto Heirlooms. Keeps Cores with selected Mod. Modifier 1 is worth 5 points. ', 'dropdown', 'empty', ["empty", "fireTrap", "poisonTrap", "lightningTrap", "runestones", "strengthEffect", "condenserEffect"], 'Heirlooms');
    createSetting('slot2modcr', 'Cores: Modifier 2', 'Auto Heirlooms. Keeps Cores with selected Mod. Modifier 2 is worth 5 points. ', 'dropdown', 'empty', ["empty", "fireTrap", "poisonTrap", "lightningTrap", "runestones", "strengthEffect", "condenserEffect"], 'Heirlooms');
    createSetting('slot3modcr', 'Cores: Modifier 3', 'Auto Heirlooms. Keeps Cores with selected Mod. Modifier 3 is worth 5 points. ', 'dropdown', 'empty', ["empty", "fireTrap", "poisonTrap", "lightningTrap", "runestones", "strengthEffect", "condenserEffect"], 'Heirlooms');
    createSetting('slot4modcr', 'Cores: Modifier 4', 'Auto Heirlooms. Keeps Cores with selected Mod. Modifier 4 is worth 5 points. ', 'dropdown', 'empty', ["empty", "fireTrap", "poisonTrap", "lightningTrap", "runestones", "strengthEffect", "condenserEffect"], 'Heirlooms');



    //Golden

    createSetting('AutoGoldenUpgrades', 'AutoGoldenUpgrades', 'Buys Golden Upgrades in Fillers. Helium buys all Helium golden upgrades. Battle buys all Battle golden upgrades. Void buys 8 Void golden upgrades (max number you can buy) then buys helium golden upgrades. Void + Battle buys 8 voids then battle. Will run way faster than Vanilla AutoGold so if you have this on expect it to win over vanilla settings. ', 'dropdown', 'Off', ["Off", "Helium", "Battle", "Void", "Void + Battle"], 'Golden');
    createSetting('dAutoGoldenUpgrades', 'Daily AutoGoldenUpgrades', 'Buys Golden Upgrades in Dailies. Helium buys all Helium golden upgrades. Battle buys all Battle golden upgrades. Void buys 8 Void golden upgrades (max number you can buy) then buys helium golden upgrades. Void + Battle buys 8 voids then battle. Will run way faster than Vanilla AutoGold so if you have this on expect it to win over vanilla settings. ', 'dropdown', 'Off', ["Off", "Helium", "Battle", "Void", "Void + Battle"], 'Golden');
    createSetting('cAutoGoldenUpgrades', 'C2 AutoGoldenUpgrades', 'Buys Golden Upgrades in C2s. Helium buys all Helium golden upgrades. Battle buys all Battle golden upgrades. Void buys 8 Void golden upgrades (max number you can buy) then buys helium golden upgrades. Void + Battle buys 8 voids then battle. Will run way faster than Vanilla AutoGold so if you have this on expect it to win over vanilla settings. ', 'dropdown', 'Off', ["Off", "Battle", "Void", "Void + Battle"], 'Golden');
    document.getElementById('cAutoGoldenUpgrades').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('voidheliumbattle', 'Void Battle', '<b>-1 to disable.</b><br> Buys Battle goldens instead of Helium at this zone and onwards. This option only appears when selecting void. ', 'value', -1, null, 'Golden');
    createSetting('dvoidheliumbattle', 'Daily Void Battle', '<b>-1 to disable.</b><br> Buys Battle goldens instead of Helium at this zone and onwards in Dailies. This option only appears when selecting void. ', 'value', -1, null, 'Golden');
    createSetting('radonbattle', 'Helium Battle', '<b>-1 to disable.</b><br> Buys Battle goldens instead of helium after this many helium goldens have been purchased and onwards. This option only appears when selecting helium. ', 'value', -1, null, 'Golden');
    createSetting('dradonbattle', 'Daily Helium Battle', '<b>-1 to disable.</b><br> Buys Battle goldens instead of helium after this many helium goldens have been purchased and onwards in Dailies. This option only appears when selecting helium. ', 'value', -1, null, 'Golden');
    createSetting('battleradon', 'Battle Helium', '<b>-1 to disable.</b><br> Buys helium goldens instead of Battle after this many Battle goldens have been purchased and onwards. This option only appears when selecting battle. ', 'value', -1, null, 'Golden');
    createSetting('dbattleradon', 'Daily Battle Helium', '<b>-1 to disable.</b><br> Buys helium goldens instead of Battle after this many battle goldens have been purchased and onwards in Dailies. This option only appears when selecting battle. ', 'value', -1, null, 'Golden');


    //RGolden

    createSetting('RAutoGoldenUpgrades', 'AutoGoldenUpgrades', 'Buys Golden Upgrades in Fillers. Radon buys all Radon golden upgrades. Battle buys all Battle golden upgrades. Void buys 8 Void golden upgrades (max number you can buy) then buys helium golden upgrades. Void + Battle buys 8 voids then battle. ', 'dropdown', 'Off', ["Off", "Radon", "Battle", "Void", "Void + Battle"], 'Golden');
    createSetting('RdAutoGoldenUpgrades', 'Daily AutoGoldenUpgrades', 'Buys Golden Upgrades in Dailies. Radon buys all Radon golden upgrades. Battle buys all Battle golden upgrades. Void buys 8 Void golden upgrades (max number you can buy) then buys helium golden upgrades. Void + Battle buys 8 voids then battle. ', 'dropdown', 'Off', ["Off", "Radon", "Battle", "Void", "Void + Battle"], 'Golden');
    createSetting('RcAutoGoldenUpgrades', 'C2 AutoGoldenUpgrades', 'Buys Golden Upgrades in C2s. Radon buys all Radon golden upgrades. Battle buys all Battle golden upgrades. Void buys 8 Void golden upgrades (max number you can buy) then buys helium golden upgrades. Void + Battle buys 8 voids then battle. ', 'dropdown', 'Off', ["Off", "Battle", "Void", "Void + Battle"], 'Golden');
    document.getElementById('RcAutoGoldenUpgrades').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('Rvoidheliumbattle', 'Void Battle', '<b>-1 to disable.</b><br> Buys Battle goldens instead of Radon at this zone and onwards. This option only appears when selecting void. ', 'value', -1, null, 'Golden');
    createSetting('Rdvoidheliumbattle', 'Daily Void Battle', '<b>-1 to disable.</b><br> Buys Battle goldens instead of Radon at this zone and onwards in Dailies. This option only appears when selecting void. ', 'value', -1, null, 'Golden');
    createSetting('Rradonbattle', 'Radon Battle', '<b>-1 to disable.</b><br> Buys Battle goldens instead of Radon after this many Radon goldens have been purchased and onwards. This option only appears when selecting radon. ', 'value', -1, null, 'Golden');
    createSetting('Rdradonbattle', 'Daily Radon Battle', '<b>-1 to disable.</b><br> Buys Battle goldens instead of Radon after this many Radon goldens have been purchased and onwards in Dailies. This option only appears when selecting radon. ', 'value', -1, null, 'Golden');
    createSetting('Rbattleradon', 'Battle Radon', '<b>-1 to disable.</b><br> Buys Radon goldens instead of Battle after this many Battle goldens have been purchased and onwards. This option only appears when selecting battle. ', 'value', -1, null, 'Golden');
    createSetting('Rdbattleradon', 'Daily Battle Radon', '<b>-1 to disable.</b><br> Buys Radon goldens instead of Battle after this many battle goldens have been purchased and onwards in Dailies. This option only appears when selecting battle. ', 'value', -1, null, 'Golden');



    //AB

    createSetting('RAB', 'SA', 'Turn on SA settings and allow them to work. Do not open input settings when SA is on or you will crash. ', 'boolean', false, null, "SA");
    createSetting('RABpreset', 'Presets', 'Automatically switch presets depending on current enemy. You must make sure preset 1 is for Poison\, preset 2 Bleed and preset 3 Shock. If enemy has less than 2 resistances it will switch between the non-resisted presets till you kill the enemy. It will not purchase any equips or try different ones though so it may get stuck till you update your presets. ', 'boolean', false, null, "SA");
    createSetting('RABdustsimple', ['Simple Dust Off', 'SD: Equipped', 'SD: Non-hidden'], 'SD: Equipped automatically upgrades currently equipped items by lowest price. SD: Non-hidden automatically upgrades items that are not hidden and not equipped. ', 'multitoggle', 0, null, 'SA');
    createSetting('RABfarm', 'Save String', 'Saves your best Dust/s using SA level and your equipped items in a string. If this is on it will continously check your dust/s and generate a farm string if you beat your previous best. ', 'boolean', false, null, "SA");
    createSetting('RABfarmswitch', 'Switch', 'If this is on it will swtich directly to the SA level and equipped items. ', 'boolean', false, null, "SA");
    createSetting('RABfarmstring', 'String', 'This is your best farming string. Feel free to share it with other AT users. If you do use a shared string I advise you to change the second value (the dust part) to 0 so it calcs the actual dust you get instead of the shared strings. ', 'textValue', '-1', null, "SA");
    createSetting('RABsolve', 'Solver', 'Solves your current level including farming\, item levels\, and contracts. Currently does up to 10. ', 'boolean', false, null, "SA");



    //Nature

    //Tokens
    createSetting('AutoNatureTokens', 'Spend Nature Tokens', '<b>MASTER BUTTON</b> Automatically spend or convert nature tokens.', 'boolean', false, null, 'Nature');
    createSetting('tokenthresh', 'Token Threshold', 'If Tokens would go below this value it will not convert tokens. ', 'value', -1, null, 'Nature');
    createSetting('AutoPoison', 'Poison', 'Spend/convert Poison tokens', 'dropdown', 'Off', ['Off', 'Empowerment', 'Transfer', 'Convert to Wind', 'Convert to Ice', 'Convert to Both'], 'Nature');
    createSetting('AutoWind', 'Wind', 'Spend/convert Wind tokens', 'dropdown', 'Off', ['Off', 'Empowerment', 'Transfer', 'Convert to Poison', 'Convert to Ice', 'Convert to Both'], 'Nature');
    createSetting('AutoIce', 'Ice', 'Spend/convert Ice tokens', 'dropdown', 'Off', ['Off', 'Empowerment', 'Transfer', 'Convert to Poison', 'Convert to Wind', 'Convert to Both'], 'Nature');

    //Enlights
    document.getElementById('AutoIce').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('autoenlight', 'Enlight: Auto', 'Enables Automatic Enlightenment. Use the settings to define how it works. ', 'boolean', false, null, 'Nature');
    document.getElementById('autoenlight').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('pfillerenlightthresh', 'E: F: Poison', 'Activate Poison Enlight when Enlight cost is below this Thresh in Fillers. Consumes Tokens. -1 to disable. ', 'value', -1, null, 'Nature');
    createSetting('wfillerenlightthresh', 'E: F: Wind', 'Activate Wind Enlight when Enlight cost is below this Thresh in Fillers. Consumes Tokens. -1 to disable. ', 'value', -1, null, 'Nature');
    createSetting('ifillerenlightthresh', 'E: F: Ice', 'Activate Ice Enlight when Enlight cost is below this Thresh in Fillers. Consumes Tokens. -1 to disable. ', 'value', -1, null, 'Nature');
    document.getElementById('ifillerenlightthresh').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('pdailyenlightthresh', 'E: D: Poison', 'Activate Poison Enlight when Enlight cost is below this Thresh in Dailies. Consumes Tokens. -1 to disable. ', 'value', -1, null, 'Nature');
    createSetting('wdailyenlightthresh', 'E: D: Wind', 'Activate Wind Enlight when Enlight cost is below this Thresh in Dailies. Consumes Tokens. -1 to disable. ', 'value', -1, null, 'Nature');
    createSetting('idailyenlightthresh', 'E: D: Ice', 'Activate Ice Enlight when Enlight cost is below this Thresh in Dailies. Consumes Tokens. -1 to disable. ', 'value', -1, null, 'Nature');
    document.getElementById('idailyenlightthresh').parentNode.insertAdjacentHTML('afterend', '<br>');
    createSetting('pc2enlightthresh', 'E: C: Poison', 'Activate Poison Enlight when Enlight cost is below this Thresh in C2s. Consumes Tokens. -1 to disable. ', 'value', -1, null, 'Nature');
    createSetting('wc2enlightthresh', 'E: C: Wind', 'Activate Wind Enlight when Enlight cost is below this Thresh in C2s. Consumes Tokens. -1 to disable. ', 'value', -1, null, 'Nature');
    createSetting('ic2enlightthresh', 'E: C: Ice', 'Activate Ice Enlight when Enlight cost is below this Thresh in C2s. Consumes Tokens. -1 to disable. ', 'value', -1, null, 'Nature');


    //MAZ window Stuff
    document.getElementById('Rtimefarmmaz').setAttribute('onclick', 'MAZLookalike("Time Farm", "Rtimefarm")');
    document.getElementById('Rdtimefarmmaz').setAttribute('onclick', 'MAZLookalike("dTime Farm", "Rdtimefarm")');
    document.getElementById('Rsmithyfarmmaz').setAttribute('onclick', 'MAZLookalike("Smithy Farm", "Rsmithyfarm")');
    document.getElementById('Rtributefarmmaz').setAttribute('onclick', 'MAZLookalike("Tribute Farm", "Rtributefarm")');
    document.getElementById('Hshrinemaz').setAttribute('onclick', 'MAZLookalike("Shrine - U1", "Hshrine")');
    document.getElementById('Hdshrinemaz').setAttribute('onclick', 'MAZLookalike("Shrine - U1 (Daily)", "Hdshrine")');
    document.getElementById('Rshrinemaz').setAttribute('onclick', 'MAZLookalike("Shrine - U2", "Rshrine")');
    document.getElementById('Rdshrinemaz').setAttribute('onclick', 'MAZLookalike("Shrine - U2 (Daily)", "Rdshrine")');
    document.getElementById('Rblackbogmaz').setAttribute('onclick', 'MAZLookalike("Quagmire", "Rblackbog")');
    document.getElementById('Rinsanitymaz').setAttribute('onclick', 'MAZLookalike("Insanity", "Rinsanityon")');
    document.getElementById('Ralchfarmmaz').setAttribute('onclick', 'MAZLookalike("Alch", "Ralchon")');
    document.getElementById('Rhypofarmmaz').setAttribute('onclick', 'MAZLookalike("Hypo", "Rhypoon")');
    document.getElementById('RAMPraidmaz').setAttribute('onclick', 'MAZLookalike("Praid", "RAMPraid")');
    document.getElementById('RdAMPraidmaz').setAttribute('onclick', 'MAZLookalike("dPraid", "RdAMPraid")');

    //Display

    //Line 1
    createSetting('zonetracker', 'Zone', 'tracks zones you wil lnot see this huehue', 'value', 1, null, 'Display');
    createSetting('EnhanceGrids', 'Enhance Grids', 'Apply slight visual enhancements to world and map grids that highlights with drop shadow all the exotic, powerful, skeletimps and other special imps.', 'boolean', false, null, 'Display');
    createSetting('showbreedtimer', 'Enable Breed Timer', 'Enables the display of the hidden breedtimer. Turn this off to reduce memory. ', 'boolean', true, null, 'Display');
    createSetting('showautomapstatus', 'Enable AutoMap Status', 'Enables the display of the map status. Turn this off to reduce memory. ', 'boolean', true, null, 'Display');
    createSetting('Rshowautomapstatus', 'Enable AutoMap Status', 'Enables the display of the map status. Turn this off to reduce memory. ', 'boolean', true, null, 'Display');
    createSetting('EnableAFK', 'Go AFK Mode', '(Action Button). Go AFK uses a Black Screen, and suspends ALL the Trimps GUI visual update functions (updateLabels) to improve performance by not doing unnecessary stuff. This feature is primarily just a CPU and RAM saving mode. Everything will resume when you come back and press the Back button. Console debug output is also disabled. The blue color means this is not a settable setting, just a button. You can now also click the Zone # (World Info) area to go AFK now.', 'action', 'MODULES["performance"].EnableAFKMode()', null, 'Display');
    document.getElementById('battleSideTitle').setAttribute('onclick', 'MODULES["performance"].EnableAFKMode()');
    document.getElementById('battleSideTitle').setAttribute('onmouseover', "getZoneStats(event);this.style.cursor='pointer'");
    createSetting('ChangeLog', 'Show Changelog', '(Action Button). Shows the changelog popup message that AT loads on startup again, in case you missed it. The blue color means this is not a settable setting, just a button.', 'action', 'printChangelog()', null, 'Display');
    document.getElementById('Display').lastChild.insertAdjacentHTML('afterend', '<br>');



    //SPAM

    //Line 1

    createSetting('SpamGeneral', 'General Spam', 'General Spam = Notification Messages, Auto He/Hr', 'boolean', true, null, 'Display');
    createSetting('SpamUpgrades', 'Upgrades Spam', 'Upgrades Spam', 'boolean', true, null, 'Display');
    createSetting('SpamEquipment', 'Equipment Spam', 'Equipment Spam', 'boolean', true, null, 'Display');
    createSetting('SpamMaps', 'Maps Spam', 'Maps Spam = Buy,Pick,Run Maps,Recycle,CantAfford', 'boolean', true, null, 'Display');
    createSetting('SpamOther', 'Other Spam', 'Other Spam = mostly Better Auto Fight (disable with: MODULES[\\"fight\\"].enableDebug=false ), Trimpicide & AutoBreed/Gene Timer changes, AnalyticsID, etc - a catch all. ', 'boolean', true, null, 'Display');
    createSetting('SpamBuilding', 'Building Spam', 'Building Spam = all buildings, even storage', 'boolean', false, null, 'Display');
    createSetting('SpamJobs', 'Job Spam', 'Job Spam = All jobs, in scientific notation', 'boolean', false, null, 'Display');

    //Line 2
    createSetting('SpamGraphs', 'Starting Zone Spam', 'Disables \'Starting new Zone ###\' , RoboTrimp MagnetoShreik, and any future Graph Spam that comes from graph logs.', 'boolean', true, null, 'Display');
    createSetting('SpamMagmite', 'Magmite/Magma Spam', 'Everything in Magmite Module and Buy Magmamancers', 'boolean', true, null, 'Display');
    createSetting('SpamPerks', 'AutoPerks Spam', 'Everything in related to AutoPerks', 'boolean', true, null, 'Display');
    createSetting('SpamNature', 'Nature Spam', 'Everything in related to Nature', 'boolean', true, null, 'Display');



    //Export/Import/Default
    createSetting('ImportAutoTrimps', 'Import AutoTrimps', 'Import your AutoTrimps Settings. Asks you to name it as a profile afterwards.', 'infoclick', 'ImportAutoTrimps', null, 'Import Export');
    createSetting('ExportAutoTrimps', 'Export AutoTrimps', 'Export your AutoTrimps Settings as a output string text formatted in JSON.', 'infoclick', 'ExportAutoTrimps', null, 'Import Export');
    createSetting('DefaultAutoTrimps', 'Reset to Default', 'Reset everything to the way it was when you first installed the script. ', 'infoclick', 'ResetDefaultSettingsProfiles', null, 'Import Export');
    createSetting('Export60', '-60 AT Settings', 'Gives you an AT settings String that you can use to import. Use if you are less than z60. May not work for you perfectly, should really only be used as an example!', 'infoclick', 'Export60', null, 'Import Export');
    createSetting('Export550', '550+ AT Settings', 'Gives you an AT settings String that you can use to import. Use if you are z550+. May not work for you perfectly, should really only be used as an example! ', 'infoclick', 'Export550', null, 'Import Export');
    createSetting('CleanupAutoTrimps', 'Cleanup Saved Settings ', 'Deletes old values from previous versions of the script from your AutoTrimps Settings file.', 'infoclick', 'CleanupAutoTrimps', null, 'Import Export');

    document.getElementById('Rchallengehidearch').setAttribute('onclick', 'settingChanged("Rchallengehidearch"), modifyParentNode("Rchallengehidearch", "Rarchstring3")');
    modifyParentNode("Rchallengehidearch", "Rarchstring3");

    document.getElementById('Rchallengehidemayhem').setAttribute('onclick', 'settingChanged("Rchallengehidemayhem"), modifyParentNode("Rchallengehidemayhem", "Rmayhemmap")');
    modifyParentNode("Rchallengehidemayhem", "Rmayhemmap");

    document.getElementById('Rchallengehidestorm').setAttribute('onclick', 'settingChanged("Rchallengehidestorm"), modifyParentNode("Rchallengehidestorm", "Rstormmult")');
    modifyParentNode("Rchallengehidestorm", "Rstormmult");

    document.getElementById('Rchallengehideinsanity').setAttribute('onclick', 'settingChanged("Rchallengehideinsanity"), modifyParentNode("Rchallengehideinsanity", "Rinsanityfarmfrag")');
    modifyParentNode("Rchallengehideinsanity", "Rinsanityfarmfrag");

    document.getElementById('Rchallengehideexterminate').setAttribute('onclick', 'settingChanged("Rchallengehideexterminate"), modifyParentNode("Rchallengehideexterminate", "Rexterminateeq")');
    modifyParentNode("Rchallengehideexterminate", "Rexterminateeq");

    document.getElementById('Rchallengehidepanda').setAttribute('onclick', 'settingChanged("Rchallengehidepanda"), modifyParentNode("Rchallengehidepanda", "Rpandahits")');
    modifyParentNode("Rchallengehidepanda", "Rpandahits");

    document.getElementById('Rchallengehidealchemy').setAttribute('onclick', 'settingChanged("Rchallengehidealchemy"), modifyParentNode("Rchallengehidealchemy", "Ralchfarmfrag")');
    modifyParentNode("Rchallengehidealchemy", "Ralchfarmfrag");

    document.getElementById('Rchallengehidehypothermia').setAttribute('onclick', 'settingChanged("Rchallengehidehypothermia"), modifyParentNode("Rchallengehidehypothermia", "Rhypostorage")');
    modifyParentNode("Rchallengehidehypothermia", "Rhypostorage");
    
    document.getElementById('Rchallengehidedeso').setAttribute('onclick', 'settingChanged("Rchallengehidedeso"), modifyParentNode("Rchallengehidedeso", "Rdesomult")');
    modifyParentNode("Rchallengehidedeso", "Rdesomult");

    settingsProfileMakeGUI();

}

initializeAllSettings();

function createSetting(id, name, description, type, defaultValue, list, container) {
    var btnParent = document.createElement("DIV");
    btnParent.setAttribute('style', 'display: inline-block; vertical-align: top; margin-left: 1vw; margin-bottom: 1vw; width: 13.142vw;');
    var btn = document.createElement("DIV");
    btn.id = id;
    var loaded = autoTrimpSettings[id];
    if (type == 'boolean') {
        if (!(loaded && id == loaded.id && loaded.type === type))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                enabled: loaded === undefined ? (defaultValue || false) : loaded
            };
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings[id].enabled);
        btn.setAttribute("onclick", 'settingChanged("' + id + '")');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = name;
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    } else if (type == 'value' || type == 'valueNegative') {
        if (!(loaded && id == loaded.id && loaded.type === type))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                value: loaded === undefined ? defaultValue : loaded
            };
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn btn-info');
        btn.setAttribute("onclick", `autoSetValueToolTip("${id}", "${name}", ${type == 'valueNegative'}, ${type == 'multiValue'})`);
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = name;
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    } else if (type == 'multiValue' || type == 'valueNegative') {
        if (!(loaded && id == loaded.id && loaded.type === type))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                value: loaded === undefined ? defaultValue : loaded
            };
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn btn-info');
        btn.setAttribute("onclick", `autoSetValueToolTip("${id}", "${name}", ${type == 'valueNegative'}, ${type == 'multiValue'})`);
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = name;
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    } else if (type == 'textValue') {
        if (!(loaded && id == loaded.id && loaded.type === type))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                value: loaded === undefined ? defaultValue : loaded
            };
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn btn-info');
        btn.setAttribute("onclick", `autoSetTextToolTip("${id}", "${name}", ${type == 'textValue'})`);
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = name;
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    } else if (type == 'dropdown') {
        if (!(loaded && id == loaded.id && loaded.type === type))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                selected: loaded === undefined ? defaultValue : loaded,
                list: list
            };
        var btn = document.createElement("select");
        btn.id = id;
        if (game.options.menu.darkTheme.enabled == 2) btn.setAttribute("style", "color: #C8C8C8; font-size: 1.0vw;");
        else btn.setAttribute("style", "color:black; font-size: 1.0vw;");
        btn.setAttribute("class", "noselect");
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.setAttribute("onchange", 'settingChanged("' + id + '")');
        for (var item in list) {
            var option = document.createElement("option");
            option.value = list[item];
            option.text = list[item];
            btn.appendChild(option);
        }
        btn.value = autoTrimpSettings[id].selected;
        var dropdownLabel = document.createElement("Label");
        dropdownLabel.id = id + "Label";
        dropdownLabel.innerHTML = name + ":";
        dropdownLabel.setAttribute('style', 'margin-right: 0.3vw; font-size: 0.8vw;');
        btnParent.appendChild(dropdownLabel);
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    } else if (type == 'infoclick') {
        btn.setAttribute('class', 'noselect settingsBtn settingBtn3');
        btn.setAttribute("onclick", 'ImportExportTooltip(\'' + defaultValue + '\', \'update\')');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.setAttribute("style", "background-color: #d88839; color: black; font-size: 1.1vw;");
        btn.textContent = name;
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
        return;
    } else if (type == 'multitoggle') {
        if (!(loaded && id == loaded.id && loaded.type === type))
            autoTrimpSettings[id] = {
                id: id,
                name: name,
                description: description,
                type: type,
                value: loaded === undefined ? defaultValue || 0 : loaded
            };
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings[id].value);
        btn.setAttribute("onclick", 'settingChanged("' + id + '")');
        btn.setAttribute("onmouseover", 'tooltip(\"' + name.join(' / ') + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = autoTrimpSettings[id]["name"][autoTrimpSettings[id]["value"]];
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
    } else if (type === 'action') {
        btn.setAttribute("style", "font-size: 1.1vw;");
        btn.setAttribute('class', 'noselect settingsBtn settingBtn3');
        btn.setAttribute('onclick', defaultValue);
        btn.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
        btn.setAttribute("onmouseout", 'tooltip("hide")');
        btn.textContent = name;
        btnParent.appendChild(btn);
        if (container) document.getElementById(container).appendChild(btnParent);
        else document.getElementById("autoSettings").appendChild(btnParent);
        return;
    }
    if (autoTrimpSettings[id].name != name)
        autoTrimpSettings[id].name = name;
    if (autoTrimpSettings[id].description != description)
        autoTrimpSettings[id].description = description;
    autoTrimpSettings["ATversion"] = ATversion;
}

function createInput(id, name, description) {
    var $btnParent = document.createElement("DIV");
    $btnParent.setAttribute('style', 'display: inline-block; vertical-align: top; margin-left: 0.5vw; margin-bottom: 0.5vw; width: 6.5vw;');
    $btnParent.setAttribute("onmouseover", 'tooltip(\"' + name + '\", \"customText\", event, \"' + description + '\")');
    $btnParent.setAttribute("onmouseout", 'tooltip("hide")');
    var $input = document.createElement("input");
    $input.type = 'checkbox';
    $input.setAttribute('id', id);
    $input.setAttribute('style', 'text-align: left; width: 0.8vw; ');
    $btnParent.appendChild($input);
    var $label = document.createElement("label");
    $label.setAttribute('style', 'text-align: left; margin-left: 0.2vw; font-size: 0.6vw');
    $label.innerHTML = name;
    $btnParent.appendChild($label);
    document.getElementById("autoSettings").appendChild($btnParent);
}

function settingChanged(id) {
    var btn = autoTrimpSettings[id];
    if (btn.type == 'boolean') {
        btn.enabled = !btn.enabled;
        document.getElementById(id).setAttribute('class', 'noselect settingsBtn settingBtn' + btn.enabled);
    }
    if (btn.type == 'multitoggle') {
        if (id == 'AutoMagmiteSpender2' && btn.value == 1) {
            magmiteSpenderChanged = true;
            setTimeout(function () {
                magmiteSpenderChanged = false;
            }, 5000);
        }
        btn.value++;
        if (btn.value > btn.name.length - 1)
            btn.value = 0;
        document.getElementById(id).setAttribute('class', 'noselect settingsBtn settingBtn' + btn.value);
        document.getElementById(id).textContent = btn.name[btn.value];
    }
    if (btn.type == 'dropdown') {
        btn.selected = document.getElementById(id).value;
        if (id == "Prestige") {
            autoTrimpSettings["PrestigeBackup"] = {
                selected: document.getElementById(id).value,
                name: "PrestigeBackup",
                id: "PrestigeBackup"
            };
        }
    }
    updateCustomButtons();
    saveSettings();
    checkPortalSettings();
}

function autoSetValueToolTip(id, text, negative, multi) {
    ranstring = text;
    var elem = document.getElementById("tooltipDiv");
    var tooltipText = 'Type a number below. You can also use shorthand such as 2e5 or 200k.';
    if (negative)
        tooltipText += ' Accepts negative numbers as validated inputs.';
    else
        tooltipText += ' Put -1 for Infinite.';
    tooltipText += `<br/><br/><input id="customNumberBox" style="width: 50%" onkeypress="onKeyPressSetting(event, '${id}', ${negative}, ${multi})" value="${autoTrimpSettings[id].value}"></input>`;
    var costText = '<div class="maxCenter"><div class="btn btn-info" onclick="autoSetValue(\'' + id + '\',' + negative + ',' + multi + ')">Apply</div><div class="btn btn-info" onclick="cancelTooltip()">Cancel</div></div>';
    game.global.lockTooltip = true;
    elem.style.left = '32.5%';
    elem.style.top = '25%';
    document.getElementById('tipTitle').textContent = ranstring + ':  Value Input';
    document.getElementById('tipText').innerHTML = tooltipText;
    document.getElementById('tipCost').innerHTML = costText;
    elem.style.display = 'block';
    var box = document.getElementById('customNumberBox');
    try {
        box.setSelectionRange(0, box.value.length);
    } catch (e) {
        box.select();
    }
    box.focus();
}

function autoSetTextToolTip(id, text) {
    ranstring = text;
    var elem = document.getElementById("tooltipDiv");
    var tooltipText = 'Type your input below';
    tooltipText += `<br/><br/><input id="customTextBox" style="width: 50%" onkeypress="onKeyPressSetting(event, '${id}')" value="${autoTrimpSettings[id].value}"></input>`;
    var costText = '<div class="maxCenter"><div class="btn btn-info" onclick="autoSetText(\'' + id + '\')">Apply</div><div class="btn btn-info" onclick="cancelTooltip()">Cancel</div></div>';
    game.global.lockTooltip = true;
    elem.style.left = '32.5%';
    elem.style.top = '25%';
    document.getElementById('tipTitle').textContent = ranstring + ':  Value Input';
    document.getElementById('tipText').innerHTML = tooltipText;
    document.getElementById('tipCost').innerHTML = costText;
    elem.style.display = 'block';
    var box = document.getElementById('customTextBox');
    box.focus();
}

function onKeyPressSetting(event, id, negative, multi) {
    if (event.which == 13 || event.keyCode == 13) {
        if (negative !== undefined && multi !== undefined)
            autoSetValue(id, negative, multi);
        else
            autoSetText(id);
    }
}

function parseNum(num) {
    if (num.split('e')[1]) {
        num = num.split('e');
        num = Math.floor(parseFloat(num[0]) * (Math.pow(10, parseInt(num[1]))));
    } else {
        var letters = num.replace(/[^a-z]/gi, '');
        var base = 0;
        if (letters.length) {
            var suffices = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc', 'Ud', 'Dd', 'Td', 'Qad', 'Qid', 'Sxd', 'Spd', 'Od', 'Nd', 'V', 'Uv', 'Dv', 'Tv', 'Qav', 'Qiv', 'Sxv', 'Spv', 'Ov', 'Nv', 'Tt'];
            for (var x = 0; x < suffices.length; x++) {
                if (suffices[x].toLowerCase() == letters) {
                    base = x + 1;
                    break;
                }
            }
            if (base) num = Math.round(parseFloat(num.split(letters)[0]) * Math.pow(1000, base));
        }
        if (!base) num = parseFloat(num);
    }
    return num;
}

function autoSetValue(id, negative, multi) {
    var num = 0;
    unlockTooltip();
    tooltip('hide');
    var numBox = document.getElementById('customNumberBox');
    if (numBox) {
        num = numBox.value.toLowerCase();
        if (multi) {
            num = num.split(',').map(parseNum);
        } else {
            num = parseNum(num);
        }
    } else return;
    autoTrimpSettings[id].value = num;
    if (Array.isArray(num)) {
        document.getElementById(id).textContent = ranstring + ': ' + num[0] + '+';
    } else if (num > -1 || negative)
        document.getElementById(id).textContent = ranstring + ': ' + prettify(num);
    else
        document.getElementById(id).innerHTML = ranstring + ': ' + "<span class='icomoon icon-infinity'></span>";
    saveSettings();
    checkPortalSettings();
}

function autoSetText(id) {
    var textVal = 'empty';
    unlockTooltip();
    tooltip('hide');
    var textBox = document.getElementById('customTextBox');
    if (textBox) {
        textVal = textBox.value
    } else return;
    autoTrimpSettings[id].value = textVal;
    if (textVal != undefined) {
        document.getElementById(id).textContent = ranstring + ': ' + textVal;
    }
    saveSettings();
    checkPortalSettings();
}

function autoToggle(what) {
    if (what) {
        var $what = document.getElementById(what);
        if ($what.style.display === 'block') {
            $what.style.display = 'none';
            document.getElementById(what + 'BTN').style.border = '';
        } else {
            $what.style.display = 'block';
            document.getElementById(what + 'BTN').style.border = '4px solid green';
        }
    } else {
        if (game.options.displayed)
            toggleSettingsMenu();
        var $item = document.getElementById('graphParent');
        if ($item.style.display === 'block') {
            $item.style.display = 'none';
            trimpStatsDisplayed = false;
            GRAPHSETTINGS.open = false;
        }
        var $item = document.getElementById('autoTrimpsTabBarMenu');
        if ($item.style.display === 'block')
            $item.style.display = 'none';
        else $item.style.display = 'block';
        var $item = document.getElementById('autoSettings');
        if ($item.style.display === 'block')
            $item.style.display = 'none';
        else $item.style.display = 'block';
    }
}

function autoPlusSettingsMenu() {
    var $item = document.getElementById('autoSettings');
    if ($item.style.display === 'block')
        $item.style.display = 'none';
    var $item = document.getElementById('graphParent');
    if ($item.style.display === 'block') {
        $item.style.display = 'none';
        trimpStatsDisplayed = false;
        GRAPHSETTINGS.open = false;
    }
    var $item = document.getElementById('autoTrimpsTabBarMenu');
    if ($item.style.display === 'block')
        $item.style.display = 'none';
    toggleSettingsMenu();
}

function updateCustomButtons() {
	const isGraphModuleDefined = typeof MODULES.graphs !== 'undefined';
	const isLastThemeDefined = isGraphModuleDefined && typeof MODULES.graphs._lastTheme !== 'undefined';
	const hasThemeChanged = isLastThemeDefined && game.options.menu.darkTheme.enabled !== MODULES.graphs._lastTheme;

	if (isGraphModuleDefined && hasThemeChanged) {
		MODULES.graphs.themeChanged();
		MODULES.graphs._lastTheme = game.options.menu.darkTheme.enabled;
		debug("Theme change - AutoTrimps styles updated.");
	}

    function toggleElem(elem, showHide) {
        var $item = document.getElementById(elem);
        if ($item == null) return;
        var state = showHide ? '' : 'none';
        var stateParent = showHide ? 'inline-block' : 'none';
        $item.style.display = state;
        $item.parentNode.style.display = stateParent;
    }

    function turnOff(elem) {
        toggleElem(elem, false);
    }

    function turnOn(elem) {
        toggleElem(elem, true);
    }

    //Hide settings

    //Radon
    var radonon = getPageSetting('radonsettings') == 1;
    //Bone Shrine
    var boneShrinePurchased = game.permaBoneBonuses.boosts.owned > 0 ? true : false;

    //Tabs
    if (document.getElementById("tabSpire") != null) {
        document.getElementById("tabSpire").style.display = radonon ? "none" : "";
    }
    if (document.getElementById("tabWindstacking") != null) {
        document.getElementById("tabWindstacking").style.display = radonon ? "none" : "";
    }
    if (document.getElementById("tabATGA") != null) {
        document.getElementById("tabATGA").style.display = radonon ? "none" : "";
    }
    if (document.getElementById("tabScryer") != null) {
        document.getElementById("tabScryer").style.display = radonon ? "none" : "";
    }
    if (document.getElementById("tabMagma") != null) {
        document.getElementById("tabMagma").style.display = radonon ? "none" : "";
    }
    if (document.getElementById("tabNature") != null) {
        document.getElementById("tabNature").style.display = radonon ? "none" : "";
    }
    if (document.getElementById("tabChallenges") != null) {
        document.getElementById("tabChallenges").style.display = !radonon ? "none" : "";
    }
    if (document.getElementById("tabSA") != null) {
        document.getElementById("tabSA").style.display = !radonon ? "none" : "";
    }



    //Core
    !radonon ? turnOn('ManualGather2') : turnOff("ManualGather2");
    !radonon ? turnOn('TrapTrimps') : turnOff("TrapTrimps");
    !radonon ? turnOn('BuyUpgradesNew') : turnOff("BuyUpgradesNew");
    (!radonon && getPageSetting('ManualGather2') == 2 && bwRewardUnlocked("Foremany")) ? turnOn("gathermetal") : turnOff("gathermetal");
    !radonon ? turnOn("amalcoord") : turnOff("amalcoord");
    !radonon && getPageSetting('amalcoord') == true ? turnOn("amalcoordt") : turnOff("amalcoordt");
    !radonon && getPageSetting('amalcoord') == true ? turnOn("amalcoordhd") : turnOff("amalcoordhd");
    !radonon && getPageSetting('amalcoord') == true ? turnOn("amalcoordz") : turnOff("amalcoordz");
    !radonon ? turnOn("AutoAllocatePerks") : turnOff("AutoAllocatePerks");
    !radonon && getPageSetting('AutoAllocatePerks') == 1 ? turnOn("fastallocate") : turnOff("fastallocate");
    boneShrinePurchased ? turnOn('AutoBoneChargeMax') : turnOff("AutoBoneChargeMax");
    boneShrinePurchased ? turnOn("AutoBoneChargeMaxStartZone") : turnOff("AutoBoneChargeMaxStartZone");

    //Portal
    !radonon ? turnOn("AutoPortal") : turnOff("AutoPortal");
    (!radonon && autoTrimpSettings.AutoPortal.selected == "Custom") ? turnOn("CustomAutoPortal") : turnOff("CustomAutoPortal");
    var heHr = (autoTrimpSettings.AutoPortal.selected == "Helium Per Hour");
    !radonon && (heHr || autoTrimpSettings.AutoPortal.selected == "Custom") ? turnOn("HeliumHourChallenge") : turnOff("HeliumHourChallenge");
    !radonon && (heHr) ? turnOn("HeHrDontPortalBefore") : turnOff("HeHrDontPortalBefore");
    !radonon && (heHr) ? turnOn("HeliumHrBuffer") : turnOff("HeliumHrBuffer");


    //RCore
    radonon ? turnOn('RManualGather2') : turnOff("RManualGather2");
    radonon ? turnOn('RTrapTrimps') : turnOff("RTrapTrimps");
    radonon ? turnOn('RBuyUpgradesNew') : turnOff("RBuyUpgradesNew");
    radonon ? turnOn("RAutoAllocatePerks") : turnOff("RAutoAllocatePerks");
    radonon && getPageSetting('RAutoAllocatePerks') == 2 ? turnOn("Rdumpgreed") : turnOff("Rdumpgreed");

    //RPortal
    radonon ? turnOn("RAutoPortal") : turnOff("RAutoPortal");
    (radonon && autoTrimpSettings.RAutoPortal.selected == "Custom") ? turnOn("RCustomAutoPortal") : turnOff("RCustomAutoPortal");
    var rnHr = (autoTrimpSettings.RAutoPortal.selected == "Radon Per Hour");
    radonon && (rnHr || autoTrimpSettings.RAutoPortal.selected == "Custom") ? turnOn("RadonHourChallenge") : turnOff("RadonHourChallenge");
    radonon && (rnHr) ? turnOn("RnHrDontPortalBefore") : turnOff("RnHrDontPortalBefore");
    radonon && (rnHr) ? turnOn("RadonHrBuffer") : turnOff("RadonHrBuffer");



    //Daily
    !radonon ? turnOn("buyheliumy") : turnOff("buyheliumy");
    !radonon ? turnOn("dscryvoidmaps") : turnOff("dscryvoidmaps");
    !radonon ? turnOn("dIgnoreSpiresUntil") : turnOff("dIgnoreSpiresUntil");
    !radonon ? turnOn("dExitSpireCell") : turnOff("dExitSpireCell");
    !radonon ? turnOn("dPreSpireNurseries") : turnOff("dPreSpireNurseries");
    !radonon ? turnOn("DailyVoidMod") : turnOff("DailyVoidMod");
    !radonon ? turnOn("dvoidscell") : turnOff("dvoidscell");
    !radonon ? turnOn("dRunNewVoidsUntilNew") : turnOff("dRunNewVoidsUntilNew");
    !radonon ? turnOn("drunnewvoidspoison") : turnOff("drunnewvoidspoison");
    !radonon ? turnOn("avoidempower") : turnOff("avoidempower");
    !radonon ? turnOn("dfightforever") : turnOff("dfightforever");
    !radonon ? turnOn("darmormagic") : turnOff("darmormagic");

    //DRaid
    !radonon ? turnOn("dPraidingzone") : turnOff("dPraidingzone");
    !radonon ? turnOn("dPraidingcell") : turnOff("dPraidingcell");
    !radonon ? turnOn("dPraidingHD") : turnOff("dPraidingHD");
    !radonon ? turnOn("dPraidingP") : turnOff("dPraidingP");
    !radonon ? turnOn("dPraidingI") : turnOff("dPraidingI");
    !radonon && getPageSetting('dPraidingzone') != -1 ? turnOn('dPraidHarder') : turnOff('dPraidHarder');
    !radonon && getPageSetting('dPraidHarder') ? turnOn('dPraidFarmFragsZ') : turnOff('dPraidFarmFragsZ');
    !radonon && getPageSetting('dPraidHarder') ? turnOn('dPraidBeforeFarmZ') : turnOff('dPraidBeforeFarmZ');
    !radonon && getPageSetting('dPraidHarder') ? turnOn('dMaxPraidZone') : turnOff('dMaxPraidZone');
    !radonon ? turnOn("Dailybwraid") : turnOff("Dailybwraid");
    !radonon && getPageSetting('Dailybwraid') == true ? turnOn("dbwraidcell") : turnOff("dbwraidcell");
    !radonon && getPageSetting('Dailybwraid') == true ? turnOn("dBWraidingz") : turnOff("dBWraidingz");
    !radonon && getPageSetting('Dailybwraid') == true ? turnOn("dBWraidingmax") : turnOff("dBWraidingmax");

    //DWind
    !radonon ? turnOn("use3daily") : turnOff("use3daily");
    !radonon ? turnOn("liqstack") : turnOff("liqstack");
    !radonon && getPageSetting('use3daily') == true ? turnOn("dwindhealthy") : turnOff("dwindhealthy");
    !radonon && getPageSetting('use3daily') == true ? turnOn("dusebstance") : turnOff("dusebstance");
    !radonon && getPageSetting('use3daily') == true ? turnOn("dWindStackingMin") : turnOff("dWindStackingMin");
    !radonon && getPageSetting('use3daily') == true ? turnOn("dWindStackingMinHD") : turnOff("dWindStackingMinHD");
    !radonon && getPageSetting('use3daily') == true ? turnOn("dWindStackingMax") : turnOff("dWindStackingMax");
    !radonon && getPageSetting('use3daily') == true ? turnOn("dwindcutoff") : turnOff("dwindcutoff");
    !radonon && getPageSetting('use3daily') == true ? turnOn("dwindcutoffmap") : turnOff("dwindcutoffmap");
    !radonon && getPageSetting('use3daily') == true ? turnOn("dwsmax") : turnOff("dwsmax");
    !radonon && getPageSetting('use3daily') == true ? turnOn("dwsmaxhd") : turnOff("dwsmaxhd");

    //DLoom
    !radonon && getPageSetting('dloomswap') > 0 ? turnOn('dloomswaphd') : turnOff('dloomswaphd');
    !radonon && getPageSetting('dloomswap') > 0 ? turnOn('dhighdmg') : turnOff('dhighdmg');
    !radonon && getPageSetting('dloomswap') > 0 ? turnOn('dlowdmg') : turnOff('dlowdmg');

    //DPortal
    !radonon ? turnOn("AutoStartDaily") : turnOff("AutoStartDaily");
    !radonon ? turnOn("u2daily") : turnOff("u2daily");
    !radonon ? turnOn("AutoPortalDaily") : turnOff("AutoPortalDaily");
    !radonon && getPageSetting('AutoPortalDaily') == 2 ? turnOn("dCustomAutoPortal") : turnOff("dCustomAutoPortal");
    !radonon && getPageSetting('AutoPortalDaily') == 1 ? turnOn("dHeHrDontPortalBefore") : turnOff("dHeHrDontPortalBefore");
    !radonon && getPageSetting('AutoPortalDaily') == 1 ? turnOn("dHeliumHrBuffer") : turnOff("dHeliumHrBuffer");
    !radonon && getPageSetting('AutoPortalDaily') > 0 ? turnOn("dHeliumHourChallenge") : turnOff("dHeliumHourChallenge");

    //Shrine - U1 (Daily)
    !radonon ? turnOn("Hdshrine") : turnOff("Hdshrine");
    (!radonon && getPageSetting('Hdshrine') == 1) ? turnOn("Hdshrinemaz") : turnOff("Hdshrinemaz");
    turnOff("Hdshrinezone");
    turnOff("Hdshrinecell");
    turnOff("Hdshrineamount");


    //RDaily
    radonon ? turnOn("buyradony") : turnOff("buyradony");
    radonon ? turnOn("Rdscryvoidmaps") : turnOff("Rdscryvoidmaps");
    radonon ? turnOn("RdIgnoreSpiresUntil") : turnOff("RdIgnoreSpiresUntil");
    radonon ? turnOn("RDailyVoidMod") : turnOff("RDailyVoidMod");
    radonon ? turnOn("RdRunNewVoidsUntilNew") : turnOff("RdRunNewVoidsUntilNew");
    radonon ? turnOn("Ravoidempower") : turnOff("Ravoidempower");
    radonon ? turnOn("Rdfightforever") : turnOff("Rdfightforever");
    radonon ? turnOn("Rdarmormagic") : turnOff("Rdarmormagic");

    //RDRaid
    radonon ? turnOn("RdAMPraid") : turnOff("RdAMPraid");
    radonon && getPageSetting('RdAMPraid') == 1 ? turnOn("RdAMPraidmaz") : turnOff("RdAMPraidmaz");
    turnOff("RdAMPraidzone");
    turnOff("RdAMPraidraid");
    turnOff("RdAMPraidcell");
    radonon && getPageSetting('RdAMPraid') == 1 ? turnOn("RdAMPraidfrag") : turnOff("RdAMPraidfrag");
    radonon && getPageSetting('RdAMPraid') == 1 ? turnOn("RdAMPraidrecycle") : turnOff("RdAMPraidrecycle");

    //RDTime Farm
    radonon ? turnOn("Rdtimefarm") : turnOff("Rdtimefarm");
    (radonon && getPageSetting('Rdtimefarm') == 1) ? turnOn("Rdtimefarmmaz") : turnOff("Rdtimefarmmaz");
    turnOff("Rdtimefarmzone");
    turnOff("Rdtimefarmcell");
    turnOff("Rdtimefarmtime");
    turnOff("Rdtimefarmlevel");
    turnOff("Rdtimefarmmap");
    turnOff("Rdtimefarmspecial");
    turnOff("Rdtimefarmgather");

    //RDHeirloom Swapping
    radonon ? turnOn('Rdhs') : turnOff('Rdhs');
    var dhson = (getPageSetting('Rdhs') == 1);

    //RDShields
    radonon && dhson ? turnOn('Rdhsshield') : turnOff('Rdhsshield');
    var dhsshieldon = (getPageSetting('Rdhsshield') == true);
    radonon && dhson && dhsshieldon ? turnOn('Rdhsz') : turnOff('Rdhsz');
    radonon && dhson && dhsshieldon ? turnOn('Rdhs1') : turnOff('Rdhs1');
    radonon && dhson && dhsshieldon ? turnOn('Rdhs2') : turnOff('Rdhs2');

    //RDStaffs
    radonon && hson ? turnOn('Rdhsstaff') : turnOff('Rdhsstaff');
    var dhsstaffon = (getPageSetting('Rdhsstaff') == true);
    radonon && dhson && dhsstaffon ? turnOn('Rdhsworldstaff') : turnOff('Rdhsworldstaff');
    radonon && dhson && dhsstaffon ? turnOn('Rdhsmapstaff') : turnOff('Rdhsmapstaff');
    radonon && dhson && dhsstaffon ? turnOn('Rdhstributestaff') : turnOff('Rdhstributestaff');

    //Shrine - U2 (Daily)
    radonon ? turnOn("Rdshrine") : turnOff("Rdshrine");
    (radonon && getPageSetting('Rdshrine') == 1) ? turnOn("Rdshrinemaz") : turnOff("Rdshrinemaz");
    turnOff("Rdshrinezone");
    turnOff("Rdshrinecell");
    turnOff("Rdshrineamount");


    //RDPortal
    radonon ? turnOn("RAutoStartDaily") : turnOff("RAutoStartDaily");
    radonon ? turnOn("u1daily") : turnOff("u1daily");
    radonon ? turnOn("RAutoPortalDaily") : turnOff("RAutoPortalDaily");
    radonon && getPageSetting('RAutoPortalDaily') == 2 ? turnOn("RdCustomAutoPortal") : turnOff("RdCustomAutoPortal");
    radonon && getPageSetting('RAutoPortalDaily') == 1 ? turnOn("RdHeHrDontPortalBefore") : turnOff("RdHeHrDontPortalBefore");
    radonon && getPageSetting('RAutoPortalDaily') == 1 ? turnOn("RdHeliumHrBuffer") : turnOff("RdHeliumHrBuffer");
    radonon && getPageSetting('RAutoPortalDaily') > 0 ? turnOn("RdHeliumHourChallenge") : turnOff("RdHeliumHourChallenge");



    //C2
    !radonon ? turnOn("FinishC2") : turnOff("FinishC2");
    !radonon ? turnOn("buynojobsc") : turnOff("buynojobsc");
    !radonon ? turnOn("cfightforever") : turnOff("cfightforever");
    !radonon ? turnOn("mapc2hd") : turnOff("mapc2hd");
    !radonon ? turnOn("novmsc2") : turnOff("novmsc2");
    !radonon ? turnOn("c2runnerstart") : turnOff("c2runnerstart");
    !radonon && getPageSetting('c2runnerstart') == true ? turnOn("c2runnerportal") : turnOff("c2runnerportal");
    !radonon && getPageSetting('c2runnerstart') == true ? turnOn("c2runnerpercent") : turnOff("c2runnerpercent");



    //Buildings
    !radonon ? turnOn("BuyBuildingsNew") : turnOff("BuyBuildingsNew");
    !radonon ? turnOn("MaxGym") : turnOff("MaxGym");
    !radonon ? turnOn("GymWall") : turnOff("GymWall");
    var fuckbuilding = (bwRewardUnlocked("AutoStructure") == true && bwRewardUnlocked("DecaBuild") && getPageSetting('hidebuildings') == true && getPageSetting('BuyBuildingsNew') == 0);
    (!radonon && bwRewardUnlocked("AutoStructure") == true && bwRewardUnlocked("DecaBuild")) ? turnOn("hidebuildings") : turnOff("hidebuildings");
    (!radonon && !fuckbuilding) ? turnOn("MaxHut") : turnOff("MaxHut");
    (!radonon && !fuckbuilding) ? turnOn("MaxHouse") : turnOff("MaxHouse");
    (!radonon && !fuckbuilding) ? turnOn("MaxMansion") : turnOff("MaxMansion");
    (!radonon && !fuckbuilding) ? turnOn("MaxHotel") : turnOff("MaxHotel");
    (!radonon && !fuckbuilding) ? turnOn("MaxResort") : turnOff("MaxResort");
    (!radonon && !fuckbuilding) ? turnOn("MaxGateway") : turnOff("MaxGateway");
    (!radonon && !fuckbuilding) ? turnOn("MaxWormhole") : turnOff("MaxWormhole");
    (!radonon && !fuckbuilding) ? turnOn("MaxCollector") : turnOff("MaxCollector");
    (!radonon && !fuckbuilding) ? turnOn("MaxTribute") : turnOff("MaxTribute");
    (!radonon && !fuckbuilding) ? turnOn("MaxNursery") : turnOff("MaxNursery");
    (!radonon && !fuckbuilding) ? turnOn("NoNurseriesUntil") : turnOff("NoNurseriesUntil");
    (!radonon && !fuckbuilding) ? turnOn("NurseryWall") : turnOff("NurseryWall");
    (!radonon && !fuckbuilding) ? turnOn("WarpstationCap") : turnOff("WarpstationCap");
    (!radonon && !fuckbuilding) ? turnOn("WarpstationCoordBuy") : turnOff("WarpstationCoordBuy");
    (!radonon && !fuckbuilding) ? turnOn("FirstGigastation") : turnOff("FirstGigastation");
    (!radonon && !fuckbuilding) ? turnOn("DeltaGigastation") : turnOff("DeltaGigastation");
    (!radonon && !fuckbuilding) ? turnOn("AutoGigas") : turnOff("AutoGigas");
    (!radonon && !fuckbuilding && getPageSetting("AutoGigas") == true) ? turnOn("CustomTargetZone") : turnOff("CustomTargetZone");
    (!radonon && !fuckbuilding && getPageSetting("AutoGigas") == true) ? turnOn("CustomDeltaFactor") : turnOff("CustomDeltaFactor");
    (!radonon && !fuckbuilding) ? turnOn("WarpstationWall3") : turnOff("WarpstationWall3");


    //RBuildings
    radonon ? turnOn("RBuyBuildingsNew") : turnOff("RBuyBuildingsNew");
    radonon ? turnOn("RMaxHut") : turnOff("RMaxHut");
    radonon ? turnOn("RMaxHouse") : turnOff("RMaxHouse");
    radonon ? turnOn("RMaxMansion") : turnOff("RMaxMansion");
    radonon ? turnOn("RMaxHotel") : turnOff("RMaxHotel");
    radonon ? turnOn("RMaxResort") : turnOff("RMaxResort");
    radonon ? turnOn("RMaxGateway") : turnOff("RMaxGateway");
    radonon ? turnOn("RMaxCollector") : turnOff("RMaxCollector");
    radonon ? turnOn("RMaxTribute") : turnOff("RMaxTribute");
    (radonon && getPageSetting('Rnurtureon') == true) ? turnOn("RMaxLabs") : turnOff("RMaxLabs");
    radonon ? turnOn("Rmeltsmithy") : turnOff("Rmeltsmithy");
    radonon ? turnOn("Rsmithylogic") : turnOff("Rsmithylogic");
    (radonon && getPageSetting('Rsmithylogic') == true) ? turnOn("Rsmithynumber") : turnOff("Rsmithynumber");
    (radonon && getPageSetting('Rsmithylogic') == true) ? turnOn("Rsmithypercent") : turnOff("Rsmithypercent");
    (radonon && getPageSetting('Rsmithylogic') == true) ? turnOn("Rsmithyseconds") : turnOff("Rsmithyseconds");



    //Jobs
    !radonon ? turnOn("BuyJobsNew") : turnOff("BuyJobsNew");
    !radonon ? turnOn("AutoMagmamancers") : turnOff("AutoMagmamancers");
    var fuckjobbies = (bwRewardUnlocked("AutoJobs") && getPageSetting('fuckjobs') == true && getPageSetting('BuyJobsNew') == 0);
    (!radonon && bwRewardUnlocked("AutoJobs")) ? turnOn("fuckjobs") : turnOff("fuckjobs");
    (!radonon && !fuckjobbies) ? turnOn("FarmerRatio") : turnOff("FarmerRatio");
    (!radonon && !fuckjobbies) ? turnOn("LumberjackRatio") : turnOff("LumberjackRatio");
    (!radonon && !fuckjobbies) ? turnOn("MinerRatio") : turnOff("MinerRatio");
    (!radonon && !fuckjobbies) ? turnOn("MaxScientists") : turnOff("MaxScientists");
    (!radonon && !fuckjobbies) ? turnOn("MaxExplorers") : turnOff("MaxExplorers");
    (!radonon && !fuckjobbies) ? turnOn("MaxTrainers") : turnOff("MaxTrainers");


    //RJobs
    radonon ? turnOn("RBuyJobsNew") : turnOff("RBuyJobsNew");
    radonon ? turnOn("RFarmerRatio") : turnOff("RFarmerRatio");
    radonon ? turnOn("RLumberjackRatio") : turnOff("RLumberjackRatio");
    radonon ? turnOn("RMinerRatio") : turnOff("RMinerRatio");
    radonon ? turnOn("RMaxExplorers") : turnOff("RMaxExplorers");
    radonon ? turnOn("Rshipfarmon") : turnOff("Rshipfarmon");
    (radonon && getPageSetting('Rshipfarmon') == true) ? turnOn("Rshipfarmzone") : turnOff("Rshipfarmzone");
    (radonon && getPageSetting('Rshipfarmon') == true) ? turnOn("Rshipfarmcell") : turnOff("Rshipfarmcell");
    (radonon && getPageSetting('Rshipfarmon') == true) ? turnOn("Rshipfarmamount") : turnOff("Rshipfarmamount");
    (radonon && getPageSetting('Rshipfarmon') == true) ? turnOn("Rshipfarmlevel") : turnOff("Rshipfarmlevel");
    (radonon && getPageSetting('Rshipfarmon') == true) ? turnOn("Rshipfarmfrag") : turnOff("Rshipfarmfrag");



    //Gear
    !radonon ? turnOn("BuyArmorNew") : turnOff("BuyArmorNew");
    !radonon ? turnOn("BuyWeaponsNew") : turnOff("BuyWeaponsNew");
    !radonon ? turnOn("CapEquip2") : turnOff("CapEquip2");
    !radonon ? turnOn("CapEquiparm") : turnOff("CapEquiparm");
    !radonon ? turnOn("dmgcuntoff") : turnOff("dmgcuntoff");
    !radonon ? turnOn("DynamicPrestige2") : turnOff("DynamicPrestige2");
    !radonon ? turnOn("Prestige") : turnOff("Prestige");
    !radonon ? turnOn("ForcePresZ") : turnOff("ForcePresZ");
    !radonon ? turnOn("PrestigeSkip1_2") : turnOff("PrestigeSkip1_2");
    !radonon ? turnOn("DelayArmorWhenNeeded") : turnOff("DelayArmorWhenNeeded");
    !radonon ? turnOn("BuyShieldblock") : turnOff("BuyShieldblock");
    !radonon ? turnOn("trimpsnotdie") : turnOff("trimpsnotdie");
    !radonon ? turnOn("gearamounttobuy") : turnOff("gearamounttobuy");
    !radonon ? turnOn("always2") : turnOff("always2");


    //RGear

    radonon ? turnOn("Requipon") : turnOff("Requipon");
    (radonon && getPageSetting('Requipon') == true) ? turnOn("Requipamount") : turnOff("Requipamount");
    (radonon && getPageSetting('Requipon') == true) ? turnOn("Requipcapattack") : turnOff("Requipcapattack");
    (radonon && getPageSetting('Requipon') == true) ? turnOn("Requipcaphealth") : turnOff("Requipcaphealth");
    (radonon && getPageSetting('Requipon') == true) ? turnOn("Requipzone") : turnOff("Requipzone");
    (radonon && getPageSetting('Requipon') == true) ? turnOn("Requippercent") : turnOff("Requippercent");
    (radonon && getPageSetting('Requipon') == true) ? turnOn("Requip2") : turnOff("Requip2");
    (radonon && getPageSetting('Requipon') == true) ? turnOn("Rdmgcuntoff") : turnOff("Rdmgcuntoff");

    radonon ? turnOn("Requipfarmon") : turnOff("Requipfarmon");
    (radonon && getPageSetting('Requipfarmon') == true) ? turnOn("Requipfarmzone") : turnOff("Requipfarmzone");
    (radonon && getPageSetting('Requipfarmon') == true) ? turnOn("RequipfarmHD") : turnOff("RequipfarmHD");
    (radonon && getPageSetting('Requipfarmon') == true) ? turnOn("Requipfarmmult") : turnOff("Requipfarmmult");
    (radonon && getPageSetting('Requipfarmon') == true) ? turnOn("Requipfarmhits") : turnOff("Requipfarmhits");



    //Maps
    !radonon ? turnOn("AutoMaps") : turnOff("AutoMaps");
    (!radonon && getPageSetting('AutoMaps') == 2) ? turnOn("AMUblock") : turnOff("AMUblock");
    (!radonon && getPageSetting('AutoMaps') == 2) ? turnOn("AMUwall") : turnOff("AMUwall");
    (!radonon && getPageSetting('AutoMaps') == 2) ? turnOn("AMUanger") : turnOff("AMUanger");
    (!radonon && getPageSetting('AutoMaps') == 2) ? turnOn("AMUtrimple") : turnOff("AMUtrimple");
    (!radonon && getPageSetting('AutoMaps') == 2) ? turnOn("AMUprison") : turnOff("AMUprison");
    (!radonon && getPageSetting('AutoMaps') == 2) ? turnOn("AMUbw") : turnOff("AMUbw");
    (!radonon && getPageSetting('AutoMaps') == 2) ? turnOn("AMUstar") : turnOff("AMUstar");
    !radonon ? turnOn("automapsportal") : turnOff("automapsportal");
    !radonon ? turnOn("automapsalways") : turnOff("automapsalways");


    !radonon ? turnOn("mapselection") : turnOff("mapselection");
    !radonon ? turnOn("DynamicSiphonology") : turnOff("DynamicSiphonology");
    !radonon ? turnOn("PreferMetal") : turnOff("PreferMetal");
    !radonon ? turnOn("MaxMapBonusAfterZone") : turnOff("MaxMapBonusAfterZone");
    !radonon ? turnOn("MaxMapBonuslimit") : turnOff("MaxMapBonuslimit");
    !radonon ? turnOn("MaxMapBonushealth") : turnOff("MaxMapBonushealth");
    !radonon ? turnOn("mapcuntoff") : turnOff("mapcuntoff");
    !radonon ? turnOn("DisableFarm") : turnOff("DisableFarm");
    !radonon ? turnOn("LowerFarmingZone") : turnOff("LowerFarmingZone");
    !radonon ? turnOn("FarmWhenNomStacks7") : turnOff("FarmWhenNomStacks7");
    !radonon ? turnOn("VoidMaps") : turnOff("VoidMaps");
    !radonon ? turnOn("voidscell") : turnOff("voidscell");
    !radonon ? turnOn("RunNewVoidsUntilNew") : turnOff("RunNewVoidsUntilNew");
    !radonon ? turnOn("runnewvoidspoison") : turnOff("runnewvoidspoison");
    !radonon ? turnOn("onlystackedvoids") : turnOff("onlystackedvoids");
    !radonon ? turnOn("TrimpleZ") : turnOff("TrimpleZ");
    !radonon ? turnOn("AdvMapSpecialModifier") : turnOff("AdvMapSpecialModifier");
    !radonon ? turnOn("scryvoidmaps") : turnOff("scryvoidmaps");
    !radonon ? turnOn("buywepsvoid") : turnOff("buywepsvoid");
    !radonon ? turnOn("farmWonders") : turnOff("farmWonders");
    (!radonon && getPageSetting("farmWonders")) ? turnOn("wondersAmount") : turnOff("wondersAmount");
    (!radonon && getPageSetting("farmWonders")) ? turnOn("maxExpZone") : turnOff("maxExpZone");
    (!radonon && getPageSetting("farmWonders")) ? turnOn("finishExpOnBw") : turnOff("finishExpOnBw");

    //Shrine - U1
    !radonon ? turnOn("Hshrine") : turnOff("Hshrine");
    (!radonon && getPageSetting('Hshrine') == true) ? turnOn("Hshrinemaz") : turnOff("Hshrinemaz");
    turnOff("Hshrinezone");
    turnOff("Hshrinecell");
    turnOff("Hshrineamount");
    turnOff("Hshrinecharge");

    //RMaps
    radonon ? turnOn("RAutoMaps") : turnOff("RAutoMaps");
    radonon ? turnOn("Rautomapsportal") : turnOff("Rautomapsportal");
    radonon ? turnOn("Rautomapsalways") : turnOff("Rautomapsalways");
    radonon ? turnOn("Rmapselection") : turnOff("Rmapselection");
    radonon ? turnOn("RMaxMapBonusAfterZone") : turnOff("RMaxMapBonusAfterZone");
    radonon ? turnOn("RMaxMapBonuslimit") : turnOff("RMaxMapBonuslimit");
    radonon ? turnOn("RMaxMapBonushealth") : turnOff("RMaxMapBonushealth");
    radonon ? turnOn("Rhitssurvived") : turnOff("Rhitssurvived");
    radonon ? turnOn("Rmapcuntoff") : turnOff("Rmapcuntoff");
    radonon ? turnOn("RDisableFarm") : turnOff("RDisableFarm");

    radonon ? turnOn("Rtimefarm") : turnOff("Rtimefarm");
    (radonon && getPageSetting('Rtimefarm') == true) ? turnOn("Rtimefarmmaz") : turnOff("Rtimefarmmaz");
    turnOff("Rtimefarmzone");
    turnOff("Rtimefarmcell");
    turnOff("Rtimefarmtime");
    turnOff("Rtimefarmlevel");
    turnOff("Rtimefarmmap");
    turnOff("Rtimefarmspecial");
    turnOff("Rtimefarmgather");

    radonon ? turnOn("Rsmithyfarm") : turnOff("Rsmithyfarm");
    (radonon && getPageSetting('Rsmithyfarm') == true) ? turnOn("Rsmithyfarmmaz") : turnOff("Rsmithyfarmmaz");
    turnOff("Rsmithyfarmzone");
    turnOff("Rsmithyfarmcell");
    turnOff("Rsmithyfarmamount");

    radonon ? turnOn("Rtributefarm") : turnOff("Rtributefarm");
    (radonon && getPageSetting('Rtributefarm') == true) ? turnOn("Rtributefarmmaz") : turnOff("Rtributefarmmaz");
    turnOff("Rtributefarmzone");
    turnOff("Rtributefarmcell");
    turnOff("Rtributefarmamount");
    turnOff("Rtributefarmlevel");
    turnOff("Rtributemapselection");
    turnOff("Rtributespecialselection");
    turnOff("Rtributegatherselection");

    // Shrine - U2
    radonon ? turnOn("Rshrine") : turnOff("Rshrine");
    (radonon && getPageSetting('Rshrine') == true) ? turnOn("Rshrinemaz") : turnOff("Rshrinemaz");
    turnOff("Rshrinezone");
    turnOff("Rshrinecell");
    turnOff("Rshrineamount");
    turnOff("Rshrinecharge");

    radonon ? turnOn("RVoidMaps") : turnOff("RVoidMaps");
    radonon ? turnOn("Rvoidscell") : turnOff("Rvoidscell");
    radonon ? turnOn("RRunNewVoidsUntilNew") : turnOff("RRunNewVoidsUntilNew");
    radonon ? turnOn("Rprispalace") : turnOff("Rprispalace");
    radonon ? turnOn("Rmeltpoint") : turnOff("Rmeltpoint");
    radonon ? turnOn("Rfrozencastle") : turnOff("Rfrozencastle");

    //Spire
    !radonon ? turnOn("MaxStacksForSpire") : turnOff("MaxStacksForSpire");
    !radonon ? turnOn("MinutestoFarmBeforeSpire") : turnOff("MinutestoFarmBeforeSpire");
    !radonon ? turnOn("IgnoreSpiresUntil") : turnOff("IgnoreSpiresUntil");
    !radonon ? turnOn("ExitSpireCell") : turnOff("ExitSpireCell");
    !radonon ? turnOn("SpireBreedTimer") : turnOff("SpireBreedTimer");
    !radonon ? turnOn("PreSpireNurseries") : turnOff("PreSpireNurseries");
    !radonon ? turnOn("spireshitbuy") : turnOff("spireshitbuy");
    !radonon ? turnOn("SkipSpires") : turnOff("SkipSpires");



    //Raiding
    !radonon ? turnOn("Praidingzone") : turnOff("Praidingzone");
    !radonon ? turnOn("Praidingcell") : turnOff("Praidingcell");
    !radonon ? turnOn("PraidingHD") : turnOff("PraidingHD");
    !radonon ? turnOn("PraidingP") : turnOff("PraidingP");
    !radonon ? turnOn("PraidingI") : turnOff("PraidingI");
    !radonon && getPageSetting('Praidingzone') != -1 ? turnOn('PraidHarder') : turnOff('PraidHarder');
    !radonon && getPageSetting('PraidHarder') ? turnOn('PraidFarmFragsZ') : turnOff('PraidFarmFragsZ');
    !radonon && getPageSetting('PraidHarder') ? turnOn('PraidBeforeFarmZ') : turnOff('PraidBeforeFarmZ');
    !radonon && getPageSetting('PraidHarder') ? turnOn('MaxPraidZone') : turnOff('MaxPraidZone');
    !radonon ? turnOn("BWraid") : turnOff("BWraid");
    !radonon && getPageSetting('BWraid') == true ? turnOn("bwraidcell") : turnOff("bwraidcell");
    !radonon && getPageSetting('BWraid') == true ? turnOn("BWraidingz") : turnOff("BWraidingz");
    !radonon && getPageSetting('BWraid') == true ? turnOn("BWraidingmax") : turnOff("BWraidingmax");

    //RPraiding
    radonon ? turnOn("RAMPraid") : turnOff("RAMPraid");
    radonon && getPageSetting('RAMPraid') == true ? turnOn("RAMPraidmaz") : turnOff("RAMPraidmaz");
    turnOff("RAMPraidzone");
    turnOff("RAMPraidraid");
    turnOff("RAMPraidcell");
    radonon && getPageSetting('RAMPraid') == true ? turnOn("RAMPraidfrag") : turnOff("RAMPraidfrag");
    radonon && getPageSetting('RAMPraid') == true ? turnOn("RAMPraidrecycle") : turnOff("RAMPraidrecycle");



    //Windstacking
    var wson = (getPageSetting('AutoStance') == 3);
    (!radonon && !wson) ? turnOn("turnwson") : turnOff("turnwson");
    (!radonon && wson) ? turnOn("windhealthy") : turnOff("windhealthy");
    (!radonon && wson) ? turnOn("usebstance") : turnOff("usebstance");
    (!radonon && wson) ? turnOn("WindStackingMin") : turnOff("WindStackingMin");
    (!radonon && wson) ? turnOn("WindStackingMinHD") : turnOff("WindStackingMinHD");
    (!radonon && wson) ? turnOn("WindStackingMax") : turnOff("WindStackingMax");
    (!radonon && wson) ? turnOn("windcutoff") : turnOff("windcutoff");
    (!radonon && wson) ? turnOn("windcutoffmap") : turnOff("windcutoffmap");
    (!radonon && wson) ? turnOn("wsmax") : turnOff("wsmax");
    (!radonon && wson) ? turnOn("wsmaxhd") : turnOff("wsmaxhd");


    //ATGA
    !radonon ? turnOn("ATGA2") : turnOff("ATGA2");
    !radonon && getPageSetting('ATGA2') == true ? turnOn("ATGA2timer") : turnOff("ATGA2timer");
    !radonon && getPageSetting('ATGA2') == true ? turnOn("ATGA2gen") : turnOff("ATGA2gen");
    var ATGAon = (getPageSetting('ATGA2') == true && getPageSetting('ATGA2timer') > 0);
    (!radonon && ATGAon) ? turnOn("zATGA2timer") : turnOff("zATGA2timer");
    (!radonon && ATGAon && getPageSetting('zATGA2timer') > 0) ? turnOn("ztATGA2timer") : turnOff("ztATGA2timer");
    (!radonon && ATGAon) ? turnOn("ATGA2timerz") : turnOff("ATGA2timerz");
    (!radonon && ATGAon && getPageSetting('ATGA2timerz') > 0) ? turnOn("ATGA2timerzt") : turnOff("ATGA2timerzt");
    (!radonon && ATGAon) ? turnOn("sATGA2timer") : turnOff("sATGA2timer");
    (!radonon && ATGAon) ? turnOn("dsATGA2timer") : turnOff("dsATGA2timer");
    (!radonon && ATGAon) ? turnOn("dATGA2timer") : turnOff("dATGA2timer");
    (!radonon && ATGAon) ? turnOn("dhATGA2timer") : turnOff("dhATGA2timer");
    (!radonon && ATGAon) ? turnOn("cATGA2timer") : turnOff("cATGA2timer");
    (!radonon && ATGAon) ? turnOn("chATGA2timer") : turnOff("chATGA2timer");
    (!radonon && ATGAon) ? turnOn("dATGA2Auto") : turnOff("dATGA2Auto");



    //Combat
    !radonon ? turnOn("AutoStance") : turnOff("AutoStance");
    !radonon ? turnOn("AutoStanceNew") : turnOff("AutoStanceNew");
    !radonon ? turnOn("DynamicGyms") : turnOff("DynamicGyms");
    !radonon ? turnOn("AutoRoboTrimp") : turnOff("AutoRoboTrimp");
    !radonon ? turnOn("fightforever") : turnOff("fightforever");
    !radonon ? turnOn("addpoison") : turnOff("addpoison");
    !radonon ? turnOn("fullice") : turnOff("fullice");
    !radonon ? turnOn("45stacks") : turnOff("45stacks");
    !radonon ? turnOn("ForceAbandon") : turnOff("ForceAbandon");
    !radonon && getPageSetting('AutoStance') != 3 ? turnOn("IgnoreCrits") : turnOff("IgnoreCrits");


    //RCombat
    radonon ? turnOn("Rfightforever") : turnOff("Rfightforever");
    radonon ? turnOn("Rcalcmaxequality") : turnOff("Rcalcmaxequality");
    radonon ? turnOn("Rmanageequality") : turnOff("Rmanageequality");
    radonon ? turnOn("Rcalcfrenzy") : turnOff("Rcalcfrenzy");
    radonon ? turnOn("Rmutecalc") : turnOff("Rmutecalc");



    //Challenges

    //Quagmire
    radonon ? turnOn("Rblackbog") : turnOff("Rblackbog");
    (radonon && getPageSetting('Rblackbog') == true) ? turnOn("Rblackbogmaz") : turnOff("Rblackbogmaz");
    turnOff("Rblackbogzone");
    turnOff("Rblackbogamount");

    //Arch
    radonon ? turnOn("Rarchon") : turnOff("Rarchon");
    radonon && getPageSetting('Rarchon') == true ? turnOn("Rarchstring1") : turnOff("Rarchstring1");
    radonon && getPageSetting('Rarchon') == true ? turnOn("Rarchstring2") : turnOff("Rarchstring2");
    radonon && getPageSetting('Rarchon') == true ? turnOn("Rarchstring3") : turnOff("Rarchstring3");

    //Mayhem
    radonon ? turnOn("Rmayhemon") : turnOff("Rmayhemon");
    radonon && getPageSetting('Rmayhemon') == true ? turnOn("Rmayhemattack") : turnOff("Rmayhemattack");
    radonon && getPageSetting('Rmayhemon') == true ? turnOn("Rmayhemhealth") : turnOff("Rmayhemhealth");
    radonon && getPageSetting('Rmayhemon') == true ? turnOn("Rmayhemabcut") : turnOff("Rmayhemabcut");
    radonon && getPageSetting('Rmayhemon') == true ? turnOn("Rmayhemamcut") : turnOff("Rmayhemamcut");
    radonon && getPageSetting('Rmayhemon') == true ? turnOn("Rmayhemhcut") : turnOff("Rmayhemhcut");
    radonon && getPageSetting('Rmayhemon') == true ? turnOn("Rmayhemmap") : turnOff("Rmayhemmap");

    //Storm
    radonon ? turnOn("Rstormon") : turnOff("Rstormon");
    radonon && getPageSetting('Rstormon') == true ? turnOn("Rstormzone") : turnOff("Rstormzone");
    radonon && getPageSetting('Rstormon') == true ? turnOn("RstormHD") : turnOff("RstormHD");
    radonon && getPageSetting('Rstormon') == true ? turnOn("Rstormmult") : turnOff("Rstormmult");

    //Insanity
    radonon ? turnOn("Rinsanityon") : turnOff("Rinsanityon");
    radonon && getPageSetting('Rinsanityon') == true ? turnOn("Rinsanitymaz") : turnOff("Rinsanitymaz");
    turnOff("Rinsanityfarmzone");
    turnOff("Rinsanityfarmcell");
    turnOff("Rinsanityfarmstack");
    turnOff("Rinsanityfarmlevel");
    radonon && getPageSetting('Rinsanityon') == true ? turnOn("Rinsanityfarmfrag") : turnOff("Rinsanityfarmfrag");

    //Exterminate
    radonon ? turnOn("Rexterminateon") : turnOff("Rexterminateon");
    radonon && getPageSetting('Rexterminateon') == true ? turnOn("Rexterminatecalc") : turnOff("Rexterminatecalc");
    radonon && getPageSetting('Rexterminateon') == true ? turnOn("Rexterminateeq") : turnOff("Rexterminateeq");

    //Nurture
    radonon ? turnOn("Rnurtureon") : turnOff("Rnurtureon");

    //Panda
    radonon ? turnOn("Rpandaon") : turnOff("Rpandaon");
    radonon && getPageSetting('Rpandaon') == true ? turnOn("Rpandamaps") : turnOff("Rpandamaps");
    radonon && getPageSetting('Rpandaon') == true ? turnOn("Rpandazone") : turnOff("Rpandazone");
    radonon && getPageSetting('Rpandaon') == true ? turnOn("Rpandahits") : turnOff("Rpandahits");

    //Alch
    radonon ? turnOn("Ralchon") : turnOff("Ralchon");
    radonon && getPageSetting('Ralchon') == true ? turnOn("Ralchfarmmaz") : turnOff("Ralchfarmmaz");
    turnOff("Ralchfarmzone");
    turnOff("Ralchfarmcell");
    turnOff("Ralchfarmstack");
    turnOff("Ralchfarmlevel");
    turnOff("Ralchfarmselection");
    radonon && getPageSetting('Ralchon') == true ? turnOn("Ralchfarmfrag") : turnOff("Ralchfarmfrag");

    //Hypo
    radonon ? turnOn("Rhypoon") : turnOff("Rhypoon");
    radonon && getPageSetting('Rhypoon') == true ? turnOn("Rhypofarmmaz") : turnOff("Rhypofarmmaz");
    turnOff("Rhypofarmzone");
    turnOff("Rhypofarmcell");
    turnOff("Rhypofarmstack");
    turnOff("Rhypofarmlevel");
    radonon && getPageSetting('Rhypoon') == true ? turnOn("Rhypofarmfrag") : turnOff("Rhypofarmfrag");
    radonon && getPageSetting('Rhypoon') == true ? turnOn("Rhypocastle") : turnOff("Rhypocastle");
    radonon && getPageSetting('Rhypoon') == true ? turnOn("Rhypovoids") : turnOff("Rhypovoids");
    radonon && getPageSetting('Rhypoon') == true ? turnOn("Rhypostorage") : turnOff("Rhypostorage");
    
    //Desolation
    radonon ? turnOn("Rdesoon") : turnOff("Rdesoon");
    radonon && getPageSetting('Rdesoon') == true ? turnOn("Rdesozone") : turnOff("Rdesozone");
    radonon && getPageSetting('Rdesoon') == true ? turnOn("RdesoHD") : turnOff("RdesoHD");
    radonon && getPageSetting('Rdesoon') == true ? turnOn("Rdesomult") : turnOff("Rdesomult");

    //Hide Challenges
    radonon ? turnOn("Rchallengehide") : turnOff("Rchallengehide");
    radonon && getPageSetting('Rchallengehide') == true ? turnOn("Rchallengehidequag") : turnOff("Rchallengehidequag");
    radonon && getPageSetting('Rchallengehide') == true ? turnOn("Rchallengehidearch") : turnOff("Rchallengehidearch");
    radonon && getPageSetting('Rchallengehide') == true ? turnOn("Rchallengehidemayhem") : turnOff("Rchallengehidemayhem");
    radonon && getPageSetting('Rchallengehide') == true ? turnOn("Rchallengehidestorm") : turnOff("Rchallengehidestorm");
    radonon && getPageSetting('Rchallengehide') == true ? turnOn("Rchallengehideinsanity") : turnOff("Rchallengehideinsanity");
    radonon && getPageSetting('Rchallengehide') == true ? turnOn("Rchallengehideexterminate") : turnOff("Rchallengehideexterminate");
    radonon && getPageSetting('Rchallengehide') == true ? turnOn("Rchallengehidenurture") : turnOff("Rchallengehidenurture");
    radonon && getPageSetting('Rchallengehide') == true ? turnOn("Rchallengehidepanda") : turnOff("Rchallengehidepanda");
    radonon && getPageSetting('Rchallengehide') == true ? turnOn("Rchallengehidealchemy") : turnOff("Rchallengehidealchemy");
    radonon && getPageSetting('Rchallengehide') == true ? turnOn("Rchallengehidehypothermia") : turnOff("Rchallengehidehypothermia");
    radonon && getPageSetting('Rchallengehide') == true ? turnOn("Rchallengehidedeso") : turnOff("Rchallengehidedeso");

    if (getPageSetting('Rchallengehidequag') == true) {
        turnOff("Rblackbog");
        turnOff("Rblackbogmaz");
        turnOff("Rblackbogzone");
        turnOff("Rblackbogamount");
    }
    if (getPageSetting('Rchallengehidearch') == true) {
        turnOff("Rarchon");
        turnOff("Rarchstring1");
        turnOff("Rarchstring2");
        turnOff("Rarchstring3");
    }
    if (getPageSetting('Rchallengehidemayhem') == true) {
        turnOff("Rmayhemon");
        turnOff("Rmayhemattack");
        turnOff("Rmayhemhealth");
        turnOff("Rmayhemabcut");
        turnOff("Rmayhemamcut");
        turnOff("Rmayhemhcut");
        turnOff("Rmayhemmap");
    }
    if (getPageSetting('Rchallengehidestorm') == true) {
        turnOff("Rstormon");
        turnOff("Rstormzone");
        turnOff("RstormHD");
        turnOff("Rstormmult");
    }
    if (getPageSetting('Rchallengehideinsanity') == true) {
        turnOff("Rinsanityon");
        turnOff("Rinsanitymaz");
        turnOff("Rinsanityfarmzone");
        turnOff("Rinsanityfarmcell");
        turnOff("Rinsanityfarmstack");
        turnOff("Rinsanityfarmlevel");
        turnOff("Rinsanityfarmfrag");
    }
    if (getPageSetting('Rchallengehideexterminate') == true) {
        turnOff("Rexterminateon");
        turnOff("Rexterminatecalc");
        turnOff("Rexterminateeq");
    }
    if (getPageSetting('Rchallengehidenurture') == true) {
        turnOff("Rnurtureon");
    }
    if (getPageSetting('Rchallengehidepanda') == true) {
        turnOff("Rpandaon");
        turnOff("Rpandamaps");
        turnOff("Rpandazone");
        turnOff("Rpandahits");
    }
    if (getPageSetting('Rchallengehidealchemy') == true) {
        turnOff("Ralchon");
        turnOff("Ralchfarmmaz");
        turnOff("Ralchfarmzone");
        turnOff("Ralchfarmcell");
        turnOff("Ralchfarmstack");
        turnOff("Ralchfarmlevel");
        turnOff("Ralchfarmselection");
        turnOff("Ralchfarmfrag");
    }
    if (getPageSetting('Rchallengehidehypothermia') == true) {
        turnOff("Rhypoon");
        turnOff("Rhypofarmmaz");
        turnOff("Rhypofarmzone");
        turnOff("Rhypofarmcell");
        turnOff("Rhypofarmstack");
        turnOff("Rhypofarmlevel");
        turnOff("Rhypofarmfrag");
        turnOff("Rhypocastle");
        turnOff("Rhypovoids");
        turnOff("Rhypostorage");
    }
    
    if (getPageSetting('Rchallengehidedeso') == true) {
        turnOff("Rdesoon");
        turnOff("Rdesozone");
        turnOff("RdesoHD");
        turnOff("Rdesomult");
    }



    //Scryer
    !radonon ? turnOn("UseScryerStance") : turnOff("UseScryerStance");
    !radonon ? turnOn("ScryerUseWhenOverkill") : turnOff("ScryerUseWhenOverkill");
    !radonon ? turnOn("ScryerMinZone") : turnOff("ScryerMinZone");
    !radonon ? turnOn("ScryerMaxZone") : turnOff("ScryerMaxZone");
    !radonon ? turnOn("onlyminmaxworld") : turnOff("onlyminmaxworld");
    !radonon ? turnOn("ScryerUseinMaps2") : turnOff("ScryerUseinMaps2");
    !radonon ? turnOn("ScryerUseinVoidMaps2") : turnOff("ScryerUseinVoidMaps2");
    !radonon ? turnOn("ScryerUseinPMaps") : turnOff("ScryerUseinPMaps");
    !radonon ? turnOn("ScryerUseinBW") : turnOff("ScryerUseinBW");
    !radonon ? turnOn("ScryerUseinSpire2") : turnOff("ScryerUseinSpire2");
    !radonon ? turnOn("ScryerSkipBoss2") : turnOff("ScryerSkipBoss2");
    !radonon ? turnOn("ScryerSkipCorrupteds2") : turnOff("ScryerSkipCorrupteds2");
    !radonon ? turnOn("ScryerSkipHealthy") : turnOff("ScryerSkipHealthy");
    !radonon ? turnOn("ScryUseinPoison") : turnOff("ScryUseinPoison");
    !radonon ? turnOn("ScryUseinWind") : turnOff("ScryUseinWind");
    !radonon ? turnOn("ScryUseinIce") : turnOff("ScryUseinIce");
    !radonon ? turnOn("ScryerDieZ") : turnOff("ScryerDieZ");
    !radonon ? turnOn("screwessence") : turnOff("screwessence");


    //Magma
    !radonon ? turnOn("UseAutoGen") : turnOff("UseAutoGen");
    !radonon ? turnOn("beforegen") : turnOff("beforegen");
    !radonon ? turnOn("fuellater") : turnOff("fuellater");
    !radonon ? turnOn("fuelend") : turnOff("fuelend");
    !radonon ? turnOn("defaultgen") : turnOff("defaultgen");
    !radonon ? turnOn("AutoGenDC") : turnOff("AutoGenDC");
    !radonon ? turnOn("AutoGenC2") : turnOff("AutoGenC2");
    !radonon ? turnOn("spendmagmite") : turnOff("spendmagmite");
    !radonon ? turnOn("ratiospend") : turnOff("ratiospend");
    var ratiospend = getPageSetting('ratiospend');
    (!radonon && !ratiospend) ? turnOn("SupplyWall") : turnOff("SupplyWall");
    (!radonon && !ratiospend) ? turnOn("spendmagmitesetting") : turnOff("spendmagmitesetting");
    (!radonon && !ratiospend) ? turnOn("MagmiteExplain") : turnOff("MagmiteExplain");
    (!radonon && ratiospend) ? turnOn("effratio") : turnOff("effratio");
    (!radonon && ratiospend) ? turnOn("capratio") : turnOff("capratio");
    (!radonon && ratiospend) ? turnOn("supratio") : turnOff("supratio");
    (!radonon && ratiospend) ? turnOn("ocratio") : turnOff("ocratio");


    //Golden
    !radonon ? turnOn("AutoGoldenUpgrades") : turnOff("AutoGoldenUpgrades");
    !radonon ? turnOn("dAutoGoldenUpgrades") : turnOff("dAutoGoldenUpgrades");
    !radonon ? turnOn("cAutoGoldenUpgrades") : turnOff("cAutoGoldenUpgrades");
    !radonon && getPageSetting('AutoGoldenUpgrades') == "Void" ? turnOn('voidheliumbattle') : turnOff('voidheliumbattle');
    !radonon && getPageSetting('dAutoGoldenUpgrades') == "Void" ? turnOn('dvoidheliumbattle') : turnOff('dvoidheliumbattle');
    !radonon && getPageSetting('AutoGoldenUpgrades') == "Helium" ? turnOn('radonbattle') : turnOff('radonbattle');
    !radonon && getPageSetting('dAutoGoldenUpgrades') == "Helium" ? turnOn('dradonbattle') : turnOff('dradonbattle');
    !radonon && getPageSetting('AutoGoldenUpgrades') == "Battle" ? turnOn('battleradon') : turnOff('battleradon');
    !radonon && getPageSetting('dAutoGoldenUpgrades') == "Battle" ? turnOn('dbattleradon') : turnOff('dbattleradon');

    //RGolden
    radonon ? turnOn("RAutoGoldenUpgrades") : turnOff("RAutoGoldenUpgrades");
    radonon ? turnOn("RdAutoGoldenUpgrades") : turnOff("RdAutoGoldenUpgrades");
    radonon ? turnOn("RcAutoGoldenUpgrades") : turnOff("RcAutoGoldenUpgrades");
    radonon && getPageSetting('RAutoGoldenUpgrades') == "Void" ? turnOn('Rvoidheliumbattle') : turnOff('Rvoidheliumbattle');
    radonon && getPageSetting('RdAutoGoldenUpgrades') == "Void" ? turnOn('Rdvoidheliumbattle') : turnOff('Rdvoidheliumbattle');
    radonon && getPageSetting('RAutoGoldenUpgrades') == "Radon" ? turnOn('Rradonbattle') : turnOff('Rradonbattle');
    radonon && getPageSetting('RdAutoGoldenUpgrades') == "Radon" ? turnOn('Rdradonbattle') : turnOff('Rdradonbattle');
    radonon && getPageSetting('RAutoGoldenUpgrades') == "Battle" ? turnOn('Rbattleradon') : turnOff('Rbattleradon');
    radonon && getPageSetting('RdAutoGoldenUpgrades') == "Battle" ? turnOn('Rdbattleradon') : turnOff('Rdbattleradon');


    //AB
    radonon ? turnOn("RAB") : turnOff("RAB");
    radonon && getPageSetting('RAB') == true ? turnOn("RABpreset") : turnOff("RABpreset");
    radonon && getPageSetting('RAB') == true ? turnOn("RABdustsimple") : turnOff("RABdustsimple");
    radonon && getPageSetting('RAB') == true ? turnOn("RABfarm") : turnOff("RABfarm");
    radonon && getPageSetting('RAB') == true ? turnOn("RABfarmswitch") : turnOff("RABfarmswitch");
    radonon && getPageSetting('RAB') == true ? turnOn("RABfarmstring") : turnOff("RABfarmstring");
    radonon && getPageSetting('RAB') == true ? turnOn("RABfarmsolve") : turnOff("RABfarmsolve");


    //Nature
    !radonon ? turnOn("AutoNatureTokens") : turnOff("AutoNatureTokens");
    !radonon && getPageSetting('AutoNatureTokens') == true ? turnOn("tokenthresh") : turnOff("tokenthresh");
    !radonon && getPageSetting('AutoNatureTokens') == true ? turnOn("AutoPoison") : turnOff("AutoPoison");
    !radonon && getPageSetting('AutoNatureTokens') == true ? turnOn("AutoWind") : turnOff("AutoWind");
    !radonon && getPageSetting('AutoNatureTokens') == true ? turnOn("AutoIce") : turnOff("AutoIce");


    //Enlight
    !radonon ? turnOn("autoenlight") : turnOff("autoenlight");
    !radonon && getPageSetting('autoenlight') == true ? turnOn("pfillerenlightthresh") : turnOff("pfillerenlightthresh");
    !radonon && getPageSetting('autoenlight') == true ? turnOn("wfillerenlightthresh") : turnOff("wfillerenlightthresh");
    !radonon && getPageSetting('autoenlight') == true ? turnOn("ifillerenlightthresh") : turnOff("ifillerenlightthresh");
    !radonon && getPageSetting('autoenlight') == true ? turnOn("pdailyenlightthresh") : turnOff("pdailyenlightthresh");
    !radonon && getPageSetting('autoenlight') == true ? turnOn("wdailyenlightthresh") : turnOff("wdailyenlightthresh");
    !radonon && getPageSetting('autoenlight') == true ? turnOn("idailyenlightthresh") : turnOff("idailyenlightthresh");
    !radonon && getPageSetting('autoenlight') == true ? turnOn("pc2enlightthresh") : turnOff("pc2enlightthresh");
    !radonon && getPageSetting('autoenlight') == true ? turnOn("wc2enlightthresh") : turnOff("wc2enlightthresh");
    !radonon && getPageSetting('autoenlight') == true ? turnOn("ic2enlightthresh") : turnOff("ic2enlightthresh");


    //Display
    (game.worldUnlocks.easterEgg.locked == false) ? turnOn('AutoEggs') : turnOff('AutoEggs');
    turnOff("zonetracker");


    //Memory
    if (getPageSetting('showbreedtimer') == false) turnOff("hiddenBreedTimer");
    if (getPageSetting('showautomapstatus') == false) turnOff("autoMapStatus");
    !radonon ? turnOn("showautomapstatus") : turnOff("showautomapstatus");
    radonon ? turnOn("Rshowautomapstatus") : turnOff("Rshowautomapstatus");


    //Heirloom Swapping
    radonon ? turnOn('Rhs') : turnOff('Rhs');
    var hson = (getPageSetting('Rhs') == true);

    //Shields
    radonon && hson ? turnOn('Rhsshield') : turnOff('Rhsshield');
    var hsshieldon = (getPageSetting('Rhsshield') == true);
    radonon && hson && hsshieldon ? turnOn('Rhsz') : turnOff('Rhsz');
    radonon && hson && hsshieldon ? turnOn('Rhs1') : turnOff('Rhs1');
    radonon && hson && hsshieldon ? turnOn('Rhs2') : turnOff('Rhs2');

    //Staffs
    radonon && hson ? turnOn('Rhsstaff') : turnOff('Rhsstaff');
    var hsstaffon = (getPageSetting('Rhsstaff') == true);
    radonon && hson && hsstaffon ? turnOn('Rhsworldstaff') : turnOff('Rhsworldstaff');
    radonon && hson && hsstaffon ? turnOn('Rhsmapstaff') : turnOff('Rhsmapstaff');
    radonon && hson && hsstaffon ? turnOn('Rhstributestaff') : turnOff('Rhstributestaff');

    var autoheirloomenable = (getPageSetting('autoheirlooms') == true);
    var keepshieldenable = (autoheirloomenable && getPageSetting('keepshields') == true);
    var keepstaffenable = (autoheirloomenable && getPageSetting('keepstaffs') == true);
    var keepcoreenable = (autoheirloomenable && getPageSetting('keepcores') == true);

    (autoheirloomenable) ? turnOn('typetokeep') : turnOff('typetokeep');
    (autoheirloomenable) ? turnOn('raretokeep') : turnOff('raretokeep');
    (autoheirloomenable) ? turnOn('keepshields') : turnOff('keepshields');
    (autoheirloomenable) ? turnOn('keepstaffs') : turnOff('keepstaffs');

    (keepshieldenable) ? turnOn('slot1modsh') : turnOff('slot1modsh');
    (keepshieldenable) ? turnOn('slot2modsh') : turnOff('slot2modsh');
    (keepshieldenable) ? turnOn('slot3modsh') : turnOff('slot3modsh');
    (keepshieldenable) ? turnOn('slot4modsh') : turnOff('slot4modsh');
    (keepshieldenable) ? turnOn('slot5modsh') : turnOff('slot5modsh');
    (keepshieldenable) ? turnOn('slot6modsh') : turnOff('slot6modsh');
    (keepshieldenable) ? turnOn('slot7modsh') : turnOff('slot7modsh');

    (keepstaffenable) ? turnOn('slot1modst') : turnOff('slot1modst');
    (keepstaffenable) ? turnOn('slot2modst') : turnOff('slot2modst');
    (keepstaffenable) ? turnOn('slot3modst') : turnOff('slot3modst');
    (keepstaffenable) ? turnOn('slot4modst') : turnOff('slot4modst');
    (keepstaffenable) ? turnOn('slot5modst') : turnOff('slot5modst');
    (keepstaffenable) ? turnOn('slot6modst') : turnOff('slot6modst');
    (keepstaffenable) ? turnOn('slot7modst') : turnOff('slot7modst');

    (keepcoreenable) ? turnOn('slot1modcr') : turnOff('slot1modcr');
    (keepcoreenable) ? turnOn('slot2modcr') : turnOff('slot2modcr');
    (keepcoreenable) ? turnOn('slot3modcr') : turnOff('slot3modcr');
    (keepcoreenable) ? turnOn('slot4modcr') : turnOff('slot4modcr');


    //Dropdowns
    document.getElementById('AutoPortal').value = autoTrimpSettings.AutoPortal.selected;
    document.getElementById('HeliumHourChallenge').value = autoTrimpSettings.HeliumHourChallenge.selected;
    document.getElementById('RAutoPortal').value = autoTrimpSettings.RAutoPortal.selected;
    document.getElementById('RadonHourChallenge').value = autoTrimpSettings.RadonHourChallenge.selected;
    document.getElementById('dHeliumHourChallenge').value = autoTrimpSettings.dHeliumHourChallenge.selected;
    document.getElementById('RdHeliumHourChallenge').value = autoTrimpSettings.RdHeliumHourChallenge.selected;
    document.getElementById('mapselection').value = autoTrimpSettings.mapselection.selected;
    document.getElementById('Rmapselection').value = autoTrimpSettings.Rmapselection.selected;
    document.getElementById('Prestige').value = autoTrimpSettings.Prestige.selected;
    document.getElementById('AutoGoldenUpgrades').value = autoTrimpSettings.AutoGoldenUpgrades.selected;
    document.getElementById('dAutoGoldenUpgrades').value = autoTrimpSettings.dAutoGoldenUpgrades.selected;
    document.getElementById('cAutoGoldenUpgrades').value = autoTrimpSettings.cAutoGoldenUpgrades.selected;
    document.getElementById('RAutoGoldenUpgrades').value = autoTrimpSettings.RAutoGoldenUpgrades.selected;
    document.getElementById('RdAutoGoldenUpgrades').value = autoTrimpSettings.RdAutoGoldenUpgrades.selected;
    document.getElementById('RcAutoGoldenUpgrades').value = autoTrimpSettings.RcAutoGoldenUpgrades.selected;
    document.getElementById('AutoPoison').value = autoTrimpSettings.AutoPoison.selected;
    document.getElementById('AutoWind').value = autoTrimpSettings.AutoWind.selected;
    document.getElementById('AutoIce').value = autoTrimpSettings.AutoIce.selected;

    //Heirloom dropdowns
    document.getElementById('raretokeep').value = autoTrimpSettings.raretokeep.selected;
    document.getElementById('slot1modsh').value = autoTrimpSettings.slot1modsh.selected;
    document.getElementById('slot2modsh').value = autoTrimpSettings.slot2modsh.selected;
    document.getElementById('slot3modsh').value = autoTrimpSettings.slot3modsh.selected;
    document.getElementById('slot4modsh').value = autoTrimpSettings.slot4modsh.selected;
    document.getElementById('slot5modsh').value = autoTrimpSettings.slot5modsh.selected;
    document.getElementById('slot6modsh').value = autoTrimpSettings.slot6modsh.selected;
    document.getElementById('slot7modsh').value = autoTrimpSettings.slot7modsh.selected;
    document.getElementById('slot1modst').value = autoTrimpSettings.slot1modst.selected;
    document.getElementById('slot2modst').value = autoTrimpSettings.slot2modst.selected;
    document.getElementById('slot3modst').value = autoTrimpSettings.slot3modst.selected;
    document.getElementById('slot4modst').value = autoTrimpSettings.slot4modst.selected;
    document.getElementById('slot5modst').value = autoTrimpSettings.slot5modst.selected;
    document.getElementById('slot6modst').value = autoTrimpSettings.slot6modst.selected;
    document.getElementById('slot7modst').value = autoTrimpSettings.slot7modst.selected;
    document.getElementById('slot1modcr').value = autoTrimpSettings.slot1modcr.selected;
    document.getElementById('slot2modcr').value = autoTrimpSettings.slot2modcr.selected;
    document.getElementById('slot3modcr').value = autoTrimpSettings.slot3modcr.selected;
    document.getElementById('slot4modcr').value = autoTrimpSettings.slot4modcr.selected;

    if (game.global.universe == 1)
        document.getElementById('autoMapBtn').setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings.AutoMaps.value);
    if (game.global.universe == 2)
        document.getElementById('autoMapBtn').setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings.RAutoMaps.value);


    if (game.global.universe == 1 && getPageSetting('DisableFarm') <= 0)
        shouldFarm = false;
    if (game.global.universe == 2 && getPageSetting('RDisableFarm') <= 0)
        RshouldFarm = false;

    MODULES["maps"] && (MODULES["maps"].preferGardens = !getPageSetting('PreferMetal'));
    if (document.getElementById('Prestige').selectedIndex > 11 && game.global.slowDone == false) {
        document.getElementById('Prestige').selectedIndex = 11;
        autoTrimpSettings.Prestige.selected = "Bestplate";
    }

    for (var setting in autoTrimpSettings) {
        var item = autoTrimpSettings[setting];
        if (item.type == 'value' || item.type == 'valueNegative' || item.type == 'multitoggle' || item.type == 'multiValue' || item.type == 'textValue') {
            var elem = document.getElementById(item.id);
            if (elem.parentNode.style.display === 'none') continue;
            if (elem != null) {
                if (item.type == 'multitoggle')
                    elem.textContent = item.name[item.value];
                else if (item.type == 'multiValue') {
                    if (Array.isArray(item.value) && item.value.length == 1 && item.value[0] == -1)
                        elem.innerHTML = item.name + ': ' + "<span class='icomoon icon-infinity'></span>";
                    else if (Array.isArray(item.value))
                        elem.innerHTML = item.name + ': ' + item.value[0] + '+';
                    else
                        elem.textContent = item.name + ': ' + item.value.toString();
                } else if (item.type == 'textValue' && item.value.substring !== undefined) {
                    if (item.value.length > 18)
                        elem.textContent = item.name + ': ' + item.value.substring(0, 21) + '...';
                    else
                        elem.textContent = item.name + ': ' + item.value.substring(0, 21);
                } else if (item.value > -1 || item.type == 'valueNegative')
                    elem.textContent = item.name + ': ' + prettify(item.value);
                else
                    elem.innerHTML = item.name + ': ' + "<span class='icomoon icon-infinity'></span>";
            }
        }
    }
}

function checkPortalSettings() {
    var result = findOutCurrentPortalLevel();
    var portalLevel = result.level;
    var leadCheck = result.lead;
    if (portalLevel == -1)
        return portalLevel;
    var voidmaps = 0;
    if (game.global.challengeActive != "Daily") {
        voidmaps = getPageSetting('VoidMaps');
    }
    if (game.global.challengeActive == "Daily") {
        voidmaps = getPageSetting('dVoidMaps');
    }
    if (voidmaps >= portalLevel)
        tooltip('confirm', null, 'update', 'WARNING: Your void maps are set to complete after your autoPortal, and therefore will not be done at all! Please Change Your Settings Now. This Box Will Not Go away Until You do. Remember you can choose \'Custom\' autoPortal along with challenges for complete control over when you portal. <br><br> Estimated autoPortal level: ' + portalLevel, 'cancelTooltip()', 'Void Maps Conflict');
    return portalLevel;
}

function getDailyHeHrStats() {
    var a = "";
    if ("Daily" == game.global.challengeActive) {
        var b = game.stats.heliumHour.value() / (game.global.totalHeliumEarned - (game.global.heliumLeftover + game.resources.helium.owned));
        b *= 100 + getDailyHeliumValue(countDailyWeight()), a = "<b>After Daily He/Hr: " + b.toFixed(3) + "%"
    }
    return a
}

function getDailyRnHrStats() {
    var a = "";
    if ("Daily" == game.global.challengeActive) {
        var b = game.stats.heliumHour.value() / (game.global.totalRadonEarned - (game.global.radonLeftover + game.resources.radon.owned));
        b *= 100 + getDailyHeliumValue(countDailyWeight()), a = "<b>After Daily Rn/Hr: " + b.toFixed(3) + "%"
    }
    return a
}

function settingsProfileMakeGUI() { }

function toggleAutoMaps() {
    if (game.global.universe == 1) {
        if (getPageSetting('AutoMaps')) {
            setPageSetting('AutoMaps', 0);
        } else {
            setPageSetting('AutoMaps', 1);
        }
        document.getElementById('autoMapBtn').setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings.AutoMaps.value);
    }
    if (game.global.universe == 2) {
        if (getPageSetting('RAutoMaps')) {
            setPageSetting('RAutoMaps', 0);
        } else {
            setPageSetting('RAutoMaps', 1);
        }
        document.getElementById('autoMapBtn').setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings.RAutoMaps.value);
    }
    saveSettings();
}
