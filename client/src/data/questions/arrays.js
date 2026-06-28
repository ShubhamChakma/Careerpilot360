import { makeQuestion, defaultHidden } from './helpers';

export default [
  makeQuestion(
    'arrays',
    0,
    'Two Sum',
    'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    [
      { input: '4\n2 7 11 15\n9', expectedOutput: '0 1', explanation: 'nums[0] + nums[1] = 9' },
      { input: '3\n3 2 4\n6', expectedOutput: '1 2', explanation: 'nums[1] + nums[2] = 6' },
    ],
    defaultHidden('4\n2 7 11 15\n9', '0 1')
  ),
  makeQuestion(
    'arrays',
    1,
    'Best Time to Buy and Sell Stock',
    'Find the maximum profit from one buy and one sell transaction.',
    [
      { input: '6\n7 1 5 3 6 4', expectedOutput: '5', explanation: 'Buy at 1, sell at 6' },
      { input: '2\n7 6', expectedOutput: '0', explanation: 'No profit possible' },
    ],
    defaultHidden('6\n7 1 5 3 6 4', '5')
  ),
  makeQuestion(
    'arrays',
    2,
    'Contains Duplicate',
    'Return true if any value appears at least twice in the array.',
    [
      { input: '4\n1 2 3 1', expectedOutput: 'true', explanation: '1 appears twice' },
      { input: '3\n1 2 3', expectedOutput: 'false', explanation: 'All unique' },
    ],
    defaultHidden('4\n1 2 3 1', 'true')
  ),
  makeQuestion(
    'arrays',
    3,
    'Product of Array Except Self',
    'Return an array where each element is the product of all other elements.',
    [
      { input: '4\n1 2 3 4', expectedOutput: '24 12 8 6', explanation: 'Standard case' },
      { input: '3\n2 3 4', expectedOutput: '12 8 6', explanation: 'Three elements' },
    ],
    defaultHidden('4\n1 2 3 4', '24 12 8 6')
  ),
  makeQuestion(
    'arrays',
    4,
    'Maximum Subarray',
    'Find the contiguous subarray with the largest sum (Kadane).',
    [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', explanation: '[4,-1,2,1]' },
      { input: '1\n1', expectedOutput: '1', explanation: 'Single element' },
    ],
    defaultHidden('9\n-2 1 -3 4 -1 2 1 -5 4', '6')
  ),
  makeQuestion(
    'arrays',
    5,
    'Merge Intervals',
    'Merge all overlapping intervals.',
    [
      { input: '4\n1 3\n2 6\n8 10\n15 18', expectedOutput: '1 3\n2 6\n8 10\n15 18', explanation: 'Overlap 1-3 and 2-6' },
      { input: '2\n1 4\n4 5', expectedOutput: '1 5', explanation: 'Touching intervals merge' },
    ],
    defaultHidden('4\n1 3\n2 6\n8 10\n15 18', '1 3\n2 6\n8 10\n15 18')
  ),
  makeQuestion(
    'arrays',
    6,
    'Rotate Array',
    'Rotate the array to the right by k steps.',
    [
      { input: '7 3\n1 2 3 4 5 6 7', expectedOutput: '5 6 7 1 2 3 4', explanation: 'k=3 rotation' },
      { input: '4 2\n-1 -100 3 99', expectedOutput: '3 99 -1 -100', explanation: 'k=2' },
    ],
    defaultHidden('7 3\n1 2 3 4 5 6 7', '5 6 7 1 2 3 4')
  ),
  makeQuestion(
    'arrays',
    7,
    'Find Minimum in Rotated Sorted Array',
    'Find the minimum element in a rotated sorted array.',
    [
      { input: '5\n3 4 5 1 2', expectedOutput: '1', explanation: 'Rotated at index 3' },
      { input: '3\n1 2 3', expectedOutput: '1', explanation: 'Not rotated' },
    ],
    defaultHidden('5\n3 4 5 1 2', '1')
  ),
  makeQuestion(
    'arrays',
    8,
    'Search in Rotated Sorted Array',
    'Search target in rotated sorted array. Return index or -1.',
    [
      { input: '7 0\n4 5 6 7 0 1 2', expectedOutput: '4', explanation: 'target=0 at index 4' },
      { input: '7 3\n4 5 6 7 0 1 2', expectedOutput: '-1', explanation: 'target not found' },
    ],
    defaultHidden('7 0\n4 5 6 7 0 1 2', '4')
  ),
  makeQuestion(
    'arrays',
    9,
    '3Sum',
    'Find all unique triplets that sum to zero.',
    [
      { input: '6\n-1 0 1 2 -1 -4', expectedOutput: '-1 -1 2\n-1 0 1', explanation: 'Two triplets' },
      { input: '3\n0 0 0', expectedOutput: '0 0 0', explanation: 'All zeros' },
    ],
    defaultHidden('6\n-1 0 1 2 -1 -4', '-1 -1 2\n-1 0 1')
  ),
];
