import * as yup from 'yup';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Layout from '@/components/Layout';
import Input from '@/components/Form/Input';
import Select from '@/components/Form/Select';
import Checkbox from '@/components/Form/Checkbox';
import Radio from '@/components/Form/Radio';
import TextArea from '@/components/Form/Textarea';
import classNames from '@/utils/bindClassNames';
import FileInput from '@/components/Form/FileInput';
import withSSRAuth from '@/utils/withSSRAuth';

type SetupFormData = {
  name: string;
  cep: string;
  state: string;
  city: string;
  street: string;
  personalizando_o_planejamento: string;
  dentes_a_serem_movimentados: string[];
  movimento_dentario: string;
  relacao_de_caninos: string;
  relacao_de_molares: string;
  sobremordida: string;
  linha_media: string;
  informacoes_adicionais: string;
  escaneamento_do_arco_superior: File;
  escaneamento_do_arco_inferior: File;
  escaneamento_do_registro_de_mordida: File;
  escaneamento_link: string;
  encaminhei_email: boolean;
};

const setupFormSchema = yup.object().shape({
  name: yup.string().required('Por favor insira o nome do paciente'),
  cep: yup.string().required('Por favor insira o cep.'),
  state: yup.string().required('Por favor selecione o estado.'),
  city: yup.string().required('Por favor insira a cidade.'),
  street: yup.string().required('Por favor insira a rua.'),
  personalizando_o_planejamento: yup.string(),
  dentes_a_serem_movimentados: yup
    .array()
    .of(yup.string())
    .min(1, 'Por favor selecione os dentes a serem movimentados.'),
  movimento_dentario: yup.string().required('Por favor selecione uma opção.'),
  relacao_de_caninos: yup.string().required('Por favor selecione uma opção.'),
  relacao_de_molares: yup.string().required('Por favor selecione uma opção.'),
  sobremordida: yup.string().required('Por favor selecione uma opção.'),
  linha_media: yup.string().required('Por favor selecione uma opção.'),
  informacoes_adicionais: yup.string(),
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
  const { register, handleSubmit, formState, getValues, setValue } =
    useForm<SetupFormData>({
      resolver: yupResolver(setupFormSchema),
      defaultValues: {
        dentes_a_serem_movimentados: [],
      },
    });

  function handleSelectCheckBox(value: string) {
    const subOptionsArray = Array.isArray(
      getValues().dentes_a_serem_movimentados,
    )
      ? getValues().dentes_a_serem_movimentados
      : [];

    const findValue = subOptionsArray?.find(item => item === value);

    if (findValue) {
      const subOptionsArrayUpdated = subOptionsArray?.filter(
        item => item !== value,
      );
      setValue('dentes_a_serem_movimentados', subOptionsArrayUpdated);
    } else {
      subOptionsArray?.push(value);
      setValue('dentes_a_serem_movimentados', subOptionsArray);
    }
  }

  function handleSetupSubmit(data: SetupFormData) {
    console.log(data);
  }

  console.log(getValues());
  // console.log(formState.errors);

  return (
    <Layout>
      <form className="max-w-3xl" onSubmit={handleSubmit(handleSetupSubmit)}>
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-6 sm:col-span-6">
            <Input
              label="Nome"
              {...register('name')}
              error={!!formState.errors.name}
              errorMessage={formState.errors.name?.message}
            />
          </div>

          <div className="col-span-6">
            <div className="my-2 border-t border-gray-200" />

            <h3 className="font-medium">Endereco</h3>
          </div>

          <div className="col-span-6 sm:col-span-1 md:col-span-1">
            <Input
              label="CEP"
              {...register('cep')}
              error={!!formState.errors.cep}
              errorMessage={formState.errors.cep?.message}
            />
          </div>

          <div className="col-span-6 sm:col-span-2">
            <Select
              id="test"
              label="Estado"
              options={[{ label: 'Rio Grande do Norte', value: 'RN' }]}
              {...register('state')}
              error={!!formState.errors.state}
              errorMessage={formState.errors.state?.message}
            />
          </div>

          <div className="col-span-6 sm:col-span-3 lg:col-span-3">
            <Input
              label="Cidade"
              {...register('city')}
              error={!!formState.errors.city}
              errorMessage={formState.errors.city?.message}
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
            <span className="block mb-2 text-sm font-medium text-gray-600">
              Assinale os dentes a serem movimentados :
            </span>
            <div className="flex flex-col sm:flex-row sm:space-x-2">
              <div className="flex flex-row items-center space-x-3.5 sm:space-x-4">
                {['18', '17', '16', '15', '14', '13', '12', '11'].map(item => (
                  <Checkbox
                    key={item}
                    id={item}
                    label={item}
                    onChange={e => handleSelectCheckBox(e.target.value)}
                  />
                ))}
              </div>
              <div className="flex flex-row items-center space-x-3 sm:space-x-3.5">
                {['21', '22', '23', '24', '25', '26', '27', '28'].map(item => (
                  <Checkbox
                    key={item}
                    id={item}
                    label={item}
                    onChange={e => handleSelectCheckBox(e.target.value)}
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
                    onChange={e => handleSelectCheckBox(e.target.value)}
                  />
                ))}
              </div>
              <div className="flex flex-row items-center space-x-3 sm:space-x-3.5">
                {['31', '32', '33', '34', '35', '36', '37', '38'].map(item => (
                  <Checkbox
                    key={item}
                    id={item}
                    label={item}
                    onChange={e => handleSelectCheckBox(e.target.value)}
                  />
                ))}
              </div>
            </div>

            {formState.errors.dentes_a_serem_movimentados && (
              <span className="ml-1 text-sm font-medium text-red-500">
                {formState.errors.dentes_a_serem_movimentados.message}
              </span>
            )}
          </div>

          <div className="col-span-6">
            <span className="block mb-2 text-sm font-medium text-gray-600">
              Assinale o que deseja como prioridade para realização dos
              movimentos dentários:
            </span>
            <div className="flex flex-row items-center space-x-3 ml-1">
              <Radio
                id="projeção"
                label="Projeção"
                {...register('movimento_dentario')}
                error={!!formState.errors.movimento_dentario}
              />
              <Radio
                id="desgaste"
                label="Desgaste"
                {...register('movimento_dentario')}
                error={!!formState.errors.movimento_dentario}
              />
              <Radio
                id="retração"
                label="Retração"
                {...register('movimento_dentario')}
                error={!!formState.errors.movimento_dentario}
              />
              <Radio
                id="expanção"
                label="Expanção"
                {...register('movimento_dentario')}
                error={!!formState.errors.movimento_dentario}
              />
            </div>
            {formState.errors.movimento_dentario && (
              <span className="ml-1 text-sm font-medium text-red-500">
                {formState.errors.movimento_dentario.message}
              </span>
            )}
          </div>

          <div className="col-span-6">
            <div className="grid grid-row-2 sm:grid-cols-2">
              <div className="my-2">
                <span className="block mb-2 text-sm font-medium text-gray-600">
                  Relação de caninos:
                </span>
                <div className="flex flex-row items-center space-x-3 ml-1">
                  <Radio
                    id="manter"
                    label="Manter"
                    {...register('relacao_de_caninos')}
                    error={!!formState.errors.relacao_de_caninos}
                  />
                  <Radio
                    id="classe 1"
                    label="Classe I"
                    {...register('relacao_de_caninos')}
                    error={!!formState.errors.relacao_de_caninos}
                  />
                </div>
                {formState.errors.relacao_de_caninos && (
                  <span className="ml-1 text-sm font-medium text-red-500">
                    {formState.errors.relacao_de_caninos.message}
                  </span>
                )}
              </div>

              <div className="my-2">
                <span className="block mb-2 text-sm font-medium text-gray-600">
                  Relação de Molares:
                </span>
                <div className="flex flex-row items-center space-x-3 ml-1">
                  <Radio
                    id="manter"
                    label="Manter"
                    {...register('relacao_de_molares')}
                    error={!!formState.errors.relacao_de_molares}
                  />
                  <Radio
                    id="classe 1"
                    label="Classe I"
                    {...register('relacao_de_molares')}
                    error={!!formState.errors.relacao_de_molares}
                  />
                </div>
                {formState.errors.relacao_de_molares && (
                  <span className="ml-1 text-sm font-medium text-red-500">
                    {formState.errors.relacao_de_molares.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-6">
            <div className="grid grid-row-2  sm:grid-cols-2">
              <div className="mb-2">
                <span className="block mb-2 text-sm font-medium text-gray-600">
                  Sobremordida:
                </span>
                <div className="flex flex-row items-center space-x-3 ml-1">
                  <Radio
                    id="manter"
                    label="Manter"
                    {...register('sobremordida')}
                    error={!!formState.errors.sobremordida}
                  />
                  <Radio
                    id="corrigir"
                    label="Corrigir"
                    {...register('sobremordida')}
                    error={!!formState.errors.sobremordida}
                  />
                  <Radio
                    id="sobreCorrigir"
                    label="SobreCorrigir"
                    {...register('sobremordida')}
                    error={!!formState.errors.sobremordida}
                  />
                </div>

                {formState.errors.sobremordida && (
                  <span className="ml-1 text-sm font-medium text-red-500">
                    {formState.errors.sobremordida.message}
                  </span>
                )}
              </div>

              <div className="mb-2">
                <span className="block mb-2 text-sm font-medium text-gray-600">
                  Linha média:
                </span>
                <div className="flex flex-row items-center space-x-3 ml-1">
                  <Radio
                    id="manter"
                    label="Manter"
                    {...register('linha_media')}
                    error={!!formState.errors.linha_media}
                  />
                  <Radio
                    id="corrigir"
                    label="Corrigir"
                    {...register('linha_media')}
                    error={!!formState.errors.linha_media}
                  />
                </div>

                {formState.errors.linha_media && (
                  <span className="ml-1 text-sm font-medium text-red-500">
                    {formState.errors.linha_media.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-6">
            <span className="block text-sm font-medium text-gray-600">
              Preencha aqui qualquer informação relevante sobre como deseja que
              o tratamento ocorre:
            </span>
            <TextArea
              label="(descreva se deseja que algum movimento ocorra primeiro, se existe alguma taxa de movimentação especifica para algum dos movimentos, todos os detalhes que achar relevante. Quanto maior a quantidade de informação, mais personalizado seu tratamento)"
              {...register('informacoes_adicionais')}
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
            <button
              type="submit"
              className={classNames(
                false
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                'mt-10 flex w-full items-center justify-center rounded-md border border-transparent py-3 px-8 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2',
              )}
            >
              Prosseguir
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
