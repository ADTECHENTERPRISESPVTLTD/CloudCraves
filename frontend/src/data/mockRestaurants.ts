import type { Restaurant } from "@/types/restaurant";

export const mockRestaurants: Restaurant[] = [
  {
    id: "r1", name: "Aai's Kitchen", cuisine: "Maharashtrian", rating: 4.7, reviews: 186,
    distanceKm: 1.2, deliveryMinutes: 30, isOpen: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
    address: "Main Market Road, Pune", phone: "+91 90000 11111",
    description: "Homestyle Maharashtrian meals made fresh in small batches.",
    hours: "10:00 AM – 10:00 PM", deliveryAvailable: true
  },
  {
    id: "r2", name: "Tadka Town", cuisine: "North Indian", rating: 4.5, reviews: 124,
    distanceKm: 2.4, deliveryMinutes: 35, isOpen: true,
    image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=80",
    address: "Station Road, Pune", phone: "+91 90000 22222",
    description: "Comforting North Indian favourites, rotis and hearty curries.",
    hours: "11:00 AM – 11:00 PM", deliveryAvailable: true
  },
  {
    id: "r3", name: "Gaon Zaika", cuisine: "Local Specials", rating: 4.8, reviews: 92,
    distanceKm: 3.1, deliveryMinutes: 40, isOpen: false,
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
    address: "Village Road, Pune", phone: "+91 90000 33333",
    description: "Authentic local recipes with seasonal ingredients.",
    hours: "12:00 PM – 9:00 PM", deliveryAvailable: true
  },
  {
    id: "r4", name: "Chulha & Co.", cuisine: "Indian", rating: 4.4, reviews: 76,
    distanceKm: 4.0, deliveryMinutes: 45, isOpen: true,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",
    address: "Hinjewadi Link Road, Pune", phone: "+91 90000 44444",
    description: "Everyday Indian food with a warm, family-kitchen feel.",
    hours: "9:00 AM – 9:30 PM", deliveryAvailable: false
  }
];
