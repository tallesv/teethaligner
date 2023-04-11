/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable camelcase */
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/20/solid';
import { Menu, Transition } from '@headlessui/react';

import Input from '@/components/Form/Input';
import Select from '@/components/Form/Select';
import Layout from '@/components/Layout';
import DefaultAvatar from '@/utils/defaultAvatar';
import api from '@/client/api';
import withSSRAuth from '@/utils/withSSRAuth';
import useAuth from '@/hooks/useAuth';
import Spinner from '@/components/Spinner';
import { ChangeEvent, Fragment, useEffect, useState } from 'react';
import uploadFile from '@/utils/uploadFile';
import { toast } from 'react-toastify';
import deleteFile from '@/utils/deleteFile';

type ProfileFormData = {
  avatar: string | File | null;
  name: string;
};

const profileFormSchema = yup.object().shape({
  avatar: yup.mixed<File>(),
  name: yup.string().required('Por favor insira um Nome.'),
  postal_code: yup.string(),
  state: yup.string(),
  district: yup.string(),
  street: yup.string(),
  number: yup.string(),
  complement: yup.string(),
});

type AddressFormData = {
  postal_code: string;
  state: string;
  district: string;
  street: string;
  number: string;
  complement: string;
};

const addressFormSchema = yup.object().shape({
  postal_code: yup.string().required('Por favor insira o cep.'),
  state: yup.string().required('Por favor selecione um estado.'),
  district: yup.string().required('Por favor insira a cidade.'),
  street: yup.string().required('Por favor insira a rua.'),
  number: yup.string().required('Por favor insira o número da rua.'),
  complement: yup.string().required('Por favor insira o complemento.'),
});

export default function Profile() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>();
  const { userLogged, fetchUser } = useAuth();

  const {
    register: profileRegister,
    handleSubmit: profileHandleSubmit,
    formState: profileFormState,
    setValue: profileSetValue,
    reset: profileReset,
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileFormSchema),
  });

  const {
    register: addressRegister,
    handleSubmit: addressHandleSubmit,
    formState: addressFormState,
    reset: addressReset,
  } = useForm<AddressFormData>({
    resolver: yupResolver(addressFormSchema),
  });

  function handleUploadAvatar(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;

    if (e.target.files[0]) {
      const urlPreview = URL.createObjectURL(e.target.files[0]);
      setAvatarPreview(urlPreview);
      profileSetValue('avatar', e.target.files[0]);
    }
  }

  async function handleEditProfileSubmit(data: ProfileFormData) {
    try {
      setIsSubmitting(true);
      const { avatar, name } = data;

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

      toast.success('Dados do perfil alterados com sucesso!');
      fetchUser();
    } catch (err) {
      toast.error(
        'Não foi possível salvar os dados, porfavor tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleAddAddressSubmit(data: AddressFormData) {
    try {
      setIsSubmitting(true);

      await api.post(`/addresses?user_id=${userLogged?.firebase_id}`, {
        ...data,
      });

      toast.success('Endereço adicionado com sucesso!');
      fetchUser();
      addressReset();
    } catch (err) {
      toast.error(
        'Não foi possível adicionar o endereço, por favor tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteAddress(id: number) {
    try {
      await api.delete(`/addresses/${id}`);

      toast.success('Endereço removido!');
      fetchUser();
    } catch (err) {
      toast.error(
        'Não foi possível remover o endereço, por favor tente novamente.',
      );
    }
  }

  useEffect(() => {
    profileReset({ ...userLogged });
  }, [profileReset, userLogged]);

  return (
    <Layout>
      <div className="grid sm:grid-cols-7 sm:space-x-10">
        <div className="col-span-3">
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={profileHandleSubmit(handleEditProfileSubmit)}>
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
                        {...profileRegister('name')}
                        error={!!profileFormState.errors.name}
                        errorMessage={profileFormState.errors.name?.message}
                      />
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

        <div className="col-span-4">
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form onSubmit={addressHandleSubmit(handleAddAddressSubmit)}>
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="mb-4 font-medium">Endereços</h3>

                  <div className="flex flex-col mb-10 space-y-4">
                    {userLogged?.addresses.map(address => (
                      <div
                        key={address.id}
                        className="group relative flex items-center rounded-md border py-2 px-4 text-gray-800 sm:text-sm text-xs font-semibol hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-4"
                      >
                        <div className="flex justify-between w-full">
                          <span className="text-sm font-medium text-gray-800">
                            {`${address.street}, ${address.number}`}
                            <span className="block my-1 text-xs font-medium text-gray-500">
                              {`${address.district}, ${address.state}`}
                              <br />
                              {address.postal_code}
                            </span>
                          </span>
                          <Menu
                            as="div"
                            className="relative inline-block text-left"
                          >
                            <Menu.Button>
                              <EllipsisVerticalIcon className="h-5" />
                            </Menu.Button>

                            <Transition
                              as={Fragment}
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="px-1 py-1 ">
                                  <Menu.Item>
                                    {({ active }) => (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleDeleteAddress(address.id)
                                        }
                                        className={`${
                                          active
                                            ? 'bg-gray-100'
                                            : 'text-gray-900'
                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                      >
                                        <TrashIcon
                                          className="mr-2 h-5 w-5 text-red-500"
                                          aria-hidden="true"
                                        />
                                        Deletar
                                      </button>
                                    )}
                                  </Menu.Item>
                                </div>
                              </Menu.Items>
                            </Transition>
                          </Menu>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-6 gap-6">
                    <div className="col-span-6 sm:col-span-3 lg:col-span-2">
                      <Input
                        label="Cep"
                        {...addressRegister('postal_code')}
                        error={!!addressFormState.errors.postal_code}
                        errorMessage={
                          addressFormState.errors.postal_code?.message
                        }
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-3 lg:col-span-4">
                      <Select
                        id="test"
                        label="Estado"
                        options={[
                          { label: 'Rio Grande do Norte', value: 'RN' },
                        ]}
                        {...addressRegister('state')}
                        error={!!addressFormState.errors.state}
                        errorMessage={addressFormState.errors.state?.message}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-6">
                      <Input
                        label="Cidade"
                        {...addressRegister('district')}
                        error={!!addressFormState.errors.district}
                        errorMessage={addressFormState.errors.district?.message}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-4 lg:col-span-5">
                      <Input
                        label="Rua"
                        {...addressRegister('street')}
                        error={!!addressFormState.errors.street}
                        errorMessage={addressFormState.errors.street?.message}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-2 lg:col-span-1">
                      <Input
                        label="Número"
                        {...addressRegister('number')}
                        error={!!addressFormState.errors.number}
                        errorMessage={addressFormState.errors.number?.message}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-6 lg:col-span-6">
                      <Input
                        label="Complemento"
                        {...addressRegister('complement')}
                        error={!!addressFormState.errors.complement}
                        errorMessage={
                          addressFormState.errors.complement?.message
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center bg-gray-50 px-4 py-3 sm:px-6">
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center rounded-md border border-transparent py-3 px-8 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  >
                    <Spinner hidden={isSubmitting} />
                    {isSubmitting
                      ? 'Adicionando endereço'
                      : 'Adicionar endereço'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {},
  };
});
