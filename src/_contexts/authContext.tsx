import { api } from '@/services/api';
import { useRouter } from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { createContext, useEffect, useState } from 'react';

type Login = {
    email: string;
    password: string;
};

type UserInfo = {
    id: string;
    name: string;
};

type ResponseLogin = {
    user: UserInfo;
    token: string;
};

type AuthContextType = {
    isAuthenticated: boolean;
    userInfo: UserInfo | null;
    signIn: (data: Login) => Promise<boolean>;
    logout: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

    useEffect(() => {
        const checkToken = () => {
            const { auth_token } = parseCookies();

            if (!!auth_token) {
                router.push(router.pathname);
                setIsAuthenticated(true);
                setIsLoading(false);
            } else {
                setIsAuthenticated(false);
                setIsLoading(false);
            }
        };

        checkToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const signIn = async ({ email, password }: Login) => {
        const response: ResponseLogin = await api
            .post('/login', {
                email,
                password,
            })
            .then((res) => {
                return res.data;
            })
            .catch(() => {
                return false;
            });

        if (!response) {
            return response;
        }

        setIsAuthenticated(true);
        setUserInfo(response.user);
        setIsLoading(false);

        setCookie(null, 'auth_token', response.token, {
            maxAge: 3600,
            sameSite: 'lax',
        });

        router.push('./home');

        return true;
    };

    const logout = () => {
        const { auth_token } = parseCookies();

        if (!!auth_token) {
            destroyCookie(null, 'auth_token');
            setIsAuthenticated(false);
            setIsLoading(false);
            router.push('/login');
        }

        router.push('/login');
    };

    if (isLoading) {
        return <div></div>;
    }

    return <AuthContext.Provider value={{ userInfo, isAuthenticated, logout, signIn }}>{children}</AuthContext.Provider>;
}
