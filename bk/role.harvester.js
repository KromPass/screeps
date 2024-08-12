var roleHarvester = {

  /** @param {Creep} creep **/
  run: function(creep) {

    if(creep.store.getFreeCapacity() > 0) {
      //var sources = creep.room.find(FIND_SOURCES);
      var sources = creep.pos.findClosestByRange(FIND_SOURCES)
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffffff'}});
      }
      if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
        creep.moveTo(sources, {visualizePathStyle: {stroke: '#c0d369'}});
      }
    }
    else {
      var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
          return (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN ||
              structure.structureType == STRUCTURE_CONTAINER ||
              structure.structureType == STRUCTURE_TOWER)  &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
      })

      /*var targets = creep.room.find(FIND_STRUCTURES, {
              filter: (structure) => {
                  return (structure.structureType == STRUCTURE_EXTENSION ||
                          structure.structureType == STRUCTURE_SPAWN ||
                          //structure.structureType == STRUCTURE_CONTAINER ||
                          structure.structureType == STRUCTURE_TOWER)  &&
                          structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
              }
      });
      if(targets.length > 0) {
          if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
          }
      }

      */
      if(target) {
        if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
      }else{

        var targets = creep.room.find(FIND_CONSTRUCTION_SITES, {
          filter: (structure)=> Memory.banStructures.indexOf(structure.id) === -1 // solo il builderCustom va su questa struttura
        });
        if(targets.length) {
          if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
          }
        }else{
          var targets = creep.room.find(FIND_STRUCTURES, { filter: (structure) => structure.structureType == STRUCTURE_SPAWN });
          creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#850016'}});
        }
      }
    }
  }

};

module.exports = roleHarvester;
