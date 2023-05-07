import { Box, Typography } from "@mui/material";
import useLoggedInUser from "../hooks/useLoggedInUser";
import usePageTitle from "../hooks/usePageTitle";
import PetsGrid from "../components/PetsGrid";


const Home = () => {
	usePageTitle("Home");

	const user = useLoggedInUser();

	return (
		<>
			<Box sx={{ display: 'flex', alignItems: 'center' }}>
				<Typography variant="h1" fontWeight="bolder">
					Llamagochi
				</Typography>
			</Box>
			{user?.email && (
				<Typography variant="h4" textAlign="center">
					{"Welcome"}, {user.email}!
				</Typography>
			)}
			<PetsGrid></PetsGrid>

		</>
			);
};

export default Home;
