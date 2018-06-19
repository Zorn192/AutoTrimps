// ==UserScript==
// @name         AutoTrimpsV2
// @version      1.0-sns-test
// @updateURL    https://github.com/spikenskab/AutoTrimps/AutoTrimps2.js
// @description  Automate all the trimps!
// @author       zininzinin, spindrjr, belaith, ishakaru, genBTC, Unihedron, coderPatsy, Kfro, Zeker0
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps
// @grant        none
// ==/UserScript==
var ATversion = '2.1.6.9b-genbtc-4-2-2018 + KFrowde + Zeker0';

////////////////////////////////////////////////////////////////////////////////
//Main Loader Initialize Function (loads first, load everything else)///////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////
var atscript = document.getElementById('AutoTrimps-script')
  , basepath = 'https://spikenskab.github.io/AutoTrimps/'
  , modulepath = 'modules/'
  ;
//This should redirect the script to wherever its being mirrored from.
if (atscript !== null) {
    basepath = atscript.src.replace(/AutoTrimps2\.js$/, '');
}
//This could potentially do something one day. like: read localhost url from tampermonkey.
// AKA do certain things when matched on a certain url.
//if (atscript.src.includes('localhost')) {;};

//Script can be loaded like this: ATscriptLoad(modulepath, 'utils.js');
function ATscriptLoad(pathname, modulename) {
    if (modulename == null) debug("Wrong Syntax. Script could not be loaded. Try ATscriptLoad(modulepath, 'example.js'); ");
    var script = document.createElement('script');
    if (pathname == null) pathname = '';
    script.src = basepath + pathname + modulename + '.js';
    script.id = modulename + '_MODULE';
    //script.setAttribute('crossorigin',"use-credentials");
    //script.setAttribute('crossorigin',"anonymous");
    document.head.appendChild(script);
}
//Scripts can be unloaded like this: ATscriptUnload('scryer');
function ATscriptUnload(id) {
    var $link = document.getElementById(id + '_MODULE');
    if (!$link) return;
    document.head.removeChild($link);
    debug("Removing " + id + "_MODULE","other");
}
ATscriptLoad(modulepath, 'utils');    //Load stuff needed to load other stuff:

//This starts up after 2.5 seconds.
function initializeAutoTrimps() {
    loadPageVariables();            //get autoTrimpSettings
    ATscriptLoad('','SettingsGUI');   //populate Settings GUI
    ATscriptLoad('','Graphs');        //populate Graphs
    //Load modules:
    ATmoduleList = ['query', 'portal', 'upgrades', 'heirlooms', 'buildings', 'jobs', 'equipment', 'gather', 'stance', 'battlecalc', 'maps', 'breedtimer', 'dynprestige', 'fight', 'scryer', 'magmite', 'other', 'import-export', 'perks', 'fight-info', 'performance', 'ATcalc'];
    for (var m in ATmoduleList) {
        ATscriptLoad(modulepath, ATmoduleList[m]);
    }
    //
    debug('AutoTrimps v' + ATversion + ' Loaded!', '*spinner3');
}

var changelogList = [];
//changelogList.push({date: " ", version: " ", description: "", isNew: true});  //TEMPLATE
changelogList.push({date: "15/06/2018", version: "v2.2.5", description: "After much time labouring, I have finally been able to remove the text shadow from plagued to make it more readable. Oh, and something about multi prestige raiding too. All credits go to Pinoy and Speedball. ", isNew: true});
changelogList.push({date: "15/06/2018", version: "v2.2.4", description: "Ratios updated for 4.8. New z500 Ratio added, may need some fine tuning but it should work well. Multiple Prestige Raiding in works. BW Raiding now buys equipment up to your cap. Potency should now be bought correctly. ", isNew: true});
changelogList.push({date: "13/06/2018", version: "v2.2.3", description: "Plus maps for voids has been changed. It now works the same as Prestige raiding. Check tooltip for more details. Ratios will be out soon, including the new z500. ", isNew: false});
changelogList.push({date: "05/06/2018", version: "v2.2.2", description: "Fixed map at zone. Updated calcs. Praiding should work for everyone now. BW raiding still being tested, but should work. Ratios being tested, finding optimum coord and carp. Any bugs, please let me know, thanks. ", isNew: false});
changelogList.push({date: "05/06/2018", version: "v2.2.1", description: "Updated Heirloom calc, should be 4.8 ready. Ratios will be updated soon. ", isNew: false});
//changelogList.push({date: "28/05/2018", version: "v2.2", description: "Welcome to the Zek fork. Added single use prestige raiding, BW raiding, looting II dump, amals are now calcd properly. ", isNew: false});

function assembleChangelog(date,version,description,isNew) {
    return (isNew)
    ? (`<b class="AutoEggs">${date} ${version} </b><b style="background-color:#32CD32"> New:</b> ${description}<br>`)
    : (`<b>${date} ${version} </b> ${description}<br>`);
}
function printChangelog() {
    var body="";
    for (var i in changelogList) {
        var $item = changelogList[i];
        var result = assembleChangelog($item.date,$item.version,$item.description,$item.isNew);
        body+=result;
    };
    var footer =
        '<b>ZӘK Fork</b> - <u>Report any bugs/problems please</u>!\
        <br>Talk with the dev: <b>< ZӘK >#2509</b> @ <a target="#" href="https://discord.gg/0VbWe0dxB9kIfV2C">AutoTrimps Discord Channel</a>\
        <br>See <a target="#" href="https://github.com/spikenskab/AutoTrimps/blob/gh-pages/README.md">ReadMe</a> Or check <a target="#" href="https://github.com/spikenskab/AutoTrimps/commits/gh-pages" target="#">the commit history</a> (if you want).'
    ,   action = 'cancelTooltip()'
    ,   title = 'Script Update Notice<br>' + ATversion
    ,   acceptBtnText = "Thank you for playing AutoTrimps. Accept and Continue."
    ,   hideCancel = true;
    tooltip('confirm', null, 'update', body+footer, action, title, acceptBtnText, null, hideCancel);
}
function printLowerLevelPlayerNotice() {
    tooltip('confirm', null, 'update', 'The fact that it works at all is misleading new players into thinking its perfect. Its not. If your highest zone is under z60, you have not unlocked the stats required, and have not experienced the full meta with its various paradigm shifts. If you are just starting, my advice is to play along naturally and use AutoTrimps as a tool, not a crutch. Play with the settings as if it was the game, Dont expect to go unattended, if AT chooses wrong, and make the RIGHT choice yourself. Additionally, its not coded to run one-time challenges for you, only repeatable ones for helium. During this part of the game, content is king - automating literally removes the fun of the game. If you find that many flaws in the automation exist for you, level up. Keep in mind the challenge of maintaining the code is that it has to work for everyone. AT cant see the future and doesnt run simulations, it exists only in the present moment. Post any suggestions on how it can be better, or volunteer to adapt the code, or produce some sort of low-level player guide with what youve learned.<br>Happy scripting! -genBTC','cancelTooltip()', '<b>LowLevelPlayer Notes:</b><br><b>PSA: </b><u>AutoTrimps was not designed for new/low-level players.</u>', "I understand I am on my own and I Accept and Continue.", null, true);
}
////////////////////////////////////////
//Main DELAY Loop///////////////////////
////////////////////////////////////////

//Magic Numbers
var runInterval = 100;      //How often to loop through logic
var startupDelay = 2500;    //How long to wait for everything to load

//Start Loops
setTimeout(delayStart, startupDelay);
function delayStart() {
    initializeAutoTrimps();
    printChangelog();
    setTimeout(delayStartAgain, startupDelay);
}
function delayStartAgain(){
    if (game.achievements.zones.finished < 8)   //z60
        printLowerLevelPlayerNotice();
    //Set some game ars after we load.
    game.global.addonUser = true;
    game.global.autotrimps = true;
    //Actually Start mainLoop and guiLoop
    MODULESdefault = JSON.parse(JSON.stringify(MODULES));
    setInterval(mainLoop, runInterval);
    setInterval(guiLoop, runInterval*10);
    if (autoTrimpSettings.PrestigeBackup !== undefined && autoTrimpSettings.PrestigeBackup.selected != "")
        document.getElementById('Prestige').value = autoTrimpSettings.PrestigeBackup.selected;
    if (document.getElementById('Prestige').value === "")
        document.getElementById('Prestige').value = "Off";

}

////////////////////////////////////////
//Global Main vars /////////////////////
////////////////////////////////////////
////////////////////////////////////////
var ATrunning = true;   //status var
var ATmessageLogTabVisible = true;    //show an AutoTrimps tab after Story/Loot/Unlocks/Combat message Log Container
var enableDebug = true; //Spam console.log with debug info

var autoTrimpSettings = {};
var MODULES = {};
var MODULESdefault = {};
var ATMODULES = {};
var ATmoduleList = [];

var bestBuilding;
var scienceNeeded;
var breedFire = false;

var shouldFarm = false;
var enoughDamage = true;
var enoughHealth = true;

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
var needGymystic = true;    //used in setScienceNeeded, buildings.js, equipment.js
var heirloomFlag = false;
var heirloomCache = game.global.heirloomsExtra.length;
var magmiteSpenderChanged = false;

////////////////////////////////////////
//Main LOGIC Loop///////////////////////
////////////////////////////////////////
////////////////////////////////////////
function mainLoop() {
    if (ATrunning == false) return;
    if(getPageSetting('PauseScript') || game.options.menu.pauseGame.enabled || game.global.viewingUpgrades) return;
    ATrunning = true;
    if(game.options.menu.showFullBreed.enabled != 1) toggleSetting("showFullBreed");    //more detail
    addbreedTimerInsideText.innerHTML = ((game.jobs.Amalgamator.owned > 0) ? Math.floor((new Date().getTime() - game.global.lastSoldierSentAt) / 1000) : Math.floor(game.global.lastBreedTime / 1000)) + 's'; //add breed time for next army;
    addToolTipToArmyCount(); //Add hidden tooltip for army count (SettingsGUI.js @ end)
    //Heirloom:
    if (mainCleanup() // Z1 new world
            || portalWindowOpen // in the portal screen (for manual portallers)
            || (!heirloomsShown && heirloomFlag) // closed heirlooms screen
            || (heirloomCache != game.global.heirloomsExtra.length)) { // inventory size changed (a drop appeared)
            // also pre-portal: portal.js:111
        if (getPageSetting('AutoHeirlooms2')) autoHeirlooms2(); //"Auto Heirlooms 2" (heirlooms.js)
        else if (getPageSetting('AutoHeirlooms')) autoHeirlooms();//"Auto Heirlooms"      (")
        if (getPageSetting('AutoUpgradeHeirlooms') && !heirloomsShown) autoNull();  //"Auto Upgrade Heirlooms" (heirlooms.js)

        heirloomCache = game.global.heirloomsExtra.length;
    }
    heirloomFlag = heirloomsShown;
    //Stuff to do  Every new Zone
    if (aWholeNewWorld) {
        // Auto-close dialogues.
        switch (document.getElementById('tipTitle').innerHTML) {
            case 'The Improbability':   // Breaking the Planet
            case 'Corruption':          // Corruption / True Corruption
            case 'Spire':               // Spire
            case 'The Magma':           // Magma
                cancelTooltip();
        }
        if (getPageSetting('AutoEggs'))
            easterEggClicked();
        setTitle(); // Set the browser title
    }
    setScienceNeeded();  //determine how much science is needed

    //EXECUTE CORE LOGIC
    if (getPageSetting('ExitSpireCell') > 0) exitSpireCell(); //"Exit Spire After Cell" (other.js)
    //if (getPageSetting('loomprotect') == true) protectloom(); //"Exit Spire After Cell" (other.js)
    if (autoTrimpSettings.Praidingzone.value > 0) Praiding(); //Prestige Raiding (other.js)
    if (getPageSetting('BWraid')==true){setTimeout(BWraiding(), 3000);} //BW Raiding (other.js)
    if (getPageSetting('BWraid')==true && bwraidon) buyWeps();
    if (getPageSetting('VoidPraid')==true) Praidingvoid();
    if (getPageSetting('AutoAllocatePerks')==2) lootdump(); //Loot Dumping (other.js)
    if (getPageSetting('BuyUpgradesNew') != 0) buyUpgrades();    //"Buy Upgrades"       (upgrades.js)
    var agu = getPageSetting('AutoGoldenUpgrades');
    if (agu && agu!='Off') autoGoldenUpgradesAT(agu);    //"Golden Upgrades"     (other.js)
    if (getPageSetting('BuyBuildingsNew')===0);                                            //"Buy Neither"              (Buildings.js)
      else if (getPageSetting('BuyBuildingsNew')==1) { buyBuildings(); buyStorage(); }      //"Buy Buildings & Storage"  (")
      else if (getPageSetting('BuyBuildingsNew')==2) buyBuildings();                      //"Buy Buildings"            (")
      else if (getPageSetting('BuyBuildingsNew')==3) buyStorage();                        //"Buy Storage"              (")
    if (getPageSetting('BuyJobsNew')===0);                                               //"Don't Buy Jobs"           (Jobs.js)
      else if (getPageSetting('BuyJobsNew')==1) { workerRatios(); buyJobs(); }             //"Auto Worker Ratios"       (")
      else if (getPageSetting('BuyJobsNew')==2) buyJobs();                              //"Manual Worker Ratios"     (")
    if (getPageSetting('ManualGather2')<=1) manualLabor();  //"Auto Gather/Build"       (gather.js)
      else if (getPageSetting('ManualGather2')==2) manualLabor2();  //"Auto Gather/Build #2"  (")
    getPageSetting('AutoMaps') > 0 ? autoMap() : updateAutoMapsStatus(); //"Auto Maps"      (automaps.js)
    //if (getPageSetting('GeneticistTimer') >= 0) autoBreedTimer(); //"Geneticist Timer" / "Auto Breed Timer"     (autobreedtimer.js)
    if (autoTrimpSettings.AutoPortal.selected != "Off") autoPortal();   //"Auto Portal" (hidden until level 40) (portal.js)
    if (getPageSetting('TrapTrimps') && game.global.trapBuildAllowed && game.global.trapBuildToggled == false) toggleAutoTrap(); //"Trap Trimps"
    if (aWholeNewWorld && getPageSetting('AutoRoboTrimp')) autoRoboTrimp();   //"AutoRoboTrimp" (other.js)
    if (aWholeNewWorld && getPageSetting('FinishC2')>0 && game.global.runningChallengeSquared) finishChallengeSquared(); // "Finish Challenge2" (other.js)
    autoLevelEquipment();           //"Buy Armor", "Buy Armor Upgrades", "Buy Weapons", "Buy Weapons Upgrades"  (equipment.js)
    if (getPageSetting('UseScryerStance'))  useScryerStance();  //"Use Scryer Stance"   (scryer.js)
    else if (getPageSetting('AutoStance')<=1) autoStance();     //"Auto Stance"       (stance.js)
    else if (getPageSetting('AutoStance')==2) autoStance2();    //"Auto Stance #2"         (")
    else if (getPageSetting('AutoStance')==3) autoStance3();    //"Auto Stance #3"         (")
    if (getPageSetting('UseAutoGen')) autoGenerator();          //"Auto Generator ON" (magmite.js)
    if (getPageSetting('BetterAutoFight')==1) betterAutoFight();        //"Better Auto Fight" 
    if (getPageSetting('BetterAutoFight')==2) betterAutoFight2();     //"Better Auto Fight2" 
    if (getPageSetting('BetterAutoFight')==3) betterAutoFight3();     //"Better Auto Fight3"
    var forcePrecZ = (getPageSetting('ForcePresZ')<0) || (game.global.world<getPageSetting('ForcePresZ'));
    if (getPageSetting('DynamicPrestige2')>0 && forcePrecZ) prestigeChanging2(); //"Dynamic Prestige" (dynprestige.js)
    else autoTrimpSettings.Prestige.selected = document.getElementById('Prestige').value; //just make sure the UI setting and the internal setting are aligned.
    if (getPageSetting('AutoMagmiteSpender2')==2 && !magmiteSpenderChanged)  autoMagmiteSpender();   //Auto Magmite Spender (magmite.js)
    if (getPageSetting('AutoNatureTokens')) autoNatureTokens();     //Nature     (other.js)
  	if (game.global.mapsActive && getPageSetting('BWraid') == true && game.global.world == getPageSetting('BWraidingz') && getCurrentMapObject().level <= getPageSetting('BWraidingmax')) buyWeps();
    //
    //Runs any user provided scripts, see line 254 below
    if (userscriptOn) userscripts();
    //
    //rinse, repeat, done
    return;
}

//GUI Updates happen on this thread, every 1000ms
function guiLoop() {
    updateCustomButtons();
    //MODULESdefault = JSON.parse(JSON.stringify(MODULES));
    //Store the diff of our custom MODULES vars in the localStorage bin.
    safeSetItems('storedMODULES', JSON.stringify(compareModuleVars()));
    //Swiffy UI/Display tab
    if(getPageSetting('EnhanceGrids'))
        MODULES["fightinfo"].Update();
    if(typeof MODULES !== 'undefined' && typeof MODULES["performance"] !== 'undefined' && MODULES["performance"].isAFK)
        MODULES["performance"].UpdateAFKOverlay();
}

//reset stuff that may not have gotten cleaned up on portal
function mainCleanup() {
    lastrunworld = currentworld;
    currentworld = game.global.world;
    aWholeNewWorld = lastrunworld != currentworld;
    //run once per portal:
    if (currentworld == 1 && aWholeNewWorld) {
        lastHeliumZone = 0;
        zonePostpone = 0;
        //for the dummies like me who always forget to turn automaps back on after portaling
        if(getPageSetting('AutoMaps')==1 && !game.upgrades.Battle.done && getPageSetting('AutoMaps') == 0)
            settingChanged("AutoMaps");
        return true; // Do other things
    }
}

// Userscript loader. write your own!
//Copy and paste this function named userscripts() into the JS Dev console. (F12)
var userscriptOn = true;    //controls the looping of userscripts and can be self-disabled
var globalvar0,globalvar1,globalvar2,globalvar3,globalvar4,globalvar5,globalvar6,globalvar7,globalvar8,globalvar9;
//left blank intentionally. the user will provide this. blank global vars are included as an example
function userscripts()
{
    //insert code here:
}

//test.
function throwErrorfromMain() {
    throw new Error("We have successfully read the thrown error message out of the main file");
}
