export {};

declare global {
	interface Window {
		answerPy: (pythonCode: string) => void;
		tryPy: (pythonCode: string) => void;
	}
}
