MODULES["jobs"] = {};

//Helium

MODULES["jobs"].scientistRatio = 25;
MODULES["jobs"].scientistRatio2 = 10;
MODULES["jobs"].scientistRatio3 = 100;
MODULES["jobs"].magmamancerRatio = 0.1;
//Worker Ratios = [Farmer,Lumber,Miner]
MODULES["jobs"].autoRatio7 = [1, 1, 98];
MODULES["jobs"].autoRatio6 = [1, 7, 12];
MODULES["jobs"].autoRatio5 = [1, 2, 22];
MODULES["jobs"].autoRatio4 = [1, 1.1, 10];
MODULES["jobs"].autoRatio3 = [3, 1, 4];
MODULES["jobs"].autoRatio2 = [3, 3.1, 5];
MODULES["jobs"].autoRatio1 = [1.1, 1.15, 1.2];
MODULES["jobs"].customRatio;

function safeBuyJob(jobTitle, amount) {
    if (!Number.isFinite(amount) || amount === 0 || typeof amount === 'undefined' || Number.isNaN(amount)) {
        return false;
    }
    var old = preBuy2();
    var freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    var result;
    if (amount < 0) {
        amount = Math.abs(amount);
        game.global.firing = true;
        game.global.buyAmt = amount;
        result = true;
    } else {
        game.global.firing = false;
        game.global.buyAmt = amount;
        result = canAffordJob(jobTitle, false) && freeWorkers > 0;
        if (!result) {
            game.global.buyAmt = 'Max';
            game.global.maxSplit = 1;
            result = canAffordJob(jobTitle, false) && freeWorkers > 0;
        }
    }
    if (result) {
        debug((game.global.firing ? 'Firing ' : 'Hiring ') + prettify(game.global.buyAmt) + ' ' + jobTitle + 's', "jobs", "*users");
        buyJob(jobTitle, true, true);
    }
    postBuy2(old);
    return true;
}

function safeFireJob(job, amount) {
    var oldjob = game.jobs[job].owned;
    if (oldjob == 0 || amount == 0)
        return 0;
    var test = oldjob;
    var x = 1;
    if (amount != null)
        x = amount;
    if (!Number.isFinite(oldjob)) {
        while (oldjob == test) {
            test -= x;
            x *= 2;
        }
    }
    var old = preBuy2();
    game.global.firing = true;
    var freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    while (x >= 1 && freeWorkers == Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed) {
        game.global.buyAmt = x;
        buyJob(job, true, true);
        x *= 2;
    }
    postBuy2(old);
    return x / 2;
}

function buyJobs() {
    var freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    var breeding = (game.resources.trimps.owned - game.resources.trimps.employed);
    var totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
    var farmerRatio = parseFloat(getPageSetting('FarmerRatio'));
    var lumberjackRatio = parseFloat(getPageSetting('LumberjackRatio'));
    var minerRatio = parseFloat(getPageSetting('MinerRatio'));
    var totalRatio = farmerRatio + lumberjackRatio + minerRatio;
    var scientistRatio = totalRatio / MODULES["jobs"].scientistRatio;
    if (game.jobs.Farmer.owned < 100) {
        scientistRatio = totalRatio / MODULES["jobs"].scientistRatio2;
    }
    if (game.global.world >= 300) {
        scientistRatio = totalRatio / MODULES["jobs"].scientistRatio3;
    }

    if (game.global.world == 1 && game.global.totalHeliumEarned <= 5000) {
        if (game.resources.trimps.owned < game.resources.trimps.realMax() * 0.9) {
            if (game.resources.food.owned > 5 && freeWorkers > 0) {
                if (game.jobs.Farmer.owned == game.jobs.Lumberjack.owned)
                    safeBuyJob('Farmer', 1);
                else if (game.jobs.Farmer.owned > game.jobs.Lumberjack.owned && !game.jobs.Lumberjack.locked)
                    safeBuyJob('Lumberjack', 1);
            }
            freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
            if (game.resources.food.owned > 20 && freeWorkers > 0) {
                if (game.jobs.Farmer.owned == game.jobs.Lumberjack.owned && !game.jobs.Miner.locked)
                    safeBuyJob('Miner', 1);
            }
        }
        return;
    } else if (game.jobs.Farmer.owned == 0 && game.jobs.Lumberjack.locked && freeWorkers > 0) {
        safeBuyJob('Farmer', 1);
    } else if (getPageSetting('MaxScientists') != 0 && game.jobs.Scientist.owned < 10 && scienceNeeded > 100 && freeWorkers > 0 && game.jobs.Farmer.owned >= 10) {
        safeBuyJob('Scientist', 1);
    }
    freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
    if (game.global.challengeActive == 'Watch') {
        scientistRatio = totalRatio / MODULES["jobs"].scientistRatio2;
        if (game.resources.trimps.owned < game.resources.trimps.realMax() * 0.9 && !breedFire) {
            var buyScientists = Math.floor((scientistRatio / totalRatio * totalDistributableWorkers) - game.jobs.Scientist.owned);
            if (game.jobs.Scientist.owned < buyScientists && game.resources.trimps.owned > game.resources.trimps.realMax() * 0.1) {
                var toBuy = buyScientists - game.jobs.Scientist.owned;
                var canBuy = Math.floor(game.resources.trimps.owned - game.resources.trimps.employed);
                if ((buyScientists > 0 && freeWorkers > 0) && (getPageSetting('MaxScientists') > game.jobs.Scientist.owned || getPageSetting('MaxScientists') == -1))
                    safeBuyJob('Scientist', toBuy <= canBuy ? toBuy : canBuy);
            } else
                return;
        }
    } else {
        var breeding = (game.resources.trimps.owned - game.resources.trimps.employed);
        if (!(game.global.challengeActive == "Trapper") && game.resources.trimps.owned < game.resources.trimps.realMax() * 0.9 && !breedFire) {
            if (breeding > game.resources.trimps.realMax() * 0.33) {
                freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
                if (freeWorkers > 0 && game.resources.trimps.realMax() <= 3e5) {
                    safeBuyJob('Miner', 1);
                    safeBuyJob('Farmer', 1);
                    safeBuyJob('Lumberjack', 1);
                }
            }
            return;
        }
    }
    var subtract = 0;

    function checkFireandHire(job, amount) {
        freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
        if (amount == null)
            amount = 1;
        if (canAffordJob(job, false, amount) && !game.jobs[job].locked) {
            if (freeWorkers < amount)
                subtract = safeFireJob('Farmer');
            safeBuyJob(job, amount);
        }
    }
    freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
    var ms = getPageSetting('MaxScientists');
    if (ms != 0 && !game.jobs.Scientist.locked && !breedFire) {
        var buyScientists = Math.floor((scientistRatio / totalRatio) * totalDistributableWorkers) - game.jobs.Scientist.owned - subtract;
        var sci = game.jobs.Scientist.owned;
        if ((buyScientists > 0 && freeWorkers > 0) && (ms > sci || ms == -1)) {
            var n = ms - sci;
            if (ms == -1)
                n = buyScientists;
            else if (n < 0)
                n = 0;
            if (buyScientists > n)
                buyScientists = n;
            safeBuyJob('Scientist', buyScientists);
        }
    }
    if (getPageSetting('MaxTrainers') > game.jobs.Trainer.owned || getPageSetting('MaxTrainers') == -1) {
        if (!game.buildings.Tribute.locked) {
            var curtrainercost = game.jobs.Trainer.cost.food[0] * Math.pow(game.jobs.Trainer.cost.food[1], game.jobs.Trainer.owned);
            var curtributecost = getBuildingItemPrice(game.buildings.Tribute, "food", false, 1) * Math.pow(1 - game.portal.Resourceful.modifier, game.portal.Resourceful.level);
            if (curtrainercost < curtributecost)
                checkFireandHire('Trainer');
        } else
            checkFireandHire('Trainer');
    }
    if (getPageSetting('MaxExplorers') > game.jobs.Explorer.owned || getPageSetting('MaxExplorers') == -1) {
        checkFireandHire('Explorer');
    }

    function ratiobuy(job, jobratio) {
        if (!game.jobs[job].locked && !breedFire) {
            freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
            totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
            var toBuy = Math.floor((jobratio / totalRatio) * totalDistributableWorkers) - game.jobs[job].owned - subtract;
            var canBuy = Math.floor(game.resources.trimps.owned - game.resources.trimps.employed);
            var amount = toBuy <= canBuy ? toBuy : canBuy;
            if (amount != 0) {
                safeBuyJob(job, amount);
            }
            return true;
        } else
            return false;
    }
    ratiobuy('Farmer', farmerRatio);
    if (!ratiobuy('Miner', minerRatio) && breedFire && game.global.turkimpTimer === 0)
        safeBuyJob('Miner', game.jobs.Miner.owned * -1);
    if (!ratiobuy('Lumberjack', lumberjackRatio) && breedFire)
        safeBuyJob('Lumberjack', game.jobs.Lumberjack.owned * -1);

    if (game.jobs.Magmamancer.locked) return;
    var timeOnZone = Math.floor((new Date().getTime() - game.global.zoneStarted) / 60000);
    if (game.talents.magmamancer.purchased) {
        timeOnZone += 5;
    }
    if (game.talents.stillMagmamancer.purchased){
		timeOnZone = Math.floor(timeOnZone + game.global.spireRows);
    }
    var stacks2 = Math.floor(timeOnZone / 10);
    if (getPageSetting('AutoMagmamancers') && stacks2 > tierMagmamancers) {
        var old = preBuy2();
        game.global.firing = false;
        game.global.buyAmt = 'Max';
        game.global.maxSplit = MODULES["jobs"].magmamancerRatio; // (10%)
        var firesomedudes = calculateMaxAfford(game.jobs['Magmamancer'], false, false, true);
        var inverse = (1 / MODULES["jobs"].magmamancerRatio);
        firesomedudes *= inverse;
        if (game.jobs.Farmer.owned > firesomedudes)
            safeFireJob('Farmer', firesomedudes);
        else if (game.jobs.Lumberjack.owned > firesomedudes)
            safeFireJob('Lumberjack', firesomedudes);
        else if (game.jobs.Miner.owned > firesomedudes)
            safeFireJob('Miner', firesomedudes);
        game.global.firing = false;
        game.global.buyAmt = 'Max';
        game.global.maxSplit = MODULES["jobs"].magmamancerRatio;
        buyJob('Magmamancer', true, true);
        postBuy2(old);
        debug("Bought " + (firesomedudes / inverse) + ' Magmamancers. Total Owned: ' + game.jobs['Magmamancer'].owned, "magmite", "*users");
        tierMagmamancers += 1;
    } else if (stacks2 < tierMagmamancers) {
        tierMagmamancers = 0;
    }

    if ((game.resources.trimps.owned - game.resources.trimps.employed) < 2) {
        var a = (game.jobs.Farmer.owned > 2);
        if (a)
            safeFireJob('Farmer', 2);
        var b = (game.jobs.Lumberjack.owned > 2);
        if (b)
            safeFireJob('Lumberjack', 2);
        var c = (game.jobs.Miner.owned > 2);
        if (c)
            safeFireJob('Miner', 2);
        if (a || b || c)
            debug("Job Protection Triggered, Number Rounding Error: [f,l,m]= " + a + " " + b + " " + c, "other");
    }
}
var tierMagmamancers = 0;


function workerRatios() {
    var ratioSet;
    if (MODULES["jobs"].customRatio) {
        ratioSet = MODULES["jobs"].customRatio;
    } else if (game.global.world >= 300) {
        ratioSet = MODULES["jobs"].autoRatio7;
    } else if (game.buildings.Tribute.owned > 3000 && mutations.Magma.active()) {
        ratioSet = MODULES["jobs"].autoRatio6;
    } else if (game.buildings.Tribute.owned > 1500) {
        ratioSet = MODULES["jobs"].autoRatio5;
    } else if (game.buildings.Tribute.owned > 1000) {
        ratioSet = MODULES["jobs"].autoRatio4;
    } else if (game.resources.trimps.realMax() > 3000000) {
        ratioSet = MODULES["jobs"].autoRatio3;
    } else if (game.resources.trimps.realMax() > 300000) {
        ratioSet = MODULES["jobs"].autoRatio2;
    } else {
        ratioSet = MODULES["jobs"].autoRatio1;
    }
    if (game.global.challengeActive == 'Watch') {
        ratioSet = MODULES["jobs"].autoRatio1;
    } else if (game.global.challengeActive == 'Metal') {
        ratioSet = [4, 5, 0];
    }
    setPageSetting('FarmerRatio', ratioSet[0]);
    setPageSetting('LumberjackRatio', ratioSet[1]);
    setPageSetting('MinerRatio', ratioSet[2]);
}

//Radon

MODULES["jobs"].RscientistRatio = 8;
MODULES["jobs"].RscientistRatio2 = 4;
MODULES["jobs"].RscientistRatio3 = 16;
MODULES["jobs"].RscientistRatio4 = 64;
//Worker Ratios = [Farmer,Lumber,Miner]
MODULES["jobs"].RautoRatio7 = [1, 1, 98];
MODULES["jobs"].RautoRatio6 = [1, 7, 12];
MODULES["jobs"].RautoRatio5 = [1, 2, 22];
MODULES["jobs"].RautoRatio4 = [1, 1.1, 10];
MODULES["jobs"].RautoRatio3 = [3, 1, 4];
MODULES["jobs"].RautoRatio2 = [3, 3.1, 5];
MODULES["jobs"].RautoRatio1 = [1.1, 1.15, 1.2];
MODULES["jobs"].RcustomRatio;

function RsafeBuyJob(jobTitle, amount) {
    if (!Number.isFinite(amount) || amount === 0 || typeof amount === 'undefined' || Number.isNaN(amount)) {
        return false;
    }
    var old = preBuy2();
    var freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    var result;
    if (amount < 0) {
        amount = Math.abs(amount);
        game.global.firing = true;
        game.global.buyAmt = amount;
        result = true;
    } else {
        game.global.firing = false;
        game.global.buyAmt = amount;
        result = canAffordJob(jobTitle, false) && freeWorkers > 0;
        if (!result) {
            game.global.buyAmt = 'Max';
            game.global.maxSplit = 1;
            result = canAffordJob(jobTitle, false) && freeWorkers > 0;
        }
    }
    if (result) {
        debug((game.global.firing ? 'Firing ' : 'Hiring ') + prettify(game.global.buyAmt) + ' ' + jobTitle + 's', "jobs", "*users");
        buyJob(jobTitle, true, true);
    }
    postBuy2(old);
    return true;
}

function RsafeFireJob(job, amount) {
    var oldjob = game.jobs[job].owned;
    if (oldjob == 0 || amount == 0)
        return 0;
    var test = oldjob;
    var x = 1;
    if (amount != null)
        x = amount;
    if (!Number.isFinite(oldjob)) {
        while (oldjob == test) {
            test -= x;
            x *= 2;
        }
    }
    var old = preBuy2();
    game.global.firing = true;
    var freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    while (x >= 1 && freeWorkers == Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed) {
        game.global.buyAmt = x;
        buyJob(job, true, true);
        x *= 2;
    }
    postBuy2(old);
    return x / 2;
}

function RworkerRatios() {
    var ratioSet;
    if (MODULES["jobs"].RcustomRatio) {
        ratioSet = MODULES["jobs"].RcustomRatio;
    } else if (game.global.world >= 300) {
        ratioSet = MODULES["jobs"].RautoRatio7;
    } else if (game.buildings.Tribute.owned > 3000 && mutations.Magma.active()) {
        ratioSet = MODULES["jobs"].RautoRatio6;
    } else if (game.buildings.Tribute.owned > 1500) {
        ratioSet = MODULES["jobs"].RautoRatio5;
    } else if (game.buildings.Tribute.owned > 1000) {
        ratioSet = MODULES["jobs"].RautoRatio4;
    } else if (game.resources.trimps.realMax() > 3000000) {
        ratioSet = MODULES["jobs"].RautoRatio3;
    } else if (game.resources.trimps.realMax() > 300000) {
        ratioSet = MODULES["jobs"].RautoRatio2;
    } else if (game.global.challengeActive == 'Transmute') {
        ratioSet = [4, 5, 0];
    } else {
        ratioSet = MODULES["jobs"].RautoRatio1;
    }
    setPageSetting('RFarmerRatio', ratioSet[0]);
    setPageSetting('RLumberjackRatio', ratioSet[1]);
    setPageSetting('RMinerRatio', ratioSet[2]);
}

function RquestbuyJobs() {
	
    var freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    var totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;

    var farmerRatio = 0;
    var lumberjackRatio = 0;
    var minerRatio = 0;
    var scientistNumber = (totalDistributableWorkers * 0.00001);
    if (scientistNumber <= 0) {
	scientistNumber = 1;
    }
	
    if (game.global.world > 5) {
	if (questcheck() == 7 && !canAffordBuilding('Smithy')) {
	    farmerRatio = 10;
	    lumberjackRatio = 10;
	    minerRatio = 10;
	}
	if (questcheck() == 10 || questcheck() == 20) {
            farmerRatio = 10;
        }
        if (questcheck() == 11 || questcheck() == 21) {
            lumberjackRatio = 10;
        }
        if (questcheck() == 12 || questcheck() == 22) {
            minerRatio = 10;
        }
	if (questcheck() == 14 || questcheck() == 24) {
	    scientistNumber = (totalDistributableWorkers * 0.5);
	}
    }

    freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
	
    if (scientistNumber > (totalDistributableWorkers * 0.00001) && !game.jobs.Scientist.locked) {
        if (freeWorkers > 0 && scientistNumber > game.jobs.Scientist.owned) {
            var n = scientistNumber - game.jobs.Scientist.owned;
            RsafeBuyJob('Scientist', n);
        }
    }
    else if (game.jobs.Scientist.owned > scientistNumber && !game.jobs.Scientist.locked) {
	var n = game.jobs.Scientist.owned - scientistNumber;
	RsafeFireJob('Scientist', n);
    }
	
    if (getPageSetting('RMaxExplorers') > game.jobs.Explorer.owned || getPageSetting('RMaxExplorers') == -1) {
        RsafeBuyJob("Explorer", 1);
    }
	
    freeWorkers = Math.ceil(game.resources.trimps.realMax() / 2) - game.resources.trimps.employed;
    totalDistributableWorkers = freeWorkers + game.jobs.Farmer.owned + game.jobs.Miner.owned + game.jobs.Lumberjack.owned;
	
    var farmerkeep = totalDistributableWorkers * 0.01;
    if (farmerkeep < 1) {
	farmerkeep = 100;
	if (totalDistributableWorkers <= 100) {
	    farmerkeep = 1;
	}
    }

    totalDistributableWorkers = totalDistributableWorkers - farmerkeep;
	
    if (farmerRatio > 0 && lumberjackRatio <= 0 && minerRatio <= 0) {
	RsafeFireJob('Lumberjack', game.jobs.Lumberjack.owned);
	RsafeFireJob('Miner', game.jobs.Miner.owned);
	RsafeBuyJob('Farmer', totalDistributableWorkers);
    }
	
    else if (lumberjackRatio > 0 && farmerRatio <= 0 && minerRatio <= 0) {
	RsafeFireJob('Farmer', game.jobs.Farmer.owned - farmerkeep);
	RsafeFireJob('Miner', game.jobs.Miner.owned);
	RsafeBuyJob('Lumberjack', totalDistributableWorkers);
    }
	
    else if (minerRatio > 0 && farmerRatio <= 0 && lumberjackRatio <= 0) {
	RsafeFireJob('Farmer', game.jobs.Farmer.owned - farmerkeep);
	RsafeFireJob('Lumberjack', game.jobs.Lumberjack.owned);
	RsafeBuyJob('Miner', totalDistributableWorkers);
    }

    else if (farmerRatio <= 0 && lumberjackRatio <= 0 && minerRatio <= 0) {
	RsafeFireJob('Farmer', game.jobs.Farmer.owned - farmerkeep);
	RsafeFireJob('Lumberjack', game.jobs.Lumberjack.owned);
	RsafeFireJob('Miner', game.jobs.Miner.owned);
    }

    else if (farmerRatio > 0 && lumberjackRatio > 0 && minerRatio > 0) {
	RsafeBuyJob('Farmer', totalDistributableWorkers * 0.15);
	RsafeBuyJob('Lumberjack', totalDistributableWorkers * 0.35);
	RsafeBuyJob('Miner', totalDistributableWorkers * 0.45);
    }
}

var reservedJobs = 100;

function RbuyJobs() {

    if (game.jobs.Farmer.locked || game.resources.trimps.owned == 0) return;

    var freeWorkers = Math.ceil(Math.min(game.resources.trimps.realMax() / 2), game.resources.trimps.owned) - game.resources.trimps.employed;
    if (freeWorkers <= 0) return;

    // Do non-ratio/limited jobs first
    // Explorers
    var maxExplorers = (getPageSetting('RMaxExplorers') == -1) ? Infinity : getPageSetting('RMaxExplorers');
    if (maxExplorers > game.jobs.Explorer.owned && !game.jobs.Explorer.locked) {
        var affordableExplorers = Math.min(maxExplorers - game.jobs.Explorer.owned,
            getMaxAffordable(
                game.jobs.Explorer.cost.food[0] * Math.pow(game.jobs.Explorer.cost.food[1], game.jobs.Explorer.owned),
                game.resources.food.owned,
                game.jobs.Explorer.cost.food[1],
                true
            )
        );

        if (affordableExplorers > 0) {
            var buyAmountStore = game.global.buyAmt;
            game.global.buyAmt = affordableExplorers;

            buyJob('Explorer',true, true);
            
            freeWorkers -= affordableExplorers;
            game.global.buyAmt = buyAmountStore;
        }
    }

    // Meteorologists
    var affordableMets = getMaxAffordable(
        game.jobs.Meteorologist.cost.food[0] * Math.pow(game.jobs.Meteorologist.cost.food[1], game.jobs.Meteorologist.owned),
        game.resources.food.owned,
        game.jobs.Meteorologist.cost.food[1],
        true
    );

    if (affordableMets > 0 && !game.jobs.Meteorologist.locked) {
        var buyAmountStore = game.global.buyAmt;
        game.global.buyAmt = affordableMets;

        buyJob('Meteorologist',true, true);
        
        freeWorkers -= affordableMets;
        game.global.buyAmt = buyAmountStore;
    }

    // Ships
    shipspending = ((getPageSetting('Rshipspending') > 0) ? getPageSetting('Rshipspending') : 100);
    var affordableShips = Math.floor((game.resources.food.owned / game.jobs.Worshipper.getCost())/100*shipspending);
    if (affordableShips > 0 && !game.jobs.Worshipper.locked) {
        var buyAmountStore = game.global.buyAmt;
        game.global.buyAmt = affordableShips;

        buyJob('Worshipper',true, true);
        
        freeWorkers -= affordableShips;
        game.global.buyAmt = buyAmountStore;
    }

    // Gather up the total number of workers available to be distributed across ratio workers
    // In the process store how much of each for later.
    var ratioWorkers = ['Farmer', 'Lumberjack', 'Miner', 'Scientist'];
    var currentworkers = [];
    for (var worker of ratioWorkers) {
        currentworkers.push(game.jobs[worker].owned);
    }

    freeWorkers += currentworkers.reduce((a,b) => {return a + b;});
	
    freeWorkers -= (game.resources.trimps.owned > 1e6) ? reservedJobs : 0;

    // Calculate how much of each worker we should have
    // If focused farming go all in for caches
    var allIn = "";
    if (Rshouldtimefarmbogs || Rshouldtimefarm || Rshouldtimefarm2) {
        if (autoTrimpSettings.Rtimespecialselection.selected.includes('wc')) {
            allIn = "Lumberjack";
        } else if (autoTrimpSettings.Rtimespecialselection.selected.includes('sc')) {
            allIn = "Farmer";
        } else if (autoTrimpSettings.Rtimespecialselection.selected.includes('mc')) {
            allIn = "Miner";
        } else if (autoTrimpSettings.Rtimespecialselection.selected.includes('rc')) {
            allIn = "Scientist";
        }
    }
        if (Rshouldtimefarm2) {
        if (autoTrimpSettings.Rtimespecialselection2.selected.includes('wc')) {
            allIn = "Lumberjack";
        } else if (autoTrimpSettings.Rtimespecialselection2.selected.includes('sc')) {
            allIn = "Farmer";
        } else if (autoTrimpSettings.Rtimespecialselection2.selected.includes('mc')) {
            allIn = "Miner";
        } else if (autoTrimpSettings.Rtimespecialselection2.selected.includes('rc')) {
            allIn = "Scientist";
        }
    }
    if (Rshouldshipfarm) {
	allIn = "Farmer";
    }	
	
    var desiredRatios = [0,0,0,0];
    if (allIn != "") {
        desiredRatios[ratioWorkers.indexOf(allIn)] = 1;
	    if(Rshouldtimefarm2) { desiredRatios[ratioWorkers.indexOf("Lumberjack")] =0.3;}
    } else {
        // Weird scientist ratio hack. Based on previous AJ, I don't know why it's like this.
        var scientistMod = MODULES["jobs"].RscientistRatio;
        if (game.jobs.Farmer.owned < 100) {
            scientistMod = MODULES["jobs"].RscientistRatio2;
        }
        if (game.global.world >= 50) {
            scientistMod = MODULES["jobs"].RscientistRatio3;
        }
        if (game.global.world >= 65) {
            scientistMod = MODULES["jobs"].RscientistRatio4;
        }

        for (var worker of ratioWorkers) {
            if (!game.jobs[worker].locked) {

                if (worker == "Scientist"){
                    desiredRatios[ratioWorkers.indexOf(worker)] = 1;
                    continue;
                }

                // get ratio from AT
                desiredRatios[ratioWorkers.indexOf(worker)] = scientistMod * parseFloat(getPageSetting('R' + worker + 'Ratio'));
                if (getPageSetting('NoFarmersAbove') == true && game.global.world >= getPageSetting('NoFarmerZone')) {
	            desiredRatios[ratioWorkers.indexOf("Farmer")] = 0;
	        }
            }
        }
    }

    var totalFraction = desiredRatios.reduce((a,b) => {return a + b;});

    var desiredWorkers = [0,0,0,0];
    var totalWorkerCost = 0;
    for (var i = 0; i < ratioWorkers.length; i++) {
        desiredWorkers[i] = Math.floor(freeWorkers * desiredRatios[i] / totalFraction - currentworkers[i]);
        if (desiredWorkers[i] > 0) totalWorkerCost += game.jobs[ratioWorkers[i]].cost.food * desiredWorkers[i];
    }
    // Check for negative values, in case we need to fire.

    // Safe check total worker costs, almost never going to be an issue
    // Or another reason that we're unable to buy everything we want
    if (totalWorkerCost > game.resources.food.owned /* or breeding/available stuff */) {
        // Buy max on food and then let the next frame take care of the rest.
        var buyAmountStore = game.global.buyAmt;
        game.global.buyAmt = "Max";

        buyJob('Farmer', true, true);

        game.global.buyAmt = buyAmountStore;
    } else {
        //buy everything
        for (var i = 0; i < desiredWorkers.length; i++) {

            if (desiredWorkers[i] == 0) continue;

            var buyAmountStore = game.global.buyAmt;
            var fireState = game.global.firing;

            game.global.firing = (desiredWorkers[i] < 0);
            game.global.buyAmt = Math.abs(desiredWorkers[i]);

            buyJob(ratioWorkers[i], true, true);

            game.global.firing = fireState;
            game.global.buyAmt = buyAmountStore;
        }
    }
}
