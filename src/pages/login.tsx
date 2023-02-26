import Link from 'next/link';
import { useState } from 'react';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InformationCircleIcon } from '@heroicons/react/20/solid';

import { useRouter } from 'next/router';
import Spinner from '../components/UI/Spinner';
import Input from '../components/UI/Input';

type LoginFormData = {
  email: string;
  password: string;
};

const loginFormSchema = yup.object().shape({
  email: yup
    .string()
    .required('Por favor insira um E-mail')
    .email('E-mail inválido'),
  password: yup.string().required('Por favor insira uma senha.'),
});

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const { push } = useRouter();

  const { register, handleSubmit, formState } = useForm<LoginFormData>({
    resolver: yupResolver(loginFormSchema),
  });

  const handleLogin: SubmitHandler<LoginFormData> = async values => {
    try {
      setLoginError(false);
      setIsSubmitting(true);
      push('/');
    } catch (err) {
      setTimeout(() => {
        setLoginError(true);
      }, 2000);
      setLoginError(true);
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
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

        {loginError && (
          <div className="flex justify-center p-0.5 rounded-md">
            <InformationCircleIcon className="h-6 w-6 text-red-500" />
            <span className="ml-1 text-red-500">
              Combinação de email e senha incorreta.
            </span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleLogin)}>
          <div className="flex flex-col space-y-2">
            {!!formState.errors.email && (
              <span className="ml-1 text-red-500 text-sm">
                Por favor insira um E-mail
              </span>
            )}
            <div className="-space-y-px rounded-md">
              <div>
                <Input
                  id="email-address"
                  type="email"
                  autoComplete="email"
                  placeholder="Email"
                  styleProps="rounded-none rounded-t-md"
                  error={!!formState.errors.email}
                  {...register('email')}
                />
              </div>
              <div>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Senha"
                  styleProps="rounded-none rounded-b-md"
                  error={!!formState.errors.password}
                  {...register('password')}
                />
              </div>
            </div>
            {!!formState.errors.password && (
              <span className="ml-1 text-red-500 text-sm">
                Por favor insira uma Senha
              </span>
            )}
          </div>

          <div className="flex justify-end">
            <div className="text-sm mr-2">
              <Link href="/forgot-password">
                <span className="font-medium text-blue-600 hover:text-blue-500 ">
                  Esqueceu a sua senha?
                </span>
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Spinner hidden={isSubmitting} />
              {isSubmitting ? 'Entrando' : 'Entrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
