/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useRouter } from 'next/router';
import withSSRGuest from '@/utils/withSSRGuest';
import { auth } from '@/config/firebase';
import { toast } from 'react-toastify';
import Head from 'next/head';
import Spinner from '../components/Spinner';
import Input from '../components/Form/Input';

type ForgotPasswordFormData = {
  email: string;
};

const forgotPasswordFormSchema = yup.object().shape({
  email: yup
    .string()
    .required('Por favor insira um E-mail')
    .email('E-mail inválido'),
});

export default function ForgotPassword() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { push } = useRouter();

  const { register, handleSubmit, formState } = useForm<ForgotPasswordFormData>(
    {
      resolver: yupResolver(forgotPasswordFormSchema),
    },
  );
  const handleLogin: SubmitHandler<ForgotPasswordFormData> = async ({
    email,
  }) => {
    try {
      setIsSubmitting(true);
      await auth.sendPasswordResetEmail(email);
      toast.success('Email enviado.');
      push('/');
    } catch (err: any) {
      if (err.code === `auth/user-not-found`) {
        toast.error('Email não cadastrado.');
      } else {
        toast.error(
          'Ocorreu um erro ao enviar o email, por favor tente novamente.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Teeth Aligner | Esqueci a senha</title>
      </Head>
      <div className="w-full max-w-md space-y-6 m-auto">
        <div>
          <img
            className="mx-auto  w-auto"
            src="images/logo.png"
            alt="Your Company"
          />

          <p className="mt-2 text-center text-sm text-gray-600">
            Insira o seu email e iremos enviar um email para você resetar a sua
            senha.
          </p>
        </div>

        <form className=" space-y-6" onSubmit={handleSubmit(handleLogin)}>
          <div className="flex flex-col space-y-2">
            {!!formState.errors.email && (
              <span className="ml-1 text-red-500 text-sm">
                {formState.errors.email.message}
              </span>
            )}
            <div className="-space-y-px rounded-md">
              <div>
                <Input
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  styleProps=" rounded-t-md"
                  error={!!formState.errors.email}
                  {...register('email')}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Spinner hidden={!isSubmitting} />
              {isSubmitting ? 'Enviando' : 'Enviar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export const getServerSideProps = withSSRGuest(async () => {
  return {
    props: {},
  };
});
