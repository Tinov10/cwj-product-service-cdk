import { Length } from 'class-validator';

export class CategoryInput {
  // when creating a new category
  @Length(3, 128)
  name: string;
  parentId?: string;
  imageUrl: string;

  // when updating a existing category
  id: string;
  displayOrder: number;

  products: string[];
}

export class AddItemInput {
  @Length(3, 128)
  id: string;

  products: string[];
}
