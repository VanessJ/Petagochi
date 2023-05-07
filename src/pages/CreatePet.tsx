
import usePageTitle from "../hooks/usePageTitle";
import PetForm from "../components/PetForm";

const CreatePet = () => {
	usePageTitle("Create pet");
	return (
		<>

	<div>
      <h1>CREATE A NEW PET</h1>
      <PetForm onSubmit={() => {}} />
    </div>

		</>
			);
};

export default CreatePet;