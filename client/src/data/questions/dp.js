import { makeQuestion, defaultHidden } from './helpers';

export default [
  makeQuestion(
    'dp',
    0,
    'Climbing Stairs',
    'You can climb 1 or 2 steps at a time. Return the number of distinct ways to reach the top.',
    [
      { input: '2', expectedOutput: '2', explanation: '1+1 or 2' },
      { input: '3', expectedOutput: '3', explanation: '1+1+1, 1+2, or 2+1' },
    ],
    defaultHidden('2', '2')
  ),
  makeQuestion(
    'dp',
    1,
    'House Robber',
    'Return the maximum amount you can rob without robbing two adjacent houses.',
    [
      { input: '4\n1 2 3 1', expectedOutput: '4', explanation: 'Rob houses 1 and 3' },
      { input: '5\n2 7 9 3 1', expectedOutput: '12', explanation: 'Rob 7 and 9' },
    ],
    defaultHidden('4\n1 2 3 1', '4')
  ),
  makeQuestion(
    'dp',
    2,
    'Coin Change',
    'Return the fewest number of coins needed to make up the given amount, or -1 if impossible.',
    [
      { input: '3 11\n1 2 5', expectedOutput: '3', explanation: '5+5+1=11' },
      { input: '1 3\n2', expectedOutput: '-1', explanation: 'Cannot make 3 with coin 2' },
    ],
    defaultHidden('3 11\n1 2 5', '3')
  ),
  makeQuestion(
    'dp',
    3,
    'Longest Increasing Subsequence',
    'Return the length of the longest strictly increasing subsequence.',
    [
      { input: '8\n10 9 2 5 3 7 101 18', expectedOutput: '4', explanation: '2,3,7,101' },
      { input: '6\n0 1 0 3 2 3', expectedOutput: '4', explanation: '0,1,2,3' },
    ],
    defaultHidden('8\n10 9 2 5 3 7 101 18', '4')
  ),
  makeQuestion(
    'dp',
    4,
    'Longest Common Subsequence',
    'Return the length of the longest common subsequence of two strings.',
    [
      { input: 'abcde\nace', expectedOutput: '3', explanation: 'ace is common' },
      { input: 'abc\nabc', expectedOutput: '3', explanation: 'Entire string matches' },
    ],
    defaultHidden('abcde\nace', '3')
  ),
  makeQuestion(
    'dp',
    5,
    'Unique Paths',
    'A robot on an m x n grid can only move right or down. Return the number of unique paths to the bottom-right.',
    [
      { input: '3 7', expectedOutput: '28', explanation: '3x7 grid' },
      { input: '3 2', expectedOutput: '3', explanation: '3x2 grid' },
    ],
    defaultHidden('3 7', '28')
  ),
  makeQuestion(
    'dp',
    6,
    'Edit Distance',
    'Return the minimum number of operations to convert word1 to word2 (insert, delete, replace).',
    [
      { input: 'horse\nros', expectedOutput: '3', explanation: 'horse -> rorse -> rose -> ros' },
      { input: 'intention\nexecution', expectedOutput: '5', explanation: 'Five edits needed' },
    ],
    defaultHidden('horse\nros', '3')
  ),
  makeQuestion(
    'dp',
    7,
    'Partition Equal Subset Sum',
    'Return true if the array can be partitioned into two subsets with equal sum.',
    [
      { input: '4\n1 5 11 5', expectedOutput: 'true', explanation: '1+5+5=11' },
      { input: '3\n1 2 3 5', expectedOutput: 'false', explanation: 'Cannot partition equally' },
    ],
    defaultHidden('4\n1 5 11 5', 'true')
  ),
  makeQuestion(
    'dp',
    8,
    'Word Break',
    'Return true if string s can be segmented into space-separated dictionary words.',
    [
      { input: 'leetcode\n2\nleet code', expectedOutput: 'true', explanation: 'leet + code' },
      { input: 'applepenapple\n2\napple pen', expectedOutput: 'true', explanation: 'apple + pen + apple' },
    ],
    defaultHidden('leetcode\n2\nleet code', 'true')
  ),
  makeQuestion(
    'dp',
    9,
    'Decode Ways',
    'A message encoded as digits (A=1, B=2, ...) can be decoded in how many ways?',
    [
      { input: '12', expectedOutput: '2', explanation: '1,2 or 12' },
      { input: '226', expectedOutput: '3', explanation: '2,2,6 or 22,6 or 2,26' },
    ],
    defaultHidden('12', '2')
  ),
];
