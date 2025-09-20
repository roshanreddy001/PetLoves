import { Pet, VetClinic, Product } from '../types';

export const mockPets: Pet[] = [
  {
    id: '1',
    name: 'Max',
    breed: 'Golden Retriever',
    type: 'dog',
    age: 3,
    location: 'Mumbai, Maharashtra',
    image: 'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'A friendly and energetic Golden Retriever looking for a loving family.',
    isAvailable: true,
    gender: 'male',
    size: 'large'
  },
  {
    id: '2',
    name: 'Luna',
    breed: 'Persian Cat',
    type: 'cat',
    age: 2,
    location: 'Delhi, India',
    image: 'https://images.pexels.com/photos/104827/cat-pet-animal-domestic-104827.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'A gentle and affectionate Persian cat who loves to cuddle.',
    isAvailable: true,
    gender: 'female',
    size: 'medium'
  },
  {
    id: '3',
    name: 'Charlie',
    breed: 'Labrador Mix',
    type: 'dog',
    age: 5,
    location: 'Bengaluru, Karnataka',
    image: 'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'A loyal and well-trained Labrador mix perfect for active families.',
    isAvailable: true,
    gender: 'male',
    size: 'large'
  },
  {
    id: '4',
    name: 'Bella',
    breed: 'Maine Coon',
    type: 'cat',
    age: 1,
    location: 'Hyderabad, Telangana',
    image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'A playful Maine Coon kitten with a beautiful coat.',
    isAvailable: true,
    gender: 'female',
    size: 'medium'
  },
  {
    id: '5',
    name: 'Ruby',
    breed: 'Cockatiel',
    type: 'bird',
    age: 1,
    location: 'Kolkata, West Bengal',
    image: 'https://media.istockphoto.com/id/1344617217/photo/funny-cockatiel-yellow-parrot-on-the-floor-at-home.jpg?s=612x612&w=0&k=20&c=TkMukg_wIOp5Mj1Ehid3NrlYSpujInvIFyLzCD4MH4c=',
    description: 'A vibrant and social cockatiel who loves to sing.',
    isAvailable: true,
    gender: 'female',
    size: 'small'
  },
  {
    id: '6',
    name: 'Rocky',
    breed: 'Bulldog',
    type: 'dog',
    age: 4,
    location: 'Chennai, Tamil Nadu',
    image: 'https://www.shutterstock.com/image-photo/english-bulldog-posing-outdoor-photo-600nw-2512649549.jpg',
    description: 'A calm and friendly bulldog who loves relaxing and short walks.',
    isAvailable: true,
    gender: 'male',
    size: 'medium'
  },
  {
    id: '7',
    name: 'Chintu',
    breed: 'Indian Pariah Dog',
    type: 'dog',
    age: 2,
    location: 'Pune, Maharashtra',
    image: 'https://www.shutterstock.com/image-photo/lonely-cute-brown-puppy-sitting-600nw-2239428987.jpg',
    description: 'A smart and low-maintenance Indian Pariah dog, perfect for families.',
    isAvailable: true,
    gender: 'male',
    size: 'medium'
  },
  {
    id: '8',
    name: 'Mithu',
    breed: 'Budgerigar',
    type: 'bird',
    age: 1,
    location: 'Ahmedabad, Gujarat',
    image: 'https://preview.redd.it/d4j42htc2sh71.jpg?width=640&crop=smart&auto=webp&s=1eac8a475155f1d3af2ad2f69c5de33602a0126a',
    description: 'A talkative and playful budgie who enjoys human company.',
    isAvailable: true,
    gender: 'female',
    size: 'small'
  },
  {
    id: '9',
    name: 'Snowy',
    breed: 'White Rabbit',
    type: 'other',
    age: 1,
    location: 'Jaipur, Rajasthan',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/%E0%B4%AE%E0%B5%81%E0%B4%AF%E0%B5%BD_0016.JPG/1200px-%E0%B4%AE%E0%B5%81%E0%B4%AF%E0%B5%BD_0016.JPG',
    description: 'A cuddly and calm rabbit who loves munching on carrots.',
    isAvailable: true,
    gender: 'female',
    size: 'small'
  },
  {
    id: '10',
    name: 'Goldie',
    breed: 'Goldfish',
    type: 'other',
    age: 1,
    location: 'Lucknow, Uttar Pradesh',
    image: 'https://images.pexels.com/photos/128756/pexels-photo-128756.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'A cheerful goldfish that brings life to your aquarium.',
    isAvailable: true,
    gender: 'male',
    size: 'small'
  },
  {
    id: '11',
    name: 'Leo',
    breed: 'Indie Cat',
    type: 'cat',
    age: 2,
    location: 'Visakhapatnam, Andhra Pradesh',
    image: 'https://images.pexels.com/photos/127028/pexels-photo-127028.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'A playful and smart Indie cat who loves to explore surroundings.',
    isAvailable: true,
    gender: 'male',
    size: 'medium'
  },
  {
    id: '12',
    name: 'Tuffy',
    breed: 'Angora Rabbit',
    type: 'other',
    age: 2,
    location: 'Coimbatore, Tamil Nadu',
    image: 'https://www.shutterstock.com/image-photo/brown-white-angora-rabbit-on-600nw-2516187359.jpg',
    description: 'A fluffy Angora rabbit that enjoys gentle grooming and cuddles.',
    isAvailable: true,
    gender: 'male',
    size: 'small'
  }

];


export const mockVetClinics: VetClinic[] = [
  {
    id: '1',
    name: 'Happy Paws Veterinary Clinic',
    address: '5th Floor, Cyber Towers, Hitech City Road, Madhapur',
    phone: '9283290121',
    location: 'Hyderabad, Telangana',
    specialties: ['General Care', 'Surgery', 'Dental Care'],
    rating: 4.8,
    image: 'https://images.pexels.com/photos/6235231/pexels-photo-6235231.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    name: 'Pet Care Center',
    address: '221B, Baker Street, Koramangala 4th Block',
    phone: '9283290126',
    location: 'Bengaluru, Karnataka',
    specialties: ['Emergency Care', 'Cardiology', 'Orthopedics'],
    rating: 4.9,
    image: 'https://images.pexels.com/photos/5731849/pexels-photo-5731849.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    name: 'Animal Hospital Plus',
    address: '17A, Park Street, Near Camac Street Crossing',
    phone: '9283290127',
    location: 'Kolkata, West Bengal',
    specialties: ['Exotic Animals', 'Dermatology', 'Nutrition'],
    rating: 4.7,
    image: 'https://plus.unsplash.com/premium_photo-1661930499786-47423192e185?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Dog Food',
    category: 'food',
    price: 3000,
    image: 'https://cdn.pixabay.com/photo/2021/12/14/17/00/dog-treats-6870910_1280.jpg',
    description: 'High-quality nutrition for adult dogs with real chicken and vegetables.',
    animalType: ['dog'],
    inStock: true,
    rating: 4.8
  },
  {
    id: '2',
    name: 'LARYNX Interactive Cat Toys Rolling Ball',
    category: 'toy',
    price: 250,
    image: 'https://m.media-amazon.com/images/I/71iQtzjsr6L._SL1500_.jpg',
    description: 'Ball Toy with USB Rechargeable, stimulating Dogs Toy',
    animalType: ['cat'],
    inStock: true,
    rating: 4.6
  },
  {
    id: '3',
    name: 'Pet Carrier',
    category: 'accessory',
    price: 400,
    image: 'https://images.pexels.com/photos/5732451/pexels-photo-5732451.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Comfortable and secure travel carrier for small to medium pets.',
    animalType: ['dog', 'cat'],
    inStock: true,
    rating: 4.9
  },
  {
    id: '4',
    name: 'Cat Litter Premium',
    category: 'accessory',
    price: 600,
    image: 'https://images.pexels.com/photos/6568949/pexels-photo-6568949.jpeg?auto=compress&cs=tinysrgb&w=400',
    description: 'Odor-control clumping litter that keeps your home fresh.',
    animalType: ['cat'],
    inStock: true,
    rating: 4.7
  },
  {
    id: '5',
    name: 'Rosona Dog Shampoo',
    category: 'healthcare',
    price: 800,
    image: 'https://images.unsplash.com/photo-1647002380358-fc70ed2f04e0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: 'Gentle, hypoallergenic shampoo for sensitive skin.',
    animalType: ['dog'],
    inStock: true,
    rating: 4.5
  },
  {
    id: '6',
    name: 'Bird Seed Mix',
    category: 'food',
    price: 1100,
    image: 'https://cdn.pixabay.com/photo/2018/08/12/19/49/grains-3601581_1280.jpg',
    description: 'Nutritious seed blend for cockatiels and small parrots.',
    animalType: ['bird'],
    inStock: true,
    rating: 4.8
  },
  {
    id: '7',
    name: 'Premium Cat Food',
    category: 'food',
    price: 2500,
    image: 'https://cdn.pixabay.com/photo/2019/07/30/09/51/cats-4372525_1280.jpg',
    description: 'High-quality nutrition for adult cats with real chicken and vegetables.',
    animalType: ['cat'],
    inStock: true,
    rating: 4.6
  },
  {
    id: '8',
    name: 'Rabbit Food',
    category: 'food',
    price: 1500,
    image: 'https://cdn.pixabay.com/photo/2020/11/03/16/49/rabbit-5710427_1280.jpg',
    description: 'High‑quality nutrition for adult rabbits with real hay, wholesome pellets, and natural ingredients.',
    animalType: ['rabbit'],
    inStock: true,
    rating: 4.6
  },
  {
    id: '9',
    name: 'Arowana Fish Food',
    category: 'food',
    price: 1500,
    image: 'https://aquariumproductsindia.in/cdn/shop/files/5a.jpg?v=1739014270&width=990',
    description: 'Handmade Ayurvedic Diet for Asian Arowanas | Color Boost, Muscle Growth & Immunity ',
    animalType: ['Fish Food'],
    inStock: true,
    rating: 4.6
  },
  {
    id: '10',
    name: 'Life Aayu Bug Protein Bites-for Carnivorous Fish! ',
    category: 'food',
    price: 600,
    image: 'https://aquariumproductsindia.in/cdn/shop/files/BUGPOWERPROTEINBITESWITHFOOD_eb3c7c52-ea75-416a-9100-f781051d8e06.jpg?v=1751526777&width=990',
    description: 'High-Protein Handmade Fish Food with Natural Insect Ingredients',
    animalType: ['Fish Food'],
    inStock: true,
    rating: 4.65
  },
  {
    id: '11',
    name: 'Nutritionally Formulated Puppy Dog Food',
    category: 'food',
    price: 900,
    image: 'https://www.gooddogindia.com/cdn/shop/files/AMAZON_LISTINGPUPPYDOGDOGFEB25_1.jpg?v=1749469492&width=1800',
    description: 'Good Dog Food is Fortified Food which is enhanced with Vitamins A,D,E, minerals, Omega 3&6 and  additional nutrients.',
    animalType: ['Dog Food'],
    inStock: true,
    rating: 4.75
  },
  {
    id: '12',
    name: 'Life AAYU Goldfish Food - 100g',
    category: 'food',
    price: 500,
    image: 'https://aquariumproductsindia.in/cdn/shop/files/Goldfish_100g_Front_bb21f82b-0f55-4ec8-804e-5070bc9b21dd.jpg?v=1739275437&width=990',
    description: 'Ayurvedic Soft-Sinking Pellets with Tulsi, Papaya & Red Paprika for Color, Digestion & Immunity (100g)',
    animalType: ['Fish Food'],
    inStock: true,
    rating: 4.45
  },
  {
    id: '13',
    name: 'FRISKIES® Adult Surfin Favourites Dry Cat Food',
    category: 'food',
    price: 2000,
    image: 'https://www.purina.in/sites/default/files/styles/product_380x380/public/2023-05/FRISKIES%C2%AE-Adult-Surfin%27-Favourites-Dry-Cat-Food_0.jpg?itok=RdlVmhsS',
    description: 'Mackerel, Tuna, Salmon & Sardine Flavour Complete & balanced nutrition Protein to help maintain strong lean muscles Essential Fatty Acids with Omega 3 & 6 for a healthy skin & coat',
    animalType: ['Cat Food'],
    inStock: true,
    rating: 4.55
  },
  {
    id: '14',
    name: 'ZuPreem Bird Food',
    category: 'food',
    price: 1700,
    image: 'https://m.media-amazon.com/images/I/81wQkc4Dj+L._SX679_.jpg',
    description: 'Natural with Added Vitamins, Minerals, Amino Acid for Medium Birds 1.1-Kg for All Life Stages',
    animalType: ['Bird Food'],
    inStock: true,
    rating: 4.65
  },
  {
    id: '15',
    name: 'Versele Laga Rabbit Food for adult rabbits-1.75 kg',
    category: 'food',
    price: 2100,
    image: 'https://m.media-amazon.com/images/I/812YhkhOgpS._SY879_.jpg',
    description: 'All-in-one - prevents selective eating behaviour Enriched with elderberries and herbs for better ingestion and good condition ',
    animalType: ['Rabbit Food'],
    inStock: true,
    rating: 4.8
  },
  {
    id: '16',
    name: 'BOLTZ Parrot Food 1Kg',
    category: 'food',
    price: 400,
    image: 'https://m.media-amazon.com/images/I/41L0Qj9djKL._SX300_SY300_QL70_FMwebp_.jpg',
    description: 'For Big Parrot,African Grey Parrot,Sun Conure,Macaw,Lovebird And Alexander - All Life Stages Mix Seeds,1 Kg, 1 Count',
    animalType: ['Bird Food'],
    inStock: true,
    rating: 4.75
  },
  {
    id: '17',
    name: 'Fitzy Cat Shampoo',
    category: 'healthcare',
    price: 700,
    image: 'https://media.istockphoto.com/id/622964480/photo/the-process-of-washing-the-cat.jpg?s=2048x2048&w=is&k=20&c=3jCt-6OzjjXE2X-Bn4KjRhcJQd1ZkIHsfPHj1udGC-w=',
    description: 'Perfect for regular grooming and vet-recommended for cats with sensitive or itchy skin.',
    animalType: ['cat'],
    inStock: true,
    rating: 4.6
  },
  {
    id: '18',
    name: 'Poop-Off® Bird Poop Remover- 1 litre',
    category: 'accessory',
    price: 2000,
    image: 'https://www.nixalite.com/scaleimage2.aspx?w=1000&img=%2fSiteContent%2fNixaliteFiles%2fFamilies%2f92%2fBIRD+POOP+REMOVER+QT.jpg',
    description: 'Biodegradable bird cage and fabric cleaner that quickly and safely breaks down and dissolves bird droppings. Poop Off uses naturally occurring, active enzymes and biodegradable cleaners. It does not use solvents, orange extracts, detergents, alcohol or bleach.',
    animalType: ['bird'],
    inStock: true,
    rating: 4.7
  },
  {
    id: '19',
    name: 'Quanlong Fish Tank Cleaner',
    category: 'accessory',
    price: 150,
    image: 'https://www.petzlifeworld.in/cdn/shop/files/2_bd00b52c-c6b9-4e86-ad05-72da5a13bfff.jpg?v=1724134573&width=713',
    description: 'Salt & Stone Dust Remover for Aquarium Fish Tank.',
    animalType: ['fish'],
    inStock: true,
    rating: 4.45
  },
  {
    id: '20',
    name: 'FishBoat Aquarium decoratives',
    category: 'accessory',
    price: 1000,
    image: 'https://beenaaquarium.com/image/cache/catalog/Catagory/aquarium-toys-new-460x460.jpg',
    description: 'Crafted from non-toxic, fish-safe resin, it provides both aesthetic appeal and functional hiding spots for your aquatic pets.',
    animalType: ['fish'],
    inStock: true,
    rating: 4.65
  },
  {
    id: '21',
    name: 'PetVogue Chew Toys for Aggressive Chewers',
    category: 'accessory',
    price: 550,
    image: 'https://m.media-amazon.com/images/I/61rkX2bteTL._SX679_.jpg',
    description: 'Teeth Cleaning Toothbrush, Indestructible Tough Interactive Durable Nylon Toys for Large and Medium Breed Dogs.',
    animalType: ['dog'],
    inStock: true,
    rating: 4.62
  },
  {
    id: '22',
    name: 'Blue Shark Raincoat',
    category: 'accessory',
    price: 2499,
    image: 'https://dogobow.com/cdn/shop/files/BlueSharkRaincoat0.jpg?v=1716031037&width=600',
    description: 'Keep your furry friend dry and stylish with the Dino Pet Raincoat, a perfect blend of fun and functionality.',
    animalType: ['dog'],
    inStock: true,
    rating: 4.64
  },
  {
    id: '23',
    name: 'Monster Print Shirt',
    category: 'accessory',
    price: 999,
    image: 'https://dogobow.com/cdn/shop/files/IMG_4063_2.jpg?v=1736587812&width=600',
    description: 'Made from soft, breathable fabric, it is perfect for keeping your furry friend comfy.',
    animalType: ['dog','cat'],
    inStock: true,
    rating: 4.75
  },
  {
    id: '24',
    name: 'Flag Print Pet Collar',
    category: 'accessory',
    price: 300,
    image: 'https://dogobow.com/cdn/shop/products/Flagprintcatcollar.jpg?v=1634473878',
    description: 'This collar adds a statement to your pet’s look while keeping them secure and comfortable all day long.',
    animalType: ['dog','cat'],
    inStock: true,
    rating: 4.72
  }
  
];