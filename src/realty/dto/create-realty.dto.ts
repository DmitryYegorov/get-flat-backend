export class CreateRealtyDto {
  categoryId: string;
  location: Record<string, any>;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  imageSrc: string;
  price: number;
  title: string;
  description: string;
  wcCount: number;
  hasKitchen: boolean;
  hasParking: boolean;
}
