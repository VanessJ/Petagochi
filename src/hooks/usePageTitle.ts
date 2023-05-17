import { useEffect } from 'react';

const usePageTitle = (title: string) => {
	useEffect(() => {
		document.title = `${title} | Llamagochi`;
	}, [title]);
};

export default usePageTitle;
