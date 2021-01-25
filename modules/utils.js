if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
        'use strict';
        if (typeof start !== 'number') {
            start = 0;
        }
        if (start + search.length > this.length) {
            return false;
        } else {
            return this.indexOf(search, start) !== -1;
        }
    };
}

function loadPageVariables() {
    var tmp = JSON.parse(localStorage.getItem('autoTrimpSettings'));
    if (tmp !== null && tmp['ATversion'] != undefined) {
        autoTrimpSettings = tmp;
    }
}

function safeSetItems(a,b){try{localStorage.setItem(a,b)}catch(c){22==c.code&&debug("Error: LocalStorage is full, or error. Attempt to delete some portals from your graph or restart browser.")}}

function serializeSettings() {
    return JSON.stringify(Object.keys(autoTrimpSettings).reduce((v, k) => {
        const el = autoTrimpSettings[k];
        switch (el.type) {
        case 'boolean':
            return v[k] = el.enabled, v;
        case 'value':
        case 'multiValue':
        case 'textValue':
        case 'valueNegative':
        case 'multitoggle':
            return v[k] = el.value, v;
        case 'dropdown':
            return v[k] = el.selected, v;
        }
        return v[k] = el, v;
    }, {}));
}

function getPageSetting(setting) {
    if (autoTrimpSettings.hasOwnProperty(setting) == false) {
        return false;
    }
    if (autoTrimpSettings[setting].type == 'boolean') {
        return autoTrimpSettings[setting].enabled;
    } else if (autoTrimpSettings[setting].type == 'multiValue') {
        return Array.from(autoTrimpSettings[setting].value)
        .map(x => parseInt(x));
    } else if (autoTrimpSettings[setting].type == 'textValue') {
        return autoTrimpSettings[setting].value;
    } else if (autoTrimpSettings[setting].type == 'value' || autoTrimpSettings[setting].type == 'valueNegative') {
        return parseFloat(autoTrimpSettings[setting].value);
    } else if (autoTrimpSettings[setting].type == 'multitoggle') {
        return parseInt(autoTrimpSettings[setting].value);
    } else if (autoTrimpSettings[setting].type == 'dropdown') {
        return autoTrimpSettings[setting].selected;
    }
}

function setPageSetting(setting, value) {
    if (autoTrimpSettings.hasOwnProperty(setting) == false) {
        return false;
    }
    if (autoTrimpSettings[setting].type == 'boolean') {
        autoTrimpSettings[setting].enabled = value;
        document.getElementById(setting).setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings[setting].enabled);
    } else if (autoTrimpSettings[setting].type == 'value' || autoTrimpSettings[setting].type == 'valueNegative') {
        autoTrimpSettings[setting].value = value;
    } else if (autoTrimpSettings[setting].type == 'textValue') {
        autoTrimpSettings[setting].value = value;
    } else if (autoTrimpSettings[setting].type == 'multiValue' || autoTrimpSettings[setting].type == 'valueNegative') {
        autoTrimpSettings[setting].value = value;
    } else if (autoTrimpSettings[setting].type == 'multitoggle') {
        autoTrimpSettings[setting].value = value;
        document.getElementById(setting).setAttribute('class', 'noselect settingsBtn settingBtn' + autoTrimpSettings[setting].value);
    } else if (autoTrimpSettings[setting].type == 'dropdown') {
        autoTrimpSettings[setting].selected = value;
    }
}

function saveSettings(){safeSetItems('autoTrimpSettings',serializeSettings())}
function debug(a,b,c){var d=getPageSetting('SpamGeneral'),e=getPageSetting('SpamUpgrades'),f=getPageSetting('SpamEquipment'),g=getPageSetting('SpamMaps'),h=getPageSetting('SpamOther'),i=getPageSetting('SpamBuilding'),j=getPageSetting('SpamJobs'),k=getPageSetting('SpamGraphs'),l=getPageSetting('SpamMagmite'),m=getPageSetting('SpamPerks'),n=getPageSetting('SpamProfiles'),o=getPageSetting('SpamNature'),p=!0;switch(b){case null:break;case'general':p=d;break;case'upgrades':p=e;break;case'equips':p=f;break;case'buildings':p=i;break;case'jobs':p=j;break;case'maps':p=g;break;case'other':p=h;break;case'graphs':p=k;break;case'magmite':p=l;break;case'perks':p=m;break;case'profiles':p=n;break;case'nature':p=o;}p&&(enableDebug&&console.log(timeStamp()+' '+a),message2(a,'AutoTrimps',c,b))}
function timeStamp(){for(var a=new Date,b=[a.getHours(),a.getMinutes(),a.getSeconds()],c=1;3>c;c++)10>b[c]&&(b[c]="0"+b[c]);return b.join(":")}
function preBuy(){preBuyAmt=game.global.buyAmt,preBuyFiring=game.global.firing,preBuyTooltip=game.global.lockTooltip,preBuymaxSplit=game.global.maxSplit}
function postBuy(){game.global.buyAmt=preBuyAmt,game.global.firing=preBuyFiring,game.global.lockTooltip=preBuyTooltip,game.global.maxSplit=preBuymaxSplit}
function preBuy2(){return[game.global.buyAmt,game.global.firing,game.global.lockTooltip,game.global.maxSplit]}
function postBuy2(a){game.global.buyAmt=a[0],game.global.firing=a[1],game.global.lockTooltip=a[2],game.global.maxSplit=a[3]}
function setTitle(){aWholeNewWorld&&(document.title='('+game.global.world+') Trimps '+document.getElementById('versionNumber').innerHTML)}
var lastmessagecount = 1;
function message2(a,b,c,d){var e=document.getElementById("log"),f=e.scrollTop+10>e.scrollHeight-e.clientHeight,g=ATmessageLogTabVisible?"block":"none",h="";c&&"*"==c.charAt(0)?(c=c.replace("*",""),h="icomoon icon-"):h="glyphicon glyphicon-",game.options.menu.timestamps.enabled&&(a=(1==game.options.menu.timestamps.enabled?getCurrentTime():updatePortalTimer(!0))+" "+a),c&&(a="<span class=\""+h+c+"\"></span> "+a),a="<span class=\"glyphicon glyphicon-superscript\"></span> "+a,a="<span class=\"icomoon icon-text-color\"></span>"+a;var i="<span class='"+b+"Message message "+d+"' style='display: "+g+"'>"+a+"</span>",j=document.getElementsByClassName(b+"Message");if(1<j.length&&-1<j[j.length-1].innerHTML.indexOf(a)){var k=j[j.length-1].innerHTML;lastmessagecount++;var l=k.lastIndexOf(" x");-1!=l&&(j[j.length-1].innerHTML=k.slice(0,l)),j[j.length-1].innerHTML+=" x"+lastmessagecount}else lastmessagecount=1,e.innerHTML+=i;f&&(e.scrollTop=e.scrollHeight),trimMessages(b)}
var ATbutton=document.createElement('button');ATbutton.innerHTML='AutoTrimps',ATbutton.setAttribute('id','AutoTrimpsFilter'),ATbutton.setAttribute('type','button'),ATbutton.setAttribute('onclick','filterMessage2(\'AutoTrimps\')'),ATbutton.setAttribute('class','btn btn-success logFlt');var tab=document.createElement('DIV');tab.setAttribute('class','btn-group'),tab.setAttribute('role','group'),tab.appendChild(ATbutton),document.getElementById('logBtnGroup').appendChild(tab);
function filterMessage2(a){var b=document.getElementById("log");displayed=!ATmessageLogTabVisible,ATmessageLogTabVisible=displayed;var c=document.getElementsByClassName(a+"Message"),d=displayed?a:a+" off",e=document.getElementById(a+"Filter");e.innerHTML=d,e.className="",e.className=getTabClass(displayed),displayed=displayed?"block":"none";for(var f=0;f<c.length;f++)c[f].style.display=displayed;b.scrollTop=b.scrollHeight}

function formatMinutesForDescriptions(number){
    var text;
    var seconds = Math.floor((number*60) % 60);
    var minutes = Math.floor(number % 60);
    var hours = Math.floor(number / 60);
    if (hours == 0)
        text = minutes + " minutes " + seconds + " seconds";
    else if (minutes > 0) {
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;
        text = hours + ":" + minutes + ":" + seconds;
    }
    else {
        var hs = (hours > 1) ? "s" : "";
        var ms = (minutes > 1) ? "s" : "";
        var ss = (seconds > 1) ? "s" : "";
        text = hours + " hour" + hs + " " + minutes + " minute" + ms + " " + seconds + " second" + ss;
    }
    return text;
}

window.onerror=function(b,c,d,e,f){var g=['Message: '+b,'URL: '+c,'Line: '+d,'Column: '+e,'Error object: '+JSON.stringify(f)].join(' - ');0!=d&&console.log('AT logged error: '+g)};
function throwErrorfromModule(){throw new Error("We have successfully read the thrown error message out of a module")}
