import arrays from './arrays';
import trees from './trees';
import graphs from './graphs';
import dp from './dp';
import strings from './strings';
import linkedLists from './linkedLists';
import stacks from './stacks';
import sorting from './sorting';
import math from './math';
import backtracking from './backtracking';

const ALL_QUESTIONS = [
  ...arrays,
  ...trees,
  ...graphs,
  ...dp,
  ...strings,
  ...linkedLists,
  ...stacks,
  ...sorting,
  ...math,
  ...backtracking,
];

export function getAllQuestions() {
  return ALL_QUESTIONS;
}

export function getQuestionBySlug(slug) {
  return ALL_QUESTIONS.find((q) => q.slug === slug) ?? null;
}

export function getQuestionsByTopic(topic) {
  return ALL_QUESTIONS.filter((q) => q.topic === topic);
}

export function getQuestionsByDifficulty(level) {
  return ALL_QUESTIONS.filter((q) => q.difficulty === level);
}
