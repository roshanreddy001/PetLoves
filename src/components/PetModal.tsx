import React, { useState } from 'react';
import { X, MapPin, Heart, User, Calendar, Phone, Mail } from 'lucide-react';
import { Pet } from '../types';
import { useUserActivities } from '../context/UserActivitiesContext';
import { UserActivity } from '../data/mockActivities';
import AutoCloseSuccess from './AutoCloseSuccess';

interface PetModalProps {
  pet: Pet;
  onClose: () => void;
}

const PetModal: React.FC<PetModalProps> = ({ pet, onClose }) => {
  const { addActivity } = useUserActivities();
  const [adopted, setAdopted] = useState(false);
  const [showVisit, setShowVisit] = useState(false);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [visitConfirmed, setVisitConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
  ];

  const handleAdopt = async () => {
    try {
      setError(null);
      const adoptionId = Date.now().toString();
      const dateStr = new Date().toISOString().split('T')[0];
      await addActivity({
        id: adoptionId,
        type: 'adoption',
        date: dateStr,
        status: 'pending',
        details: { pet }
      } as UserActivity);
      setAdopted(true);
    } catch (err: any) {
      setError(err?.message || 'Failed to start adoption.');
      setTimeout(() => {
        setError(null);
        setAdopted(false);
        onClose();
      }, 2000);
    }
  };

  const handleScheduleVisit = () => {
    setShowVisit(true);
  };

  const handleConfirmVisit = async () => {
    if (selectedTime && selectedDate) {
      try {
        setError(null);
        const visitId = Date.now().toString();
        await addActivity({
          id: visitId,
          type: 'visit',
          date: selectedDate,
          status: 'scheduled',
          details: {
            pet,
            time: selectedTime,
            location: pet.location
          }
        } as unknown as UserActivity);
        setVisitConfirmed(true);
      } catch (err: any) {
        setError(err?.message || 'Failed to schedule visit.');
        setTimeout(() => {
          setError(null);
          setVisitConfirmed(false);
          onClose();
        }, 2000);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-sm sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4 text-center">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="relative h-48 sm:h-64 md:h-80">
          <img
            src={pet.image}
            alt={pet.name}
            className="w-full h-full object-cover rounded-t-xl sm:rounded-t-2xl"
          />
          <button
            onClick={() => { setError(null); onClose(); }}
            className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 sm:p-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{pet.name}</h2>
            <p className="text-white/90 text-base sm:text-lg">{pet.breed}</p>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Gender</p>
                <p className="font-medium text-sm sm:text-base capitalize">{pet.gender}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Age</p>
                <p className="font-medium text-sm sm:text-base">{pet.age} years old</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Size</p>
                <p className="font-medium text-sm sm:text-base capitalize">{pet.size}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Location</p>
                <p className="font-medium text-sm sm:text-base">{pet.location}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3">About {pet.name}</h3>
            <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{pet.description}</p>
          </div>

          <div className="border-t pt-4 sm:pt-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Ready to Adopt?</h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center space-x-2 sm:space-x-3 p-3 bg-orange-50 rounded-lg">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Call us</p>
                  <p className="font-medium text-orange-600 text-sm sm:text-base">9283290123</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-3 p-3 bg-blue-50 rounded-lg">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Email us</p>
                  <p className="font-medium text-blue-600 text-sm sm:text-base">adopt@petlove.com</p>
                </div>
              </div>
            </div>
          </div>

          {adopted && !error ? (
            <div className="flex flex-col items-center justify-center py-6">
              <h4 className="text-xl font-bold text-green-600 mb-2">Adoption Started!</h4>
              <p className="text-gray-600">Our team will contact you soon through mails.</p>
              <button
                onClick={onClose}
                className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
              >
                Close
              </button>
            </div>
          ) : showVisit ? (
            visitConfirmed && !error ? (
              <AutoCloseSuccess onClose={onClose}>
                <div className="flex flex-col items-center justify-center py-6">
                  <h4 className="text-xl font-bold text-green-600 mb-2">Visit Scheduled!</h4>
                  <p className="text-gray-600">Visit {pet.location} at {selectedTime} on {selectedDate} to meet {pet.name}.</p>
                  <button
                    onClick={onClose}
                    className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              </AutoCloseSuccess>
            ) : (
              <div className="flex flex-col items-center justify-center py-6">
                <h4 className="text-lg font-bold text-orange-600 mb-4">Select a Date & Time Slot for Your Visit</h4>
                <div className="mb-4 w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    min={(() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })()}
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      className={`px-4 py-2 rounded-lg border font-semibold transition-colors ${selectedTime === slot ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800 hover:bg-orange-100'}`}
                      onClick={() => setSelectedTime(slot)}
                      type="button"
                    >
                      {slot}
                    </button>
                  ))}
                </div>
                <button
                  disabled={!selectedTime || !selectedDate}
                  onClick={handleConfirmVisit}
                  className={`w-full mt-2 py-2 rounded-lg font-semibold transition-colors ${(selectedTime && selectedDate) ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                >
                  Confirm Visit
                </button>
                <button
                  onClick={() => setShowVisit(false)}
                  className="mt-3 w-full border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            )
          ) : (
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 text-sm sm:text-base"
                onClick={handleAdopt}
              >
                Start Adoption Process
              </button>
              <button
                className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl font-semibold hover:bg-gray-50 transition-colors text-sm sm:text-base"
                onClick={handleScheduleVisit}
              >
                Schedule Visit
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PetModal;