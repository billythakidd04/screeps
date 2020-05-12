// spawning logic
var roles = [{
    "harvester": {
        body: [WORK, WORK, WORK],
        minimum: 5,
        value: 5,
    },
    "builder": {
        body: [MOVE, CARRY, WORK],
        minimum: 2,
        value: 2
    },
    "transport": {
        body: [CARRY, CARRY, CARRY, MOVE, MOVE, MOVE,],
        minimum: 2,
        value: 3,
        requires: [
            "container"
        ]
    },
    "upgrader": {
        body: [MOVE, CARRY, WORK],
        minimum: 2,
        value: 1
    },
    "soldier": {
        body: [MOVE, MOVE, ATTACK],
        minimum: 2,
        value: 0,
        requires: [
            "wall"
        ]
    }
}];

//Comparer Function    
function GetSortOrder(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }
        return 0;
    }
}

var spawnController = {
    getRoleMinimums: function (role) {
        if (Memory.counts == undefined) {
            Memory.counts = []
        }
        console.log("current counts: " + Memory.counts)
        for (let key in roles) {
            if (roles.hasOwnProperty(key)) {
                let count = this.getRoleCounts(key)
                console.log(key + " counts: " + count)
                Memory.counts[role] = count > 0 ? count : roles[role].minimum;
            }
        }
        console.log("updated counts: " + JSON.stringify(Memory.counts))

        return Memory.counts[role];
    },
    getRoleCounts: function (role) {
        let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        // console.log(role + " count: " + creeps.length)
        return creeps.length;
    },
    spawnCreeps: function (spawnLocation) {
        this.addCreepsToQueue(spawnLocation)
        // if we're currently spawning announce the deets
        if (spawnLocation.spawning) {
            console.log("spawning " + JSON.stringify(spawnLocation.memory.spawnQueue[0]))
            spawnLocation.room.visual.text(
                '🛠️' + spawnLocation.memory.spawnQueue[0].role,
                spawnLocation.pos.x + 1,
                spawnLocation.pos.y,
                { align: 'left', opacity: 0.8 });
            // otherwise add a new creep to the queue
        } else {
            console.log("not spawning")
            if (spawnLocation.memory.spawnQueue.length > 0) {
                var creepToSpawn = spawnLocation.memory.spawnQueue.shift()
                console.log(
                    "spawning: " + JSON.stringify(creepToSpawn) +
                    "\nresult" + spawnLocation.spawnCreep(creepToSpawn.body, creepToSpawn.name, { memory: { role: creepToSpawn.role } }
                    ))
            }
            this.addCreepsToQueue(spawnLocation)
        }
    },
    getAvailableEnergyLevels: function (spawnLocation) {
        // TODO
    },
    getMaxCreepSize: function (role) {
        // TODO get room energy
        // TODO check if we can add additional body parts based on energy available
        return roles[role].body
    },
    addCreepsToQueue: function (spawnLocation) {
        if (spawnLocation.memory.spawnQueue == undefined) {
            console.log("creating queue for " + JSON.stringify(spawnLocation))
            spawnLocation.memory.spawnQueue = []
        }
        console.log("sorting roles")
        console.log("before: " + JSON.stringify(roles))
        // TODO check most valuable/needed roles first ie sort roles by value
        roles.sort(function (a, b) {
            console.log("sorting")
            console.log(JSON.stringify(a))
            return b.value - a.value
        });
        console.log("after: " + JSON.stringify(roles))

        for (var role in roles) {
            // TODO check if role requirements met
            if (role.requires != undefined) {
                // TODO skip roles with value of 0 until all others are full
            }
            // TODO check if energy requirements met
            if (this.getRoleCounts(role) < this.getRoleMinimums(role)) {
                var creep = {
                    body: this.getMaxCreepSize(role),
                    name: role + Game.time,
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