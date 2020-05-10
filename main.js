var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

var counts = {
    "builder": 2,
    "upgrader": 2,
    "harvester": 5,
}

module.exports.loop = function () {

    var tower = Game.getObjectById('b2c1e1f69e121579b06638e1');
    if (tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (closestHostile) {
            tower.attack(closestHostile);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgrader = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');

    // console.log("There are:\n"+builder.length+" builders\n"+upgrader.length+" upgraders\n"+harvesters.length+" harvesters\n")

    // if we're currently spawning announce the deets
    if (Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            { align: 'left', opacity: 0.8 });
        console.log(
            'Spawning new ' + spawningCreep.memory.role + ': ' + spawningCreep +
            '\nCreep counts:\nbuilders: ' + builder.length +
            '\nupgraders: ' + upgrader.length +
            '\nharvesters: ' + harvesters.length
        )
        // otherwise add a new creep to the queue
    } else {
        if (harvesters.length < counts["harvester"]) {
            var newName = 'Harvester' + Game.time;
            // console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
                { memory: { role: 'harvester' } });
        } else if (builder.length < counts["builder"]) {
            var newName = 'builder' + Game.time;
            // console.log('Spawning new builder: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
                { memory: { role: 'builder' } });
        } else if (upgrader.length < counts["upgrader"]) {
            var newName = 'upgrader' + Game.time;
            // console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK, CARRY, MOVE], newName,
                { memory: { role: 'upgrader' } });
        }
        // if all basic roles are full lets add some "upgraded" creeps
        else {
            var newName = 'bigHarvester' + Game.time;
            Game.spawns['Spawn1'].spawnCreep(
                [WORK, WORK, WORK, CARRY, MOVE, MOVE],
                newName,
                {
                    memory: {
                        role: 'harvester'
                    }
                }
            )
            for (var role in counts) {
                let count = counts[role];
                counts[role] = count++;
                console.log(role + ' min is now: ' + count);
            }
        }
    }

    for (var name in Game.creeps) {
        var creep = Game.creeps[name];

        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if (creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}