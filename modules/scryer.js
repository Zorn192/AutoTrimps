var wantToScry = false;
function useScryerStance() {
var scry = 4;
if (game.global.uberNature == "Wind" && getEmpowerment() == "Wind" && calcHDratio() < 16 && !game.global.mapsActive && (
	(game.global.challengeActive != "Daily" && game.global.world >= getPageSetting('WindStackingMin')) ||
        (game.global.challengeActive == "Daily" && game.global.world >= getPageSetting('dWindStackingMin')))) {
    scry = 5;
}
  
  var AutoStance = getPageSetting('AutoStance');
  function autostancefunction() {
        if ((getPageSetting('AutoStance') == 3) || (getPageSetting('use3daily') == true && game.global.challengeActive == "Daily")) windStance();
        else if (AutoStance==1) autoStance();
        else if (AutoStance==2) autoStance2();

    }

//Never
var never_scry = game.global.preMapsActive || game.global.gridArray.length === 0 || game.global.highestLevelCleared < 180;
    never_scry = never_scry || game.global.world <= 60;
    never_scry = never_scry || (getPageSetting('UseScryerStance') == true && game.global.mapsActive && getPageSetting('ScryerUseinMaps2') == 0 && getCurrentMapObject().location != "Void" && getCurrentMapObject().location != "Bionic" && getCurrentMapObject().level <= game.global.world);
    never_scry = never_scry || (getPageSetting('UseScryerStance') == true && game.global.mapsActive && getPageSetting('ScryerUseinPMaps') == 0 && getCurrentMapObject().level > game.global.world && getCurrentMapObject().location != "Void" && getCurrentMapObject().location != "Bionic");
    never_scry = never_scry || (getPageSetting('UseScryerStance') == true && game.global.mapsActive && getCurrentMapObject().location == "Void" && getPageSetting('ScryerUseinVoidMaps2') == 0);
    never_scry = never_scry || (getPageSetting('UseScryerStance') == true && game.global.mapsActive && getCurrentMapObject().location == "Bionic" && getPageSetting('ScryerUseinBW') == 0);
    never_scry = never_scry || (getPageSetting('UseScryerStance') == true && !game.global.mapsActive && (isActiveSpireAT() || disActiveSpireAT()) && getPageSetting('ScryerUseinSpire2') == 0);
    never_scry = never_scry || (getPageSetting('UseScryerStance') == true && !game.global.mapsActive && getPageSetting('ScryerSkipBoss2') == 1 && game.global.world < getPageSetting('VoidMaps') && game.global.lastClearedCell == 98) || (getPageSetting('ScryerSkipBoss2') == 0 && game.global.lastClearedCell == 98);
    never_scry = never_scry || (getPageSetting('UseScryerStance') == true && !game.global.mapsActive && (getEmpowerment() == "Poison" && (getPageSetting('ScryUseinPoison') == 0 || (getPageSetting('ScryUseinPoison') > 0 && game.global.world >= getPageSetting('ScryUseinPoison')))) || (getEmpowerment() == "Wind" && (getPageSetting('ScryUseinWind') == 0 || (getPageSetting('ScryUseinWind') > 0 && game.global.world >= getPageSetting('ScryUseinWind')))) || (getEmpowerment() == "Ice" && (getPageSetting('ScryUseinIce') == 0 || (getPageSetting('ScryUseinIce') > 0 && game.global.world >= getPageSetting('ScryUseinIce')))));
    never_scry = never_scry || (getPageSetting('UseScryerStance') == true && !game.global.mapsActive && getPageSetting('screwessence') == true && countRemainingEssenceDrops() < 1);

    //check Corrupted Never
    var curEnemy = getCurrentEnemy(1);
    var iscorrupt = curEnemy && curEnemy.mutation == "Corruption";
    if (((never_scry) || getPageSetting('UseScryerStance') == true && !game.global.mapsActive && (iscorrupt && getPageSetting('ScryerSkipCorrupteds2') == 0))) {
        autostancefunction();
        wantToScry = false;
        return;
    }
    //check Healthy never
    var curEnemyhealth = getCurrentEnemy(1);
    var ishealthy = curEnemyhealth && curEnemyhealth.mutation == "Healthy";
    if (((never_scry) || getPageSetting('UseScryerStance') == true && !game.global.mapsActive && (ishealthy && getPageSetting('ScryerSkipHealthy') == 0))) {
        autostancefunction();
        wantToScry = false;
        return;
    }

//Force
var use_scryer = use_scryer || (getPageSetting('UseScryerStance') == true && game.global.mapsActive && getPageSetting('ScryerUseinMaps2') == 1);
    use_scryer = use_scryer || (game.global.mapsActive && getCurrentMapObject().location == "Void" && ((getPageSetting('ScryerUseinVoidMaps2') == 1) || (getPageSetting('scryvoidmaps') == true && game.global.challengeActive != "Daily") || (getPageSetting('dscryvoidmaps')== true && game.global.challengeActive == "Daily")));
    use_scryer = use_scryer || (game.global.mapsActive && getCurrentMapObject().location == "Bionic" && getPageSetting('ScryerUseinBW') == 1);
    use_scryer = use_scryer || (game.global.mapsActive && getCurrentMapObject().level > game.global.world && getPageSetting('ScryerUseinPMaps') == 1 && getCurrentMapObject().location != "Bionic");
    use_scryer = use_scryer || (!game.global.mapsActive && getPageSetting('UseScryerStance') == true && (isActiveSpireAT() || disActiveSpireAT()) && getPageSetting('ScryerUseinSpire2') == 1);
    use_scryer = use_scryer || (!game.global.mapsActive && getPageSetting('UseScryerStance') == true && ((getEmpowerment() == "Poison" && getPageSetting('ScryUseinPoison') > 0 && game.global.world < getPageSetting('ScryUseinPoison')) || (getEmpowerment() == "Wind" && getPageSetting('ScryUseinWind') > 0 && game.global.world < getPageSetting('ScryUseinWind')) || (getEmpowerment() == "Ice" && getPageSetting('ScryUseinIce') > 0 && game.global.world < getPageSetting('ScryUseinIce'))));

    //check Corrupted Force
    if ((iscorrupt && getPageSetting('ScryerSkipCorrupteds2') == 1 && getPageSetting('UseScryerStance') == true) || (use_scryer)) {
        setFormation(scry);
        wantToScry = true;
        return;
    }
    //check healthy force
    if ((ishealthy && getPageSetting('ScryerSkipHealthy') == 1 && getPageSetting('UseScryerStance') == true) || (use_scryer)) {
        setFormation(scry);
        wantToScry = true;
        return;
    }

//Calc Damage
if (AutoStance==1)
    calcBaseDamageinX();
else if (AutoStance>=2)
    calcBaseDamageinX2();

//Suicide to Scry
var missingHealth = game.global.soldierHealthMax - game.global.soldierHealth;
var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
var oktoswitch = true;
var die = (getPageSetting('ScryerDieZ') != -1 && getPageSetting('ScryerDieZ') <= game.global.world) ;
var willSuicide = getPageSetting('ScryerDieZ');
    if (die && willSuicide >= 0) {
        var [dieZ, dieC] = willSuicide.toString().split(".");
        if (dieC && dieC.length == 1) dieC = dieC + "0";
        die = game.global.world >= dieZ && (!dieC || (game.global.lastClearedCell + 1 >= dieC));
    }
    if (game.global.formation == 0 || game.global.formation == 1)
        oktoswitch = die || newSquadRdy || (missingHealth < (baseHealth / 2));

//Overkill
var useoverkill = getPageSetting('ScryerUseWhenOverkill');
if (useoverkill && game.portal.Overkill.level == 0)
    setPageSetting('ScryerUseWhenOverkill', false);
if (useoverkill && !game.global.mapsActive && (isActiveSpireAT() || disActiveSpireAT()) && getPageSetting('ScryerUseinSpire2')==0)
    useoverkill = false;
if (useoverkill && game.portal.Overkill.level > 0 && getPageSetting('UseScryerStance') == true) {
    var minDamage = calcOurDmg("min",false,true);
    var Sstance = 0.5;
    var ovkldmg = minDamage * Sstance * (game.portal.Overkill.level*0.005);
    var ovklHDratio = getCurrentEnemy(1).maxHealth / ovkldmg;
    if (ovklHDratio < 2) {
        if (oktoswitch)
            setFormation(scry);
            return;
        }
    }

//Default
var min_zone = getPageSetting('ScryerMinZone');
var max_zone = getPageSetting('ScryerMaxZone');
var valid_min = game.global.world >= min_zone && game.global.world > 60;
var valid_max = max_zone <= 0 || game.global.world < max_zone;

if (getPageSetting('UseScryerStance') == true && valid_min && valid_max && !(getPageSetting('onlyminmaxworld') == true && game.global.mapsActive)) {
    if (oktoswitch) {
        setFormation(scry);
        wantToScry = true;
        return;
    }
} 
else {
    autostancefunction();
    wantToScry = false;
    return;
    }
}
