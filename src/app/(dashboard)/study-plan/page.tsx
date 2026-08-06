'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useConnectedUsername } from '@/hooks/use-connected-username';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { TOPICS } from '@/lib/constants';
import { Sparkles, Loader2, CheckCircle2, Calendar, ExternalLink, Trash2, TrendingUp, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';

interface ProblemRef {
  name: string;
  slug: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
}

interface StudyDay {
  day: number;
  title: string;
  topic: string;
  focus: string;
  problems: (string | ProblemRef)[];
}

const TOPIC_CATALOG: Record<
  string,
  {
    easy: ProblemRef[];
    medium: ProblemRef[];
    hard: ProblemRef[];
  }
> = {
  'Dynamic Programming': {
    easy: [
      { name: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'Easy' },
      { name: 'Min Cost Climbing Stairs', slug: 'min-cost-climbing-stairs', difficulty: 'Easy' },
      { name: 'Fibonacci Number', slug: 'fibonacci-number', difficulty: 'Easy' },
      { name: 'N-th Tribonacci Number', slug: 'n-th-tribonacci-number', difficulty: 'Easy' },
      { name: 'Pascal\'s Triangle', slug: 'pascals-triangle', difficulty: 'Easy' },
      { name: 'Pascal\'s Triangle II', slug: 'pascals-triangle-ii', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'House Robber', slug: 'house-robber', difficulty: 'Medium' },
      { name: 'House Robber II', slug: 'house-robber-ii', difficulty: 'Medium' },
      { name: 'Coin Change', slug: 'coin-change', difficulty: 'Medium' },
      { name: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'Medium' },
      { name: 'Word Break', slug: 'word-break', difficulty: 'Medium' },
      { name: 'Unique Paths', slug: 'unique-paths', difficulty: 'Medium' },
      { name: 'Unique Paths II', slug: 'unique-paths-ii', difficulty: 'Medium' },
      { name: 'Partition Equal Subset Sum', slug: 'partition-equal-subset-sum', difficulty: 'Medium' },
      { name: 'Longest Common Subsequence', slug: 'longest-common-subsequence', difficulty: 'Medium' },
      { name: 'Coin Change II', slug: 'coin-change-2', difficulty: 'Medium' },
      { name: 'Target Sum', slug: 'target-sum', difficulty: 'Medium' },
      { name: 'Minimum Path Sum', slug: 'minimum-path-sum', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Edit Distance', slug: 'edit-distance', difficulty: 'Hard' },
      { name: 'Burst Balloons', slug: 'burst-balloons', difficulty: 'Hard' },
      { name: 'Regular Expression Matching', slug: 'regular-expression-matching', difficulty: 'Hard' },
      { name: 'Dungeon Game', slug: 'dungeon-game', difficulty: 'Hard' },
      { name: 'Distinct Subsequences', slug: 'distinct-subsequences', difficulty: 'Hard' },
      { name: 'Interleaving String', slug: 'interleaving-string', difficulty: 'Hard' },
      { name: 'Palindrome Partitioning II', slug: 'palindrome-partitioning-ii', difficulty: 'Hard' },
      { name: 'Wildcard Matching', slug: 'wildcard-matching', difficulty: 'Hard' },
      { name: 'Maximum Profit in Job Scheduling', slug: 'maximum-profit-in-job-scheduling', difficulty: 'Hard' },
    ],
  },
  'Binary Search': {
    easy: [
      { name: 'Binary Search', slug: 'binary-search', difficulty: 'Easy' },
      { name: 'Search Insert Position', slug: 'search-insert-position', difficulty: 'Easy' },
      { name: 'First Bad Version', slug: 'first-bad-version', difficulty: 'Easy' },
      { name: 'Sqrt(x)', slug: 'sqrtx', difficulty: 'Easy' },
      { name: 'Guess Number Higher or Lower', slug: 'guess-number-higher-or-lower', difficulty: 'Easy' },
      { name: 'Count Negative Numbers in a Sorted Matrix', slug: 'count-negative-numbers-in-a-sorted-matrix', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Search in Rotated Sorted Array', slug: 'search-in-rotated-sorted-array', difficulty: 'Medium' },
      { name: 'Search in Rotated Sorted Array II', slug: 'search-in-rotated-sorted-array-ii', difficulty: 'Medium' },
      { name: 'Find Minimum in Rotated Sorted Array', slug: 'find-minimum-in-rotated-sorted-array', difficulty: 'Medium' },
      { name: 'Koko Eating Bananas', slug: 'koko-eating-bananas', difficulty: 'Medium' },
      { name: 'Find Peak Element', slug: 'find-peak-element', difficulty: 'Medium' },
      { name: 'Capacity To Ship Packages Within D Days', slug: 'capacity-to-ship-packages-within-d-days', difficulty: 'Medium' },
      { name: 'Time Based Key-Value Store', slug: 'time-based-key-value-store', difficulty: 'Medium' },
      { name: 'Search a 2D Matrix', slug: 'search-a-2d-matrix', difficulty: 'Medium' },
      { name: 'Find Right Interval', slug: 'find-right-interval', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Median of Two Sorted Arrays', slug: 'median-of-two-sorted-arrays', difficulty: 'Hard' },
      { name: 'Split Array Largest Sum', slug: 'split-array-largest-sum', difficulty: 'Hard' },
      { name: 'Find Minimum in Rotated Sorted Array II', slug: 'find-minimum-in-rotated-sorted-array-ii', difficulty: 'Hard' },
      { name: 'Russian Doll Envelopes', slug: 'russian-doll-envelopes', difficulty: 'Hard' },
      { name: 'Find K-th Smallest Pair Distance', slug: 'find-k-th-smallest-pair-distance', difficulty: 'Hard' },
      { name: 'Kth Smallest Element in a Sorted Matrix', slug: 'kth-smallest-element-in-a-sorted-matrix', difficulty: 'Hard' },
      { name: 'Minimum Speed to Arrive on Time', slug: 'minimum-speed-to-arrive-on-time', difficulty: 'Hard' },
    ],
  },
  'Array': {
    easy: [
      { name: 'Two Sum', slug: 'two-sum', difficulty: 'Easy' },
      { name: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock', difficulty: 'Easy' },
      { name: 'Contains Duplicate', slug: 'contains-duplicate', difficulty: 'Easy' },
      { name: 'Majority Element', slug: 'majority-element', difficulty: 'Easy' },
      { name: 'Move Zeroes', slug: 'move-zeroes', difficulty: 'Easy' },
      { name: 'Maximum Subarray', slug: 'maximum-subarray', difficulty: 'Easy' },
      { name: 'Plus One', slug: 'plus-one', difficulty: 'Easy' },
    ],
    medium: [
      { name: '3Sum', slug: '3sum', difficulty: 'Medium' },
      { name: 'Product of Array Except Self', slug: 'product-of-array-except-self', difficulty: 'Medium' },
      { name: 'Subarray Sum Equals K', slug: 'subarray-sum-equals-k', difficulty: 'Medium' },
      { name: 'Rotate Array', slug: 'rotate-array', difficulty: 'Medium' },
      { name: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'Medium' },
      { name: 'Maximum Product Subarray', slug: 'maximum-product-subarray', difficulty: 'Medium' },
      { name: 'Find All Duplicates in an Array', slug: 'find-all-duplicates-in-an-array', difficulty: 'Medium' },
      { name: 'Set Matrix Zeroes', slug: 'set-matrix-zeroes', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'First Missing Positive', slug: 'first-missing-positive', difficulty: 'Hard' },
      { name: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'Hard' },
      { name: 'Sliding Window Maximum', slug: 'sliding-window-maximum', difficulty: 'Hard' },
      { name: 'Largest Rectangle in Histogram', slug: 'largest-rectangle-in-histogram', difficulty: 'Hard' },
      { name: 'Maximum Sum of 3 Non-Overlapping Subarrays', slug: 'maximum-sum-of-3-non-overlapping-subarrays', difficulty: 'Hard' },
      { name: 'Jump Game II', slug: 'jump-game-ii', difficulty: 'Hard' },
      { name: 'Count of Smaller Numbers After Self', slug: 'count-of-smaller-numbers-after-self', difficulty: 'Hard' },
    ],
  },
  'String': {
    easy: [
      { name: 'Valid Anagram', slug: 'valid-anagram', difficulty: 'Easy' },
      { name: 'Valid Palindrome', slug: 'valid-palindrome', difficulty: 'Easy' },
      { name: 'Reverse String', slug: 'reverse-string', difficulty: 'Easy' },
      { name: 'Length of Last Word', slug: 'length-of-last-word', difficulty: 'Easy' },
      { name: 'Longest Common Prefix', slug: 'longest-common-prefix', difficulty: 'Easy' },
      { name: 'First Unique Character in a String', slug: 'first-unique-character-in-a-string', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Group Anagrams', slug: 'group-anagrams', difficulty: 'Medium' },
      { name: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters', difficulty: 'Medium' },
      { name: 'Longest Palindromic Substring', slug: 'longest-palindromic-substring', difficulty: 'Medium' },
      { name: 'Multiply Strings', slug: 'multiply-strings', difficulty: 'Medium' },
      { name: 'Decode String', slug: 'decode-string', difficulty: 'Medium' },
      { name: 'Palindromic Substrings', slug: 'palindromic-substrings', difficulty: 'Medium' },
      { name: 'Zigzag Conversion', slug: 'zigzag-conversion', difficulty: 'Medium' },
      { name: 'String to Integer (atoi)', slug: 'string-to-integer-atoi', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Minimum Window Substring', slug: 'minimum-window-substring', difficulty: 'Hard' },
      { name: 'Text Justification', slug: 'text-justification', difficulty: 'Hard' },
      { name: 'Distinct Subsequences', slug: 'distinct-subsequences', difficulty: 'Hard' },
      { name: 'Wildcard Matching', slug: 'wildcard-matching', difficulty: 'Hard' },
      { name: 'Regular Expression Matching', slug: 'regular-expression-matching', difficulty: 'Hard' },
      { name: 'Shortest Palindrome', slug: 'shortest-palindrome', difficulty: 'Hard' },
      { name: 'Palindrome Pairs', slug: 'palindrome-pairs', difficulty: 'Hard' },
    ],
  },
  'Hash Table': {
    easy: [
      { name: 'Two Sum', slug: 'two-sum', difficulty: 'Easy' },
      { name: 'Isomorphic Strings', slug: 'isomorphic-strings', difficulty: 'Easy' },
      { name: 'Word Pattern', slug: 'word-pattern', difficulty: 'Easy' },
      { name: 'Happy Number', slug: 'happy-number', difficulty: 'Easy' },
      { name: 'Contains Duplicate II', slug: 'contains-duplicate-ii', difficulty: 'Easy' },
      { name: 'Find Common Characters', slug: 'find-common-characters', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Group Anagrams', slug: 'group-anagrams', difficulty: 'Medium' },
      { name: 'Subarray Sum Equals K', slug: 'subarray-sum-equals-k', difficulty: 'Medium' },
      { name: 'Longest Consecutive Sequence', slug: 'longest-consecutive-sequence', difficulty: 'Medium' },
      { name: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', difficulty: 'Medium' },
      { name: '4Sum II', slug: '4sum-ii', difficulty: 'Medium' },
      { name: 'Brick Wall', slug: 'brick-wall', difficulty: 'Medium' },
      { name: 'Find Duplicate File in System', slug: 'find-duplicate-file-in-system', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'All O`one Data Structure', slug: 'all-oone-data-structure', difficulty: 'Hard' },
      { name: 'Insert Delete GetRandom O(1) - Duplicates allowed', slug: 'insert-delete-getrandom-o1-duplicates-allowed', difficulty: 'Hard' },
      { name: 'Minimum Window Substring', slug: 'minimum-window-substring', difficulty: 'Hard' },
      { name: 'Longest Substring with At Most K Distinct Characters', slug: 'longest-substring-with-at-most-k-distinct-characters', difficulty: 'Hard' },
      { name: 'Substring with Concatenation of All Words', slug: 'substring-with-concatenation-of-all-words', difficulty: 'Hard' },
      { name: 'LFU Cache', slug: 'lfu-cache', difficulty: 'Hard' },
    ],
  },
  'Math': {
    easy: [
      { name: 'Palindrome Number', slug: 'palindrome-number', difficulty: 'Easy' },
      { name: 'Roman to Integer', slug: 'roman-to-integer', difficulty: 'Easy' },
      { name: 'Power of Two', slug: 'power-of-two', difficulty: 'Easy' },
      { name: 'Power of Three', slug: 'power-of-three', difficulty: 'Easy' },
      { name: 'Excel Sheet Column Number', slug: 'excel-sheet-column-number', difficulty: 'Easy' },
      { name: 'Count Primes', slug: 'count-primes', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Reverse Integer', slug: 'reverse-integer', difficulty: 'Medium' },
      { name: 'Pow(x, n)', slug: 'powx-n', difficulty: 'Medium' },
      { name: 'Divide Two Integers', slug: 'divide-two-integers', difficulty: 'Medium' },
      { name: 'Ugly Number II', slug: 'ugly-number-ii', difficulty: 'Medium' },
      { name: 'Fraction to Recurring Decimal', slug: 'fraction-to-recurring-decimal', difficulty: 'Medium' },
      { name: 'Integer to Roman', slug: 'integer-to-roman', difficulty: 'Medium' },
      { name: 'Largest Number', slug: 'largest-number', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Max Points on a Line', slug: 'max-points-on-a-line', difficulty: 'Hard' },
      { name: 'Basic Calculator', slug: 'basic-calculator', difficulty: 'Hard' },
      { name: 'Basic Calculator II', slug: 'basic-calculator-ii', difficulty: 'Hard' },
      { name: 'Super Ugly Number', slug: 'super-ugly-number', difficulty: 'Hard' },
      { name: 'Largest Rectangle in Histogram', slug: 'largest-rectangle-in-histogram', difficulty: 'Hard' },
      { name: 'Nth Digit', slug: 'nth-digit', difficulty: 'Hard' },
    ],
  },
  'Sorting': {
    easy: [
      { name: 'Majority Element', slug: 'majority-element', difficulty: 'Easy' },
      { name: 'Intersection of Two Arrays', slug: 'intersection-of-two-arrays', difficulty: 'Easy' },
      { name: 'Squares of a Sorted Array', slug: 'squares-of-a-sorted-array', difficulty: 'Easy' },
      { name: 'Sort Array by Parity', slug: 'sort-array-by-parity', difficulty: 'Easy' },
      { name: 'Sort Array by Parity II', slug: 'sort-array-by-parity-ii', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Merge Intervals', slug: 'merge-intervals', difficulty: 'Medium' },
      { name: 'Sort Colors', slug: 'sort-colors', difficulty: 'Medium' },
      { name: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array', difficulty: 'Medium' },
      { name: 'Sort List', slug: 'sort-list', difficulty: 'Medium' },
      { name: 'Wiggle Sort II', slug: 'wiggle-sort-ii', difficulty: 'Medium' },
      { name: 'Largest Number', slug: 'largest-number', difficulty: 'Medium' },
      { name: 'Insert Interval', slug: 'insert-interval', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Maximum Gap', slug: 'maximum-gap', difficulty: 'Hard' },
      { name: 'Count of Smaller Numbers After Self', slug: 'count-of-smaller-numbers-after-self', difficulty: 'Hard' },
      { name: 'Reverse Pairs', slug: 'reverse-pairs', difficulty: 'Hard' },
      { name: 'Count of Range Sum', slug: 'count-of-range-sum', difficulty: 'Hard' },
      { name: 'First Missing Positive', slug: 'first-missing-positive', difficulty: 'Hard' },
      { name: 'Median of Two Sorted Arrays', slug: 'median-of-two-sorted-arrays', difficulty: 'Hard' },
    ],
  },
  'Greedy': {
    easy: [
      { name: 'Assign Cookies', slug: 'assign-cookies', difficulty: 'Easy' },
      { name: 'Lemonade Change', slug: 'lemonade-change', difficulty: 'Easy' },
      { name: 'Best Time to Buy and Sell Stock', slug: 'best-time-to-buy-and-sell-stock', difficulty: 'Easy' },
      { name: 'Maximum Subarray', slug: 'maximum-subarray', difficulty: 'Easy' },
      { name: 'Is Subsequence', slug: 'is-subsequence', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Jump Game', slug: 'jump-game', difficulty: 'Medium' },
      { name: 'Gas Station', slug: 'gas-station', difficulty: 'Medium' },
      { name: 'Task Scheduler', slug: 'task-scheduler', difficulty: 'Medium' },
      { name: 'Partition Labels', slug: 'partition-labels', difficulty: 'Medium' },
      { name: 'Non-overlapping Intervals', slug: 'non-overlapping-intervals', difficulty: 'Medium' },
      { name: 'Meeting Rooms II', slug: 'meeting-rooms-ii', difficulty: 'Medium' },
      { name: 'Hand of Straights', slug: 'hand-of-straights', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Candy', slug: 'candy', difficulty: 'Hard' },
      { name: 'Jump Game II', slug: 'jump-game-ii', difficulty: 'Hard' },
      { name: 'IPO', slug: 'ipo', difficulty: 'Hard' },
      { name: 'Minimum Number of Arrows to Burst Balloons', slug: 'minimum-number-of-arrows-to-burst-balloons', difficulty: 'Hard' },
      { name: 'Course Schedule III', slug: 'course-schedule-iii', difficulty: 'Hard' },
      { name: 'Maximum Performance of a Team', slug: 'maximum-performance-of-a-team', difficulty: 'Hard' },
    ],
  },
  'Depth-First Search': {
    easy: [
      { name: 'Flood Fill', slug: 'flood-fill', difficulty: 'Easy' },
      { name: 'Island Perimeter', slug: 'island-perimeter', difficulty: 'Easy' },
      { name: 'Path Sum', slug: 'path-sum', difficulty: 'Easy' },
      { name: 'Same Tree', slug: 'same-tree', difficulty: 'Easy' },
      { name: 'Diameter of Binary Tree', slug: 'diameter-of-binary-tree', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Number of Islands', slug: 'number-of-islands', difficulty: 'Medium' },
      { name: 'Max Area of Island', slug: 'max-area-of-island', difficulty: 'Medium' },
      { name: 'Clone Graph', slug: 'clone-graph', difficulty: 'Medium' },
      { name: 'Target Sum', slug: 'target-sum', difficulty: 'Medium' },
      { name: 'Pacific Atlantic Water Flow', slug: 'pacific-atlantic-water-flow', difficulty: 'Medium' },
      { name: 'Path Sum II', slug: 'path-sum-ii', difficulty: 'Medium' },
      { name: 'All Paths From Source to Target', slug: 'all-paths-from-source-to-target', difficulty: 'Medium' },
      { name: 'Course Schedule', slug: 'course-schedule', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Word Search II', slug: 'word-search-ii', difficulty: 'Hard' },
      { name: 'Remove Invalid Parentheses', slug: 'remove-invalid-parentheses', difficulty: 'Hard' },
      { name: 'Longest Increasing Path in a Matrix', slug: 'longest-increasing-path-in-a-matrix', difficulty: 'Hard' },
      { name: 'Making A Large Island', slug: 'making-a-large-island', difficulty: 'Hard' },
      { name: 'Critical Connections in a Network', slug: 'critical-connections-in-a-network', difficulty: 'Hard' },
      { name: 'N-Queens', slug: 'n-queens', difficulty: 'Hard' },
      { name: 'Sudoku Solver', slug: 'sudoku-solver', difficulty: 'Hard' },
    ],
  },
  'Database': {
    easy: [
      { name: 'Combine Two Tables', slug: 'combine-two-tables', difficulty: 'Easy' },
      { name: 'Customers Who Never Order', slug: 'customers-who-never-order', difficulty: 'Easy' },
      { name: 'Duplicate Emails', slug: 'duplicate-emails', difficulty: 'Easy' },
      { name: 'Employees Earning More Than Their Managers', slug: 'employees-earning-more-than-their-managers', difficulty: 'Easy' },
      { name: 'Rising Temperature', slug: 'rising-temperature', difficulty: 'Easy' },
      { name: 'Big Countries', slug: 'big-countries', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Second Highest Salary', slug: 'second-highest-salary', difficulty: 'Medium' },
      { name: 'Nth Highest Salary', slug: 'nth-highest-salary', difficulty: 'Medium' },
      { name: 'Consecutive Numbers', slug: 'consecutive-numbers', difficulty: 'Medium' },
      { name: 'Department Highest Salary', slug: 'department-highest-salary', difficulty: 'Medium' },
      { name: 'Rank Scores', slug: 'rank-scores', difficulty: 'Medium' },
      { name: 'Exchange Seats', slug: 'exchange-seats', difficulty: 'Medium' },
      { name: 'Delete Duplicate Emails', slug: 'delete-duplicate-emails', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Department Top Three Salaries', slug: 'department-top-three-salaries', difficulty: 'Hard' },
      { name: 'Human Traffic of Stadium', slug: 'human-traffic-of-stadium', difficulty: 'Hard' },
      { name: 'Trips and Users', slug: 'trips-and-users', difficulty: 'Hard' },
      { name: 'Median Employee Salary', slug: 'median-employee-salary', difficulty: 'Hard' },
      { name: 'Find Median Given Frequency of Numbers', slug: 'find-median-given-frequency-of-numbers', difficulty: 'Hard' },
      { name: 'Cumulative Salary of an Employee', slug: 'cumulative-salary-of-an-employee', difficulty: 'Hard' },
    ],
  },
  'Breadth-First Search': {
    easy: [
      { name: 'Symmetric Tree', slug: 'symmetric-tree', difficulty: 'Easy' },
      { name: 'Minimum Depth of Binary Tree', slug: 'minimum-depth-of-binary-tree', difficulty: 'Easy' },
      { name: 'Average of Levels in Binary Tree', slug: 'average-of-levels-in-binary-tree', difficulty: 'Easy' },
      { name: 'Same Tree', slug: 'same-tree', difficulty: 'Easy' },
      { name: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal', difficulty: 'Medium' },
      { name: 'Binary Tree Zigzag Level Order Traversal', slug: 'binary-tree-zigzag-level-order-traversal', difficulty: 'Medium' },
      { name: 'Word Ladder', slug: 'word-ladder', difficulty: 'Medium' },
      { name: 'Rotting Oranges', slug: 'rotting-oranges', difficulty: 'Medium' },
      { name: 'Open the Lock', slug: 'open-the-lock', difficulty: 'Medium' },
      { name: 'Walls and Gates', slug: 'walls-and-gates', difficulty: 'Medium' },
      { name: 'Number of Islands', slug: 'number-of-islands', difficulty: 'Medium' },
      { name: '01 Matrix', slug: '01-matrix', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Word Ladder II', slug: 'word-ladder-ii', difficulty: 'Hard' },
      { name: 'Shortest Path in a Grid with Obstacles Elimination', slug: 'shortest-path-in-a-grid-with-obstacles-elimination', difficulty: 'Hard' },
      { name: 'Jump Game IV', slug: 'jump-game-iv', difficulty: 'Hard' },
      { name: 'Minimum Jumps to Reach Home', slug: 'minimum-jumps-to-reach-home', difficulty: 'Hard' },
      { name: 'Bus Routes', slug: 'bus-routes', difficulty: 'Hard' },
      { name: 'Minimum Knight Moves', slug: 'minimum-knight-moves', difficulty: 'Hard' },
    ],
  },
  'Tree': {
    easy: [
      { name: 'Invert Binary Tree', slug: 'invert-binary-tree', difficulty: 'Easy' },
      { name: 'Path Sum', slug: 'path-sum', difficulty: 'Easy' },
      { name: 'Diameter of Binary Tree', slug: 'diameter-of-binary-tree', difficulty: 'Easy' },
      { name: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-of-binary-tree', difficulty: 'Easy' },
      { name: 'Symmetric Tree', slug: 'symmetric-tree', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree', difficulty: 'Medium' },
      { name: 'Binary Tree Zigzag Level Order Traversal', slug: 'binary-tree-zigzag-level-order-traversal', difficulty: 'Medium' },
      { name: 'Construct Binary Tree from Preorder and Inorder Traversal', slug: 'construct-binary-tree-from-preorder-and-inorder-traversal', difficulty: 'Medium' },
      { name: 'Binary Tree Right Side View', slug: 'binary-tree-right-side-view', difficulty: 'Medium' },
      { name: 'Flatten Binary Tree to Linked List', slug: 'flatten-binary-tree-to-linked-list', difficulty: 'Medium' },
      { name: 'Count Good Nodes in Binary Tree', slug: 'count-good-nodes-in-binary-tree', difficulty: 'Medium' },
      { name: 'Path Sum II', slug: 'path-sum-ii', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Binary Tree Maximum Path Sum', slug: 'binary-tree-maximum-path-sum', difficulty: 'Hard' },
      { name: 'Serialize and Deserialize Binary Tree', slug: 'serialize-and-deserialize-binary-tree', difficulty: 'Hard' },
      { name: 'Binary Tree Cameras', slug: 'binary-tree-cameras', difficulty: 'Hard' },
      { name: 'Recover Binary Search Tree', slug: 'recover-binary-search-tree', difficulty: 'Hard' },
      { name: 'Vertical Order Traversal of a Binary Tree', slug: 'vertical-order-traversal-of-a-binary-tree', difficulty: 'Hard' },
      { name: 'Sum of Distances in Tree', slug: 'sum-of-distances-in-tree', difficulty: 'Hard' },
    ],
  },
  'Matrix': {
    easy: [
      { name: 'Reshape the Matrix', slug: 'reshape-the-matrix', difficulty: 'Easy' },
      { name: 'Transpose Matrix', slug: 'transpose-matrix', difficulty: 'Easy' },
      { name: 'Flood Fill', slug: 'flood-fill', difficulty: 'Easy' },
      { name: 'Island Perimeter', slug: 'island-perimeter', difficulty: 'Easy' },
      { name: 'Count Negative Numbers in a Sorted Matrix', slug: 'count-negative-numbers-in-a-sorted-matrix', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Spiral Matrix', slug: 'spiral-matrix', difficulty: 'Medium' },
      { name: 'Spiral Matrix II', slug: 'spiral-matrix-ii', difficulty: 'Medium' },
      { name: 'Rotate Image', slug: 'rotate-image', difficulty: 'Medium' },
      { name: 'Set Matrix Zeroes', slug: 'set-matrix-zeroes', difficulty: 'Medium' },
      { name: 'Search a 2D Matrix', slug: 'search-a-2d-matrix', difficulty: 'Medium' },
      { name: 'Search a 2D Matrix II', slug: 'search-a-2d-matrix-ii', difficulty: 'Medium' },
      { name: '01 Matrix', slug: '01-matrix', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Making A Large Island', slug: 'making-a-large-island', difficulty: 'Hard' },
      { name: 'Maximal Rectangle', slug: 'maximal-rectangle', difficulty: 'Hard' },
      { name: 'Maximal Square', slug: 'maximal-square', difficulty: 'Hard' },
      { name: 'Longest Increasing Path in a Matrix', slug: 'longest-increasing-path-in-a-matrix', difficulty: 'Hard' },
      { name: 'Number of Increasing Paths in a Grid', slug: 'number-of-increasing-paths-in-a-grid', difficulty: 'Hard' },
      { name: 'Dungeon Game', slug: 'dungeon-game', difficulty: 'Hard' },
    ],
  },
  'Two Pointers': {
    easy: [
      { name: 'Valid Palindrome', slug: 'valid-palindrome', difficulty: 'Easy' },
      { name: 'Move Zeroes', slug: 'move-zeroes', difficulty: 'Easy' },
      { name: 'Reverse String', slug: 'reverse-string', difficulty: 'Easy' },
      { name: 'Squares of a Sorted Array', slug: 'squares-of-a-sorted-array', difficulty: 'Easy' },
      { name: 'Merge Sorted Array', slug: 'merge-sorted-array', difficulty: 'Easy' },
    ],
    medium: [
      { name: '3Sum', slug: '3sum', difficulty: 'Medium' },
      { name: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'Medium' },
      { name: '3Sum Closest', slug: '3sum-closest', difficulty: 'Medium' },
      { name: 'Sort Colors', slug: 'sort-colors', difficulty: 'Medium' },
      { name: '4Sum', slug: '4sum', difficulty: 'Medium' },
      { name: 'Remove Duplicates from Sorted Array II', slug: 'remove-duplicates-from-sorted-array-ii', difficulty: 'Medium' },
      { name: 'Subarray Product Less Than K', slug: 'subarray-product-less-than-k', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'Hard' },
      { name: 'Minimum Window Substring', slug: 'minimum-window-substring', difficulty: 'Hard' },
      { name: 'Minimum Size Subarray Sum', slug: 'minimum-size-subarray-sum', difficulty: 'Hard' },
      { name: 'Sliding Window Maximum', slug: 'sliding-window-maximum', difficulty: 'Hard' },
      { name: 'Count Subarrays With Fixed Bounds', slug: 'count-subarrays-with-fixed-bounds', difficulty: 'Hard' },
      { name: 'Shortest Subarray with Sum at Least K', slug: 'shortest-subarray-with-sum-at-least-k', difficulty: 'Hard' },
    ],
  },
  'Binary Tree': {
    easy: [
      { name: 'Lowest Common Ancestor of a BST', slug: 'lowest-common-ancestor-of-a-binary-search-tree', difficulty: 'Easy' },
      { name: 'Subtree of Another Tree', slug: 'subtree-of-another-tree', difficulty: 'Easy' },
      { name: 'Invert Binary Tree', slug: 'invert-binary-tree', difficulty: 'Easy' },
      { name: 'Diameter of Binary Tree', slug: 'diameter-of-binary-tree', difficulty: 'Easy' },
      { name: 'Balanced Binary Tree', slug: 'balanced-binary-tree', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Lowest Common Ancestor of a Binary Tree', slug: 'lowest-common-ancestor-of-a-binary-tree', difficulty: 'Medium' },
      { name: 'Binary Tree Right Side View', slug: 'binary-tree-right-side-view', difficulty: 'Medium' },
      { name: 'Flatten Binary Tree to Linked List', slug: 'flatten-binary-tree-to-linked-list', difficulty: 'Medium' },
      { name: 'Binary Tree Level Order Traversal', slug: 'binary-tree-level-order-traversal', difficulty: 'Medium' },
      { name: 'Construct Binary Tree from Preorder and Inorder Traversal', slug: 'construct-binary-tree-from-preorder-and-inorder-traversal', difficulty: 'Medium' },
      { name: 'Populating Next Right Pointers in Each Node', slug: 'populating-next-right-pointers-in-each-node', difficulty: 'Medium' },
      { name: 'Count Good Nodes in Binary Tree', slug: 'count-good-nodes-in-binary-tree', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Binary Tree Maximum Path Sum', slug: 'binary-tree-maximum-path-sum', difficulty: 'Hard' },
      { name: 'Serialize and Deserialize Binary Tree', slug: 'serialize-and-deserialize-binary-tree', difficulty: 'Hard' },
      { name: 'Binary Tree Cameras', slug: 'binary-tree-cameras', difficulty: 'Hard' },
      { name: 'Recover Binary Search Tree', slug: 'recover-binary-search-tree', difficulty: 'Hard' },
      { name: 'Vertical Order Traversal of a Binary Tree', slug: 'vertical-order-traversal-of-a-binary-tree', difficulty: 'Hard' },
      { name: 'Max Sum of Rectangle No Larger Than K', slug: 'max-sum-of-rectangle-no-larger-than-k', difficulty: 'Hard' },
    ],
  },
  'Bit Manipulation': {
    easy: [
      { name: 'Single Number', slug: 'single-number', difficulty: 'Easy' },
      { name: 'Number of 1 Bits', slug: 'number-of-1-bits', difficulty: 'Easy' },
      { name: 'Reverse Bits', slug: 'reverse-bits', difficulty: 'Easy' },
      { name: 'Missing Number', slug: 'missing-number', difficulty: 'Easy' },
      { name: 'Counting Bits', slug: 'counting-bits', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Subsets', slug: 'subsets', difficulty: 'Medium' },
      { name: 'Single Number II', slug: 'single-number-ii', difficulty: 'Medium' },
      { name: 'Single Number III', slug: 'single-number-iii', difficulty: 'Medium' },
      { name: 'Sum of Two Integers', slug: 'sum-of-two-integers', difficulty: 'Medium' },
      { name: 'Bitwise AND of Numbers Range', slug: 'bitwise-and-of-numbers-range', difficulty: 'Medium' },
      { name: 'Total Hamming Distance', slug: 'total-hamming-distance', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Minimum One Bit Operations to Make Integers Zero', slug: 'minimum-one-bit-operations-to-make-integers-zero', difficulty: 'Hard' },
      { name: 'Maximum XOR of Two Numbers in an Array', slug: 'maximum-xor-of-two-numbers-in-an-array', difficulty: 'Hard' },
      { name: 'Maximum AND Sum of Array', slug: 'maximum-and-sum-of-array', difficulty: 'Hard' },
      { name: 'Smallest Sufficient Team', slug: 'smallest-sufficient-team', difficulty: 'Hard' },
      { name: 'Maximize Score After N Operations', slug: 'maximize-score-after-n-operations', difficulty: 'Hard' },
      { name: 'Distribute Coins in Binary Tree', slug: 'distribute-coins-in-binary-tree', difficulty: 'Hard' },
    ],
  },
  'Heap (Priority Queue)': {
    easy: [
      { name: 'Last Stone Weight', slug: 'last-stone-weight', difficulty: 'Easy' },
      { name: 'Kth Largest Element in a Stream', slug: 'kth-largest-element-in-a-stream', difficulty: 'Easy' },
      { name: 'Find Median from Data Stream (warmup)', slug: 'find-median-from-data-stream', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Top K Frequent Elements', slug: 'top-k-frequent-elements', difficulty: 'Medium' },
      { name: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array', difficulty: 'Medium' },
      { name: 'Task Scheduler', slug: 'task-scheduler', difficulty: 'Medium' },
      { name: 'K Closest Points to Origin', slug: 'k-closest-points-to-origin', difficulty: 'Medium' },
      { name: 'Reorganize String', slug: 'reorganize-string', difficulty: 'Medium' },
      { name: 'Top K Frequent Words', slug: 'top-k-frequent-words', difficulty: 'Medium' },
      { name: 'Remove Stones to Minimize the Total', slug: 'remove-stones-to-minimize-the-total', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Merge k Sorted Lists', slug: 'merge-k-sorted-lists', difficulty: 'Hard' },
      { name: 'Find Median from Data Stream', slug: 'find-median-from-data-stream', difficulty: 'Hard' },
      { name: 'Sliding Window Maximum', slug: 'sliding-window-maximum', difficulty: 'Hard' },
      { name: 'IPO', slug: 'ipo', difficulty: 'Hard' },
      { name: 'Maximum Performance of a Team', slug: 'maximum-performance-of-a-team', difficulty: 'Hard' },
      { name: 'The Skyline Problem', slug: 'the-skyline-problem', difficulty: 'Hard' },
    ],
  },
  'Stack': {
    easy: [
      { name: 'Valid Parentheses', slug: 'valid-parentheses', difficulty: 'Easy' },
      { name: 'Min Stack', slug: 'min-stack', difficulty: 'Easy' },
      { name: 'Baseball Game', slug: 'baseball-game', difficulty: 'Easy' },
      { name: 'Implement Stack using Queues', slug: 'implement-stack-using-queues', difficulty: 'Easy' },
      { name: 'Backspace String Compare', slug: 'backspace-string-compare', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Daily Temperatures', slug: 'daily-temperatures', difficulty: 'Medium' },
      { name: 'Evaluate Reverse Polish Notation', slug: 'evaluate-reverse-polish-notation', difficulty: 'Medium' },
      { name: 'Decode String', slug: 'decode-string', difficulty: 'Medium' },
      { name: 'Next Greater Element II', slug: 'next-greater-element-ii', difficulty: 'Medium' },
      { name: 'Asteroid Collision', slug: 'asteroid-collision', difficulty: 'Medium' },
      { name: 'Online Stock Span', slug: 'online-stock-span', difficulty: 'Medium' },
      { name: 'Remove K Digits', slug: 'remove-k-digits', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Largest Rectangle in Histogram', slug: 'largest-rectangle-in-histogram', difficulty: 'Hard' },
      { name: 'Maximal Rectangle', slug: 'maximal-rectangle', difficulty: 'Hard' },
      { name: 'Basic Calculator', slug: 'basic-calculator', difficulty: 'Hard' },
      { name: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'Hard' },
      { name: 'Remove Invalid Parentheses', slug: 'remove-invalid-parentheses', difficulty: 'Hard' },
      { name: 'Maximum Frequency Stack', slug: 'maximum-frequency-stack', difficulty: 'Hard' },
    ],
  },
  'Prefix Sum': {
    easy: [
      { name: 'Range Sum Query - Immutable', slug: 'range-sum-query-immutable', difficulty: 'Easy' },
      { name: 'Find Pivot Index', slug: 'find-pivot-index', difficulty: 'Easy' },
      { name: 'Running Sum of 1d Array', slug: 'running-sum-of-1d-array', difficulty: 'Easy' },
      { name: 'Left and Right Sum Differences', slug: 'left-and-right-sum-differences', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Subarray Sum Equals K', slug: 'subarray-sum-equals-k', difficulty: 'Medium' },
      { name: 'Continuous Subarray Sum', slug: 'continuous-subarray-sum', difficulty: 'Medium' },
      { name: 'Product of Array Except Self', slug: 'product-of-array-except-self', difficulty: 'Medium' },
      { name: 'Range Sum Query 2D - Immutable', slug: 'range-sum-query-2d-immutable', difficulty: 'Medium' },
      { name: 'Find the Highest Altitude', slug: 'find-the-highest-altitude', difficulty: 'Medium' },
      { name: 'Maximum Size Subarray Sum Equals k', slug: 'maximum-size-subarray-sum-equals-k', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Count of Range Sum', slug: 'count-of-range-sum', difficulty: 'Hard' },
      { name: 'Max Sum of Rectangle No Larger Than K', slug: 'max-sum-of-rectangle-no-larger-than-k', difficulty: 'Hard' },
      { name: 'Number of Subarrays with Bounded Maximum', slug: 'number-of-subarrays-with-bounded-maximum', difficulty: 'Hard' },
      { name: 'Shortest Subarray with Sum at Least K', slug: 'shortest-subarray-with-sum-at-least-k', difficulty: 'Hard' },
      { name: 'Maximum Sum of 3 Non-Overlapping Subarrays', slug: 'maximum-sum-of-3-non-overlapping-subarrays', difficulty: 'Hard' },
    ],
  },
  'Graph': {
    easy: [
      { name: 'Find Center of Star Graph', slug: 'find-center-of-star-graph', difficulty: 'Easy' },
      { name: 'Find the Town Judge', slug: 'find-the-town-judge', difficulty: 'Easy' },
      { name: 'Find if Path Exists in Graph', slug: 'find-if-path-exists-in-graph', difficulty: 'Easy' },
      { name: 'Number of Provinces (intro)', slug: 'number-of-provinces', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Course Schedule', slug: 'course-schedule', difficulty: 'Medium' },
      { name: 'Course Schedule II', slug: 'course-schedule-ii', difficulty: 'Medium' },
      { name: 'Number of Connected Components in an Undirected Graph', slug: 'number-of-connected-components-in-an-undirected-graph', difficulty: 'Medium' },
      { name: 'Clone Graph', slug: 'clone-graph', difficulty: 'Medium' },
      { name: 'Network Delay Time', slug: 'network-delay-time', difficulty: 'Medium' },
      { name: 'Evaluate Division', slug: 'evaluate-division', difficulty: 'Medium' },
      { name: 'All Paths From Source to Target', slug: 'all-paths-from-source-to-target', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Alien Dictionary', slug: 'alien-dictionary', difficulty: 'Hard' },
      { name: 'Critical Connections in a Network', slug: 'critical-connections-in-a-network', difficulty: 'Hard' },
      { name: 'Minimize Malware Spread', slug: 'minimize-malware-spread', difficulty: 'Hard' },
      { name: 'Swim in Rising Water', slug: 'swim-in-rising-water', difficulty: 'Hard' },
      { name: 'Shortest Path Visiting All Nodes', slug: 'shortest-path-visiting-all-nodes', difficulty: 'Hard' },
      { name: 'Find Shortest Path in a Weighted Graph', slug: 'path-with-minimum-effort', difficulty: 'Hard' },
    ],
  },
  'Linked List': {
    easy: [
      { name: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'Easy' },
      { name: 'Linked List Cycle', slug: 'linked-list-cycle', difficulty: 'Easy' },
      { name: 'Merge Two Sorted Lists', slug: 'merge-two-sorted-lists', difficulty: 'Easy' },
      { name: 'Remove Duplicates from Sorted List', slug: 'remove-duplicates-from-sorted-list', difficulty: 'Easy' },
      { name: 'Intersection of Two Linked Lists', slug: 'intersection-of-two-linked-lists', difficulty: 'Easy' },
      { name: 'Palindrome Linked List', slug: 'palindrome-linked-list', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Add Two Numbers', slug: 'add-two-numbers', difficulty: 'Medium' },
      { name: 'Remove Nth Node From End of List', slug: 'remove-nth-node-from-end-of-list', difficulty: 'Medium' },
      { name: 'Copy List with Random Pointer', slug: 'copy-list-with-random-pointer', difficulty: 'Medium' },
      { name: 'Reorder List', slug: 'reorder-list', difficulty: 'Medium' },
      { name: 'Swap Nodes in Pairs', slug: 'swap-nodes-in-pairs', difficulty: 'Medium' },
      { name: 'Sort List', slug: 'sort-list', difficulty: 'Medium' },
      { name: 'Rotate List', slug: 'rotate-list', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Merge k Sorted Lists', slug: 'merge-k-sorted-lists', difficulty: 'Hard' },
      { name: 'Reverse Nodes in k-Group', slug: 'reverse-nodes-in-k-group', difficulty: 'Hard' },
      { name: 'LRU Cache', slug: 'lru-cache', difficulty: 'Hard' },
      { name: 'LFU Cache', slug: 'lfu-cache', difficulty: 'Hard' },
      { name: 'Insert into a Cyclic Sorted List', slug: 'insert-into-a-cyclic-sorted-list', difficulty: 'Hard' },
      { name: 'Flatten a Multilevel Doubly Linked List', slug: 'flatten-a-multilevel-doubly-linked-list', difficulty: 'Hard' },
    ],
  },
  'Trie': {
    easy: [
      { name: 'Longest Common Prefix', slug: 'longest-common-prefix', difficulty: 'Easy' },
      { name: 'Implement Trie (Prefix Tree)', slug: 'implement-trie-prefix-tree', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Design Add and Search Words Data Structure', slug: 'design-add-and-search-words-data-structure', difficulty: 'Medium' },
      { name: 'Replace Words', slug: 'replace-words', difficulty: 'Medium' },
      { name: 'Map Sum Pairs', slug: 'map-sum-pairs', difficulty: 'Medium' },
      { name: 'Top K Frequent Words', slug: 'top-k-frequent-words', difficulty: 'Medium' },
      { name: 'Search Suggestions System', slug: 'search-suggestions-system', difficulty: 'Medium' },
      { name: 'Camelcase Matching', slug: 'camelcase-matching', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Word Search II', slug: 'word-search-ii', difficulty: 'Hard' },
      { name: 'Maximum XOR of Two Numbers in an Array', slug: 'maximum-xor-of-two-numbers-in-an-array', difficulty: 'Hard' },
      { name: 'Palindrome Pairs', slug: 'palindrome-pairs', difficulty: 'Hard' },
      { name: 'Concatenated Words', slug: 'concatenated-words', difficulty: 'Hard' },
      { name: 'Stream of Characters', slug: 'stream-of-characters', difficulty: 'Hard' },
      { name: 'Word Squares', slug: 'word-squares', difficulty: 'Hard' },
    ],
  },
  'Queue': {
    easy: [
      { name: 'Number of Recent Calls', slug: 'number-of-recent-calls', difficulty: 'Easy' },
      { name: 'Implement Queue using Stacks', slug: 'implement-queue-using-stacks', difficulty: 'Easy' },
      { name: 'Time Needed to Buy Tickets', slug: 'time-needed-to-buy-tickets', difficulty: 'Easy' },
      { name: 'First Unique Character in a String', slug: 'first-unique-character-in-a-string', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Design Circular Queue', slug: 'design-circular-queue', difficulty: 'Medium' },
      { name: 'Task Scheduler', slug: 'task-scheduler', difficulty: 'Medium' },
      { name: 'Dota2 Senate', slug: 'dota2-senate', difficulty: 'Medium' },
      { name: 'Design Hit Counter', slug: 'design-hit-counter', difficulty: 'Medium' },
      { name: 'Reveal Cards In Increasing Order', slug: 'reveal-cards-in-increasing-order', difficulty: 'Medium' },
      { name: 'Rotting Oranges', slug: 'rotting-oranges', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Sliding Window Maximum', slug: 'sliding-window-maximum', difficulty: 'Hard' },
      { name: 'Largest Rectangle in Histogram', slug: 'largest-rectangle-in-histogram', difficulty: 'Hard' },
      { name: 'Maximum Frequency Stack', slug: 'maximum-frequency-stack', difficulty: 'Hard' },
      { name: 'Jump Game VI', slug: 'jump-game-vi', difficulty: 'Hard' },
      { name: 'Constrained Subsequence Sum', slug: 'constrained-subsequence-sum', difficulty: 'Hard' },
      { name: 'Shortest Subarray with Sum at Least K', slug: 'shortest-subarray-with-sum-at-least-k', difficulty: 'Hard' },
    ],
  },
  'Backtracking': {
    easy: [
      { name: 'Letter Case Permutation', slug: 'letter-case-permutation', difficulty: 'Easy' },
      { name: 'Binary Watch', slug: 'binary-watch', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Permutations', slug: 'permutations', difficulty: 'Medium' },
      { name: 'Permutations II', slug: 'permutations-ii', difficulty: 'Medium' },
      { name: 'Subsets', slug: 'subsets', difficulty: 'Medium' },
      { name: 'Subsets II', slug: 'subsets-ii', difficulty: 'Medium' },
      { name: 'Combination Sum', slug: 'combination-sum', difficulty: 'Medium' },
      { name: 'Combination Sum II', slug: 'combination-sum-ii', difficulty: 'Medium' },
      { name: 'Word Search', slug: 'word-search', difficulty: 'Medium' },
      { name: 'Generate Parentheses', slug: 'generate-parentheses', difficulty: 'Medium' },
      { name: 'Palindrome Partitioning', slug: 'palindrome-partitioning', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'N-Queens', slug: 'n-queens', difficulty: 'Hard' },
      { name: 'N-Queens II', slug: 'n-queens-ii', difficulty: 'Hard' },
      { name: 'Sudoku Solver', slug: 'sudoku-solver', difficulty: 'Hard' },
      { name: 'Word Search II', slug: 'word-search-ii', difficulty: 'Hard' },
      { name: 'Remove Invalid Parentheses', slug: 'remove-invalid-parentheses', difficulty: 'Hard' },
      { name: 'Expression Add Operators', slug: 'expression-add-operators', difficulty: 'Hard' },
      { name: 'Zuma Game', slug: 'zuma-game', difficulty: 'Hard' },
    ],
  },
  'Sliding Window': {
    easy: [
      { name: 'Maximum Average Subarray I', slug: 'maximum-average-subarray-i', difficulty: 'Easy' },
      { name: 'Find All Anagrams in a String', slug: 'find-all-anagrams-in-a-string', difficulty: 'Easy' },
      { name: 'Contains Duplicate II', slug: 'contains-duplicate-ii', difficulty: 'Easy' },
      { name: 'Number of Sub-arrays of Size K and Average Greater than or Equal to Threshold', slug: 'number-of-sub-arrays-of-size-k-and-average-greater-than-or-equal-to-threshold', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating-characters', difficulty: 'Medium' },
      { name: 'Permutation in String', slug: 'permutation-in-string', difficulty: 'Medium' },
      { name: 'Fruit Into Baskets', slug: 'fruit-into-baskets', difficulty: 'Medium' },
      { name: 'Max Consecutive Ones III', slug: 'max-consecutive-ones-iii', difficulty: 'Medium' },
      { name: 'Longest Repeating Character Replacement', slug: 'longest-repeating-character-replacement', difficulty: 'Medium' },
      { name: 'Minimum Operations to Reduce X to Zero', slug: 'minimum-operations-to-reduce-x-to-zero', difficulty: 'Medium' },
      { name: 'Maximum Number of Vowels in a Substring of Given Length', slug: 'maximum-number-of-vowels-in-a-substring-of-given-length', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Minimum Window Substring', slug: 'minimum-window-substring', difficulty: 'Hard' },
      { name: 'Sliding Window Maximum', slug: 'sliding-window-maximum', difficulty: 'Hard' },
      { name: 'Substring with Concatenation of All Words', slug: 'substring-with-concatenation-of-all-words', difficulty: 'Hard' },
      { name: 'Minimum Number of K Consecutive Bit Flips', slug: 'minimum-number-of-k-consecutive-bit-flips', difficulty: 'Hard' },
      { name: 'Count Subarrays With Fixed Bounds', slug: 'count-subarrays-with-fixed-bounds', difficulty: 'Hard' },
      { name: 'Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit', slug: 'longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit', difficulty: 'Hard' },
    ],
  },
  'Union Find': {
    easy: [
      { name: 'Find if Path Exists in Graph', slug: 'find-if-path-exists-in-graph', difficulty: 'Easy' },
      { name: 'Number of Provinces (intro)', slug: 'number-of-provinces', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Number of Provinces', slug: 'number-of-provinces', difficulty: 'Medium' },
      { name: 'Accounts Merge', slug: 'accounts-merge', difficulty: 'Medium' },
      { name: 'Redundant Connection', slug: 'redundant-connection', difficulty: 'Medium' },
      { name: 'Most Stones Removed with Same Row or Column', slug: 'most-stones-removed-with-same-row-or-column', difficulty: 'Medium' },
      { name: 'Satisfiability of Equality Equations', slug: 'satisfiability-of-equality-equations', difficulty: 'Medium' },
      { name: 'Number of Operations to Make Network Connected', slug: 'number-of-operations-to-make-network-connected', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Minimize Malware Spread', slug: 'minimize-malware-spread', difficulty: 'Hard' },
      { name: 'Swim in Rising Water', slug: 'swim-in-rising-water', difficulty: 'Hard' },
      { name: 'Smallest String With Swaps', slug: 'smallest-string-with-swaps', difficulty: 'Hard' },
      { name: 'Remove Max Number of Edges to Keep Graph Fully Traversable', slug: 'remove-max-number-of-edges-to-keep-graph-fully-traversable', difficulty: 'Hard' },
      { name: 'Making A Large Island', slug: 'making-a-large-island', difficulty: 'Hard' },
      { name: 'Redundant Connection II', slug: 'redundant-connection-ii', difficulty: 'Hard' },
    ],
  },
  'Design': {
    easy: [
      { name: 'Design HashMap', slug: 'design-hashmap', difficulty: 'Easy' },
      { name: 'Design HashSet', slug: 'design-hashset', difficulty: 'Easy' },
      { name: 'Min Stack', slug: 'min-stack', difficulty: 'Easy' },
      { name: 'Implement Queue using Stacks', slug: 'implement-queue-using-stacks', difficulty: 'Easy' },
      { name: 'Design Parking System', slug: 'design-parking-system', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'LRU Cache', slug: 'lru-cache', difficulty: 'Medium' },
      { name: 'Design Add and Search Words Data Structure', slug: 'design-add-and-search-words-data-structure', difficulty: 'Medium' },
      { name: 'Time Based Key-Value Store', slug: 'time-based-key-value-store', difficulty: 'Medium' },
      { name: 'Design Twitter', slug: 'design-twitter', difficulty: 'Medium' },
      { name: 'Design Circular Queue', slug: 'design-circular-queue', difficulty: 'Medium' },
      { name: 'Design Circular Deque', slug: 'design-circular-deque', difficulty: 'Medium' },
      { name: 'Implement Trie (Prefix Tree)', slug: 'implement-trie-prefix-tree', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'LFU Cache', slug: 'lfu-cache', difficulty: 'Hard' },
      { name: 'Design In-Memory File System', slug: 'design-in-memory-file-system', difficulty: 'Hard' },
      { name: 'Maximum Frequency Stack', slug: 'maximum-frequency-stack', difficulty: 'Hard' },
      { name: 'All O`one Data Structure', slug: 'all-oone-data-structure', difficulty: 'Hard' },
      { name: 'Design Text Editor', slug: 'design-text-editor', difficulty: 'Hard' },
      { name: 'Design Phone Directory', slug: 'design-phone-directory', difficulty: 'Hard' },
    ],
  },
  'Monotonic Stack': {
    easy: [
      { name: 'Next Greater Element I', slug: 'next-greater-element-i', difficulty: 'Easy' },
      { name: 'Min Stack', slug: 'min-stack', difficulty: 'Easy' },
      { name: 'Baseball Game', slug: 'baseball-game', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Daily Temperatures', slug: 'daily-temperatures', difficulty: 'Medium' },
      { name: 'Next Greater Element II', slug: 'next-greater-element-ii', difficulty: 'Medium' },
      { name: 'Online Stock Span', slug: 'online-stock-span', difficulty: 'Medium' },
      { name: 'Remove K Digits', slug: 'remove-k-digits', difficulty: 'Medium' },
      { name: '132 Pattern', slug: '132-pattern', difficulty: 'Medium' },
      { name: 'Monotonic Queue Max (Jump Game VI)', slug: 'jump-game-vi', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Largest Rectangle in Histogram', slug: 'largest-rectangle-in-histogram', difficulty: 'Hard' },
      { name: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'Hard' },
      { name: 'Maximal Rectangle', slug: 'maximal-rectangle', difficulty: 'Hard' },
      { name: 'Sum of Subarray Minimums (counting)', slug: 'sum-of-subarray-minimums', difficulty: 'Hard' },
      { name: 'Count Subarrays With Fixed Bounds', slug: 'count-subarrays-with-fixed-bounds', difficulty: 'Hard' },
      { name: 'Maximum Width Ramp', slug: 'maximum-width-ramp', difficulty: 'Hard' },
    ],
  },
  'Enumeration': {
    easy: [
      { name: 'Count Odd Numbers in an Interval Range', slug: 'count-odd-numbers-in-an-interval-range', difficulty: 'Easy' },
      { name: 'Number of Good Pairs', slug: 'number-of-good-pairs', difficulty: 'Easy' },
      { name: 'Defanging an IP Address', slug: 'defanging-an-ip-address', difficulty: 'Easy' },
      { name: 'How Many Numbers Are Smaller Than the Current Number', slug: 'how-many-numbers-are-smaller-than-the-current-number', difficulty: 'Easy' },
      { name: 'Count Items Matching a Rule', slug: 'count-items-matching-a-rule', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Count Subarrays With Fixed Bounds', slug: 'count-subarrays-with-fixed-bounds', difficulty: 'Medium' },
      { name: 'Frequency of the Most Frequent Element', slug: 'frequency-of-the-most-frequent-element', difficulty: 'Medium' },
      { name: 'Count Ways to Build Good Strings', slug: 'count-ways-to-build-good-strings', difficulty: 'Medium' },
      { name: 'Count Unique Characters of All Substrings of a Given String', slug: 'count-unique-characters-of-all-substrings-of-a-given-string', difficulty: 'Medium' },
      { name: 'Count Number of Nice Subarrays', slug: 'count-number-of-nice-subarrays', difficulty: 'Medium' },
      { name: 'Number of Subsequences That Satisfy the Given Sum Condition', slug: 'number-of-subsequences-that-satisfy-the-given-sum-condition', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Count of Smaller Numbers After Self', slug: 'count-of-smaller-numbers-after-self', difficulty: 'Hard' },
      { name: 'Count of Range Sum', slug: 'count-of-range-sum', difficulty: 'Hard' },
      { name: 'Reverse Pairs', slug: 'reverse-pairs', difficulty: 'Hard' },
      { name: 'Count Subarrays with Score Less Than K', slug: 'count-subarrays-with-score-less-than-k', difficulty: 'Hard' },
      { name: 'Sum of Subarray Minimums', slug: 'sum-of-subarray-minimums', difficulty: 'Hard' },
    ],
  },
  'Recursion': {
    easy: [
      { name: 'Power of Three', slug: 'power-of-three', difficulty: 'Easy' },
      { name: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'Easy' },
      { name: 'Swap Nodes in Pairs', slug: 'swap-nodes-in-pairs', difficulty: 'Easy' },
      { name: 'Fibonacci Number', slug: 'fibonacci-number', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'K-th Symbol in Grammar', slug: 'k-th-symbol-in-grammar', difficulty: 'Medium' },
      { name: 'Pow(x, n)', slug: 'powx-n', difficulty: 'Medium' },
      { name: 'Flatten Nested List Iterator', slug: 'flatten-nested-list-iterator', difficulty: 'Medium' },
      { name: 'Count Good Numbers', slug: 'count-good-numbers', difficulty: 'Medium' },
      { name: 'Generate Parentheses', slug: 'generate-parentheses', difficulty: 'Medium' },
      { name: 'Permutations', slug: 'permutations', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Special Binary String', slug: 'special-binary-string', difficulty: 'Hard' },
      { name: 'Parsing A Boolean Expression', slug: 'parsing-a-boolean-expression', difficulty: 'Hard' },
      { name: 'Expression Add Operators', slug: 'expression-add-operators', difficulty: 'Hard' },
      { name: 'Regular Expression Matching', slug: 'regular-expression-matching', difficulty: 'Hard' },
      { name: 'N-Queens', slug: 'n-queens', difficulty: 'Hard' },
      { name: 'Strangely Printed', slug: 'strange-printer', difficulty: 'Hard' },
    ],
  },
  'Divide and Conquer': {
    easy: [
      { name: 'Majority Element', slug: 'majority-element', difficulty: 'Easy' },
      { name: 'Maximum Subarray', slug: 'maximum-subarray', difficulty: 'Easy' },
      { name: 'Search Insert Position', slug: 'search-insert-position', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Sort an Array', slug: 'sort-an-array', difficulty: 'Medium' },
      { name: 'Kth Largest Element in an Array', slug: 'kth-largest-element-in-an-array', difficulty: 'Medium' },
      { name: 'Convert Sorted List to Binary Search Tree', slug: 'convert-sorted-list-to-binary-search-tree', difficulty: 'Medium' },
      { name: 'Beautiful Array', slug: 'beautiful-array', difficulty: 'Medium' },
      { name: 'Convert Sorted Array to Binary Search Tree', slug: 'convert-sorted-array-to-binary-search-tree', difficulty: 'Medium' },
      { name: 'Different Ways to Add Parentheses', slug: 'different-ways-to-add-parentheses', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Median of Two Sorted Arrays', slug: 'median-of-two-sorted-arrays', difficulty: 'Hard' },
      { name: 'Count of Smaller Numbers After Self', slug: 'count-of-smaller-numbers-after-self', difficulty: 'Hard' },
      { name: 'Burst Balloons', slug: 'burst-balloons', difficulty: 'Hard' },
      { name: 'Reverse Pairs', slug: 'reverse-pairs', difficulty: 'Hard' },
      { name: 'Count of Range Sum', slug: 'count-of-range-sum', difficulty: 'Hard' },
      { name: 'The Skyline Problem', slug: 'the-skyline-problem', difficulty: 'Hard' },
    ],
  },
  'Binary Search Tree': {
    easy: [
      { name: 'Search in a Binary Search Tree', slug: 'search-in-a-binary-search-tree', difficulty: 'Easy' },
      { name: 'Range Sum of BST', slug: 'range-sum-of-bst', difficulty: 'Easy' },
      { name: 'Minimum Absolute Difference in BST', slug: 'minimum-absolute-difference-in-bst', difficulty: 'Easy' },
      { name: 'Find Mode in Binary Search Tree', slug: 'find-mode-in-binary-search-tree', difficulty: 'Easy' },
      { name: 'Closest Binary Search Tree Value', slug: 'closest-binary-search-tree-value', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Insert into a Binary Search Tree', slug: 'insert-into-a-binary-search-tree', difficulty: 'Medium' },
      { name: 'Delete Node in a BST', slug: 'delete-node-in-a-bst', difficulty: 'Medium' },
      { name: 'Kth Smallest Element in a BST', slug: 'kth-smallest-element-in-a-bst', difficulty: 'Medium' },
      { name: 'Convert BST to Greater Tree', slug: 'convert-bst-to-greater-tree', difficulty: 'Medium' },
      { name: 'Validate Binary Search Tree', slug: 'validate-binary-search-tree', difficulty: 'Medium' },
      { name: 'Binary Search Tree Iterator', slug: 'binary-search-tree-iterator', difficulty: 'Medium' },
      { name: 'Two Sum IV - Input is a BST', slug: 'two-sum-iv-input-is-a-bst', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Recover Binary Search Tree', slug: 'recover-binary-search-tree', difficulty: 'Hard' },
      { name: 'Count of Smaller Numbers After Self', slug: 'count-of-smaller-numbers-after-self', difficulty: 'Hard' },
      { name: 'All Elements in Two Binary Search Trees', slug: 'all-elements-in-two-binary-search-trees', difficulty: 'Hard' },
      { name: 'Serialize and Deserialize BST', slug: 'serialize-and-deserialize-bst', difficulty: 'Hard' },
      { name: 'Contains Duplicate III', slug: 'contains-duplicate-iii', difficulty: 'Hard' },
      { name: 'Closest Binary Search Tree Value II', slug: 'closest-binary-search-tree-value-ii', difficulty: 'Hard' },
    ],
  },
  'Bitmask': {
    easy: [
      { name: 'Decode XORed Array', slug: 'decode-xored-array', difficulty: 'Easy' },
      { name: 'Counting Bits', slug: 'counting-bits', difficulty: 'Easy' },
      { name: 'Single Number', slug: 'single-number', difficulty: 'Easy' },
      { name: 'Missing Number', slug: 'missing-number', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Subsets', slug: 'subsets', difficulty: 'Medium' },
      { name: 'Sum of All Subset XOR Totals', slug: 'sum-of-all-subset-xor-totals', difficulty: 'Medium' },
      { name: 'Maximum Product of Word Lengths', slug: 'maximum-product-of-word-lengths', difficulty: 'Medium' },
      { name: 'Partition to K Equal Sum Subsets', slug: 'partition-to-k-equal-sum-subsets', difficulty: 'Medium' },
      { name: 'Stickers to Spell Word', slug: 'stickers-to-spell-word', difficulty: 'Medium' },
      { name: 'Beautiful Arrangement', slug: 'beautiful-arrangement', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Shortest Path Visiting All Nodes', slug: 'shortest-path-visiting-all-nodes', difficulty: 'Hard' },
      { name: 'Minimum Number of Work Sessions to Finish the Tasks', slug: 'minimum-number-of-work-sessions-to-finish-the-tasks', difficulty: 'Hard' },
      { name: 'Smallest Sufficient Team', slug: 'smallest-sufficient-team', difficulty: 'Hard' },
      { name: 'Number of Ways to Wear Different Hats to Each Other', slug: 'number-of-ways-to-wear-different-hats-to-each-other', difficulty: 'Hard' },
      { name: 'Maximize Score After N Operations', slug: 'maximize-score-after-n-operations', difficulty: 'Hard' },
      { name: 'Find the Shortest Superstring', slug: 'find-the-shortest-superstring', difficulty: 'Hard' },
    ],
  },
  'Number Theory': {
    easy: [
      { name: 'Count Primes', slug: 'count-primes', difficulty: 'Easy' },
      { name: 'Power of Three', slug: 'power-of-three', difficulty: 'Easy' },
      { name: 'Happy Number', slug: 'happy-number', difficulty: 'Easy' },
      { name: 'Power of Two', slug: 'power-of-two', difficulty: 'Easy' },
      { name: 'Excel Sheet Column Number', slug: 'excel-sheet-column-number', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Ugly Number II', slug: 'ugly-number-ii', difficulty: 'Medium' },
      { name: 'Fraction to Recurring Decimal', slug: 'fraction-to-recurring-decimal', difficulty: 'Medium' },
      { name: 'Greatest Common Divisor of Strings', slug: 'greatest-common-divisor-of-strings', difficulty: 'Medium' },
      { name: 'Bulb Switcher', slug: 'bulb-switcher', difficulty: 'Medium' },
      { name: 'Perfect Squares', slug: 'perfect-squares', difficulty: 'Medium' },
      { name: 'Nth Ugly Number', slug: 'ugly-number-ii', difficulty: 'Medium' },
      { name: 'Find the Difference', slug: 'find-the-difference', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Super Ugly Number', slug: 'super-ugly-number', difficulty: 'Hard' },
      { name: 'Minimum Number of Operations to Make Array Continuous', slug: 'minimum-number-of-operations-to-make-array-continuous', difficulty: 'Hard' },
      { name: 'Largest Component Size by Common Factor', slug: 'largest-component-size-by-common-factor', difficulty: 'Hard' },
      { name: 'Count Different Palindromic Subsequences', slug: 'count-different-palindromic-subsequences', difficulty: 'Hard' },
      { name: 'Nth Magic Number', slug: 'nth-digit', difficulty: 'Hard' },
      { name: 'Basic Calculator III', slug: 'basic-calculator-iii', difficulty: 'Hard' },
    ],
  },
  'Segment Tree': {
    easy: [
      { name: 'Range Sum Query - Immutable', slug: 'range-sum-query-immutable', difficulty: 'Easy' },
      { name: 'Find Pivot Index', slug: 'find-pivot-index', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Range Sum Query - Mutable', slug: 'range-sum-query-mutable', difficulty: 'Medium' },
      { name: 'My Calendar I', slug: 'my-calendar-i', difficulty: 'Medium' },
      { name: 'My Calendar II', slug: 'my-calendar-ii', difficulty: 'Medium' },
      { name: 'Count of Smaller Numbers After Self (intro)', slug: 'count-of-smaller-numbers-after-self', difficulty: 'Medium' },
      { name: 'Range Sum Query 2D - Mutable', slug: 'range-sum-query-2d-mutable', difficulty: 'Medium' },
      { name: 'Falling Squares', slug: 'falling-squares', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Count of Range Sum', slug: 'count-of-range-sum', difficulty: 'Hard' },
      { name: 'The Skyline Problem', slug: 'the-skyline-problem', difficulty: 'Hard' },
      { name: 'Count of Smaller Numbers After Self', slug: 'count-of-smaller-numbers-after-self', difficulty: 'Hard' },
      { name: 'My Calendar III', slug: 'my-calendar-iii', difficulty: 'Hard' },
      { name: 'Reverse Pairs', slug: 'reverse-pairs', difficulty: 'Hard' },
      { name: 'Maximum Sum of 3 Non-Overlapping Subarrays', slug: 'maximum-sum-of-3-non-overlapping-subarrays', difficulty: 'Hard' },
    ],
  },
  'Memoization': {
    easy: [
      { name: 'Fibonacci Number', slug: 'fibonacci-number', difficulty: 'Easy' },
      { name: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'Easy' },
      { name: 'N-th Tribonacci Number', slug: 'n-th-tribonacci-number', difficulty: 'Easy' },
      { name: 'Min Cost Climbing Stairs', slug: 'min-cost-climbing-stairs', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Coin Change', slug: 'coin-change', difficulty: 'Medium' },
      { name: 'Word Break', slug: 'word-break', difficulty: 'Medium' },
      { name: 'Unique Paths II', slug: 'unique-paths-ii', difficulty: 'Medium' },
      { name: 'Minimum Path Sum', slug: 'minimum-path-sum', difficulty: 'Medium' },
      { name: 'Triangle', slug: 'triangle', difficulty: 'Medium' },
      { name: 'Decode Ways', slug: 'decode-ways', difficulty: 'Medium' },
      { name: 'Longest Common Subsequence', slug: 'longest-common-subsequence', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Regular Expression Matching', slug: 'regular-expression-matching', difficulty: 'Hard' },
      { name: 'Edit Distance', slug: 'edit-distance', difficulty: 'Hard' },
      { name: 'Burst Balloons', slug: 'burst-balloons', difficulty: 'Hard' },
      { name: 'Wildcard Matching', slug: 'wildcard-matching', difficulty: 'Hard' },
      { name: 'Distinct Subsequences', slug: 'distinct-subsequences', difficulty: 'Hard' },
      { name: 'Cherry Pickup', slug: 'cherry-pickup', difficulty: 'Hard' },
    ],
  },
  'Ordered Set': {
    easy: [
      { name: 'Contains Duplicate II', slug: 'contains-duplicate-ii', difficulty: 'Easy' },
      { name: 'Minimum Absolute Difference in BST', slug: 'minimum-absolute-difference-in-bst', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'My Calendar I', slug: 'my-calendar-i', difficulty: 'Medium' },
      { name: 'Sliding Window Median', slug: 'sliding-window-median', difficulty: 'Medium' },
      { name: 'Count of Smaller Numbers After Self (intro)', slug: 'count-of-smaller-numbers-after-self', difficulty: 'Medium' },
      { name: 'Contains Duplicate III', slug: 'contains-duplicate-iii', difficulty: 'Medium' },
      { name: 'Find K Closest Elements', slug: 'find-k-closest-elements', difficulty: 'Medium' },
      { name: 'Minimum Number of Arrows to Burst Balloons', slug: 'minimum-number-of-arrows-to-burst-balloons', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'My Calendar III', slug: 'my-calendar-iii', difficulty: 'Hard' },
      { name: 'Count of Range Sum', slug: 'count-of-range-sum', difficulty: 'Hard' },
      { name: 'The Skyline Problem', slug: 'the-skyline-problem', difficulty: 'Hard' },
      { name: 'Data Stream as Disjoint Intervals', slug: 'data-stream-as-disjoint-intervals', difficulty: 'Hard' },
      { name: 'Maximum Profit in Job Scheduling', slug: 'maximum-profit-in-job-scheduling', difficulty: 'Hard' },
      { name: 'Range Module', slug: 'range-module', difficulty: 'Hard' },
    ],
  },
  'Simulation': {
    easy: [
      { name: 'Robot Return to Origin', slug: 'robot-return-to-origin', difficulty: 'Easy' },
      { name: 'Design Parking System', slug: 'design-parking-system', difficulty: 'Easy' },
      { name: 'Excel Sheet Column Title', slug: 'excel-sheet-column-title', difficulty: 'Easy' },
      { name: 'Baseball Game', slug: 'baseball-game', difficulty: 'Easy' },
      { name: 'Count of Matches in Tournament', slug: 'count-of-matches-in-tournament', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Spiral Matrix', slug: 'spiral-matrix', difficulty: 'Medium' },
      { name: 'Game of Life', slug: 'game-of-life', difficulty: 'Medium' },
      { name: 'Robot Bounded In Circle', slug: 'robot-bounded-in-circle', difficulty: 'Medium' },
      { name: 'Rotate Image', slug: 'rotate-image', difficulty: 'Medium' },
      { name: 'Spiral Matrix II', slug: 'spiral-matrix-ii', difficulty: 'Medium' },
      { name: 'Walk Along the Spiral', slug: 'spiral-matrix-iii', difficulty: 'Medium' },
      { name: 'Design Hit Counter', slug: 'design-hit-counter', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Text Justification', slug: 'text-justification', difficulty: 'Hard' },
      { name: 'LFU Cache', slug: 'lfu-cache', difficulty: 'Hard' },
      { name: 'Falling Squares', slug: 'falling-squares', difficulty: 'Hard' },
      { name: 'Ants on a Plank', slug: 'minimum-time-to-make-rope-colorful', difficulty: 'Hard' },
      { name: 'Max Sum of Rectangle No Larger Than K', slug: 'max-sum-of-rectangle-no-larger-than-k', difficulty: 'Hard' },
      { name: 'Zuma Game', slug: 'zuma-game', difficulty: 'Hard' },
    ],
  },
  'Counting': {
    easy: [
      { name: 'Counting Bits', slug: 'counting-bits', difficulty: 'Easy' },
      { name: 'Number of Good Pairs', slug: 'number-of-good-pairs', difficulty: 'Easy' },
      { name: 'Count the Digits That Divide a Number', slug: 'count-the-digits-that-divide-a-number', difficulty: 'Easy' },
      { name: 'How Many Numbers Are Smaller Than the Current Number', slug: 'how-many-numbers-are-smaller-than-the-current-number', difficulty: 'Easy' },
      { name: 'Check if the Sentence Is Pangram', slug: 'check-if-the-sentence-is-pangram', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Count Good Nodes in Binary Tree', slug: 'count-good-nodes-in-binary-tree', difficulty: 'Medium' },
      { name: 'Count Nice Subarrays', slug: 'count-number-of-nice-subarrays', difficulty: 'Medium' },
      { name: 'Count Subarrays With Fixed Bounds', slug: 'count-subarrays-with-fixed-bounds', difficulty: 'Medium' },
      { name: 'Frequency of the Most Frequent Element', slug: 'frequency-of-the-most-frequent-element', difficulty: 'Medium' },
      { name: 'Count Unique Characters of All Substrings', slug: 'count-unique-characters-of-all-substrings-of-a-given-string', difficulty: 'Medium' },
      { name: 'Count Vowel Substrings of a String', slug: 'count-vowel-substrings-of-a-string', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Count of Smaller Numbers After Self', slug: 'count-of-smaller-numbers-after-self', difficulty: 'Hard' },
      { name: 'Count of Range Sum', slug: 'count-of-range-sum', difficulty: 'Hard' },
      { name: 'Reverse Pairs', slug: 'reverse-pairs', difficulty: 'Hard' },
      { name: 'Count Different Palindromic Subsequences', slug: 'count-different-palindromic-subsequences', difficulty: 'Hard' },
      { name: 'Count Subarrays with Score Less Than K', slug: 'count-subarrays-with-score-less-than-k', difficulty: 'Hard' },
      { name: 'Sum of Subarray Minimums', slug: 'sum-of-subarray-minimums', difficulty: 'Hard' },
    ],
  },
  'Geometry': {
    easy: [
      { name: 'Check If It Is a Straight Line', slug: 'check-if-it-is-a-straight-line', difficulty: 'Easy' },
      { name: 'Rectangle Overlap', slug: 'rectangle-overlap', difficulty: 'Easy' },
      { name: 'Projection Area of 3D Shapes', slug: 'projection-area-of-3d-shapes', difficulty: 'Easy' },
    ],
    medium: [
      { name: 'Max Points on a Line', slug: 'max-points-on-a-line', difficulty: 'Medium' },
      { name: 'Minimum Area Rectangle', slug: 'minimum-area-rectangle', difficulty: 'Medium' },
      { name: 'K Closest Points to Origin', slug: 'k-closest-points-to-origin', difficulty: 'Medium' },
      { name: 'Rectangle Area', slug: 'rectangle-area', difficulty: 'Medium' },
      { name: 'Valid Square', slug: 'valid-square', difficulty: 'Medium' },
      { name: 'Surface Area of 3D Shapes', slug: 'surface-area-of-3d-shapes', difficulty: 'Medium' },
    ],
    hard: [
      { name: 'Erect the Fence (Convex Hull)', slug: 'erect-the-fence', difficulty: 'Hard' },
      { name: 'Minimum Area Rectangle II', slug: 'minimum-area-rectangle-ii', difficulty: 'Hard' },
      { name: 'Largest Triangle Area', slug: 'largest-triangle-area', difficulty: 'Hard' },
      { name: 'Maximum Number of Points with Cost', slug: 'maximum-number-of-points-with-cost', difficulty: 'Hard' },
      { name: 'Line Reflection', slug: 'line-reflection', difficulty: 'Hard' },
    ],
  },
};

const DAY_DIFFICULTIES = [
  'Easy Warmup',
  'Easy-Medium',
  'Medium Core Patterns',
  'Medium Intermediate',
  'Medium-Hard Complex Edge Cases',
  'Hard Advanced Algorithms',
  'Hard Challenge Mastery',
];

export default function StudyPlanPage() {
  const { user } = useUser();
  const { username } = useConnectedUsername();
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['Dynamic Programming', 'Binary Search']);
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<StudyDay[] | null>(null);
  const [completedProblems, setCompletedProblems] = useState<Record<string, boolean>>({});

  const storageKey = user?.id ? `study_plan_${user.id}` : 'study_plan_guest';

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = user?.id ? `study_plan_${user.id}` : 'study_plan_guest';
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          setGeneratedPlan(JSON.parse(saved));
        } catch (err) {
          console.warn('Could not parse saved study plan:', err);
        }
      }

      const savedCompleted = localStorage.getItem('leetflow_completed_problems');
      if (savedCompleted) {
        try {
          setCompletedProblems(JSON.parse(savedCompleted));
        } catch (err) {
          console.warn('Could not parse completed problems:', err);
        }
      }
    }

    if (user?.id) {
      fetch('/api/user/sync')
        .then((res) => res.json())
        .then((data) => {
          if (data?.user?.latestStudyPlan?.planData) {
            const planData = data.user.latestStudyPlan.planData;
            if (planData.plan && Array.isArray(planData.plan)) {
              setGeneratedPlan(planData.plan);
              if (typeof window !== 'undefined') {
                const key = `study_plan_${user.id}`;
                localStorage.setItem(key, JSON.stringify(planData.plan));
              }
            }
            if (planData.completedProblems) {
              setCompletedProblems(planData.completedProblems);
              if (typeof window !== 'undefined') {
                localStorage.setItem('leetflow_completed_problems', JSON.stringify(planData.completedProblems));
              }
            }
          }
        })
        .catch((err) => console.warn('Study plan sync fetch warning:', err));
    }
  }, [user?.id]);

  function toggleProblemCompleted(slug: string) {
    const next = { ...completedProblems, [slug]: !completedProblems[slug] };
    setCompletedProblems(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('leetflow_completed_problems', JSON.stringify(next));
    }
    if (user?.id) {
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studyPlanData: {
            topics: selectedTopics,
            completedProblems: next,
            plan: generatedPlan,
          },
        }),
      }).catch((err) => console.warn('Supabase post study plan warning:', err));
    }
    if (next[slug]) {
      toast.success('Marked problem as completed! 🎉');
    }
  }

  function toggleTopic(topic: string) {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      if (selectedTopics.length >= 5) {
        toast.error('Select up to 5 topics max');
        return;
      }
      setSelectedTopics([...selectedTopics, topic]);
    }
  }

  function parseAIJsonPlan(text: string): StudyDay[] {
    let cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');
    if (start !== -1 && end !== -1 && end > start) {
      cleaned = cleaned.substring(start, end + 1);
    }
    cleaned = cleaned.replace(/,\s*([\]}])/g, '$1');
    return JSON.parse(cleaned);
  }

  function deduplicatePlanProblems(days: StudyDay[]): StudyDay[] {
    const seenSlugs = new Set<string>();

    return days.map((day, idx) => {
      const uniqueProbs: (string | ProblemRef)[] = [];
      const topicCat = TOPIC_CATALOG[day.topic] || TOPIC_CATALOG['Dynamic Programming'];
      const targetDiff: 'Easy' | 'Medium' | 'Hard' = idx >= 5 ? 'Hard' : idx >= 2 ? 'Medium' : 'Easy';
      const pool = idx >= 5 ? topicCat.hard : idx >= 2 ? topicCat.medium : topicCat.easy;

      for (const prob of day.problems) {
        let slug = '';
        if (typeof prob === 'object' && prob && prob.slug) {
          slug = prob.slug;
        } else if (typeof prob === 'string') {
          slug = prob.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }

        if (slug && !seenSlugs.has(slug)) {
          seenSlugs.add(slug);
          if (typeof prob === 'object') {
            uniqueProbs.push({ ...prob, difficulty: targetDiff });
          } else {
            uniqueProbs.push(prob);
          }
        }
      }

      // Fill missing entries with unique candidates from pool & catalog
      const allCandidates = [...pool, ...topicCat.hard, ...topicCat.medium, ...topicCat.easy];
      for (const candidate of allCandidates) {
        if (uniqueProbs.length >= 2) break;
        if (!seenSlugs.has(candidate.slug)) {
          seenSlugs.add(candidate.slug);
          uniqueProbs.push({ ...candidate, difficulty: targetDiff });
        }
      }

      return {
        ...day,
        problems: uniqueProbs,
      };
    });
  }

  function buildFallbackPlan(): StudyDay[] {
    const topics = selectedTopics.length > 0 ? selectedTopics : ['Dynamic Programming', 'Binary Search'];
    const seenSlugs = new Set<string>();

    return Array.from({ length: 7 }).map((_, i) => {
      const dayNum = i + 1;
      const topicName = topics[i % topics.length];
      const cat = TOPIC_CATALOG[topicName] || TOPIC_CATALOG['Dynamic Programming'];
      const targetDiff: 'Easy' | 'Medium' | 'Hard' = dayNum >= 6 ? 'Hard' : dayNum >= 3 ? 'Medium' : 'Easy';
      const pool = dayNum >= 6 ? cat.hard : dayNum >= 3 ? cat.medium : cat.easy;

      const selectedProbs: ProblemRef[] = [];
      const candidateList = [...pool, ...cat.hard, ...cat.medium, ...cat.easy];

      for (const candidate of candidateList) {
        if (selectedProbs.length >= 3) break;
        if (!seenSlugs.has(candidate.slug)) {
          seenSlugs.add(candidate.slug);
          selectedProbs.push({ ...candidate, difficulty: targetDiff });
        }
      }

      return {
        day: dayNum,
        title: `Day ${dayNum}: ${topicName} (${DAY_DIFFICULTIES[i]})`,
        topic: topicName,
        focus: `Progressive difficulty ${dayNum}/7 (${targetDiff}): Mastering ${topicName} pattern variations.`,
        problems: selectedProbs,
      };
    });
  }

  async function generatePlan() {
    if (selectedTopics.length === 0) {
      toast.error('Please select at least 1 topic');
      return;
    }
    setLoading(true);

    try {
      const res = await fetch('/api/ai/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topics: selectedTopics,
          username,
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      let data: any = {};
      if (contentType.includes('application/json')) {
        data = await res.json();
      }

      if (!res.ok) throw new Error(data.error || 'Plan generation failed');

      const text = data.reply || '';
      let parsed: StudyDay[];
      try {
        parsed = deduplicatePlanProblems(parseAIJsonPlan(text));
      } catch (pErr) {
        console.warn('AI JSON parsing fallback triggered:', pErr);
        parsed = buildFallbackPlan();
      }

      setGeneratedPlan(parsed);
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(parsed));
      }
      if (user?.id) {
        fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studyPlanData: {
              topics: selectedTopics,
              completedProblems,
              plan: parsed,
            },
          }),
        }).catch((err) => console.warn('Supabase post plan warning:', err));
      }
      toast.success('Generated complete progressive 7-day study plan!');
    } catch (err) {
      console.warn('API error, using curated progressive fallback plan:', err);
      const fallback = buildFallbackPlan();
      setGeneratedPlan(fallback);
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, JSON.stringify(fallback));
      }
      if (user?.id) {
        fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studyPlanData: {
              topics: selectedTopics,
              completedProblems,
              plan: fallback,
            },
          }),
        }).catch((err) => console.warn('Supabase post plan warning:', err));
      }
      toast.success('Generated complete progressive 7-day study plan!');
    } finally {
      setLoading(false);
    }
  }

  function clearPlan() {
    setGeneratedPlan(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(storageKey);
    }
    toast.info('Study plan cleared');
  }

  function getProblemDetails(prob: string | ProblemRef, dayIndex: number) {
    let name = '';
    let slug = '';
    let difficulty: 'Easy' | 'Medium' | 'Hard' = dayIndex >= 5 ? 'Hard' : dayIndex >= 2 ? 'Medium' : 'Easy';

    if (typeof prob === 'object' && prob && prob.name) {
      name = prob.name;
      slug = prob.slug || prob.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      if (prob.difficulty) difficulty = prob.difficulty;
    } else {
      name = String(prob);
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }

    return {
      name,
      slug,
      url: `https://leetcode.com/problems/${slug}/`,
      difficulty,
    };
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Complete 7-Day Pattern Roadmap"
        description="Comprehensive study roadmaps covering all major problem patterns scaling from Day 1 (Easy) to Day 7 (Hard Challenge)"
      />

      {/* Generator Controls */}
      <div className="rounded-xl border bg-card p-6 space-y-6 shadow-xs">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">Select Target Topics (up to 5)</h3>
            <span className="text-xs text-orange-500 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Progressive Curve: Day 1 (Easy) ➔ Day 7 (Hard DP & Algorithms)
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => {
              const active = selectedTopics.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => toggleTopic(topic)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors font-medium ${
                    active
                      ? 'bg-orange-500 text-white border-orange-500'
                      : 'bg-muted/50 border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {topic}
                </button>
              );
            })}
          </div>
        </div>

        <Button
          onClick={generatePlan}
          disabled={loading || selectedTopics.length === 0}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {generatedPlan ? 'Regenerate Complete 7-Day Plan' : 'Generate Complete 7-Day Plan'}
        </Button>
      </div>

      {/* Generated Plan Output */}
      {generatedPlan && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-rose-500" />
              Your Complete 7-Day Pattern Roadmap
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={clearPlan}
              className="text-xs text-rose-500 border-rose-500/20 hover:bg-rose-500/10 gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Plan
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {generatedPlan.map((day, idx) => (
              <div key={day.day} className="rounded-xl border bg-card p-5 space-y-3 shadow-xs hover:border-rose-500/30 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-rose-500/20 text-rose-500 bg-rose-500/5">
                      Day {day.day}
                    </Badge>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-muted text-foreground">
                        {DAY_DIFFICULTIES[idx] || 'Medium'}
                      </span>
                      <Badge variant="outline" className="text-[10px] border-rose-500/30 text-rose-500 bg-rose-500/10 font-semibold">
                        🏷️ {day.topic}
                      </Badge>
                    </div>
                  </div>
                  <h4 className="font-semibold text-base">{day.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{day.focus}</p>
                </div>

                <div className="border-t pt-3 space-y-2 mt-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">Recommended Problems:</p>
                    <span className="text-[10px] text-muted-foreground font-mono">Tag: #{day.topic}</span>
                  </div>
                  <ul className="space-y-2.5">
                    {day.problems.map((prob, pIdx) => {
                      const { name, url, difficulty, slug } = getProblemDetails(prob, idx);
                      const isDone = !!completedProblems[slug];
                      return (
                        <li key={pIdx} className="text-xs text-foreground flex items-center justify-between gap-2 group p-1 rounded-md hover:bg-muted/40 transition-colors">
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Checkbox
                              checked={isDone}
                              onCheckedChange={() => toggleProblemCompleted(slug)}
                              className="w-4 h-4 rounded border-rose-500/50 data-[state=checked]:bg-rose-500 data-[state=checked]:text-white cursor-pointer"
                            />
                            <span className={`truncate font-medium transition-all ${isDone ? 'line-through text-muted-foreground opacity-60' : ''}`}>
                              {name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                            <Badge
                              variant="outline"
                              className={`text-[10px] px-1.5 py-0 font-medium ${
                                difficulty === 'Easy'
                                  ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10'
                                  : difficulty === 'Medium'
                                  ? 'border-amber-500/30 text-amber-500 bg-amber-500/10'
                                  : 'border-rose-500/30 text-rose-500 bg-rose-500/10'
                              }`}
                            >
                              {difficulty}
                            </Badge>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-rose-500 hover:text-rose-600 hover:underline flex items-center gap-0.5 font-medium"
                            >
                              Solve <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
