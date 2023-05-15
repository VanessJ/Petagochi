import { User } from "./firebase";
import { useNavigate } from '@tanstack/react-router';


export const isAdmin = (user: User | undefined) => user?.role?.name === 'admin';

export const checkForAdmin = (user: User | undefined) => {
    if(!isAdmin(user)) {
        const navigate = useNavigate();
        navigate({to: '/'});
        return false;
    }
    return true;
};