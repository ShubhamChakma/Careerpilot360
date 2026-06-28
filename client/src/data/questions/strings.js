import { makeQuestion, defaultHidden } from './helpers';

export default [
  makeQuestion(
    'strings',
    0,
    'Valid Anagram',
    'Given two strings s and t, return true if t is an anagram of s.',
    [
      { input: 'anagram\nnagaram', expectedOutput: 'true', explanation: 'Same letters rearranged' },
      { input: 'rat\ncar', expectedOutput: 'false', explanation: 'Different letter counts' },
    ],
    defaultHidden('anagram\nnagaram', 'true')
  ),
  makeQuestion(
    'strings',
    1,
    'Longest Substring Without Repeating Characters',
    'Return the length of the longest substring without repeating characters.',
    [
      { input: 'abcabcbb', expectedOutput: '3', explanation: 'abc has length 3' },
      { input: 'bbbbb', expectedOutput: '1', explanation: 'All same character' },
    ],
    defaultHidden('abcabcbb', '3')
  ),
  makeQuestion(
    'strings',
    2,
    'Longest Palindromic Substring',
    'Return the longest palindromic substring in s.',
    [
      { input: 'babad', expectedOutput: 'bab', explanation: 'bab or aba' },
      { input: 'cbbd', expectedOutput: 'bb', explanation: 'bb is longest' },
    ],
    defaultHidden('babad', 'bab')
  ),
  makeQuestion(
    'strings',
    3,
    'Valid Palindrome',
    'Return true if s is a palindrome after converting to lowercase and removing non-alphanumeric characters.',
    [
      { input: 'A man, a plan, a canal: Panama', expectedOutput: 'true', explanation: 'Reads same forwards and backwards' },
      { input: 'race a car', expectedOutput: 'false', explanation: 'Not a palindrome' },
    ],
    defaultHidden('A man, a plan, a canal: Panama', 'true')
  ),
  makeQuestion(
    'strings',
    4,
    'Group Anagrams',
    'Group strings that are anagrams of each other.',
    [
      { input: '6\neat tea tan ate nat bat', expectedOutput: 'bat\neat tea ate\ntan nat', explanation: 'Three anagram groups' },
      { input: '1\na', expectedOutput: 'a', explanation: 'Single string' },
    ],
    defaultHidden('6\neat tea tan ate nat bat', 'bat\neat tea ate\ntan nat')
  ),
  makeQuestion(
    'strings',
    5,
    'Minimum Window Substring',
    'Return the minimum window substring of s that contains all characters of t.',
    [
      { input: 'ADOBECODEBANC\nABC', expectedOutput: 'BANC', explanation: 'Smallest window containing A,B,C' },
      { input: 'a\na', expectedOutput: 'a', explanation: 'Single character match' },
    ],
    defaultHidden('ADOBECODEBANC\nABC', 'BANC')
  ),
  makeQuestion(
    'strings',
    6,
    'Implement strStr()',
    'Return the index of the first occurrence of needle in haystack, or -1 if not found.',
    [
      { input: 'sadbutsad\nsad', expectedOutput: '0', explanation: 'sad at index 0' },
      { input: 'leetcode\nleeto', expectedOutput: '-1', explanation: 'Not found' },
    ],
    defaultHidden('sadbutsad\nsad', '0')
  ),
  makeQuestion(
    'strings',
    7,
    'Reverse Words in a String',
    'Reverse the order of words in a string and return a single spaced result.',
    [
      { input: 'the sky is blue', expectedOutput: 'blue is sky the', explanation: 'Words reversed' },
      { input: '  hello world  ', expectedOutput: 'world hello', explanation: 'Extra spaces trimmed' },
    ],
    defaultHidden('the sky is blue', 'blue is sky the')
  ),
  makeQuestion(
    'strings',
    8,
    'Longest Repeating Character Replacement',
    'Return the length of the longest substring containing the same letter after at most k replacements.',
    [
      { input: 'ABAB 2', expectedOutput: '4', explanation: 'Replace two As or Bs' },
      { input: 'AABABBA 1', expectedOutput: '4', explanation: 'Replace one character' },
    ],
    defaultHidden('ABAB 2', '4')
  ),
  makeQuestion(
    'strings',
    9,
    'Palindromic Substrings',
    'Return the number of palindromic substrings in the given string.',
    [
      { input: 'abc', expectedOutput: '3', explanation: 'a, b, c each count' },
      { input: 'aaa', expectedOutput: '6', explanation: 'Six palindromic substrings' },
    ],
    defaultHidden('abc', '3')
  ),
];
