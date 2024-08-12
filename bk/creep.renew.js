var creepRenew = {

  /** @param {Creep} creep **/
  validate: function(creep) {

    if(creep.ticksToLive < 100 && !creep.memory.renew || creep.ticksToLive < 600 && creep.memory.renew){
      return 1;

    }else{
      creep.memory.renew = false
      return 0;
    }

  },
  /** @param {Creep} creep **/
  run: function(creep) {

    var targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_SPAWN
    });
    creep.moveTo(targets[0],{visualizePathStyle: {stroke: '#eb9b34'}})
    Game.spawns['Spawn1'].renewCreep(creep);
    creep.memory.renew = true
    //console.log(`Rinnovo ${creep.name} con ${creep.ticksToLive} vita`)

  }

};

module.exports = creepRenew;
