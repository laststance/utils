#!/usr/bin/env node
'use strict'

/**
 * Colorful terminal message display utility
 * 
 * Displays eye-catching terminal messages with various emoji patterns.
 * Originally created for Greenlock package promotional messages.
 * Demonstrates terminal output formatting and ANSI color codes.
 * 
 * Features:
 * - Random emoji pattern selection
 * - ANSI color code formatting
 * - Timed message display
 * - Multiple visual styles (fire, cherry, arrows, eyes)
 * 
 * @example
 * ```bash
 * # Run the script to see colorful terminal output
 * node colorful-terminal-message.js
 * ```
 */

// from https://github.com/ryota-murakami/greenlock-express.js/blob/master/scripts/postinstall

// BG WH \u001b[47m
// BOLD  \u001b[1m
// RED   \u001b[31m
// GREEN \u001b[32m
// RESET \u001b[0m

var grabbers = [
  [
    '',
    '================================================================================',
    '',
    ' 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥',
    '🔥                            🔥',
    '🔥  Do you rely on Greenlock? 🔥',
    '🔥                            🔥',
    ' 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥',
  ],

  [
    '',
    '================================================================================',
    '',
    ' 🍒🍒🍒🍒🍒🍒🍒🍒🍒🍒🍒🍒🍒🍒🍒🍒',
    '🍒                              🍒',
    '🍒  Do you rely on Greenlock?   🍒',
    '🍒                              🍒',
    ' 🍒🍒🍒🍒🍒🍒🍒🍒🍒🍒🍒🍒🍒🍒🍒🍒',
  ],

  [
    '',
    '================================================================================',
    '',
    ' 👇👇👇👇👇👇👇👇👇👇👇👇👇👇👇',
    '👉                             👈',
    '👉  Do you rely on Greenlock?  👈',
    '👉                             👈',
    ' 👆👆👆👆👆👆👆👆👆👆👆👆👆👆👆 ',
  ],

  [
    '',
    '================================================================================',
    '',
    ' 👀 👀 👀 👀 👀 👀 👀 👀 👀 👀 👀 ',
    '👀                              👀',
    '👀  Do you rely on Greenlock?   👀',
    '👀                              👀',
    ' 👀 👀 👀 👀 👀 👀 👀 👀 👀 👀 👀 ',
  ],
]

setTimeout(function () {
  grabbers[Math.floor(Math.random() * grabbers.length)]
    .concat([
      '',
      "Hey! Let's Encrypt will \u001b[31mSTOP WORKING\u001b[0m with Greenlock v2 at the end of October,",
      "and \u001b[31mWITHOUT YOUR HELP\u001b[0m we won't get the next release out in time.",
      '',
      'If Greenlock has saved you time and money, and taken stress out of your life,',
      'or you just love it, please reach out to return the favor today:',
      '',
      '\u001b[31mSAVE GREENLOCK:\u001b[0m',
      'https://indiegogo.com/at/greenlock',
      '',
      '================================================================================',
      '',
    ])
    .forEach(function (line) {
      console.info(line)
    })
}, 300)

setTimeout(function () {
  // give time to read
}, 1500)
