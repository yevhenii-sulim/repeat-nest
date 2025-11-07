import { IsNotEmpty } from 'class-validator';

export class createArticlesDTO {
  @IsNotEmpty()
  readonly title: string;
  @IsNotEmpty()
  readonly description: string;
  @IsNotEmpty()
  readonly body: string;
  readonly tagList?: string[];
}

export class updateArticlesDTO {
  readonly title: string;
  readonly description: string;
  readonly body: string;
  readonly tagList: string[];
}
