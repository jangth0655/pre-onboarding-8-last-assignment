import { AccountTableType, AccountType, UserType } from '../models/InfoTypes';
import { accountStatus, broker } from '../models/variables';
import { formatDate } from './formatDate';
import { maskAccountNumber } from './maskNumber';

const findUserName = (id: number, allUsers: UserType[]) => {
  const user = allUsers.find((item) => item.id === id);
  return user?.name || '';
};

const formatAccountTableData = (
  allUsers: UserType[],
  accountData: AccountType[]
) => {
  const { length } = accountData;
  const tableData = Array(length);
  accountData.forEach((account, idx) => {
    const {
      id,
      user_id,
      broker_id,
      number,
      status,
      name,
      assets,
      payments,
      is_active,
      created_at,
    } = account;
    const formattedItem: AccountTableType = {
      user_name: findUserName(user_id, allUsers),
      broker_name: broker[broker_id],
      number: maskAccountNumber(number),
      status: accountStatus[status],
      name,
      assets: Math.floor(+assets).toLocaleString(),
      payments: Math.floor(+payments).toLocaleString(),
      is_active,
      created_at: formatDate(created_at),
      id: id + broker_id,
      kind: 'account',
    };
    tableData[idx] = formattedItem;
  });
  return tableData;
};

export { formatAccountTableData };
