import { makeQuestion, defaultHidden } from './helpers';

export default [
  makeQuestion(
    'linked-lists',
    0,
    'Reverse Linked List',
    'Given the head of a singly linked list, reverse the list and return the reversed list.',
    [
      { input: '3\n1 2 3', expectedOutput: '3 2 1', explanation: 'List reversed' },
      { input: '2\n1 2', expectedOutput: '2 1', explanation: 'Two nodes swapped' },
    ],
    defaultHidden('3\n1 2 3', '3 2 1')
  ),
  makeQuestion(
    'linked-lists',
    1,
    'Merge Two Sorted Lists',
    'Merge two sorted linked lists and return the merged list as one sorted list.',
    [
      { input: '2\n1 2\n2\n1 4', expectedOutput: '1 1 2 4', explanation: 'Merged in order' },
      { input: '0\n2\n0', expectedOutput: '2', explanation: 'One empty list' },
    ],
    defaultHidden('2\n1 2\n2\n1 4', '1 1 2 4')
  ),
  makeQuestion(
    'linked-lists',
    2,
    'Linked List Cycle',
    'Return true if the linked list has a cycle in it.',
    [
      { input: '4 1\n3 2 0 -4', expectedOutput: 'true', explanation: 'Tail connects to index 1' },
      { input: '2 1\n1 2', expectedOutput: 'true', explanation: 'Tail connects to index 0' },
    ],
    defaultHidden('4 1\n3 2 0 -4', 'true')
  ),
  makeQuestion(
    'linked-lists',
    3,
    'Remove Nth Node From End',
    'Remove the nth node from the end of the list and return its head.',
    [
      { input: '5 2\n1 2 3 4 5', expectedOutput: '1 2 3 5', explanation: 'Remove node 4' },
      { input: '1 1\n1', expectedOutput: '', explanation: 'Remove only node' },
    ],
    defaultHidden('5 2\n1 2 3 4 5', '1 2 3 5')
  ),
  makeQuestion(
    'linked-lists',
    4,
    'Reorder List',
    'Reorder the list L0 -> L1 -> ... -> Ln-1 -> Ln to L0 -> Ln -> L1 -> Ln-1 -> ...',
    [
      { input: '4\n1 2 3 4', expectedOutput: '1 4 2 3', explanation: 'Alternating from ends' },
      { input: '2\n1 2', expectedOutput: '1 2', explanation: 'Two nodes unchanged' },
    ],
    defaultHidden('4\n1 2 3 4', '1 4 2 3')
  ),
  makeQuestion(
    'linked-lists',
    5,
    'Merge k Sorted Lists',
    'Merge k sorted linked lists and return one sorted list.',
    [
      { input: '3\n2\n1 4\n1\n1 3\n2\n2 6', expectedOutput: '1 1 1 2 2 3 4 6', explanation: 'Three lists merged' },
      { input: '0', expectedOutput: '', explanation: 'No lists' },
    ],
    defaultHidden('3\n2\n1 4\n1\n1 3\n2\n2 6', '1 1 1 2 2 3 4 6')
  ),
  makeQuestion(
    'linked-lists',
    6,
    'Add Two Numbers',
    'Add two numbers represented as linked lists (digits in reverse order) and return the sum list.',
    [
      { input: '3\n2 4 3\n3\n5 6 4', expectedOutput: '7 0 8', explanation: '342 + 465 = 807' },
      { input: '1\n0\n1\n0', expectedOutput: '0', explanation: '0 + 0 = 0' },
    ],
    defaultHidden('3\n2 4 3\n3\n5 6 4', '7 0 8')
  ),
  makeQuestion(
    'linked-lists',
    7,
    'Copy List with Random Pointer',
    'Deep copy a linked list where each node has an additional random pointer.',
    [
      { input: '3\n7 13 11\n-1 0 4\n13 -1 7', expectedOutput: '7 13 11', explanation: 'Structure preserved' },
      { input: '1\n3\n-1', expectedOutput: '3', explanation: 'Single node copy' },
    ],
    defaultHidden('3\n7 13 11\n-1 0 4\n13 -1 7', '7 13 11')
  ),
  makeQuestion(
    'linked-lists',
    8,
    'Find the Duplicate Number',
    'Given an array of n+1 integers where each is between 1 and n, find the duplicate.',
    [
      { input: '5\n1 3 4 2 2', expectedOutput: '2', explanation: '2 appears twice' },
      { input: '5\n3 1 3 4 2', expectedOutput: '3', explanation: '3 is duplicate' },
    ],
    defaultHidden('5\n1 3 4 2 2', '2')
  ),
  makeQuestion(
    'linked-lists',
    9,
    'Reverse Nodes in k-Group',
    'Reverse the nodes of the list k at a time and return the modified list.',
    [
      { input: '6 2\n1 2 3 4 5 6', expectedOutput: '2 1 4 3 6 5', explanation: 'Reverse every 2 nodes' },
      { input: '5 3\n1 2 3 4 5', expectedOutput: '3 2 1 4 5', explanation: 'Last group has 2 nodes' },
    ],
    defaultHidden('6 2\n1 2 3 4 5 6', '2 1 4 3 6 5')
  ),
];
