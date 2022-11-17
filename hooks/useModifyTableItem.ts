import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { UserSettingType } from '../models/InfoTypes';
import { useInfo } from './useInfo';

const useModifyTableItem = (uuid: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { page } = router.query;
  const infoService = useInfo();
  const { data }: { data: UserSettingType[] | undefined } = useQuery(
    ['usersetting', 'all'],
    () => {
      return infoService?.getAllUserSetting();
    }
  );
  const userSetting = data?.find((setting) => setting.uuid === uuid);
  const userMutation = useMutation(
    async (userId: string) => {
      return infoService?.deleteUser(userId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users', page]);
        queryClient.invalidateQueries(['users', 'all']);
      },
    }
  );
  const settingMutation = useMutation(
    async (userId: string) => {
      return infoService?.deleteUserSetting(userId);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['userSetting', 'all']);
      },
    }
  );
  const nameMutation = useMutation(
    async (info: { name: string; id: string }) => {
      return infoService?.patchUserName(info);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users', page]);
      },
    }
  );

  return { userSetting, userMutation, settingMutation, nameMutation };
};

export { useModifyTableItem };