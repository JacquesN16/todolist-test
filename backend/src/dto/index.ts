import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateTaskListDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  shortDescription!: string;

  @IsString()
  @IsOptional()
  longDescription?: string;

  @IsDateString()
  @IsNotEmpty()
  dueDate!: string;

  @IsNotEmpty()
  listId!: number;
}

export class UpdateTaskDto {
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @IsString()
  @IsOptional()
  shortDescription?: string;

  @IsString()
  @IsOptional()
  longDescription?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}