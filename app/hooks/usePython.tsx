import { loadPyodide } from "pyodide";
import { useEffect } from "react";

export function usePython({ pyodideURL = undefined }: { pyodideURL?: string }) {
	const VOUCHER = "UFlDT05NQU5JQU1BTlRBUA==";
	useEffect(() => {
		const asyncInit = async () => {
			console.log("Want a free Voucher? answer the code below using python");
			console.log(`Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You must return the answer in order.`);
			console.log("example 1: nums: [2, 7, 11, 15] target: 9 output: [0, 1]");
			console.log("example 2: nums: [3, 2, 4] target: 6 output: [1, 2]");
			console.log("example 3: nums: [3, 3] target: 6 output: [0, 1]");
			console.log(
				"to answer just call window.answerPy function and put your python function named it `def two_sums(numbers: list[int], target: int) -> list[int]`. Here the example",
			);
			console.log(`window.answerPy(\`
import random

def two_sums(nums: list[int], target: int) -> list[int]:
  random.shuffle(nums)
  return [0, 1]
\`)`);
			console.log("You can also try run python code using window.tryPy()");
			console.log("window.tryPy('print(1 + 1)')");

			const pyodide = await loadPyodide({
				indexURL: pyodideURL,
			});

			window.tryPy = (pythonCode: string) => {
				pyodide.runPython(pythonCode);
			};

			window.answerPy = (pythonCode: string) => {
				const twoSumTestCases = [
					{
						id: 1,
						description: "Standard Case (Basic)",
						input: {
							nums: [2, 7, 11, 15],
							target: 9,
						},
						expectedOutput: [0, 1],
					},
					{
						id: 2,
						description: "Unsorted Array",
						input: {
							nums: [3, 2, 4],
							target: 6,
						},
						expectedOutput: [1, 2],
					},
					{
						id: 3,
						description: "Duplicate Elements",
						input: {
							nums: [3, 3],
							target: 6,
						},
						expectedOutput: [0, 1],
					},
					{
						id: 4,
						description: "Negative Numbers Included",
						input: {
							nums: [-3, 4, 3, 90],
							target: 0,
						},
						expectedOutput: [0, 2],
					},
					{
						id: 5,
						description: "All Negative Numbers",
						input: {
							nums: [-10, -1, -18, -19],
							target: -20,
						},
						expectedOutput: [1, 3],
					},
					{
						id: 6,
						description: "Target is a Negative Number",
						input: {
							nums: [5, 20, -3, 8],
							target: 5,
						},
						expectedOutput: [2, 3],
					},
					{
						id: 7,
						description: "Correct Solution Uses the Last Two Elements",
						input: {
							nums: [1, 2, 3, 4, 5, 6],
							target: 11,
						},
						expectedOutput: [4, 5],
					},
					{
						id: 8,
						description: "Target is Zero with One Positive and One Negative",
						input: {
							nums: [10, 2, -5, -10, 7],
							target: 0,
						},
						expectedOutput: [0, 3],
					},
					{
						id: 9,
						description: "Large Numbers",
						input: {
							nums: [100000000, 500000, 200000000],
							target: 300000000,
						},
						expectedOutput: [0, 2],
					},
					{
						id: 10,
						description: "Multiple Duplicates (But Only One Valid Pair)",
						input: {
							nums: [2, 5, 5, 11],
							target: 10,
						},
						expectedOutput: [1, 2],
					},
				];

				pyodide.runPython(pythonCode);
				const twoSumFn = pyodide.globals.get("two_sums");
				const answers = twoSumTestCases.map((item) => {
					const result = twoSumFn(item.input.nums, item.input.target).toJs();
					return (
						Array.isArray(result) &&
						result.length === item.expectedOutput.length &&
						result.every((value, index) => value === item.expectedOutput[index])
					);
				});

				const numCorrect = answers.reduce(
					(prev, cur) => (cur === true ? prev + 1 : prev),
					0,
				);
				const boom = atob(VOUCHER);

				if (numCorrect === 10) {
					console.log(
						`Congrats your answer is correct here the voucher: ${boom}`,
					);
					console.log(
						"if the voucher not working it means the quota already full",
					);
					return;
				}

				console.log(
					`You've got ${numCorrect}/10 [${answers.map((item) => (item ? "V" : "X")).join("|")}] Please try again`,
				);
			};
		};

		asyncInit();
	}, [pyodideURL]);
}
