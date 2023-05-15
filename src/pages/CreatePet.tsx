
import usePageTitle from "../hooks/usePageTitle";
import PetForm from "../components/PetForm";
import useLoggedInUser from "../hooks/useLoggedInUser";
import {isAdmin, checkForAdmin} from "../accessControl";

const CreatePet = () => {
	usePageTitle("Create pet");
	const user = useLoggedInUser();
	checkForAdmin(user);
	return (
		<>
		{
			isAdmin(user) &&
			<div>
				<h1>CREATE A NEW PET</h1>
				<PetForm onSubmit={() => {}} />
			</div>
		}
		</>
	);
};

export default CreatePet;