"use strict";

const h = require('react-hyperscript')
    , Multistream = require('multistream')
    , fileReaderStream = require('filereader-stream')
    , { Box, Text, Heading, Flex } = require('axs-ui')
    , mail = require('../mail')
    , Mailbox = require('./Mailbox')

module.exports = props =>
  h(Flex , {
    p: 2,
    flexDirection: 'column',
    css: {
      height: '100vh',
      overflowY: 'hidden',
    }
  }, [
    h(Box, [
      h(Heading, { level: 1 }, 'Mailnote'),

      h(Flex, { justifyContent: 'space-between', backgroundColor: 'gray2', p: 2 }, [
        h(Box, [
          h(Text, 'Upload messages'),
          h('input', {
            type: 'file',
            onChange: e => {
              const { files } = e.target
                  , stream = Multistream([...files].map(fileReaderStream))

              mail.importMailbox(props.db, stream)
            }
          }),
        ]),

        h('button', {
          onClick: () => {
            indexedDB.deleteDatabase('__mailparse')
          }
        }, 'Delete data'),
      ]),
    ]),

    h(Box, {
      border: 1,
      borderColor: 'gray3',
      css: {
        height: 1,
        flexGrow: 1,
        position: 'relative',
      }
    }, h(Mailbox, props))
  ])
