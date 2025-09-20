import { Product } from '../types';

export interface Order {
  id: string;
  date: string;
  items: { product: Product; quantity: number }[];
  total: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
}

export const mockOrders: Order[] = [
  {
    id: '1',
    date: '2025-07-01',
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
      },
      {
        product: {
          id: '2',
          name: 'Cat Toy Set',
          category: 'toy',
          price: 19.99,
          image: 'https://images.pexels.com/photos/6568949/pexels-photo-6568949.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Fun and interactive toys to keep your cat entertained.',
          animalType: ['cat'],
          inStock: true,
          rating: 4.6
        },
        quantity: 1
      }
    ],
    total: 111.97,
    status: 'delivered'
  },
  {
    id: '2',
    date: '2025-07-05',
    items: [
      {
        product: {
          id: '3',
          name: 'Travel Carrier',
          category: 'accessory',
          price: 39.99,
          image: 'https://images.pexels.com/photos/5732451/pexels-photo-5732451.jpeg?auto=compress&cs=tinysrgb&w=400',
          description: 'Comfortable and secure travel carrier for small to medium pets.',
          animalType: ['dog', 'cat'],
          inStock: true,
          rating: 4.9
        },
        quantity: 1
      }
    ],
    total: 39.99,
    status: 'shipped'
  }
];
