var roleHealer = {

  /** @param {Creep} creep **/
  run: function(creep) {
    if(creep.memory.active && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.active = false;
      creep.say('🔄 harvest');
    }
    if(!creep.memory.active && creep.store.getFreeCapacity() == 0) {
      creep.memory.active = true;
      creep.say('⚡ active');
    }

    if(creep.memory.active) {
      var structures = creep.room.find(FIND_STRUCTURES).filter(e => (e.hitsMax-e.hits)>0&&(e.hitsMax-e.hits)<10000)
      Memory.structuresToRepair=structures;
      if(creep.repair(structures[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(structures[0], {visualizePathStyle: {stroke: '#606934'}});
      }

    }
    else {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffffff'}});
      }
    }
  }


};

module.exports = roleHealer;
