import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, ReactNode, useEffect } from 'react';
import { firebaseAuth, signOut } from '@/config/firebase';
import { destroyCookie } from 'nookies';
import DefaultAvatar from '@/utils/defaultAvatar';
import useAuth from '@/hooks/useAuth';

const userNavigation = [
  { name: 'Perfil', header: 'Perfil', href: '/profile' },
  { name: 'Sair', href: '/login' },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useRouter();

  const { userLogged, fetchUser, setUserLogged } = useAuth();

  const navigation = [
    {
      name: 'Solicitações',
      header: 'Gerenciamento de solicitações',
      href: '/',
      current: pathname === '/',
      showInHeader: true,
    },
    {
      name: 'Nova Solicitação',
      header: 'Nova Solicitação',
      href: '/products',
      current: pathname === '/products',
      showInHeader: false,
    },
    {
      name: 'Setup',
      header: 'Setup',
      href: '/products/setup',
      current: pathname.includes('/products/setup'),
      showInHeader: false,
    },
    {
      name: 'Programação TeethAligner',
      header: 'Alinhadores - Programação TeethAligner',
      href: '/products/alinhadores/programacao-teethaligner',
      current: pathname.includes(
        '/products/alinhadores/programacao-teethaligner',
      ),
      showInHeader: false,
    },
    {
      name: 'Desejo apenas imprimir os alinhadores',
      header: 'Alinhadores - Apenas Imprimir',
      href: '/products/alinhadores/apenas-imprimir',
      current: pathname.includes('/products/alinhadores/apenas-imprimir'),
      showInHeader: false,
    },
    {
      name: 'Moldagem de Transferência Virtual',
      header: 'Moldagem de Transferência Virtual',
      href: '/products/transferencia-virtual',
      current: pathname.includes('/products/transferencia-virtual'),
      showInHeader: false,
    },
    {
      name: 'Usuários',
      header: 'Gerenciamento de usuários',
      href: '/users',
      current: pathname === '/users',
      showInHeader: true,
    },
    {
      name: 'Cadastro',
      header: 'Cadastro de usuários',
      href: '/add-user',
      current: pathname === '/add-user',
      showInHeader: true,
    },
  ];

  function handleSignOut() {
    signOut(firebaseAuth).then(() => {
      destroyCookie(undefined, 'teethaligner.token');
      destroyCookie(undefined, 'teethaligner.user-firebase-id');
      setUserLogged(null);
    });
  }

  useEffect(() => {
    if (!userLogged) {
      fetchUser();
    }
  }, [fetchUser, userLogged]);

  return (
    <div className="min-h-full">
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-screen-2xl max-[1920px]:max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-20 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-16"
                      src="/images/logo.png"
                      alt="Your Company"
                    />
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation
                        .filter(item => item.showInHeader)
                        .map(item => (
                          <Link key={item.name} href={item.href} legacyBehavior>
                            <a
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.current
                                  ? 'bg-gray-900 text-white'
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'px-3 py-2 rounded-md text-sm font-medium',
                              )}
                              aria-current={item.current ? 'page' : undefined}
                            >
                              {item.name}
                            </a>
                          </Link>
                        ))}
                    </div>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="ml-4 flex items-center md:ml-6">
                    {/* <button
                      type="button"
                      className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button> */}

                    {/* Profile dropdown */}
                    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                          <span className="sr-only">Open user menu</span>
                          {userLogged?.avatar ? (
                            <img
                              className="h-8 w-8 rounded-full"
                              src={userLogged?.avatar}
                              alt=""
                            />
                          ) : (
                            <DefaultAvatar />
                          )}
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map(item => (
                            <Link
                              key={item.name}
                              href={item.href}
                              legacyBehavior
                            >
                              <Menu.Item>
                                {({ active }) => (
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      active ? 'bg-gray-100' : '',
                                      'block px-4 py-2 text-sm text-gray-700',
                                    )}
                                    onClick={() =>
                                      item.name === 'Sair' && handleSignOut()
                                    }
                                  >
                                    {item.name}
                                  </a>
                                )}
                              </Menu.Item>
                            </Link>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </div>
                <div className="-mr-2 flex md:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-8 w-8" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-8 w-8" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                {navigation.map(item => (
                  <Link key={item.name} href={item.href} legacyBehavior>
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block px-3 py-2 rounded-md text-base font-medium',
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  </Link>
                ))}
              </div>
              <div className="border-t border-gray-700 pt-4 pb-3">
                <div className="flex items-center px-5">
                  <div className="flex-shrink-0">
                    {userLogged?.avatar ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={userLogged?.avatar}
                        alt=""
                      />
                    ) : (
                      <DefaultAvatar />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium leading-none text-white">
                      {userLogged?.name}
                    </div>
                    <div className="text-sm font-medium leading-none text-gray-400">
                      {userLogged?.email}
                    </div>
                  </div>
                  {/* <button
                    type="button"
                    className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="sr-only">View notifications</span>
                    <BellIcon className="h-6 w-6" aria-hidden="true" />
                  </button> */}
                </div>
                <div className="mt-3 space-y-1 px-2">
                  {userNavigation.map(item => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                      onClickCapture={() =>
                        item.name === 'Sair' && handleSignOut()
                      }
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <header className="bg-white shadow">
        <div className="mx-auto max-w-screen-2xl max-[1920px]:max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {navigation.find(item => item.current)?.header}
            {userNavigation.find(item => item.href === pathname)?.header}
          </h1>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-screen-2xl max-[1920px]:max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">{children}</div>
        </div>
      </main>
    </div>
  );
}
