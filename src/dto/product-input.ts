import { IsNumber, Length } from 'class-validator';

export class ProductInput {
  id: string;

  @IsNumber()
  price: number;

  @Length(3, 128)
  name: string;

  @Length(3, 256)
  description: string;

  image_url: string;

  availability: boolean;

  category_id: string;

  seller_id: number;
}
