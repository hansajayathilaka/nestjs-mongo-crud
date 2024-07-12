import { Controller } from '@nestjs/common';
import { Category } from './schemas/category.schema';
import { CategoryService } from './category.service';
import { Crud, CrudController } from '@nestjsx/crud';

@Crud({
  model: {
    type: Category,
  },
})
@Controller('category')
export class CategoryController implements CrudController<Category> {
  constructor(public service: CategoryService) {}
}
