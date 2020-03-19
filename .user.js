// ==UserScript==
// @name         AutoTrimps-Ray
// @version      0.1-Ray
// @namespace    https://Psycho-Ray.github.io/AutoTrimps
// @updateURL    https://Psycho-Ray.github.io/AutoTrimps/.user.js
// @description  Automate all the trimps!
// @author       zininzinin, spindrjr, Ishkaru, genBTC, Zeker0, Psycho-Ray
// @include      *trimps.github.io*
// @include      *kongregate.com/games/GreenSatellite/trimps
// @connect      *github.com/Psycho-Ray/AutoTrimps/blob/gh-pages*
// @connect      *trimps.github.io*
// @connect      self
// @grant        GM_xmlhttpRequest 
// ==/UserScript==

var script = document.createElement('script');
script.id = 'AutoTrimps-Ray';
//This can be edited to point to your own Github Repository URL.
script.src = 'https://Psycho-Ray.github.io/AutoTrimps/AutoTrimps2.js';
//script.setAttribute('crossorigin',"use-credentials");
script.setAttribute('crossorigin',"anonymous");
document.head.appendChild(script);

