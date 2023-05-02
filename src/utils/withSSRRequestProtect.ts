import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { parseCookies } from 'nookies';
import getApiClient from '@/client/apiClient';

export default function withSSRRequestProtect<
  P extends { [key: string]: unknown },
>(fn: GetServerSideProps<P>) {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);
    const { id } = ctx.query;
    const userFirebaseId = cookies['teethaligner.user-firebase-id'];
    const token = cookies['teethaligner.token'];

    if (!token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    try {
      const { data: user } = await getApiClient().get(
        `users/${userFirebaseId}`,
      );

      const { data: request } = await getApiClient().get(`requests/${id}`);

      if (user.user_type !== 'Admin' && request.user_id !== user.id) {
        return {
          redirect: {
            destination: '/',
            permanent: false,
          },
        };
      }
    } catch (err) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return fn(ctx);
  };
}
