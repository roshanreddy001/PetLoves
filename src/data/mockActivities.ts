import { Product, VetClinic, Pet } from '../types';

export type ActivityType = 'purchase' | 'adoption' | 'appointment' | 'visit';

export interface UserActivity {
  id: string;
  type: ActivityType;
  date: string;
  status: string;
  details: any;
}

export const mockActivities: UserActivity[] = [
  {
    id: '1',
    type: 'purchase',
    date: '2025-07-01',
    status: 'delivered',
    details: {
      items: [
        {
          product: {
            id: '1',
            name: 'Premium Dog Food',
            category: 'food',
            price: 45.99,
            image: 'https://images.pexels.com/photos/5732451/pexels-photo-5732451.jpeg?auto=compress&cs=tinysrgb&w=400',
            description: 'High-quality nutrition for adult dogs with real chicken and vegetables.',
            animalType: ['dog'],
            inStock: true,
            rating: 4.8
          },
          quantity: 2
        }
      ],
      total: 91.98
    }
  },
  {
    id: '2',
    type: 'adoption',
    date: '2025-07-02',
    status: 'pending',
    details: {
      pet: {
        id: '3',
        name: 'Charlie',
        breed: 'Labrador Mix',
        type: 'dog',
        age: 5,
        location: 'Chicago, IL',
        image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
        description: 'A loyal and well-trained Labrador mix perfect for active families.',
        isAvailable: false,
        gender: 'male',
        size: 'large'
      }
    }
  },
  {
    id: '3',
    type: 'appointment',
    date: '2025-07-03',
    status: 'confirmed',
    details: {
      clinic: {
        id: '1',
        name: 'Happy Paws Veterinary Clinic',
        address: '123 Main St, New York, NY 10001',
        phone: '(555) 123-4567',
        location: 'New York, NY',
        specialties: ['General Care', 'Surgery', 'Dental Care'],
        rating: 4.8,
        image: 'https://images.pexels.com/photos/6235231/pexels-photo-6235231.jpeg?auto=compress&cs=tinysrgb&w=400'
      },
      petName: 'Max',
      time: '10:30 AM',
      reason: 'Annual Checkup'
    }
  }
];
