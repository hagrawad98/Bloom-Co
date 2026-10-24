import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent {
hint='New Collection';
title = 'Small Changes Make a Big Difference';
description = 'Discover our latest collection of home essentials , style , and more - made for your everyday';
}
