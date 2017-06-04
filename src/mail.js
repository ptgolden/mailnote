"use strict";

// To fix mailparser on the browser
global.setImmediate = require('timers').setImmediate
require('iconv-lite/lib/streams')(require('iconv-lite'))

const R = require('ramda')
    , Mbox = require('node-mbox')
    , parseMessage = require('mailparser').simpleParser

function formatName({ address, name }) {
  const parts = []

  if (name) {
    parts.push(name);
  }

  if (address) {
    parts.push(`<${address}>`)
  }

  return parts.join(' ')
}

async function importMailbox(db, mboxReadStream) {
  const messages = await new Promise((resolve, reject) => {
    const _messages = []

    mboxReadStream.pipe(new Mbox({}))
      .on('message', async rawMessage => {
        const message = await parseMessage(rawMessage)
            , headers = {}

        ;[...message.headers].forEach(([k, v]) => {
          headers[k] = v;
        })

        _messages.push({
          id: message.messageId,
          raw: rawMessage,
          headers,
          html: message.html || message.textAsHtml,
          tags: [],
          from: headers.from.value.map(formatName),
        })
      })
      .on('end', () => resolve(_messages))
      .on('error', err => reject(err))
  })

  const importTimestamp = new Date().getTime()

  db.messages.bulkAdd(messages.map(R.assoc('imported', importTimestamp)))
}

module.exports = {
  importMailbox,
}
