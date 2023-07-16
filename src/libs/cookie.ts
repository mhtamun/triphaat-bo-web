import jsCookie from 'js-cookie';
import cookie from 'cookie';

export interface ICookie {
    user: any;
    accessType: string;
    accessToken: string;
}

export const getCookie = (tag: string) => jsCookie.get(tag);

export const setCookie = (tag: string, data: any) => jsCookie.set(tag, data);

export const removeCookie = (tag: string) => jsCookie.remove(tag);

export const parseCookie = (reqCookie: any): any => cookie.parse(reqCookie);
