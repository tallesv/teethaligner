import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from 'next';
import { parseCookies } from 'nookies';

export default function withSSRGuest<P extends { [key: string]: unknown }>(
  fn: GetServerSideProps<P>,
) {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    if (cookies['teethaligner.token']) {
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
