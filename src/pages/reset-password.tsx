/* eslint-disable camelcase */
import { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useRouter } from 'next/router';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { toast } from 'react-toastify';
import { auth } from '@/config/firebase';
import Spinner from '../components/Spinner';
import Input from '../components/Form/Input';

type ResetPasswordFormData = {
  password: string;
  password_confirmation: string;
};

const resetPasswordFormSchema = yup.object().shape({
  password: yup
    .string()
    .required('Por favor insira uma senha.')
    .min(6, 'A senha deve ter no mínimo 6 caracteres'),
  password_confirmation: yup
    .string()
    .required('Por favor insira a confirmação da senha.')
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .equals([yup.ref('password')], 'As senhas precisam ser iguais.'),
});

interface ResetPasswordProps {
  code: string;
}

export default function ResetPassword({ code }: ResetPasswordProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { push } = useRouter();

  const { register, handleSubmit, formState } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordFormSchema),
  });

  const handleLogin: SubmitHandler<ResetPasswordFormData> = async ({
    password,
  }) => {
    try {
      setIsSubmitting(true);
      await auth.confirmPasswordReset(code, password);
      toast.success('Senha alterada.');
      push('/');
    } catch (err) {
      toast.error(
        'Ocorreu um erro ao alterar a senha, por favor tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    async function verifyCode() {
      try {
        await auth.verifyPasswordResetCode(code);
      } catch (err) {
        toast.error('O link para resetar a senha expirou!');
        push('/login');
      }
    }
    verifyCode();
  }, [code, push]);

  return (
    <div className="flex min-h-full items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Teeth Aligner | Resetar senha</title>
      </Head>
      <div className="w-full max-w-md space-y-8 m-auto">
        <div>
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=blue&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Teeth Aligner
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleLogin)}>
          <div className="flex flex-col space-y-2">
            {!!formState.errors.password && (
              <span className="ml-1 text-red-500 text-sm">
                {formState.errors.password.message}
              </span>
            )}
            <div className="-space-y-px rounded-md">
              <div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Nova Senha"
                  styleProps="rounded-none rounded-t-md"
                  error={!!formState.errors.password}
                  {...register('password')}
                />
              </div>
              <div>
                <Input
                  id="password_confirmation"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Confirmação de senha"
                  styleProps="rounded-none rounded-b-md"
                  error={!!formState.errors.password_confirmation}
                  {...register('password_confirmation')}
                />
              </div>
            </div>
            {!!formState.errors.password_confirmation && (
              <span className="ml-1 text-red-500 text-sm">
                {formState.errors.password_confirmation.message}
              </span>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Spinner hidden={isSubmitting} />
              {isSubmitting ? 'Alterando' : 'Alterar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { oobCode },
}) => {
  const code = Array.isArray(oobCode) ? oobCode[0] : oobCode;

  return {
    props: {
      code,
    },
  };
};
