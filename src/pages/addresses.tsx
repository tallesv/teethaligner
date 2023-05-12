import Layout from '@/components/Layout';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import withSSRAuth from '@/utils/withSSRAuth';
import { Menu, Transition } from '@headlessui/react';
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/20/solid';
import useAuth from '@/hooks/useAuth';
import { Fragment, useState } from 'react';
import { toast } from 'react-toastify';
import api from '@/client/api';
import Input from '@/components/Form/Input';
import states from '@/utils/states';
import Select from '@/components/Form/Select';
import cepPromise from 'cep-promise';
import Spinner from '@/components/Spinner';

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
  complement: yup.string(),
});

export default function Addresses() {
  const { userLogged, fetchUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, formState, reset, setValue, clearErrors } =
    useForm<AddressFormData>({
      resolver: yupResolver(addressFormSchema),
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

  async function handleAddAddressSubmit(data: AddressFormData) {
    try {
      setIsSubmitting(true);

      await api.post(`/addresses?user_id=${userLogged?.firebase_id}`, {
        ...data,
      });

      toast.success('Endereço adicionado com sucesso!');
      fetchUser();
      reset();
    } catch (err) {
      toast.error(
        'Não foi possível adicionar o endereço, por favor tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h3 className="mb-4 font-medium">Adicionar endereço</h3>
        <form onSubmit={handleSubmit(handleAddAddressSubmit)}>
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3 lg:col-span-2">
              <Input
                label="Cep"
                {...register('postal_code')}
                onChange={e => handleFillAddress(e.target.value)}
                error={!!formState.errors.postal_code}
                errorMessage={formState.errors.postal_code?.message}
              />
            </div>

            <div className="col-span-6 sm:col-span-3 lg:col-span-4">
              <Select
                id="test"
                label="Estado"
                options={states}
                {...register('state')}
                error={!!formState.errors.state}
                errorMessage={formState.errors.state?.message}
              />
            </div>

            <div className="col-span-6 sm:col-span-6 lg:col-span-6">
              <Input
                label="Cidade"
                {...register('district')}
                error={!!formState.errors.district}
                errorMessage={formState.errors.district?.message}
              />
            </div>

            <div className="col-span-6 sm:col-span-4 lg:col-span-5">
              <Input
                label="Rua"
                {...register('street')}
                error={!!formState.errors.street}
                errorMessage={formState.errors.street?.message}
              />
            </div>

            <div className="col-span-6 sm:col-span-2 lg:col-span-1">
              <Input
                label="Número"
                {...register('number')}
                error={!!formState.errors.number}
                errorMessage={formState.errors.number?.message}
              />
            </div>

            <div className="col-span-6 sm:col-span-6 lg:col-span-6">
              <Input
                label="Complemento"
                {...register('complement')}
                error={!!formState.errors.complement}
                errorMessage={formState.errors.complement?.message}
              />
            </div>

            <div className="col-span-6">
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md border border-transparent py-3 px-8 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  <Spinner hidden={!isSubmitting} />
                  {isSubmitting ? 'Adicionando endereço' : 'Adicionar endereço'}
                </button>
              </div>
            </div>
          </div>
        </form>
        <div className="mt-4">
          <h3 className="mb-4 font-medium">Listagem de endereços</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {userLogged?.addresses.map(address => (
              <div
                key={address.id}
                className="group relative flex items-center rounded-md border py-2 px-4 text-gray-800 sm:text-sm text-xs font-semibol hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-4"
              >
                <div className="flex justify-between w-full">
                  <span className="text-sm font-medium text-gray-800">
                    {`${address.street}${
                      address.number ? `, ${address.number}` : ''
                    }`}
                    <span className="block my-1 text-xs font-medium text-gray-500">
                      {`${address.district}, ${address.state}`}
                      <br />
                      {address.postal_code}
                    </span>
                  </span>
                  <Menu as="div" className="relative inline-block text-left">
                    <Menu.Button className="hover:bg-gray-100 rounded-md py-0.5">
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
                                onClick={() => handleDeleteAddress(address.id)}
                                className={`${
                                  active ? 'bg-gray-100' : 'text-gray-900'
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
