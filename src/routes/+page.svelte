<script>
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import ScreenColumn from '$lib/layout/ScreenColumn.svelte';
	import Heading from '$lib/components/Heading.svelte';
	import { Language } from '$lib/utilities/language';
	import { Platform } from '$lib/utilities/platform';
	import CardList from '$lib/layout/CardList.svelte';
	import Header from '$lib/layout/Header.svelte';
	import '../reset.scss';
	import ModelCard from '$lib/components/ModelCard.svelte';
</script>

<Header />
<ScreenColumn>
	<Heading level={2}>Projects</Heading>
	<CardList>
		<ProjectCard
			title="Nintendo 64 Peripheral Access Crate"
			description="A low-level registry wrapper for building Rust applications on the Nintendo 64."
			repository="icorbrey/nintendo64-pac"
			platform={Platform.Github}
			language={Language.Rust}
		/>
		<ProjectCard
			title="Rust Raytracer"
			description="A simple raytracer, built in Rust."
			repository="icorbrey/rustrays"
			platform={Platform.Github}
			language={Language.Rust}
		/>
		<ProjectCard
			title="Gitty"
			description="A set of quality-of-life utility scripts for Git."
			repository="icorbrey/gitty"
			platform={Platform.Github}
			language={Language.Shell}
		/>
		<ProjectCard
			title="Uncertain"
			description="Defines a mathematically uncertain number type for scientific applications."
			repository="icorbrey/uncertain"
			platform={Platform.Github}
			language={Language.Python}
		/>
		<ProjectCard
			title="Sauron"
			description="A simple utility for searching for packages on the AUR."
			repository="icorbrey/sauron"
			platform={Platform.Github}
			language={Language.Python}
		/>
	</CardList>
	<Heading level={2}>3D Models</Heading>
	<CardList>
		<ModelCard
			title="Complete 9x9 Go Set with Board, Bowls, and Stones"
			description="Everything you need to get started playing Go!"
			href="https://www.printables.com/model/423430-complete-9x9-go-set-with-board-bowls-and-stones"
			src="https://media.printables.com/media/prints/423430/images/3505582_90b0d258-46bf-4fd2-b47c-ace19b425888/thumbs/inside/1280x960/jpg/pxl_20230314_060404050.webp"
			platform={Platform.Printables}
			alt="A set of grey Go bowls and a 9x9 Go board with an orange set and a purple set of Go stones."
		/>
		<ModelCard
			title="Baggage Claim Redux: The Universal Tea Bag Rolodex"
			description="Requires no hardware! Now with universal clips, easier printing, and a ratchet for keeping your tea looking pretty."
			href="https://www.printables.com/model/418543-baggage-claim-redux-the-universal-tea-bag-rolodex"
			src="https://media.printables.com/media/prints/418543/images/3471480_f43d024e-c30b-41d5-bb47-6736a08f73cd/thumbs/inside/1280x960/jpg/pxl_20230308_165743514.webp"
			platform={Platform.Printables}
			alt="A grey Rolodex filled with tea."
		/>
		<ModelCard
			title="Replacement Cycle Dial for Maytag LAT8415AAE Washing Machines"
			description="Fastens snugly to mounting post and has a satisfying grip. Requires minimal supports and prints in about 3 hours."
			href="https://www.printables.com/model/382098-replacement-cycle-dial-for-maytag-lat8415aae-washi"
			src="https://media.printables.com/media/prints/382098/images/3205030_60a0376a-ab57-4774-80bd-c027fbef1c63/thumbs/inside/1280x960/jpg/pxl_20230128_031145214.webp"
			platform={Platform.Printables}
			alt="An orange washing machine dial on a white washing machine."
		/>
	</CardList>
</ScreenColumn>
