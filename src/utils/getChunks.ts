export default (data: any[], size = 5) => {
	const chunkSize = 5;

	const chunks = [];
	for (let i = 0; i < data.length; i += chunkSize) {
		chunks.push(data.slice(i, i + chunkSize));
	}

	return chunks;
};
