import  { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useBooking } from './hooks/useBooking';
import SeatSelector from './SeatSelector';
import { Button, Loading } from '../../components';

interface ShowTime {
  id: string;
  startTime: string;
  date: string;
}

const BookingPage = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const [selectedShowTime, setSelectedShowTime] = useState<string | null>(null);
  const { movie, showTimes, seats, isLoading, error, bookSeats } = useBooking(movieId!, selectedShowTime);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{movie?.title}</h1>
      
      {/* Chọn suất chiếu */}
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Chọn suất chiếu</h2>
        <div className="flex flex-wrap gap-4">
          {showTimes?.map((showTime: ShowTime) => (
            <Button
              key={showTime.id}
              variant={selectedShowTime === showTime.id ? 'primary' : 'outline'}
              onClick={() => setSelectedShowTime(showTime.id)}
            >
              {new Date(showTime.startTime).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Button>
          ))}
        </div>
      </div>

      {/* Chọn ghế */}
      {selectedShowTime && (
        <div>
          <h2 className="mb-4 text-xl font-semibold">Chọn ghế</h2>
          <SeatSelector seats={seats} onConfirm={bookSeats} />
        </div>
      )}
    </div>
  );
};

export default BookingPage; 