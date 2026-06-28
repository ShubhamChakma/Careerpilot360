import { makeQuestion, defaultHidden } from './helpers';

export default [
  makeQuestion(
    'stacks',
    0,
    'Valid Parentheses',
    'Given a string containing just parentheses, return true if the input is valid.',
    [
      { input: '()', expectedOutput: 'true', explanation: 'Simple pair' },
      { input: '()[]{}', expectedOutput: 'true', explanation: 'Multiple types' },
    ],
    defaultHidden('()', 'true')
  ),
  makeQuestion(
    'stacks',
    1,
    'Min Stack',
    'Design a stack that supports push, pop, top, and retrieving the minimum element in O(1).',
    [
      { input: 'push -2\npush 0\npush -3\ngetMin\npop\ngetMin', expectedOutput: '-3\n-2', explanation: 'Min tracked correctly' },
      { input: 'push 1\npush 2\ngetMin\npop\ngetMin', expectedOutput: '1\n1', explanation: 'Min after pop' },
    ],
    defaultHidden('push -2\npush 0\npush -3\ngetMin\npop\ngetMin', '-3\n-2')
  ),
  makeQuestion(
    'stacks',
    2,
    'Evaluate Reverse Polish Notation',
    'Evaluate the value of an arithmetic expression in Reverse Polish Notation.',
    [
      { input: '4\n2 1 + 3 *', expectedOutput: '9', explanation: '(2+1)*3=9' },
      { input: '4\n4 13 5 / +', expectedOutput: '6', explanation: '4+(13/5)=6' },
    ],
    defaultHidden('4\n2 1 + 3 *', '9')
  ),
  makeQuestion(
    'stacks',
    3,
    'Daily Temperatures',
    'Return an array where each element is the number of days until a warmer temperature.',
    [
      { input: '8\n73 74 75 71 69 72 76 73', expectedOutput: '1 1 4 2 1 1 0 0', explanation: 'Wait days for warmer weather' },
      { input: '3\n30 40 50', expectedOutput: '1 1 0', explanation: 'Increasing temperatures' },
    ],
    defaultHidden('8\n73 74 75 71 69 72 76 73', '1 1 4 2 1 1 0 0')
  ),
  makeQuestion(
    'stacks',
    4,
    'Largest Rectangle in Histogram',
    'Given an array of bar heights, return the area of the largest rectangle in the histogram.',
    [
      { input: '6\n2 1 5 6 2 3', expectedOutput: '10', explanation: 'Rectangle of height 5 width 2' },
      { input: '1\n2', expectedOutput: '2', explanation: 'Single bar' },
    ],
    defaultHidden('6\n2 1 5 6 2 3', '10')
  ),
  makeQuestion(
    'stacks',
    5,
    'Implement Queue using Stacks',
    'Implement a FIFO queue using only stack operations.',
    [
      { input: 'push 1\npush 2\npeek\npop\nisEmpty', expectedOutput: '1\n1\ntrue', explanation: 'Queue operations' },
      { input: 'push 1\npop\nisEmpty', expectedOutput: '1\ntrue', explanation: 'Push then pop' },
    ],
    defaultHidden('push 1\npush 2\npeek\npop\nisEmpty', '1\n1\ntrue')
  ),
  makeQuestion(
    'stacks',
    6,
    'Decode String',
    'Decode an encoded string of the form k[encoded_string] where k repeats the substring.',
    [
      { input: '3[a]2[bc]', expectedOutput: 'aaabcbc', explanation: 'aaa + bcbc' },
      { input: '3[a2[c]]', expectedOutput: 'accaccacc', explanation: 'Nested encoding' },
    ],
    defaultHidden('3[a]2[bc]', 'aaabcbc')
  ),
  makeQuestion(
    'stacks',
    7,
    'Asteroid Collision',
    'Simulate asteroid collisions where positive values move right and negative move left.',
    [
      { input: '3\n5 10 -5', expectedOutput: '5 10', explanation: '10 survives, -5 destroyed' },
      { input: '2\n8 -8', expectedOutput: '', explanation: 'Both destroyed' },
    ],
    defaultHidden('3\n5 10 -5', '5 10')
  ),
  makeQuestion(
    'stacks',
    8,
    'Basic Calculator',
    'Implement a basic calculator to evaluate a string expression containing +, -, parentheses, and digits.',
    [
      { input: '1 + 1', expectedOutput: '2', explanation: 'Simple addition' },
      { input: ' 2-1 + 2 ', expectedOutput: '3', explanation: 'With spaces' },
    ],
    defaultHidden('1 + 1', '2')
  ),
  makeQuestion(
    'stacks',
    9,
    'Remove K Digits',
    'Remove k digits from a number string to get the smallest possible number.',
    [
      { input: '1432219 3', expectedOutput: '1219', explanation: 'Remove 4, 3, 2' },
      { input: '10200 1', expectedOutput: '200', explanation: 'Remove leading 1' },
    ],
    defaultHidden('1432219 3', '1219')
  ),
];
