import { makeQuestion, defaultHidden } from './helpers';

export default [
  makeQuestion(
    'sorting',
    0,
    'Sort Colors',
    'Sort an array of 0s, 1s, and 2s in-place (Dutch National Flag problem).',
    [
      { input: '6\n2 0 2 1 1 0', expectedOutput: '0 0 1 1 2 2', explanation: 'Three-way partition' },
      { input: '3\n2 0 1', expectedOutput: '0 1 2', explanation: 'All three colors' },
    ],
    defaultHidden('6\n2 0 2 1 1 0', '0 0 1 1 2 2')
  ),
  makeQuestion(
    'sorting',
    1,
    'Merge Sorted Array',
    'Merge nums2 into nums1 as one sorted array in-place.',
    [
      { input: '6 3\n1 2 3 0 0 0\n2 5 6', expectedOutput: '1 2 2 3 5 6', explanation: 'Merged in place' },
      { input: '1 0\n1\n', expectedOutput: '1', explanation: 'Second array empty' },
    ],
    defaultHidden('6 3\n1 2 3 0 0 0\n2 5 6', '1 2 2 3 5 6')
  ),
  makeQuestion(
    'sorting',
    2,
    'Kth Largest Element in Array',
    'Find the kth largest element in an unsorted array.',
    [
      { input: '6 2\n3 2 1 5 6 4', expectedOutput: '5', explanation: '2nd largest is 5' },
      { input: '4 4\n3 2 3 1', expectedOutput: '1', explanation: '4th largest is 1' },
    ],
    defaultHidden('6 2\n3 2 1 5 6 4', '5')
  ),
  makeQuestion(
    'sorting',
    3,
    'Find Peak Element',
    'Find a peak element in an array (greater than its neighbors) and return its index.',
    [
      { input: '4\n1 2 3 1', expectedOutput: '2', explanation: 'Peak at index 2' },
      { input: '3\n1 2 1', expectedOutput: '1', explanation: 'Peak at index 1' },
    ],
    defaultHidden('4\n1 2 3 1', '2')
  ),
  makeQuestion(
    'sorting',
    4,
    'Search a 2D Matrix',
    'Search for a target value in an m x n matrix where rows and columns are sorted.',
    [
      { input: '3 4 3\n1 3 5 7\n10 11 16 20\n23 30 34 60', expectedOutput: 'true', explanation: '3 exists in matrix' },
      { input: '3 4 5\n1 3 5 7\n10 11 16 20\n23 30 34 60', expectedOutput: 'false', explanation: '5 not in matrix' },
    ],
    defaultHidden('3 4 3\n1 3 5 7\n10 11 16 20\n23 30 34 60', 'true')
  ),
  makeQuestion(
    'sorting',
    5,
    'Intersection of Two Arrays',
    'Return the intersection of two integer arrays (each element appears once).',
    [
      { input: '4\n1 2 2 1\n2\n2 2', expectedOutput: '2', explanation: 'Common element 2' },
      { input: '3\n4 9 5\n2\n9 4', expectedOutput: '9 4', explanation: 'Two common elements' },
    ],
    defaultHidden('4\n1 2 2 1\n2\n2 2', '2')
  ),
  makeQuestion(
    'sorting',
    6,
    'Top K Frequent Elements',
    'Return the k most frequent elements in the array.',
    [
      { input: '6 2\n1 1 1 2 2 3', expectedOutput: '1 2', explanation: '1 appears 3 times, 2 appears 2 times' },
      { input: '1 1\n1', expectedOutput: '1', explanation: 'Single element' },
    ],
    defaultHidden('6 2\n1 1 1 2 2 3', '1 2')
  ),
  makeQuestion(
    'sorting',
    7,
    'Meeting Rooms II',
    'Find the minimum number of conference rooms required for all meetings.',
    [
      { input: '3\n0 30\n5 10\n15 20', expectedOutput: '2', explanation: 'Two rooms needed' },
      { input: '2\n7 10\n2 4', expectedOutput: '1', explanation: 'Non-overlapping meetings' },
    ],
    defaultHidden('3\n0 30\n5 10\n15 20', '2')
  ),
  makeQuestion(
    'sorting',
    8,
    'Sort List',
    'Sort a linked list in O(n log n) time using constant space.',
    [
      { input: '4\n4 2 1 3', expectedOutput: '1 2 3 4', explanation: 'Unsorted list sorted' },
      { input: '2\n-1 5', expectedOutput: '-1 5', explanation: 'Two nodes' },
    ],
    defaultHidden('4\n4 2 1 3', '1 2 3 4')
  ),
  makeQuestion(
    'sorting',
    9,
    'Wiggle Sort II',
    'Reorder nums such that nums[0] < nums[1] > nums[2] < nums[3] ...',
    [
      { input: '6\n1 5 1 1 6 4', expectedOutput: '1 6 1 5 1 4', explanation: 'Wiggle pattern' },
      { input: '6\n1 3 2 2 3 1', expectedOutput: '2 3 1 3 2 1', explanation: 'Another valid wiggle' },
    ],
    defaultHidden('6\n1 5 1 1 6 4', '1 6 1 5 1 4')
  ),
];
