﻿'use strict';

var Pokemon = require('../zarel/battle-engine').BattlePokemon;

class OTLAgent {
    constructor() { }

    fetch_random_key(obj) {
        var temp_key, keys = [];
        for (temp_key in obj) {
            if (obj.hasOwnProperty(temp_key)) {
                keys.push(temp_key);
            }
        }
        return keys[Math.floor(Math.random() * keys.length)];
    }

    decide(gameState, options, mySide) {
        var maxDamage = 0;
        var bOption = '';
        //console.log(options);
        var oppactive = gameState.sides[1 - mySide.n].active;
        //console.log(mySide.active[0].name + " vs " + oppactive[0].name);
        //console.log(gameState.sides[1 - mySide.n].active);
        //console.log(gameState.sides[1 - mySide.n].active[0].runImmunity);
        //console.log(gameState.sides[1 - mySide.n].active.name);
        //console.log(oppactive);
        //console.log(oppactive.runImmunity('Ground'));
        //console.log(options['move 1']);
        for (var option in options) {
            if (option.startsWith('move')) {
                var cDamage = gameState.getDamage(mySide.active[0], oppactive[0], options[option].id, false);
                
                if (cDamage && cDamage > maxDamage) {
                    // console.log(mySide.active[0].name + "'s " + options[option].move + " is expected to deal " + cDamage + " damage to " + oppactive[0].name);
                    maxDamage = cDamage;
                    bOption = option;
                }
                if (maxDamage >= oppactive[0].hp) {
                    // console.log('KO expected!');
                    return bOption;
                }
            }
            else if (option.startsWith('switch')) {
                var pIndex = parseInt(option.split(" ")[1]) - 1;
                for (var move in gameState.sides[mySide.n].pokemon[pIndex].getMoves(null, false)) {
                    var mID = (gameState.sides[mySide.n].pokemon[pIndex].moves[move]);
                    var cDamage = gameState.getDamage(mySide.pokemon[pIndex], oppactive[0], mID, false);
                    
                    if (cDamage && cDamage > maxDamage) {
                        // console.log(mySide.pokemon[pIndex].name + "'s " + mID + " is expected to deal " + cDamage + " damage to " + oppactive[0].name);
                        maxDamage = cDamage;
                        bOption = option;
                    }
                }

            }
            if (maxDamage == 0) {
                bOption = option;
                maxDamage = 1;
            }
        }
        //console.log(options[bOption]);
        //console.log(gameState.getDamage(myactive, oppactive, 'stoneedge', false));
        //console.log(gameState.sides[0].pokemon[0].runImmunity);
        
        return bOption;
    }

    assumePokemon(pname, plevel, pgender, side) {
        var nSet = {
            species: pname,
            name: pname,
            level: plevel,
            gender: pgender,
            evs: { hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 0 },
            ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
            nature: "Hardy"
        };
        var basePokemon = new Pokemon(nSet, side);
        // If the species only has one ability, then the pokemon's ability can only have the one ability.
        // Barring zoroark, skill swap, and role play nonsense.
        // This will be pretty much how we digest abilities as well
        if (Object.keys(basePokemon.template.abilities).length == 1) {
            basePokemon.baseAbility = toId(basePokemon.template.abilities['0']);
            basePokemon.ability = basePokemon.baseAbility;
            basePokemon.abilityData = { id: basePokemon.ability };
        }
        return basePokemon;
    }

    digest(line) {
    }
}

exports.Agent = OTLAgent;