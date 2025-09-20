import React, { useState } from 'react';
import { MapPin, Phone, Star, Calendar, Clock, User, Heart, AlertCircle } from 'lucide-react';
import { mockVetClinics } from '../data/mockData';
import { VetClinic } from '../types';
import { useUserActivities } from '../context/UserActivitiesContext';
import { UserActivity } from '../data/mockActivities';

const PetMedicarePage: React.FC = () => {
  const { addActivity } = useUserActivities();
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<VetClinic | null>(null);
  const [visitData, setVisitData] = useState({
    date: '',
  });
  const [appointmentData, setAppointmentData] = useState({
    petName: '',
    date: '',
    time: '',
    reason: '',
    ownerName: '',
    phone: '',
  });
  const [success, setSuccess] = useState(false);

  const locations = [
    'Mumbai, Maharashtra',
    'Delhi, India',
    'Bengaluru, Karnataka',
    'Hyderabad, Telangana',
    'Kolkata, West Bengal',
    'Chennai, Tamil Nadu'
  ];
  const timeSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const filteredClinics = selectedLocation
    ? mockVetClinics.filter(clinic => clinic.location === selectedLocation)
    : mockVetClinics;

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    // Add appointment activity
    if (selectedClinic) {
      const appointmentId = Date.now().toString();
      const dateStr = appointmentData.date || new Date(Date.now() + 86400000).toISOString().split('T')[0];
      // Randomize time if not chosen
      const time = appointmentData.time || `${Math.floor(Math.random() * 8) + 9}:00`;
      addActivity({
        id: appointmentId,
        type: 'appointment',
        date: dateStr,
        status: 'confirmed',
        details: {
          clinic: selectedClinic,
          petName: appointmentData.petName,
          petImage: selectedClinic.image,
          time: time,
          reason: appointmentData.reason
        }
      } as UserActivity);
    }
    setTimeout(() => {
      setShowAppointmentForm(false);
      setSelectedClinic(null);
      setSuccess(false);
      setAppointmentData({
        petName: '',
        date: '',
        time: '',
        reason: '',
        ownerName: '',
        phone: '',
      });
    }, 2000);
  };


  return (
    <div className="space-y-8 bg-white min-h-screen">
      {/* Header */}
      <div className="text-center bg-gradient-to-r from-red-50 to-pink-50 py-12 rounded-2xl mx-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Pet <span className="text-red-500">Medicare</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find trusted veterinary clinics in your area and book appointments for your beloved pets.
        </p>
      </div>

      {/* Location Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mx-4 border border-red-100">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Find Veterinary Clinics</h2>
        <div className="flex items-center space-x-4">
          <MapPin className="w-5 h-5 text-red-500" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Select your location</option>
            {locations.map(location => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Clinics List */}
      <div className="space-y-6 mx-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {selectedLocation ? `Clinics in ${selectedLocation}` : 'Featured Clinics'} ({filteredClinics.length})
        </h2>
        
        {filteredClinics.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No clinics found in the selected location.</p>
            <p className="text-gray-400 text-sm mt-2">Try selecting a different location.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClinics.map((clinic) => (
              <div key={clinic.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 border border-red-100">
                <img
                  src={clinic.image}
                  alt={clinic.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{clinic.name}</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{clinic.address}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">{clinic.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{clinic.rating}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-4 h-4 text-red-500" />
                    <span className="text-sm text-gray-600 font-medium">{clinic.location}</span>
                  </div>

                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-1">
                      {clinic.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-4">
  <button
    onClick={() => {
      setShowAppointmentForm(true);
      setSelectedClinic(clinic);
    }}
    className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300"
  >
    Book Appointment
  </button>
</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Appointment Modal */}
      {showAppointmentForm && selectedClinic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Book Appointment
              </h3>
              <p className="text-gray-600 mb-6">{selectedClinic.name}</p>

              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-green-500" />
                  </div>
                  <h4 className="text-xl font-bold text-green-600 mb-2">Appointment Booked!</h4>
                  <p className="text-gray-600">We'll contact you shortly to confirm your appointment.</p>
                </div>
              ) : (
                <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Owner Name
                    </label>
                    <input
                      type="text"
                      value={appointmentData.ownerName}
                      onChange={(e) => setAppointmentData({ ...appointmentData, ownerName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pet Name
                    </label>
                    <input
                      type="text"
                      value={appointmentData.petName}
                      onChange={(e) => setAppointmentData({ ...appointmentData, petName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={appointmentData.phone}
                      onChange={(e) => setAppointmentData({ ...appointmentData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="date"
                        value={appointmentData.date}
                        onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time
                      </label>
                      <select
                        value={appointmentData.time}
                        onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                        required
                      >
                        <option value="">Select time</option>
                        {timeSlots.map(time => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for Visit
                    </label>
                    <textarea
                      value={appointmentData.reason}
                      onChange={(e) => setAppointmentData({ ...appointmentData, reason: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      placeholder="Describe the reason for your visit..."
                      required
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAppointmentForm(false);
                        setSelectedClinic(null);
                      }}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300"
                    >
                      Book Appointment
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    {/* Schedule Visit Modal */}
    {showVisitForm && selectedClinic && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              Schedule Visit
            </h3>
            <p className="text-gray-600 mb-6">{selectedClinic.name}</p>
            <form
              onSubmit={e => {
                e.preventDefault();
                const visitId = Date.now().toString();
                addActivity({
                  id: visitId,
                  type: 'visit',
                  date: visitData.date,
                  status: 'scheduled',
                  details: {
                    pet: { id: 'pet1', name: appointmentData.petName, image: '' }, // TODO: select pet
                    time: '',
                    location: selectedClinic.address
                  }
                } as UserActivity);
                setShowVisitForm(false);
                setSelectedClinic(null);
                setVisitData({ date: '' });
                setAppointmentData({ ...appointmentData, petName: '' });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pet Name</label>
                <input
                  type="text"
                  value={appointmentData.petName}
                  onChange={e => setAppointmentData({ ...appointmentData, petName: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  value={visitData.date}
                  onChange={e => setVisitData({ ...visitData, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowVisitForm(false);
                    setSelectedClinic(null);
                    setVisitData({ date: '' });
                    setAppointmentData({ ...appointmentData, petName: '' });
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-400 text-white py-3 px-4 rounded-xl font-semibold hover:from-green-600 hover:to-green-500 transition-all duration-300"
                >
                  Schedule Visit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default PetMedicarePage;