import { Component } from '@angular/core';
import { WebService } from '../web.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-business-selector',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})

export class MyProfileComponent {
  profile: any;
  submittedEdit: any;
  edit = true;
  submittedReadOn = true;
  deleteUserReviewForm;
  updateReviewForm;
  deleteReview = {
     id: '',
     username: ''
  };
  settings = {
    columns: {
      username: {
        title: 'Username'
      },
      text: {
        title: 'Review Text'
      },
      stars: {
        title: 'Number of Stars'
      },
      date: {
        title: 'Date Reviewed'
      }
    }
  };

  updateReview = {
    id: '',
    username: '',
    review: '',
    stars: '',
    bookID: ''
  };

  constructor(private webService: WebService, private route: ActivatedRoute, private formBuilder: FormBuilder, public authService: AuthService) {
    // authService.handleAuthentication();
    this.deleteUserReviewForm = this.formBuilder.group({
      id: ['']
    });
    this.updateReviewForm = this.formBuilder.group({
      username: [''],
      review: ['', Validators.compose([Validators.required])],
      stars: 5,
    });
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
    // console.log(this.route.snapshot.params);
    const response = this.webService.getUserReview(this.route.snapshot.params.username);
  }
  user_reviews;

  onSubmit(bookID, id) {
    this.deleteReview.id = id;
    this.deleteReview.username = this.profile.nickname;
    this.webService.deleteReview(bookID, this.deleteReview);
  }

  onSubmitUpdate(id, bookID) {
    console.log(bookID);
    this.updateReview.id = id;
    this.updateReview.bookID = bookID;
    this.updateReview.username = this.profile.nickname;
    this.webService.updateReview(this.updateReview);
    this.edit = true;
    this.submittedReadOn = true;
    this.submittedEdit = false;
  }

  editReview(bookID, reviewID) {
    console.log("BOOKID:" + bookID + 'REVIEWID: ' + reviewID);
    this.webService.getReview(bookID, reviewID);

    this.webService.user_review.subscribe(val => (
      this.updateReview.id = val[0][0].reviews[0].id,
      this.updateReview.username = this.profile.nickname,
        this.updateReview.review = val[0][0].reviews[0].text,
        this.updateReview.stars = val[0][0].reviews[0].stars
    ));
    // console.log(this.updateReview.review);
    this.edit = false;
    this.submittedReadOn = false;
    this.submittedEdit = true;
    console.log(this.submittedEdit);
  }


  isInvalid(control) {
    return this.updateReviewForm.controls[control].invalid &&
      this.updateReviewForm.controls[control].touched;
  }
  isIncomplete() {
    return this.isInvalid('review');
  }
}
