// ==UserScript==
// @name         Evolve_HLXII
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  try to take over the world!
// @author       Fafnir
// @author       HLXII
// @match        https://pmotschmann.github.io/Evolve/
// @grant        GM_log
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://raw.githubusercontent.com/pieroxy/lz-string/master/libs/lz-string.min.js
// ==/UserScript==


/*
 * Script entry point, sets up unsafewindow.game.global
 * Stolen from NotOats
 */
function userscriptEntryPoint() {
    console.log(unsafeWindow.game);
    main();
}

unsafeWindow.addEventListener('customModuleAdded', userscriptEntryPoint);

$(document).ready(function() {
    let injectScript = `
import { global, vues, breakdown } from './vars.js';
import { actions } from './actions.js';
import { races } from './races.js';
import {tradeRatio, craftCost } from './resources.js';
window.game =  {
    global: global,
    vues: vues,
    breakdown: breakdown,
    actions: actions,
    races: races,
    tradeRatio: tradeRatio,
    craftCost: craftCost,
};
window.dispatchEvent(new CustomEvent('customModuleAdded'));
`;

    $('<script>')
    .attr('type', 'module')
    .text(injectScript)
    .appendTo('head');
});

function main() {
    window.game = unsafeWindow.game;
    'use strict';
    var settings = {};
    var jsonSettings = localStorage.getItem('settings');
    if(jsonSettings != null){settings = JSON.parse(jsonSettings);}

    /***
    *
    * Setup resources informations and settings
    *
    ***/

    // Used to ensure no modal window conflicts
    let modal = false;

    let evoFarmActions = ["evo-rna", "evo-dna"];
    let evoRaceActions = ["evo-phagocytosis", "evo-chitin", "evo-chloroplasts",
                          "evo-eggshell", "evo-mammals", "evo-athropods",
                          "evo-ectothermic", "evo-endothermic",
                          "evo-humanoid", "evo-gigantism", "evo-animalism", "evo-dwarfism",
                          "evo-aquatic", "evo-demonic",
                          "evo-entish", "evo-cacti",
                          "evo-sporgar", "evo-shroomi",
                          "evo-arraak", "evo-pterodacti", "evo-dracnid",
                          "evo-tortoisan", "evo-gecko", "evo-slitheryn",
                          "evo-human", "evo-elven", "evo-orc",
                          "evo-orge", "evo-cyclops", "evo-troll",
                          "evo-kobold", "evo-goblin", "evo-gnome",
                          "evo-cath", "evo-wolven", "evo-centuar",
                          "evo-mantis", "evo-scorpid", "evo-antid",
                          "evo-sharkin", "evo-octigoran", "evo-balorg", "evo-imp",'evo-seraph','evo-unicorn'];
    let evoChallengeActions = ['evo-plasmid', 'evo-mastery', 'evo-trade', 'evo-craft', 'evo-crispr', 'evo-junker', 'evo-joyless', 'evo-decay'];
    let evoUniverses = ['uni-standard','uni-heavy','uni-antimatter','uni-evil','uni-micro'];
    let evoRaceTrees = {
        "entish":["evo-chloroplasts", "evo-entish"],
        "cacti":["evo-chloroplasts", "evo-cacti"],
        "sporgar":["evo-chitin", "evo-sporgar"],
        "shroomi":["evo-chitin", "evo-shroomi"],
        "arraak":["evo-phagocytosis", "evo-eggshell", "evo-endothermic", "evo-arraak"],
        "pterodacti":["evo-phagocytosis", "evo-eggshell", "evo-endothermic", "evo-pterodacti"],
        "dracnid":["evo-phagocytosis", "evo-eggshell", "evo-endothermic", "evo-dracnid"],
        "tortoisan":["evo-phagocytosis", "evo-eggshell", "evo-ectothermic", "evo-tortoisan"],
        "gecko":["evo-phagocytosis", "evo-eggshell", "evo-ectothermic", "evo-gecko"],
        "slitheryn":["evo-phagocytosis", "evo-eggshell", "evo-ectothermic", "evo-slitheryn"],
        "human":["evo-phagocytosis", "evo-mammals", "evo-humanoid", "evo-human"],
        "elven":["evo-phagocytosis", "evo-mammals", "evo-humanoid", "evo-elven"],
        "orc":["evo-phagocytosis", "evo-mammals", "evo-humanoid", "evo-orc"],
        "orge":["evo-phagocytosis", "evo-mammals", "evo-gigantism", "evo-orge"],
        "cyclops":["evo-phagocytosis", "evo-mammals", "evo-gigantism", "evo-cyclops"],
        "troll":["evo-phagocytosis", "evo-mammals", "evo-gigantism", "evo-troll"],
        "kobold":["evo-phagocytosis", "evo-mammals", "evo-dwarfism", "evo-kobold"],
        "goblin":["evo-phagocytosis", "evo-mammals", "evo-dwarfism", "evo-goblin"],
        "gnome":["evo-phagocytosis", "evo-mammals", "evo-dwarfism", "evo-gnome"],
        "cath":["evo-phagocytosis", "evo-mammals", "evo-animalism", "evo-cath"],
        "wolven":["evo-phagocytosis", "evo-mammals", "evo-animalism", "evo-wolven"],
        "centuar":["evo-phagocytosis", "evo-mammals", "evo-animalism", "evo-centuar"],
        "mantis":["evo-phagocytosis", "evo-athropods", "evo-mantis"],
        "scorpid":["evo-phagocytosis", "evo-athropods", "evo-scorpid"],
        "antid":["evo-phagocytosis", "evo-athropods", "evo-antid"],
        "sharkin":["evo-phagocytosis", "evo-aquatic", "evo-sharkin"],
        "octigoran":["evo-phagocytosis", "evo-aquatic", "evo-octigoran"],
        "octigoran":["evo-phagocytosis", "evo-aquatic", "evo-octigoran"],
        "balorg":["evo-phagocytosis", "evo-mammals", "evo-demonic", "evo-balorg"],
        "imp":["evo-phagocytosis", "evo-mammals", "evo-demonic", "evo-imp"],
        "seraph":["evo-phagocytosis", "evo-mammals", "evo-angelic", "evo-seraph"],
        "unicorn":["evo-phagocytosis", "evo-mammals", "evo-angelic", "evo-unicorn"],
    };
    let maxEvo = {}
    function loadEvolution() {
        // Loading all maximum values for evolution upgrades
        maxEvo = {};
        // Need these to unlock next upgrades
        maxEvo['evo-organelles'] = 2;
        maxEvo['evo-nucleus'] = 1;
        // Determining how much storage is necessary
        let needed = 320
        if (perkUnlocked('Morphogenesis')) {
            needed *= 0.8;
        }
        let baseStorage = 100;
        // Adding to baseStorage if Creator is unlocked
        if (achievementUnlocked('Creator') != -1) {
            baseStorage += (achievementUnlocked('Creator')-1)*50;
        }
        // Finding most optimal maxes to reach sentience
        let total = 1000;
        for (let i = 0;i < 10;i++) {
            let numEuk = i;
            let numMit = Math.ceil((((needed-baseStorage) / numEuk) - 10)/10)
            if ((numEuk + numMit) <= total) {
                maxEvo['evo-eukaryotic_cell'] = numEuk;
                maxEvo['evo-mitochondria'] = numMit;
                total = numEuk + numMit
            }
        }
        maxEvo['evo-membrane'] = Math.ceil((needed-baseStorage) / (5 * maxEvo['evo-mitochondria'] + 5))
        // Setting minimum to 1 for unlocking next upgrades
        maxEvo['evo-membrane'] = (maxEvo['evo-membrane'] <= 0) ? 1 : maxEvo['evo-membrane'];
        maxEvo['evo-eukaryotic_cell'] = (maxEvo['evo-eukaryotic_cell'] <= 0) ? 1 : maxEvo['evo-eukaryotic_cell'];
        maxEvo['evo-mitochondria'] = (maxEvo['evo-mitochondria'] <= 0) ? 1 : maxEvo['evo-mitochondria'];
    }

    class Resource {
        constructor(id) {
            this.id = id;
            if (!settings.resources.hasOwnProperty(this.id)) {settings.resources[this.id] = {};}
            if (!settings.resources[this.id].hasOwnProperty('basePriority')) {settings.resources[this.id].basePriority = 0;}
            if (!settings.resources[this.id].hasOwnProperty('storePriority')) {settings.resources[this.id].storePriority = 0;}
            if (!settings.resources[this.id].hasOwnProperty('storeMin')) {settings.resources[this.id].storeMin = 0;}
        }

        get mainDiv() {
            return document.getElementById('res'+this.id);
        }
        get cntLabel() {
            return document.getElementById('cnt'+this.id);
        }
        get rateLabel() {
            return document.getElementById('inc'+this.id);
        }

        get name() {
            return window.game.global.resource[this.id].name;
        }

        get unlocked() {
            return window.game.global.resource[this.id].display;
        }

        get amount() {
            return window.game.global.resource[this.id].amount;
        }
        get storage() {
            return window.game.global.resource[this.id].max;
        }
        get ratio() {
            return this.amount / this.storage;
        }
        get rate() {
            return window.game.global.resource[this.id].diff;
        }

        get storePriority() {return settings.resources[this.id].storePriority};
        set storePriority(storePriority) {settings.resources[this.id].storePriority = storePriority;}
        get storeMin() {return settings.resources[this.id].storeMin;}
        set storeMin(storeMin) {settings.resources[this.id].storeMin = storeMin;}

        get crateIncBtn() {
            let storageDiv = document.querySelectorAll('#stack-'+this.id+' > .trade')
            if (storageDiv.length > 0) {
                return storageDiv[0].children[3]
            } else {
                return null;
            }
        }
        get crateDecBtn() {
            let storageDiv = document.querySelectorAll('#stack-'+this.id+' > .trade')
            if (storageDiv.length > 0) {
                return storageDiv[0].children[1]
            } else {
                return null;
            }
        }
        get containerIncBtn() {
            let storageDiv = document.querySelectorAll('#stack-'+this.id+' > .trade')
            if (storageDiv.length > 1) {
                return storageDiv[1].children[3]
            } else {
                return null;
            }
        }
        get containerDecBtn() {
            let storageDiv = document.querySelectorAll('#stack-'+this.id+' > .trade')
            if (storageDiv.length > 1) {
                return storageDiv[1].children[1]
            } else {
                return null;
            }
        }
        get crateNum() {
            return window.game.global.resource[this.id].crates;
        }
        get containerNum() {
            return window.game.global.resource[this.id].containers;
        }
        get crateable() {
            return window.game.global.resource[this.id].stackable;
        }
        crateInc(num) {
            let crateIncBtn = this.crateIncBtn;
            if (crateIncBtn !== null) {
                for (let i = 0;i < num;i++) {
                    crateIncBtn.click();
                }
                return true;
            } else {
                return false;
            }
        }
        crateDec(num) {
            let crateDecBtn = this.crateDecBtn;
            if (crateDecBtn !== null) {
                for (let i = 0;i < num;i++) {
                    crateDecBtn.click();
                }
                return true;
            } else {
                return false;
            }
        }
        containerInc(num) {
            let containerIncBtn = this.containerIncBtn;
            if (containerIncBtn !== null) {
                for (let i = 0;i < num;i++) {
                    containerIncBtn.click();
                }
                return true;
            } else {
                return false;
            }
        }
        containerDec(num) {
            let containerDecBtn = this.containerDecBtn;
            if (containerDecBtn !== null) {
                for (let i = 0;i < num;i++) {
                    containerDecBtn.click();
                }
                return true;
            } else {
                return false;
            }
        }

        decStorePriority() {
            if (this.storePriority == 0) {return;}
            this.storePriority -= 1;
            updateSettings();
            console.log("Decrementing Store Priority", this.id, this.storePriority);
        }
        incStorePriority() {
            this.storePriority += 1;
            updateSettings();
            console.log("Incrementing Store Priority", this.id, this.storePriority);
        }
        decStoreMin() {
            if (this.storeMin == 0) {return;}
            this.storeMin -= 1;
            updateSettings();
            console.log("Decrementing Store Minimum", this.id, this.storeMin);
        }
        incStoreMin() {
            this.storeMin += 1;
            updateSettings();
            console.log("Incrementing Store Minimum", this.id, this.storeMin);
        }

        get basePriority() {return settings.resources[this.id].basePriority;}
        set basePriority(basePriority) {settings.resources[this.id].basePriority = basePriority;}
        get priority() {return settings.resources[this.id].basePriority;}

        decBasePriority() {
            if (this.basePriority == 0) {return;}
            this.basePriority -= 1;
            updateSettings();
            console.log("Decrementing Base Priority", this.id, this.basePriority);
        }
        incBasePriority() {
            this.basePriority += 1;
            updateSettings();
            console.log("Incrementing Base Priority", this.id, this.basePriority);
        }
    }
    class TradeableResource extends Resource {
        constructor(id) {
            super(id);
            if (!settings.resources.hasOwnProperty(this.id)) {settings.resources[this.id] = {};}
            if (!settings.resources[this.id].hasOwnProperty('autoSell')) {settings.resources[this.id].autoSell = false;}
            if (!settings.resources[this.id].hasOwnProperty('autoBuy')) {settings.resources[this.id].autoBuy = false;}
            if (!settings.resources[this.id].hasOwnProperty('buyRatio')) {settings.resources[this.id].buyRatio = 0.5;}
            if (!settings.resources[this.id].hasOwnProperty('sellRatio')) {settings.resources[this.id].sellRatio = 0.9;}
        }

        get autoSell() {return settings.resources[this.id].autoSell};
        set autoSell(autoSell) {settings.resources[this.id].autoSell = autoSell;}
        get autoBuy() {return settings.resources[this.id].autoBuy};
        set autoBuy(autoBuy) {settings.resources[this.id].autoBuy = autoBuy;}
        get buyRatio() {return settings.resources[this.id].buyRatio};
        set buyRatio(buyRatio) {settings.resources[this.id].buyRatio = buyRatio;}
        get sellRatio() {return settings.resources[this.id].sellRatio};
        set sellRatio(sellRatio) {settings.resources[this.id].sellRatio = sellRatio;}

        buyDec() {
            if (this.buyRatio > 0) {
                this.buyRatio = parseFloat(Number(this.buyRatio - 0.1).toFixed(1));
                updateSettings();
                console.log(this.id, "Decrementing Buy Ratio", this.buyRatio);
            }
        }
        buyInc() {
            if (this.buyRatio < 1) {
                this.buyRatio = parseFloat(Number(this.buyRatio + 0.1).toFixed(1));
                updateSettings();
                console.log(this.id, "Incrementing Buy Ratio", this.buyRatio);
            }
        }
        sellDec() {
            if (this.sellRatio > 0) {
                this.sellRatio = parseFloat(Number(this.sellRatio - 0.1).toFixed(1));
                updateSettings();
                console.log(this.id, "Decrementing Sell Ratio", this.sellRatio);
            }
        }
        sellInc() {
            if (this.sellRatio < 1) {
                this.sellRatio = parseFloat(Number(this.sellRatio + 0.1).toFixed(1));
                console.log(this.id, "Incrementing Sell Ratio", this.sellRatio);
            }
        }

        get tradeDecSpan() {
            let nodes = document.querySelectorAll('#market-'+this.id+' > .trade > .is-primary');
            if (nodes.length == 0) {
                console.log("Error:", this.id, "Trade Dec Span");
                return null;
            } else {
                return nodes[0];
            }
        }
        get tradeIncSpan() {
            let nodes = document.querySelectorAll('#market-'+this.id+' > .trade > .is-primary');
            if (nodes.length != 2) {
                console.log("Error:", this.id, "Trade Inc Span");
                return null;
            } else {
                return nodes[1];
            }
        }
        get tradeDecBtn() {
            return document.querySelector('#market-'+this.id+' > .trade > .is-primary > .add');
        }
        get tradeIncBtn() {
            return document.querySelector('#market-'+this.id+' > .trade > .is-primary > .sub');
        }
        get tradeLabel() {
            return document.querySelector('#market-'+this.id+' > .trade > .current');
        }
        get sellBtn() {
            let sellBtn = document.querySelectorAll('#market-'+this.id+' > .order');
            if (sellBtn !== null && sellBtn.length >= 2) {
                return sellBtn[1];
            } else {
                return null;
            }
        }
        get buyBtn() {
            let buyBtn = document.querySelectorAll('#market-'+this.id+' > .order');
            if (buyBtn !== null && buyBtn.length >= 1) {
                return buyBtn[0];
            } else {
                return null;
            }
        }

        tradeDec() {
            if (this.tradeDecBtn !== null) {
                this.tradeDecBtn.click();
                return true;
            } else {
                console.log("Error:", this.id, "Trade Decrement");
                return false;
            }
        }
        tradeInc() {
            if (this.tradeIncBtn !== null) {
                this.tradeIncBtn.click();
                return true;
            } else {
                console.log("Error:", this.id, "Trade Increment");
                return false;
            }
        }

        get tradeNum() {
            return window.game.global.resource[this.id].trade;
        }
        get tradeBuyCost() {
            if (this.tradeDecSpan !== null) {
                let dataStr = this.tradeDecSpan.attributes['data-label'].value;
                var reg = /Auto-buy\s([\d\.]+)[\w\s]*\$([\d\.]+)/.exec(dataStr);
                return parseFloat(reg[2]);
            } else {
                console.log("Error:", this.id, "Trade Buy Cost");
                return -1;
            }
        }
        get tradeSellCost() {
            if (this.tradeIncSpan !== null) {
                let dataStr = this.tradeIncSpan.attributes['data-label'].value;
                var reg = /Auto-sell\s([\d\.]+)[\w\s]*\$([\d\.]+)/.exec(dataStr);
                return parseFloat(reg[2]);
            } else {
                console.log("Error:", this.id, "Trade Sell Cost");
                return -1;
            }
        }
        get tradeAmount() {
            return window.game.tradeRatio[this.id];
        }
    }
    var resources = [];
    function loadResources() {
        if (!settings.hasOwnProperty('resources')) {settings.resources = {};}
        Object.keys(window.game.global.resource).forEach(function(res) {
            // Craftable Resources
            if (window.game.craftCost[res] !== undefined) {
                //console.log("Craftable Resource:", res);
                resources[res] = new CraftableResource(res);
            }
            // Tradeable Resources
            else if (window.game.global.resource[res].trade !== undefined) {
                //console.log("Tradeable Resource:", res);
                resources[res] = new TradeableResource(res);
            }
            // Normal Resources
            else {
                //console.log("Normal Resource:", res);
                resources[res] = new Resource(res);
            }
        });
    }
    class CraftableResource extends Resource {
        constructor(id) {
            super(id);
            this.sources = window.game.craftCost[id];
            if (!settings.resources.hasOwnProperty(this.id)) {settings.resources[this.id] = {};}
            if (!settings.resources[this.id].hasOwnProperty('enabled')) {settings.resources[this.id].enabled = false;}
        }

        get enabled() {return settings.resources[this.id].enabled;}
        set enabled(enabled) {settings.resources[this.id].enabled = enabled;}

        get craftBtn() {
            return document.getElementById("inc" + this.id + "5")
        }

        get canCraft() {
            // Crafting if resource is unlocked and enabled
            if (this.unlocked && this.enabled) {
                // Checking if every source can be used
                //console.log("Checking crafting of", this);
                if (this.sources.every(function(element) {
                    //console.log("Checking Resource", element.res, element.res.ratio);
                    return resources[element.r].ratio > 0.9;
                })) {
                    //console.log("Can Craft", this.name);
                    // Determining number of crafts
                    let total_crafts = 100000000000;
                    for (let i = 0;i < this.sources.length;i++) {
                        let res = resources[this.sources[i].r];
                        let cost = this.sources[i].a * 5;
                        let cur_crafts = Math.round((res.amount - (res.storage * .9)) / cost);
                        //console.log("Checking", res.name, "A/S", res.amount, res.storage, cur_crafts);
                        if (cur_crafts < total_crafts) {
                            total_crafts = cur_crafts;
                        }
                    }
                    return total_crafts;
                }
            }
            return 0;
        }

        craft(num) {
            if (!this.unlocked || !this.enabled) {return false;}
            if (this.craftBtn === null) {return false;}
            let btn = this.craftBtn.children[0];
            for (let j = 0;j < this.canCraft;j++) {
                btn.click();
            }
        }
    }

    function getMultiplier(res) {
        let multiplier = 1;
        for (let val in window.game.breakdown.p[res]) {
            let data = window.game.breakdown.p[res][val];
            if (data[data.length-1] == '%') {
                multiplier *= 1 + (+data.substring(0, data.length - 1)/100)
            }
        }
        return multiplier;
    }

    function priorityScale(value, priority, action) {
        let scale = Math.exp(-0.25 * priority);
        if (action !== null && action !== undefined) {
            if (action instanceof Research) {
                scale /= 50;
            }
            if (action instanceof Building && action.softCap >= 0) {
                let softCap = 1 + Math.exp(0.75 * (action.numTotal - action.softCap));
                scale *= softCap;
            }
        }
        return value * scale;
    }
    class Action {
        constructor(id, loc) {
            this.id = id;
            this.loc = loc;
            if (!settings.actions.hasOwnProperty(this.id)) {settings.actions[this.id] = {};}
            if (!settings.actions[this.id].hasOwnProperty('basePriority')) {settings.actions[this.id].basePriority = 0;}
            if (!settings.actions[this.id].hasOwnProperty('enabled')) {settings.actions[this.id].enabled = false;}
        }

        get enabled() {return settings.actions[this.id].enabled;}
        set enabled(enabled) {settings.actions[this.id].enabled = enabled;}
        get basePriority() {return settings.actions[this.id].basePriority;}
        set basePriority(basePriority) {settings.actions[this.id].basePriority = basePriority;}
        decBasePriority() {
            this.basePriority -= 1;
            updateSettings();
            console.log("Decrementing Priority", this.id, this.basePriority);
        }
        incBasePriority() {
            this.basePriority += 1;
            updateSettings();
            console.log("Incrementing Priority", this.id, this.basePriority);
        }
        get priority() {return this.basePriority;}

        get label() {
            return document.querySelector('#'+this.id+' > a > .aTitle');
        }
        get btn() {
            return document.getElementById(this.id);
        }

        get unlocked() {
            return this.label !== null;
        }
        get name() {
            let title = this.def.title;
            if (typeof title != 'string') {
                return title();
            }
            return title;
        }

        get def() {
            let details = window.game.actions;
            for (let i = 0;i < this.loc.length;i++) {
                details = details[this.loc[i]];
            }
            // Because tech-exotic_lab has a different key than id
            if (this.id == 'tech-energy_lab') {
                return details['exotic_lab'];
            }
            // Because city-basic_housing has a different key than id
            if (this.id == 'city-house') {
                return details['basic_housing'];
            }
            // Because tech-fort has a different key than id
            if (this.id == 'tech-fort') {
                return details['fortifications'];
            }
            return details[this.id.split('-')[1]];
        }

        get data() {
            let [type, action] = this.id.split('-');
            let temp_action = action;
            // Because city-basic_housing has a different key than id
            if (this.id == 'city-house') {
                temp_action = 'basic_housing';
            }
            if (window.game.global[type] === undefined || window.game.global[type][temp_action] == undefined) {
                return null;
            }
            return window.game.global[type][temp_action];
        }

        getResDep(resid) {
            if (this.def.cost[resid] !== undefined) {
                return this.def.cost[resid]();
            }
            return null;
        }

        click() {
            if (this.btn !== null) {
                if (this.btn.className.indexOf('cna') < 0) {
                    this.btn.getElementsByTagName("a")[0].click();
                    if (this.onBuy !== undefined) {
                        this.onBuy();
                    }
                    return true;
                }
                return false;
            } else {
                return false;
            }
        }
    }
    class Building extends Action {
        constructor(id, loc) {
            super(id, loc);
            if (!settings.actions[this.id].hasOwnProperty('atLeast')) {settings.actions[this.id].atLeast = 0;}
            if (!settings.actions[this.id].hasOwnProperty('limit')) {settings.actions[this.id].limit = -1;}
            if (!settings.actions[this.id].hasOwnProperty('softCap')) {settings.actions[this.id].softCap = -1;}
        }

        get atLeast() {return settings.actions[this.id].atLeast;}
        set atLeast(atLeast) {settings.actions[this.id].atLeast = atLeast;}
        get limit() {return settings.actions[this.id].limit;}
        set limit(limit) {settings.actions[this.id].limit = limit;}
        get softCap() {return settings.actions[this.id].softCap;}
        set softCap(softCap) {settings.actions[this.id].softCap = softCap;}

        get priority() {
            // Setting priority to 100 if building hasn't reached the At Least value
            if (this.atLeast != 0 && this.numTotal < this.atLeast) {
                return 100;
            }
            return this.basePriority;
        }

        get numTotal() {
            if (this.data === null) {
                return 0;
            }
            return this.data.count;
        }

        decAtLeast() {
            if (this.atLeast == 0) {return;}
            this.atLeast -= 1;
            updateSettings();
            console.log("Decrementing At Least", this.id, this.atLeast);
        }
        incAtLeast() {
            this.atLeast += 1;
            updateSettings();
            console.log("Incrementing At Least", this.id, this.atLeast);
        }

        decLimit() {
            if (this.limit == -1) {return;}
            this.limit -= 1;
            updateSettings();
            console.log("Decrementing Limit", this.id, this.limit);
        }
        incLimit() {
            this.limit += 1;
            updateSettings();
            console.log("Incrementing Limit", this.id, this.limit);
        }

        decSoftCap() {
            if (this.softCap == -1) {return;}
            this.softCap -= 1;
            updateSettings();
            console.log("Decrementing SoftCap", this.id, this.softCap);
        }
        incSoftCap() {
            this.softCap += 1;
            updateSettings();
            console.log("Incrementing SoftCap", this.id, this.softCap);
        }

    }
    function checkPowerRequirements(c_action){
        var isMet = true;
        if (c_action['power_reqs']){
            Object.keys(c_action.power_reqs).forEach(function (req){
                if (window.game.global.tech[req] && window.game.global.tech[req] < c_action.power_reqs[req]){
                    isMet = false;
                }
            });
        }
        return isMet;
    }
    function getPowerData(id, def) {
        //console.log("Getting Power Data for", id);
        let produce = [];
        let consume = [];
        let effectStr = "";
        let test = null;
        // Finding Production
        switch(id) {
            case "city-apartment":
            case "city-sawmill":
            case "city-rock_quarry":
            case "city-cement_plant":
            case "city-factory":
            case "city-metal_refinery":
            case "city-mine":
            case "city-coal_mine":
            case "city-tourist_center":
            case "city-wardenclyffe":
            case "city-biolab":
            case "city-mass_driver":
            case "space-observatory":
            case "space-living_quarters":
            case "space-vr_center": //TODO I haven't seen this yet so idk
            case "space-red_mine":
            case "space-fabrication":
            case "space-red_factory":
            case "space-biodome":
            case "space-exotic_lab":
            case "space-space_barracks":
            case "space-elerium_contain":
            case "space-world_controller":
                break;
            case "city-windmill":
                produce = [{res:"electricity",cost:1}];
                break;
            case "city-casino":
                effectStr = def.effect();
                test = /generates\s\$([\d\.]+)/.exec(effectStr);
                if (test) {produce = [{res:"Money",cost:+test[1]}];}
                break;
            case "city-mill":
            case "city-coal_power":
            case "city-oil_power":
            case "city-fission_power":
            case "space-geothermal":
            case "space-e_reactor":
                produce = [{res:"electricity",cost:-def.powered()}];
                break;
            case "space-nav_beacon":
                produce = [{res:"moon_support",cost:1}];
                break;
            case "space-moon_base":
                produce = [{res:"moon_support",cost:3}];
                break;
            case "space-iridium_mine":
                effectStr = def.effect();
                test = /\+([\d\.]+) Iridium/.exec(effectStr);
                produce = [{res:"Iridium",cost:+test[1]}];
                break;
            case "space-helium_mine":
                effectStr = def.effect();
                test = /\+([\d\.]+) Helium/.exec(effectStr);
                produce = [{res:"Helium_3",cost:+test[1]}];
                break;
            case "space-spaceport":
                produce = [{res:"red_support",cost:3}];
                break;
            case "space-red_tower":
                produce = [{res:"red_support",cost:1}];
                break;
            case "space-swarm_control":
                produce = [{res:"swarm_support",cost:def.support}];
                break;
            case "space-swarm_satellite":
                produce = [{res:"electricity",cost:1}];
                break;
            case "space-gas_mining":
                effectStr = def.effect();
                test = /\+([\d\.]+) Helium/.exec(effectStr);
                produce = [{res:"Helium_3",cost:+test[1]}];
                break;
            case "space-outpost":
                effectStr = def.effect();
                test = /\+([\d\.]+) Neutronium/.exec(effectStr);
                produce = [{res:"Neutronium",cost:+test[1]}];
                break;
            case "space-oil_extractor":
                effectStr = def.effect();
                test = /\+([\d\.]+) Oil/.exec(effectStr);
                produce = [{res:"Oil",cost:+test[1]}];
                break;
            case "space-space_station":
                produce = [{res:"belt_support",cost:3}];
                break;
            case "space-elerium_ship":
                effectStr = def.effect();
                test = /\+([\d\.]+) Elerium/.exec(effectStr);
                produce = [{res:"Elerium",cost:+test[1]}];
                break;
            case "space-iridium_ship":
                effectStr = def.effect();
                test = /\+([\d\.]+) Iridium/.exec(effectStr);
                produce = [{res:"Iridium",cost:+test[1]}];
                break;
            case "space-iron_ship":
                effectStr = def.effect();
                test = /\+([\d\.]+) Iron/.exec(effectStr);
                produce = [{res:"Iron",cost:+test[1]}];
                break;
            case "interstellar-starport":
                produce = [{res:"alpha_support",cost:5}];
                break;
            default:
                break;
        }
        // Finding Consumption
        switch(id) {
            case "city-apartment":
            case "city-sawmill":
            case "city-rock_quarry":
            case "city-cement_plant":
            case "city-factory":
            case "city-metal_refinery":
            case "city-mine":
            case "city-coal_mine":
            case "city-casino":
            case "city-wardenclyffe":
            case "city-biolab":
            case "city-mass_driver":
            case "space-nav_beacon":
            case "space-red_tower":
            case "space-gas_mining":
            case "space-oil_extractor":
            case "space-elerium_contain":
            case "space-world_controller":
                consume = [{res:"electricity",cost:def.powered()}];
                break;
            case "space-iridium_mine":
            case "space-helium_mine":
            case "space-observatory":
                consume= [{res:"moon_support",cost:-def.support}];
                break;
            case "space-living_quarters":
            case "space-vr_center": //TODO I haven't seen this yet so idk
            case "space-red_mine":
            case "space-fabrication":
            case "space-biodome":
            case "space-exotic_lab":
                consume = [{res:"red_support",cost:-def.support}];
                break;
            case "space-red_factory":
                consume = [{res:"electricity",cost:def.powered()}];
                effectStr = def.effect();
                test = /-([\d\.]+) Helium/.exec(effectStr);
                consume.push({res:"Helium_3",cost:+test[1]});
                break;
            case "space-space_barracks":
                effectStr = def.effect();
                test = /-([\d\.]+) Oil/.exec(effectStr);
                consume = [{res:"Oil",cost:+test[1]}];
                test = /-([\d\.]+) (Food|Souls)/.exec(effectStr);
                consume.push({res:"Food",cost:+test[1]});
                break;
            case "city-mill":
                consume = [{res:"Food",cost:0.1}];
                break;
            case "city-tourist_center":
                effectStr = def.effect();
                test = /-([\d\.]+) (Food|Souls)/.exec(effectStr);
                consume = [{res:"Food",cost:+test[1]}];
                break;
            case "city-coal_power":
                effectStr = def.effect();
                test = /-([\d\.]+) Coal/.exec(effectStr);
                consume = [{res:"Coal",cost:+test[1]}];
                break;
            case "city-oil_power":
                effectStr = def.effect();
                test = /-([\d\.]+) Oil/.exec(effectStr);
                consume = [{res:"Oil",cost:+test[1]}];
                break;
            case "city-fission_power":
                effectStr = def.effect();
                test = /-([\d\.]+) Uranium/.exec(effectStr);
                consume = [{res:"Uranium",cost:+test[1]}];
                break;
            case "space-geothermal":
                effectStr = def.effect();
                test = /-([\d\.]+) Helium/.exec(effectStr);
                consume = [{res:"Helium_3",cost:+test[1]}];
                break;
            case "space-e_reactor":
                effectStr = def.effect();
                test = /-([\d\.]+) Elerium/.exec(effectStr);
                consume = [{res:"Elerium",cost:+test[1]}];
                break;
            case "space-moon_base":
            case "space-outpost":
                consume = [{res:"electricity",cost:def.powered()}];
                effectStr = def.effect();
                test = /-([\d\.]+) Oil/.exec(effectStr);
                consume.push({res:"Oil",cost:test[1]});
                break
            case "space-spaceport":
            case "space-space_station":
            case "interstellar-starport":
                consume = [{res:"electricity",cost:def.powered()}];
                effectStr = def.effect();
                test = /-([\d\.]+) Helium/.exec(effectStr);
                consume.push({res:"Helium_3",cost:test[1]});
                test = /-([\d\.]+) (Food|Souls)/.exec(effectStr);
                consume.push({res:"Food",cost:test[1]});
                break
            case "space-swarm_control":
                break;
            case "space-swarm_satellite":
                consume = [{res:"swarm_support",cost:1}];
                break;
            case "space-elerium_ship":
            case "space-iridium_ship":
            case "space-iron_ship":
                consume = [{res:"belt_support",cost:-def.support}];
                break;
            case "interstellar-mining_droid":
            case "interstellar-laboratory":
                consume = [{res:"alpha_support",cost:-def.support}];
                break;
            default:
                break;
        }
        return [consume,produce];
    }
    class PoweredBuilding extends Building {
        constructor(id, loc) {
            super(id, loc);
            if (!settings.actions[this.id].hasOwnProperty('powerPriority')) {settings.actions[this.id].powerPriority = 0;}
            try {
            [this.consume,this.produce] = getPowerData(id, this.def);
            //console.log(this.consume, this.produce);
            } catch(e) {
                console.log("Error loading power for ",this.id);
            }
        }

        get powerPriority() {return settings.actions[this.id].powerPriority;}
        set powerPriority(powerPriority) {settings.actions[this.id].powerPriority = powerPriority;}

        get powerUnlocked() {
            return checkPowerRequirements(this.def);
        }

        get incBtn() {
            return document.querySelector('#'+this.id+' > .on');
        }
        get decBtn() {
            return document.querySelector('#'+this.id+' > .off');
        }

        get numOn() {
            if (this.data === null) {
                return 0;
            }
            return this.data.on;
        }

        incPower() {
            if (this.incBtn === null) {return false;}
            this.incBtn.click();
            return true;
        }
        decPower() {
            if (this.decBtn === null) {return false;}
            this.decBtn.click();
            return true;
        }

        decPowerPriority() {
            if (this.powerPriority == 0) {return;}
            this.powerPriority -= 1;
            updateSettings();
            console.log("Decrementing Power Priority", this.id, this.powerPriority);
        }
        incPowerPriority() {
            if (this.powerPriority == 99) {return;}
            this.powerPriority += 1;
            updateSettings();
            console.log("Incrementing Priority", this.id, this.powerPriority);
        }
    }
    class SpaceDockBuilding extends Building {
        constructor(id, loc) {
            super(id, loc);
        }

        get unlocked() {
            return this.data !== undefined;
        }

        get data() {
            let [type, action] = this.id.split('-');
            return window.game.global['starDock'][action];
        }

        click() {
            if (!this.unlocked) {return false;}
            // Checking if modal already open
            if ($('.modal').length != 0) {
                return;
            }
            // Ensuring no modal conflicts
            if (modal) {return;}
            modal = true;
            // Opening modal
            $('#space-star_dock > .special').click();
            // Delaying for modal animation
            let tempID = this.id;
            setTimeout(function() {
                // Getting info
                let build = buildings[tempID];
                // Buying
                if (build.btn !== null) {
                    build.btn.getElementsByTagName("a")[0].click();
                }
                // Closing modal
                let closeBtn = $('.modal-close')[0];
                if (closeBtn !== undefined) {closeBtn.click();}
                modal = false;
            }, 100);
        }
    }
    var buildings = {};
    function loadBuildings() {
        if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
        // City
        for (var action in window.game.actions.city) {
            // Remove manual buttons
            if (action == 'food' || action == 'lumber' || action == 'stone' || action == 'slaughter') {continue;}
            if (action == 'basic_housing') {
                buildings['city-house'] = new Building('city-house', ['city']);
                continue;
            }
            if (window.game.actions.city[action].powered || window.game.actions.city[action].support) {
                //console.log(action,"POWER", window.game.actions.city[action].powered, "SUPPORT", window.game.actions.city[action].support);
                buildings['city-'+action] = new PoweredBuilding('city-'+action, ['city']);
                continue;
            }
            if (action == 'windmill') {
                //console.log(action,"POWER", window.game.actions.city[action].powered, "SUPPORT", window.game.actions.city[action].support);
                buildings['city-'+action] = new PoweredBuilding('city-'+action, ['city']);
                continue;
            }
            buildings['city-'+action] = new Building('city-'+action, ['city']);
        }
        // Space
        for (var location in window.game.actions.space) {
            for (var action in window.game.actions.space[location]) {
                // Remove info
                if (action == 'info') {continue;}
                if (window.game.actions.space[location][action].powered || window.game.actions.space[location][action].support) {
                    //console.log(action,"POWER", window.game.actions.space[location][action].powered, "SUPPORT", window.game.actions.space[location][action].support);
                    buildings['space-'+action] = new PoweredBuilding('space-'+action, ['space', location]);
                    continue;
                }
                buildings['space-'+action] = new Building('space-'+action, ['space', location]);
            }
        }
        // Star Dock
        for (var action in window.game.actions.starDock) {
            // Remove reset actions
            if (action == 'prep_ship' || action == 'launch_ship') {continue;}
            buildings['spcdock-'+action] = new SpaceDockBuilding('spcdock-'+action, ['starDock']);
        }
        // Interstellar
        for (var location in window.game.actions.interstellar) {
            for (var action in window.game.actions.interstellar[location]) {
                // Remove info
                if (action == 'info') {continue;}
                if (window.game.actions.interstellar[location][action].powered || window.game.actions.interstellar[location][action].support) {
                    buildings['interstellar-'+action] = new PoweredBuilding('interstellar-'+action, ['interstellar', location]);
                    continue;
                }
                buildings['interstellar-'+action] = new Building('interstellar-'+action, ['interstellar', location]);
            }
        }
        // Portal
        for (var location in window.game.actions.portal) {
            for (var action in window.game.actions.portal[location]) {
                // Remove info
                if (action == 'info') {continue;}
                if (window.game.actions.portal[location][action].powered || window.game.actions.portal[location][action].support) {
                    buildings['portal-'+action] = new PoweredBuilding('portal-'+action, ['portal', location]);
                    continue;
                }
                buildings['portal-'+action] = new Building('portal-'+action, ['portal', location]);
            }
        }
        console.log(buildings);
    }
    class Research extends Action {
        constructor(id, loc) {
            super(id, loc);
        }

        get researched() {
            let researched = $('#oldTech > div');
            for (let i = 0;i < researched.length;i++) {
                if (this.id == researched[i].id) {
                    return true;
                }
            }
            return false;
        }
    }
    var researches = {};
    function loadResearches() {
        if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
        // Tech
        for (var action in window.game.actions.tech) {
            // Because tech-exotic_lab has a different key than id
            if (action == "exotic_lab") {
                researches['tech-energy_lab'] = new Research('tech-energy_lab', ['tech']);
                continue;
            }
            if (action == "fortifications") {
                researches['tech-fort'] = new Research('tech-fort', ['tech']);
                continue;
            }
            researches['tech-'+action] = new Research('tech-'+action, ['tech']);
        }
        // Space
    }
    class MiscAction extends Action {
        constructor(id) {
            super(id, ['misc']);
        }
    }
    class ArpaAction extends MiscAction {
        constructor(id, res) {
            super(id);
            this.loc.push('arpa');
            this.res = res;
        }

        get label() {
            return document.querySelector('#arpa'+this.id+' > .head > .desc');
        }
        get btn() {
            return document.querySelector('#arpa'+this.id+' > div.buy > button.button.x25');
        }
        get rankLabel() {
            return document.querySelector('#arpa'+this.id+' > .head > .rank');
        }

        get name() {
            if (this.label === null) {
                return this.id;
            }
            return this.label.innerText;
        }

        get rank() {
            if (window.game.global.arpa[this.id] !== undefined) {
                return window.game.global.arpa[this.id].rank
            }
            return 0;
        }

        getResDep(resid) {
            if (this.res === null) {
                return null;
            }
            return this.res[resid] * (1.05 ** this.rank) / 4;
        }

        click() {
            if (this.btn !== null) {
                this.btn.click();
                return true;
            } else {
                return false;
            }
        }

    }
    class MonumentAction extends ArpaAction {
        constructor(id) {
            super(id, {});
        }

        click() {
            if (this.btn !== null) {
                this.btn.click();
                setTimeout(loadMonumentRes, 500);
                return true;
            } else {
                return false;
            }
        }
    }
    var arpas = {};
    function loadMonumentRes() {
        if (arpas.monument.label !== null) {
            switch(arpas.monument.label.innerText) {
                case "Obelisk":
                    {
                        arpas.monument.res = {Stone:1000000};
                        break;
                    }
                case "Statue":
                    {
                        arpas.monument.res = {Aluminium:350000};
                        break;
                    }
                case "Sculpture":
                    {
                        arpas.monument.res = {Steel:300000};
                        break;
                    }
                case "Monolith":
                    {
                        arpas.monument.res = {Cement:300000};
                        break;
                    }
            }
        }
    }
    function loadArpas() {
        if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
        arpas.lhc = new ArpaAction('lhc',
                                   {Money:2500000,
                                   Knowledge:500000,
                                   Copper:125000,
                                   Cement:250000,
                                   Steel:187500,
                                   Titanium:50000,
                                   Polymer:12000});
        arpas.stock_exchange = new ArpaAction('stock_exchange',
                                              {Money:3000000,
                                               Plywood:25000,
                                               Brick:20000,
                                               Wrought_Iron:10000});
        arpas.launch_facility = new ArpaAction('launch_facility',
                                        {Money:2000000,
                                        Knowledge:500000,
                                        Cement:150000,
                                        Oil:20000,
                                        Sheet_Metal:15000,
                                        Alloy:25000});
        arpas.monument = new MonumentAction('monument');
        loadMonumentRes();
    }
    class StorageAction extends MiscAction {
        constructor(id, res) {
            super(id);
            this.loc.push('storage');
            this.res = res;
        }

        get countLabel() {
            return document.querySelector('#cnt'+this.name+'s');
        }
        get btn() {
            let div = document.querySelector('.'+this.id.toLowerCase());
            if (div === null) {return null;}
            return div.children[0];
        }

        get unlocked() {
            if (this.id == 'Crate') {
                return researched('tech-containerization');
            } else {
                return researched('tech-steel_containers');
            }
        }

        get name() {
            return this.id.charAt(0).toUpperCase() + this.id.slice(1)
        }

        get full() {
            if (this.countLabel !== null) {
                let data = this.countLabel.innerText.split(' / ');
                return (parseInt(data[0]) == parseInt(data[1]));
            } else {
                console.log("Error:", this.id, "Full");
                return true;
            }
        }

        getResDep(resid) {
            if (this.res === null) {
                return null;
            }
            return this.res[resid];
        }

        click() {
            let btn = this.btn;
            if (btn === null) {return false;}
            for (let i = 0;i < 10;i++) {
                btn.click();
            }
            return true;
        }
    }
    var storages = {};
    function loadStorages() {
        if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
        storages.Crate = new StorageAction('Crate',
                                           (resources.Lumber.unlocked) ?
                                           {Plywood:100}
                                           :
                                           {Stone:2000});
        storages.Container = new StorageAction('Container',
                                               {Steel:1250});
    }
    class GeneAction extends MiscAction {
        constructor(id) {
            super(id);
            this.res = {Knowledge:200000};
        }

        get btn() {
            let btn = $("#arpaSequence > span > button").not(".has-text-success");
            return (btn.length) ? btn[0] : null;
        }

        get unlocked() {
            return this.btn !== null;
        }

        get name() {
            return "Assemble Gene";
        }

        getResDep(resid) {
            if (this.res === null) {
                return null;
            }
            return this.res[resid];
        }

        click() {
            let btn = this.btn;
            if (btn === null) {return false;}
            btn.click();
            return true;
        }
    }
    class MercenaryAction extends MiscAction {
        constructor(id) {
            super(id);
            this.loc.push('mercenary');
            this.res = {};
        }

        get btn() {
            let btn = $('button.first');
            return (btn.length) ? btn[0] : null;
        }

        get unlocked() {
            return this.btn !== null;
        }

        get name() {
            return "Hire Garrison Mercenary";
        }

        getResDep(resid) {
            let str = $('.hire > span')[0].attributes['data-label'].value;
            let val = /[^\d]*([\d]+)[^\d]*/.exec(str);
            this.res.Money = val[1];
            if (this.res === null) {
                return null;
            }
            return this.res[resid];
        }

        click() {
            let soldiers = soldierCount();
            if (soldiers[0] === soldiers[1]) {return false;}
            let btn = this.btn;
            if (btn === null) {return false;}
            btn.click();
            return true;
        }
    }
    class FortressMercenaryAction extends MercenaryAction {
        constructor(id) {
            super(id);
        }

        get btn() {
            let btn = $('button.merc');
            return (btn.length) ? btn[0] : null;
        }

        get name() {
            return "Hire Fortress Mercenary";
        }
    }
    var miscActions = {};
    function loadMiscActions() {
        if (!settings.hasOwnProperty('actions')) {settings.actions = {};}
        miscActions.Gene = new GeneAction("Gene");
        miscActions.Mercenary = new MercenaryAction("Mercenary");
        miscActions.FortressMercenary = new FortressMercenaryAction("FortressMercenary");
    }

    class Job {
        constructor(id, priority) {
            this.id = id;
            if (!settings.jobs.hasOwnProperty(this.id)) {settings.jobs[this.id] = {};}
            if (!settings.jobs[this.id].hasOwnProperty('priority')) {settings.jobs[this.id].priority = priority;}
        }

        get _priority() {return settings.jobs[this.id].priority;}
        set _priority(priority) {settings.jobs[this.id].priority = priority;}

        get label() {
            return document.querySelector('#civ-'+this.id+' > .job_label > h3');
        }
        get hireBtn() {
            return document.querySelector('#civ-'+this.id+' > .controls > .add');
        }
        get fireBtn() {
            return document.querySelector('#civ-'+this.id+' > .controls > .sub');
        }

        get name() {
            return window.game.global.civic[this.id].name;
        }

        get employed() {
            return window.game.global.civic[this.id].workers;
        }
        get maxEmployed() {
            return window.game.global.civic[this.id].max;
        }

        get priority() {
            return this._priority;
        }

        lowerPriority() {
            if (this._priority == 0) {return;}
            this._priority -= 1;
            updateSettings();
            console.log("Lowering", this.name, "Priority", this._priority);
        }
        higherPriority() {
            if (this._priority == 99) {return;}
            this._priority += 1;
            updateSettings();
            console.log("Increasing", this.name, "Priority", this._priority);
        }

        get unlocked() {
            return window.game.global.civic[this.id].display;
        }

        hire(num) {
            if (num === undefined) {num = 1;}
            if (this.hireBtn !== null) {
                disableMult();
                for (let i = 0;i < num;i++) {
                    this.hireBtn.click();
                }
                return true;
            } else {
                return false;
            }
        }
        fire(num) {
            if (num === undefined) {num = 1;}
            if (this.fireBtn !== null) {
                disableMult();
                for (let i = 0;i < num;i++) {
                    this.fireBtn.click();
                }
                return true;
            } else {
                return false;
            }
        }

        updateUI() {
            if (!this.unlocked) {return;}
            let priorityLabel = document.getElementById(this.id+"_priority")
            priorityLabel.removeChild(priorityLabel.firstChild);
            priorityLabel.appendChild(document.createTextNode(this.priority));
        }
    }
    class Unemployed extends Job {
        constructor(id, priority) {
            super(id, priority);
        }

        get priority() {
            if (this.name == 'Hunter') {
                return this._priority;
            } else {
                return 0;
            }
        }

        get name() {
            if (this.label !== null) {
                return this.label.innerText;
            } else {
                return this.id;
            }
        }

        get employed() {
            return window.game.global.civic[this.id];
        }
        get maxEmployed() {
            return -1;
        }

        get unlocked() {
            return true;
        }

        updateUI() {
            if (this.name != 'Hunter') {return;}
            super.updateUI();
        }
    }
    class Craftsman extends Job {
        constructor(id, priority) {
            super(id, priority);
        }

        get mainDiv() {
            return document.getElementById('foundry');
        }
        get hireBtn() {
            return document.querySelector('#foundry .job:nth-child(2) > .controls > .add')
        }
        get fireBtn() {
            return document.querySelector('#foundry .job:nth-child(2) > .controls > .sub')
        }

        get unlocked() {
            return (civicsOn() && this.mainDiv !== null && this.mainDiv.children.length > 0);
        }

    }
    var jobs = {};
    function loadJobs() {
        if (!settings.hasOwnProperty('jobs')) {settings.jobs = {};}
        jobs.free = new Unemployed('free', 0);
        for (var x in window.game.global.civic) {
            if (window.game.global.civic[x].hasOwnProperty('job')) {
                if (x == 'craftsman') {
                    jobs[x] = new Craftsman(x, 0);
                }
                else {
                    jobs[x] = new Job(x, 0);
                }
            }
        }
    }
    class CraftJob extends Job {
        constructor(id, priority) {
            super(id, priority);
        }

        get mainDiv() {
            return document.getElementById('craft'+this.id);
        }
        get label() {
            return document.querySelector('#craft'+this.id+' > h3');
        }
        get hireBtn() {
            return document.getElementById('craft'+this.id).parentNode.children[1].children[1];
        }
        get fireBtn() {
            return document.getElementById('craft'+this.id).parentNode.children[1].children[0];
        }

        get name() {
            if (this.label !== null) {
                return this.label.innerText;
            } else {
                return this.id;
            }
        }

        get unlocked() {
            return (civicsOn() && this.mainDiv !== null && this.mainDiv.style.display != 'none');
        }

        get employed() {
            return window.game.global.city.foundry[this.id];
        }
        get maxEmployed() {
            return -1;
        }
    }
    var craftJobs = {};
    function loadCraftJobs() {
        if (!settings.hasOwnProperty('jobs')) {settings.jobs = {};}
        Object.keys(window.game.global.resource).forEach(function(res) {
            // Craftable Resources
            if (window.game.craftCost[res] !== undefined) {
                craftJobs[res] = new CraftJob(res, 5);
            }
        });
    }

    let foodBtn = null;
    let lumberBtn = null;
    let stoneBtn = null;
    let rnaBtn = null;
    let dnaBtn = null;
    let slaughterBtn = null;
    function loadFarm () {
        try {
            foodBtn = document.getElementById("city-food").getElementsByTagName("a")[0];
        } catch(e) {
            //console.log("Error: Food button could not be loaded");
        }
        try {
            lumberBtn = document.getElementById("city-lumber").getElementsByTagName("a")[0];
        } catch(e) {
            //console.log("Error: Lumber button could not be loaded");
        }
        try {
            stoneBtn = document.getElementById("city-stone").getElementsByTagName("a")[0];
        } catch(e) {
            //console.log("Error :Stone button could not be loaded");
        }
        try {
            rnaBtn = document.getElementById("evo-rna").getElementsByTagName("a")[0];
        } catch(e) {
            //console.log("Error: RNA button could not be loaded");
        }
        try {
            dnaBtn = document.getElementById("evo-dna").getElementsByTagName("a")[0];
        } catch(e) {
            //console.log("Error :DNA button could not be loaded");
        }
        try {
            slaughterBtn = document.getElementById("city-slaughter").getElementsByTagName("a")[0];
        } catch(e) {
            //console.log("Error :DNA button could not be loaded");
        }
    }

    function loadSmelter() {
        if (!settings.hasOwnProperty('smelterSettings')) {settings.smelterSettings = {};}
        if (!settings.smelterSettings.hasOwnProperty('interval')) {settings.smelterSettings.interval = 20;}
        if (!settings.smelterSettings.hasOwnProperty('Iron')) {settings.smelterSettings.Iron = 2;}
        if (!settings.smelterSettings.hasOwnProperty('Steel')) {settings.smelterSettings.Steel = 3;}
    }
    function loadFactory() {
        if (!settings.hasOwnProperty('factorySettings')) {settings.factorySettings = {};}
        if (!settings.factorySettings.hasOwnProperty('interval')) {settings.factorySettings.interval = 23;}
        if (!settings.factorySettings.hasOwnProperty('Luxury_Goods')) {settings.factorySettings.Luxury_Goods = 0;}
        if (!settings.factorySettings.hasOwnProperty('Alloy')) {settings.factorySettings.Alloy = 3;}
        if (!settings.factorySettings.hasOwnProperty('Polymer')) {settings.factorySettings.Polymer = 3;}
        if (!settings.factorySettings.hasOwnProperty('Nano_Tube')) {settings.factorySettings.Nano_Tube = 7;}
        if (!settings.factorySettings.hasOwnProperty('Stanene')) {settings.factorySettings.Stanene = 4;}
    }

    /***
    *
    * Settings
    *
    ***/

    function loadSettings() {
        console.log("Loading Settings");
        // Evolution
        loadEvolution();
        // Farm
        loadFarm();
        // Resources
        loadResources();
        // Storages
        try { loadStorages(); } catch(e) {}
        // Misc Actions
        loadMiscActions();
        // Buildings
        loadBuildings();
        // Jobs
        loadJobs();
        loadCraftJobs();
        // Research
        loadResearches();
        // ARPA
        loadArpas();
        // Smelter
        loadSmelter();
        // Factory
        loadFactory();

        if (!settings.hasOwnProperty('autoPrint')) {
            settings.autoPrint = true;
        }
        if (!settings.hasOwnProperty('autoFarm')) {
            settings.autoFarm = false;
        }
        if (!settings.hasOwnProperty('autoRefresh')) {
            settings.autoRefresh = false;
        }
        if (!settings.hasOwnProperty('autoPrestige')) {
            settings.autoPrestige = false;
        }

        if (!settings.hasOwnProperty('autoEvolution')) {
            settings.autoEvolution = false;
        }
        for (let i = 0;i < evoChallengeActions.length;i++) {
            if (!settings.hasOwnProperty(evoChallengeActions[i])) {
                settings[evoChallengeActions[i]] = false;
            }
        }
        if (!settings.hasOwnProperty('evolution')) {
            settings.evolution = "antid";
        }

        if (!settings.hasOwnProperty('autoTax')) {
            settings.autoTax = false;
        }
        if (!settings.hasOwnProperty('minimumMorale')) {
            settings.minimumMorale = 100;
        }
        if (!settings.hasOwnProperty('autoEmploy')) {
            settings.autoEmploy = false;
        }
        if (!settings.hasOwnProperty('autoBattle')) {
            settings.autoBattle = false;
        }
        if (!settings.hasOwnProperty('minWinRate')) {
            settings.minWinRate = 60;
        }
        if (!settings.hasOwnProperty('maxCampaign')) {
            settings.maxCampaign = 4;
        }
        if (!settings.hasOwnProperty('woundedCheck')) {
            settings.woundedCheck = false;
        }
        if (!settings.hasOwnProperty('autoFortress')) {
            settings.autoFortress = false;
        }

        if (!settings.hasOwnProperty('autoCraft')) {
            settings.autoCraft = false;
        }
        if (!settings.hasOwnProperty('autoMarket')) {
            settings.autoMarket = false;
        }
        if (!settings.hasOwnProperty('marketVolume')) {
            settings.marketVolume = 1;
        }
        if (!settings.hasOwnProperty('minimumMoney')) {
            settings.minimumMoney = 0;
        }
        if (!settings.hasOwnProperty('autoTrade')) {
            settings.autoTrade = false;
        }
        if (!settings.hasOwnProperty('autoStorage')) {
            settings.autoStorage = false;
        }

        if (!settings.hasOwnProperty('autoSupport')) {
            settings.autoSupport = false;
        }
        if (!settings.hasOwnProperty('autoSmelter')) {
            settings.autoSmelter = false;
        }
        if (!settings.hasOwnProperty('autoFactory')) {
            settings.autoFactory = false;
        }
        if (!settings.hasOwnProperty('autoDroid')) {
            settings.autoDroid = false;
        }
        if (!settings.hasOwnProperty('autoGraphene')) {
            settings.autoGraphene = false;
        }

        if (!settings.hasOwnProperty('fanORanth')) {
            settings.fanORanth = "fanaticism";
        }
        if (!settings.hasOwnProperty('studyORdeify')) {
            settings.studyORdeify = "study";
        }
        if (!settings.hasOwnProperty('uniChoice')) {
            settings.uniChoice = 'unify';
        }

        if (!settings.hasOwnProperty('autoPriority')) {
            settings.autoPriority = false;
        }
        if (!settings.hasOwnProperty('showAll')) {
            settings.showAll = false;
        }
        if (!settings.hasOwnProperty('showBuilding')) {
            settings.showBuilding = false;
        }
        if (!settings.hasOwnProperty('showResearch')) {
            settings.showResearch = false;
        }
        if (!settings.hasOwnProperty('showMisc')) {
            settings.showMisc = false;
        }

        if (!settings.hasOwnProperty('log')) {settings.log = []};
    }
    loadSettings();

    function updateSettings(){
        localStorage.setItem('settings', JSON.stringify(settings));
    }
    function importSettings() {
        console.log("Importing Settings");
        if ($('textarea#settingsImportExport').val().length > 0){
            let settingStr = $('textarea#settingsImportExport').val();
            settings = JSON.parse(LZString.decompressFromBase64(settingStr));
            updateSettings();
            resetUI();
        }
    }
    function exportSettings() {
        console.log("Exporting Settings");
        $('textarea#settingsImportExport').val(LZString.compressToBase64(JSON.stringify(settings)));
        $('textarea#settingsImportExport').select();
        document.execCommand('copy');
    }

    /***
    *
    * automation functions
    *
    ***/

    function farm() {
        if(foodBtn!==null){foodBtn.click();}
        if(lumberBtn!==null){lumberBtn.click();}
        if(stoneBtn!==null){stoneBtn.click();}
        if(rnaBtn!==null){rnaBtn.click();}
        if(dnaBtn!==null){dnaBtn.click();}
        if(slaughterBtn!==null){slaughterBtn.click();}
    }

    let farmInterval = null;
    function autoFarm() {
        if(settings.autoFarm && farmInterval === null) {
            farmInterval = setInterval(farm, 10);
        } else {
            if (!settings.autoFarm && !(farmInterval === null)) {
                clearInterval(farmInterval);
                farmInterval = null;
            }
        }
    }

    let refreshInterval = null;
    function autoRefresh() {
        if(settings.autoRefresh && refreshInterval === null) {
            refreshInterval = setInterval(function() {location.reload();}, 200 * 1000);
        } else {
            if (!settings.autoRefresh && !(refreshInterval === null)) {
                clearInterval(refreshInterval);
                refreshInterval = null;
            }
        }
    }

    function autoEvolution() {
        let actions = document.querySelectorAll('#evolution .action');
        let chosenAction = null;
        let chosenPriority = 0;
        for (let i = 0; i < actions.length; i++) {
            // Checking if purchasable
            let action = actions[i];
            // Not purchasable
            if (action.className.indexOf("cna") >= 0) {continue;}
            // Farming button
            if(evoFarmActions.includes(action.id)) {continue;}
            // Reached max in maxEvo
            if(action.id in maxEvo && parseInt($('#'+action.id+' > a > .count')[0].innerText) >= maxEvo[action.id]) {continue;}
            // Don't take planets
            if(/\w+\d+/.exec(action.id) !== null) {continue;}
            // Don't take universes
            if (evoUniverses.includes(action.id)) {continue;}
            // Check for challenge runs
            if (evoChallengeActions.includes(action.id) && !settings[action.id]) {continue;}
            // Checking for race decision tree
            if(evoRaceActions.includes(action.id) && !evoRaceTrees[settings.evolution].includes(action.id)) {continue;}
            let newPriority = 0;
            if (evoChallengeActions.includes(action.id)) {
                newPriority = 10;
            } else if (evoRaceActions.includes(action.id)) {
                newPriority = 5;
            } else if (action.id == 'evo-sentience') {
                newPriority = 1;
            } else {
                newPriority = 20;
            }
            if (newPriority > chosenPriority) {
                chosenPriority = newPriority;
                chosenAction = action;
            }
        }
        if (chosenAction !== null) {
            chosenAction.children[0].click();
        }
    }

    function autoCraft() {
        //console.log("AutoCrafting");
        for (var x in resources) {
            if (resources[x] instanceof CraftableResource) {
                resources[x].craft();
            }
        }
    }

    function autoStorage() {
        // Don't do autoStorage if haven't unlocked storage
        if (!researched('tech-containerization')) {return;}
        // Finding values
        let totalCrates = parseInt($('#cntCrates')[0].innerText.split(' / ')[0]);
        let totalContainers = parseInt($('#cntContainers')[0].innerText.split(' / ')[0]);
        // Creating crateable object
        let storage = {}
        for (var x in resources) {
            if (resources[x].crateable) {storage[x]=resources[x];}
        }
        for (var x in storage) {
            totalCrates += storage[x].crateNum;
            totalContainers += storage[x].containerNum;
        }

        //console.log("Current Crate Usage", totalCrates);
        //console.log("Current Container Usage", totalContainers);

        // Getting total priority
        let totalPriority = 0;
        for (x in storage) {totalPriority += storage[x].storePriority}
        // Calculating crate differentials
        for (x in storage) {
            storage[x].wanted_crates = Math.round(totalCrates * storage[x].storePriority / totalPriority);
            storage[x].wanted_crates = Math.max(storage[x].wanted_crates, storage[x].storeMin);
            storage[x].needed_crates = storage[x].wanted_crates - storage[x].crateNum;
            storage[x].wanted_containers = Math.round(totalContainers * storage[x].storePriority / totalPriority);
            storage[x].needed_containers = storage[x].wanted_containers - storage[x].containerNum;
            //console.log(x, "CR_WANT", storage[x].wanted_crates, "CR_NEED", storage[x].needed_crates, "CO_WANT", storage[x].wanted_containers, "CO_NEED", storage[x].needed_containers);
        }
        // Removing extra storage
        let excessStorage = [];
        for (x in storage) {
            if (storage[x].needed_crates < 0) {
                storage[x].crateDec(-storage[x].needed_crates);
            }
            if (researched('tech-steel_containers') && storage[x].needed_containers < 0) {
                storage[x].containerDec(-storage[x].needed_containers);
            }
        }
        for (x in storage) {
            if (storage[x].needed_crates > 0) {
                storage[x].crateInc(storage[x].needed_crates);
            }
            if (researched('tech-steel_containers') && storage[x].needed_containers > 0) {
                storage[x].containerInc(storage[x].needed_containers);
            }
        }
    }

    function getWounded() {
        return window.game.global.civic.garrison.wounded;
    }
    function getTotalSoldiers() {
        return window.game.global.civic.garrison.max;
    }
    function getFortressSoldiers() {
        if (window.game.global.portal.hasOwnProperty('fortress')) {
            return window.game.global.portal.fortress.assigned;
        }
        return 0;
    }
    function getMaxSoldiers() {
        return getTotalSoldiers() - getFortressSoldiers();
    }
    function getAvailableSoldiers() {
        if (window.game.global.portal.hasOwnProperty('fortress')) {
            return window.game.global.civic.garrison.workers - window.game.global.portal.fortress.assigned;
        }
        return window.game.global.civic.garrison.workers;
    }
    function getCurrentSoldiers() {
        return window.game.global.civic.garrison.raid;
    }
    function armyRating() {
        let armyRating = document.querySelector('#garrison > .header > span >  span:nth-child(2)');
        if (armyRating === null) {return 0;}
        return parseInt(armyRating);
    }
    function decCampaign(num) {
        num = (num === undefined) ? 1 : num;
        let decCampaignBtn = document.querySelector('#tactics > .sub');
        if (decCampaignBtn === null) {return;}
        disableMult();
        for (let i = 0;i < num;i++) {
            decCampaignBtn.click();
        }
    }
    function incCampaign(num) {
        num = (num === undefined) ? 1 : num;
        let incCampaignBtn = document.querySelector('#tactics > .add');
        if (incCampaignBtn === null) {return;}
        disableMult();
        for (let i = 0;i < num;i++) {
            incCampaignBtn.click();
        }
    }
    function getCurrentCampaign() {
        return window.game.global.civic.garrison.tactic;
    }
    function addSoldiers(num) {
        num = num ? num : 1;
        let btn = document.querySelector('#battalion > .add');
        if (btn === null) {return;}
        disableMult();
        for (let i = 0;i < num;i++) {
            btn.click();
        }
    }
    function subSoldiers(num) {
        num = num ? num : 1;
        let btn = document.querySelector('#battalion > .sub');
        if (btn === null) {return;}
        disableMult();
        for (let i = 0;i < num;i++) {
            btn.click();
        }
    }
    function getWinRate() {
        let span = document.querySelector('#garrison > div:nth-child(4) > div:nth-child(2) > span');
        if (span === null) {return 0;}
        span = span.attributes['data-label'].value;
        span = /([\d\.]+)% ([\w])+/.exec(span);
        let [ meh, winRate, advantage] = span;
        winRate = parseFloat(winRate);
        winRate *= (advantage == 'advantage') ? 1 : -1;
        return parseFloat(span[1]);
    }
    function runCampaign() {
        let btn = document.querySelector('#garrison > div:nth-child(4) > div:nth-child(2) > span > button');
        if (btn === null) {return;}
        btn.click();
    }
    let armyStatus = false;
    let armySetupStage = 0;
    let chosenCampaign = false;
    function battle() {
        // Don't autoBattle if garrison not unlocked
        if (!researched('tech-garrison')) {return;}
        // Don't autoBattle if unified
        if (window.game.global.tech['world_control']) {return;}
        // If army isn't ready, wait until it is
        let avaSoldiers = getAvailableSoldiers();
        let maxSoldiers = getMaxSoldiers();
        let wounded = getWounded();
        let healthy = getTotalSoldiers() - wounded;
        //console.log(avaSoldiers, maxSoldiers, wounded);
        // Determining of army is ready
        if (avaSoldiers && avaSoldiers == maxSoldiers) {
            if (!(settings.woundedCheck && wounded > 0)) {
                armyStatus = true;
            }
        } else {
            armyStatus = false;
            chosenCampaign = false;
            armySetupStage = 0;
        }
        // Army is ready
        if (armyStatus) {
            switch(armySetupStage) {
                // Initial Stage
                case 0: {
                    // Setting campaign to max campaign setting
                    decCampaign(4);
                    incCampaign(settings.maxCampaign);
                    // Setting army size to max
                    addSoldiers(maxSoldiers);
                    armySetupStage += 1;
                    //console.log("Campaign Ready - Setting up soldiers");
                    break;
                }
                // Decrement Stage
                case 1: {
                    // Checking winrate
                    let winrate = getWinRate();
                    // Lower Win Rate
                    if (winrate <= settings.minWinRate) {
                        // Checking if campaign chosen
                        if (chosenCampaign) {
                            //console.log("Chosen Campaign", getCurrentCampaign(), "Win", winrate, settings.minWinRate);
                            addSoldiers();
                            if (getCurrentSoldiers() < healthy) {
                                runCampaign();
                            }
                            armyStatus = false;
                            chosenCampaign = false;
                            armySetupStage = 0;
                        }
                        // Campaign not chosen yet
                        else {
                            if (getCurrentCampaign() == 0) {
                                //console.log("Cannot beat Ambush, resetting army algorithm");
                                armyStatus = false;
                                chosenCampaign = false;
                                armySetupStage = 0;
                            } else {
                                //console.log("Cannot win at this campaign", getCurrentCampaign(), " decrementing campaign");
                                decCampaign();
                            }
                        }
                    }
                    // Higher Win Rate
                    else {
                        //console.log("Can win at this campaign",getCurrentCampaign(),"subtracting soldiers");
                        chosenCampaign = true;
                        subSoldiers();
                        if (getCurrentSoldiers() == 0) {
                            addSoldiers();
                            if (getCurrentSoldiers() < healthy) {
                                runCampaign();
                            }
                            armyStatus = false;
                            chosenCampaign = false;
                            armySetupStage = 0;
                        }
                    }
                    break;
                }
            }

        }
    }
    let battleInterval = null;
    function autoBattle() {
        if(settings.autoBattle && battleInterval === null) {
            battleInterval = setInterval(battle, 25);
        } else {
            if (!settings.autoBattle && !(battleInterval === null)) {
                clearInterval(battleInterval);
                battleInterval = null;
            }
        }
    }

    function autoEmploy(priorityData) {
        let sortedJobs = [];
        var x;
        let population = 0;
        let totalPriority = 0;
        let priorities = [];
        let ratios = [];
        for (x in jobs) {
            if (jobs[x].unlocked) {
                sortedJobs.push(jobs[x]);
                population += jobs[x].employed;
                totalPriority += jobs[x].priority;
                priorities.push(jobs[x].priority);
            }
        }
        for (let i = 0;i < sortedJobs.length;i++) {
            ratios.push(sortedJobs[i].priority / totalPriority);
        }

        // Allocating jobs
        let maxCheck = function(index, allocation) {
            if (sortedJobs[index].maxEmployed != -1 && sortedJobs[index].maxEmployed == allocation) {
                return true;
            }
            return false;
        };
        let allocation = allocate(population,priorities,ratios,maxCheck);
        //console.log(allocation);

        // Firing extra employees
        for (let i = 0;i < allocation.alloc.length;i++) {
            //console.log(i, sortedJobs[i].name, sortedJobs[i].employed, "->", allocation.alloc[i]);
            if (sortedJobs[i].employed > allocation.alloc[i]) {
                sortedJobs[i].fire(sortedJobs[i].employed - allocation.alloc[i]);
            }
        }
        // Hiring required employees
        for (let i = 0;i < allocation.alloc.length;i++) {
            if (sortedJobs[i].employed < allocation.alloc[i]) {
                sortedJobs[i].hire(allocation.alloc[i] - sortedJobs[i].employed);
            }
        }

        // Allocating craftsman
        if (!jobs.craftsman.unlocked) {return;}
        //console.log("Divying up Craftsman");
        // Delay to get new craftman number
        setTimeout(function() {
            let totalCraftsman = 0;
            let totalPriority = 0;
            let cjobs = [];
            let priorities = [];
            let ratios = [];
            // Finding availible craftsman positions, as well as total priority and craftsman numbers
            for (x in craftJobs) {
                if (!craftJobs[x].unlocked) {continue;}
                cjobs.push(craftJobs[x]);
                totalPriority += craftJobs[x].priority;
                totalCraftsman += craftJobs[x].employed;
                priorities.push(craftJobs[x].priority);
            }
            // Calculating wanted ratios
            for (let i = 0;i < cjobs.length;i++) {
                ratios.push(cjobs[i].priority / totalPriority);
            }
            // Optimizing craftsman placement
            let allocation = allocate(totalCraftsman,priorities,ratios);

            // Firing all unneeded
            for (let i = 0;i < cjobs.length;i++) {
                if (allocation.alloc[i] < cjobs[i].employed) {
                    cjobs[i].fire(cjobs[i].employed - allocation.alloc[i]);
                }
            }
            // Hiring all needed
            for (let i = 0;i < cjobs.length;i++) {
                if (allocation.alloc[i] > cjobs[i].employed) {
                    cjobs[i].hire(allocation.alloc[i] - cjobs[i].employed);
                }
            }
        }, 25);
    }

    let moraleLabel = $('#morale').children(1)[0];
    let incTaxBtn = $('#tax_rates > .add');
    let decTaxBtn = $('#tax_rates > .sub');
    function getCurrentMorale() {
        let totalMorale = 100;
        for (var x in window.game.global.city.morale) {
            if (x == 'current') {continue;}
            totalMorale += window.game.global.city.morale[x];
        }
        return totalMorale;
    }
    function getMaxMorale() {
        let maxMorale = 100;
        maxMorale += buildings['city-amphitheatre'].numTotal;
        maxMorale += buildings['city-casino'].numTotal;
        maxMorale += buildings['space-vr_center'].numOn * 2;
        if (researched('tech-superstars')) {maxMorale += window.game.global.civic.entertainer.workers;}
        maxMorale += arpas['monument'].rank * 2;
        if (window.game.global.civic.taxes.tax_rate < 20){
            maxMorale += 10 - Math.floor(window.game.global.civic.taxes.tax_rate / 2);
        }
        return maxMorale;
    }
    function autoTax(priorityData) {
        // Don't start taxes if haven't researched
        if (!researched('tech-tax_rates')) {return;}
        let morale = getCurrentMorale();
        let maxMorale = getMaxMorale();
        //console.log(morale, maxMorale);
        // Setting to lowest taxes to get the max morale bonus (since taxes aren't needed)
        if (resources.Money.ratio == 1) {
            for (let i = 0;i < 50;i++) {
                decTaxBtn.click();
            }
        }
        // Currently above max Morale
        else if (morale >= maxMorale) {
            for (let i = 0;i < morale - maxMorale;i++) {
                incTaxBtn.click();
            }
        }
        // Currently below minimum Morale
        else if (morale <= settings.minimumMorale) {
            for (let i = 0;i < settings.minimumMorale - morale;i++) {
                decTaxBtn.click();
            }
        } else {
            if (resources.Money.ratio < 0.5) {
                incTaxBtn.click();
            }
            else {
                decTaxBtn.click();
            }
        }
    }

    function autoMarket() {
        // Don't start autoMarket if haven't unlocked market
        if (!researched('tech-market')) {return;}
        let curMoney = resources.Money.amount;
        let maxMoney = resources.Money.storage;
        let multipliers = $('#market-qty').children();
        // If multipliers don't exist (aka cannot manual buy/sell) don't autoMarket
        if (multipliers === null || multipliers === undefined || multipliers.length == 0) {return;}
        let curMarketVolume = Math.min(settings.marketVolume,multipliers.length);
        multipliers[curMarketVolume].click();
        let qty = 25;
        switch(curMarketVolume) {
            case 1: qty = 10; break;
            case 2: qty = 25; break;
            case 3: qty = 100; break;
            case 4: qty = 250; break;
            case 5: qty = 1000; break;
            case 6: qty = 2500; break;
            case 7: qty = 10000; break;
            case 8: qty = 25000; break;
        }
        setTimeout(function(){ //timeout needed to let the click on multiplier take effect
            for (var x in resources) {
                let resource = resources[x];
                // Continue if resource hasn't been unlocked
                if(!resource.unlocked) {continue;}
                // Continue if resource isn't tradeable
                if(!(resource instanceof TradeableResource)) {continue;}

                //console.log("Auto Market", resource.name);
                let curResource = resource.amount;
                let maxResource = resource.storage;
                // Can sell resource
                //console.log(resource.id, resource.ratio, resource.sellRatio);
                if (resource.autoSell && resource.ratio > resource.sellRatio && resource.sellBtn !== null) {
                    //console.log("Autoselling", resource.name);
                    let sellValue = getRealValue(resource.sellBtn.innerHTML.substr(1));
                    let counter = 0;
                    //console.log("CURM:", curMoney, "sellV", sellValue, "MAXM", maxMoney, "CURR", curResource, "MAXR", maxResource);
                    while(true) {
                        // Break if too much money, not enough resources, or sell ratio reached
                        if (curMoney + sellValue >= maxMoney || curResource - qty <= 0 || curResource / maxResource < resource.sellRatio) {
                            //console.log("Sold", counter*100);
                            break;
                        }
                        counter += 1;
                        resource.sellBtn.click();
                        curMoney += sellValue;
                        curResource -= qty;
                    }
                }

                if (resource.autoBuy && resource.ratio < resource.buyRatio && resource.buyBtn !== null) {
                    //console.log("Autobuying", resource.name);
                    let buyValue = getRealValue(resource.buyBtn.innerHTML.substr(1));
                    //console.log("CURM:", curMoney, "sellV", buyValue, "MAXM", maxMoney, "CURR", curResource, "MAXR", maxResource, "MINM", getMinMoney());
                    while(true) {
                        // Break if too little money, too much resources, or buy ratio reached
                        if (curMoney - buyValue < getMinMoney() || curResource + qty > resource.storage || curResource / maxResource > resource.buyRatio) {
                            break;
                        }
                        resource.buyBtn.click();
                        curMoney -= buyValue;
                        curResource += qty;
                    }
                }
            }
        }, 25);
    }

    function autoSmelter(limits) {
        // Don't Auto smelt if not unlocked
        if (!researched('tech-steel')) {return;}
        // Checking if modal already open
        if ($('.modal').length != 0) {
            return;
        }
        // Ensuring no modal conflicts
        if (modal) {return;}
        modal = true;
        //console.log("Auto Smelting");
        // Opening modal
        $('#city-smelter > .special').click();
        // Delaying for modal animation
        setTimeout(function() {
            // Finding relevent elements
            let decBtns = $('#specialModal > .fuels > .sub');
            let incBtns = $('#specialModal > .fuels > .add');
            let labels = $('#specialModal > .fuels > span > .current');
            let lumberInc = null; let lumberDec = null; let coalInc = null; let coalDec = null; let oilInc = null; let oilDec = null;
            let lumberNum = null; let coalNum = null; let oilNum = null; let lumberFuel = null; let coalFuel = null; let oilFuel = null;
            // Determining which fuel types are available
            if (decBtns.length == 2) {
                // Only two buttons. Either Ent type race  with Coal/Oil, or haven't unlocked oil yet
                if (!resources.Oil.unlocked) {
                    // Oil not unlocked, thus two buttons mean Lumber/Coal
                    lumberInc = incBtns[0];
                    lumberDec = decBtns[0];
                    let temp = labels[0].attributes[0].value;
                    lumberFuel = parseFloat(/Consume ([\d\.]+).*/.exec(temp)[1]);
                    lumberNum = parseInt(/\w+ ([\d]+)/.exec(labels[0].innerText)[1]);
                    coalInc = incBtns[1];
                    coalDec = decBtns[1];
                    temp = labels[1].attributes[0].value;
                    coalFuel = parseFloat(/Burn ([\d\.]+).*/.exec(temp)[1]);
                    coalNum = parseInt(/Coal ([\d]+)/.exec(labels[1].innerText)[1]);
                } else {
                    // Must be Ent type race with Coal/Oil
                    coalInc = incBtns[0];
                    coalDec = decBtns[0];
                    let temp = labels[0].attributes[0].value;
                    coalFuel = parseFloat(/Burn ([\d\.]+).*/.exec(temp)[1]);
                    coalNum = parseInt(/Coal ([\d]+)/.exec(labels[0].innerText)[1]);
                    oilInc = incBtns[1];
                    oilDec = decBtns[1];
                    temp = labels[1].attributes[0].value;
                    oilFuel = parseFloat(/Burn ([\d\.]+).*/.exec(temp)[1]);
                    oilNum = parseInt(/Oil ([\d]+)/.exec(labels[1].innerText)[1]);
                }
            } else {
                // Three buttons means all fuels unlocked
                lumberInc = incBtns[0];
                lumberDec = decBtns[0];
                let temp = labels[0].attributes[0].value;
                lumberFuel = parseFloat(/Consume ([\d\.]+).*/.exec(temp)[1]);
                lumberNum = parseInt(/\w+ ([\d]+)/.exec(labels[0].innerText)[1]);
                coalInc = incBtns[1];
                coalDec = decBtns[1];
                temp = labels[1].attributes[0].value;
                coalFuel = parseFloat(/Burn ([\d\.]+).*/.exec(temp)[1]);
                coalNum = parseInt(/Coal ([\d]+)/.exec(labels[1].innerText)[1]);
                oilInc = incBtns[2];
                oilDec = decBtns[2];
                temp = labels[2].attributes[0].value;
                oilFuel = parseFloat(/Burn ([\d\.]+).*/.exec(temp)[1]);
                oilNum = parseInt(/Oil ([\d]+)/.exec(labels[2].innerText)[1]);
            }
            //console.log("L", lumberNum, lumberFuel, "C", coalNum, coalFuel, "O", oilNum, oilFuel);
            if (lumberNum !== null) {resources.Lumber.temp_rate += lumberFuel * lumberNum;}
            if (coalNum !== null) {resources.Coal.temp_rate += coalFuel * coalNum;}
            if (oilNum !== null) {resources.Oil.temp_rate += oilFuel * oilNum;}
            // Finding iron/steel buttons
            let ironBtn = $('#specialModal > .smelting > span > button')[0];
            let steelBtn = $('#specialModal > .smelting > span > button')[1];
            let ironNum = $('#specialModal > .smelting > span')[0].innerText;
            let steelNum = $('#specialModal > .smelting > span')[1].innerText;
            ironNum = parseInt(/Iron Smelting: ([\d]+)/.exec(ironNum)[1]);
            steelNum = parseInt(/Steel Smelting: ([\d]+)/.exec(steelNum)[1]);
            let ironVal = $('#specialModal > .smelting > span')[0].attributes[0].value;
            let steelVal = $('#specialModal > .smelting > span')[1].attributes[0].value;
            let ironPercent = parseInt(/[^\d]+([\d]+)%/.exec(ironVal)[1]);
            let temp = /[^\d\.]*([\d\.]+)[^\d\.]*([\d\.]+)[^\d\.]*([\d\.]+)[^\d\.]*/.exec(steelVal);
            let steelCoalFuel = parseFloat(temp[1]);
            let steelIronFuel = parseFloat(temp[2]);;
            let steelProduce = parseFloat(temp[3]);;
            //console.log("Iron", ironNum, ironPercent, "Steel", steelNum, steelIronFuel, steelCoalFuel, steelProduce);
            resources.Iron.temp_rate += steelIronFuel * steelNum;
            resources.Coal.temp_rate += steelCoalFuel * steelNum;
            resources.Steel.temp_rate -= steelProduce * steelNum;
            resources.Iron.temp_rate /= (1 + ironPercent*ironNum / 100);
            // Calculating changes
            let totalSmelters = buildings['city-smelter'].numTotal;
            let wantedIron = 0;
            let wantedSteel = 0;
            if (limits.Iron === null) {
                // Does not require iron, max out steel regardless
                wantedSteel = totalSmelters;
            } else {
                if (limits.Steel !== null) {
                    // Requires both, find ratio
                    wantedIron = Math.floor(limits.Iron.priority / (limits.Iron.priority + limits.Steel.priority));
                    wantedSteel = totalSmelters - wantedIron;
                } else {
                    // Requires only iron, max out
                    wantedIron = totalSmelters;
                }
            }
            // Calculating Fuel
            let wantedLumber = 0;
            let wantedCoal = 0;
            let wantedOil = 0;
            let wantedTotal = totalSmelters;
            // Oil unlocked and not needed
            if (limits.Oil === null && oilInc !== null) {
                wantedOil = Math.floor(resources.Oil.temp_rate / oilFuel);
                wantedOil = (wantedOil > wantedTotal) ? wantedTotal : wantedOil;
                wantedTotal -= wantedOil;
            }
            // Coal unlocked and not needed
            if (limits.Coal === null && coalInc !== null) {
                // If Ent type race, fill rest with coal
                if (lumberInc === null) {
                    wantedCoal = wantedTotal;
                } else {
                    wantedCoal = Math.floor(resources.Coal.temp_rate / coalFuel);
                    wantedCoal = (wantedCoal > wantedTotal) ? wantedTotal : wantedCoal;
                    wantedTotal -= wantedCoal;
                }
            }
            // Fill the rest with lumber
            if (lumberInc !== null) {
                wantedLumber = wantedTotal;
            }

            //console.log("L", wantedLumber, "C", wantedCoal, "O", wantedOil, "I", wantedIron,"S", wantedSteel);
            let pos_coal_rate = resources.Coal.temp_rate - wantedCoal*coalFuel - wantedSteel*steelCoalFuel;
            //console.log(pos_coal_rate, resources.Coal, resources.Coal.temp_rate, coalFuel, steelCoalFuel)
            while(pos_coal_rate < 0) {
                console.log("L", wantedLumber, "C", wantedCoal, "O", wantedOil, "I", wantedIron,"S", wantedSteel, "CR", pos_coal_rate);
                // Try getting rid of coal
                if (wantedCoal > 0) {
                    wantedCoal -= 1;
                    if (lumberInc !== null) {
                        // Put into lumber if exists
                        wantedLumber += 1;
                    } else {
                        // Nothing to put into, get rid of one
                        if (wantedSteel > 0) {
                            wantedSteel -= 1;
                        } else {
                            wantedIron -= 1;
                        }
                    }
                } else if (wantedSteel > 0) {
                    wantedSteel -= 1;
                    wantedIron += 1;
                } else {
                    break;
                }
                pos_coal_rate = resources.Coal.temp_rate - wantedCoal*coalFuel - wantedSteel*steelCoalFuel;
            }
            let pos_iron_rate = resources.Iron.temp_rate * (1 + ironPercent*wantedIron / 100) - wantedSteel*steelIronFuel;
            while(pos_iron_rate < 0) {
                //console.log("L", wantedLumber, "C", wantedCoal, "O", wantedOil, "I", wantedIron,"S", wantedSteel, "IR", pos_iron_rate);
                // Get rid of some steel
                if (wantedSteel > 0) {
                    wantedSteel -= 1;
                    wantedIron += 1;
                } else {
                    break;
                }
                pos_iron_rate = resources.Iron.temp_rate * (1 + ironPercent*wantedIron / 100) - wantedSteel*steelIronFuel;
            }
            //console.log("L", wantedLumber, "C", wantedCoal, "O", wantedOil, "I", wantedIron,"S", wantedSteel);
            // Removing all settings
            for (let i = 0;i < totalSmelters;i++) {
                if (lumberDec !== null) {lumberDec.click();}
                if (coalDec !== null) {coalDec.click();}
                if (oilDec !== null) {oilDec.click();}
                ironBtn.click();
            }
            for (let i = 0;i < wantedLumber;i++) {lumberInc.click();}
            for (let i = 0;i < wantedCoal;i++) {coalInc.click();}
            for (let i = 0;i < wantedOil;i++) {oilInc.click();}
            for (let i = 0;i < wantedSteel;i++) {steelBtn.click();}
            // Closing modal
            let closeBtn = $('.modal-close')[0];
            if (closeBtn !== undefined) {closeBtn.click();}
            modal = false;
        }, 100);
    }

    function autoFactory(limits) {
        // Don't Auto factory if not unlocked
        if (!researched('tech-industrialization')) {return;}
        // Don't Auto factory if you don't have any
        if (buildings['city-factory'].numTotal < 1) {return;}
        // Checking if modal already open
        if ($('.modal').length != 0) {
            return;
        }
        // Ensuring no modal conflicts
        if (modal) {return;}
        modal = true;
        //console.log("Auto Factory");
        // Opening modal
        $('#city-factory > .special').click();
        // Delaying for modal animation
        setTimeout(function() {
            // Finding relevent elements
            let decBtns = $('#specialModal > div > .sub');
            let incBtns = $('#specialModal > div > .add');
            let labels = $('#specialModal > div > span.current');
            let datas = $('#specialModal > div > span.is-primary');
            let luxNum = null; let alloyNum = null; let polymerNum = null; let nanoTubeNum = null;
            let luxFurCost = null; let luxMoneyProduct = null;
            let alloyCopperCost = null; let alloyAluminiumCost = null;
            let polymerOilCost = null; let polymerLumberCost = null;
            let nanoTubeCoalCost = null; let nanoTubeNeutroniumCost = null;
            // Getting Data values
            if (decBtns.length > 0) {
                let str = datas[0].attributes['data-label'].value;
                let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)/.exec(str)
                luxFurCost = temp[1];
                luxMoneyProduct = temp[2];
                luxNum = +labels[0].innerText
            }
            if (decBtns.length > 1) {
                let str = datas[1].attributes['data-label'].value;
                let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)[^\d\.]+/.exec(str)
                alloyCopperCost = temp[1];
                alloyAluminiumCost = temp[2];
                alloyNum = +labels[1].innerText
            }
            if (decBtns.length > 2) {
                let str = datas[2].attributes['data-label'].value;
                let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)[^\d\.]+/.exec(str)
                polymerOilCost = temp[1];
                polymerLumberCost = temp[2];
                polymerNum = +labels[2].innerText
            }
            if (decBtns.length > 3) {
                let str = datas[3].attributes['data-label'].value;
                let temp = /[^\d\.]+([\d\.]+)[^\d\.]+([\d\.]+)[^\d\.]+/.exec(str)
                nanoTubeCoalCost = temp[1];
                nanoTubeNeutroniumCost = temp[2];
                nanoTubeNum = +labels[3].innerText
            }
            console.log("L", luxNum, luxFurCost, luxMoneyProduct, "A", alloyNum, alloyCopperCost, alloyAluminiumCost, "P", polymerNum, polymerOilCost, polymerLumberCost, "N", nanoTubeNum, nanoTubeCoalCost ,nanoTubeNeutroniumCost);
            // Resetting temp rates
            if (luxNum !== null) {resources.Money.temp_rate -= luxMoneyProduct * luxNum; resources.Furs.temp_rate += luxFurCost * luxNum;}
            if (alloyNum !== null) {resources.Copper.temp_rate += alloyCopperCost * alloyNum; resources.Aluminium.temp_rate += alloyAluminiumCost * alloyNum;}
            if (polymerNum !== null) {resources.Oil.temp_rate += polymerOilCost * polymerNum; resources.Lumber.temp_rate += polymerLumberCost * polymerNum;}
            if (nanoTubeNum !== null) {resources.Coal.temp_rate += nanoTubeCoalCost * nanoTubeNum; resources.Neutronium.temp_rate += nanoTubeNeutroniumCost * nanoTubeNum;}
            // TODO: Alloy/Polymer/Nanotube production numbers aren't reset, since their numbers can't be found in the data values. Some how find this info
            // Calculating changes
            let totalFactories = buildings['city-factory'].numOn + buildings['space-red_factory'].numOn
            let wantedLux = 0; let luxPriority = 0;
            let wantedAlloy = 0; let alloyPriority = 0;
            let wantedPolymer = 0; let polymerPriority = 0;
            let wantedNanoTube = 0; let nanoTubePriority = 0;
            let totalPriority = 0;
            if (limits.Money !== null && limits.Money !== undefined && settings.factorySettings.Luxury_Goods) {luxPriority = limits.Money.priority * settings.factorySettings.Luxury_Goods; totalPriority += luxPriority; }
            if (limits.Alloy !== null && limits.Alloy !== undefined && settings.factorySettings.Alloy) {alloyPriority = limits.Alloy.priority * settings.factorySettings.Alloy; totalPriority += alloyPriority;}
            if (limits.Polymer !== null && limits.Polymer !== undefined && settings.factorySettings.Polymer) {polymerPriority = limits.Polymer.priority * settings.factorySettings.Polymer; totalPriority += polymerPriority;}
            if (limits.Nano_Tube !== null && limits.Nano_Tube !== undefined && settings.factorySettings.Nano_Tube) {nanoTubePriority = limits.Nano_Tube.priority * settings.factorySettings.Nano_Tube; totalPriority += nanoTubePriority;}
            console.log("L", luxPriority, "A", alloyPriority, "P", polymerPriority, "N", nanoTubePriority);
            // Creating allocation list
            let prioMultipliers = [settings.factorySettings.Luxury_Goods, settings.factorySettings.Alloy, settings.factorySettings.Polymer, settings.factorySettings.Nano_Tube];
            let allocation = [];
            for (let i = 0;i < totalFactories;i++) {
                // Attempting to allocate
                // Must be possible (positive temp_rates), as well as lowers ratio error
                let posAllocation = null
                let posAllocationError = 1e10;
                for (let j = 0;j < decBtns.length;j++) {
                    let tempError = 0;
                    switch(j) {
                        case 0: {
                            // Luxury Goods
                            if (luxPriority > 0 && resources.Furs.temp_rate > luxFurCost) {
                                tempError += ((wantedLux+1)/(i+1) - luxPriority/totalPriority)**2
                                tempError += ((wantedAlloy)/(i+1) - alloyPriority/totalPriority)**2
                                tempError += ((wantedPolymer)/(i+1) - polymerPriority/totalPriority)**2
                                tempError += ((wantedNanoTube)/(i+1) - nanoTubePriority/totalPriority)**2
                                tempError += .0000000001;
                            } else if (luxPriority > 0 && resources.Furs.temp_rate > luxFurCost) {
                                tempError = 1e10 / prioMultipliers[0];
                            }
                            break;
                        }
                        case 1: {
                            // Alloy
                            if (alloyPriority > 0 && resources.Copper.temp_rate > alloyCopperCost && resources.Aluminium.temp_rate > alloyAluminiumCost) {
                                tempError += ((wantedLux)/(i+1) - luxPriority/totalPriority)**2
                                tempError += ((wantedAlloy+1)/(i+1) - alloyPriority/totalPriority)**2
                                tempError += ((wantedPolymer)/(i+1) - polymerPriority/totalPriority)**2
                                tempError += ((wantedNanoTube)/(i+1) - nanoTubePriority/totalPriority)**2
                                tempError += .0000000001;
                            } else if (alloyPriority > 0 && resources.Copper.temp_rate > alloyCopperCost && resources.Aluminium.temp_rate > alloyAluminiumCost) {
                                tempError = 1e10 / prioMultipliers[1];
                            }
                            break;
                        }
                        case 2: {
                            // Polymer
                            if (polymerPriority > 0 && resources.Oil.temp_rate > polymerOilCost && resources.Lumber.temp_rate > polymerLumberCost) {
                                tempError += ((wantedLux)/(i+1) - luxPriority/totalPriority)**2
                                tempError += ((wantedAlloy)/(i+1) - alloyPriority/totalPriority)**2
                                tempError += ((wantedPolymer+1)/(i+1) - polymerPriority/totalPriority)**2
                                tempError += ((wantedNanoTube)/(i+1) - nanoTubePriority/totalPriority)**2
                                tempError += .0000000001;
                            } else if (polymerPriority > 0 && resources.Oil.temp_rate > polymerOilCost && resources.Lumber.temp_rate > polymerLumberCost) {
                                tempError = 1e10 / prioMultipliers[2];
                            }
                            break;
                        }
                        case 3: {
                            // Nano Tubes
                            console.log(nanoTubePriority, resources.Coal.temp_rate, resources.Neutronium.temp_rate);
                            if (nanoTubePriority > 0 && resources.Coal.temp_rate > nanoTubeCoalCost && resources.Neutronium.temp_rate > nanoTubeNeutroniumCost) {
                                tempError += ((wantedLux)/(i+1) - luxPriority/totalPriority)**2
                                tempError += ((wantedAlloy)/(i+1) - alloyPriority/totalPriority)**2
                                tempError += ((wantedPolymer)/(i+1) - polymerPriority/totalPriority)**2
                                tempError += ((wantedNanoTube+1)/(i+1) - nanoTubePriority/totalPriority)**2
                                tempError += .0000000001;
                            } else if (nanoTubePriority > 0 && resources.Coal.temp_rate > nanoTubeCoalCost && resources.Neutronium.temp_rate > nanoTubeNeutroniumCost) {
                                tempError = 1e10 / prioMultipliers[3];
                            }
                            break;
                        }
                        default:
                            break;
                    }
                    // Availible Choice
                    console.log(j, tempError)
                    if (tempError != 0) {
                        if (tempError < posAllocationError) {
                            posAllocation = j;
                            posAllocationError = tempError;
                        }
                    } else {
                        continue;
                    }
                }
                if (posAllocation === null) {
                    break;
                } else {
                    allocation.push(posAllocation);
                    switch(posAllocation) {
                        case 0: {wantedLux += 1; resources.Furs.temp_rate -= luxFurCost; break;}
                        case 1: {wantedAlloy += 1; resources.Copper.temp_rate -= alloyCopperCost; resources.Aluminium.temp_rate -= alloyAluminiumCost; break;}
                        case 2: {wantedPolymer += 1; resources.Oil.temp_rate -= polymerOilCost; resources.Lumber.temp_rate -= polymerLumberCost; break;}
                        case 3: {wantedNanoTube += 1; resources.Coal.temp_rate -= nanoTubeCoalCost; resources.Neutronium.temp_rate -= nanoTubeNeutroniumCost; break;}
                        default: break;
                    }
                }
            }
            console.log("L",wantedLux,"A",wantedAlloy,"P",wantedPolymer,"N",wantedNanoTube);
            console.log(allocation);
            // Removing all settings
            for (let i = 0;i < totalFactories;i++) {
                decBtns.click();
            }
            for (let i = 0;i < allocation.length;i++) {
                incBtns[allocation[i]].click();
            }
            // Closing modal
            let closeBtn = $('.modal-close')[0];
            if (closeBtn !== undefined) {closeBtn.click();}
            modal = false;
        }, 100);
    }

    function isFuelProducer(building) {
        let fuels = ['Coal', 'Oil', 'Uranium', 'Helium_3','Elerium'];
        let yes = false;
        for (let i = 0;i < building.produce.length;i++) {
            if (resources[building.produce[i].res] !== undefined) {
                if (building.produce[i].res in fuels) {
                    yes = true;
                }
            }
        }
        return yes;
    }
    function autoSupport(priorityData) {
        // Don't start autoSupport if haven't unlocked power
        if (!researched('tech-electricity')) {return;}
        let x;
        // Getting support categories
        let maximize = []; let maximize_want = [];
        let electricityConsumers = []; let electricityConsumers_want = [];
        let passiveProducers = [];
        let moonConsumers = []; let moonConsumers_want = [];
        let redConsumers = []; let redConsumers_want = [];
        let beltConsumers = []; let beltConsumers_want = [];
        let swarmConsumers = []; let swarmConsumers_want = [];
        for (x in buildings) {
            // Ignore not unlocked buildings
            if (!buildings[x].unlocked) {continue;}
            // Ignore not power unlocked buildings
            if (!buildings[x].powerUnlocked) {continue;}
            // Ignore non-powered buildings
            if (!(buildings[x] instanceof PoweredBuilding)) {continue;}
            // Reverting consumption/production
            for (let i = 0;i < buildings[x].consume.length;i++) {
                if (resources[buildings[x].consume[i].res] !== undefined) {
                    resources[buildings[x].consume[i].res].temp_rate += buildings[x].numOn * buildings[x].consume[i].cost;
                }
                else {

                }
            }
            for (let i = 0;i < buildings[x].produce.length;i++) {
                if (resources[buildings[x].produce[i].res] !== undefined) {
                    resources[buildings[x].produce[i].res].temp_rate -= buildings[x].numOn * buildings[x].produce[i].cost * getMultiplier(buildings[x].produce[i].res) * getMultiplier('Global');
                }
                else {

                }
            }
            // Splitting buildings by type
            if (buildings[x].consume.length >= 2) {
                // Multiple consumptions means a complex powered building
                maximize.push(buildings[x]);
                maximize_want.push(0);
            } else if (buildings[x].consume.length == 0) {
                // No consumption means building's always on
                passiveProducers.push(buildings[x]);
            } else if (resources[buildings[x].consume[0].res] !== undefined) {
                // Resource consumer
                maximize.push(buildings[x]);
                maximize_want.push(0);
            } else if (isFuelProducer(buildings[x])) {
                // Resource producer
                maximize.push(buildings[x]);
                maximize_want.push(0);
            } else if (buildings[x].consume[0].res == "electricity") {
                // Electricity consumer
                electricityConsumers.push(buildings[x]);
                electricityConsumers_want.push(0);
            } else if (buildings[x].consume[0].res == "moon_support") {
                // Moon Support consumer
                moonConsumers.push(buildings[x]);
                moonConsumers_want.push(0);
            } else if (buildings[x].consume[0].res == "red_support") {
                // Red Support consumer
                redConsumers.push(buildings[x]);
                redConsumers_want.push(0);
            } else if (buildings[x].consume[0].res == "belt_support") {
                // Belt Support consumer
                beltConsumers.push(buildings[x]);
                beltConsumers_want.push(0);
            } else if (buildings[x].consume[0].res == "swarm_support") {
                // Swarm Support consumer
                swarmConsumers.push(buildings[x]);
                swarmConsumers_want.push(0);
            }
        }

        //console.log("Max",maximize);
        //console.log("Passive",passiveProducers);
        //console.log("Electricity", electricityConsumers);
        //console.log("Moon", moonConsumers);
        //console.log("Red", redConsumers);
        //console.log("Belt", beltConsumers);

        let support = {
            electricity:0,
            moon_support:0,
            red_support:0,
            swarm_support:0,
            belt_support:0
        }

        // Add all passive producers
        for (let i = 0;i < passiveProducers.length;i++) {
            let pp = passiveProducers[i];
            for (let j = 0;j < pp.produce.length;j++) {
                if (resources[pp.produce[j].res] !== undefined) {
                    resources[pp.produce[j].res].temp_rate += pp.numTotal * pp.produce[j].cost;
                } else {
                    support[pp.produce[j].res] += pp.numTotal * pp.produce[j].cost;
                }
            }
        }
        // Add all swarm support (since it's only one thing

        // Maximizing the maximize category
        maximize.sort(function(a,b) {return b.powerPriority - a.powerPriority;});
        let update = true;
        // Looping until cannot turn on any more buildings
        while(true) {
            update = false;
            // Looping to find building to turn on
            for (let i = 0;i < maximize.length;i++) {
                let building = maximize[i];
                if (maximize_want[i] == building.numTotal) {continue;}
                let canTurnOn = true;
                // Checking if this building can be turned on by resources
                for (let j = 0;j < building.consume.length;j++) {
                    let res = building.consume[j].res;
                    let cost = building.consume[j].cost;
                    if (resources[res] !== undefined) {
                        //console.log("Checking",building.id,"RES",res.id,res.temp_rate,cost);
                        if (res.temp_rate < cost) {
                            canTurnOn = false;
                        }
                    } else {
                        if (support[res] < cost) {
                            canTurnOn = false;
                        }
                    }
                }
                if (canTurnOn) {
                    // Turning on building
                    update = true;
                    maximize_want[i] += 1;
                    for (let j = 0;j < building.consume.length;j++) {
                        let res = building.consume[j].res;
                        let cost = building.consume[j].cost;
                        if (resources[res] !== undefined) {
                            res.temp_rate -= cost;
                        } else {
                            support[res] -= cost;
                        }
                    }
                    for (let j = 0;j < building.produce.length;j++) {
                        let res = building.produce[j].res;
                        let cost = building.produce[j].cost;
                        if (resources[res] !== undefined) {
                            res.temp_rate += cost;
                        } else {
                            support[res] += cost;
                        }
                    }
                    //console.log("Turning on", building.id, maximize_want[i], building.numTotal);
                    break;
                }
            }
            if (!update) {
                break;
            }
        }
        console.log(maximize, maximize_want);
        electricityConsumers.sort(function(a,b) {return b.powerPriority - a.powerPriority;});
        if (electricityConsumers.length) {
            while (support.electricity > 0) {
                update = false;
                // Looping to find building to turn on
                for (let i = 0;i < electricityConsumers.length;i++) {
                    let building = electricityConsumers[i];
                    if (electricityConsumers_want[i] == building.numTotal) {continue;}
                    let canTurnOn = true;
                    // Checking if this building can be turned on by resources
                    for (let j = 0;j < building.consume.length;j++) {
                        let res = building.consume[j].res;
                        let cost = building.consume[j].cost;
                        if (resources[res] !== undefined) {
                            //console.log("Checking",building.id,"RES",res.id,res.temp_rate,cost);
                            if (res.temp_rate < cost) {
                                canTurnOn = false;
                            }
                        } else {
                            if (support[res] < cost) {
                                canTurnOn = false;
                            }
                        }
                    }
                    if (canTurnOn) {
                        // Turning on building
                        update = true;
                        electricityConsumers_want[i] += 1;
                        for (let j = 0;j < building.consume.length;j++) {
                            let res = building.consume[j].res;
                            let cost = building.consume[j].cost;
                            if (resources[res] !== undefined) {
                                res.temp_rate -= cost;
                            } else {
                                support[res] -= cost;
                            }
                        }
                        for (let j = 0;j < building.produce.length;j++) {
                            let res = building.produce[j].res;
                            let cost = building.produce[j].cost;
                            if (resources[res] !== undefined) {
                                res.temp_rate += cost;
                            } else {
                                support[res] += cost;
                            }
                        }
                        //console.log("Turning on", building.id, maximize_want[i], building.numTotal);
                        break;
                    }
                }
                if (!update) {
                    break;
                }
            }
        }
        console.log(electricityConsumers,electricityConsumers_want);
        for (let i = 0;i < maximize.length;i++) {
            if (maximize[i].numOn < maximize_want[i]) {
                for (let j = 0;j < maximize_want[i] - maximize[i].numOn;j++) {
                    maximize[i].incPower();
                }
            } else {
                for (let j = 0;j < maximize[i].numOn - maximize_want[i];j++) {
                    maximize[i].decPower();
                }
            }
        }
        for (let i = 0;i < electricityConsumers.length;i++) {
            if (electricityConsumers[i].numOn < electricityConsumers_want[i]) {
                for (let j = 0;j < electricityConsumers_want[i] - electricityConsumers[i].numOn;j++) {
                    electricityConsumers[i].incPower();
                }
            } else {
                for (let j = 0;j < electricityConsumers[i].numOn - electricityConsumers_want[i];j++) {
                    electricityConsumers[i].decPower();
                }
            }
        }
        console.log(support)
        // Optimizing each support
    }

    function prioCompare(a, b) {
        return b.priority - a.priority;
    }
    function getAvailableBuildings() {
        let build = [];
        for (var x in buildings) {
            // Don't check buildings that aren't unlocked
            if (!buildings[x].unlocked) {continue;}
            // Don't check buildings that aren't enabled
            if (!buildings[x].enabled) {continue;}
            // Don't check buildings that met their limit
            if (buildings[x].limit != -1 && buildings[x].numTotal >= buildings[x].limit) {continue;}
            // Don't check buildings that can't be bought
            let btn = document.getElementById(buildings[x].id);
            // If button doesn't exist but it's a space dock building, bring it anyways
            if (btn === null && (x=='spcdock-probes'||x=='spcdock-seeder')) {build.push(buildings[x]);continue;}
            if (btn.className.indexOf('cnam') >= 0) {continue;}
            build.push(buildings[x]);
        }
        //console.log(build);
        return build;
    }
    function getAvailableResearches() {
        let research = [];
        for (var x in researches) {
            // Don't check researches that aren't unlocked
            if (!researches[x].unlocked) {continue;}
            // Don't check researches that aren't enabled
            if (!researches[x].enabled) {continue;}
            // Don't check researches that have already been researched
            if (researches[x].researched) {continue;}
            // Don't check researches that can't be bought
            let btn = document.getElementById(researches[x].id);
            if (btn.className.indexOf('cnam') >= 0) {continue;}
            // Research filters
            if(researches[x].id == "tech-fanaticism" && settings.fanORanth == "anthropology") {continue;}
            if(researches[x].id == "tech-anthropology" && settings.fanORanth == "fanaticism") {continue;}
            // Checking if study/deify ancients
            if(researches[x].id == "tech-study" && settings.studyORdeify == "deify") {continue;}
            if(researches[x].id == "tech-deify" && settings.studyORdeify == "study") {continue;}
            // Checking if unification
            if(researches[x].id.indexOf("wc") >= 0) {
                if (settings.uniChoice == 'unify') {
                    if (researches[x].id == 'tech-wc_reject') {continue;}
                } else {
                    if (researches[x].id == 'tech-wc_conquest' || researches[x].id == 'tech-wc_morale' || researches[x].id == 'tech-wc_money') {continue;}
                }
            }
            research.push(researches[x]);
        }
        //console.log(research);
        return research;
    }
    function getAvailableArpas() {
        let arpa = [];
        for (var x in arpas) {
            // Don't add ARPAs that are not unlocked
            if (!arpas[x].unlocked) {continue;}
            // Don't add ARPAs that are not enabled
            if (!arpas[x].enabled) {continue;}
            arpa.push(arpas[x]);
        }
        return arpa;
    }
    function getAvailableStorages() {
        let store = [];
        for (var x in storages) {
            // Don't add if not unlocked
            if (!storages[x].unlocked) {continue;}
            // Don't add if not enabled
            if (!storages[x].enabled) {continue;}
            // Don't add if no more space
            if (storages[x].full) {continue;}
            store.push(storages[x]);
        }
        return store;
    }
    function getAvailableMiscActions() {
        let misc = [];
        for (var x in miscActions) {
            // Don't add if not unlocked
            if (!miscActions[x].unlocked) {continue;}
            // Don't add if disabled
            if (!miscActions[x].enabled) {continue;}
            misc.push(miscActions[x]);
        }
        return misc;
    }
    function getAvailableActions() {
        // Getting buildings and researches
        let actions = getAvailableBuildings().concat(getAvailableResearches()).concat(getAvailableArpas()).concat(getAvailableStorages()).concat(getAvailableMiscActions());

        for (let i = 0;i < actions.length;i++) {
            actions[i].completion = {};
            actions[i].completionTime = {};
            actions[i].maxCompletionTime = 0;
            actions[i].limitingRes = null;
            actions[i].keptRes = {};
        }
        return actions;
    }
    function getAvailableResources() {
        let res = [];
        for (var x in resources) {
            if (!resources[x].unlocked) {continue;}
            res.push(resources[x]);
        }
        return res;
    }
    function autoPriority(count) {
        // Finding available actions
        let actions = getAvailableActions();
        //console.log(actions);

        // Storing temporary rates
        for (var x in resources) {
            resources[x].temp_rate = resources[x].rate;
        }

        // Removing trade routes (if exists) for accurate rate
        if (settings.autoTrade && researched('tech-trade')) {
            // Clearing out trade routes
            for (x in resources) {
                let resource = resources[x];
                resource.temp_rate = resource.rate;
                if (!(resource instanceof TradeableResource)) {continue;}
                if (resource.tradeNum < 0) {
                    for (let i = 0;i < -resource.tradeNum;i++) {
                        resource.tradeInc();
                        resource.temp_rate += resource.tradeAmount;
                        resources.Money.temp_rate -= resource.tradeSellCost;
                    }
                } else {
                    for (let i = 0;i < resource.tradeNum;i++) {
                        resource.tradeDec();
                        resource.temp_rate -= resource.tradeAmount;
                        resources.Money.temp_rate += resource.tradeBuyCost;
                    }
                }
            }
        }

        // Create priority queues for resources
        let res = getAvailableResources();
        let PQs = {}
        let limits = {}
        // Creating priority queues for each resource
        for (let i = 0;i < res.length;i++) {
            let curRes = res[i];
            let pq = [];
            // Checking each action for resource dependence
            for (let j = 0;j < actions.length;j++) {
                let cost = actions[j].getResDep(curRes.id);
                if (cost !== null && cost !== NaN && cost > 0) {
                    pq.push(actions[j]);
                    // Setting up completion attribute
                    actions[j].completion[curRes.id.toLowerCase()] = false;
                }
            }
            // Sorting actions by scaled priority
            pq.sort(function(a,b) {
                let aCost = priorityScale(a.getResDep(curRes.id), a.priority, a);
                let bCost = priorityScale(b.getResDep(curRes.id), b.priority, b);
                return aCost > bCost;
            });

            // Finding completion time and limiting resource
            for (let j = 0;j < pq.length;j++) {
                let action = pq[j];
                // Already completed with current resources
                // Scaling by 1.01 for rounding error
                if (curRes.amount >= action.getResDep(curRes.id)) {
                    action.completionTime[curRes.id] = 0;
                } else {
                    let time = (action.getResDep(curRes.id) - curRes.amount) / curRes.temp_rate;
                    time = (time < 0) ? 1 : time;
                    action.completionTime[curRes.id] = time;
                    //console.log(action.id, curRes.id, action.getResDep(curRes.id), curRes.amount, curRes.temp_rate, time);
                    if (time > action.maxCompletionTime) {
                        action.maxCompletionTime = time;
                        action.limitingRes = curRes.id;
                    }
                }

            }
            PQs[curRes.id] = pq;
        }

        // Determining completion
        for (let i = 0;i < res.length;i++) {
            let curRes = res[i];
            let pq = PQs[curRes.id];
            limits[curRes.id] = null;
            // Determining resource completion
            // Resource filled, set all to completion
            if (!(curRes instanceof CraftableResource) && curRes.ratio > 0.99) {
                //console.log(curRes.id, "ratio > 0.99. Set all to complete");
                for (let j = 0;j < pq.length;j++) {
                    pq[j].completion[curRes.id.toLowerCase()] = true;
                }
            // Resource not full, allocate until reached action not filled.
            } else {
                let curAmount = curRes.amount;
                //console.log(curRes.id, curAmount);
                for (let j = 0;j < pq.length;j++) {
                    let action = pq[j];
                    //console.log(pq[j].id, pq[j].getResDep(curRes.id) , curAmount);
                    if (action.getResDep(curRes.id) <= curAmount) {
                        // Action can be achieved with this resource
                        action.completion[curRes.id.toLowerCase()] = true;
                        // Determining how much of the resource to save for this action
                        /*
                        let giveAmount = (action.maxCompletionTime - action.completionTime[curRes.id]) * curRes.temp_rate;
                        let give = Math.min(giveAmount,curAmount);
                        action.keptRes[curRes.id] = curAmount - give;
                        curAmount = give;
                        */

                        if (action.limitingRes == curRes.id) {
                            // This resource is the limiting factor, give nothing to the next actions
                            action.keptRes[curRes.id] = action.getResDep(curRes.id);
                            curAmount -= action.keptRes[curRes.id];
                        } else {
                            // This resource isn't the limiting factor, give some leeway
                            // Higher priority, less leeway given
                            // Limiting resource will take a long time to complete, give more leeway
                            let priorityFactor = 1 / (1.0 + Math.exp(-0.1 * action.priority));
                            let timeFactor = Math.exp(-.005 * action.maxCompletionTime);
                            action.keptRes[curRes.id] = priorityFactor * timeFactor * action.getResDep(curRes.id)/(i+1);
                            curAmount -= action.keptRes[curRes.id];
                        }

                    } else {
                        // Action cannot be achieved with this resource
                        limits[curRes.id] = action;
                        break;
                    }
                }
            }

        }

        // Purchasing complete actions
        actions.sort(prioCompare);
        console.log("ACT:", actions);
        for (let i = 0;i < actions.length;i++) {
            let action = actions[i];
            let canBuy = true;
            for (x in action.completion) {
                if (!action.completion[x]) {
                    canBuy = false;
                    break;
                }
            }
            if (canBuy) {
                console.log(action.id, "can buy");
                let clicked = action.click();
                // Don't count unification research
                if (action.id == 'tech-wc_conquest' || action.id == 'tech-wc_morale' || action.id == 'tech-wc_money' || action.id == 'tech-wc_reject') {
                    clicked = false;
                }
                if (clicked) {
                    if (settings.autoPrint) {
                        messageQueue(getTotalGameDays().toString() + " [AUTO-PRIORITY] " + action.name, 'warning');
                        //if (action.id == 'tech-mad') {
                        //    settings.log.push(getTotalGameDays());
                        //}
                    }
                    break;
                }
            }
        }
        if (settings.autoSmelter && (count % settings.smelterSettings.interval == 0)) {
            autoSmelter(limits);
        }
        else if (settings.autoFactory && (count % settings.factorySettings.interval == 0)) {
            autoFactory(limits);
        }
        else if (settings.autoSupport) {
            autoSupport(limits);
        }

        // Determining rate priorities
        console.log("LIM:", limits);
        console.log("PQ:", PQs);

        return {limits:limits,PQs:PQs}
    }

    function autoTrade(priorityData) {
        // If haven't researched trade, don't do anything
        if (!researched('tech-trade')) {return;}
        // Haven't made non-AutoPriority autoTrade, so ignore otherwise
        if (priorityData === null) {return;}
        let limits = priorityData.limits
        let PQs = priorityData.PQs
        // Finding total trade routes
        let totalTradeRouteStr = $('#tradeTotal').children()[0].innerText;
        let totalTradeRoutes = parseInt(/Trade Routes [\d]+ \/ ([\d]+)/.exec(totalTradeRouteStr)[1]);
        // Finding full resources
        let sellingRes = [];
        for (var x in resources) {
            if (!resources[x].unlocked) {continue;}
            if (!(resources[x] instanceof TradeableResource)) {continue;}
            if (resources[x].ratio < 0.99) {continue;}
            sellingRes.push(resources[x]);
        }
        // Sort by sell cost
        sellingRes.sort(function(a,b) {
            return a.tradeSellCost < b.tradeSellCost;
        });
        // Finding sequence of selling trade routes
        let sellSequence = [];
        for (let i = 0;i < sellingRes.length;i++) {
            let res = sellingRes[i];
            let maxRoutes = Math.floor(res.temp_rate / res.tradeAmount);
            let sellRoutes = (maxRoutes < totalTradeRoutes) ? maxRoutes : totalTradeRoutes;
            for (let j = 0;j < sellRoutes;j++) {sellSequence.push(res.id);}
        }
        console.log("SELL SEQ:", sellSequence);

        // Finding resource to focus on
        let focusList = [];
        for (x in limits) {
            // There exists an action that requires this resource
            if (limits[x] === null) {continue;}
            // Excluding craftable resources
            if (!(x in resources)) {continue;}
            // Excluding untradeable resources
            if (!(resources[x] instanceof TradeableResource) && x != 'Money') {continue;}
            // Excluding actions whose resource is already filled
            if (limits[x].completion[x] == true) {continue;}
            focusList.push({action:limits[x], res:x});
            //console.log(x, limits[x].id, limits[x].completionTime, priorityScale(Math.log(limits[x].completionTime[x]), limits[x].priority), limits[x].priority);
        }
        if (focusList.length > 0) {
            focusList.sort(function(a,b) {
                return prioCompare(a.action, b.action);
            });
        }
        console.log("FOC LIST:", focusList);
        let focusSequence = [];
        let curNum = {};
        let curRatio = {};
        let wantedRatio = {};
        let totalPriority = 0;
        let priorities = [];
        let ratios = [];
        let keys = [];
        let allocations = {};
        if (focusList.length > 0) {
            // Creating sequence of trade route allocations to match priority ratios
            let curError = 0;
            for (let i = 0;i < focusList.length;i++) {totalPriority += (resources[focusList[i].res].priority * focusList[i].action.priority)**2;}
            for (let i = 0;i < focusList.length;i++) {
                curNum[focusList[i].res] = 0;
                wantedRatio[focusList[i].res] = (resources[focusList[i].res].priority * focusList[i].action.priority)**2 / totalPriority;
                if (wantedRatio[focusList[i].res] * totalTradeRoutes < 1) {wantedRatio[focusList[i].res] = 0;}
                if (focusList[i].res !== 'Money') {
                    priorities.push(resources[focusList[i].res].priority);
                    ratios.push(wantedRatio[focusList[i].res]);
                    keys.push(focusList[i].res);
                }
                //if (focusList[i].res == 'Money') {wantedRatio[focusList[i].res] /= totalPriority;}
                //console.log(focusList[i].res, focusList[i].action.priority , resources[focusList[i].res].basePriority, wantedRatio[focusList[i].res],  wantedRatio[focusList[i].res] * totalTradeRoutes);
            }
            allocations = allocate(totalTradeRoutes,priorities,ratios);
        }
        // Allocating trade routes
        focusSequence = allocations['seq'];
        let curFocus = 0;
        let curSell = 0;
        if (focusList.length > 0) {
            // Allocating all possible trade routes with given money
            let curFreeTradeRoutes = totalTradeRoutes;
            // Keeping fraction of base money for money
            if (wantedRatio.Money > 0) {resources.Money.temp_rate *= 1 - wantedRatio.Money;}
            //console.log(wantedRatio.Money,resources.Money.temp_rate);
            // Begin allocating algorithm
            while (resources.Money.temp_rate > 0 && curFreeTradeRoutes > 0) {
                // Checking if can buy trade route
                if (focusSequence.length > 0 && resources.Money.temp_rate > resources[keys[focusSequence[curFocus]]].tradeBuyCost) {
                    // Can buy trade route
                    //console.log("Buying", focusSequence[curFocus], curFocus);
                    resources[keys[focusSequence[curFocus]]].tradeInc();
                    resources.Money.temp_rate -= resources[keys[focusSequence[curFocus]]].tradeBuyCost;
                    curFreeTradeRoutes -= 1;
                    curFocus += 1;
                } else {
                    // Cannot buy trade route, sell instead
                    if (curSell == sellSequence.length) {break;}
                    resources[sellSequence[curSell]].tradeDec();
                    resources.Money.temp_rate += resources[sellSequence[curSell]].tradeSellCost;
                    curFreeTradeRoutes -= 1;
                    curSell += 1;
                }
            }
        }
    }

    function allocate(totalNum,priorities,ratios,requireFunc) {
        let allocationList = [];
        let curNum = [];
        for (let i = 0;i < priorities.length;i++) {curNum.push(0);}
        for (let i = 0;i < totalNum;i++) {
            let total = i+1;
            // Calculating error based on next value choice
            let prevError = 0;
            for (let j = 0;j < priorities.length;j++) {
                prevError = ((curNum[j] / total) - ratios[j]) ** 2;
            }
            let error = -1;
            let choice = -1;
            for (let j = 0;j < priorities.length;j++) {
                if (priorities[j] == 0 || ratios[j] == 0) {continue;}
                if (requireFunc !== undefined && requireFunc(j, curNum[j])) {continue;}
                let tempError = prevError;
                tempError -= ((curNum[j] / total) - ratios[j]) ** 2;
                tempError += (((curNum[j]+1) / total) - ratios[j]) ** 2;

                if (error == -1 || tempError < error) {
                    error = tempError;
                    choice = j;
                }
            }
            if (choice == -1) {
                break;
            }
            allocationList[i] = choice;
            curNum[choice] += 1;
        }
        return {seq:allocationList,alloc:curNum};
    }

    let count = 1;
    function fastAutomate() {
        console.clear();
        //console.log(LZString.decompressFromUTF16(window.localStorage['evolved']));
        console.log(count);
        updateUI();
        updateSettings();
        autoFarm();
        autoRefresh();
        autoBattle();
        if (inEvolution()) {
            // Evolution Automation
            if(settings.autoEvolution) {
                autoEvolution();
            }
        } else {
            // Civilization Automation
            var priorityData = null;
            if(settings.autoPriority) {
                priorityData = autoPriority(count);
            }
            if(settings.autoTrade){autoTrade(priorityData);}
            if(settings.autoCraft){
                autoCraft();
            }
            if(settings.autoEmploy){
                autoEmploy(priorityData);
            }
            if(settings.autoTax) {
                autoTax();
            }
            if(settings.autoMarket){
                autoMarket();
            }
            if (settings.autoStorage) {
                autoStorage();
            }
        }
        count += 1;
    }
    setInterval(fastAutomate, 1000);

    /***
    *
    * Setup UI
    *
    ***/

    function createNumControl(currentValue, name, subFunc, addFunc) {
        let subBtn = $(`<span role="button" aria-label="Decrease ${name}" class="sub">«</span>`);
        let label = $(`<span id="${name}_control" class="count current" style="width:2rem;">${currentValue}</span>`);
        subBtn.on('click', function(e) {
            document.getElementById(name+'_control').innerText = subFunc();
            updateSettings();
        });
        let addBtn = $(`<span role="button" aria-label="Increase ${name}" class="add">»</span>`);
        addBtn.on('click', function(e) {
            document.getElementById(name+'_control').innerText = addFunc();
            updateSettings();
        });
        let control = $(`<div class="controls as-${name}-settings" style="display:flex"></div>`).append(subBtn).append(label).append(addBtn);
        return control;
    }
    function createToggleControl(toggleId, toggleName, args) {
        args = args || {};
        let controlName = (Array.isArray(toggleId)) ? toggleId.join('_') : toggleId;
        let checkStyle = (args.small !== undefined) ? 'style="height:5px;"' : '';
        let toggle = $(`
        <label class="switch" id="${controlName}_toggle">
        <input type="checkbox" true-value="true" value="false">
        <span class="check" ${checkStyle}></span>
        <span class="control-label"><span class="is-primary is-bottom is-small is-animated is-multiline">${toggleName}</span>
        </span>
        </label>`);
        let setting = (args.root !== undefined) ? args.root : settings;
        let attr = toggleId;
        if (Array.isArray(toggleId)) {
            for (let i = 0;i < toggleId.length-1;i++) {
                setting = setting[toggleId[i]];
            }
            toggleId = toggleId[toggleId.length-1];
        }
        toggle.children('input').on('click', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget;
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
            setting[toggleId] = state;
            console.log(`Setting ${controlName} to ${state}`);
            updateSettings();
            if (state && args.enabledCallBack !== undefined) {
                args.enabledCallBack();
            }
            else if (args.disabledCallBack !== undefined) {
                args.disabledCallBack()
            }
            if (args.onChange !== undefined) {
                args.onChange(state);
            }
        });
        if(setting[toggleId]){
            setTimeout( function() {
                console.log(`Setting ${controlName} initially to true`);
                toggle.children('span.check').click();
                toggle.children('input').attr('value', true);
            }, 1000);
        }
        return toggle;
    }
    function createDropDownControl(currentValue, id, name, values, changeFunc) {
        let option = $(`<div style="display:flex;" id="${id}_dropdown"></div>`);
        option.append($(`<span class="has-text-warning" style="width:12rem;">${name}:</span>`));
        let decision = $(`<select style="width:12rem;"></select>`);
        for (let val in values) {
            decision.append($(`<option value="${val}">${values[val]}</option>`));
        }
        decision[0].value = settings[id];
        decision[0].onchange = function(){
            settings[id] = decision[0].value;
            console.log(`Changing ${id} to ${settings[id]}`);
            updateSettings();
        };
        option.append(decision);
        return option;
    }
    function createCheckBoxControl(currentValue, id, name, enabledCallBack, disabledCallBack) {
        let checkBox = $(`
        <label class="b-checkbox checkbox" id="${id}">
        <input type="checkbox" true-value="Yes" false-value="No" value="false">
        <span class="check is-dark"></span>
        <span class="control-label">${name}</span>
        </label>`);
        checkBox.children('input').on('click', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget;
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
            settings[id] = state;
            console.log("Setting", id, "to", state);
            updateSettings();
            if(state && enabledCallBack !== undefined){
                enabledCallBack();
            } else if(disabledCallBack !== undefined){
                disabledCallBack()
            }
        });
        if(settings[id]){
            setTimeout( function() {
                console.log("Setting initially to true");
                checkBox.children('span.check').click();
                checkBox.children('input').attr('value', true);
            }, 1000);
        }
        return checkBox;
    }

    function updateUI(){
        if ($('.ea-autolog').length == 0) {
            createAutoLog();
        }
        if ($('#autoSettingTab').length == 0) {
            createSettingTab();
        }
        if (settings.autoStorage && $('.as-storage-settings').length == 0) {
            createStorageSettings();
        }
        if (settings.autoEmploy && $('.as-employ-settings').length == 0) {
            createEmploySettings();
        }
        if (settings.autoMarket && $('.as-market-settings').length == 0) {
            createMarketSettings();
        }
        if (settings.autoTrade && $('.as-trade-settings').length == 0) {
            createTradeSettings();
        }
        if ($('#autoSettings').length == 0) {
            createAutoSettings();
        }
    }

    function resetUI() {
        console.log("Resetting UI");
        removeStorageSettings();
        removeMarketSettings();
        removeTradeSettings();
        removeEmploySettings();
        $('.as-autolog').remove();
        $('.as-settings').remove();
        $('#autoSettings').remove();
    }

    function createAutoSettings() {
        let parent = getTab("Settings");
        parent.append($('<br></br>')[0]);
        let mainDiv = $('<div id="autoSettings"></div>');
        let label = $('<label class="label">Import/Export Auto Settings</label>');
        let ctrlDiv = $('<div class="control is-clearfix"></div>');
        let textArea = $('<textarea id="settingsImportExport" class="textarea"></textarea>');
        ctrlDiv.append(textArea);
        let control = $('<div class="field"></div>');
        control.append(label).append(ctrlDiv);
        let importBtn = $('<button class="button">Import Settings</button><text> </text>');
        importBtn.on('click', function(e) {
            if (e.which != 1) {return;}
            importSettings();
        });
        let exportBtn = $('<button class="button">Export Settings</button>');
        exportBtn.on('click', function(e) {
            if (e.which != 1) {return;}
            exportSettings();
        });
        mainDiv.append(control).append(importBtn).append(exportBtn);
        parent.append(mainDiv[0]);
    }

    function createStorageSetting(id) {
        if (!resources[id].unlocked) {return;}
        if (!resources[id].crateable) {return;}
        let resourceSpan = $('#stack-'+resources[id].id);
        let div = $('<div class="as-storage-settings" style="display:flex"></div>');
        let prioritySub = function() {
            resources[id].decStorePriority();
            loadStorageUI();
            return resources[id].storePriority;
        }
        let priorityAdd = function() {
            resources[id].incStorePriority();
            loadStorageUI();
            return resources[id].storePriority;
        }
        let priorityControls = createNumControl(resources[id].storePriority, id+"-store-priority", prioritySub, priorityAdd);
        div.append(priorityControls)

        let minSub = function() {
            resources[id].decStoreMin();
            loadStorageUI();
            return resources[id].storeMin;
        }
        let minAdd = function() {
            resources[id].incStoreMin();
            loadStorageUI();
            return resources[id].storeMin;
        }
        let minControls = createNumControl(resources[id].storeMin, id+"-store-min", minSub, minAdd);
        div.append(minControls)

        resourceSpan.append(div);
    }
    function createStorageSettings() {
        // Don't render if haven't researched crates
        if (!researched('tech-containerization')) {return;}
        removeStorageSettings();
        // Creating labels
        let labelSpan = $('#createHead');
        let prioLabel = $('<div class="as-storage-settings" style="display:inline-flex;margin-left:2rem"><span class="has-text-warning">Priority</span></div>');
        let minLabel = $('<div class="as-storage-settings" style="display:inline-flex;margin-left:3rem"><span class="has-text-warning">Min</span></div>');
        labelSpan.append(prioLabel).append(minLabel);
        // Creating individual counters
        for (var x in resources) {
            createStorageSetting(x);
        }
    }
    function removeStorageSettings() {
        $('.as-storage-settings').remove();
    }

    function createMarketSetting(resource){
        let marketDiv = $(`<div style="display:flex;" class="as-market-settings as-market-${resource.id}"></div>`);

        let manualBuy = $('<div style="display:flex;"></div>');
        marketDiv.append(manualBuy);
        let toggleBuy = $('<label tabindex="0" class="switch" style=""><input type="checkbox" value=false> <span class="check" style="height:5px;"></span><span class="state"></span></label>');
        manualBuy.append(toggleBuy);
        toggleBuy.on('click', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget.children[0];
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
            resources[resource.id].autoBuy = state;
            let otherState = toggleSell.children('input').attr('value') === 'true';
            if(state && otherState){
                toggleSell.click();
                console.log("Turning off toggleSell");
                resources[resource.id].autoSell = false;
                toggleSell.children('input')[0].setAttribute('value',false);
            }
            resources[resource.id].autoBuy = state;
            updateSettings();
            loadTradeUI();
        });
        if(resource.autoBuy){
            setTimeout( function() {
                console.log("Setting initially to true");
                toggleBuy.children('span.check').click();
                toggleBuy.children('input').attr('value', true);
            }, 1000);
        }

        let buyRatioSub = function() {
            resource.buyDec();
            loadTradeUI();
            return resource.buyRatio;
        }
        let buyRatioAdd = function() {
            resource.buyInc();
            loadTradeUI();
            return resource.buyRatio;
        }
        let buyRatioControl = createNumControl(resource.buyRatio, resource.id+'-buy-ratio',buyRatioSub,buyRatioAdd);
        manualBuy.append(buyRatioControl);

        let manualSell = $('<div style="display:flex;"></div>');
        marketDiv.append(manualSell);
        let toggleSell = $('<label tabindex="0" class="switch" style=""><input type="checkbox" value=false> <span class="check" style="height:5px;"></span><span class="state"></span></label>');
        manualSell.append(toggleSell);
        toggleSell.on('click', function(e){
            if (e.which != 1) {return;}
            let input = e.currentTarget.children[0];
            let state = !(input.getAttribute('value') === "true");
            input.setAttribute('value', state);
            resources[resource.id].autoSell = state;
            let otherState = toggleBuy.children('input').attr('value') === 'true';
            if(state && otherState){
                toggleBuy.click();
                console.log("Turning off toggleBuy");
                resources[resource.id].autoBuy = false;
                toggleBuy.children('input')[0].setAttribute('value',false);
            }
            updateSettings();
            loadTradeUI();
        });
        if(resource.autoSell){
            setTimeout( function() {
                console.log("Setting initially to true");
                toggleSell.children('span.check').click();
                toggleSell.children('input').attr('value', true);
            }, 1000);
        }

        let sellRatioSub = function() {
            resource.sellDec();
            loadTradeUI();
            return resource.sellRatio;
        }
        let sellRatioAdd = function() {
            resource.sellInc();
            loadTradeUI();
            return resource.sellRatio;
        }
        let sellRatioControl = createNumControl(resource.sellRatio, resource.id+'-sell-ratio',sellRatioSub,sellRatioAdd);
        manualSell.append(sellRatioControl);

        return [marketDiv, manualBuy, manualSell];
    }
    function createMarketSettings(){
        // Don't render if haven't researched markets
        if (!researched('tech-market')) {return;}
        removeMarketSettings();
        let mainDiv = document.getElementById('market');
        mainDiv.insertBefore($('<div class="as-market-settings"><br></div>')[0],mainDiv.children[1]);
        let firstRow = false;
        // Creating settings for TradeableResources
        for (var x in resources) {
            if (!(resources[x] instanceof TradeableResource)) {continue;}
            let [marketDiv, manualBuy, manualSell] = createMarketSetting(resources[x]);
            if (!firstRow) {
                firstRow = true;
                let buyLabel = $('<div style="position:absolute;top:1.5rem;"><span>Manual Buy</span></div>');
                manualBuy.prepend(buyLabel[0]);
                let sellLabel = $('<div style="position:absolute;top:1.5rem;"><span>Manual Sell</span></div>');
                manualSell.prepend(sellLabel[0]);
            }
            let marketRow = $('#market-'+resources[x].id);
            marketRow.append(marketDiv);
        }
    }
    function removeMarketSettings(){
        $('.as-market-settings').remove();
    }

    function createTradeSetting(resource) {
        let marketDiv = $(`<div style="display:flex;" class="as-trade-settings as-trade-${resource.id}"></div>`);

        let prioritySub = function() {
            resource.decBasePriority();
            loadTradeUI();
            return resource.basePriority;
        }
        let priorityAdd = function() {
            resource.incBasePriority();
            loadTradeUI();
            return resource.basePriority;
        }
        let priorityControl = createNumControl(resource.basePriority, resource.id+'-trade-priority',prioritySub,priorityAdd);
        marketDiv.append(priorityControl);

        return [marketDiv, priorityControl];
    }
    function createTradeSettings() {
        // Don't render if haven't researched markets
        if (!researched('tech-trade')) {return;}
        removeTradeSettings();
        let mainDiv = document.getElementById('market');
        if ($('.as-market-settings > br').length == 0) {
            mainDiv.insertBefore($('<div class="as-trade-settings"><br></div>')[0],mainDiv.children[1]);
        }
        let firstRow = false;
        let lastRow = null;
        // Creating settings for TradeableResources
        for (var x in resources) {
            if (!(resources[x] instanceof TradeableResource)) {continue;}
            let [marketDiv, tradeControl] = createTradeSetting(resources[x]);
            if (!firstRow) {
                firstRow = true;
                let tradeLabel = $('<div style="position:absolute;top:1.5rem;"><span>Trade</span></div>');
                tradeControl.prepend(tradeLabel[0]);
            }
            let marketRow = $('#market-'+resources[x].id);
            marketRow.append(marketDiv);
            lastRow = [tradeControl, marketDiv, marketRow];
        }

        // Creating trade setting for money
        let tradeRow = document.getElementById("tradeTotal");
        let moneyLabel = $('<div style="position:absolute;bottom:4rem;width:5.25rem;text-align:center;"><span>$$$</span></div>');
        lastRow[0].prepend(moneyLabel);
        let priorityDiv = $('<div style="position:absolute;bottom:3rem;width:5.25rem;text-align:center;"</div>');
        let prioritySub = function() {
            resources.Money.decBasePriority();
            loadTradeUI();
            return resources.Money.basePriority;
        }
        let priorityAdd = function() {
            resources.Money.incBasePriority();
            loadTradeUI();
            return resources.Money.basePriority;
        }
        let priorityControl = createNumControl(resources.Money.basePriority,"Money-trade-priority",prioritySub,priorityAdd);
        priorityDiv.append(priorityControl);
        lastRow[0].prepend(priorityDiv[0]);
    }
    function removeTradeSettings() {
        $('.as-trade-settings').remove();
    }

    function createEmploySettings() {
        removeEmploySettings();
        for (var x in jobs) {
            let job = jobs[x];
            if (!job.unlocked) {continue;}
            let prioritySub = function() {
                job.lowerPriority();
                loadEmployUI();
                return job._priority;
            }
            let priorityAdd = function() {
                job.higherPriority();
                loadEmployUI();
                return job._priority;
            }
            let priorityControl = createNumControl(job._priority, job.id+'-priority',prioritySub,priorityAdd);
            if (job.id != "free" || job.name == 'Hunter') {
                if (job.id == "craftsman") {
                    let parent = $('#foundry > .job > .foundry').parent();
                    let div = $('<div class="foundry as-employ-settings" style="text-align:right;margin-left:4.5rem"></div>');
                    parent.append(div);
                    div.append(priorityControl);
                    //parent.append(priorityControl);
                } else if (job.id == 'free') {
                    let div = $('<div class="as-employ-settings" style="text-align:right;margin-left:4.5rem"></div>');
                    $('#civ-'+job.id).append(div);
                    div.append(priorityControl);
                }else {
                    let div = $('<div class="as-employ-settings" style="text-align:right;margin-left:1.25rem"></div>');
                    $('#civ-'+job.id).append(div);
                    div.append(priorityControl);
                }

            } else {
                let parent = document.getElementById("civ-"+job.id);
                let priorityLabel = $('<span class="has-text-warning as-employ-settings" style="text-align:right;min-width:9.25rem">Priority</span>');
                $('#civ-'+job.id).append(priorityLabel);
            }
        }

        for (x in craftJobs) {
            let cjob = craftJobs[x];
            if (!cjob.unlocked) {continue;}
            let prioritySub = function() {
                cjob.lowerPriority();
                loadEmployUI();
                return cjob._priority;
            }
            let priorityAdd = function() {
                cjob.higherPriority();
                loadEmployUI();
                return cjob._priority;
            }
            let priorityControl = createNumControl(cjob._priority, cjob.id+'-priority',prioritySub,priorityAdd);
            let div = $('<div class="as-employ-settings" style="text-align:right;margin-left:1.25rem">');
            div.append(priorityControl);
            $('#craft'+cjob.id).parent().append(div);
        }

    }
    function removeEmploySettings() {
        $('.as-employ-settings').remove();
    }

    function createAutoSettingPage(name, labelElm, contentElm) {
        let label = $('<li class="as-settings"><a><span>'+name+'</span></a></li>');
        let tab = $('<div id="'+name+'_setting_tab'+'" class="tab-item as-settings" style="display:none"><h2 class="is-sr-only">'+name+'</h2></div>');
        label.on('click',function(e) {
            if (e.which != 1) {return;}
            for (let i = 0;i < labelElm.children().length;i++) {
                let tabLabel = labelElm.children()[i];
                let tabItem = contentElm.children()[i];
                if (tabLabel.classList.contains("is-active")) {
                    tabLabel.classList.remove("is-active");
                    tabItem.style.display = 'none';
                }
            }
            label.addClass("is-active");
            tab[0].style.display = '';
        });
        labelElm.append(label);
        contentElm.append(tab);
        return tab;
    }
    function createSettingTab() {
        let settingTabLabel = $('<li class="as-settings"><a><span>Auto Settings</span></a></li>');
        let settingTab = $('<div id="autoSettingTab" class="tab-item as-settings" style="display:none"><h2 class="is-sr-only">Auto Settings</h2></div>');
        // Creating click functions for other tabs
        for (let i = 1;i <= $('#mainColumn > .content > .b-tabs > .tabs > ul').children().length;i++) {
            let tabLabel = $('#mainColumn > .content > .b-tabs > .tabs > ul > li:nth-child('+i+')');
            let tabItem = $('#mainColumn > .content > .b-tabs > .tab-content').children()[i-1];
            tabLabel.on('click',function(e) {
                if (e.which != 1) {return;}
                if (settingTabLabel.hasClass("is-active")) {
                    settingTabLabel.removeClass("is-active");
                    tabItem.style.display = '';
                }
                settingTab[0].style.display = 'none';
                if (!tabLabel.hasClass("is-active")) {tabLabel.addClass("is-active");}
            });
        }
        $('#mainColumn > .content > .b-tabs > .tabs > ul').append(settingTabLabel);
        $('#mainColumn > .content > .b-tabs > .tab-content').append(settingTab);
        settingTabLabel.on('click',function(e) {
            if (e.which != 1) {return;}
            // For every other tab
            for (let i = 1;i <= $('#mainColumn > .content > .b-tabs > .tabs > ul').children().length-1;i++) {
                let tabLabel = $('#mainColumn > .content > .b-tabs > .tabs > ul > li:nth-child('+i+')');
                let tabItem = $('#mainColumn > .content > .b-tabs > .tab-content').children()[i-1];
                tabLabel.removeClass("is-active");
                tabItem.style.display = 'none';
            }
            settingTabLabel.addClass("is-active");
            settingTab[0].style.display = '';
        });

        let tabDiv = $('<div class="b-tabs resTabs"></div>');
        let nav = $('<nav class="tabs"></nav>');
        tabDiv.append(nav);
        let section = $('<section class="tab-content"></section>');
        tabDiv.append(section);
        let ul = $('<ul></ul>');
        nav.append(ul);
        settingTab.append(tabDiv);

        let generalTab = createAutoSettingPage("General", ul, section);
        createAutoSettingGeneralPage(generalTab);
        let evolutionTab = createAutoSettingPage("Evolution", ul, section);
        createAutoSettingEvolutionPage(evolutionTab);
        let jobTab = createAutoSettingPage("Jobs/Army", ul, section);
        createAutoSettingJobPage(jobTab);
        let resourceTab = createAutoSettingPage("Resources", ul, section);
        createAutoSettingResourcePage(resourceTab);
        let buildingTab = createAutoSettingPage("Buildings", ul, section);
        createAutoSettingBuildingPage(buildingTab);
        let researchTab = createAutoSettingPage("Research", ul, section);
        createAutoSettingResearchPage(researchTab);
        let priorityTab = createAutoSettingPage("Priority", ul, section);
        createAutoSettingPriorityPage(priorityTab);
    }
    function createAutoSettingToggle(id, name, description, hasContent, tab, enabledCallBack, disabledCallBack) {
        let titleDiv = $('<div style="display:flex;justify-content:space-between;"></div>');
        tab.append(titleDiv);
        let toggle = createToggleControl(id, name, {enabledCallBack:enabledCallBack, disabledCallBack:disabledCallBack});
        titleDiv.append(toggle);
        let details = $(`<div><span>${description}</span></div>`);
        tab.append(details);
        tab.append($('<br></br>'));
        let content = null;
        if (hasContent) {
            let contentId = 'as-' + id + '-content';
            content = $(`<div style="margin-left:2em;" id="${contentId}"></div>`);
            tab.append(content);
            tab.append($('<br></br>'));
        }
        return [titleDiv, content];
    }

    function createAutoSettingGeneralPage(tab) {

        // Auto Print
        let autoPrintDesc = 'This setting will print out script details in the script printing window. I may add more granularity in the print settings later on, but currently it only prints Auto Priority messages.';
        let [autoPrintTitle, autoPrintContent] = createAutoSettingToggle('autoPrint', 'Auto Print', autoPrintDesc, false, tab);

        // Auto Farm
        let autoFarmDesc = 'This setting will auto-click the manual farming buttons that exist on the screen. If the buttons are not being auto-clicked, try reloading the UI. Currently clicks ~100/s. I may add a setting to change this.';
        let [autoFarmTitle, autoFarmContent] = createAutoSettingToggle('autoFarm', 'Auto Farm', autoFarmDesc, false, tab);

        // Auto Refresh
        let autoRefreshDesc = 'This setting will automatically reload the page every 200 seconds. This setting was made due to the modal windows lagging after too many launches. Refreshing will remove this lag.';
        let [autoRefreshTitle, autoRefreshContent] = createAutoSettingToggle('autoRefresh', 'Auto Refresh', autoRefreshDesc, false, tab);
        let reloadBtnDetails = 'Resets the UI and reloads the backend variables.';
        let reloadBtn = $(`<div role="button" class="is-primary is-bottom is-small b-tooltip is-animated is-multiline" data-label="${reloadBtnDetails}"><button class="button is-primary"><span>Reset UI</span></button></div>`);
        reloadBtn.on('click', function(e){
            if (e.which != 1) {return;}
            resetUI();
            updateSettings();
            loadSettings();
        });
        autoRefreshTitle.append(reloadBtn);

        // Auto Prestige
        let autoPrestigeDesc = 'This setting will automatically prestige when the options are availible. Currently not implemented.';
        let [autoPrestigeTitle, autoPrestigeContent] = createAutoSettingToggle('autoPrestige', 'Auto Prestige', autoPrestigeDesc, true, tab);

        // Advanced

    }

    function createAutoSettingEvolutionPage(tab) {

        // Auto Evolution/Challenge
        let autoEvolutionDesc = 'This setting will automatically play the Evolution stage. It will buy the mininum amount of RNA/DNA storage for evolving, as well as automatically purchase challenges.';
        let [autoEvolutionTitle, autoEvolutionContent] = createAutoSettingToggle('autoEvolution', 'Auto Evolution', autoEvolutionDesc, true, tab);

        let raceValues = {};
        for (let race in window.game.races) {
            if (race == 'protoplasm' || race == 'junker') {continue;}
            raceValues[race] = window.game.races[race].name;
        }
        let raceOption = createDropDownControl(settings.evolution, 'evolution', 'Evolution Decision', raceValues);
        autoEvolutionContent.append(raceOption);
        autoEvolutionContent.append($('<br></br>'));

        let challengeOption = $('<div style="display:flex;"></div>');
        autoEvolutionContent.append(challengeOption);
        challengeOption.append($('<h3 class="has-text-warning" style="width:12rem;">Challenges:</h3>'));
        let challengeToggles = $('<div></div>');
        challengeOption.append(challengeToggles);
        for (let i = 0;i < evoChallengeActions.length;i++) {
            let toggleVal = settings[evoChallengeActions[i]];
            let toggleId = evoChallengeActions[i];
            let str = evoChallengeActions[i].split('-')[1];
            let toggleName = str.charAt(0).toUpperCase() + str.slice(1);
            let toggle = createCheckBoxControl(toggleVal, toggleId, toggleName);
            let toggleDiv = $('<div></div>');
            toggleDiv.append(toggle);
            challengeToggles.append(toggleDiv);
        }
    }

    function loadEmployUI(content) {
        if (content === null || content == undefined) {content = $('#as-autoEmploy-content');}
        $('.as-employui').remove();
        let i = 0;
        let labelDiv = $('<div style="display:flex" class="alt market-item as-employui"></div>');
        content.append(labelDiv);
        let jobLabel = $('<span class="has-text-warning" style="width:12rem;">Job</span>');
        labelDiv.append(jobLabel);
        let priorityLabel = $('<span class="has-text-warning" style="width:12rem;">Priority</span>');
        labelDiv.append(priorityLabel);

        for (let x in jobs) {
            let id = x;
            let div = null;
            i += 1;
            if (i % 2) {
                div = $('<div style="display:flex" class="market-item as-employui"></div>');
            } else {
                div = $('<div style="display:flex" class="alt market-item as-employui"></div>');
            }
            content.append(div);

            // Setting Hunter priority
            let name = (x == 'free') ? 'Hunter' : jobs[x].name;
            let label = $(`<span class="has-text-info" style="width:12rem;">${name}</h3>`);
            div.append(label);

            let priorityDiv = $('<div style="width:12rem;"></div>');
            div.append(priorityDiv);
            let prioritySub = function() {
                jobs[id].lowerPriority();
                createEmploySettings();
                return jobs[id]._priority;
            }
            let priorityAdd = function() {
                jobs[id].higherPriority();
                createEmploySettings();
                return jobs[id]._priority;
            }
            let priorityControl = createNumControl(jobs[id]._priority, jobs[id].id+'_priority',prioritySub,priorityAdd);
            priorityDiv.append(priorityControl);
        }
        for (let x in craftJobs) {
            let id = x;
            let div = null;
            i += 1;
            if (i % 2) {
                div = $('<div style="display:flex" class="market-item as-employui"></div>');
            } else {
                div = $('<div style="display:flex" class="alt market-item as-employui"></div>');
            }
            content.append(div);

            let label = $(`<span class="has-text-danger" style="width:12rem;">${craftJobs[x].name}</h3>`);
            div.append(label);

            let priorityDiv = $('<div style="width:12rem;"></div>');
            div.append(priorityDiv);
            let prioritySub = function() {
                craftJobs[id].lowerPriority();
                createEmploySettings();
                return craftJobs[id]._priority;
            }
            let priorityAdd = function() {
                craftJobs[id].higherPriority();
                createEmploySettings();
                return craftJobs[id]._priority;
            }
            let priorityControl = createNumControl(craftJobs[id]._priority, craftJobs[id].id+'_priority',prioritySub,priorityAdd);
            priorityDiv.append(priorityControl);
        }
    }
    function createAutoSettingJobPage(tab) {

        // Auto Tax
        let autoTaxDesc = 'Manages the tax rate for optimal morale and taxes.';
        let [autoTaxTitle, autoTaxContent] = createAutoSettingToggle('autoTax', 'Auto Tax', autoTaxDesc, true, tab);

        let minMoraleDiv = $('<div style="display:flex;"></div>');
        autoTaxContent.append(minMoraleDiv);
        let minMoraleTxt = $('<span class="has-text-warning" style="width:12rem;">Minimum Morale:</span>')
        minMoraleDiv.append(minMoraleTxt);

        let minMoraleSub = function() {
            settings.minimumMorale -= 1;
            return settings.minimumMorale;
        }
        let minMoraleAdd = function() {
            settings.minimumMorale += 1;
            return settings.minimumMorale;
        }
        let minMoraleControl = createNumControl(settings.minimumMorale, "minimum_morale", minMoraleSub, minMoraleAdd);
        minMoraleDiv.append(minMoraleControl);

        // Auto Employ
        let autoEmployDesc = 'Allocates the population to jobs. May add min/max settings later on.';
        let [autoEmployTitle, autoEmployContent] = createAutoSettingToggle('autoEmploy', 'Auto Employ', autoEmployDesc, true, tab, createEmploySettings, removeEmploySettings);
        loadEmployUI(autoEmployContent);

        // Auto Battle
        let autoBattleDesc = 'Automatically runs battle campaigns. Will choose the highest campaign that allows for the minimum win rate. You can limit the highest campaign as well, as Siege is always less efficient.';
        let [autoBattleTitle, autoBattleContent] = createAutoSettingToggle('autoBattle', 'Auto Battle', autoBattleDesc, true, tab);

        let maxCampaignOptions = {0:'Ambush',1:'Raid',2:'Pillage',3:'Assault',4:'Siege'};
        let maxCampaignOption = createDropDownControl(settings.maxCampaign, 'maxCampaign', 'Max Campaign', maxCampaignOptions);
        autoBattleContent.append(maxCampaignOption);
        autoBattleContent.append($('<br></br>'));

        let minWinRateDiv = $('<div style="display:flex;"></div>');
        autoBattleContent.append(minWinRateDiv);
        autoBattleContent.append($('<br></br>'));
        let minWinRateTxt = $('<span class="has-text-warning" style="width:12rem;">Minimum Win Rate:</span>')
        minWinRateDiv.append(minWinRateTxt);
        let minWinRateInput = $('<input type="text" class="input is-small" style="width:10rem;"/>');
        minWinRateInput.val(settings.minWinRate);
        minWinRateDiv.append(minWinRateInput);
        let setBtn = $('<a class="button is-dark is-small" id="set-min-winrate" style="width:2rem;"><span>Set</span></a>');
        minWinRateDiv.append(setBtn);
        setBtn.on('click', function(e) {
            if (e.which != 1) {return;}
            let val = minWinRateInput.val();
            let minWinRate = getRealValue(val);
            if(!isNaN(minWinRate) && minWinRate >= 0 && minWinRate <= 100){
                console.log("Setting minimum win rate", minWinRate);
                settings.minWinRate = minWinRate;
                updateSettings();
            }
        });

        let woundedCheckStr = 'Enable "Check Wounded" to wait for no wounded soldiers before battle. Uncheck to start battles as soon as there are enough healthy soldiers to fight. Unchecked causes slightly more lag due to the fact that the algorithm continuously manipulates the garrison.';
        let woundedCheckDetails = $(`<div><span>${woundedCheckStr}</span></div>`);
        autoBattleContent.append(woundedCheckDetails);
        autoBattleContent.append($('<br>'));
        let woundedCheck = createCheckBoxControl(settings.woundedCheck, 'woundedCheck', "Check Wounded");
        autoBattleContent.append(woundedCheck);

        // Auto Fortress
        let autoFortressDesc = 'Manages soldier allocation in the fortress. Currently not yet implemented.';
        let [autoFortressTitle, autoFortressContent] = createAutoSettingToggle('autoFortress', 'Auto Fortress', autoFortressDesc, true, tab);

    }

    function loadTradeUI(content) {
        if (content === null || content == undefined) {content = $('#as-autoTrade-content');}
        $('.as-tradeui').remove();
        let i = 0;
        let labelDiv = $('<div style="display:flex" class="alt market-item as-tradeui"></div>');
        content.append(labelDiv);
        let resourceLabel = $('<span class="has-text-warning" style="width:12rem;">Tradeable Resource</h3>');
        labelDiv.append(resourceLabel);
        let buyLabel = $('<span class="has-text-warning" style="width:12rem;">Manual Buy</h3>');
        labelDiv.append(buyLabel);
        let sellLabel = $('<span class="has-text-warning" style="width:12rem;">Manual Sell</h3>');
        labelDiv.append(sellLabel);
        let tradeLabel = $('<span class="has-text-warning" style="width:12rem;">Trade Priority</h3>');
        labelDiv.append(tradeLabel);
        i += 1;
        let moneyDiv = $('<div style="display:flex" class="market-item as-tradeui"></div>');
        content.append(moneyDiv);
        let moneyLabel = $('<span class="has-text-advanced" style="width:12rem;">Money</span>');
        moneyDiv.append(moneyLabel);
        let padding = $('<div style="width:24rem;"></div>');
        moneyDiv.append(padding);
        let moneyPrioritySub = function() {
            resources['Money'].decBasePriority();
            createMarketSettings();
            return resources['Money'].basePriority;
        }
        let moneyPriorityAdd = function() {
            resources['Money'].incBasePriority();
            createMarketSettings();
            return resources['Money'].basePriority;
        }
        let moneyPriorityControl = createNumControl(resources['Money'].basePriority, resources['Money'].id+'_priority',moneyPrioritySub,moneyPriorityAdd);
        moneyDiv.append(moneyPriorityControl);
        for (var x in resources) {
            if (!(resources[x] instanceof TradeableResource)) {continue;}
            let id = x;
            let div = null;
            i += 1;
            if (i % 2) {
                div = $('<div style="display:flex" class="market-item as-tradeui"></div>');
            } else {
                div = $('<div style="display:flex" class="alt market-item as-tradeui"></div>');
            }
            content.append(div);

            var label = $(`<span class="has-text-info" style="width:12rem;">${resources[x].name}</h3>`);
            div.append(label);

            let manualBuy = $('<div style="width:12rem;display:flex;"></div>');
            div.append(manualBuy);

            let buyToggleOnChange = function(state) {
                let sellToggle = $(`#${id}_autoSell_toggle`);
                let otherState = sellToggle.children('input').attr('value') === 'true';
                if(state && otherState){
                    sellToggle.click();
                    console.log("Turning off sellToggle");
                    resources[id].autoSell = false;
                    sellToggle.children('input')[0].setAttribute('value',false);
                }
                createMarketSettings();
            }
            let buyToggle = createToggleControl([id, 'autoBuy'], '', {root:resources,small:true,onChange:buyToggleOnChange});
            manualBuy.append(buyToggle);

            let buyDec = function() {
                resources[id].buyDec();
                createMarketSettings();
                return resources[id].buyRatio;
            }
            let buyInc = function() {
                resources[id].buyInc();
                createMarketSettings();
                return resources[id].buyRatio;
            }
            let buyVal = resources[id].buyRatio;
            let buyControls = createNumControl(buyVal,resources[id].name+"_buy_ratio",buyDec,buyInc);
            manualBuy.append(buyControls);

            let manualSell = $('<div style="width:12rem;display:flex;"></div>');
            div.append(manualSell);

            let sellToggleOnChange = function(state) {
                let buyToggle = $(`#${id}_autoBuy_toggle`);
                let otherState = buyToggle.children('input').attr('value') === 'true';
                if(state && otherState){
                    buyToggle.click();
                    console.log("Turning off buyToggle");
                    resources[id].autoBuy = false;
                    buyToggle.children('input')[0].setAttribute('value',false);
                }
                createMarketSettings();
            }
            let sellToggle = createToggleControl([id, 'autoSell'], '', {root:resources,small:true,onChange:sellToggleOnChange});
            manualSell.append(sellToggle);

            let sellDec = function() {
                resources[id].sellDec();
                createMarketSettings();
                return resources[id].sellRatio;
            }
            let sellInc = function() {
                resources[id].sellInc();
                createMarketSettings();
                return resources[id].sellRatio;
            }
            let sellVal = resources[id].sellRatio;
            let sellControls = createNumControl(sellVal,resources[id].name+"_sell_ratio",sellDec,sellInc);
            manualSell.append(sellControls);

            let prioritySub = function() {
                resources[id].decBasePriority();
                createMarketSettings();
                return resources[id].basePriority;
            }
            let priorityAdd = function() {
                resources[id].incBasePriority();
                createMarketSettings();
                return resources[id].basePriority;
            }
            let priorityControl = createNumControl(resources[id].basePriority, resources[id].id+'_priority',prioritySub,priorityAdd);
            div.append(priorityControl);
        }
    }
    function loadStorageUI(content) {
        if (content === null || content == undefined) {content = $('#as-autoStorage-content');}
        $('.as-storageui').remove();
        let i = 0;
        let labelDiv = $('<div style="display:flex" class="alt market-item as-storageui"></div>');
        content.append(labelDiv);
        let resourceLabel = $('<span class="has-text-warning" style="width:12rem;">Storable Resource</span>');
        labelDiv.append(resourceLabel);
        let priorityLabel = $('<span class="has-text-warning" style="width:12rem;">Priority</span>');
        labelDiv.append(priorityLabel);
        let minLabel = $('<span class="has-text-warning" style="width:12rem;">Minimum Storage</h3>');
        labelDiv.append(minLabel);

        for (var x in resources) {
            let id = x;
            if (!(resources[x].crateable)) {continue;}
            let div = null;
            i += 1;
            if (i % 2) {
                div = $('<div style="display:flex" class="market-item as-storageui"></div>');
            } else {
                div = $('<div style="display:flex" class="alt market-item as-storageui"></div>');
            }
            content.append(div);

            var label = $(`<span class="has-text-info" style="width:12rem;">${resources[x].name}</h3>`);
            div.append(label);

            let storePriorityDiv = $('<div style="width:12rem;"></div>');
            div.append(storePriorityDiv);
            let storePrioritySub = function() {
                resources[x].decStorePriority();
                createStorageSettings();
                return resources[id].storePriority;
            }
            let storePriorityAdd = function() {
                resources[id].incStorePriority();
                createStorageSettings();
                return resources[id].storePriority;
            }
            let storePriorityControl = createNumControl(resources[id].storePriority, resources[id].id+'_store_priority',storePrioritySub,storePriorityAdd);
            storePriorityDiv.append(storePriorityControl);

            let storeMinDiv = $('<div style="width:12rem;"></div>');
            div.append(storeMinDiv);
            let storeMinSub = function() {
                resources[id].decStoreMin();
                createStorageSettings();
                return resources[id].storeMin;
            }
            let storeMinAdd = function() {
                resources[id].incStoreMin();
                createStorageSettings();
                return resources[id].storeMin;
            }
            let storeMinControl = createNumControl(resources[id].storeMin, resources[id].id+'_store_min',storeMinSub,storeMinAdd);
            storeMinDiv.append(storeMinControl);
        }
    }
    function createAutoSettingResourcePage(tab) {

        // Auto Craft
        let autoCraftDesc = 'Crafts resources if the required resources are above 90% full. Only works when Manual Crafting is enabled (disabled in No Craft challenge).';
        let [autoCraftTitle, autoCraftContent] = createAutoSettingToggle('autoCraft', 'Auto Craft', autoCraftDesc, true, tab);
        let i = 0;
        let labelDiv = $('<div style="display:flex" class="alt market-item"></div>');
        autoCraftContent.append(labelDiv);
        let resourceLabel = $('<span class="has-text-warning" style="width:12rem;">Craftable Resource</h3>');
        labelDiv.append(resourceLabel);
        let enableLabel = $('<span class="has-text-warning" style="width:12rem;">Enable</h3>');
        labelDiv.append(enableLabel);
        for (var x in resources) {
            if (!(resources[x] instanceof CraftableResource)) {continue;}
            let div = null;
            i += 1;
            if (i % 2) {
                div = $('<div style="display:flex" class="market-item"></div>');
            } else {
                div = $('<div style="display:flex" class="alt market-item"></div>');
            }
            autoCraftContent.append(div);
            let label = $(`<span class="has-text-danger" style="width:12rem;">${resources[x].name}</h3>`);
            div.append(label);
            let id = x;
            let toggle = createToggleControl([id, 'enabled'], '', {root:resources,small:true});
            div.append(toggle);
        }

        // Auto Market
        let autoMarketDesc = 'Buys/sells resources when they are below/above a certain storage ratio. This also makes sure when buying that the money never goes under the minimum value. Only works when Manual Trading is enabled (disabled in No Trade challenge).';
        let [autoMarketTitle, autoMarketContent] = createAutoSettingToggle('autoMarket', 'Auto Market', autoMarketDesc, true, tab, createMarketSettings, removeMarketSettings);
        let volumeOption = $('<div style="display:flex;"></div>');
        autoMarketContent.append(volumeOption);
        autoMarketContent.append($('<br></br>'));
        volumeOption.append($('<h3 class="has-text-warning" style="width:12rem;">Market Volume:</h3>'));
        let volumeDropdown = $(`<select style="width:12rem;">
                            <option value="1">10x</option>
                            <option value="2">25x</option>
                            <option value="3">100x</option>
                            <option value="4">250x</option>
                            <option value="5">1000x</option>
                            <option value="6">2500x</option>
                            <option value="7">10000x</option>
                            <option value="8">25000x</option>
                            </select>`);
        volumeDropdown[0].value = settings.marketVolume;
        volumeDropdown[0].onchange = function(){
            settings.marketVolume = volumeDropdown[0].value;
            console.log("Changing market volume to ", settings.marketVolume);
            updateSettings();
        };
        volumeOption.append(volumeDropdown);

        let minMoneyDiv = $('<div style="display:flex;"></div>');
        autoMarketContent.append(minMoneyDiv);
        let minMoneyTxt = $('<span class="has-text-warning" style="width:12rem;">Minimum Money:</span>')
        minMoneyDiv.append(minMoneyTxt);
        let minMoneyInput = $('<input type="text" class="input is-small" style="width:10rem;"/>');
        minMoneyInput.val(settings.minimumMoney);
        minMoneyDiv.append(minMoneyInput);
        let setBtn = $('<a class="button is-dark is-small" id="set-min-money" style="width:2rem;"><span>Set</span></a>');
        minMoneyDiv.append(setBtn);
        setBtn.on('click', function(e) {
            if (e.which != 1) {return;}
            let val = minMoneyInput.val();
            let minMoney = getRealValue(val);
            if(!isNaN(minMoney)){
                console.log("Setting minimum Money", minMoney);
                settings.minimumMoney = minMoney;
                updateSettings();
            }
        });

        // Auto Trade
        let autoTradeDesc = 'Allocates trade routes based on the trade priority (as well as Auto Prioritize).';
        let [autoTradeTitle, autoTradeContent] = createAutoSettingToggle('autoTrade', 'Auto Trade', autoTradeDesc, true, tab, createTradeSettings, removeTradeSettings);
        loadTradeUI(autoTradeContent);

        // Auto Storage
        let autoStorageDesc = 'Allocates crates and containers to resources based on priority. Also as a minimum storage setting for steel and other resources that need initial storage.';
        let [autoStorageTitle, autoStorageContent] = createAutoSettingToggle('autoStorage', 'Auto Storage', autoStorageDesc, true, tab, createStorageSettings, removeStorageSettings);
        loadStorageUI(autoStorageContent);
    }

    function createAutoSettingBuildingPage(tab) {

        // Auto Support
        let autoSupportDesc = 'Powers buildings and allocates support. Currently not very smart and half done. Support power is not implemented yet. Power Priority can be changed in the Priority Tab.';
        let [autoSupportTitle, autoSupportContent] = createAutoSettingToggle('autoSupport', 'Auto Support', autoSupportDesc, false, tab);

        // Auto Smelter
        let autoSmelterDesc = "Allocates the smelter building. The timing for allocating the smelter is based on the Interval setting (every # seconds). The priorities determine how much each resource is weighted (Currently also depends on Auto Priority, will add non-autoPriority someday).";
        let [autoSmelterTitle, autoSmelterContent] = createAutoSettingToggle('autoSmelter', 'Auto Smelter', autoSmelterDesc, true, tab);
        Object.keys(settings.smelterSettings).forEach(function(res) {
            let resText = null;
            if (res == 'interval') {
                resText = $('<h3 class="has-text-warning" style="width:12rem;">Inverval Rate:</h3>');
            } else {
                resText = $('<h3 class="has-text-warning" style="width:12rem;">'+res+' Priority:</h3>');
            }
            let resSub = function() {
                settings.smelterSettings[res] -= 1;
                return settings.smelterSettings[res];
            }
            let resAdd = function() {
                settings.smelterSettings[res] += 1;
                return settings.smelterSettings[res];
            }
            let resControls = createNumControl(settings.smelterSettings[res], "smelter_"+res+"_priority", resSub, resAdd);
            let newDiv = $('<div style="display:flex"></div>').append(resText).append(resControls);
            autoSmelterContent.append(newDiv);
        });

        let autoSmelterBtnDetails = 'Manually triggers the Auto Smelter function.';
        let autoSmelterBtn = $(`<div role="button" class="is-primary is-bottom is-small b-tooltip is-animated is-multiline" data-label="${autoSmelterBtnDetails}"><button class="button is-primary"><span>Manual</span></button></div>`);
        autoSmelterBtn.on('click', function(e){
            if (e.which != 1) {return;}
            count = settings.smelterSettings.interval;
        });
        autoSmelterTitle.append(autoSmelterBtn);

        // Auto Factory
        let autoFactoryDesc = "Allocates the factory building. The timing for allocating the factory is based on the Interval setting (every # seconds). The priorities determine how much each resource is weighted (Currently also depends on Auto Priority, will add non-autoPriority someday).";
        let [autoFactoryTitle, autoFactoryContent] = createAutoSettingToggle('autoFactory', 'Auto Factory', autoFactoryDesc, true, tab);
        Object.keys(settings.factorySettings).forEach(function(res) {
            let resText = null;
            if (res == 'interval') {
                resText = $('<h3 class="has-text-warning" style="width:12rem;">Inverval Rate:</h3>');
            } else {
                resText = $('<h3 class="has-text-warning" style="width:12rem;">'+res+' Priority:</h3>');
            }
            let resSub = function() {
                settings.factorySettings[res] -= 1;
                return settings.factorySettings[res];
            }
            let resAdd = function() {
                settings.factorySettings[res] += 1;
                return settings.factorySettings[res];
            }
            let resControls = createNumControl(settings.factorySettings[res], "factory_"+res+"_priority", resSub, resAdd);
            let newDiv = $('<div style="display:flex"></div>').append(resText).append(resControls);
            autoFactoryContent.append(newDiv);
        });

        let autoFactoryBtnDetails = 'Manually triggers the Auto Factory function.';
        let autoFactoryBtn = $(`<div role="button" class="is-primary is-bottom is-small b-tooltip is-animated is-multiline" data-label="${autoFactoryBtnDetails}"><button class="button is-primary"><span>Manual</span></button></div>`);
        autoFactoryBtn.on('click', function(e){
            if (e.which != 1) {return;}
            count = settings.factorySettings.interval;
        });
        autoFactoryTitle.append(autoFactoryBtn);

        // Auto Mining Droid
        let autoDroidDesc = "Allocates mining droids. The timing for allocation is based on the Interval setting (every # seconds). The priorities determine how much each resource is weighted. Currently not yet implemented.";
        let [autoDroidTitle, autoDroidContent] = createAutoSettingToggle('autoDroid', 'Auto Mining Droid', autoDroidDesc, true, tab);

        // Auto Graphene Plant
        let autoGrapheneDesc = "Allocates graphene plants. The timing for allocation is based on the Interval setting (every # seconds). The priorities determine how much each resource is weighted. Currently not yet implemented.";
        let [autoGrapheneTitle, autoGrapheneContent] = createAutoSettingToggle('autoGraphene', 'Auto Graphene Plants', autoGrapheneDesc, true, tab);

    }

    function createAutoSettingResearchPage(tab) {

        // Research Settings

        // Creating Fanaticism/Anthropology choice
        let label = $('<div><h3 class="name has-text-warning" title="Research choices that give different effects based on the previous runs">Theology:</h3></div></br>');
        let fanORanth = $('<select style="width:150px;"><option value="fanaticism">Fanaticism</option><option value="anthropology">Anthropology</option></select>');
        let fanDesc = "Gain a dominant trait from your progenitor race. If same race, gain a random minor trait. Gives bonuses to combat and trade. Better for long runs.";
        let anthDesc = "Gives bonuses to science and tax income. Better for short runs.";
        let target1 = $('<div style="padding-left:5%;display:flex;"><span style="width:4rem">Target 1:</span></div>');
        target1.append(fanORanth);
        fanORanth[0].value = settings.fanORanth;
        if (settings.fanORanth == "anthropology") {
            fanORanth[0].title = anthDesc;
        } else {
            fanORanth[0].title = fanDesc;
        }
        fanORanth[0].onchange = function(){
            settings.fanORanth = fanORanth[0].value;
            if (settings.fanORanth == "anthropology") {
                fanORanth[0].title = anthDesc;
            } else {
                fanORanth[0].title = fanDesc;
            }
            console.log("Changing target to ", settings.fanORanth);
            updateSettings();
        };

        // Creating Study/Deify choice
        let studyORdeify = $('<select style="width:150px;"><option value="study">Study</option><option value="deify">Deify</option></select>');
        let deifyDesc = "Gain a dominant trait from your progenitor's progenitor race. If same race, gain a random minor trait. Gives bonuses to combat and trade. Better for long runs.";
        let studyDesc = "Gives bonuses to science and tax income. Better for short runs.";
        let target2 = $('<div style="padding-left:5%;display:flex;"><span style="width:4rem">Target 2:</span></div>');
        target2.append(studyORdeify);
        studyORdeify[0].value = settings.studyORdeify;
        if (settings.studyORdeify == "study") {
            studyORdeify[0].title = studyDesc;
        } else {
            studyORdeify[0].title = deifyDesc;
        }
        studyORdeify[0].onchange = function(){
            settings.studyORdeify = studyORdeify[0].value;
            if (settings.studyORdeify == "study") {
                studyORdeify[0].title = studyDesc;
            } else {
                studyORdeify[0].title = deifyDesc;
            }
            console.log("Changing target to ", settings.studyORdeify);
            updateSettings();
        };
        tab.append(label).append(target1).append(target2);

        // Creating Unification choice
        let label2 = $('<div><h3 class="name has-text-warning" title="Research choice that either gives morale boost or production increase">Unification:</h3></div></br>');
        let uniChoice = $('<select style="width:150px;"><option value="unify">Unify</option><option value="reject">Reject</option></select>');
        let unifyDesc = 'Choose Unification (Either by Conquest, Cultural Supremacy, or Buy the World). Will remove combat and give storage bonus';
        let rejectDesc = 'Choose to reject Unification. Will give morale bonus';
        let target3 = $('<div style="padding-left:5%;display:flex;"><span style="width:4rem;">Choice: </span></div>');
        target3.append(uniChoice);
        if (settings.uniChoice == "unify") {
            uniChoice[0].title = unifyDesc;
        } else {
            uniChoice[0].title = rejectDesc;
        }
        uniChoice[0].value = settings.uniChoice;
        uniChoice[0].onchange = function(){
            settings.uniChoice = uniChoice[0].value;
            if (settings.uniChoice == "unify") {
                uniChoice[0].title = unifyDesc;
            } else {
                uniChoice[0].title = rejectDesc;
            }
            console.log("Changing target to ", settings.uniChoice);
            updateSettings();
        };
        tab.append(label2).append(target3);

    }

    function nameCompare(a, b) {
        return b.name < a.name;
    }
    function priorityCompare(a, b) {
        return b.basePriority - a.basePriority;
    }
    function powerCompare(a, b) {
        let bPP = (b instanceof PoweredBuilding) ? b.powerPriority : -1;
        let aPP = (a instanceof PoweredBuilding) ? a.powerPriority : -1;
        return bPP - aPP;
    }
    function getActionFromId(id) {
        let [a, t] = id.split('-');
        let action = null;
        if (t === undefined) {
            if (a == "Container" || a == "Crate") {
                action = storages[a];
            } else if (a == 'Gene' || a == 'Mercenary' || a == 'FortressMercenary') {
                action = miscActions[a];
            } else {
                action = arpas[a];
            }
        } else {
            if (a == 'tech') {
                action = researches[id];
            } else {
                action = buildings[id];
            }
        }
        return action;
    }
    function updatePriorityList() {
        console.log("Updating Priority List");
        let search = $('#priorityInput')[0];
        let sort = $('#prioritySort')[0];
        let priorityList = $('#priorityList')[0];

        // Finding search parameters
        let terms = search.value.split(' ');
        let names = [];
        let locs = [];
        let res = [];
        for (let i = 0;i < terms.length;i++) {
            let locCheck = /loc:(.+)/.exec(terms[i]);
            let resCheck = /res:(.+)/.exec(terms[i]);
            //console.log(terms[i], tagCheck, resCheck);
            if (locCheck !== null) {
                locs.push(locCheck[1]);
            } else if (resCheck !== null) {
                res.push(resCheck[1]);
            } else {
                names.push(terms[i]);
            }
        }

        // Sorting if necessary
        let sortMethod = null;
        if (sort.value == 'name') {
            sortMethod = nameCompare;
        } else if (sort.value == 'priority') {
            sortMethod = priorityCompare;
        } else if (sort.value == 'powerPriority') {
            sortMethod = powerCompare;
        }
        if (sortMethod !== null) {
            var newPriorityList = priorityList.cloneNode(false);

            let header = priorityList.childNodes[0];
            // Add all lis to an array
            var divs = [];
            for(let i = 1;i < priorityList.childNodes.length;i++){
                    divs.push(priorityList.childNodes[i]);
            }
            // Sort the lis in descending order
            divs.sort(function(a, b){
                let bAction = getActionFromId(b.id.split('=')[0]);
                let aAction = getActionFromId(a.id.split('=')[0]);
                return sortMethod(aAction, bAction);
            });
            console.log(divs[0]);

            // Add them into the ul in order
            newPriorityList.appendChild(header);
            for (let i = 0; i < divs.length; i++) {
                newPriorityList.appendChild(divs[i]);
            }
            priorityList.parentNode.replaceChild(newPriorityList, priorityList);
            priorityList = newPriorityList;
        }

        for (let i = 1;i < priorityList.children.length;i++) {
            // Getting action
            let div = priorityList.children[i];
            let id = div.id.split('=')[0];
            let action = getActionFromId(id);

            // Checking if available
            if (!settings.showAll && !action.unlocked) {
                div.style.display = 'none';
                continue;
            }
            // Checking if type shown
            if (!settings.showBuilding && action instanceof Building) {
                div.style.display = 'none';
                continue;
            }
            if (!settings.showResearch && action instanceof Research) {
                div.style.display = 'none';
                continue;
            }
            if (!settings.showMisc && (action instanceof MiscAction)) {
                div.style.display = 'none';
                continue;
            }
            // Searching for if any names appear in building name
            if (names.length != 0) {
                let pass = false;
                for (let i = 0;i < names.length;i++) {
                    var name;
                    if (action.name !== null) {
                        name = action.name;
                    } else {
                        name = action.id.split('-')[1];
                    }
                    if (name.toLowerCase().indexOf(names[i]) >= 0) {
                        pass = true;
                        break;
                    }
                }
                if (!pass) {
                    div.style.display = 'none';
                    continue;
                }
            }
            // Searching for if any tags appear in research name
            if (locs.length != 0) {
                let pass = false;
                for (let i = 0;i < locs.length;i++) {
                    if (action.loc.includes(locs[i])) {
                        pass = true;
                        break;
                    }
                }
                if (!pass) {
                    div.style.display = 'none';
                    continue;
                }
            }
            // Searching for if any resources appear in research requirements
            if (res.length != 0 && action.res !== null) {
                let pass = false;
                for (let i = 0;i < res.length;i++) {
                    console.log(action.id, res, action.def.cost, action.getResDep(res[i]));
                    if (action.getResDep(res[i]) !== null && action.getResDep(res[i]) > 0) {
                        pass = true;
                        break;
                    }
                }
                if (!pass) {
                    div.style.display = 'none';
                    continue;
                }
            }

            div.style.display = 'flex';

        }

        // Set focus back on search
        search.focus();
    }
    function drawBuildingItem(building, buildingDiv) {

        // Building At Least
        let atLeastSub = function() {
            buildings[building.id].decAtLeast();
            return buildings[building.id].atLeast;
        }
        let atLeastAdd = function() {
            buildings[building.id].incAtLeast();
            return buildings[building.id].atLeast;
        }
        let atLeastControls = createNumControl(buildings[building.id].atLeast, building.id+'-at-least', atLeastSub, atLeastAdd);
        let atLeastDiv = $('<div style="width:10%;" title="'+building.id+' At Least"></div>');
        atLeastDiv.append(atLeastControls);
        buildingDiv.append(atLeastDiv);

        // Building Limit
        let limSub = function() {
            buildings[building.id].decLimit();
            return buildings[building.id].limit;
        }
        let limAdd = function() {
            buildings[building.id].incLimit();
            return buildings[building.id].limit;
        }
        let limControls = createNumControl(buildings[building.id].limit, building.id+'-limit', limSub, limAdd);
        let limDiv = $('<div style="width:10%;" title="'+building.id+' Limit"></div>');
        limDiv.append(limControls);
        buildingDiv.append(limDiv);

        // Building SoftCap
        let softCapSub = function() {
            buildings[building.id].decSoftCap();
            return buildings[building.id].softCap;
        }
        let softCapAdd = function() {
            buildings[building.id].incSoftCap();
            return buildings[building.id].softCap;
        }
        let softCapControls = createNumControl(buildings[building.id].softCap, building.id+'-softcap', softCapSub, softCapAdd);
        let softCapDiv = $('<div style="width:10%;" title="'+building.id+' Soft Cap"></div>');
        softCapDiv.append(softCapControls);
        buildingDiv.append(softCapDiv);

        // Power Priority
        if (building instanceof PoweredBuilding) {
            let powerSub = function() {
                buildings[building.id].decPowerPriority();
                return buildings[building.id].powerPriority;
            }
            let powerAdd = function() {
                buildings[building.id].incPowerPriority();
                return buildings[building.id].powerPriority;
            }
            let powerControls = createNumControl(buildings[building.id].powerPriority, building.id+'-power-prio', powerSub, powerAdd);
            let powerDiv = $('<div style="width:10%;" title="'+building.id+' Power Priority"></div>');
            powerDiv.append(powerControls);
            buildingDiv.append(powerDiv);
        }
    }
    function populatePriorityList() {
        let priorityList = $('#priorityList')[0];
        var x;
        var name;
        let temp_l = [];
        for (x in buildings) {temp_l.push(buildings[x]);}
        for (x in researches) {temp_l.push(researches[x]);}
        for (x in arpas) {temp_l.push(arpas[x]);}
        for (x in storages) {temp_l.push(storages[x]);}
        for (x in miscActions) {temp_l.push(miscActions[x]);}
        while(priorityList.childNodes.length != 1) {
            priorityList.removeChild(priorityList.lastChild);
        }
        // Drawing buildings into list
        for (let i = 0;i < temp_l.length;i++) {
            let action = temp_l[i];
            var actionDiv;
            if (i % 2) {
                actionDiv = $('<div id="'+action.id+'=prio" style="display:flex" class="market-item"></div>');
            } else {
                actionDiv = $('<div id="'+action.id+'=prio" style="display:flex" class="resource alt market-item"></div>');
            }
            priorityList.appendChild(actionDiv[0]);

            // Name Label
            if (action.name === null) {
                name = action.id.split('-')[1];
            } else {
                name = action.name;
            }
            let nameDiv = $('<span style="width:20%;" title="'+action.id+'">'+name+'</span>');
            if (action instanceof Building) {
                nameDiv[0].classList.add('has-text-warning');
            } else if (action instanceof Research) {
                nameDiv[0].classList.add('has-text-danger');
            } else {
                nameDiv[0].classList.add('has-text-special');
            }
            actionDiv.append(nameDiv);

            // Priority
            let prioSub = function() {
                if (action.loc.includes('arpa')) {
                    arpas[action.id].decBasePriority();
                    return arpas[action.id].basePriority;
                } else if (action.loc.includes('storage')) {
                    storages[action.id].decBasePriority();
                    return storages[action.id].basePriority;
                } else if (action.loc.includes('tech')) {
                    researches[action.id].decBasePriority();
                    return researches[action.id].basePriority;
                } else if (action.loc.includes('misc')) {
                    miscActions[action.id].decBasePriority();
                    return miscActions[action.id].basePriority;
                } else {
                    buildings[action.id].decBasePriority();
                    return buildings[action.id].basePriority;
                }
            }
            let prioAdd = function() {
                if (action.loc.includes('arpa')) {
                    arpas[action.id].incBasePriority();
                    return arpas[action.id].basePriority;
                } else if (action.loc.includes('storage')) {
                    storages[action.id].incBasePriority();
                    return storages[action.id].basePriority;
                } else if (action.loc.includes('tech')) {
                    researches[action.id].incBasePriority();
                    return researches[action.id].basePriority;
                } else if (action.loc.includes('misc')) {
                    miscActions[action.id].incBasePriority();
                    return miscActions[action.id].basePriority;
                } else {
                    buildings[action.id].incBasePriority();
                    return buildings[action.id].basePriority;
                }
            }
            let settingVal = "";
            if (action.loc.includes('arpa')) {
                settingVal = arpas[action.id].basePriority;
            } else if (action.loc.includes('storage')) {
                settingVal = storages[action.id].basePriority;
            } else if (action.loc.includes('tech')) {
                settingVal = researches[action.id].basePriority;
            } else if (action.loc.includes('misc')) {
                settingVal = miscActions[action.id].basePriority;
            } else {
                settingVal = buildings[action.id].basePriority;
            }
            let prioControls = createNumControl(settingVal,"action_"+name+"_priority",prioSub,prioAdd);
            let prioDiv = $('<div style="width:10%;" title="'+action.id+' Priority"></div>');
            prioDiv.append(prioControls);
            actionDiv.append(prioDiv);

            // Enable Toggle
            let enableDiv = $('<div style="width:10%;" title="'+action.id+' Enabled"></div>');
            actionDiv.append(enableDiv);
            let toggle = createToggleControl('enabled', '', {root:action,small:true});
            enableDiv.append(toggle);

            if (action instanceof Building) {
                drawBuildingItem(action,actionDiv);
            }
        }
    }
    function createPriorityList(settingsTab) {
        // Creation Priority List
        let priorityLabel = $('<div><h3 class="name has-text-warning" title="Set the Priority settings">Actions:</h3></div></br>');
        settingsTab.append(priorityLabel);
        let prioritySettingsDiv = $('<div id="prioritySettingsDiv" style="overflow:auto"></div>');
        let prioritySettingsLeft = $('<div id="prioritySettingsLeft" style="float:left"></div>');
        let prioritySettingsRight = $('<div id="prioritySettingsRight" style="float:right"></div>');

        let topLeft = $('<div id="prioritySettingsTopLeft"></div>');
        let bottomLeft = $('<div id="prioritySettingsBottomLeft"></div>');
        let topRight = $('<div id="prioritySettingsTopRight" style="float:right"></div>');
        let bottomRight = $('<div id="prioritySettingsBottomRight"></div>');

        let search = $('<input type="text" id="priorityInput" placeholder="Search for actions (ex: \'iron loc:city res:money\')" style="width:400px;">');
        search.on('input', updatePriorityList);
        let sortLabel = $('<span style="padding-left:20px;padding-right:20px;">Sort:</span>');
        let sort = $('<select style="width:110px;" id="prioritySort"><option value="none">None</option><option value="name">Name</option><option value="priority">Priority</option><option value="power_priority">Power Priority</option></select>');
        sort.on('change', updatePriorityList);
        topLeft.append(search).append(sortLabel).append(sort);

        let showAll = createCheckBoxControl(settings.showAll, 'showAll', 'Show All', updatePriorityList, updatePriorityList);
        let showBuilding = createCheckBoxControl(settings.showBuilding, 'showBuilding', 'Show Buildings', updatePriorityList, updatePriorityList);
        let showResearch = createCheckBoxControl(settings.showResearch, 'showResearch', 'Show Researches', updatePriorityList, updatePriorityList);
        let showMisc = createCheckBoxControl(settings.showMisc, 'showMisc', 'Show Misc.', updatePriorityList, updatePriorityList);
        bottomLeft.append(showAll).append(showBuilding).append(showResearch).append(showMisc);

        let enableLabel = $('<span style="padding-right:10px;">Enable:</span>');
        let enableAllBtn = $('<a class="button is-dark is-small" id="enable-all-btn"><span>All</span></a>');
        enableAllBtn.on('click', function(e){
            if (e.which != 1) {return;}
            let priorityList = $('#priorityList')[0];
            for (let i = 1;i < priorityList.childNodes.length;i++) {
                getActionFromId(priorityList.childNodes[i].id.split('=')[0]).enabled = true;
            }
            populatePriorityList();
            updatePriorityList();
        });
        let enableVisBtn = $('<a class="button is-dark is-small" id="enable-vis-btn"><span>Visible</span></a>');
        enableVisBtn.on('click', function(e){
            if (e.which != 1) {return;}
            let priorityList = $('#priorityList')[0];
            for (let i = 1;i < priorityList.childNodes.length;i++) {
                if (priorityList.childNodes[i].style.display !== 'none') {
                    getActionFromId(priorityList.childNodes[i].id.split('=')[0]).enabled = true;
                }
            }
            populatePriorityList();
            updatePriorityList();
        });
        topRight.append(enableLabel).append(enableAllBtn).append(enableVisBtn);

        let disableLabel = $('<span style="padding-right:10px;">Disable:</span>');
        let disableAllBtn = $('<a class="button is-dark is-small" id="disable-all-btn"><span>All</span></a>');
        disableAllBtn.on('click', function(e){
            if (e.which != 1) {return;}
            let priorityList = $('#priorityList')[0];
            for (let i = 1;i < priorityList.childNodes.length;i++) {
                getActionFromId(priorityList.childNodes[i].id.split('=')[0]).enabled = false;
            }
            populatePriorityList();
            updatePriorityList();
        });
        let disableVisBtn = $('<a class="button is-dark is-small" id="disable-vis-btn"><span>Visible</span></a>');
        disableVisBtn.on('click', function(e){
            if (e.which != 1) {return;}
            let priorityList = $('#priorityList')[0];
            for (let i = 1;i < priorityList.childNodes.length;i++) {
                if (priorityList.childNodes[i].style.display !== 'none') {
                    getActionFromId(priorityList.childNodes[i].id.split('=')[0]).enabled = false;
                }
            }
            populatePriorityList();
            updatePriorityList();
        });
        bottomRight.append(disableLabel).append(disableAllBtn).append(disableVisBtn);

        prioritySettingsLeft.append(topLeft).append(bottomLeft);
        prioritySettingsRight.append(topRight).append(bottomRight);
        prioritySettingsDiv.append(prioritySettingsLeft).append(prioritySettingsRight);
        settingsTab.append(prioritySettingsDiv);

        let priorityList = $('<div id="priorityList"></div>');
        let priorityListLabel = $(`<div style="display:flex;">
                                    <span class="name has-text-warning" style="width:20%;text-align:left;padding-left:1rem;" title="Action Name. Can be lowercase id if not currently available">Action</span>
                                    <span class="name has-text-warning" style="width:10%;text-align:left;padding-left:1rem;" title="Sets the priority of this action">Priority</span>
                                    <span class="name has-text-warning" style="width:10%;text-align:left;padding-left:1rem;" title="Enables this action for being automatically taken">Enabled</span>
                                    <span class="name has-text-warning" style="width:10%;text-align:left;padding-left:1rem;" title="Will focus on buying this amount of this building before anything else.">At Least</span>
                                    <span class="name has-text-warning" style="width:10%;text-align:left;padding-left:1rem;" title="Will stop building this building after reaching this limit">Limit</span>
                                    <span class="name has-text-warning" style="width:10%;text-align:left;padding-left:1rem;" title="Will softcap this building after reaching this limit, however will still build if resources full">Soft Cap</span>
                                    <span class="name has-text-warning" style="width:10%;text-align:left;padding-left:1rem;" title="Sets the priority for powering this building">Power</span>
                                    </div>`);
        priorityList.append(priorityListLabel);
        settingsTab.append(priorityList);
        populatePriorityList();
        updatePriorityList();
    }
    function createAutoSettingPriorityPage(tab) {

        // Auto Priority
        let autoPriorityDesc = 'Main Priority System. Creates a priority queue for all the buildings/research/misc. The priority queue can also be used to manage allocation for other settings (smelter, trade, etc). This will probably be heavily reworked in the future.';
        let [autoPriorityTitle, autoPriorityContent] = createAutoSettingToggle('autoPriority', 'Auto Priority', autoPriorityDesc, false, tab);

        createPriorityList(tab);

    }

    function createAutoLog() {
        let autolog = $('<div id="autolog" class="msgQueue right resource alt as-autolog"></div>');
        $('#queueColumn').append(autolog);
    }

    /***
    *
    * Utilities
    *
    ***/

    function messageQueue(msg,color){
        color = color || 'warning';
        var new_message = $('<p class="has-text-'+color+'">'+msg+'</p>');
        $('#autolog').prepend(new_message);
        if ($('#autolog').children().length > 30){
            $('#autolog').children().last().remove();
        }
    }

    function getTotalGameDays() {
        try {
        let str = $('#statsPanel')[0].children[$('#statsPanel')[0].children.length-1].innerText;
        let reg = /Game Days Played: ([\d]+)/.exec(str);
        return parseInt(reg[1]);
        } catch(e) {
            console.log('Error in getting total game days');
            return null;
        }
    }
    function getYear() {
        try {
            return parseInt($('.year > .has-text-warning')[0].innerText);
        } catch(e) {
            console.log('Error in getting current year');
            return null;
        }
    }
    function getDay() {
        try {
            return parseInt($('.day > .has-text-warning')[0].innerText);
        } catch(e) {
            console.log('Error: Day');
            return null;
        }
    }
    function getLunarPhase() {
        let moon = document.querySelector('.calendar > .is-primary');
        if (moon !== null) {
            return moon.attributes['data-label'].value;
        } else {
            console.log("Error: Lunar Phase");
            return "";
        }
    }
    function getRace() {
        try {
            return $('#race > .column > span')[0].innerText;
        } catch(e) {
            console.log('Error in getting current race');
            return null;
        }
    }

    // Forces keyup event for all the multiplier keys
    function disableMult() {
        var evt = new KeyboardEvent('keyup', {'ctrlKey':false, 'shiftKey':false, 'altKey':false});
        document.dispatchEvent (evt);
    }

    // Convert from abbreviated value to actual number
    function getRealValue(num){
        var suffix = {
            K:1000,
            M:1000000
        }
        var currSuff = /([-]?)([\.0-9]+)([^\d\.])/.exec(num);
        if(currSuff !== null && currSuff.length == 4){
            var sign = (currSuff[1] == "-") ? -1 : 1;
            var n = parseFloat(currSuff[2]);
            var suff = currSuff[3];
            if (suffix[suff] !== null) {n *= suffix[suff];}
            n *= sign;
            return n;
        }
        return parseFloat(num);
    }
    // Determines if the research given has already been researched
    function researched(id) {
        let researched = $('#oldTech > div');
        for (let i = 0;i < researched.length;i++) {
            if (id == researched[i].id) {
                return true;
            }
        }
        return false;
    }
    // Determines if stage is currently in evolution
    function inEvolution() {
        let evolutionTabLabel = getTabLabel("Evolve");
        if (evolutionTabLabel === null) {return false;}
        return evolutionTabLabel.style.display != 'none';
    }
    // Determines if the civics tab has been unlocked
    function civicsOn() {
        let civicsTabLabel = getTabLabel("Civics");
        if (civicsTabLabel === null) {return false;}
        return civicsTabLabel.style.display != 'none';
    }
    // Finding tab-items
    function getTab(name) {
        let nav = $('#mainColumn > .content > .b-tabs > .tabs > ul > li > a > span');
        for (let i = 0;i < nav.length;i++) {
            if (nav[i].innerText.trim() == name) {
                let nth=i+1
                return document.querySelector('#mainColumn > .content > .b-tabs > .tab-content > div:nth-child('+nth+')')
            }
        }
        return null;
    }
    function getTabLabel(name) {
        let nav = $('#mainColumn > .content > .b-tabs > .tabs > ul > li > a > span');
        for (let i = 0;i < nav.length;i++) {
            if (nav[i].innerText.trim() == name) {
                let nth=i+1
                return document.querySelector('#mainColumn > .content > .b-tabs > .tabs > ul > li:nth-child('+nth+')')
            }
        }
        return null;
    }
    // Getting free support
    function getFreePower(name) {
        switch(name) {
            case 'electricity': {
                let label = document.getElementById('powerMeter');
                if (label !== null) {
                    return parseInt(label.innerText);
                } else {
                    return 0;
                }
            }
            case 'moon':
            case 'red':
            case 'swarm':
            case 'belt': {
                let label = document.querySelector('#srspc_'+name+' > span');
                if (label !== null) {
                    let data = label.innerText.split('/');
                    return data[1] - data[0];
                } else {
                    return 0;
                }
            }
            default:
                return 0;
        }
    }
    // Determines if a perk has been unlocked
    function perkUnlocked(perk) {
        let pat = "";
        switch(perk) {
            case 'Morphogenesis':
                pat = /Evolution costs decreased/;
                break;
            default:
                return false;
        }
        let divList = $('#perksPanel > div');
        for (let i = 0;i < divList.length;i++) {
            if (pat.exec(divList[i].innerText) !== null) {
                return true;
            }
        }
        return false;
    }
    // Determines if an achievement has been unlocked
    // Returns the achievement level (1-5) if unlocked
    // Returns -1 if not unlocked
    function achievementUnlocked(achievement) {
        let divList = $('.achievement');
        for (let i = 0;i < divList.length;i++) {
            if (divList[i].children[0].innerText == achievement) {
                return $('.achievement')[0].children[2].children[0].attributes.class.value[4];
            }
        }
        return -1;
    }

    function getMinMoney() {
        if (settings.minimumMoney < 1) {
            return settings.minimumMoney * resources.Money.storage;
        } else {
            return settings.minimumMoney;
        }
    }

    function wouldBreakMoneyFloor(buyValue){
        return resources.Money.amount - buyValue < getMinMoney();
    }
}

