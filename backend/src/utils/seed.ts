import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { connectDB } from '../config/database';
import { Restaurant } from '../models/Restaurant';
import { Category } from '../models/Category';
import { Food } from '../models/Food';
import { User } from '../models/User';
import { Admin } from '../models/Admin';
import { Address } from '../models/Address';
import { Order } from '../models/Order';
import { Review } from '../models/Review';

const seedDatabase = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await connectDB();

    console.log('Clearing existing collections...');
    await Restaurant.deleteMany({});
    await Category.deleteMany({});
    await Food.deleteMany({});
    await User.deleteMany({});
    await Admin.deleteMany({});
    await Address.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});

    // 1. Seed Restaurant
    console.log('Seeding Restaurant...');
    const restaurant = await Restaurant.create({
      name: 'CloudCraves Kitchen',
      logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500',
      description: 'Authentic local cloud kitchen serving fresh biryanis, thalis, breakfasts, snacks & desserts.',
      phone: '9876543210',
      address: 'Plot 42, Main Market Road',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      openingTime: '08:00 AM',
      closingTime: '11:00 PM',
      isOpen: true,
      deliveryAvailable: true,
      minimumOrder: 100,
      deliveryCharge: 30
    });

    // 2. Seed Categories
    console.log('Seeding Categories...');
    const categories = await Category.create([
      { name: 'Breakfast', description: 'Fresh morning meals', image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=500', sortOrder: 1 },
      { name: 'Meals', description: 'Wholesome North & South thalis', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500', sortOrder: 2 },
      { name: 'Biryani', description: 'Aromatic basmati rice specialties', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500', sortOrder: 3 },
      { name: 'Snacks', description: 'Crispy local snacks and starters', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500', sortOrder: 4 },
      { name: 'Fast Food', description: 'Burgers, rolls, and quick bites', image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500', sortOrder: 5 },
      { name: 'Beverages', description: 'Refreshing teas, coffees, and drinks', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500', sortOrder: 6 },
      { name: 'Desserts', description: 'Traditional sweet treats', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500', sortOrder: 7 },
      { name: 'Specials', description: 'Chef special recommendations', image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=500', sortOrder: 8 }
    ]);

    const catMap = new Map(categories.map((c) => [c.name, c._id]));

    // 3. Seed 20 Food Items
    console.log('Seeding 20 Food Items...');
    const foods = await Food.create([
      {
        name: 'Masala Dosa',
        description: 'Crispy rice crepe filled with spiced potato masala served with coconut chutney & sambar',
        image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500',
        categoryId: catMap.get('Breakfast'),
        price: 90,
        ingredients: ['Rice', 'Lentils', 'Potato', 'Spices', 'Coconut'],
        preparationTime: '15 mins',
        spiceLevel: 'Medium',
        rating: 4.8,
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        isSpecial: false
      },
      {
        name: 'Puri Bhaji',
        description: 'Golden fried puffy puris served with tangy spiced potato gravy',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500',
        categoryId: catMap.get('Breakfast'),
        price: 80,
        ingredients: ['Wheat Flour', 'Potato', 'Tomato', 'Coriander'],
        preparationTime: '15 mins',
        spiceLevel: 'Mild',
        rating: 4.5,
        isVeg: true,
        isAvailable: true,
        isPopular: false,
        isSpecial: false
      },
      {
        name: 'Idli Sambar',
        description: 'Steamed fluffy rice cakes served with hot lentils sambar and coconut chutney',
        image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500',
        categoryId: catMap.get('Breakfast'),
        price: 70,
        ingredients: ['Rice', 'Urad Dal', 'Sambar Spices'],
        preparationTime: '10 mins',
        spiceLevel: 'Mild',
        rating: 4.6,
        isVeg: true,
        isAvailable: true,
        isPopular: false,
        isSpecial: false
      },
      {
        name: 'Veg Thali',
        description: 'Complete meal with Paneer Sabzi, Dal Tadka, Roti, Rice, Salad, and Gulab Jamun',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500',
        categoryId: catMap.get('Meals'),
        price: 180,
        ingredients: ['Paneer', 'Dal', 'Wheat Roti', 'Basmati Rice', 'Curd'],
        preparationTime: '20 mins',
        spiceLevel: 'Medium',
        rating: 4.9,
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        isSpecial: true
      },
      {
        name: 'Dal Tadka',
        description: 'Yellow lentils tempered with ghee, cumin, garlic, and fresh coriander',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500',
        categoryId: catMap.get('Meals'),
        price: 140,
        ingredients: ['Toor Dal', 'Ghee', 'Garlic', 'Cumin'],
        preparationTime: '15 mins',
        spiceLevel: 'Mild',
        rating: 4.6,
        isVeg: true,
        isAvailable: true,
        isPopular: false,
        isSpecial: false
      },
      {
        name: 'Paneer Butter Masala',
        description: 'Cubes of cottage cheese cooked in a rich, creamy tomato and cashew gravy',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500',
        categoryId: catMap.get('Meals'),
        price: 240,
        ingredients: ['Paneer', 'Butter', 'Cream', 'Cashew', 'Tomato'],
        preparationTime: '20 mins',
        spiceLevel: 'Medium',
        rating: 4.9,
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        isSpecial: true
      },
      {
        name: 'Paneer Biryani',
        description: 'Fragrant basmati rice layered with marinated paneer, saffron, and aromatic spices',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500',
        categoryId: catMap.get('Biryani'),
        price: 220,
        ingredients: ['Basmati Rice', 'Paneer', 'Saffron', 'Whole Spices', 'Mint'],
        preparationTime: '25 mins',
        spiceLevel: 'Spicy',
        rating: 4.8,
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        isSpecial: false
      },
      {
        name: 'Veg Dum Biryani',
        description: 'Slow Dum cooked vegetables with long grain basmati rice and biryani masala',
        image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500',
        categoryId: catMap.get('Biryani'),
        price: 190,
        ingredients: ['Basmati Rice', 'Mixed Veggies', 'Fried Onions', 'Biryani Spice'],
        preparationTime: '25 mins',
        spiceLevel: 'Medium',
        rating: 4.7,
        isVeg: true,
        isAvailable: true,
        isPopular: false,
        isSpecial: false
      },
      {
        name: 'Samosa (2 pcs)',
        description: 'Crispy golden pastry stuffed with savory spiced potato and green peas filling',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500',
        categoryId: catMap.get('Snacks'),
        price: 40,
        ingredients: ['Potato', 'Flour', 'Peas', 'Spices'],
        preparationTime: '10 mins',
        spiceLevel: 'Medium',
        rating: 4.7,
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        isSpecial: false
      },
      {
        name: 'Vada Pav (2 pcs)',
        description: 'Mumbai style spiced potato fritter inside soft bread bun with dry garlic chutney',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500',
        categoryId: catMap.get('Snacks'),
        price: 50,
        ingredients: ['Potato', 'Gram Flour', 'Pav Bun', 'Garlic Chutney'],
        preparationTime: '10 mins',
        spiceLevel: 'Spicy',
        rating: 4.9,
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        isSpecial: false
      },
      {
        name: 'Paneer Pakoda',
        description: 'Deep fried cottage cheese cubes coated in seasoned gram flour batter',
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500',
        categoryId: catMap.get('Snacks'),
        price: 120,
        ingredients: ['Paneer', 'Besan', 'Ajwain', 'Green Chilli'],
        preparationTime: '15 mins',
        spiceLevel: 'Medium',
        rating: 4.5,
        isVeg: true,
        isAvailable: true,
        isPopular: false,
        isSpecial: false
      },
      {
        name: 'Veg Burger',
        description: 'Crispy veg patty burger with fresh lettuce, tomatoes, cheese slice and mayo',
        image: 'https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=500',
        categoryId: catMap.get('Fast Food'),
        price: 110,
        ingredients: ['Veg Patty', 'Burger Bun', 'Cheese', 'Mayo', 'Lettuce'],
        preparationTime: '15 mins',
        spiceLevel: 'Mild',
        rating: 4.4,
        isVeg: true,
        isAvailable: true,
        isPopular: false,
        isSpecial: false
      },
      {
        name: 'Paneer Kathi Roll',
        description: 'Spiced paneer tikka wrapped in a warm paratha with onions and mint sauce',
        image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500',
        categoryId: catMap.get('Fast Food'),
        price: 140,
        ingredients: ['Paneer', 'Paratha', 'Onions', 'Mint Chutney'],
        preparationTime: '15 mins',
        spiceLevel: 'Medium',
        rating: 4.7,
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        isSpecial: false
      },
      {
        name: 'Masala Chai (Tea)',
        description: 'Freshly brewed Indian tea infused with ginger, cardamom, and aromatic spices',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500',
        categoryId: catMap.get('Beverages'),
        price: 30,
        ingredients: ['Milk', 'Tea Leaves', 'Ginger', 'Cardamom'],
        preparationTime: '5 mins',
        spiceLevel: 'Mild',
        rating: 4.9,
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        isSpecial: false
      },
      {
        name: 'Cold Coffee',
        description: 'Creamy chilled coffee blended with milk, ice cream and chocolate drizzle',
        image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500',
        categoryId: catMap.get('Beverages'),
        price: 90,
        ingredients: ['Coffee', 'Milk', 'Ice Cream', 'Chocolate'],
        preparationTime: '5 mins',
        spiceLevel: 'Sweet',
        rating: 4.8,
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        isSpecial: false
      },
      {
        name: 'Fresh Lime Soda',
        description: 'Refreshing fizzy soda with fresh squeezed lemon juice and mint leaves',
        image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=500',
        categoryId: catMap.get('Beverages'),
        price: 60,
        ingredients: ['Soda', 'Lemon Juice', 'Mint', 'Black Salt'],
        preparationTime: '5 mins',
        spiceLevel: 'Tangy',
        rating: 4.6,
        isVeg: true,
        isAvailable: true,
        isPopular: false,
        isSpecial: false
      },
      {
        name: 'Gulab Jamun (2 pcs)',
        description: 'Soft fried milk solid dumplings soaked in cardamom flavored sugar syrup',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500',
        categoryId: catMap.get('Desserts'),
        price: 60,
        ingredients: ['Khoya', 'Sugar Syrup', 'Cardamom', 'Rose Water'],
        preparationTime: '5 mins',
        spiceLevel: 'Sweet',
        rating: 4.9,
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        isSpecial: false
      },
      {
        name: 'Rasgulla (2 pcs)',
        description: 'Spongy chhena balls soaked in light sugar syrup',
        image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500',
        categoryId: catMap.get('Desserts'),
        price: 60,
        ingredients: ['Chhena', 'Sugar Syrup'],
        preparationTime: '5 mins',
        spiceLevel: 'Sweet',
        rating: 4.7,
        isVeg: true,
        isAvailable: true,
        isPopular: false,
        isSpecial: false
      },
      {
        name: 'Chef Special Kadhai Paneer',
        description: 'Paneer and capsicum tossed in coarsely ground spicy kadhai masala',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500',
        categoryId: catMap.get('Specials'),
        price: 260,
        ingredients: ['Paneer', 'Capsicum', 'Kadhai Masala', 'Tomato'],
        preparationTime: '20 mins',
        spiceLevel: 'Spicy',
        rating: 4.9,
        isVeg: true,
        isAvailable: true,
        isPopular: true,
        isSpecial: true
      },
      {
        name: 'Malai Kofta',
        description: 'Melt-in-mouth cottage cheese & potato dumplings in a rich creamy cashew gravy',
        image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500',
        categoryId: catMap.get('Specials'),
        price: 250,
        ingredients: ['Paneer', 'Potato', 'Cashews', 'Cream', 'Spices'],
        preparationTime: '20 mins',
        spiceLevel: 'Mild',
        rating: 4.8,
        isVeg: true,
        isAvailable: true,
        isPopular: false,
        isSpecial: true
      }
    ]);

    const foodMap = new Map(foods.map((f) => [f.name, f]));

    // 4. Seed Customers
    console.log('Seeding Customers...');
    const salt = await bcrypt.genSalt(10);
    const defaultPasswordHash = await bcrypt.hash('password123', salt);

    const customers = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        passwordHash: defaultPasswordHash,
        addresses: []
      },
      {
        name: 'Akanksha Hajare',
        email: 'akanksha@example.com',
        phone: '9876543211',
        passwordHash: defaultPasswordHash,
        addresses: []
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul@example.com',
        phone: '9876543212',
        passwordHash: defaultPasswordHash,
        addresses: []
      }
    ]);

    // 5. Seed Admins
    console.log('Seeding Admins...');
    const adminPasswordHash = await bcrypt.hash('admin123', salt);
    await Admin.create([
      {
        name: 'Adarsh Admin',
        email: 'admin@cloudcraves.com',
        passwordHash: adminPasswordHash,
        role: 'admin',
        isActive: true
      },
      {
        name: 'CloudCraves Owner',
        email: 'owner@cloudcraves.com',
        passwordHash: adminPasswordHash,
        role: 'owner',
        isActive: true
      }
    ]);

    // 6. Seed Addresses for Customers
    console.log('Seeding Customer Addresses...');
    const address1 = await Address.create({
      userId: customers[0]._id,
      name: customers[0].name,
      phone: customers[0].phone,
      house: 'Flat 402, Green Heights',
      street: 'Station Road',
      area: 'Central Market',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411001',
      landmark: 'Near SBI Bank',
      addressType: 'Home'
    });

    const address2 = await Address.create({
      userId: customers[1]._id,
      name: customers[1].name,
      phone: customers[1].phone,
      house: 'Villa 12, Rose Valley',
      street: 'IT Park Road',
      area: 'Hinjewadi Phase 1',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411057',
      landmark: 'Behind Tech Park',
      addressType: 'Work'
    });

    // Update User address references
    await User.findByIdAndUpdate(customers[0]._id, { $push: { addresses: address1._id } });
    await User.findByIdAndUpdate(customers[1]._id, { $push: { addresses: address2._id } });

    // 7. Seed Orders
    console.log('Seeding Orders...');
    const paneerBiryani = foodMap.get('Paneer Biryani')!;
    const paneerButterMasala = foodMap.get('Paneer Butter Masala')!;
    const masalaDosa = foodMap.get('Masala Dosa')!;
    const masalaChai = foodMap.get('Masala Chai (Tea)')!;
    const gulabJamun = foodMap.get('Gulab Jamun (2 pcs)')!;

    const order1 = await Order.create({
      orderId: 'ORD-1723738123000-1001',
      userId: customers[0]._id,
      restaurantId: restaurant._id,
      items: [
        { foodId: paneerButterMasala._id, name: paneerButterMasala.name, price: paneerButterMasala.price, quantity: 2 },
        { foodId: gulabJamun._id, name: gulabJamun.name, price: gulabJamun.price, quantity: 1 }
      ],
      subtotal: 540,
      deliveryCharge: 30,
      tax: 27,
      discount: 0,
      totalAmount: 597,
      deliveryAddress: {
        name: address1.name,
        phone: address1.phone,
        house: address1.house,
        street: address1.street,
        area: address1.area,
        city: address1.city,
        state: address1.state,
        pincode: address1.pincode,
        addressType: address1.addressType
      },
      orderType: 'DELIVERY',
      paymentMethod: 'COD',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED',
      specialInstructions: 'Please send extra green chutney.',
      estimatedDeliveryTime: '30-45 mins'
    });

    const order2 = await Order.create({
      orderId: 'ORD-1723738123000-1002',
      userId: customers[1]._id,
      restaurantId: restaurant._id,
      items: [
        { foodId: paneerBiryani._id, name: paneerBiryani.name, price: paneerBiryani.price, quantity: 1 },
        { foodId: masalaChai._id, name: masalaChai.name, price: masalaChai.price, quantity: 2 }
      ],
      subtotal: 280,
      deliveryCharge: 30,
      tax: 14,
      discount: 0,
      totalAmount: 324,
      deliveryAddress: {
        name: address2.name,
        phone: address2.phone,
        house: address2.house,
        street: address2.street,
        area: address2.area,
        city: address2.city,
        state: address2.state,
        pincode: address2.pincode,
        addressType: address2.addressType
      },
      orderType: 'DELIVERY',
      paymentMethod: 'ONLINE',
      paymentStatus: 'PAID',
      orderStatus: 'PREPARING',
      specialInstructions: 'Deliver to receptionist at front desk.',
      estimatedDeliveryTime: '25-35 mins'
    });

    const order3 = await Order.create({
      orderId: 'ORD-1723738123000-1003',
      userId: customers[0]._id,
      restaurantId: restaurant._id,
      items: [
        { foodId: masalaDosa._id, name: masalaDosa.name, price: masalaDosa.price, quantity: 2 }
      ],
      subtotal: 180,
      deliveryCharge: 30,
      tax: 9,
      discount: 0,
      totalAmount: 219,
      deliveryAddress: {
        name: address1.name,
        phone: address1.phone,
        house: address1.house,
        area: address1.area,
        city: address1.city,
        state: address1.state,
        pincode: address1.pincode,
        addressType: address1.addressType
      },
      orderType: 'DELIVERY',
      paymentMethod: 'COD',
      paymentStatus: 'COD',
      orderStatus: 'PLACED',
      specialInstructions: 'Ring doorbell once arrived.',
      estimatedDeliveryTime: '30-45 mins'
    });

    // 8. Seed Reviews
    console.log('Seeding Reviews...');
    await Review.create([
      {
        userId: customers[0]._id,
        orderId: order1._id,
        foodId: paneerButterMasala._id,
        foodRating: 5,
        serviceRating: 5,
        comment: 'Rich and creamy gravy! The paneer was soft and fresh. Will order again.'
      },
      {
        userId: customers[0]._id,
        orderId: order1._id,
        foodId: gulabJamun._id,
        foodRating: 5,
        serviceRating: 4,
        comment: 'Sweet and melting in mouth!'
      }
    ]);

    console.log('--------------------------------------------');
    console.log('Database Seed Completed Successfully!');
    console.log('--------------------------------------------');
    console.log(`Restaurant Created : 1 (${restaurant.name})`);
    console.log(`Categories Created : ${categories.length}`);
    console.log(`Food Items Created : ${foods.length}`);
    console.log(`Customers Created  : ${customers.length}`);
    console.log(`Admins Created     : 2 (admin@cloudcraves.com & owner@cloudcraves.com)`);
    console.log(`Addresses Created  : 2`);
    console.log(`Orders Created     : 3`);
    console.log(`Reviews Created    : 2`);
    console.log('--------------------------------------------');
    process.exit(0);
  } catch (error) {
    console.error('Database Seed Failed:', error);
    process.exit(1);
  }
};

seedDatabase();
