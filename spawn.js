// spawning logic
roles = [
    "harvester",
    "builder",
    "upgrader",
    "soldier",
]

global.counts = {
    "builder": 2,
    "upgrader": 2,
    "harvester": 5,
}

var spawnController = {
    getRoleMinimums: function (role) {
        if (global.counts[role] != 'undefined') {
            return global.counts[role];
        }
        return 0;
    },
    getRoleCounts = function (role) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        return creeps.length;
    },
    spawnCreeps: function (spawnLocation) {
        let currentSpawn = Game.spawns[spawnLocation]
        // if we're currently spawning announce the deets
        if (currentSpawn.spawning) {
            // TODO add creep to queue
            var spawningCreep = Game.creeps[currentSpawn.spawning.name];
            currentSpawn.room.visual.text(
                '🛠️' + role,
                currentSpawn.pos.x + 1,
                currentSpawn.pos.y,
                { align: 'left', opacity: 0.8 });
            console.log(
                'Spawning new ' + spawningCreep +
                '\nCreep counts:\nbuilders: ' + builder.length +
                '\nupgraders: ' + upgrader.length +
                '\nharvesters: ' + harvesters.length
            )
            // otherwise add a new creep to the queue
        } else {
            for (role in roles) {
                if (this.getRoleCounts(role) < this.getRoleMinimums(role)) {
                    var newName = role + Game.time;
                    // console.log('Spawning new harvester: ' + newName);
                    currentSpawn.spawnCreep([WORK, CARRY, MOVE], newName,
                        { memory: { role: role } });
                }
            }
            // if all basic roles are full lets add some "upgraded" creeps
            // else {
            //     var newName = 'bigHarvester' + Game.time;
            //     currentSpawn.spawnCreep(
            //         [WORK, WORK, WORK, CARRY, MOVE, MOVE],
            //         newName,
            //         {
            //             memory: {
            //                 role: 'harvester'
            //             }
            //         }
            //     )
            //     for (var role in global.counts) {
            //         let count = global.counts[role];
            //         global.counts[role] = ++count;
            //         console.log('min counts are now: ' + JSON.stringify(counts));
            //         console.log(
            //             'Creep counts:\nbuilders: ' + builder.length +
            //             '\nupgraders: ' + upgrader.length +
            //             '\nharvesters: ' + harvesters.length
            //         )
            //     }
            // }
        }
    },
    checkEnergyLevels: function (spawnLocation) {
        // TODO
    }
}

module.exports = spawnController