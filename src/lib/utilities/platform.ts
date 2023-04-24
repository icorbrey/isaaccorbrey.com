import { faGithub } from '@fortawesome/free-brands-svg-icons';

export enum Platform {
	Github = "Platforms/Github",
	Printables = "Platforms/Printables",
}

export const getIcon = (platform: Platform) => {
	switch (platform) {
		case Platform.Github: return faGithub;
	}
};

export const getRepo = (platform: Platform, repo: string) => (`${{
	[Platform.Github]: 'https://github.com',
	[Platform.Printables]: ''
}[platform]}/${repo}`);

export const getText = (platform: Platform) => {
	switch (platform) {
		case Platform.Printables: return 'Check it out on Printables!';
	}
};
