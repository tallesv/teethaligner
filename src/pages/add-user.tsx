/* eslint-disable @typescript-eslint/no-explicit-any */
import { createUserWithEmailAndPassword } from 'firebase/auth';
import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Checkbox from '@/components/Form/Checkbox';
import Input from '@/components/Form/Input';
import Layout from '@/components/Layout';
import { useState } from 'react';
import Spinner from '@/components/Spinner';
import api from '@/client/api';
import { firebaseAuth } from '@/config/firebase';
import withSSRAuth from '@/utils/withSSRAuth';
import { toast } from 'react-toastify';
import cepPromise from 'cep-promise';
import states from '@/utils/states';
import Select from '@/components/Form/Select';

type AddUserFormData = {
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  admin: boolean;
  postal_code: string;
  state: string;
  district: string;
  street: string;
  number: string;
  complement: string;
};

const addUserFormSchema = yup.object().shape({
  name: yup.string().required('Por favor insira um Nome'),
  email: yup
    .string()
    .required('Por favor insira um E-mail')
    .email('E-mail inválido'),
  phone: yup.string(),
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
  postal_code: yup.string().required('Por favor insira o seu CEP'),
  state: yup.string().required('Por favor selecione o seu Estado'),
  district: yup.string().required('Por favor insira a sua Cidade'),
  street: yup.string().required('Por favor insira a sua Rua'),
  number: yup.string(),
  complement: yup.string(),
});

export default function AddUser() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState, setValue, reset, clearErrors } =
    useForm<AddUserFormData>({
      resolver: yupResolver(addUserFormSchema),
    });

  async function handleFillAddress(cep: string) {
    if (cep && (cep.length === 8 || cep.length === 9)) {
      const formatedCep = cep.replace(/-/g, '');
      const { state, city, street } = await cepPromise(formatedCep);

      setValue(
        'state',
        String(states.find(item => item.abbreviation === state)?.value),
      );
      setValue('district', city);
      setValue('street', street);
      clearErrors();
    }
  }

  const handleAddUser: SubmitHandler<AddUserFormData> = async values => {
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
        phone: values.phone,
        firebase_id: firebaseResponse.user.uid,
        user_type: values.admin ? 'Admin' : 'Cliente',
      });

      await api.post(`/addresses?user_id=${firebaseResponse.user.uid}`, {
        postal_code: values.postal_code,
        state: values.state,
        district: values.district,
        street: values.street,
        number: values.number,
        complement: values.complement,
      });

      toast.success('Usuário cadastrado com sucesso.');
      reset();
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
    <Layout>
      <div className="max-w-screen-lg shadow sm:overflow-hidden sm:rounded-md px-4 py-5">
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(handleAddUser)}>
          <div className="grid grid-cols-6 gap-4 ">
            <div className="col-span-6 sm:col-span-4">
              <Input
                label="Nome"
                {...register('name')}
                error={!!formState.errors.name}
                errorMessage={formState.errors.name?.message}
              />
            </div>

            <div className="col-span-6 sm:col-span-4">
              <Input
                type="email"
                label="Email"
                {...register('email')}
                error={!!formState.errors.email}
                errorMessage={formState.errors.email?.message}
              />
            </div>

            <div className="col-span-6 sm:col-span-2">
              <Input
                label="Telefone"
                {...register('phone')}
                error={!!formState.errors.phone}
                errorMessage={formState.errors.phone?.message}
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <Input
                type="password"
                label="Senha"
                {...register('password')}
                error={!!formState.errors.password}
                errorMessage={formState.errors.password?.message}
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <Input
                type="password"
                label="Confirmação de senha"
                {...register('password_confirmation')}
                error={!!formState.errors.password_confirmation}
                errorMessage={formState.errors.password_confirmation?.message}
              />
            </div>

            <div className="col-span-6 flex flex-row-reverse mr-2">
              <Checkbox label="Admin" {...register('admin')} />
            </div>

            <div className="col-span-6 sm:col-span-1">
              <Input
                label="Cep"
                {...register('postal_code')}
                onChange={e => handleFillAddress(e.target.value)}
                error={!!formState.errors.postal_code}
                errorMessage={formState.errors.postal_code?.message}
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <Select
                id="test"
                label="Estado"
                options={states}
                {...register('state')}
                error={!!formState.errors.state}
                errorMessage={formState.errors.state?.message}
              />
            </div>

            <div className="col-span-6 sm:col-span-2">
              <Input
                label="Cidade"
                {...register('district')}
                error={!!formState.errors.district}
                errorMessage={formState.errors.district?.message}
              />
            </div>

            <div className="col-span-6 sm:col-span-5">
              <Input
                label="Rua"
                {...register('street')}
                error={!!formState.errors.street}
                errorMessage={formState.errors.street?.message}
              />
            </div>

            <div className="col-span-6 sm:col-span-1">
              <Input
                label="Número"
                {...register('number')}
                error={!!formState.errors.number}
                errorMessage={formState.errors.number?.message}
              />
            </div>

            <div className="col-span-6 sm:col-span-6">
              <Input
                label="Complemento"
                {...register('complement')}
                error={!!formState.errors.complement}
                errorMessage={formState.errors.complement?.message}
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent py-3 px-8 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <Spinner hidden={!isSubmitting} />
            {isSubmitting ? 'Cadastrando' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {},
  };
});
