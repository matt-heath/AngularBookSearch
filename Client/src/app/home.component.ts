import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-home-selector',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent { 
  constructor(private authService: AuthService) {}
}
