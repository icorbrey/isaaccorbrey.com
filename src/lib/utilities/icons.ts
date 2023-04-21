import { faGithub, faRust } from '@fortawesome/free-brands-svg-icons';
import { Language } from '$lib/types/Language';
import { Platform } from '$lib/types/Platform';

export const getPlatformIcon = (platform: Platform) => {
    switch (platform) {
        case Platform.Github: return faGithub;
    }
};

export const getLanguageIcon = (language: Language) => {
    switch (language) {
        case Language.Rust: return faRust;
    }
};
