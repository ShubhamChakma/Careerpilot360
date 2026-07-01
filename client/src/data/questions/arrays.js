import { makeQuestion, defaultHidden } from './helpers';

export default [
  makeQuestion(
    'arrays',
    0,
    'Two Sum',
    `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.

Input Format
First line contains N and Target space-separated
Second line contains N space-separated integers representing the array

Output Format
Print the 0-based indices of the two numbers separated by space`,
    [
      { input: "4 9\n[2, 7, 11, 15]", expectedOutput: "0 1", explanation: "Because nums[0] + nums[1] == 2 + 7 == 9, we return 0 1." },
      { input: "3 6\n[3, 2, 4]", expectedOutput: "1 2", explanation: "Because nums[1] + nums[2] == 2 + 4 == 6, we return 1 2." }
    ],
    [
      // 3 extra visible test cases
      { input: "3 6\n3 3 0", expectedOutput: "0 1" },
      { input: "4 10\n1 5 5 9", expectedOutput: "1 2" },
      { input: "5 0\n-3 4 3 90 1", expectedOutput: "0 2" },
      // 5 hidden test cases
      { input: "2 6\n3 3", expectedOutput: "0 1" },
      { input: "3 5\n1 2 3", expectedOutput: "1 2" },
      { input: "5 8\n1 2 3 4 5", expectedOutput: "2 4" },
      { input: "4 8\n2 4 6 8", expectedOutput: "0 2" },
      { input: "6 12\n1 2 3 4 5 7", expectedOutput: "4 5" }
    ]
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
    'Maximum Subarray Sum',
    `Given an array of N integers, find the maximum possible sum of a contiguous subarray.

Input Format
First line contains N
Second line contains N space-separated integers

Output Format
Print the maximum subarray sum`,
    [
      { input: "5\n[1, 2, 3, -2, 5]", expectedOutput: "9", explanation: "The subarray [1, 2, 3, -2, 5] has sum 9, which is the maximum. Kadane's algorithm picks all elements since the total is optimal." },
      { input: "4\n[-2, -3, -1, -4]", expectedOutput: "-1", explanation: "All elements are negative. The maximum subarray sum is the least-negative element, which is -1 (single element subarray)." }
    ],
    [
      // 3 extra visible test cases
      { input: "5\n1 -1 5 -2 3", expectedOutput: "6" },
      { input: "3\n-2 -3 -1", expectedOutput: "-1" },
      { input: "6\n-2 1 -3 4 -1 2 1 -5 4", expectedOutput: "6" },
      // 5 hidden test cases
      { input: "8\n-2 -3 4 -1 -2 1 5 -3", expectedOutput: "7" },
      { input: "5\n5 4 -1 7 8", expectedOutput: "23" },
      { input: "4\n-1 -2 -3 -4", expectedOutput: "-1" },
      { input: "1\n100", expectedOutput: "100" },
      { input: "7\n3 -2 2 -3 4 -1 2 -1", expectedOutput: "5" }
    ]
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
