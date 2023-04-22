import { faGithub } from '@fortawesome/free-brands-svg-icons';

export enum Platform {
	Github = "Platforms/Github",
	Printables = "Platforms/Printables",
}

export const getPlatformIcon = (platform: Platform) => {
	switch (platform) {
		case Platform.Github: return faGithub;
	}
};

export const getPlatformText = (platform: Platform) => {
	switch (platform) {
		case Platform.Printables: return 'Check it out on Printables!';
	}
};
