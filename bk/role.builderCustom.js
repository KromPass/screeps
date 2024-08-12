var roleBuilderCustom = {

  /** @param {Creep} creep **/
  run: function(creep) {

    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say('🔄 harvest');
    }
    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say('🚧 build');
    }

    if(creep.memory.building) {
      var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
        filter: (structure)=> Memory.banStructures.indexOf(structure.id) != -1 // solo il builderCustom va su questa struttura
      });
      if(targets.length) {
        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }else{
        var targets = creep.room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN ||
              structure.structureType == STRUCTURE_TOWER)
            //&& structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
          }
        });
        if(targets.length > 0) {
          if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
          }
        }
      }
    }else{
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffffff'}});
      }
    }
  }


};

module.exports = roleBuilderCustom;
