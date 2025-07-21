import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class CreateTaskListDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

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
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}