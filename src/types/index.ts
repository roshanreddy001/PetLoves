export interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  phone?: string;
  createdAt: Date;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  type: 'dog' | 'cat' | 'bird' | 'other';
  age: number;
  location: string;
  image: string;
  description: string;
  isAvailable: boolean;
  gender: 'male' | 'female';
  size: 'small' | 'medium' | 'large';
}

export interface VetClinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  location: string;
  specialties: string[];
  rating: number;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'food' | 'toy' | 'accessory' | 'healthcare';
  price: number;
  image: string;
  description: string;
  animalType: string[];
  inStock: boolean;
  rating: number;
}

export interface Appointment {
  id: string;
  vetClinicId: string;
  userEmail: string;
  petName: string;
  date: string;
  time: string;
  reason: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface CartItem {
  product: Product;
  quantity: number;
}