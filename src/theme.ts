import { createTheme } from '@mui/material';



const theme = createTheme({
	palette: {
		primary: { main: '#fc03db' },
		mode: 'dark'
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				// Css rule that makes sure app is always 100% height of window
				'body, #root': {
					display: 'flex',
					flexDirection: 'column',
					minHeight: '100vh'
				}
			}
		}
	}
});

export default theme;
