import { getBookings } from '@/api/booking';
import { FC, useEffect } from 'react';

const BookingManagementPage: FC = () => {
  useEffect(() => {
    const fetchBookings = async () => {
      const bookings = await getBookings({});

      console.log('Bookings:', bookings);
    };

    fetchBookings();
  }, []);
  return <div>Booking Management Page</div>;
};

export default BookingManagementPage;
