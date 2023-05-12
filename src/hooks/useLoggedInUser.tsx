import {
	createContext,
	FC,
	PropsWithChildren,
	useContext,
	useEffect,
	useState
} from 'react';

import { onAuthChanged, rolesDocument, User } from '../firebase';
import { getDoc } from 'firebase/firestore';

const UserContext = createContext<User | undefined>(undefined);

export const UserProvider: FC<PropsWithChildren> = ({ children }) => {
	// Hold user info in state
	const [user, setUser] = useState<User>();

	// Setup onAuthChanged once when component is mounted
	useEffect(() => {
		onAuthChanged(user => {
			if(user && user.email) {
				getDoc(rolesDocument(user.email)).then(roleSnapshot => {
					if(roleSnapshot.exists()) {
						user.role = roleSnapshot.data();
						setUser(user);
					}
				});
			}
		});
	}, []);

	return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

// Hook providing logged in user information
const useLoggedInUser = () => useContext(UserContext);

export default useLoggedInUser;
