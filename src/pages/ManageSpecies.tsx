import { Box, Typography } from "@mui/material";
import useLoggedInUser from "../hooks/useLoggedInUser";
import usePageTitle from "../hooks/usePageTitle";
import PetsGrid from "../components/PetsGrid";
import { isAdmin, checkForAdmin } from "../accessControl";


const ManageSpecies = () => {
	usePageTitle("ManageSpecies");
	const user = useLoggedInUser();
	checkForAdmin(user);

	return (
		<>
		{
			isAdmin(user) &&
			<>
				<Box sx={{ display: 'flex', alignItems: 'center' }}>
					<Typography variant="h1" fontWeight="bolder">
						All Species
					</Typography>
				</Box>
				{user?.email && (
					<Typography variant="h4" textAlign="center">
						{"Welcome"}, {user.email}!
					</Typography>
				)}
				<PetsGrid></PetsGrid>
			</>
		}
		</>
	);
};

export default ManageSpecies;
