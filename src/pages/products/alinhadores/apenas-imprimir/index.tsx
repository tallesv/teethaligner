import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Layout from '@/components/Layout';
import Input from '@/components/Form/Input';
import Checkbox from '@/components/Form/Checkbox';
import Radio from '@/components/Form/Radio';
import TextArea from '@/components/Form/Textarea';
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

type ProgramacaoTeethalignerFormData = {
  pacient_name: string;
  pacient_email: string;
  address: Address;
  personalizando_o_planejamento: string;
  escaneamento_do_arco_superior: FileList;
  escaneamento_do_arco_inferior: FileList;
  escaneamento_do_registro_de_mordida: FileList;
  escaneamento_link: string;
  encaminhei_email: boolean;
  logomarca: FileList;
  mensagem_personalizada_embalagem: string;
  caixa: 'Padrão' | 'Premium';
};

const programacaoTeethalignerFormSchema = yup.object().shape({
  pacient_name: yup.string().required('Por favor insira o nome do paciente'),
  pacient_email: yup.string(),
  address: yup.object().required('Por favor escolha um endereço'),
  personalizando_o_planejamento: yup.string(),
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
  logomarca: yup
    .mixed<FileList>()
    .test(
      'fileSize',
      'Por favor faça o upload da logomarca',
      value => value && value?.length > 0,
    ),
  mensagem_personalizada_embalagem: yup
    .string()
    .test(
      'len',
      'A mensagem tem que ter no máximo 20 caracteres',
      value => value?.length === 0 || (!!value && value?.length < 21),
    ),
  caixa: yup.string().required('Por favor escolha o tipo da caixa'),
});

export default function AlinhadoresApenasImprimir() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressSelected, setAddressSelected] = useState<Address>(
    {} as Address,
  );
  const { userLogged } = useAuth();
  const { push } = useRouter();

  const { register, handleSubmit, formState, setValue, clearErrors } =
    useForm<ProgramacaoTeethalignerFormData>({
      resolver: yupResolver(programacaoTeethalignerFormSchema),
    });

  function handleSelectAddress(address: Address) {
    setAddressSelected(address);
    setValue('address', address);
    clearErrors('address');
  }

  async function handleProgramacaoTeethalignerSubmit(
    data: ProgramacaoTeethalignerFormData,
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

      const logomarcarUrl = await uploadFile(data.logomarca[0]);

      await api.post(
        `requests?user_id=${userLogged?.firebase_id}&address_id=${addressSelected.id}`,
        {
          patient_name: data.pacient_name,
          patient_email: data.pacient_email,
          product_name: 'Alinhadores - Apenas imprimir',
          status: 'Nova',
          accepted: false,
          fields: JSON.stringify({
            personalizando_o_planejamento: data.personalizando_o_planejamento,
            escaneamento_link: data.escaneamento_link,
            encaminhei_email: data.encaminhei_email,
            escaneamento_do_arco_superior: escaneamentoDoArcoSuperiorUrl,
            escaneamento_do_arco_inferior: escaneamentoDoArcoInferiorUrl,
            escaneamento_do_registro_de_mordida:
              escaneamentoDoRegistroDeMordidaUrl,
            logomarca: logomarcarUrl,
            mensagem_personalizada_embalagem:
              data.mensagem_personalizada_embalagem,
            caixa: data.caixa,
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
        onSubmit={handleSubmit(handleProgramacaoTeethalignerSubmit)}
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
            <span className="block text-sm font-medium text-gray-600">
              Personalizando o planejamento:
            </span>
            <TextArea
              label="Preencha aqui tudo que deseja no seu tratamento"
              {...register('personalizando_o_planejamento')}
            />
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
            <span className="block text-sm font-medium text-gray-600">
              Vamos personalizar sua embalagem:
            </span>
            <div className="grid grid-row-2 sm:grid-cols-2">
              <div className="my-2">
                <div className="flex flex-row items-center space-x-3 ml-1">
                  <FileInput
                    label="Envio da sua logomarca em formato JPG:"
                    {...register('logomarca')}
                    error={!!formState.errors.logomarca}
                    errorMessage={formState.errors.logomarca?.message}
                  />
                </div>
              </div>

              <div className="my-2">
                <div className="flex flex-row items-center space-x-3 mt-2 ml-1">
                  <Input
                    label="Inserir uma mensagem personalizada a embalagem"
                    {...register('mensagem_personalizada_embalagem')}
                    error={!!formState.errors.mensagem_personalizada_embalagem}
                    errorMessage={
                      formState.errors.mensagem_personalizada_embalagem?.message
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-6">
            <div className="grid grid-row-2  sm:grid-cols-2">
              <div className="mb-2">
                <span className="block mb-2 text-sm font-medium text-gray-600">
                  Caixa:
                </span>
                <div className="flex flex-row items-center space-x-3 ml-1">
                  <Radio
                    id="manter"
                    label="Padrão"
                    {...register('caixa')}
                    error={!!formState.errors.caixa}
                  />
                  <Radio
                    id="corrigir"
                    label="Premium (R$ 25,00)"
                    {...register('caixa')}
                    error={!!formState.errors.caixa}
                  />
                </div>

                {formState.errors.caixa && (
                  <span className="ml-1 text-sm font-medium text-red-500">
                    {formState.errors.caixa.message}
                  </span>
                )}
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
