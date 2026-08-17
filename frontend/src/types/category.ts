export type Category = {
  _id: string;
  name: string;
  description: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

/**
 * Used when creating a category.
 * Name is required by the backend.
 */
export type CategoryPayload = {
  name: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
};

/**
 * Used when updating a category.
 * Any field can be updated independently.
 */
export type UpdateCategoryPayload = {
  name?: string;
  description?: string;
  image?: string;
  isActive?: boolean;
  sortOrder?: number;
};
