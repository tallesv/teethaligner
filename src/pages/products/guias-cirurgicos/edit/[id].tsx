import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Layout from '@/components/Layout';
import Input from '@/components/Form/Input';
import Checkbox from '@/components/Form/Checkbox';
import classNames from '@/utils/bindClassNames';
import api from '@/client/api';
import useAuth from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { useState } from 'react';
import Spinner from '@/components/Spinner';
import uploadFile from '@/utils/uploadFile';
import { RadioGroup } from '@headlessui/react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import DisplayFile from '@/components/Form/DisplayFile';
import UploadFileButton from '@/components/Form/UploadFileButton';
import { useQuery } from 'react-query';
import deleteFile from '@/utils/deleteFile';
import withSSRRequestProtect from '@/utils/withSSRRequestProtect';

type GuiasCirurgicoFormData = {
  patient_name: string;
  address: Address;
  escaneamento_do_arco_superior: File[];
  escaneamento_do_arco_inferior: File[];
  escaneamento_do_registro_de_mordida: File[];
  escaneamento_link: string;
  encaminhei_email: boolean;
};

export default function EditGuiaCirurgico() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addressSelected, setAddressSelected] = useState<Address>(
    {} as Address,
  );
  const [escaneamentoDoArcoSuperior, setEscaneamentoDoArcoSuperior] = useState<
    string[]
  >([]);
  const [
    removedEscaneamentoDoArcoSuperior,
    setRemovedEscaneamentoDoArcoSuperior,
  ] = useState<string[]>([]);

  const [escaneamentoDoArcoInferior, setEscaneamentoDoArcoInferior] = useState<
    string[]
  >([]);
  const [
    removedEscaneamentoDoArcoInferior,
    setRemovedEscaneamentoDoArcoInferior,
  ] = useState<string[]>([]);

  const [escaneamentoDoRegistroDeMordida, setEscaneamentoDoRegistroDeMordida] =
    useState<string[]>([]);

  const [
    removedEscaneamentoDoRegistroDeMordida,
    setRemovedEscaneamentoDoRegistroDeMordida,
  ] = useState<string[]>([]);

  const { userLogged } = useAuth();
  const { push, query } = useRouter();

  const caseId = query.id as string;

  const guiasCirurgicoFormSchema = yup.object().shape({
    patient_name: yup.string().required('Por favor insira o nome do paciente'),
    address: yup.object().required('Por favor escolha um endereço'),
    escaneamento_do_arco_superior: yup
      .array()
      .of(yup.mixed<File>())
      .test(
        'Required',
        'Por favor faça o upload do escaneamento do arco superior',
        (value, ctx) => {
          const hasArcoSuperiorAndInferior =
            ((value && value?.length > 0) ||
              escaneamentoDoArcoSuperior.length > 0) &&
            (ctx.parent.escaneamento_do_arco_inferior.length > 0 ||
              escaneamentoDoArcoInferior.length > 0);
          const hasRegistroDeMordida =
            ctx.parent.escaneamento_do_registro_de_mordida.length > 0 ||
            escaneamentoDoRegistroDeMordida.length > 0;
          return (
            hasArcoSuperiorAndInferior ||
            hasRegistroDeMordida ||
            ctx.parent.escaneamento_link ||
            ctx.parent.encaminhei_email
          );
        },
      ),
    escaneamento_do_arco_inferior: yup
      .array()
      .of(yup.mixed<File>())
      .test(
        'Required',
        'Por favor faça o upload do escaneamento do arco inferior',
        (value, ctx) => {
          const hasArcoSuperiorAndInferior =
            ((value && value?.length > 0) ||
              escaneamentoDoArcoInferior.length > 0) &&
            (ctx.parent.escaneamento_do_arco_superior.length > 0 ||
              escaneamentoDoArcoSuperior.length > 0);
          const hasRegistroDeMordida =
            ctx.parent.escaneamento_do_registro_de_mordida.length > 0 ||
            escaneamentoDoRegistroDeMordida.length > 0;
          return (
            hasArcoSuperiorAndInferior ||
            hasRegistroDeMordida ||
            ctx.parent.escaneamento_link ||
            ctx.parent.encaminhei_email
          );
        },
      ),
    escaneamento_do_registro_de_mordida: yup
      .array()
      .of(yup.mixed<File>())
      .test(
        'Required',
        'Por favor faça o upload do escaneamento do registro de mordida',
        (value, ctx) => {
          const hasArcoSuperiorAndInferior =
            (ctx.parent.escaneamento_do_arco_inferior.length > 0 ||
              escaneamentoDoArcoInferior.length > 0) &&
            (ctx.parent.escaneamento_do_arco_superior.length > 0 ||
              escaneamentoDoArcoSuperior.length > 0);
          const hasRegistroDeMordida =
            (value && value.length > 0) ||
            escaneamentoDoRegistroDeMordida.length > 0;
          return (
            hasArcoSuperiorAndInferior ||
            hasRegistroDeMordida ||
            ctx.parent.escaneamento_link ||
            ctx.parent.encaminhei_email
          );
        },
      ),
    escaneamento_link: yup
      .string()
      .test(
        'Required',
        'Por favor insira o link do escaneamento enviado  pelo entro de documentação.',
        (value, ctx) => {
          const hasArcoSuperiorAndInferior =
            (ctx.parent.escaneamento_do_arco_inferior.length > 0 ||
              escaneamentoDoArcoInferior.length > 0) &&
            (ctx.parent.escaneamento_do_arco_superior.length > 0 ||
              escaneamentoDoArcoSuperior.length > 0);
          const hasRegistroDeMordida =
            ctx.parent.escaneamento_do_registro_de_mordida.length > 0 ||
            escaneamentoDoRegistroDeMordida.length > 0;
          return (
            hasArcoSuperiorAndInferior ||
            hasRegistroDeMordida ||
            value ||
            ctx.parent.encaminhei_email
          );
        },
      ),
    encaminhei_email: yup
      .boolean()
      .test(
        'Required',
        'Por favor confirme se o email com os arquivos do escaneamento foi enviado.',
        (value, ctx) => {
          const hasArcoSuperiorAndInferior =
            (ctx.parent.escaneamento_do_arco_inferior.length > 0 ||
              escaneamentoDoArcoInferior.length > 0) &&
            (ctx.parent.escaneamento_do_arco_superior.length > 0 ||
              escaneamentoDoArcoSuperior.length > 0);
          const hasRegistroDeMordida =
            ctx.parent.escaneamento_do_registro_de_mordida.length > 0 ||
            escaneamentoDoRegistroDeMordida.length > 0;
          return (
            hasArcoSuperiorAndInferior ||
            hasRegistroDeMordida ||
            ctx.parent.escaneamento_link ||
            value
          );
        },
      ),
  });

  const {
    register,
    handleSubmit,
    formState,
    setValue,
    clearErrors,
    getValues,
    reset,
  } = useForm<GuiasCirurgicoFormData>({
    resolver: yupResolver(guiasCirurgicoFormSchema),
    defaultValues: {
      escaneamento_do_arco_superior: [],
      escaneamento_do_arco_inferior: [],
      escaneamento_do_registro_de_mordida: [],
    },
  });

  const { isLoading, error } = useQuery(
    'users',
    () =>
      api.get(`/requests/${caseId}`).then(res => {
        const fields = JSON.parse(res.data.fields);
        const treatedRequest = {
          ...res.data,
          ...fields,
        };
        delete treatedRequest.fields;
        setAddressSelected(treatedRequest.addresses[0]);
        setEscaneamentoDoArcoSuperior(
          treatedRequest.escaneamento_do_arco_superior,
        );
        setEscaneamentoDoArcoInferior(
          treatedRequest.escaneamento_do_arco_inferior,
        );
        setEscaneamentoDoRegistroDeMordida(
          treatedRequest.escaneamento_do_registro_de_mordida,
        );
        reset({
          ...treatedRequest,
          address: treatedRequest.addresses[0],
          escaneamento_do_arco_superior: [],
          escaneamento_do_arco_inferior: [],
          escaneamento_do_registro_de_mordida: [],
        });
      }),
    {
      refetchOnWindowFocus: false,
    },
  );

  if (isLoading) return <Layout>Loading...</Layout>;

  if (error) return <Layout>{`An error has occurred: ${error}`}</Layout>;

  function handleSelectAddress(address: Address) {
    setAddressSelected(address);
    setValue('address', address);
    clearErrors('address');
  }

  async function handleGuiaCirurgicoSubmit(data: GuiasCirurgicoFormData) {
    try {
      setIsSubmitting(true);

      await Promise.all(
        removedEscaneamentoDoArcoSuperior.map(item => deleteFile(item)),
      );
      const escaneamentoDoArcoSuperiorUrl = await Promise.all(
        data.escaneamento_do_arco_superior.map(item => uploadFile(item)),
      ).then(response => [
        ...response,
        ...escaneamentoDoArcoSuperior.filter(item =>
          item.includes('firebasestorage.googleapis'),
        ),
      ]);

      await Promise.all(
        removedEscaneamentoDoArcoInferior.map(item => deleteFile(item)),
      );
      const escaneamentoDoArcoInferiorUrl = await Promise.all(
        data.escaneamento_do_arco_inferior.map(item => uploadFile(item)),
      ).then(response => [
        ...response,
        ...escaneamentoDoArcoInferior.filter(item =>
          item.includes('firebasestorage.googleapis'),
        ),
      ]);

      await Promise.all(
        removedEscaneamentoDoRegistroDeMordida.map(item => deleteFile(item)),
      );
      const escaneamentoDoRegistroDeMordidaUrl = await Promise.all(
        data.escaneamento_do_registro_de_mordida.map(item => uploadFile(item)),
      ).then(response => [
        ...response,
        ...escaneamentoDoRegistroDeMordida.filter(item =>
          item.includes('firebasestorage.googleapis'),
        ),
      ]);

      await api.put(`requests/${caseId}?user_id=${userLogged?.firebase_id}`, {
        patient_name: data.patient_name,
        product_name: 'Modelos/Guias Cirúrgicos',
        fields: JSON.stringify({
          escaneamento_link: data.escaneamento_link,
          encaminhei_email: data.encaminhei_email,
          escaneamento_do_arco_superior: escaneamentoDoArcoSuperiorUrl,
          escaneamento_do_arco_inferior: escaneamentoDoArcoInferiorUrl,
          escaneamento_do_registro_de_mordida:
            escaneamentoDoRegistroDeMordidaUrl,
        }),
      });
      toast.success('Requisição editada com sucesso.');
      push('/');
    } catch (err) {
      toast.error(
        'Não foi possível reditar a requisição, por favor tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <Layout>
      <form
        className="max-w-3xl"
        onSubmit={handleSubmit(handleGuiaCirurgicoSubmit)}
      >
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 sm:col-span-6">
            <Input
              label="Nome do paciente"
              {...register('patient_name')}
              error={!!formState.errors.patient_name}
              errorMessage={formState.errors.patient_name?.message}
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
                      addressSelected.id === address.id
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
              Envio do escaneamento do seu paciente:
            </span>
            <div className="my-2">
              <div className="flex flex-col ml-1 space-y-4">
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500">
                    Envio do escaneamento do arco superior:
                  </span>
                  <UploadFileButton
                    {...register('escaneamento_do_arco_superior')}
                    multiple
                    onChange={async e => {
                      if (e.target.files) {
                        const files = await Promise.all(e.target.files);
                        setValue('escaneamento_do_arco_superior', [
                          ...getValues().escaneamento_do_arco_superior,
                          ...files,
                        ]);
                        setEscaneamentoDoArcoSuperior(prevState => [
                          ...prevState,
                          ...files.map(file => file.name),
                        ]);
                        clearErrors('escaneamento_do_arco_superior');
                      }
                    }}
                    error={!!formState.errors.escaneamento_do_arco_superior}
                  />
                </div>
                {formState.errors.escaneamento_do_arco_superior && (
                  <span className="ml-1 text-sm font-medium text-red-500">
                    {formState.errors.escaneamento_do_arco_superior.message}
                  </span>
                )}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {escaneamentoDoArcoSuperior.map(item => (
                    <DisplayFile
                      key={item}
                      fileName={
                        item.includes('firebasestorage.googleapis.com')
                          ? item.slice(73)
                          : item
                      }
                      fileURL={
                        item.includes('firebasestorage.googleapis.com')
                          ? item
                          : undefined
                      }
                      onRemoveFile={() => {
                        setValue(
                          'escaneamento_do_arco_superior',
                          getValues().escaneamento_do_arco_superior.filter(
                            fileItem => fileItem.name !== item,
                          ),
                        );
                        setRemovedEscaneamentoDoArcoSuperior(prevState => [
                          ...prevState,
                          item,
                        ]);
                        setEscaneamentoDoArcoSuperior(prevState =>
                          prevState.filter(fileItem => fileItem !== item),
                        );
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="my-2">
              <div className="flex flex-col ml-1 space-y-4">
                <div className="flex items-center">
                  <span className="text-xs font-medium text-gray-500">
                    Envio do escaneamento do arco inferior:
                  </span>
                  <UploadFileButton
                    {...register('escaneamento_do_arco_inferior')}
                    multiple
                    onChange={async e => {
                      if (e.target.files) {
                        const files = await Promise.all(e.target.files);
                        setValue('escaneamento_do_arco_inferior', [
                          ...getValues().escaneamento_do_arco_inferior,
                          ...files,
                        ]);
                        setEscaneamentoDoArcoInferior(prevState => [
                          ...prevState,
                          ...files.map(file => file.name),
                        ]);
                        clearErrors('escaneamento_do_arco_inferior');
                      }
                    }}
                    error={!!formState.errors.escaneamento_do_arco_inferior}
                  />
                </div>
                {formState.errors.escaneamento_do_arco_inferior && (
                  <span className="ml-1 text-sm font-medium text-red-500">
                    {formState.errors.escaneamento_do_arco_inferior.message}
                  </span>
                )}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {escaneamentoDoArcoInferior.map(item => (
                    <DisplayFile
                      key={item}
                      fileName={
                        item.includes('firebasestorage.googleapis.com')
                          ? item.slice(73)
                          : item
                      }
                      fileURL={
                        item.includes('firebasestorage.googleapis.com')
                          ? item
                          : undefined
                      }
                      onRemoveFile={() => {
                        setValue(
                          'escaneamento_do_arco_inferior',
                          getValues().escaneamento_do_arco_inferior.filter(
                            fileItem => fileItem.name !== item,
                          ),
                        );
                        setRemovedEscaneamentoDoArcoInferior(prevState => [
                          ...prevState,
                          item,
                        ]);
                        setEscaneamentoDoArcoInferior(prevState =>
                          prevState.filter(fileItem => fileItem !== item),
                        );
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-col">
              <div className="my-2">
                <div className="flex flex-col ml-1 space-y-4">
                  <div className="flex items-center">
                    <span className="text-xs font-medium text-gray-500">
                      Envio do escaneamento do registro de mordida:
                    </span>
                    <UploadFileButton
                      {...register('escaneamento_do_registro_de_mordida')}
                      multiple
                      onChange={async e => {
                        if (e.target.files) {
                          const files = await Promise.all(e.target.files);
                          setValue('escaneamento_do_registro_de_mordida', [
                            ...getValues().escaneamento_do_registro_de_mordida,
                            ...files,
                          ]);
                          setEscaneamentoDoRegistroDeMordida(prevState => [
                            ...prevState,
                            ...files.map(file => file.name),
                          ]);
                          clearErrors('escaneamento_do_registro_de_mordida');
                        }
                      }}
                      error={
                        !!formState.errors.escaneamento_do_registro_de_mordida
                      }
                    />
                  </div>
                  {formState.errors.escaneamento_do_registro_de_mordida && (
                    <span className="ml-1 text-sm font-medium text-red-500">
                      {
                        formState.errors.escaneamento_do_registro_de_mordida
                          .message
                      }
                    </span>
                  )}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {escaneamentoDoRegistroDeMordida.map(item => (
                      <DisplayFile
                        key={item}
                        fileName={
                          item.includes('firebasestorage.googleapis.com')
                            ? item.slice(73)
                            : item
                        }
                        fileURL={
                          item.includes('firebasestorage.googleapis.com')
                            ? item
                            : undefined
                        }
                        onRemoveFile={() => {
                          setValue(
                            'escaneamento_do_registro_de_mordida',
                            getValues().escaneamento_do_registro_de_mordida.filter(
                              fileItem => fileItem.name !== item,
                            ),
                          );
                          setRemovedEscaneamentoDoRegistroDeMordida(
                            prevState => [...prevState, item],
                          );
                          setEscaneamentoDoRegistroDeMordida(prevState =>
                            prevState.filter(fileItem => fileItem !== item),
                          );
                        }}
                      />
                    ))}
                  </div>
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
                {formState.errors.encaminhei_email && (
                  <span className="ml-1 text-sm font-medium text-red-500">
                    {formState.errors.encaminhei_email.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-6 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={classNames(
                'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                'mt-2 flex w-full items-center justify-center rounded-md border border-transparent py-3 px-8 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2',
              )}
            >
              <Spinner hidden={!isSubmitting} />
              Realizar pedido
            </button>

            <span className="text-sm mx-4 block font-medium text-gray-500">
              O pedido será enviado após o pagamento via pix ou boleto a ser
              acordado em contato pelo WhatsApp feito pela empresa.
            </span>
          </div>
        </div>
      </form>
    </Layout>
  );
}

export const getServerSideProps = withSSRRequestProtect(async () => {
  return {
    props: {},
  };
});
