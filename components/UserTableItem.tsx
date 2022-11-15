import React, { useState } from 'react';
import { BsArrowUp, BsTrash } from 'react-icons/bs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { UserSettingType, UserTableType } from '../models/InfoTypes';
import { useInfo } from '../hooks/useInfo';

interface UserTableItemProps {
  item: UserTableType;
}

export default function UserTableItem({ item }: UserTableItemProps) {
  const [isModifying, setIsModifying] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();
  const { page } = router.query;
  const infoService = useInfo();
  const userMutation = useMutation(
    async (id: string) => {
      return infoService?.deleteUser(id);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users', page]);
      },
    }
  );
  const settingMutation = useMutation(
    async (id: string) => {
      return infoService?.deleteUserSetting(id);
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
  const { data }: { data: UserSettingType[] | undefined } = useQuery([
    'usersetting',
    'all',
  ]);
  const userSetting = data?.find((setting) => setting.uuid === item.uuid);
  const [name, setName] = useState(item.name);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget;
    setName(value);
  };
  const toggleIsModifying = () => {
    setIsModifying((prev) => !prev);
  };

  const handleEdit = () => {
    nameMutation.mutate({ id: item.id.toString(), name });
    toggleIsModifying();
  };

  const handleDelete = () => {
    userMutation.mutate(item.id.toString());
    settingMutation.mutate(userSetting?.id.toString() || '');
  };

  return (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
      <td className="py-1 text-center px-2">
        {isModifying ? (
          <div className="flex text-xs">
            <input
              type="text"
              className="border w-24 mr-1 text-center"
              value={name}
              onChange={handleChange}
            />
            <button
              type="button"
              className="bg-blue-100 px-1"
              onClick={handleEdit}
            >
              <BsArrowUp />
            </button>
          </div>
        ) : (
          <span>{item.name}</span>
        )}
      </td>
      <td className="py-1 text-center px-2">{item.account_count}</td>
      <td className="py-1 text-center px-2">{item.email}</td>
      <td className="py-1 text-center px-2">{item.gender_origin}</td>
      <td className="py-1 text-center px-2">{item.birth_date}</td>
      <td className="py-1 text-center px-2">{item.phone_number}</td>
      <td className="py-1 text-center px-2">{item.last_login}</td>
      <td className="py-1 text-center px-2">
        {item.allow_marketing_push.toString()}
      </td>
      <td className="py-1 text-center px-2">{item.is_active.toString()}</td>
      <td className="py-1 text-center px-2">{item.created_at}</td>
      <td className="py-1 text-center px-2 cursor-pointer">
        <button type="button" onClick={toggleIsModifying}>
          Edit
        </button>
      </td>
      <td className="py-1 text-center px-2 cursor-pointer">
        <button type="button" onClick={handleDelete}>
          <BsTrash />
        </button>
      </td>
    </tr>
  );
}