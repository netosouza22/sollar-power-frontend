import { FormDataLogin } from '@/@types/forms';
import { ResponseLogin } from '@/@types/response';
import { api } from '@/services/api';
import { useRouter } from 'next/router';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { createContext, useEffect, useState } from 'react';

type UserInfo = {
    id: string;
    name: string;
};
type AuthContextType = {
    isAuthenticated: boolean;
    userInfo: UserInfo | null;
    signIn: (data: FormDataLogin) => Promise<boolean>;
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
                api.get('/checkAuth')
                    .then((res) => setUserInfo(res.data.user))
                    .catch((err) => router.push('/'));

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

    const signIn = async ({ email, password }: FormDataLogin) => {
        const response: ResponseLogin = await api
            .post('/login', {
                email,
                password,
            })
            .then((res) => {
                const {
                    data: { token },
                } = res;

                setCookie(null, 'auth_token', token, {
                    maxAge: 3600,
                    sameSite: 'lax',
                });

                api.defaults.headers.Authorization = `Bearer ${token}`;

                return res.data;
            })
            .catch(() => {
                return false;
            });

        if (!response) {
            return false;
        }

        setIsAuthenticated(true);
        setUserInfo(response.user);
        setIsLoading(false);

        router.push('/home');
        return true;
    };

    const logout = () => {
        const { auth_token } = parseCookies();

        if (!!auth_token) {
            destroyCookie(null, 'auth_token');
            setIsAuthenticated(false);
            setIsLoading(false);
            router.push('/');
        }

        router.push('/');
    };

    if (isLoading) {
        return <div></div>;
    }

    return <AuthContext.Provider value={{ userInfo, isAuthenticated, logout, signIn }}>{children}</AuthContext.Provider>;
}
