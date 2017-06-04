"use strict";

const h = require('react-hyperscript')
    , Multistream = require('multistream')
    , fileReaderStream = require('filereader-stream')
    , { Box, Text, Heading } = require('axs-ui')
    , mail = require('../mail')

module.exports = props =>
  h(Box , [
    h(Heading, { level: 1 }, 'Mailnote'),

    h(Box, { backgroundColor: 'gray2', p: 2 }, [
      h(Text, 'Upload messages'),
      h('input', {
        type: 'file',
        onChange: e => {
          const { files } = e.target
              , stream = Multistream([...files].map(fileReaderStream))

          mail.importMailbox(props.db, stream)
        }
      })
    ]),
  ])
