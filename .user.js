// ==UserScript==
// @name         AutoTrimps-SA
// @version      1.0-SA
// @namespace    https://SadAugust.github.io/AutoTrimps_Test
// @updateURL    https://SadAugust.github.io/AutoTrimps_Test/.user.js
// @description  Automate all the trimps!
// @author       zininzinin, spindrjr, Ishkaru, genBTC, Zeker0
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps
// @connect      *SadAugust.github.io/AutoTrimps_Test*
// @connect      *trimps.github.io*
// @connect      self
// @grant        GM_xmlhttpRequest 
// ==/UserScript==

var script = document.createElement('script');
script.id = 'AutoTrimps-SA';
//This can be edited to point to your own Github Repository URL.
script.src = 'https://SadAugust.github.io/AutoTrimps_Test/AutoTrimps2.js';
//script.setAttribute('crossorigin',"use-credentials");
script.setAttribute('crossorigin',"anonymous");
document.head.appendChild(script);
