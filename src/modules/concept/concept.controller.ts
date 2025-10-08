import { Controller } from '@nestjs/common';
import { ConceptService } from './concept.service';

@Controller('concept')
export class ConceptController {
  constructor(private readonly conceptService: ConceptService) {}
}
