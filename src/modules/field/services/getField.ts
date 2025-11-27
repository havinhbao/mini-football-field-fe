import { fetchFields } from '@/api';

export const getFields = async () => {
  const fields = await fetchFields();

  return fields;
};
