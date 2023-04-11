import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Layout from '@/components/Layout';
import Input from '@/components/Form/Input';
import Checkbox from '@/components/Form/Checkbox';
import classNames from '@/utils/bindClassNames';
import FileInput from '@/components/Form/FileInput';
import withSSRAuth from '@/utils/withSSRAuth';
import api from '@/client/api';
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { useState } from 'react';
import Spinner from '@/components/Spinner';
import uploadFile from '@/utils/uploadFile';
import { RadioGroup } from '@headlessui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';

type TransferenciaVirtualFormData = {
  pacient_name: string;
  pacient_email: string;
  address: Address;
  dentes_a_serem_preparados: string[];
  escaneamento_do_arco_superior: FileList;
  escaneamento_do_arco_inferior: FileList;
  escaneamento_do_registro_de_mordida: FileList;
  escaneamento_link: string;
  encaminhei_email: boolean;
};

const transferenciaVirtualFormSchema = yup.object().shape({
  pacient_name: yup.string().required('Por favor insira o nome do paciente'),
  pacient_email: yup.string(),
  address: yup.object().required('Por favor escolha um endereço'),
  dentes_a_serem_preparados: yup
    .array()
    .of(yup.string())
    .min(1, 'Por favor selecione os dentes a serem movimentados.'),
  escaneamento_do_arco_superior: yup
    .mixed<FileList>()
    .test(
      'fileSize',
      'Por favor faça o upload do escaneamento do arco superior',
      value => value && value?.length > 0,
    ),
  escaneamento_do_arco_inferior: yup
    .mixed<FileList>()
    .test(
      'fileSize',
      'Por favor faça o upload do escaneamento do arco inferior',
      value => value && value?.length > 0,
    ),
  escaneamento_do_registro_de_mordida: yup
    .mixed<FileList>()
    .test(
      'fileSize',
      'Por favor faça o upload do escaneamento do registro de mordida',
      value => value && value?.length > 0,
    ),
  escaneamento_link: yup
    .string()
    .required(
      'Por favor insira o link do escaneamento enviado  pelo entro de documentação.',
    ),
  encaminhei_email: yup.boolean(),
});

export default function Setup() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSelected, setAddressSelected] = useState<Address>(
    {} as Address,
  );
  const { userLogged } = useAuth();
  const { push } = useRouter();

  const { register, handleSubmit, formState, setValue, clearErrors } =
    useForm<TransferenciaVirtualFormData>({
      resolver: yupResolver(transferenciaVirtualFormSchema),
    });

  function handleSelectAddress(address: Address) {
    setAddressSelected(address);
    setValue('address', address);
    clearErrors('address');
  }

  async function handleTransferenciaVirtualSubmit(
    data: TransferenciaVirtualFormData,
  ) {
    try {
      setIsSubmitting(true);
      const escaneamentoDoArcoSuperiorUrl = await uploadFile(
        data.escaneamento_do_arco_superior[0],
      );
      const escaneamentoDoArcoInferiorUrl = await uploadFile(
        data.escaneamento_do_arco_inferior[0],
      );
      const escaneamentoDoRegistroDeMordidaUrl = await uploadFile(
        data.escaneamento_do_registro_de_mordida[0],
      );
      await api.post(
        `requests?user_id=${userLogged?.firebase_id}&address_id=${addressSelected.id}`,
        {
          patient_name: data.pacient_name,
          patient_email: data.pacient_email,
          product_name: 'Moldagem de Transferência Virtual',
          status: 'Nova',
          accepted: false,
          fields: JSON.stringify({
            dentes_a_serem_preparados: data.dentes_a_serem_preparados,
            escaneamento_link: data.escaneamento_link,
            encaminhei_email: data.encaminhei_email,
            escaneamento_do_arco_superior: escaneamentoDoArcoSuperiorUrl,
            escaneamento_do_arco_inferior: escaneamentoDoArcoInferiorUrl,
            escaneamento_do_registro_de_mordida:
              escaneamentoDoRegistroDeMordidaUrl,
          }),
        },
      );
      toast.success('Requisição concluída com sucesso.');
      push('/');
    } catch (err) {
      toast.error(
        'Não foi possível completar a requisição, porfavor tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Layout>
      <form
        className="max-w-3xl"
        onSubmit={handleSubmit(handleTransferenciaVirtualSubmit)}
      >
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 sm:col-span-6">
            <Input
              label="Nome do paciente"
              {...register('pacient_name')}
              error={!!formState.errors.pacient_name}
              errorMessage={formState.errors.pacient_name?.message}
            />
          </div>

          <div className="col-span-6 sm:col-span-6">
            <Input
              label="Email do paciente"
              {...register('pacient_email')}
              error={!!formState.errors.pacient_email}
              errorMessage={formState.errors.pacient_email?.message}
            />
          </div>

          <div className="col-span-6">
            <div className="my-2 border-t border-gray-200" />

            <h3 className="font-medium">Endereço</h3>
          </div>

          {userLogged && userLogged.addresses.length > 0 ? (
            <RadioGroup
              value={addressSelected}
              onChange={address => handleSelectAddress(address)}
              className="col-span-6"
            >
              <RadioGroup.Label className="sr-only">
                Escolha um endereço
              </RadioGroup.Label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {userLogged?.addresses.map(address => (
                  <RadioGroup.Option
                    key={address.id}
                    value={address}
                    className={classNames(
                      addressSelected === address
                        ? 'ring-2 ring-blue-500'
                        : 'hover:cursor-pointer',
                      'col-span-1 group relative flex items-center rounded-md border py-3 px-4 text-gray-800 sm:text-sm text-xs font-semibol hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6',
                    )}
                  >
                    <RadioGroup.Label
                      as="span"
                      className="text-sm font-medium text-gray-800"
                    >
                      {`${address.street}, ${address.number}`}
                      <span className="block my-1 text-xs font-medium text-gray-500">
                        {`${address.district}, ${address.state}`}
                        <br />
                        {address.postal_code}
                      </span>
                    </RadioGroup.Label>
                  </RadioGroup.Option>
                ))}
              </div>

              {formState.errors.address && (
                <span className="ml-1 text-sm font-medium text-red-500">
                  {formState.errors.address.message}
                </span>
              )}
            </RadioGroup>
          ) : (
            <span className="col-span-6 ml-1 text-sm font-medium text-red-500">
              Cadastre um endereço no seu{' '}
              <Link href="/profile" className="underline text-blue-600">
                perfil.
              </Link>
            </span>
          )}

          <div className="col-span-6">
            <div className="my-2 border-t border-gray-200" />
          </div>

          <div className="col-span-6">
            <span className="block mb-2 text-sm font-medium text-gray-600">
              Informe quais dentes devem ser preparados para a moldagem de
              transferência virtual:
            </span>

            <img src="/images/teeths.png" alt="teeths" />
            <div className="flex flex-col sm:flex-row sm:space-x-2">
              <div className="flex flex-row items-center space-x-3.5 sm:space-x-4">
                {['18', '17', '16', '15', '14', '13', '12', '11'].map(item => (
                  <Checkbox
                    key={item}
                    id={item}
                    label={item}
                    {...register('dentes_a_serem_preparados')}
                  />
                ))}
              </div>
              <div className="flex flex-row items-center space-x-3 sm:space-x-3.5">
                {['21', '22', '23', '24', '25', '26', '27', '28'].map(item => (
                  <Checkbox
                    key={item}
                    id={item}
                    label={item}
                    {...register('dentes_a_serem_preparados')}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-1">
              <div className="flex flex-row items-center space-x-3 sm:space-x-3.5">
                {['48', '47', '46', '45', '44', '43', '42', '41'].map(item => (
                  <Checkbox
                    key={item}
                    id={item}
                    label={item}
                    {...register('dentes_a_serem_preparados')}
                  />
                ))}
              </div>
              <div className="flex flex-row items-center space-x-3 sm:space-x-3.5">
                {['31', '32', '33', '34', '35', '36', '37', '38'].map(item => (
                  <Checkbox
                    key={item}
                    id={item}
                    label={item}
                    {...register('dentes_a_serem_preparados')}
                  />
                ))}
              </div>
            </div>

            {formState.errors.dentes_a_serem_preparados && (
              <span className="ml-1 text-sm font-medium text-red-500">
                {formState.errors.dentes_a_serem_preparados.message}
              </span>
            )}
          </div>

          <div className="col-span-6">
            <span className="block text-sm font-medium text-gray-600">
              Envio do escaneamento do seu paciente:
            </span>
            <div className="grid grid-row-2 sm:grid-cols-2">
              <div className="my-2">
                <div className="flex flex-row items-center space-x-3 ml-1">
                  <FileInput
                    label="Envio do escaneamento do arco superior:"
                    {...register('escaneamento_do_arco_superior')}
                    error={!!formState.errors.escaneamento_do_arco_superior}
                    errorMessage={
                      formState.errors.escaneamento_do_arco_superior?.message
                    }
                  />
                </div>
              </div>

              <div className="my-2">
                <div className="flex flex-row items-center space-x-3 ml-1">
                  <FileInput
                    label="Envio do escaneamento do arco inferior:"
                    {...register('escaneamento_do_arco_inferior')}
                    error={!!formState.errors.escaneamento_do_arco_inferior}
                    errorMessage={
                      formState.errors.escaneamento_do_arco_inferior?.message
                    }
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-col">
              <div className="my-2">
                <div className="flex flex-row items-center space-x-3 ml-1">
                  <FileInput
                    label="Envio do escaneamento do registro de mordida :"
                    {...register('escaneamento_do_registro_de_mordida')}
                    error={
                      !!formState.errors.escaneamento_do_registro_de_mordida
                    }
                    errorMessage={
                      formState.errors.escaneamento_do_registro_de_mordida
                        ?.message
                    }
                  />
                </div>
              </div>

              <div className="my-2 grid grid-col space-y-3 ml-1">
                <div className="flex flex-row items-center space-x-3">
                  <Input
                    label="Cole aqui o link do escaneamento enviado pelo entro de documentação:"
                    {...register('escaneamento_link')}
                    error={!!formState.errors.escaneamento_link}
                    errorMessage={formState.errors.escaneamento_link?.message}
                  />
                </div>

                <Checkbox
                  label="Encaminhei o email com os arquivos do escaneamento para  alignerteeth@gmail.com"
                  {...register('encaminhei_email')}
                />
              </div>
            </div>
          </div>

          <div className="col-span-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={classNames(
                'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                'mt-10 flex w-full items-center justify-center rounded-md border border-transparent py-3 px-8 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2',
              )}
            >
              <Spinner hidden={isSubmitting} />
              Realizar pedido
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
}

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {},
  };
});
