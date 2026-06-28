import { makeQuestion, defaultHidden } from './helpers';

export default [
  makeQuestion(
    'graphs',
    0,
    'Number of Islands',
    'Given a grid of 1s (land) and 0s (water), count the number of islands.',
    [
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', expectedOutput: '3', explanation: 'Three separate islands' },
      { input: '1 1\n1', expectedOutput: '1', explanation: 'Single cell island' },
    ],
    defaultHidden('4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', '3')
  ),
  makeQuestion(
    'graphs',
    1,
    'Clone Graph',
    'Given a reference to a node in a connected undirected graph, return a deep copy of the graph.',
    [
      { input: '2\n1 2\n2 1', expectedOutput: '1 2\n2 1', explanation: 'Two-node graph cloned' },
      { input: '1\n1', expectedOutput: '1', explanation: 'Single node' },
    ],
    defaultHidden('2\n1 2\n2 1', '1 2\n2 1')
  ),
  makeQuestion(
    'graphs',
    2,
    'Course Schedule',
    'Given numCourses and prerequisites, return true if you can finish all courses.',
    [
      { input: '2 1\n1 0', expectedOutput: 'true', explanation: 'Can take course 0 then 1' },
      { input: '2 1\n1 0\n0 1', expectedOutput: 'false', explanation: 'Cycle detected' },
    ],
    defaultHidden('2 1\n1 0', 'true')
  ),
  makeQuestion(
    'graphs',
    3,
    'Pacific Atlantic Water Flow',
    'Find cells that can flow to both the Pacific and Atlantic oceans.',
    [
      { input: '5 5\n1 2 2 3 5\n3 2 3 4 4\n2 4 5 3 1\n1 1 2 4 1\n1 4 1 3 1', expectedOutput: '0 4\n1 3\n1 4\n2 2\n3 0\n3 1\n4 0', explanation: 'Seven cells reach both oceans' },
      { input: '1 1\n1', expectedOutput: '0 0', explanation: 'Single cell' },
    ],
    defaultHidden('5 5\n1 2 2 3 5\n3 2 3 4 4\n2 4 5 3 1\n1 1 2 4 1\n1 4 1 3 1', '0 4\n1 3\n1 4\n2 2\n3 0\n3 1\n4 0')
  ),
  makeQuestion(
    'graphs',
    4,
    'Network Delay Time',
    'Given a network of n nodes and travel times, return the time for all nodes to receive a signal from node k.',
    [
      { input: '4 2 2\n2 1 1\n2 3 1\n3 4 1', expectedOutput: '2', explanation: 'All nodes reached in 2 time units' },
      { input: '2 1 1\n1 2 1', expectedOutput: '1', explanation: 'Node 2 reached in 1 unit' },
    ],
    defaultHidden('4 2 2\n2 1 1\n2 3 1\n3 4 1', '2')
  ),
  makeQuestion(
    'graphs',
    5,
    'Cheapest Flights Within K Stops',
    'Find the cheapest price from src to dst with at most k stops.',
    [
      { input: '3 3 0 2 1\n0 1 100\n1 2 100\n0 2 500', expectedOutput: '200', explanation: 'Route via node 1 is cheaper' },
      { input: '3 3 0 2 0\n0 1 100\n1 2 100\n0 2 500', expectedOutput: '500', explanation: 'No stops allowed' },
    ],
    defaultHidden('3 3 0 2 1\n0 1 100\n1 2 100\n0 2 500', '200')
  ),
  makeQuestion(
    'graphs',
    6,
    'Word Ladder',
    'Given beginWord, endWord, and wordList, return the length of the shortest transformation sequence.',
    [
      { input: 'hit cog\n3\nhot dot cog', expectedOutput: '5', explanation: 'hit -> hot -> dot -> cog' },
      { input: 'hit cog\n1\nhot', expectedOutput: '0', explanation: 'No valid sequence' },
    ],
    defaultHidden('hit cog\n3\nhot dot cog', '5')
  ),
  makeQuestion(
    'graphs',
    7,
    'Rotting Oranges',
    'Return the minimum minutes until no fresh orange remains, or -1 if impossible.',
    [
      { input: '3 3\n2 1 1\n1 1 0\n0 1 1', expectedOutput: '4', explanation: 'All rot in 4 minutes' },
      { input: '2 2\n2 1\n1 1', expectedOutput: '-1', explanation: 'Fresh orange unreachable' },
    ],
    defaultHidden('3 3\n2 1 1\n1 1 0\n0 1 1', '4')
  ),
  makeQuestion(
    'graphs',
    8,
    'Graph Valid Tree',
    'Given n nodes and edges, determine if the edges form a valid tree.',
    [
      { input: '5 4\n0 1\n0 2\n0 3\n1 4', expectedOutput: 'true', explanation: 'Connected acyclic graph' },
      { input: '5 5\n0 1\n1 2\n2 3\n1 3\n1 4', expectedOutput: 'false', explanation: 'Contains a cycle' },
    ],
    defaultHidden('5 4\n0 1\n0 2\n0 3\n1 4', 'true')
  ),
  makeQuestion(
    'graphs',
    9,
    'All Paths From Source to Target',
    'Given a directed acyclic graph, return all paths from node 0 to node n-1.',
    [
      { input: '4\n1\n2 3\n3\n3 1', expectedOutput: '0 1 3\n0 2 3', explanation: 'Two paths to target' },
      { input: '2\n1\n1', expectedOutput: '0 1', explanation: 'Single path' },
    ],
    defaultHidden('4\n1\n2 3\n3\n3 1', '0 1 3\n0 2 3')
  ),
];
