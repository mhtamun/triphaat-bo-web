import { GetServerSidePropsContext } from 'next';
import { IData } from '../libs/api';

export default function handleResponseIfError(
    context: GetServerSidePropsContext,
    ...responses: IData[]
): {
    redirect: {
        destination: string;
        permanent: boolean;
    };
} | null {
    let result = null;

    const { req } = context;

    for (const response of responses) {
        if (response === undefined || response === null) {
            result = {
                redirect: {
                    destination: '/500',
                    permanent: false,
                },
            };

            break;
        }

        if (response !== undefined && response !== null && response.statusCode === 401) {
            result = {
                redirect: {
                    destination: !req.url?.includes('/v-p') ? '/auth/login' : '/v-p/auth/login',
                    permanent: false,
                },
            };

            break;
        }

        if (response !== undefined && response !== null && response.statusCode !== 200) {
            result = {
                redirect: {
                    destination: '/500',
                    permanent: false,
                },
            };

            break;
        }
    }

    return result;
}
