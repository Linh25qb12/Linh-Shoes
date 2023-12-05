import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const useCurrentUser = () => {
    const [user, setUser] = useState<string>();
    
    useEffect(() => {
        const currentUser = Cookies.get('logged-user');

        if(currentUser) {
            setUser(currentUser);
        }
    }, []);

    return user;
};