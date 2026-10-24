import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CartComponent } from './pages/cart/cart.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { ProductComponent } from './pages/shop/shop.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SignupLoginComponent } from './pages/signup-login/signup-login.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'shop', component: ProductComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'about', component: AboutComponent },
  { path: 'cart', component: CartComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'login', component: SignupLoginComponent },
  { path: 'signup', component: SignupLoginComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
