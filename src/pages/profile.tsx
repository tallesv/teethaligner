import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Input from '@/components/Form/Input';
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
import { auth } from '@/config/firebase';
import UploadFileButton from '@/components/Form/UploadFileButton';
import { CalendarDaysIcon, PencilIcon } from '@heroicons/react/24/outline';
import moment from 'moment';

type ProfileFormData = {
  avatar: string | File | null;
  name: string;
  phone: string;
};

const profileFormSchema = yup.object().shape({
  avatar: yup.mixed<File>(),
  name: yup.string().required('Por favor insira um Nome.'),
  phone: yup.string(),
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
      const { avatar, name, phone } = data;

      if (avatarPreview && userLogged?.avatar) {
        await deleteFile(userLogged.avatar);
      }

      const avatarUrl = !avatarPreview
        ? avatar
        : await uploadFile(avatar as File);

      await api.put(`/users/${userLogged?.firebase_id}`, {
        name,
        phone,
        avatar: avatarUrl,
      });

      toast.success('Dados do perfil alterados com sucesso!');
      fetchUser();
    } catch (err) {
      toast.error(
        'Não foi possível salvar os dados, por favor tente novamente.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSendResetPasswordEmail() {
    if (userLogged) {
      await auth.sendPasswordResetEmail(userLogged?.email);
      toast.success(
        'Um email com o link para resetar a sua senha foi enviado.',
      );
    }
  }

  useEffect(() => {
    profileReset({ ...userLogged });
  }, [profileReset, userLogged]);

  if (!userLogged) return <Layout>Loading</Layout>;

  return (
    <Layout>
      <div className="flex flex-col max-w-2xl mx-auto space-y-2">
        <div className="pb-4 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Perfil</h3>

          <form
            onSubmit={profileHandleSubmit(handleEditProfileSubmit)}
            className="mt-6 flex flex-col space-y-6"
          >
            <div className="flex flex-col space-y-2">
              <span className="font-medium text-gray-800">Email</span>

              <span className="text-sm text-gray-700">{userLogged?.email}</span>
            </div>

            <div className="space-y-2">
              <span className="font-medium text-gray-800">Foto do usuário</span>

              <div className="flex items-center">
                {userLogged?.avatar ? (
                  <img
                    className="h-28 w-28 rounded-full"
                    src={avatarPreview ?? userLogged.avatar}
                    alt=""
                  />
                ) : (
                  <DefaultAvatar width={28} height={28} />
                )}

                <div className="ml-4">
                  <UploadFileButton
                    label="Alterar foto"
                    onChange={e => handleUploadAvatar(e)}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Nome"
                {...profileRegister('name')}
                error={!!profileFormState.errors.name}
                errorMessage={profileFormState.errors.name?.message}
              />

              <Input
                label="Telefone"
                {...profileRegister('phone')}
                error={!!profileFormState.errors.phone}
                errorMessage={profileFormState.errors.phone?.message}
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center rounded-md border border-transparent py-3 px-8 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2"
            >
              <Spinner hidden={!isSubmitting} />
              {isSubmitting ? 'Atualizando' : 'Atualizar'}
            </button>
          </form>

          <div className="flex items-center text-sm text-gray-700">
            <CalendarDaysIcon className="h-5 font-bold text-blue-600" />
            <span className="ml-1 font-medium text-gray-800">
              Criado em&nbsp;
            </span>
            {moment(userLogged?.created_at).format('LL')}
          </div>
        </div>

        <div className="py-8 border-t broder-gray-50 space-y-6">
          <h3 className="text-xl font-semibold text-gray-800">Senha</h3>

          <button
            type="button"
            className="h-10 flex items-center rounded-md border border-gray-300 bg-white py-1.5 px-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
            onClick={() => handleSendResetPasswordEmail()}
          >
            <PencilIcon className="h-5 mr-1 text-gray-700" />
            Alterar senha
          </button>
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
