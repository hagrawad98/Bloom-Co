import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-our-story',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './our-story.component.html',
  styleUrl: './our-story.component.css'
})
export class OurStoryComponent {
  girlImageUrl = 'assests/images/girl.jpg';
  hint = 'OUR STORY';
  title = 'More Than Just a Store';
  description = 'At Bloom&Co., we believe that the little things make life more beautiful. We bring you carefully selected products that add comfort, style and joy to your everyday moments.';
}
