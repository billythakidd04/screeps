// defense module
/*
locate energy sources
establish perimeter
    1. block doors?
    2. build near and direct to resources?
build towers at:
    1. spawn
    2. energy sources
build walls
create soldiers
*/

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
