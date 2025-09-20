import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { mockProducts } from '../data/mockData';
import ActivityErrorModal from '../components/ActivityErrorModal';
import { UserActivity } from '../data/mockActivities';
import { useAuth } from './AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://pet-love-backend.onrender.com/api';

interface UserActivitiesContextType {
  activities: UserActivity[];
  addActivity: (activity: UserActivity) => void;
  clearActivities: () => void;
}

const UserActivitiesContext = createContext<UserActivitiesContextType | undefined>(undefined);

export const useUserActivities = () => {
  const context = useContext(UserActivitiesContext);
  if (!context) {
    throw new Error('useUserActivities must be used within a UserActivitiesProvider');
  }
  return context;
};

export const UserActivitiesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper to convert backend order/adoption/appointment to UserActivity
  const convertToActivity = (item: any, type: string): UserActivity => {
    if (type === 'purchase') {
      return {
        id: item._id,
        type: 'purchase',
        date: item.date || '',
        status: item.status || '',
        details: {
          items: item.items && Array.isArray(item.items)
          ? item.items.map((orderItem: any) => {
              // If orderItem.product exists, use it, otherwise fallback to flat structure
              let product = orderItem.product || orderItem;
              // Try to find full product details from mockProducts if missing
              let found = undefined;
              if (product.image) {
                found = mockProducts.find((p: any) => p.image === product.image);
              }
              if (!found && product.id) {
                found = mockProducts.find((p: any) => p.id === product.id);
              }
              if (found) {
                product = { ...found, ...product };
              }
              return {
                ...orderItem,
                product: {
                  ...product,
                  name: product.name || 'Unknown Product',
                  price: product.price || 0,
                  image: product && product.image ? product.image : 'https://placehold.co/100x100?text=No+Image'
                }
              };
            })
          : [],
          total: item.total,
        }
      };
    }
    if (type === 'adoption') {
      return {
        id: item._id,
        type: 'adoption',
        date: item.date || '',
        status: item.status || '',
        details: {
          pet: item.petId ? {
            id: item.petId,
            name: item.petName,
            image: item.petImage,
            breed: item.petBreed,
            type: item.petType,
            gender: item.petGender,
            age: item.petAge,
            size: item.petSize,
            location: item.petLocation,
            description: item.petDescription
          } : {}
        }
      };
    }
    if (type === 'appointment') {
      return {
        id: item._id,
        type: 'appointment',
        date: item.date || '',
        status: item.status || '',
        details: {
          clinic: item.clinicName ? { name: item.clinicName, id: item.clinicId, address: item.clinicAddress, image: item.petImage } : {},
          petName: item.petName,
          clinicImage: item.petImage, // For UI display of clinic image in appointment orders
          petId: item.petId,
          reason: item.reason,
          time: item.time
        }
      };
    }
    if (type === 'visit') {
      return {
        id: item._id,
        type: 'visit',
        date: item.date ? new Date(item.date).toISOString().split('T')[0] : '',
        status: item.status || '',
        details: {
          pet: item.petId ? {
            id: item.petId,
            name: item.petName,
            image: item.petImage
          } : {},
          time: item.time,
          location: item.location
        }
      };
    }
    return item;
  };

  // Fetch all activities for the user
  useEffect(() => {
    const fetchActivities = async () => {
      console.log('[UserActivitiesContext] user:', user);
      if (!user) {
        setActivities([]);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const ordersUrl = `${API_BASE}/orders/${user.id}`;
        const adoptionsUrl = `${API_BASE}/adoptions/${user.id}`;
        const appointmentsUrl = `${API_BASE}/appointments/${user.id}`;
        const visitsUrl = `${API_BASE}/visits/${user.id}`;
        console.log('[UserActivitiesContext] Fetching:', ordersUrl, adoptionsUrl, appointmentsUrl, visitsUrl);
        const [ordersRes, adoptionsRes, appointmentsRes, visitsRes] = await Promise.all([
          fetch(ordersUrl),
          fetch(adoptionsUrl),
          fetch(appointmentsUrl),
          fetch(visitsUrl)
        ]);
        if (!ordersRes.ok || !adoptionsRes.ok || !appointmentsRes.ok || !visitsRes.ok) {
          throw new Error('One or more activity fetches failed');
        }
        const [orders, adoptions, appointments, visits] = await Promise.all([
          ordersRes.json(),
          adoptionsRes.json(),
          appointmentsRes.json(),
          visitsRes.json()
        ]);
        console.log('[UserActivitiesContext] Fetched:', { orders, adoptions, appointments, visits });
        const allActivities: UserActivity[] = [
          ...orders.map((o: any) => convertToActivity(o, 'purchase')),
          ...adoptions.map((a: any) => convertToActivity(a, 'adoption')),
          ...appointments.map((a: any) => convertToActivity(a, 'appointment')),
          ...visits.map((v: any) => convertToActivity(v, 'visit'))
        ];
        // Sort by date descending
        allActivities.sort((a, b) => (b.date > a.date ? 1 : -1));
        setActivities(allActivities);
      } catch (err: any) {
        console.error('[UserActivitiesContext] Error fetching activities:', err);
        setError('Failed to load activities: ' + (err?.message || err));
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, [user]);

  // Add activity and persist to backend
  const addActivity = async (activity: UserActivity) => {
    if (!user) return;
    let endpoint = '';
    let body: any = {};
    if (activity.type === 'purchase') {
      endpoint = `${API_BASE}/orders`;
      body = {
        userId: user.id,
        items: activity.details.items.map((item: any) => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          image: item.product.image,
          quantity: item.quantity
        })),
        total: activity.details.total,
        status: activity.status,
        date: activity.date
      };
    } else if (activity.type === 'visit') {
      endpoint = `${API_BASE}/visits`;
      body = {
        userId: user.id,
        petId: activity.details.pet?.id,
        petName: activity.details.pet?.name,
        petImage: activity.details.pet?.image,
        time: activity.details.time,
        location: activity.details.location,
        status: activity.status,
        date: activity.date ? new Date(activity.date).toISOString() : undefined
      };
    } else if (activity.type === 'adoption') {
      endpoint = `${API_BASE}/adoptions`;
      body = {
        userId: user.id,
        petId: activity.details.pet?.id,
        petName: activity.details.pet?.name,
        petImage: activity.details.pet?.image,
        petBreed: activity.details.pet?.breed,
        petType: activity.details.pet?.type,
        petGender: activity.details.pet?.gender,
        petAge: activity.details.pet?.age,
        petSize: activity.details.pet?.size,
        petLocation: activity.details.pet?.location,
        petDescription: activity.details.pet?.description,
        status: activity.status,
        date: activity.date
      };
    } else if (activity.type === 'appointment') {
      endpoint = `${API_BASE}/appointments`;
      body = {
        userId: user.id,
        clinicId: activity.details.clinic?.id,
        clinicName: activity.details.clinic?.name,
        clinicAddress: activity.details.clinic?.address,
        petId: activity.details.petId,
        petName: activity.details.petName,
        petImage: activity.details.petImage,
        reason: activity.details.reason,
        time: activity.details.time,
        status: activity.status,
        date: activity.date
      };
    }
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        if (response.status === 409) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Duplicate activity');
        } else {
          throw new Error('Failed to add activity');
        }
      }
      const data = await response.json();
      setActivities(prev => [{ ...activity, id: data._id }, ...prev]);
    } catch (err: any) {
      if (err.message === 'You have already adopted this pet.') {
        setError('You have already adopted this pet.');
      } else if (err.message === 'You have already scheduled a visit for this pet on this day.') {
        setError('You have already scheduled a visit for this pet on this day.');
      } else if (err.message === 'Duplicate activity') {
        setError('This adoption or visit already exists. Please try again.');
      } else {
        setError('Failed to add activity');
      }
    }
  };

// ...

  const [showErrorModal, setShowErrorModal] = useState(false);
  React.useEffect(() => {
    if (error) setShowErrorModal(true);
  }, [error]);

  // Provide a dummy clearActivities function to avoid TS error
  const clearActivities = () => {};
  return (
    <>
      <UserActivitiesContext.Provider value={{ activities, addActivity, clearActivities }}>
        {loading && <div>Loading activities...</div>}
        {children}
      </UserActivitiesContext.Provider>
      {showErrorModal && error && (
        <ActivityErrorModal
          message={error}
          onClose={() => { setShowErrorModal(false); setError(null); }}
        />
      )}
    </>
  );
};

