"use strict";

const Dexie = require('dexie')

module.exports = function getDB() {
  const db = new Dexie('__mailparse')

  db.version(1).stores({
    messages: 'id, *tags, *from, headers.date'
  })

  return db;
}
