import { AuthService } from './auth.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Matthews App';
  profile: any;

  constructor(private authService: AuthService) {
    authService.handleAuthentication();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      if (this.authService.userProfile) {
        this.profile = this.authService.userProfile;
        // console.log(this.profile);
      } else {
        this.authService.getProfile((err, profile) => {
          this.profile = profile;
          // console.log(this.profile);
        });
      }
    }
  }
}
