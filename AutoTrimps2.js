var ATversion='Zek v4.0.0 Forked',atscript=document.getElementById('AutoTrimps-script'),basepath='https://ZeGentzy.github.io/AutoTrimps/',modulepath='modules/';null!==atscript&&(basepath=atscript.src.replace(/AutoTrimps2\.js$/,''));
function ATscriptLoad(a,b){null==b&&debug('Wrong Syntax. Script could not be loaded. Try ATscriptLoad(modulepath, \'example.js\'); ');var c=document.createElement('script');null==a&&(a=''),c.src=basepath+a+b+'.js',c.id=b+'_MODULE',document.head.appendChild(c)}
function ATscriptUnload(a){var b=document.getElementById(a+"_MODULE");b&&(document.head.removeChild(b),debug("Removing "+a+"_MODULE","other"))}
ATscriptLoad(modulepath, 'utils');

function initializeAutoTrimps() {
    loadPageVariables();
    ATscriptLoad('','SettingsGUI');
    ATscriptLoad('','Graphs');
    ATmoduleList = ['import-export', 'query', 'calc', 'portal', 'upgrades', 'heirlooms', 'buildings', 'jobs', 'equipment', 'gather', 'stance', 'maps', 'breedtimer', 'dynprestige', 'fight', 'scryer', 'magmite', 'nature', 'other', 'perks', 'fight-info', 'performance'];
    for (var m in ATmoduleList) {
        ATscriptLoad(modulepath, ATmoduleList[m]);
    }
    debug('AutoTrimps - Zek Fork Loaded!', '*spinner3');
}

var changelogList = [];
changelogList.push({date: "25/08/2019", version: "v4.1.0", description: "<b>v5.1.0</b> <b>CHECK COMBAT FOR BETTERAUTOFIGHT, IF MIGHT BE A BLACK BAR, CLICK IT!</b> A bunch of U2 stuff added, offline progress still being worked on. ", isNew: true});
changelogList.push({date: "05/08/2019", version: "v4.0.0", description: "<b>v5.0.0</b> U2 added. It works, mostly. ", isNew: true});

function assembleChangelog(a,b,c,d){return d?`<b class="AutoEggs">${a} ${b} </b><b style="background-color:#32CD32"> New:</b> ${c}<br>`:`<b>${a} ${b} </b> ${c}<br>`}
function printChangelog() {
    var body="";
    for (var i in changelogList) {
        var $item = changelogList[i];
        var result = assembleChangelog($item.date,$item.version,$item.description,$item.isNew);
        body+=result;
    }
    var footer =
        '<b>ZӘK Fork</b> - <u>Report any bugs/problems please</u>!\
        <br>Talk with the dev: <b>Zek#0647</b> @ <a target="#" href="https://discord.gg/Ztcnfjr">Zeks Discord Channel</a>\
        <br>See <a target="#" href="https://github.com/Zorn192/AutoTrimps/blob/gh-pages/README.md">ReadMe</a> Or check <a target="#" href="https://github.com/Zorn192/AutoTrimps/commits/gh-pages" target="#">the commit history</a> (if you want).'
    ,   action = 'cancelTooltip()'
    ,   title = 'Script Update Notice<br>' + ATversion
    ,   acceptBtnText = "Thank you for playing AutoTrimps. Accept and Continue."
    ,   hideCancel = true;
    tooltip('confirm', null, 'update', body+footer, action, title, acceptBtnText, null, hideCancel);
}

var runInterval = 100;
var startupDelay = 4000;

setTimeout(delayStart, startupDelay);

function delayStart() {
    initializeAutoTrimps();
    printChangelog();
    setTimeout(delayStartAgain, startupDelay);
}

function delayStartAgain(){
    game.global.addonUser = true;
    game.global.autotrimps = true;
    MODULESdefault = JSON.parse(JSON.stringify(MODULES));
    setInterval(mainLoop, runInterval);
    setInterval(guiLoop, runInterval*10);
}

/*function gameTimeout() {
	if (game.options.menu.pauseGame.enabled) {
		setTimeout(gameTimeout, 100);
		return;
	}
	var now = new Date().getTime();
	if ((now - game.global.start - game.global.time) > 3600000){	
		checkOfflineProgress();
		game.global.start = now;
		game.global.time = 0;
		game.global.lastOnline = now;
		setTimeout(gameTimeout, (1000 / game.settings.speed));
		return;
	}
	game.global.lastOnline = now;
    var tick = 1000 / game.settings.speed;
    game.global.time += tick;
	var dif = (now - game.global.start) - game.global.time;
    while (dif >= tick) {
        runGameLoop(true, now);
        setTimeout(mainLoop, startupDelay);
        dif -= tick;
        game.global.time += tick;
		ctrlPressed = false;
	}
    runGameLoop(null, now);
    updateLabels();
    setTimeout(gameTimeout, (tick - dif));
}

function runGameLoop(makeUp, now) {
	if (usingRealTimeOffline) return;
	try {
		gameLoop(makeUp, now);
        	setTimeout(mainLoop, startupDelay);
	} catch (e) {
		unlockTooltip(); // Override any other tooltips
		tooltip('hide');
		tooltip('Error', null, 'update', e.stack);
		throw(e);
	}
}*/

var ATrunning = true;
var ATmessageLogTabVisible = true;
var enableDebug = true;

var autoTrimpSettings = {};
var MODULES = {};
var MODULESdefault = {};
var ATMODULES = {};
var ATmoduleList = [];

var bestBuilding;
var scienceNeeded;
var RscienceNeeded;
var breedFire = false;

var shouldFarm = false;
var RshouldFarm = false;
var enoughDamage = true;
var RenoughDamage = true;
var enoughHealth = true;
var RenoughHealth = true;

var baseDamage = 0;
var baseBlock = 0;
var baseHealth = 0;

var preBuyAmt;
var preBuyFiring;
var preBuyTooltip;
var preBuymaxSplit;

var currentworld = 0;
var lastrunworld = 0;
var aWholeNewWorld = false;
var needGymystic = true;
var heirloomFlag = false;
var daily3 = false;
var heirloomCache = game.global.heirloomsExtra.length;
var magmiteSpenderChanged = false;
var lastHeliumZone = 0;
var lastRadonZone = 0;

function mainLoop() {
    if (ATrunning == false) return;
    if (getPageSetting('PauseScript') || game.options.menu.pauseGame.enabled || game.global.viewingUpgrades) return;
    ATrunning = true;
    if (getPageSetting('showbreedtimer') == true) {
        if (game.options.menu.showFullBreed.enabled != 1) toggleSetting("showFullBreed");
        addbreedTimerInsideText.innerHTML = ((game.jobs.Amalgamator.owned > 0) ? Math.floor((new Date().getTime() - game.global.lastSoldierSentAt) / 1000) : Math.floor(game.global.lastBreedTime / 1000)) + 's'; //add breed time for next army;
        addToolTipToArmyCount();
    }
    if (mainCleanup() || portalWindowOpen || (!heirloomsShown && heirloomFlag) || (heirloomCache != game.global.heirloomsExtra.length)) {
        heirloomCache = game.global.heirloomsExtra.length;
    }
    heirloomFlag = heirloomsShown;
    if (aWholeNewWorld) {
        switch (document.getElementById('tipTitle').innerHTML) {
            case 'The Improbability':
            case 'Corruption':
            case 'Spire':
            case 'The Magma':
                cancelTooltip();
        }
        if (getPageSetting('AutoEggs'))
            easterEggClicked();
        setTitle();
    }

    //Logic for Universe 1
    if (game.global.universe == 1){

        //Offline Progress
        if (!usingRealTimeOffline) { 
            setScienceNeeded();
            autoLevelEquipment();
        }

        //Core
        if (getPageSetting('AutoMaps') > 0) autoMap();
        if (getPageSetting('showautomapstatus') == true) updateAutoMapsStatus();
        if (getPageSetting('ManualGather2') == 1) manualLabor2();
        if (getPageSetting('TrapTrimps') && game.global.trapBuildAllowed && game.global.trapBuildToggled == false) toggleAutoTrap();
        if (getPageSetting('ManualGather2') == 2) autogather3();
        if (getPageSetting('ATGA2') == true) ATGA2();
        if (aWholeNewWorld && getPageSetting('AutoRoboTrimp')) autoRoboTrimp();
        if (game.global.challengeActive == "Daily" && getPageSetting('buyheliumy') >= 1 && getDailyHeliumValue(countDailyWeight()) >= getPageSetting('buyheliumy') && game.global.b >= 100 && !game.singleRunBonuses.heliumy.owned) purchaseSingleRunBonus('heliumy');
        if (aWholeNewWorld && getPageSetting('FinishC2') > 0 && game.global.runningChallengeSquared) finishChallengeSquared();
        if (getPageSetting('spendmagmite') == 2 && !magmiteSpenderChanged) autoMagmiteSpender();
        if (getPageSetting('AutoNatureTokens') && game.global.world > 229) autoNatureTokens();
        if (getPageSetting('autoenlight') && game.global.world > 229 && game.global.uberNature == false) autoEnlight();
        if (getPageSetting('BuyUpgradesNew') != 0) buyUpgrades();

        //Buildings
        if (getPageSetting('BuyBuildingsNew') === 0 && getPageSetting('hidebuildings') == true) buyBuildings();
        else if (getPageSetting('BuyBuildingsNew') == 1) {
            buyBuildings();
            buyStorage();
        }
        else if (getPageSetting('BuyBuildingsNew') == 2) buyBuildings();
        else if (getPageSetting('BuyBuildingsNew') == 3) buyStorage();
        if (getPageSetting('UseAutoGen') == true && game.global.world > 229) autoGenerator();

        //Jobs
        if (getPageSetting('BuyJobsNew') == 1) {
            workerRatios();
            buyJobs();
        } 
        else if (getPageSetting('BuyJobsNew') == 2) buyJobs();

        //Portal
        if (autoTrimpSettings.AutoPortal.selected != "Off" && game.global.challengeActive != "Daily" && !game.global.runningChallengeSquared) autoPortal();
        if (getPageSetting('AutoPortalDaily') > 0 && game.global.challengeActive == "Daily") dailyAutoPortal();
        if (getPageSetting('c2runnerstart') == true && getPageSetting('c2runnerportal') > 0 && game.global.runningChallengeSquared && game.global.world > getPageSetting('c2runnerportal')) c2runnerportal();
    
        //Combat
        if (getPageSetting('ForceAbandon') == true || getPageSetting('fuckanti') > 0) trimpcide();
        if (getPageSetting('trimpsnotdie') == true && game.global.world > 1) helptrimpsnotdie();
        if (!game.global.fighting) {
            if (getPageSetting('fightforever') == 0) fightalways();
            else if (getPageSetting('fightforever') > 0 && calcHDratio() <= getPageSetting('fightforever')) fightalways();
            else if (getPageSetting('cfightforever') == true && (game.global.challengeActive == 'Electricty' || game.global.challengeActive == 'Toxicity' || game.global.challengeActive == 'Nom')) fightalways();
            else if (getPageSetting('dfightforever') == 1 && game.global.challengeActive == "Daily" && typeof game.global.dailyChallenge.empower == 'undefined' && typeof game.global.dailyChallenge.bloodthirst == 'undefined' && (typeof game.global.dailyChallenge.bogged !== 'undefined' || typeof game.global.dailyChallenge.plague !== 'undefined' || typeof game.global.dailyChallenge.pressure !== 'undefined')) fightalways();
            else if (getPageSetting('dfightforever') == 2 && game.global.challengeActive == "Daily" && (typeof game.global.dailyChallenge.bogged !== 'undefined' || typeof game.global.dailyChallenge.plague !== 'undefined' || typeof game.global.dailyChallenge.pressure !== 'undefined')) fightalways();
        }
        if (getPageSetting('BetterAutoFight') == 1) betterAutoFight();
        if (getPageSetting('BetterAutoFight') == 2) betterAutoFight3();
        var forcePrecZ = (getPageSetting('ForcePresZ') < 0) || (game.global.world < getPageSetting('ForcePresZ'));
        if (getPageSetting('DynamicPrestige2') > 0 && forcePrecZ) prestigeChanging2();
        else autoTrimpSettings.Prestige.selected = document.getElementById('Prestige').value;
        var RforcePrecZ = (getPageSetting('RForcePresZ') < 0) || (game.global.world < getPageSetting('RForcePresZ'));
        if (getPageSetting('RDynamicPrestige2') > 0 && RforcePrecZ) RprestigeChanging2();
        else autoTrimpSettings.RPrestige.selected = document.getElementById('RPrestige').value;
        if (game.global.world > 5 && game.global.challengeActive == "Daily" && getPageSetting('avoidempower') == true && typeof game.global.dailyChallenge.empower !== 'undefined' && !game.global.preMapsActive && !game.global.mapsActive && game.global.soldierHealth > 0) avoidempower();
        if (getPageSetting('buywepsvoid') == true && ((getPageSetting('VoidMaps') == game.global.world && game.global.challengeActive != "Daily") || (getPageSetting('DailyVoidMod') == game.global.world && game.global.challengeActive == "Daily")) && game.global.mapsActive && getCurrentMapObject().location == "Void") buyWeps();
        if ((getPageSetting('darmormagic') > 0 && typeof game.global.dailyChallenge.empower == 'undefined' && typeof game.global.dailyChallenge.bloodthirst == 'undefined' && (typeof game.global.dailyChallenge.bogged !== 'undefined' || typeof game.global.dailyChallenge.plague !== 'undefined' || typeof game.global.dailyChallenge.pressure !== 'undefined')) || (getPageSetting('carmormagic') > 0 && (game.global.challengeActive == 'Toxicity' || game.global.challengeActive == 'Nom'))) armormagic();
    
        //Stance
        if ((getPageSetting('UseScryerStance') == true) || (getPageSetting('scryvoidmaps') == true && game.global.challengeActive != "Daily") || (getPageSetting('dscryvoidmaps') == true && game.global.challengeActive == "Daily")) useScryerStance();
        else if ((getPageSetting('AutoStance') == 3) || (getPageSetting('use3daily') == true && game.global.challengeActive == "Daily")) windStance();
        else if (getPageSetting('AutoStance') == 1) autoStance();
        else if (getPageSetting('AutoStance') == 2) autoStance2();

        //Spire
        if (getPageSetting('ExitSpireCell') > 0 && game.global.challengeActive != "Daily" && getPageSetting('IgnoreSpiresUntil') <= game.global.world && game.global.spireActive) exitSpireCell();
        if (getPageSetting('dExitSpireCell') >= 1 && game.global.challengeActive == "Daily" && getPageSetting('dIgnoreSpiresUntil') <= game.global.world && game.global.spireActive) dailyexitSpireCell();
        if (getPageSetting('SpireBreedTimer') > 0 && getPageSetting('IgnoreSpiresUntil') <= game.global.world) ATspirebreed();
        if (getPageSetting('spireshitbuy') == true && (isActiveSpireAT() || disActiveSpireAT())) buyshitspire();

        //Raiding
        if ((getPageSetting('PraidHarder') == true && getPageSetting('Praidingzone').length > 0 && game.global.challengeActive != "Daily") || (getPageSetting('dPraidHarder') == true && getPageSetting('dPraidingzone').length > 0 && game.global.challengeActive == "Daily")) PraidHarder();
        else {
            if (getPageSetting('Praidingzone').length && game.global.challengeActive != "Daily") Praiding();
            if (getPageSetting('dPraidingzone').length && game.global.challengeActive == "Daily") dailyPraiding();
        }
        if (((getPageSetting('BWraid') && game.global.challengeActive != "Daily") || (getPageSetting('Dailybwraid') && game.global.challengeActive == "Daily"))) {
            BWraiding();
        }
        if ((getPageSetting('BWraid') == true || getPageSetting('DailyBWraid') == true) && bwraidon) buyWeps();
        if (game.global.mapsActive && getPageSetting('game.global.universe == 1 && BWraid') == true && game.global.world == getPageSetting('BWraidingz') && getCurrentMapObject().level <= getPageSetting('BWraidingmax')) buyWeps();

            //Golden
        var agu = getPageSetting('AutoGoldenUpgrades');
        var dagu = getPageSetting('dAutoGoldenUpgrades');
        var cagu = getPageSetting('cAutoGoldenUpgrades');
        if (agu && agu != 'Off' && (!game.global.runningChallengeSquared && game.global.challengeActive != "Daily")) autoGoldenUpgradesAT(agu);
        if (dagu && dagu != 'Off' && game.global.challengeActive == "Daily") autoGoldenUpgradesAT(dagu);
        if (cagu && cagu != 'Off' && game.global.runningChallengeSquared) autoGoldenUpgradesAT(cagu);
    }
    
    //Logic for Universe 2
    if (game.global.universe == 2){

        //Offline Progress
        if (!usingRealTimeOffline) {
            RsetScienceNeeded();
            RautoLevelEquipment();
        }

        //RCore
        if (getPageSetting('RAutoMaps') > 0) RautoMap();
        if (getPageSetting('Rshowautomapstatus') == true) RupdateAutoMapsStatus();
        if (getPageSetting('RManualGather2') == 1) RmanualLabor2();
        if (getPageSetting('RTrapTrimps') && game.global.trapBuildAllowed && game.global.trapBuildToggled == false) toggleAutoTrap();
        if (getPageSetting('RBuyUpgradesNew') != 0) RbuyUpgrades();
        if (game.global.challengeActive == "Daily" && getPageSetting('buyradony') >= 1 && getDailyHeliumValue(countDailyWeight()) >= getPageSetting('buyradony') && game.global.b >= 100 && !game.singleRunBonuses.heliumy.owned) purchaseSingleRunBonus('heliumy');    
        
        //RBuildings
        if (getPageSetting('RBuyBuildingsNew') == 1) {
            RbuyBuildings();
            RbuyStorage();
        } 
        else if (getPageSetting('RBuyBuildingsNew') == 2) {
                 RbuyBuildings();
        }
        else if (getPageSetting('RBuyBuildingsNew') == 3) {
                 RbuyStorage();
        }
        
        //RJobs
        if (getPageSetting('RBuyJobsNew') == 1) {
            RworkerRatios();
            RbuyJobs();
        } 
        else if (getPageSetting('RBuyJobsNew') == 2) RbuyJobs();

        //RPortal
        if (autoTrimpSettings.RAutoPortal.selected != "Off" && game.global.challengeActive != "Daily" && !game.global.runningChallengeSquared) RautoPortal();
        if (getPageSetting('RAutoPortalDaily') > 0 && game.global.challengeActive == "Daily") RdailyAutoPortal();

        //RCombat
        if (getPageSetting('BetterAutoFight') == 1) betterAutoFight();
        if (getPageSetting('BetterAutoFight') == 2) betterAutoFight3();
        var forcePrecZ = (getPageSetting('ForcePresZ') < 0) || (game.global.world < getPageSetting('ForcePresZ'));
        if (getPageSetting('DynamicPrestige2') > 0 && forcePrecZ) prestigeChanging2();
        else autoTrimpSettings.Prestige.selected = document.getElementById('Prestige').value;
        var RforcePrecZ = (getPageSetting('RForcePresZ') < 0) || (game.global.world < getPageSetting('RForcePresZ'));
        if (getPageSetting('RDynamicPrestige2') > 0 && RforcePrecZ) RprestigeChanging2();
        else autoTrimpSettings.RPrestige.selected = document.getElementById('RPrestige').value;
        if (game.global.world > 5 && game.global.challengeActive == "Daily" && getPageSetting('avoidempower') == true && typeof game.global.dailyChallenge.empower !== 'undefined' && !game.global.preMapsActive && !game.global.mapsActive && game.global.soldierHealth > 0) avoidempower();
        if (getPageSetting('trimpsnotdie') == true && game.global.world > 1) Rhelptrimpsnotdie();
        /*if (!game.global.fighting) {
        if (getPageSetting('Rfightforever') == 0) Rfightalways();
            else if (getPageSetting('Rfightforever') > 0 && RcalcHDratio() <= getPageSetting('Rfightforever')) Rfightalways();
            else if (getPageSetting('Rcfightforever') == true && (game.global.challengeActive == 'Electricty' || game.global.challengeActive == 'Toxicity' || game.global.challengeActive == 'Nom')) Rfightalways();
            else if (getPageSetting('Rdfightforever') == 1 && game.global.challengeActive == "Daily" && typeof game.global.dailyChallenge.empower == 'undefined' && typeof game.global.dailyChallenge.bloodthirst == 'undefined' && (typeof game.global.dailyChallenge.bogged !== 'undefined' || typeof game.global.dailyChallenge.plague !== 'undefined' || typeof game.global.dailyChallenge.pressure !== 'undefined')) Rfightalways();
            else if (getPageSetting('Rdfightforever') == 2 && game.global.challengeActive == "Daily" && (typeof game.global.dailyChallenge.bogged !== 'undefined' || typeof game.global.dailyChallenge.plague !== 'undefined' || typeof game.global.dailyChallenge.pressure !== 'undefined')) Rfightalways();
        }*/
        if (getPageSetting('Rbuywepsvoid') == true && ((getPageSetting('RVoidMaps') == game.global.world && game.global.challengeActive != "Daily") || (getPageSetting('RDailyVoidMod') == game.global.world && game.global.challengeActive == "Daily")) && game.global.mapsActive && getCurrentMapObject().location == "Void") RbuyWeps();
        if ((getPageSetting('Rdarmormagic') > 0 && typeof game.global.dailyChallenge.empower == 'undefined' && typeof game.global.dailyChallenge.bloodthirst == 'undefined' && (typeof game.global.dailyChallenge.bogged !== 'undefined' || typeof game.global.dailyChallenge.plague !== 'undefined' || typeof game.global.dailyChallenge.pressure !== 'undefined')) || (getPageSetting('Rcarmormagic') > 0 && (game.global.challengeActive == 'Toxicity' || game.global.challengeActive == 'Nom'))) Rarmormagic();
    
        //RRaiding
        if ((getPageSetting('RPraidHarder') == true && getPageSetting('RPraidingzone').length > 0 && game.global.challengeActive != "Daily") || (getPageSetting('RdPraidHarder') == true && getPageSetting('RdPraidingzone').length > 0 && game.global.challengeActive == "Daily")) RPraidHarder();
        else {
            if (getPageSetting('RPraidingzone').length && game.global.challengeActive != "Daily") RPraiding();
            if (getPageSetting('RdPraidingzone').length && game.global.challengeActive == "Daily") RdailyPraiding();
        }
        if (((getPageSetting('RBWraid') && game.global.challengeActive != "Daily") || (getPageSetting('RDailybwraid') && game.global.challengeActive == "Daily"))) {
        RBWraiding()
        }
        if ((getPageSetting('RBWraid') == true || getPageSetting('RDailyBWraid') == true) && Rbwraidon) RbuyWeps();
        if (game.global.mapsActive && getPageSetting('RBWraid') == true && game.global.world == getPageSetting('RBWraidingz') && getCurrentMapObject().level <= getPageSetting('RBWraidingmax')) RbuyWeps();
    
        //RGolden
        var Ragu = getPageSetting('RAutoGoldenUpgrades');
        var Rdagu = getPageSetting('RdAutoGoldenUpgrades');
        var Rcagu = getPageSetting('RcAutoGoldenUpgrades');
        if (Ragu && Ragu != 'Off' && (!game.global.runningChallengeSquared && game.global.challengeActive != "Daily")) RautoGoldenUpgradesAT(Ragu);
        if (Rdagu && Rdagu != 'Off' && game.global.challengeActive == "Daily") RautoGoldenUpgradesAT(Rdagu);
        if (Rcagu && Rcagu != 'Off' && game.global.runningChallengeSquared) RautoGoldenUpgradesAT(Rcagu);
    }
}

function guiLoop(){updateCustomButtons(),safeSetItems('storedMODULES',JSON.stringify(compareModuleVars())),getPageSetting('EnhanceGrids')&&MODULES.fightinfo.Update(),'undefined'!=typeof MODULES&&'undefined'!=typeof MODULES.performance&&MODULES.performance.isAFK&&MODULES.performance.UpdateAFKOverlay()}
function mainCleanup() {
    lastrunworld = currentworld;
    currentworld = game.global.world;
    aWholeNewWorld = lastrunworld != currentworld;
    if (game.global.universe == 1 && currentworld == 1 && aWholeNewWorld) {
        lastHeliumZone = 0;
        zonePostpone = 0;
        if (getPageSetting('AutoMaps')==0 && !game.upgrades.Battle.done)
            autoTrimpSettings["AutoMaps"].value = 1;
        return true;
    }
    if (game.global.universe == 2 && currentworld == 1 && aWholeNewWorld) {
        lastRadonZone = 0;
        zonePostpone = 0;
        if (getPageSetting('RAutoMaps') == 0 && !game.upgrades.Battle.done)
            autoTrimpSettings["RAutoMaps"].value = 1;
        return true;
    }
}
function throwErrorfromMain(){throw new Error("We have successfully read the thrown error message out of the main file")}
