import {Http, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Router } from '@angular/router';
import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import { AuthHttp } from 'angular2-jwt';
import Swal from 'sweetalert2';


declare var swal: any;



@Injectable()

export class WebService {
  // FOR MULTIPLE BOOKS
  rowData: any;
  private books_private_list = [];
  private booksSubject = new Subject();
  books_list = this.booksSubject.asObservable();
  // FOR SINGLE BOOK
  private book_private_list = [];
  private bookSubject = new Subject();
  book_list = this.bookSubject.asObservable();
  // FOR REVIEWS
  private reviews_private_list = [];
  private reviewsSubject = new Subject();
  reviews = this.reviewsSubject.asObservable();

  private review_private_list = [];
  private reviewSubject = new Subject();
  review = this.reviewSubject.asObservable();
  // USER REVIEWS

  private user_private_list = [];
  private userReviewsSubject = new Subject();
  user_reviews = this.userReviewsSubject.asObservable();

  private user_review_private_list = [];
  private userReviewSubject = new Subject();
  user_review = this.userReviewSubject.asObservable();

  constructor(private http: AuthHttp, private normalHttp: Http, private router: Router) {
  }
  postReview(review) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('username', review.name);
    urlSearchParams.append('text', review.review);
    urlSearchParams.append('stars', review.stars);
    this.http.post(
      'http://localhost:3000/api/books/' +
      review.bookID + '/reviews',
      urlSearchParams)
      .subscribe(
        response => {
          this.getBook(review.bookID);
        },
        (err) => {
          // alert('You need to be authenticated to access this content');
          Swal('Oops...', 'You need to be authenticated to access this content', 'error');
          // The call to navigateByUrl below does not work. To fix.
          this.router.navigate(['/books']);
        }
      );
  }

  postBook(newBook) {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('title', newBook.title);
    urlSearchParams.append('isbn', newBook.isbn);
    urlSearchParams.append('pageCount', newBook.pageCount);
    urlSearchParams.append('publishedDate', newBook.publishedDate);
    urlSearchParams.append('thumbnailURL', newBook.thumbnailUrl);
    urlSearchParams.append('shortDescription', newBook.shortDescription);
    urlSearchParams.append('longDescription', newBook.longDescription);
    urlSearchParams.append('status', newBook.status);
    urlSearchParams.append('authors', newBook.authors);
    urlSearchParams.append('categories', newBook.categories);
    console.log(urlSearchParams);
    this.http.post(
      'http://localhost:3000/api/books/',
      urlSearchParams)
      .subscribe(
        response => {
          this.getBooks();
        },
        (err) => {
          // alert('You need to be authenticated to access this content');
          Swal('Oops...', 'You need to be authenticated to access this content', 'error');
          // The call to navigateByUrl below does not work. To fix.
          this.router.navigate(['/books']);
        }
      );
  }

  getBooks() {
    return this.normalHttp.get(
      'http://localhost:3000/api/books')
      .subscribe(response => {
        this.books_private_list = response.json();
        this.booksSubject.next(this.books_private_list);
      });
    // .toPromise();
  }

  bookID;

  getBook(bookID) {
    return this.normalHttp.get(
      'http://localhost:3000/api/books/' + bookID)
      .subscribe(response => {
        this.book_private_list = response.json();
        this.book_private_list = Array.of(this.book_private_list);
        this.bookSubject.next(this.book_private_list);
        // console.log(this.book_private_list);
        this.bookID = bookID;
        this.getReviews(bookID);
      });
  }

  getReviews(id) {
    return this.normalHttp.get(
      'http://localhost:3000/api/books/' + id + '/reviews')
      .subscribe(
        response => {
          this.reviews_private_list = response.json();
          this.reviewsSubject.next(
            this.reviews_private_list
          );
          this.rowData = this.reviews_private_list;

          console.log(this.rowData);
        }
      );
  }

  getReview(bookID, reviewID) {
    console.log("BOOKID:" + bookID + 'REVIEWID: ' + reviewID);
    return this.normalHttp.get(
      'http://localhost:3000/api/books/' + bookID + '/reviews/' + reviewID)
        .subscribe(
          response => {
            this.user_review_private_list = response.json();
            this.user_review_private_list = Array.of(this.user_review_private_list);
            this.userReviewSubject.next(
              this.user_review_private_list);
            // console.log(this.review_private_list);
          }
        );
  }

  getUserReview(username) {
    return this.http.get(
      'http://localhost:3000/api/myProfile/' + username)
      .subscribe(
        response => {
          this.user_private_list = response.json();
          // this.user_private_list = Array.of(this.user_private_list);
          this.userReviewsSubject.next(
            this.user_private_list
          );
          if (this.user_private_list.length === 0) {
            Swal('No Reviews', 'There are no reviews associated to this account', 'info');
          }
        },
        (err) => {
          Swal('Oops...', 'An error occurred retrieving user reviews - check you are logged in and try again', 'error');
          // alert('You need to be authenticated to access this content');
          // The call to navigateByUrl below does not work. To fix.
          this.router.navigate(['/books']);
        }
      );
  }

  deleteReview(bookID, deleteReview) {
    return this.http.delete(
      'http://localhost:3000/api/books/' + bookID + '/reviews/' + deleteReview.id)
      .subscribe(
        response => {
          Swal('Success', 'The review has been removed from the system', 'success');
          this.getUserReview(deleteReview.username);
        },
        (err) => {
          Swal('Oops...', 'You need to be authenticated to access this content', 'error');
          // alert('You need to be authenticated to access this content');
          // The call to navigateByUrl below does not work. To fix.
          this.router.navigate(['/books']);
        }
      );
  }

  deleteBook(bookID) {
    this.http.delete(
      'http://localhost:3000/api/books/' + bookID)
      .subscribe(
        response => {
          Swal('Success', 'The book has been removed from the system', 'success').then(function () {
            window.location.href = '/books';
          });
          // this.getBooks();
          // this.router.navigate(['/books']);
        },
        (err) => {
          console.log(err);
          Swal('Oops...', 'You need to be authenticated to access this content', 'error');
          // alert('You need to be authenticated to access this content');
          // The call to navigateByUrl below does not work. To fix.
          this.router.navigate(['/books']);
        }
      );
  }

  updateReview(review) {
    // console.log(updateReview);
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('username', review.username);
    urlSearchParams.append('review', review.review);
    urlSearchParams.append('stars', review.stars);
    console.log(review);
    this.http.put(
      'http://localhost:3000/api/books/' + review.bookID + '/reviews/' + review.id, urlSearchParams)
      .subscribe(
        response => {
          console.log('DONE');
          // window.location.reload();
          Swal('Success', 'The review has been updated', 'success');
          this.getUserReview(review.username);
        },
        (err) => {
          // alert('You need to be authenticated to access this content');
          Swal('Oops...', 'An error occurred updating user reviews - check you are logged in and try again', 'error');
          // The call to navigateByUrl below does not work. To fix.
          this.router.navigate(['/books']);
        }
      );
  }

  updateBook(updateBook) {
    // console.log(updateReview);
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append('title', updateBook.title);
    urlSearchParams.append('isbn', updateBook.isbn);
    urlSearchParams.append('pageCount', updateBook.pageCount);
    urlSearchParams.append('publishedDate', updateBook.publishedDate);
    urlSearchParams.append('thumbnailUrl', updateBook.thumbnailUrl);
    urlSearchParams.append('shortDescription', updateBook.shortDescription);
    urlSearchParams.append('longDescription', updateBook.longDescription);
    urlSearchParams.append('status', updateBook.status);
    urlSearchParams.append('authors', updateBook.authors);
    urlSearchParams.append('categories', updateBook.categories);
    console.log("UPDATED BOOK:"  + urlSearchParams);
    console.log("UPDATED ID:"  + updateBook.id);
    this.http.put(
      'http://localhost:3000/api/books/' + updateBook.id, urlSearchParams)
      .subscribe(
        response => {
          console.log('DONE');
          this.getBook(updateBook.id);
        },
        (err) => {
          // alert('You need to be authenticated to access this content');
          Swal('Oops...', 'An error occurred updating the book - check you are logged in and try again', 'error');
          // The call to navigateByUrl below does not work. To fix.
          // this.router.navigate(['/books']);
        }
      );
  }
}

