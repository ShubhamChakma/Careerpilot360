import { makeQuestion, defaultHidden } from './helpers';

export default [
  makeQuestion(
    'trees',
    0,
    'Maximum Depth of Binary Tree',
    'Given the root of a binary tree, return its maximum depth (number of nodes along the longest path from root to leaf).',
    [
      { input: '3\n1 2 3 null null 4 5', expectedOutput: '3', explanation: 'Depth is 3' },
      { input: '1\n1 null 2', expectedOutput: '2', explanation: 'Single branch depth 2' },
    ],
    defaultHidden('3\n1 2 3 null null 4 5', '3')
  ),
  makeQuestion(
    'trees',
    1,
    'Same Tree',
    'Given the roots of two binary trees, return true if they are identical (same structure and values).',
    [
      { input: '2\n1 2 3\n1 2 3', expectedOutput: 'true', explanation: 'Identical trees' },
      { input: '2\n1 2\n1 null 2', expectedOutput: 'false', explanation: 'Different structure' },
    ],
    defaultHidden('2\n1 2 3\n1 2 3', 'true')
  ),
  makeQuestion(
    'trees',
    2,
    'Invert Binary Tree',
    'Given the root of a binary tree, invert the tree and return its root.',
    [
      { input: '3\n4 2 7 1 3 6 9', expectedOutput: '4 7 2 9 6 3 1', explanation: 'Full tree inverted' },
      { input: '1\n2 1 3', expectedOutput: '2 3 1', explanation: 'Small tree' },
    ],
    defaultHidden('3\n4 2 7 1 3 6 9', '4 7 2 9 6 3 1')
  ),
  makeQuestion(
    'trees',
    3,
    'Binary Tree Level Order Traversal',
    'Return the level order traversal of a binary tree nodes (left to right, level by level).',
    [
      { input: '3\n3 9 20 null null 15 7', expectedOutput: '3\n9 20\n15 7', explanation: 'Three levels' },
      { input: '1\n1', expectedOutput: '1', explanation: 'Single node' },
    ],
    defaultHidden('3\n3 9 20 null null 15 7', '3\n9 20\n15 7')
  ),
  makeQuestion(
    'trees',
    4,
    'Validate Binary Search Tree',
    'Determine if a binary tree is a valid BST (left subtree values < node < right subtree values).',
    [
      { input: '3\n2 1 3', expectedOutput: 'true', explanation: 'Valid BST' },
      { input: '3\n5 1 4 null null 3 6', expectedOutput: 'false', explanation: '4 in wrong position' },
    ],
    defaultHidden('3\n2 1 3', 'true')
  ),
  makeQuestion(
    'trees',
    5,
    'Lowest Common Ancestor of BST',
    'Find the lowest common ancestor of two given nodes in a binary search tree.',
    [
      { input: '6 2 8\n6 2 8 0 4 7 9 null null 3 5', expectedOutput: '6', explanation: 'LCA of 2 and 8 is 6' },
      { input: '6 2 4\n6 2 8 0 4 7 9 null null 3 5', expectedOutput: '2', explanation: 'LCA of 2 and 4 is 2' },
    ],
    defaultHidden('6 2 8\n6 2 8 0 4 7 9 null null 3 5', '6')
  ),
  makeQuestion(
    'trees',
    6,
    'Binary Tree Maximum Path Sum',
    'Find the maximum path sum where a path is any sequence of nodes from some start to any end node.',
    [
      { input: '3\n1 2 3', expectedOutput: '6', explanation: 'Path 2-1-3' },
      { input: '1\n-10 9 20 null null 15 7', expectedOutput: '42', explanation: 'Path 15-20-7' },
    ],
    defaultHidden('3\n1 2 3', '6')
  ),
  makeQuestion(
    'trees',
    7,
    'Construct Binary Tree from Preorder and Inorder',
    'Given preorder and inorder traversal arrays, construct and return the binary tree.',
    [
      { input: '3\n3 9 20 15 7\n9 3 15 20 7', expectedOutput: '3 9 20 null null 15 7', explanation: 'Standard construction' },
      { input: '1\n1\n1', expectedOutput: '1', explanation: 'Single node' },
    ],
    defaultHidden('3\n3 9 20 15 7\n9 3 15 20 7', '3 9 20 null null 15 7')
  ),
  makeQuestion(
    'trees',
    8,
    'Kth Smallest Element in BST',
    'Given the root of a BST and an integer k, return the kth smallest value (1-indexed).',
    [
      { input: '3 1\n3 1 4 null 2', expectedOutput: '1', explanation: '1st smallest is 1' },
      { input: '3 3\n3 1 4 null 2', expectedOutput: '3', explanation: '3rd smallest is 3' },
    ],
    defaultHidden('3 1\n3 1 4 null 2', '1')
  ),
  makeQuestion(
    'trees',
    9,
    'Serialize and Deserialize Binary Tree',
    'Design an algorithm to serialize a binary tree to a string and deserialize it back.',
    [
      { input: '3\n1 2 3 null null 4 5', expectedOutput: '1 2 3 null null 4 5', explanation: 'Round-trip preserves tree' },
      { input: '0\nnull', expectedOutput: 'null', explanation: 'Empty tree' },
    ],
    defaultHidden('3\n1 2 3 null null 4 5', '1 2 3 null null 4 5')
  ),
];
