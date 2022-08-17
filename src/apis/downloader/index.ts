import {createWriteStream} from 'fs';
import youtubedl from 'youtube-dl';
import {v4 as uuidv4} from 'uuid';
import {join} from 'path';

export default async (url: string, filename = uuidv4()) => {
	const path = join(__dirname, '..', '..', 'out');
	const filepath = join(path, `${filename}.mp4`);
	const video = youtubedl(url, [], {cwd: path});
	const stream = createWriteStream(filepath);

	video.pipe(stream);

	return new Promise((resolve, reject) => {
		video
			.on('end', () => {
				resolve(filepath);
			})
			.on('error', (err) => {
				reject(err);
			});
	});
};
