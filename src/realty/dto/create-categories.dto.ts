export class CategoryItemDto {
  readonly name: string;
  readonly icon?: string;
  readonly description: string;
}

export class ListOfCategoriesDto {
  list: CategoryItemDto[];
}
