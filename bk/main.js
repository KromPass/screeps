const roleHarvester = require('role.harvester');
const roleHealer = require('role.healer');
const roleUpgrader = require('role.upgrader');
const roleBuilder = require('role.builder');
const roleBuilderCustom = require('role.builderCustom');
const creepRenew = require('creep.renew');

let screepsTargetCreation = {
  harvester:3,
  upgrader:3,
  builder:1,
  healer:1,
}
Memory.banStructures = ['66b9490d5e26ad0012d340db']

module.exports.loop = function () {

  /*var tower = Game.getObjectById('f1b0e2d7e81fe879025fbc74');
  if(tower) {
      var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => structure.hits < structure.hitsMax
      });
      if(closestDamagedStructure) {
          tower.repair(closestDamagedStructure);
      }

      var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if(closestHostile) {
          tower.attack(closestHostile);
      }
  }*/

  if(Game.rooms[Object.keys(Game.rooms)[0]].energyAvailable>=300){
    const harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    const upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
    const builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    const healers = _.filter(Game.creeps, (creep) => creep.memory.role == 'healer');

    if(harvesters.length<screepsTargetCreation.harvester){
      Memory.workerNumber =parseInt(Memory.workerNumber)+1;
      Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],`harvester-${Memory.workerNumber}`, {memory:{role:'harvester'}})
    }else if(upgraders.length<screepsTargetCreation.upgrader){
      Memory.workerNumber =parseInt(Memory.workerNumber)+1;
      Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],`upgrader-${Memory.workerNumber}`, {memory:{role:'upgrader'}})
    }else if(builders.length<screepsTargetCreation.builder){
      Memory.workerNumber =parseInt(Memory.workerNumber)+1;
      Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],`builder-${Memory.workerNumber}`, {memory:{role:'builder'}})
    }else if(healers.length<screepsTargetCreation.healer){
      Memory.workerNumber =parseInt(Memory.workerNumber)+1;
      Game.spawns['Spawn1'].spawnCreep([WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],`healer-${Memory.workerNumber}`, {memory:{role:'healer'}})
    }

  }

  for(const name in Game.creeps) {
    const creep = Game.creeps[name];

    if(!creepRenew.validate(creep)){
      if(creep.memory.role == 'harvester') {
        roleHarvester.run(creep);
      }
      if(creep.memory.role == 'upgrader') {
        roleUpgrader.run(creep);
      }
      if(creep.memory.role == 'builder') {
        roleBuilder.run(creep);
      }
      if(creep.memory.role == 'builderCustom') {
        roleBuilderCustom.run(creep);
      }
      if(creep.memory.role == 'healer') {
        roleHealer.run(creep);
      }
    }else{
      creepRenew.run(creep)
    }


  }
}
