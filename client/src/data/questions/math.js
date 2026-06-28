import { makeQuestion, defaultHidden } from './helpers';

export default [
  makeQuestion(
    'math',
    0,
    'Power of Two',
    'Given an integer n, return true if it is a power of two.',
    [
      { input: '1', expectedOutput: 'true', explanation: '2^0 = 1' },
      { input: '16', expectedOutput: 'true', explanation: '2^4 = 16' },
    ],
    defaultHidden('1', 'true')
  ),
  makeQuestion(
    'math',
    1,
    'Missing Number',
    'Given an array containing n distinct numbers in range [0, n], find the missing number.',
    [
      { input: '3\n3 0 1', expectedOutput: '2', explanation: '2 is missing from [0,3]' },
      { input: '2\n0 1', expectedOutput: '2', explanation: '2 is missing' },
    ],
    defaultHidden('3\n3 0 1', '2')
  ),
  makeQuestion(
    'math',
    2,
    'Count Primes',
    'Return the number of prime numbers less than n.',
    [
      { input: '10', expectedOutput: '4', explanation: 'Primes: 2, 3, 5, 7' },
      { input: '0', expectedOutput: '0', explanation: 'No primes below 0' },
    ],
    defaultHidden('10', '4')
  ),
  makeQuestion(
    'math',
    3,
    'Reverse Integer',
    'Reverse the digits of a 32-bit signed integer. Return 0 if overflow occurs.',
    [
      { input: '123', expectedOutput: '321', explanation: 'Digits reversed' },
      { input: '-123', expectedOutput: '-321', explanation: 'Negative reversed' },
    ],
    defaultHidden('123', '321')
  ),
  makeQuestion(
    'math',
    4,
    'Pow(x, n)',
    'Implement pow(x, n), which calculates x raised to the power n.',
    [
      { input: '2.00000 10', expectedOutput: '1024.00000', explanation: '2^10 = 1024' },
      { input: '2.10000 3', expectedOutput: '9.26100', explanation: '2.1^3' },
    ],
    defaultHidden('2.00000 10', '1024.00000')
  ),
  makeQuestion(
    'math',
    5,
    'Sqrt(x)',
    'Return the square root of x, truncated to the nearest integer.',
    [
      { input: '4', expectedOutput: '2', explanation: 'sqrt(4) = 2' },
      { input: '8', expectedOutput: '2', explanation: 'sqrt(8) truncated to 2' },
    ],
    defaultHidden('4', '2')
  ),
  makeQuestion(
    'math',
    6,
    'Happy Number',
    'Determine if a number is happy (repeatedly sum squares of digits until 1 or loop).',
    [
      { input: '19', expectedOutput: 'true', explanation: '1^2+9^2=82 -> 68 -> 100 -> 1' },
      { input: '2', expectedOutput: 'false', explanation: 'Enters a cycle' },
    ],
    defaultHidden('19', 'true')
  ),
  makeQuestion(
    'math',
    7,
    'Excel Sheet Column Number',
    'Convert an Excel column title (e.g. A, AB) to its corresponding column number.',
    [
      { input: 'A', expectedOutput: '1', explanation: 'Column A is 1' },
      { input: 'AB', expectedOutput: '28', explanation: 'A=1, B=2 -> 26+2=28' },
    ],
    defaultHidden('A', '1')
  ),
  makeQuestion(
    'math',
    8,
    'Add Digits',
    'Repeatedly add all digits of n until the result has only one digit.',
    [
      { input: '38', expectedOutput: '2', explanation: '3+8=11, 1+1=2' },
      { input: '0', expectedOutput: '0', explanation: 'Zero stays zero' },
    ],
    defaultHidden('38', '2')
  ),
  makeQuestion(
    'math',
    9,
    'Integer to Roman',
    'Convert an integer to a Roman numeral.',
    [
      { input: '3', expectedOutput: 'III', explanation: '3 = III' },
      { input: '58', expectedOutput: 'LVIII', explanation: '50+5+3' },
    ],
    defaultHidden('3', 'III')
  ),
];
