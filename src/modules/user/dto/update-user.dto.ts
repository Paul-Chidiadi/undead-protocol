import { PartialType } from '@nestjs/swagger';
import { CreateUndeadUserDto } from './create-user.dto';

export class UpdateUndeadUserDto extends PartialType(CreateUndeadUserDto) {}
