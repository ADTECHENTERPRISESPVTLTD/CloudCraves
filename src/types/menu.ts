export type MenuCategory = {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
};

export type MenuItem = {
  id: string;
  _id?: string;

  restaurantId?: string;

  categoryId:
    | string
    | {
        _id?: string;
        id?: string;
        name: string;
      };

  name: string;
  description: string;
  price: number;
  image: string;

  isAvailable: boolean;
  isVeg?: boolean;
  popular?: boolean;
  isPopular?: boolean;
  isSpecial?: boolean;

  ingredients?: string[];
  preparationTime?: string;
  spiceLevel?: string;

  createdAt?: string;
  updatedAt?: string;
};

export type RestaurantMenuCategory = MenuCategory & {
  items: MenuItem[];
};