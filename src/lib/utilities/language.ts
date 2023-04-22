import { faRust } from '@fortawesome/free-brands-svg-icons';

export enum Language {
	Rust = "Languages/Rust",
}

export const getLanguageIcon = (language: Language) => {
	switch (language) {
		case Language.Rust: return faRust;
	}
};
