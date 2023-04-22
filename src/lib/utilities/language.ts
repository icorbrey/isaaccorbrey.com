import { faPython, faRust } from '@fortawesome/free-brands-svg-icons';
import { faTerminal } from '@fortawesome/free-solid-svg-icons'

export enum Language {
	Rust = "Languages/Rust",
	Shell = "Languages/Shell",
	Python = "Languages/Python",
}

export const getLanguageIcon = (language: Language) => ({
	[Language.Shell]: faTerminal,
	[Language.Python]: faPython,
	[Language.Rust]: faRust,
}[language]);

export const getLanguageColor = (language: Language) => ({
	[Language.Python]: '#3572a5',
	[Language.Shell]: '#89e051',
	[Language.Rust]: '#dea584',
}[language]);
