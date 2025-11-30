import { fetchFields, FieldFilters } from '@/api';

export const getFields = async (filters?: FieldFilters) => {
  const fields = await fetchFields(filters);

  return fields;
};
