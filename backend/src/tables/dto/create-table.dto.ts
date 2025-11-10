import { IsInt, Min, IsOptional, IsString } from 'class-validator';

export class CreateTableDto {
  @IsInt()
  @Min(1)
  number: number;

  @IsInt()
  @Min(1)
  capacity: number;

  @IsOptional()
  @IsString()
  location?: string;
}
