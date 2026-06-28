import { makeQuestion, defaultHidden } from './helpers';

export default [
  makeQuestion(
    'backtracking',
    0,
    'Subsets',
    'Return all possible subsets (the power set) of a distinct integer array.',
    [
      { input: '3\n1 2 3', expectedOutput: '[]\n[1]\n[2]\n[1,2]\n[3]\n[1,3]\n[2,3]\n[1,2,3]', explanation: 'Eight subsets' },
      { input: '1\n0', expectedOutput: '[]\n[0]', explanation: 'Two subsets' },
    ],
    defaultHidden('3\n1 2 3', '[]\n[1]\n[2]\n[1,2]\n[3]\n[1,3]\n[2,3]\n[1,2,3]')
  ),
  makeQuestion(
    'backtracking',
    1,
    'Permutations',
    'Return all possible permutations of a distinct integer array.',
    [
      { input: '3\n1 2 3', expectedOutput: '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1', explanation: 'Six permutations' },
      { input: '1\n1', expectedOutput: '1', explanation: 'Single element' },
    ],
    defaultHidden('3\n1 2 3', '1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1')
  ),
  makeQuestion(
    'backtracking',
    2,
    'Combination Sum',
    'Find all unique combinations where chosen numbers sum to target (reuse allowed).',
    [
      { input: '4 7\n2 3 6 7', expectedOutput: '2 2 2 2\n7', explanation: 'Two combinations sum to 7' },
      { input: '3 8\n2 3 5', expectedOutput: '3 5', explanation: 'Single combination' },
    ],
    defaultHidden('4 7\n2 3 6 7', '2 2 2 2\n7')
  ),
  makeQuestion(
    'backtracking',
    3,
    'N-Queens',
    'Return all distinct solutions to the n-queens puzzle.',
    [
      { input: '4', expectedOutput: '.Q..\n...Q\nQ...\n..Q.', explanation: 'One of two solutions for n=4' },
      { input: '1', expectedOutput: 'Q', explanation: 'Single queen on 1x1 board' },
    ],
    defaultHidden('4', '.Q..\n...Q\nQ...\n..Q.')
  ),
  makeQuestion(
    'backtracking',
    4,
    'Sudoku Solver',
    'Write a program to solve a 9x9 Sudoku puzzle by filling empty cells.',
    [
      { input: '53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8', expectedOutput: 'solved', explanation: 'Valid sudoku solved' },
      { input: '..9748...7.........2.3.6......5.4.8.3..........1.........23...2....5.....764....3.', expectedOutput: 'solved', explanation: 'Another puzzle' },
    ],
    defaultHidden('53..7....6..195....98....6.8...6...34..8.3..17...2...6.6....28....419..5....8', 'solved')
  ),
  makeQuestion(
    'backtracking',
    5,
    'Generate Parentheses',
    'Generate all combinations of well-formed parentheses for n pairs.',
    [
      { input: '3', expectedOutput: '((()))\n(()())\n(())()\n()(())\n()()()', explanation: 'Five combinations for n=3' },
      { input: '1', expectedOutput: '()', explanation: 'Single pair' },
    ],
    defaultHidden('3', '((()))\n(()())\n(())()\n()(())\n()()()')
  ),
  makeQuestion(
    'backtracking',
    6,
    'Word Search',
    'Given a grid and a word, return true if the word exists in the grid.',
    [
      { input: '3 4 ABCCED\nA B C E\nS F C S\nA D E E', expectedOutput: 'true', explanation: 'ABCCED found in grid' },
      { input: '3 4 SEE\nA B C E\nS F C S\nA D E E', expectedOutput: 'true', explanation: 'SEE found' },
    ],
    defaultHidden('3 4 ABCCED\nA B C E\nS F C S\nA D E E', 'true')
  ),
  makeQuestion(
    'backtracking',
    7,
    'Letter Combinations of a Phone Number',
    'Return all letter combinations that the number could represent on a phone keypad.',
    [
      { input: '23', expectedOutput: 'ad ae af bd be bf cd ce cf', explanation: 'Nine combinations' },
      { input: '', expectedOutput: '', explanation: 'Empty input' },
    ],
    defaultHidden('23', 'ad ae af bd be bf cd ce cf')
  ),
  makeQuestion(
    'backtracking',
    8,
    'Palindrome Partitioning',
    'Partition s such that every substring is a palindrome. Return all partitions.',
    [
      { input: 'aab', expectedOutput: 'a a b\naa b', explanation: 'Two valid partitions' },
      { input: 'a', expectedOutput: 'a', explanation: 'Single character' },
    ],
    defaultHidden('aab', 'a a b\naa b')
  ),
  makeQuestion(
    'backtracking',
    9,
    'Restore IP Addresses',
    'Return all valid IP addresses that can be formed by inserting dots into a digit string.',
    [
      { input: '25525511135', expectedOutput: '255.255.11.135\n255.255.111.35', explanation: 'Two valid IPs' },
      { input: '0000', expectedOutput: '0.0.0.0', explanation: 'Single valid IP' },
    ],
    defaultHidden('25525511135', '255.255.11.135\n255.255.111.35')
  ),
];
