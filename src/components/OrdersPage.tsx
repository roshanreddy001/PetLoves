import React from 'react';
import { useUserActivities } from '../context/UserActivitiesContext';
import { UserActivity } from '../data/mockActivities';

const OrdersPage: React.FC = () => {
  const { activities } = useUserActivities();
  return (
    <div className="space-y-8 bg-white min-h-screen rounded-2xl p-8 text-center flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-orange-600 mb-2">My Activities</h1>
      {activities.length === 0 ? (
        <div className="flex flex-col items-center mt-8">
          <svg className="w-16 h-16 text-gray-200 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1.5M3 7.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7.5M3 7.5h18M8 11h8m-8 4h5" />
          </svg>
          <p className="text-gray-500 text-lg font-medium">No activities found</p>
          <p className="text-gray-400 text-sm mt-2">You haven't placed any orders, started any adoptions, or booked any appointments yet.</p>
        </div>
      ) : (
        <div className="w-full max-w-2xl space-y-6 mt-8">
          {activities.map((activity: UserActivity) => (
            <div key={activity.id} className="bg-gray-50 rounded-xl shadow p-6 text-left">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-orange-600">
                  {activity.type === 'purchase' && `Order #${activity.id}`}
                  {activity.type === 'adoption' && `Adoption #${activity.id}`}
                  {activity.type === 'appointment' && `Appointment #${activity.id}`}
                  {activity.type === 'visit' && `Visit #${activity.id}`}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${activity.status === 'delivered' || activity.status === 'confirmed' ? 'bg-green-100 text-green-700' : activity.status === 'shipped' ? 'bg-blue-100 text-blue-700' : activity.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">Date: {activity.date}</div>
              {/* Details by activity type */}
              <>
                {activity.type === 'purchase' && (
                  <div className="divide-y divide-gray-200 mb-4">
                    {activity.details && activity.details.items && Array.isArray(activity.details.items) ? (
                      activity.details.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex items-center py-2">
                          <img src={item.product && item.product.image ? item.product.image : '/default-pet.png'} alt={item.product && item.product.name ? item.product.name : 'Product'} className="w-12 h-12 rounded-lg object-cover mr-4 border" />
                          <div className="flex-1">
                            <div className="font-medium text-gray-800">{item.product && item.product.name ? item.product.name : 'Unknown Product'}</div>
                            <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                          </div>
                          <div className="font-semibold text-gray-700">₹{item.product && item.product.price ? (item.product.price * item.quantity).toFixed(2) : '0.00'}</div>
                        </div>
                      ))
                    ) : (
                      <div className="text-red-500">Malformed purchase order data</div>
                    )}
                    <div className="flex justify-end font-bold text-orange-700 mt-2">Total: ₹{activity.details && activity.details.total ? activity.details.total.toFixed(2) : '0.00'}</div>
                  </div>
                )}
                {activity.type === 'adoption' && (
                  activity.details && activity.details.pet ? (
                    <div className="flex items-center py-2">
                      <img src={activity.details.pet.image || '/default-pet.png'} alt={activity.details.pet.name || 'Pet'} className="w-16 h-16 rounded-lg object-cover mr-4 border" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{activity.details.pet.name || 'Unknown Pet'}</div>
                        <div className="text-xs text-gray-500">Breed: {activity.details.pet.breed || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">Type: {activity.details.pet.type || 'Unknown'}</div>
                      </div>
                      <div className="font-semibold text-gray-700">Adoption Pending</div>
                    </div>
                  ) : (
                    <div className="text-red-500">Malformed adoption order data</div>
                  )
                )}
                {activity.type === 'appointment' && (
                  activity.details && activity.details.clinic ? (
                    <div className="flex items-center py-2">
                      <img src={activity.details.clinic.image || '/default-clinic.png'} alt={activity.details.clinic.name || 'Clinic'} className="w-16 h-16 rounded-lg object-cover mr-4 border" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">Clinic: {activity.details.clinic.name || 'Unknown Clinic'}</div>
                        <div className="text-xs text-gray-500">Pet: {activity.details.petName || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">Time: {activity.details.time || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">Reason: {activity.details.reason || 'Unknown'}</div>
                      </div>
                      <div className="font-semibold text-gray-700">Appointment</div>
                    </div>
                  ) : (
                    <div className="text-red-500">Malformed appointment data</div>
                  )
                )}
                {activity.type === 'visit' && (
                  activity.details && activity.details.pet ? (
                    <div className="flex items-center py-2">
                      <img src={activity.details.pet.image || '/default-pet.png'} alt={activity.details.pet.name || 'Pet'} className="w-16 h-16 rounded-lg object-cover mr-4 border" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{activity.details.pet.name || 'Unknown Pet'}</div>
                        <div className="text-xs text-gray-500">Breed: {activity.details.pet.breed || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">Type: {activity.details.pet.type || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">Location: {activity.details.location || 'Unknown'}</div>
                        <div className="text-xs text-gray-500">Time: {activity.details.time || 'Unknown'}</div>
                      </div>
                      <div className="font-semibold text-gray-700">Visit Scheduled</div>
                    </div>
                  ) : (
                    <div className="text-red-500">Malformed visit activity data</div>
                  )
                )}
              </>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Add visit activity rendering
// Show pet image, name, breed, type, location, and scheduled time

export default OrdersPage;