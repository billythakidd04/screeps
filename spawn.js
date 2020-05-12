// spawning logic
var roles = {
    "harvester": {
        body: [MOVE, CARRY, WORK],
        minimum: 2,
        value: 1
    },
    "builder": {
        body: [MOVE, CARRY, WORK],
        minimum: 2,
        value: 1
    },
    "upgrader": {
        body: [MOVE, CARRY, WORK],
        minimum: 2,
        value: 1
    },
    "soldier": {
        body: [MOVE, MOVE, ATTACK],
        minimum: 2,
        value: 1
    }
};

var spawnController = {
    getRoleMinimums: function (role) {
        if (Memory.counts == undefined) {
            Memory.counts = []
        }
        console.log("current counts: " + Memory.counts)
        for (let key in roles) {
            if (roles.hasOwnProperty(key)) {
                let count = this.getRoleCounts(key)

                Memory.counts[role] = count > 0 ? count : roles[role].minimum;
            }
        }
        console.log("updated counts: " + JSON.stringify(Memory.counts))

        return Memory.counts[role];
    },
    getRoleCounts: function (role) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        console.log(role + " count: " + creeps.length)
        return creeps.length;
    },
    spawnCreeps: function (spawnLocation) {
        // if we're currently spawning announce the deets
        if (spawnLocation.spawning) {
            // TODO add creep to queue
            spawnLocation.room.visual.text(
                '🛠️' + role,
                spawnLocation.pos.x + 1,
                spawnLocation.pos.y,
                { align: 'left', opacity: 0.8 });
            // otherwise add a new creep to the queue
        } else {
            if (spawnLocation.memory.spawnQueue != undefined && spawnLocation.memory.spawnQueue.length > 1) {
                console.log("spawn queue: " + JSON.stringify(spawnLocation.memory.spawnQueue))
                var creepToSpawn = spawnLocation.memory.spawnQueue.shift()
                console.log(
                    "spawning: " + JSON.stringify(creepToSpawn) +
                    "\nresult" + spawnLocation.spawnCreep(creepToSpawn.body, creepToSpawn.name, creepToSpawn.role
                    ))
            } else {
                console.log('not spawning')
                this.addCreepsToQueue(spawnLocation)
                // if all basic roles are full lets add some "upgraded" creeps
                // else {
                //     var newName = 'bigHarvester' + Game.time;
                //     spawnLocation.spawnCreep(
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
        }
    },
    checkEnergyLevels: function (spawnLocation) {
        // TODO
    },
    getMaxCreepSize: function (role) {
        // TODO
        return roles[role].body
    },
    addCreepsToQueue: function (spawnLocation) {
        if (spawnLocation.memory.spawnQueue == undefined) {
            console.log("creating queue for " + JSON.stringify(spawnLocation))
            spawnLocation.memory.spawnQueue = []
        }
        for (var role in roles) {
            if (this.getRoleCounts(role) < this.getRoleMinimums(role)) {
                var newName = role + Game.time;
                // TODO add creep to spawn queue
                var creep = {
                    body: this.getMaxCreepSize(role),
                    name: newName,
                    role: role
                }
                if (spawnLocation.memory.spawnQueue == undefined) {
                    spawnLocation.memory.spawnQueue = [];
                }
                console.log("adding creep to queue: " + JSON.stringify(creep))
                spawnLocation.memory.spawnQueue.push(creep);
            }
            console.log("updated spawn queue: " + JSON.stringify(spawnLocation.memory.spawnQueue))
        }
    }
};

module.exports = spawnController;