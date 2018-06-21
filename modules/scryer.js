//MODULES["scryer"] = {};

var wantToScry = false;
//use S stance
function useScryerStance() {
  var AutoStance = getPageSetting('AutoStance');
    function autostancefunction() {
        if (AutoStance<=1) autoStance();    //"Auto Stance"
        else if (AutoStance==2) autoStance2();
        else if (AutoStance==3) autoStance3();   //"Auto Stance #3"
    };

    //check NEVER & Prerequisites (This overrides overkill settings)
    var use_auto = game.global.preMapsActive || game.global.gridArray.length === 0 || game.global.highestLevelCleared < 180;
    //check scryer is unlocked
    use_auto = use_auto || game.global.world <= 60;
    //check map NEVER
    use_auto = use_auto || game.global.mapsActive && getPageSetting('ScryerUseinMaps2') == 0;
    //check void map NEVER
    use_auto = use_auto || game.global.mapsActive && getCurrentMapObject().location == "Void" && getPageSetting('ScryerUseinVoidMaps2') == 0;
    //check spire NEVER
    use_auto = use_auto || !game.global.mapsActive && isActiveSpireAT() && getPageSetting('ScryerUseinSpire2') == 0;
    //check Boss NEVERs
    use_auto = use_auto || (getPageSetting('ScryerSkipBoss2') == 1 && game.global.world > getPageSetting('VoidMaps') && game.global.lastClearedCell == 98) || (getPageSetting('ScryerSkipBoss2') == 2 && game.global.lastClearedCell == 98);
    //check Corrupted Never
    var curEnemy = getCurrentEnemy(1);
    var iscorrupt = curEnemy && (curEnemy.mutation == "Corruption" || curEnemy.mutation == "Healthy");
    iscorrupt = iscorrupt || (game.global.mapsActive && mutations.Magma.active());
    iscorrupt = iscorrupt || (game.global.mapsActive && getCurrentMapObject().location == "Void" && game.global.world >= mutations.Corruption.start());
    if ((iscorrupt && getPageSetting('ScryerSkipCorrupteds2') == 0 || (use_auto))) {
        autostancefunction();
        wantToScry = false;
        return;
    }

    //check Force (This overrides overkill settings)
    //check map Force
    var use_scryer = use_scryer || (game.global.mapsActive && getPageSetting('ScryerUseinMaps2') == 1);
    //check void map Force
    use_scryer = use_scryer || (game.global.mapsActive && getCurrentMapObject().location == "Void" && getPageSetting('ScryerUseinVoidMaps2') == 1);
    //check spire Force
    use_scryer = use_scryer || (!game.global.mapsActive && isActiveSpireAT() && getPageSetting('ScryerUseinSpire2') == 1);
    //check Corrupted Force
    if ((iscorrupt && getPageSetting('ScryerSkipCorrupteds2') == 1) || (use_scryer)) {
        setFormation(4);
        wantToScry = true;
        return;
    }


//If neither NEVER or FORCE, move on to assessing whether to MAYBE
//First, calculate damage
    if (AutoStance<=1)
        calcBaseDamageinX(); //calculate internal script variables normally processed by autostance.
    else if (AutoStance>=2)
        calcBaseDamageinX2(); //calculate method #2
//Decide whether it is oktoswitch (Suicide)
    var missingHealth = game.global.soldierHealthMax - game.global.soldierHealth;
    var newSquadRdy = game.resources.trimps.realMax() <= game.resources.trimps.owned + 1;
    var form = game.global.formation;
    var oktoswitch = true;
    var die = (getPageSetting('ScryerDieZ') != -1 && getPageSetting('ScryerDieZ') <= game.global.world) ;
    const willSuicide = getPageSetting('ScryerDieZ');
    if (die && willSuicide >= 0) {
        var [dieZ, dieC] = willSuicide.toString().split(".");
        if (dieC && dieC.length == 1) dieC = dieC + "0";
        die = game.global.world >= dieZ && (!dieC || (game.global.lastClearedCell + 1 >= dieC));
    }
    if (form == 0 || form == 1)
        oktoswitch = die || newSquadRdy || (missingHealth < (baseHealth / 2)); //switch if DieToUse / a new squad is ready / or trimp\'s missing health is less than half of base health

//Decide whether Overkill is possible
    var useoverkill = getPageSetting('ScryerUseWhenOverkill');
    //If Overkill isn't unlocked, toggle overkill use off!
    if (useoverkill && game.portal.Overkill.level == 0)
        setPageSetting('ScryerUseWhenOverkill', false);
    //If Spire is set to never and is active, don't use overkill setting. //redundant now??
    if (useoverkill && !game.global.mapsActive && isActiveSpireAT() && getPageSetting('ScryerUseinSpire2')==0)
      useoverkill = false;
    //Overkill button being on and being able to overkill in S will override any setting other than never spire & nature zone, regardless.
    if (useoverkill && game.portal.Overkill.level > 0) {
        var avgDamage = (baseDamage * (1-getPlayerCritChance()) + (baseDamage * getPlayerCritChance() * getPlayerCritDamageMult()));
        var Sstance = 0.5;
        var ovkldmg = avgDamage * Sstance * (game.portal.Overkill.level*0.005);
        //are we going to overkill in S?
        var ovklHDratio = getCurrentEnemy(1).maxHealth / ovkldmg;
        if (ovklHDratio < 8) {
            if (oktoswitch)
                setFormation(4);
            return;
        }
    }

//Default. (All Never and Always are accounted for, Overkill has decided whether to run, leaving solely what zones you want to run S in even when you can't overkill)
    var min_zone = getPageSetting('ScryerMinZone');
    var max_zone = getPageSetting('ScryerMaxZone');
    var valid_nature = ((getEmpowerment() == "Poison" && (game.global.world >= getPageSetting('ScryUseinPoison')) && 0 <= getPageSetting('ScryUseinPoison'))
      || (getEmpowerment() == "Wind" && (game.global.world >= getPageSetting('ScryUseinWind')) && 0 <= getPageSetting('ScryUseinWind'))
      || (getEmpowerment() == "Ice" &&(game.global.world >= getPageSetting('ScryUseinIce')) && 0 <= getPageSetting('ScryUseinIce')));
    var valid_min = game.global.world >= min_zone;
    var valid_max = max_zone <= 0 || game.global.world < max_zone;

    // This allows ScryInX nature settings to override min scrying zone but not max scrying zone settings
    // if ((valid_min || valid_nature) && valid_max) {
    // This allows ScryInX nature settings to override both min and max scrying zone settings
    if ((valid_min && valid_max) || valid_nature) {
        if (oktoswitch)
            setFormation(4);
        wantToScry = true;
    } else {
        autostancefunction();
        wantToScry = false;
        return;
    }
}
