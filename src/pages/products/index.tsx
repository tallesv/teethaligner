import Layout from '@/components/Layout';
import withSSRAuth from '@/utils/withSSRAuth';
import { RadioGroup } from '@headlessui/react';
import { useRouter } from 'next/router';
import { FormEvent, useState } from 'react';

const products = [
  {
    title: 'Alinhadores personalizados',
    subTitle: 'O Alinhador com sua marca',
    services: [
      {
        title: 'Programação TeethAligner',
        path: '/programacao-teethaligner',
        info: [
          'Valor do setup: R$ 250,00',
          'Valor unitário do alinhador: R$ 68,00',
          'Personalização da embalagem: Gratuita',
          'Caixa Regular: Gratuita',
          'Caixa Premium: R$ 25,00',
          'Acréscimo taxa de envio',
        ],
      },
      {
        title: 'Desejo apenas imprimir os alinhadores',
        path: '/apenas-imprimir',
        info: [
          'Valor unitário do alinhador: R$ 68,00',
          'Personalização da embalagem: Gratuita ',
          'Caixa Regular: Gratuita ',
          'Caixa Premium: R$ 25,00',
          'Acréscimo taxa de envio',
        ],
      },
      {
        title: 'Programação TeethAligner Premium',
        path: '',
        info: [
          'Valor do setup: R$ 350,00',
          'Valor unitário do alinhador: R$ 68,00',
          'Valor por refinamento: R$ 300,00',
          'Personalização da embalagem: Gratuita ',
          'Caixa Regular: Gratuita',
          'Caixa Premium: R$ 25,00',
          'Acréscimo taxa de envio',
        ],
      },
    ],
    path: '/alinhadores',
  },
  {
    title: 'Setup',
    services: [
      {
        title: 'Programação TeethAligner',
        subTitle: 'Valor do setup: R$ 250,00',
        path: '',
        info: [],
      },
      {
        title: 'Programação OrtoSetup',
        subTitle: 'Valor do setup: R$ 350,00',
        path: '',
        info: [],
      },
    ],
    path: '/setup',
  },
  {
    title: 'Moldagem de transferência virtual',
    services: [],
    info: [
      'Impressão da moldagem de transferência virtual: R$ 45,00 (valor unitário)',
      'Impressão modelo: R$ 40,00 (em casos de impressão de ambos os arcos)',
      'Acréscimo taxa de envio',
    ],
    path: '/transferencia-virtual',
  },
  {
    title: 'Modelos/guias cirúrgicos',
    services: [],
    info: ['Impressão modelo/guia: R$ 40,00', 'Acréscimo taxa de envio'],
    path: '/guias-cirurgicos',
  },
];

const services = [
  {
    title: 'Programação TeethAligner',
    product: 'Alinhadores personalizados',
    info: [
      'Valor do setup R$ 250,00',
      'Valor unitário do alinhador R$ 68,00',
      'Personalização embalagem gratuita',
      'Caixa regular gratuita',
      'Caixa Premium R$ 25,00',
      'Acréscimo taxa de envio',
    ],
  },
  {
    title: 'Desejo apenas imprimir os alinhadores',
    product: 'Alinhadores personalizados',
    info: [
      'Valor unitário do alinhador r$ 68,00',
      'Personalização embalagem gratuita ',
      'Caixa regular gratuita ',
      'Caixa Premium R$ 25,00',
      'Acréscimo taxa de envio',
    ],
  },
  {
    title: 'Programação TeethAligner Premium',
    product: 'Alinhadores personalizados',
    info: [
      'Valor do setup r$ 350,00',
      'Valor unitário do alinhador r$ 68,00',
      'Personalização embalagem gratuita ',
      'Caixa regular gratuita',
      'Caixa Premium R$ 25,00',
      'Acréscimo taxa de envio',
    ],
  },
  {
    title: 'Programação TeethAligner',
    product: 'Setup',
    subTitle: 'Valor do setup R$ 250,00',
  },
  {
    title: 'Programação TeethAligner Premium',
    product: 'Setup',
    subTitle: 'Valor do setup R$ 350,00',
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function SelectProduct() {
  const { push } = useRouter();

  const [productSelected, setProductSelected] = useState('');
  const [serviceSelected, setServiceSelected] = useState('');

  function handleSelectProduct(product: string) {
    if (product !== 'Programação teethaligner') setServiceSelected('');
    setProductSelected(product);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const product = products.find(item => item.title === productSelected)!;
    const servicePath =
      product.services.find(service => service.title === serviceSelected)
        ?.path ?? '';
    push(`/products${product?.path}${servicePath}`);
  }

  let serviceInfos;

  if (
    productSelected === 'Alinhadores personalizados' &&
    serviceSelected !== ''
  ) {
    serviceInfos = products[0].services.find(
      service => service.title === serviceSelected,
    )?.info;
  } else {
    serviceInfos = products.find(
      product => product.title === productSelected,
    )?.info;
  }

  function showProductSelectedOptions(option: string) {
    switch (option) {
      case 'Alinhadores personalizados':
        return (
          <>
            <div className="mx-2">
              <p>
                Nós oferecemos a personalização da sua marca vinculada ao seu
                alinhador, siga o passo a passo de forma intuitiva.
                <br />
                <br />
                Oferecemos 2 serviços para a programação do seu tratamento:
                <br />A programação TeethAligner com o padrão de qualidade que
                você já conhece e a programação TeethAligner premium para casos
                de alta complexidade (correções da classe II ou classe III com
                mesializações ou distalizações com programações distintas).
              </p>
            </div>
            <RadioGroup
              value={serviceSelected}
              onChange={e => setServiceSelected(e)}
              className="mt-4"
            >
              <RadioGroup.Label className="sr-only">
                Escolha um serviço
              </RadioGroup.Label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {services
                  .filter(item => item.product === 'Alinhadores personalizados')
                  .map(service => (
                    <RadioGroup.Option
                      key={service.title}
                      value={service.title}
                      className={classNames(
                        serviceSelected === service.title
                          ? 'ring-2 ring-blue-500'
                          : '',
                        'group relative flex items-center justify-center rounded-md border py-3 px-4 text-gray-800 sm:text-sm text-xs font-semibold uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6',
                      )}
                    >
                      <RadioGroup.Label as="span">
                        {service.title}
                      </RadioGroup.Label>
                    </RadioGroup.Option>
                  ))}
              </div>
            </RadioGroup>
          </>
        );

      case 'Setup':
        return (
          <>
            <p>
              Nós oferecemos a personalização da sua marca vinculada ao seu
              alinhador, siga o passo a passo de forma intuitiva.
              <br />
              <br />
              Oferecemos 2 serviços para a programação do seu tratamento:
              <br />A programação TeethAligner com o padrão de qualidade que
              você já conhece e a programação TeethAligner premium para casos de
              alta complexidade (correções da classe II ou classe III com
              mesializações ou distalizações com programações distintas).
            </p>

            <RadioGroup
              value={serviceSelected}
              onChange={e => setServiceSelected(e)}
              className="mt-4"
            >
              <RadioGroup.Label className="sr-only">
                Escolha um serviço
              </RadioGroup.Label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {services
                  .filter(item => item.product === 'Setup')
                  .map(service => (
                    <RadioGroup.Option
                      key={service.title}
                      value={service.title}
                      className={classNames(
                        serviceSelected === service.title
                          ? 'ring-2 ring-blue-500'
                          : '',
                        'group relative flex items-center justify-center rounded-md border py-3 px-4 text-gray-800 sm:text-sm text-xs font-semibold uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6',
                      )}
                    >
                      <RadioGroup.Label as="span">
                        {service.title}
                        <br />
                        {service.subTitle && (
                          <span className="font-medium text-xs text-gray-500">
                            {service.subTitle}
                          </span>
                        )}
                      </RadioGroup.Label>
                    </RadioGroup.Option>
                  ))}
              </div>
            </RadioGroup>
          </>
        );
      default:
        return <div />;
    }
  }

  return (
    <Layout>
      <div className="mx-auto max-w-2xl sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8">
        <div>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-800">Produtos</h3>
            </div>

            <RadioGroup
              value={productSelected}
              onChange={e => handleSelectProduct(e)}
              className="mt-4"
            >
              <RadioGroup.Label className="sr-only">
                Escolha um produto
              </RadioGroup.Label>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {products.map(product => (
                  <RadioGroup.Option
                    key={product.title}
                    value={product.title}
                    className={classNames(
                      productSelected === product.title
                        ? 'ring-2 ring-blue-500'
                        : '',
                      'group relative flex items-center justify-center rounded-md border py-3 px-4 text-gray-800 sm:text-sm text-xs font-semibold uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 sm:py-6',
                    )}
                  >
                    <RadioGroup.Label as="span">
                      {product.title}
                      <br />
                      {product.subTitle && (
                        <span className="font-medium text-xs text-gray-500">
                          {product.subTitle}
                        </span>
                      )}
                    </RadioGroup.Label>
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>

            <div className="my-5">
              {showProductSelectedOptions(productSelected)}
            </div>

            {!['', 'Setup'].includes(productSelected) && (
              <div
                hidden={
                  productSelected === 'Alinhadores personalizados' &&
                  serviceSelected === ''
                }
                className="mt-5 mx-2"
              >
                <h3 className="text-sm font-medium text-gray-900">
                  Informações
                </h3>

                <div className="mt-4">
                  <ul className="list-disc space-y-2 pl-4 text-sm">
                    {serviceInfos &&
                      serviceInfos.map((item: string) => (
                        <li key={item} className="text-gray-400">
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            )}

            <button
              type="submit"
              className={classNames(
                productSelected === '' ||
                  ((productSelected === 'Alinhadores personalizados' ||
                    productSelected === 'Setup') &&
                    serviceSelected === '')
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
                'mt-10 flex w-full items-center justify-center rounded-md border border-transparent py-3 px-8 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2',
              )}
              disabled={
                productSelected === '' ||
                (productSelected === 'Alinhadores personalizados' &&
                  serviceSelected === '')
              }
            >
              Prosseguir
            </button>
          </form>
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
