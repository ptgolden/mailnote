"use strict";

const h = require('react-hyperscript')
    , { render } = require('react-dom')
    , db = require('./db')()
    , Main = require('./components/Main')

render(
  h(Main, { db }),
  document.getElementById('main'))
