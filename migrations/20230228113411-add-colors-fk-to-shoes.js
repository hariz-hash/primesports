'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up =  function(db) {
  return db.addForeignKey('shoes', 'colors', 'shoes_colors_fk',
       {
        "color_id":"id"
      },
       {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
       })
}

exports.down = function(db) {
  db.removeForeignKey("shoes", "shoes_colors_fk");
}
exports._meta = {
  "version": 1
};
