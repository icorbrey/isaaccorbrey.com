import { faPython, faRust } from '@fortawesome/free-brands-svg-icons';
import { faTerminal } from '@fortawesome/free-solid-svg-icons'

export enum Language {
	Rust = "Languages/Rust",
	Shell = "Languages/Shell",
	Python = "Languages/Python",
}

export const getLanguageIcon = (language: Language) => {
	switch (language) {
		case Language.Rust: return faRust;
		case Language.Python: return faPython;
		case Language.Shell: return faTerminal;
	}
};
