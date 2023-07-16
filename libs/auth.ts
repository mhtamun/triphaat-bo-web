// third-party
import { GetServerSidePropsContext } from 'next';

// application
import { getCookie, setCookie, removeCookie, parseCookie, ICookie } from './cookie';

export const getUser = () => getCookie('user');
export const setUser = (value: string) => setCookie('user', value);
export const getAccessType = () => getCookie('accessType');
export const setAccessType = (value: string) => setCookie('accessType', value);
export const getAccessToken = () => getCookie('accessToken');
export const setAccessToken = (value: string) => setCookie('accessToken', value);

export const createLogin = (user: any, accessType: string, accessToken: string): boolean => {
    try {
        setUser(user);
        setAccessType(accessType);
        setAccessToken(accessToken);

        return true;
    } catch (error) {
        console.error('error', error);

        return false;
    }
};

export const isLoggedIn = () => {
    if (!getUser || !getAccessType || !getAccessToken) return false;

    return true;
};

export const destroyLogin = (): boolean => {
    try {
        removeCookie('user');
        removeCookie('accessType');
        removeCookie('accessToken');

        return true;
    } catch (error) {
        console.error('error', error);

        return false;
    }
};

export const getServerSideCookie = (req: any): ICookie | null => {
    if (!req) return null;

    if (!req.headers) return null;

    if (!req.headers.cookie) return null;

    return parseCookie(req.headers.cookie);
};

export const getAuthorized = async (context: GetServerSidePropsContext, callback?: (cookies: any) => any) => {
    const { req } = context;
    const cookies = getServerSideCookie(req);

    if (!req.url?.includes('/auth/login') && (!cookies?.user || !cookies?.accessType || !cookies?.accessToken)) {
        return {
            redirect: {
                destination: '/auth/login',
                permanent: false,
            },
        };
    }

    let props = null;

    if (callback) props = await callback(cookies);

    return {
        props: props ?? {},
    };
};
