export const dateToString = (date: Date, year = true) =>
	`${year ? `${date.getFullYear()}-` : ''}${(
		'0' + (date.getMonth() + 1).toString()
	).slice(-2)}-${('0' + date.getDate().toString()).slice(-2)}`;
