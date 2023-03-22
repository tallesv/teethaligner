import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Checkbox from '@/components/Form/Checkbox';
import Input from '@/components/Form/Input';
import Layout from '@/components/Layout';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Spinner from '@/components/Spinner';
import api from '@/client/api';
import { auth, firebaseAuth } from '@/config/firebase';

type AddUserFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  admin: boolean;
};

const addUserFormSchema = yup.object().shape({
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
  admin: yup.boolean(),
});

export default function AddUser() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { push } = useRouter();

  const { register, handleSubmit, formState } = useForm<AddUserFormData>({
    resolver: yupResolver(addUserFormSchema),
  });

  const handleLogin: SubmitHandler<AddUserFormData> = async values => {
    try {
      setIsSubmitting(true);
      const firebaseResponse = await createUserWithEmailAndPassword(
        firebaseAuth,
        values.email,
        values.password,
      );
      const response = await api.post('/users', {
        name: values.name,
        email: values.email,
        firebase_id: firebaseResponse.user.uid,
        user_type: values.admin ? 'Admin' : 'Cliente',
      });
      console.log(response);
      push('/add-user');
    } catch (err) {
      console.log(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-screen-sm shadow sm:overflow-hidden sm:rounded-md px-4 py-5">
        <form onSubmit={handleSubmit(handleLogin)}>
          <div className="space-y-4 md:space-y-6">
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

            <div className="flex flex-row-reverse mr-2">
              <Checkbox label="Admin" {...register('admin')} />
            </div>
          </div>

          <button
            type="submit"
            className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent py-3 px-8 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <Spinner hidden={isSubmitting} />
            {isSubmitting ? 'Cadastando' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
