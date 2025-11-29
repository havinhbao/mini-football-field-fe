import { FieldSize, FieldStatus, FieldType } from '@/constants';

export interface Field {
  id: string;
  name: string;
  size: FieldSize;
  type: FieldType;
  pricePerHour: number;
  status: FieldStatus;
  images?: string[];
  pricingRules?: Array<{
    start: string;
    end: string;
    price: number;
  }>;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
