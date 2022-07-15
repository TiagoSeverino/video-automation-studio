import {Img, random} from 'remotion';

const backgrounds = [
	'https://images.unsplash.com/photo-1567360425618-1594206637d2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cG9ydHJhaXQlMjB3YWxscGFwZXJ8ZW58MHx8MHx8&w=1000&q=80',
	'https://wallpaper.dog/large/20492975.jpg',
	'https://wallpaperaccess.com/full/1196770.jpg',
	'https://i.pinimg.com/736x/02/db/12/02db122054aed0eeaade8ebce73d2064.jpg',
	'https://myandroidwalls.com/wp-content/uploads/2022/06/Cool-CS-GO-Wallpaper-576x1024.jpg',
	'https://i.pinimg.com/736x/8a/81/c8/8a81c8338ac66c3c4c912d3c2a9639fa.jpg',
	'https://i.pinimg.com/736x/ce/e2/0c/cee20c0282fd8825e0d5b7d35ea60ae0.jpg',
	'https://i.pinimg.com/originals/56/c0/94/56c094298ea9e007cf60c7087fc1d3b8.jpg',
	'https://3.bp.blogspot.com/-HFFl5lPPe10/XEjjguNbeNI/AAAAAAAABLQ/MYEvgqEXbK0CLTBbUbo8sqHaEK2RJLXmwCKgBGAs/w1440-h3040-c/csgo-counter-terrorist-38-4k.jpg',
];

export const Background: React.FC<{seed: string}> = ({seed}) => {
	const background = backgrounds[Math.floor(random(seed) * backgrounds.length)];

	return <Img src={background} className="backgroundimg" />;
};
