export interface Booking {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: string;
  paymentStatus: string;
  totalPrice: number;
  note?: string;
  fieldId?: string;
  field?: {
    name: string;
  };
  user?: {
    fullName: string;
    email: string;
  };
}
