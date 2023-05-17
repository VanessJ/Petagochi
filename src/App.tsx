/* eslint-disable react-hooks/rules-of-hooks */
import { AppBar, Button, Container, CssBaseline, ThemeProvider, Toolbar } from '@mui/material';
import {
	RouterProvider,
	RootRoute,
	Outlet,
	Router,
	Route
} from '@tanstack/react-router';
import theme from './theme';
import ButtonLink from './components/ButtonLink';
import useLoggedInUser, { UserProvider } from './hooks/useLoggedInUser';
import { signOut } from './firebase';
import Login from './pages/Login';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import CreatePet from './pages/CreatePet';
import ManageSpecies from './pages/ManageSpecies';
import { isAdmin } from './accessControl';
import About from './pages/About';

const rootRoute = new RootRoute({
	component: () => {
    const user = useLoggedInUser();
	const admin = isAdmin(user);

		return (
			<ThemeProvider theme={theme}>
				<CssBaseline />

				<AppBar sx={{ position: 'sticky' }}>
					<Container maxWidth="sm">
						<Toolbar disableGutters sx={{ gap: 2, display:'flex', justifyContent:'space-around' }}>
							<ButtonLink to="/">{"Home"}</ButtonLink>
							<ButtonLink to="/about">{"About"}</ButtonLink>
							{admin && <ButtonLink to="/manage">{"Manage Llamas"}</ButtonLink>}
							{admin && <ButtonLink to="/create">{"Create Llama"}</ButtonLink>}
              {!user ? (
								<ButtonLink to="/login">{"Login"}</ButtonLink>
							) : (
								<Button onClick={signOut}>{"Logout"}</Button>
							)}
						</Toolbar>
					</Container>
				</AppBar>

				<Container
					maxWidth="sm"
					component="main"
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						flexGrow: 1,
						gap: 2,
						my: 4
					}}
				>
					<Outlet />
				</Container>
			</ThemeProvider>
		);
	}
});

const indexRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/',
  component: Home
});

const createRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/create',
  component: CreatePet
});


const playRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/manage',
	component: ManageSpecies
});

const aboutRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/about',
	component: About
});

const notFoundRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '*',
  component: () => (
    <div>
      <h1>Not found</h1>
    </div>
  )
});

const loginRoute = new Route({
	getParentRoute: () => rootRoute,
	path: '/login',
	component: Login
});


const routeTree = rootRoute.addChildren([
	indexRoute,
	playRoute,
	aboutRoute,
	loginRoute,
	createRoute,
	notFoundRoute
]);

const router = new Router({ routeTree });

declare module '@tanstack/react-router' {
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Register {
		router: typeof router;
	}
}

const App = () => (
	<UserProvider>
		<ToastContainer
			theme="dark"
		/>
		<RouterProvider router={router} />
	</UserProvider>
);


export default App
