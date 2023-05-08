import Radio from '@/components/Form/Radio';
import { SetupFormData } from '@/pages/products/setup';
import { FormState, UseFormRegister } from 'react-hook-form';

interface RadioInputsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any>;
  formState: FormState<SetupFormData>;
}

export default function RadioInputs({ register, formState }: RadioInputsProps) {
  return (
    <>
      <div className="col-span-6">
        <span className="block mb-2 text-sm font-medium text-gray-600">
          Assinale o que deseja como prioridade para realização dos movimentos
          dentários:
        </span>
        <div className="flex flex-row items-center space-x-3 ml-1">
          <Radio
            id="projeção_movimento_dentario"
            value="Projeção"
            label="Projeção"
            {...register('movimento_dentario')}
            error={!!formState.errors.movimento_dentario}
          />
          <Radio
            id="desgaste_movimento_dentario"
            value="Desgaste"
            label="Desgaste"
            {...register('movimento_dentario')}
            error={!!formState.errors.movimento_dentario}
          />
          <Radio
            id="retração_movimento_dentario"
            value="Retração"
            label="Retração"
            {...register('movimento_dentario')}
            error={!!formState.errors.movimento_dentario}
          />
          <Radio
            id="expanção_movimento_dentario"
            value="Expanção"
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
                id="manter_relacao_caninos"
                value="Manter"
                label="Manter"
                {...register('relacao_de_caninos')}
                error={!!formState.errors.relacao_de_caninos}
              />
              <Radio
                id="classe_1_relacao_caninos"
                value="Classe I"
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
                id="manter_relacao_molares"
                value="Manter"
                label="Manter"
                {...register('relacao_de_molares')}
                error={!!formState.errors.relacao_de_molares}
              />
              <Radio
                id="classe_1_relacao_molares"
                value="Classe I"
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
                id="manter_sobremordida"
                value="Manter"
                label="Manter"
                {...register('sobremordida')}
                error={!!formState.errors.sobremordida}
              />
              <Radio
                id="corrigir_sobremordida"
                value="Corrigir"
                label="Corrigir"
                {...register('sobremordida')}
                error={!!formState.errors.sobremordida}
              />
              <Radio
                id="sobreCorrigir_sobremordida"
                value="SobreCorrigir"
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
                id="manter_linha_media"
                value="Manter"
                label="Manter"
                {...register('linha_media')}
                error={!!formState.errors.linha_media}
              />
              <Radio
                id="corrigir_linha_media"
                value="Corrigir"
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
    </>
  );
}
