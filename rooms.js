const EXIT_NAME = {
    [FIND_EXIT_TOP]: 'FIND_EXIT_TOP',
    [FIND_EXIT_LEFT]: 'FIND_EXIT_LEFT',
    [FIND_EXIT_BOTTOM]: 'FIND_EXIT_BOTTOM',
    [FIND_EXIT_RIGHT]: 'FIND_EXIT_RIGHT'
};

let _fallenResource = {};
let _lowHealthStructs = {};

module.exports = {
    EXIT_NAME: EXIT_NAME,
    EXITS: [FIND_EXIT_TOP, FIND_EXIT_RIGHT, FIND_EXIT_BOTTOM, FIND_EXIT_LEFT],

    gc() {
        if (Game.tick % 25 === 0) {
            _fallenResource = {};
            _lowHealthStructs = {};
        }
    },

    healthRatio() {
        //console.log(`${this} ratio ${this.hits/this.hitsMax} ${this.hits} ${this.hitsMax}`)
        if( !this.hits || !this.hitsMax) return 1;
        let res = this.hits/this.hitsMax;
        return res;
    },

    /* static */ findLowHealthStructures (room, structureThreshold, roadThreshold=0.2) {
        // accept Room Object, RoomPosition Object, String
        let roomName = room.name || room.roomName || room;

        if (!_lowHealthStructs[roomName]) {
            _lowHealthStructs[roomName] = room.find(FIND_STRUCTURES, {
                filter: (s) => {
                    if (!s.hits || !s.hitsMax) return false;
                    s.healthRatio = this.healthRatio;
                    let threshold = (s.structureType === STRUCTURE_ROAD) ? roadThreshold : structureThreshold;

                    return s.healthRatio() < threshold;
                }
            });
        }
        console.log('lowHealth ' + _lowHealthStructs[roomName].length)
        
        if (! _lowHealthStructs[roomName] || _lowHealthStructs[roomName].length === 0) return;
        _lowHealthStructs[roomName].sort((a,b) => a.healthRatio() - b.healthRatio());
        return _lowHealthStructs[roomName].pop();
    },

    findFallenResource(roomName) {
        let room = Game.rooms[roomName];
        if ( !room) return;
        if ( !_fallenResource[roomName]) {
            _fallenResource[roomName] = room.find(FIND_DROPPED_RESOURCES);
        }
        
        if (_fallenResource[roomName]) {
            return _fallenResource[roomName].pop();
        }
    },
    determineRoomName: function(roomName, exitDir) {
        let pre1 = roomName[0],
            leftright = parseInt(roomName[1]),
            pre2 = roomName[2],
            topbottom = parseInt(roomName[3]);

        switch (exitDir) {
        case FIND_EXIT_TOP:
            topbottom++;
            break;
        case FIND_EXIT_BOTTOM:
            topbottom--;
            break;
        case FIND_EXIT_RIGHT:
            leftright--;
            break;
        case FIND_EXIT_LEFT:
            leftright++;
            break;
        default:
            throw new Error('invalid direction ' + exitDir);
        }
        let newRoom = pre1 + leftright + pre2 + topbottom;
        // console.log('determine new room ' + roomName + ' -> ' + newRoom);
        return newRoom;
    },
    bfs: function (root) {
        let queue = [ root.roomName ];
        
        for(let roomName in Memory.rooms) {
            delete Memory.rooms[roomName].visited;
            delete Memory.rooms[roomName].path;
        }
        root.visited = 1;
        root.path = [];

        // console.log('bfs ' + JSON.stringify(root))

        for(let i=0;i<queue.length;i++) {
            let node = Memory.rooms[queue[i]];
            // console.log('node ' + queue[i] + ' ' + JSON.stringify(node))
            for(let j=0;j<this.EXITS.length;j++) {
                let exitDir = this.EXITS[j],
                    child = node.exits[exitDir];
                
                if(!child || child.visited) continue;
                let path = node.path.slice(); //copy
                let thisSegment = {exit: exitDir, roomName: node.roomName };
                // console.log(`examining ${exitDir} ${EXIT_NAME[exitDir]} ` + JSON.stringify(thisSegment))
                path.push(thisSegment);

                if (child === true) {
                    // true === we know it exists, but haven't entered. Go here!
                    // console.log(`bfs path found! ` + JSON.stringify(thisSegment))
                    return path;
                } else if (child === false) {
                    // an exit in this direction does not exist
                } else {
                    // let scout;
                    // if (Memory.room && Memory.rooms[child] && Memory.rooms[child].scoutId) {
                    //     console.log('found room already claimed by ' + Memory.rooms[child].scoutId)
                    //     scout = Game.getObjectById(Memory.rooms[child].scoutId);
                    // }
                    // if (scout) {
                    //     console.log(`Verified that room ${child} was already claimed by ${scout}`)
                    // } else {
                        
                    // value is a roomName, and we've been here before.
                    //console.log(`examining ${EXIT_NAME[exitDir]}(${exitDir}) ` + JSON.stringify(thisSegment))
                    // console.log(`bfs puth onto queue! ${EXIT_NAME[exitDir]}(${exitDir}) ` + JSON.stringify(thisSegment))
                    Memory.rooms[child].path = path;
                    queue.push(child);
                    // }
                }
            }
        }
    }
};
