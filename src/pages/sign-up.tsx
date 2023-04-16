import { useState } from 'react';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { useRouter } from 'next/router';
import withSSRGuest from '@/utils/withSSRGuest';
import { firebaseAuth } from '@/config/firebase';
import Head from 'next/head';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import api from '@/client/api';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import Input from '../components/Form/Input';

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

const signUpFormSchema = yup.object().shape({
  name: yup.string().required('Por favor insira um Nome'),
  email: yup
    .string()
    .required('Por favor insira um E-mail')
    .email('E-mail inválido'),
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

export default function SignUp() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { push } = useRouter();

  const { register, handleSubmit, formState } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpFormSchema),
  });

  const handleSignUp: SubmitHandler<SignUpFormData> = async values => {
    try {
      setIsSubmitting(true);
      const firebaseResponse = await createUserWithEmailAndPassword(
        firebaseAuth,
        values.email,
        values.password,
      );
      await api.post('/users', {
        name: values.name,
        email: values.email,
        firebase_id: firebaseResponse.user.uid,
        user_type: 'Cliente',
      });
      toast.success('Usuário cadastrado com sucesso.');
      push('/login');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        toast.error('já existe uma conta cadastrada com esse email.');
      } else {
        toast.error(
          'Ocorreu um erro ao tentar cadastrar o usuário, por favor tente novamente.',
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-full items-center justify-center py-24 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Teeth Aligner | Sign Up</title>
      </Head>
      <div className="w-full max-w-md space-y-8 m-auto">
        <div>
          <img
            className="mx-auto  w-auto"
            src="images/logo.png"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-semibold tracking-tight text-gray-700">
            Faça o seu cadastro
          </h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleSignUp)}>
          <div className="space-y-2 md:space-y-4">
            <Input
              label="Nome"
              {...register('name')}
              error={!!formState.errors.name}
              errorMessage={formState.errors.name?.message}
            />

            <Input
              type="email"
              label="Email"
              {...register('email')}
              error={!!formState.errors.email}
              errorMessage={formState.errors.email?.message}
            />

            <Input
              type="password"
              label="Senha"
              {...register('password')}
              error={!!formState.errors.password}
              errorMessage={formState.errors.password?.message}
            />

            <Input
              type="password"
              label="Confirmação de senha"
              {...register('password_confirmation')}
              error={!!formState.errors.password_confirmation}
              errorMessage={formState.errors.password_confirmation?.message}
            />
          </div>

          <button
            type="submit"
            className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent py-3 px-8 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <Spinner hidden={isSubmitting} />
            {isSubmitting ? 'Cadastrando' : 'Cadastrar'}
          </button>
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
