// ==UserScript==
// @name         AutoTrimps-Zek-Gentz
// @version      1.0-Zek
// @namespace    https://github.com/ZeGentzy/AutoTrimps/raw/fixspires
// @updateURL    https://github.com/ZeGentzy/AutoTrimps/raw/fixspires/.user.js
// @description  Automate all the trimps! Gentz
// @author       zininzinin, spindrjr, Ishkaru, genBTC, Zeker0
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps
// @connect      *Zorn192.github.io/AutoTrimps*
// @connect      *trimps.github.io*
// @connect      self
// @grant        GM_xmlhttpRequest 
// ==/UserScript==

var script = document.createElement('script');
script.id = 'AutoTrimps-Zek-Gentz';
//This can be edited to point to your own Github Repository URL.
script.src = 'https://github.com/ZeGentzy/AutoTrimps/raw/fixspires/AutoTrimps2.js';
//script.setAttribute('crossorigin',"use-credentials");
script.setAttribute('crossorigin',"anonymous");
document.head.appendChild(script);
