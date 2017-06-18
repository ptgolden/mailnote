"use strict";

const h = require('react-hyperscript')
    , React = require('react')
    , { Flex, Box, Heading, Text } = require('axs-ui')
    , mail = require('../mail')
    , AsyncRequestor = require('./AsyncRequestor')

const Mailbox = props =>
  h(Flex, { css: { height: '100%' }}, [
    h(Box, {
      css: {
        height: '100%',
        overflowY: 'scroll',
      }
    }, [
      h(Text, `${props.messages.length} messages`),
      h(Box, {
        css: {
          height: 10000,
        }
      }, props.messages.slice(50, 100).map(message =>
        h(Box, {
          key: message.id,
          border: 'black',
          p: 1,
          width: 400,
          css: {
            marginBottom: -1,
            ':hover': {
              cursor: 'pointer',
              backgroundColor: '#f0f0f0',
            }
          }
        }, [
          h(Text, { color: 'gray8' }, message.headers.date.toLocaleString()),
          h(Heading, { level: 3, fontSize: 4 }, message.headers.subject),
        ])
      ))
    ]),

    h(Box, {
      bg: 'gray8',
      css: {
        flexGrow: 1,
      }
    }, [
    ])
  ])


module.exports = AsyncRequestor(class MailboxLoader extends React.Component {
  componentDidMount() {
    this.props.doRequest(() => mail.getMessages(this.props.db))
  }

  render() {
    const { readyState } = this.props

    return (
      h(Box, {
        css: {
          height: '100%',
          overflowY: 'hidden',
        }
      },  readyState && readyState.case({
        Pending: () => 'Loading....',
        Error: err => JSON.stringify(err, true, '  '),
        Success: messages => h(Mailbox, { messages })
      }))
    )
  }
})
