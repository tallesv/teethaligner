/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable camelcase */
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Input from '@/components/Form/Input';
import Select from '@/components/Form/Select';
import Layout from '@/components/Layout';
import DefaultAvatar from '@/utils/defaultAvatar';
import api from '@/client/api';
import withSSRAuth from '@/utils/withSSRAuth';
import useAuth from '@/hooks/useAuth';
import Spinner from '@/components/Spinner';
import { ChangeEvent, useEffect, useState } from 'react';
import uploadFile from '@/utils/uploadFile';
import { toast } from 'react-toastify';
import deleteFile from '@/utils/deleteFile';

type ProfileFormData = {
  avatar: string | File | null;
  name: string;
  postal_code: string;
  state: string;
  district: string;
  street: string;
  number: string;
};

const profileFormSchema = yup.object().shape({
  avatar: yup.mixed<File>(),
  name: yup.string().required('Por favor insira um Nome'),
  postal_code: yup.string(),
  state: yup.string(),
  district: yup.string(),
  street: yup.string(),
  number: yup.string(),
});

export default function Profile() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const { userLogged, fetchUser } = useAuth();

  const { register, handleSubmit, formState, setValue, reset } =
    useForm<ProfileFormData>({
      resolver: yupResolver(profileFormSchema),
    });

  function handleUploadAvatar(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    if (e.target.files[0]) {
      const urlPreview = URL.createObjectURL(e.target.files[0]);
      setAvatarPreview(urlPreview);
      setValue('avatar', e.target.files[0]);
    }
  }
  console.log(userLogged);
  async function handleEditProfileSubmit(data: ProfileFormData) {
    try {
      setIsSubmitting(true);
      const { avatar, postal_code, name, state, street, number, district } =
        data;

      if (avatarPreview && userLogged?.avatar) {
        await deleteFile(userLogged.avatar);
      }

      const avatarUrl = !avatarPreview
        ? avatar
        : await uploadFile(avatar as File);

      await api.put(`/users/${userLogged?.firebase_id}`, {
        name,
        avatar: avatarUrl,
      });

      if (userLogged && userLogged?.addresses.length > 0) {
        await api.put(`/addresses/${userLogged?.addresses[0].id}`, {
          postal_code,
          state,
          district,
          street,
          number,
        });
      } else {
        await api.post(`/addresses?user_id=${userLogged?.firebase_id}`, {
          postal_code,
          state,
          district,
          street,
          number,
        });
      }

      toast.success('Dados do perfil alterados com sucesso!');
      fetchUser();
    } catch (err) {
      toast.error('Não foi possível salvar os dados, porfavor tente novamente');
    } finally {
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    reset({ ...userLogged, ...userLogged?.addresses[0] });
  }, [reset, userLogged]);

  return (
    <Layout>
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={handleSubmit(handleEditProfileSubmit)}>
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-center space-y-7">
                    <div>
                      <span className="block text-sm font-medium leading-6 text-gray-900">
                        Foto do usuário
                      </span>
                      <div className="mt-2 flex items-center">
                        {userLogged?.avatar ? (
                          <img
                            className="h-8 w-8 rounded-full"
                            src={avatarPreview ?? userLogged.avatar}
                            alt=""
                          />
                        ) : (
                          <DefaultAvatar />
                        )}

                        <div className="flex items-center justify-center bg-grey-lighter">
                          <label className="ml-5 cursor-pointer rounded-md border border-gray-300 bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50">
                            <span className="">Alterar</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={handleUploadAvatar}
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="ml-5 h-10 rounded-md border border-gray-300 bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                    >
                      Alterar senha
                    </button>
                  </div>
                </div>

                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6">
                      <Input
                        label="Nome"
                        {...register('name')}
                        error={!!formState.errors.name}
                        errorMessage={formState.errors.name?.message}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <Input label="Cep" {...register('postal_code')} />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-4">
                      <Select
                        id="test"
                        label="Estado"
                        options={[
                          { label: 'Rio Grande do Norte', value: 'RN' },
                        ]}
                        {...register('state')}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-3">
                      <Input label="Cidade" {...register('district')} />
                    </div>

                    <div className="col-span-6 sm:col-span-4 lg:col-span-5">
                      <Input label="Rua" {...register('street')} />
                    </div>

                    <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                      <Input label="Número" {...register('number')} />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center bg-gray-50 px-4 py-3 sm:px-6">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-md border border-transparent py-3 px-8 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    <Spinner hidden={isSubmitting} />
                    {isSubmitting ? 'Salvando' : 'Salvar'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-base font-semibold leading-6 text-gray-900">
                Personal Information
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Use a permanent address where you can receive mail.
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form action="#" method="POST">
              <div className="overflow-hidden shadow sm:rounded-md">
                <div className="bg-white px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="first-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        First name
                      </label>
                      <input
                        type="text"
                        name="first-name"
                        id="first-name"
                        autoComplete="given-name"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="last-name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Last name
                      </label>
                      <input
                        type="text"
                        name="last-name"
                        id="last-name"
                        autoComplete="family-name"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4">
                      <label
                        htmlFor="email-address"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email address
                      </label>
                      <input
                        type="text"
                        name="email-address"
                        id="email-address"
                        autoComplete="email"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Country
                      </label>
                      <select
                        id="country"
                        name="country"
                        autoComplete="country-name"
                        className="mt-2 block w-full rounded-md border-0 bg-white py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      >
                        <option>United States</option>
                        <option>Canada</option>
                        <option>Mexico</option>
                      </select>
                    </div>

                    <div className="col-span-6">
                      <label
                        htmlFor="street-address"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Street address
                      </label>
                      <input
                        type="text"
                        name="street-address"
                        id="street-address"
                        autoComplete="street-address"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-2">
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        autoComplete="address-level2"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="region"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        State / Province
                      </label>
                      <input
                        type="text"
                        name="region"
                        id="region"
                        autoComplete="address-level1"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <label
                        htmlFor="postal-code"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        ZIP / Postal code
                      </label>
                      <input
                        type="text"
                        name="postal-code"
                        id="postal-code"
                        autoComplete="postal-code"
                        className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div> */}
    </Layout>
  );
}

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {},
  };
});
