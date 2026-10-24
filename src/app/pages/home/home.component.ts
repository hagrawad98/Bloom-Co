import { Component } from '@angular/core';
import { HeroComponent } from './components/hero/hero.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { BestSellersComponent } from './components/best-sellers/best-sellers.component';
import { ShopByCategoryComponent } from './components/shop-by-category/shop-by-category.component';
import { OurStoryComponent } from './components/our-story/our-story.component';
import { FeaturesComponent } from './components/features/features.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeroComponent,
    CategoriesComponent,
    BestSellersComponent,
    ShopByCategoryComponent,
    FeaturesComponent,
    OurStoryComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
