import { Component } from '@angular/core';
import { WebService } from './web.service';
import { AuthService } from './auth.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';



@Component({
  selector: 'app-business-selector',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})

export class BookComponent {
  columnDefs = [
    {headerName: 'Username', field: 'username' },
    {headerName: 'Review Text', field: 'text' },
    {headerName: 'Number of Stars', field: 'stars'},
    {headerName: 'Date Reviewed', field: 'date'}
  ];

  rowData: any;
  profile: any;
  reviewForm;
  isDisabled = true;
  submittedEdit: any;
  edit = true;
  submittedReadOn = true;
  updateBookForm;
  deleteForm;
  review = {
    bookID: '',
    name: '',
    review: '',
    stars: 5
  };

  // updateBook = {
  //   id: '',
  //   username: '',
  //   review: '',
  //   stars: '',
  //   bookID: ''
  // };
  updateBook = {
    // review_count: '',
    id: '',
    authors: '',
    categories: '',
    status: '',
    longDescription: '',
    shortDescription: '',
    thumbnailUrl: '',
    publishedDate: '',
    pageCount: '',
    isbn: '',
    title: ''
  };
  constructor(private webService: WebService, private route: ActivatedRoute, private formBuilder: FormBuilder, public authService: AuthService) {
    this.reviewForm = this.formBuilder.group({
      name: [''],
      review: ['', Validators.compose([Validators.required, Validators.minLength(10)])],
      stars: 5,
    });
    this.deleteForm = this.formBuilder.group({
      id: ['']
    });
    this.updateBookForm = this.formBuilder.group({
      title: ['', Validators.compose([Validators.required])],
      isbn: ['', Validators.compose([Validators.required])],
      pageCount: [''],
      publishedDate: ['', Validators.compose([Validators.required])],
      thumbnailUrl: [''],
      shortDescription: ['', Validators.compose([Validators.required])],
      longDescription: ['', Validators.compose([Validators.required])],
      status: ['', Validators.compose([Validators.required])],
      authors: ['', Validators.compose([Validators.required])],
      categories: ['']
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
    const response = this.webService.getBook(this.route.snapshot.params.id);
    this.webService.getReviews(
      this.route.snapshot.params.id
    );

    this.webService.book_list.subscribe(val => (
      // console.log(val[0].authors)
      this.updateBook.isbn = val[0].isbn,
      this.updateBook.authors = val[0].authors,
      this.updateBook.categories = val[0].categories,
      this.updateBook.status = val[0].status,
      this.updateBook.longDescription = val[0].longDescription,
      this.updateBook.shortDescription = val[0].shortDescription,
      this.updateBook.thumbnailUrl = val[0].thumbnailUrl,
      this.updateBook.publishedDate = val[0].publishedDate,
      this.updateBook.pageCount = val[0].pageCount,
      this.updateBook.title = val[0].title
    ));
    console.log(this.updateBook);
  }
  book_list;
  isInvalid(control) {
    return this.reviewForm.controls[control].invalid &&
      this.reviewForm.controls[control].touched;
  }
  isIncomplete() {
    return this.isInvalid('name') ||
      this.isInvalid('review');
  }
  isInvalidUpdate(control) {
    // console.log(control);
    return this.updateBookForm.controls[control].invalid && this.updateBookForm.controls[control].touched;
  }
  isIncompleteUpdate() {
    return this.isInvalidUpdate('title') ||
      this.isInvalidUpdate('isbn') ||
      this.isInvalidUpdate('publishedDate') ||
      this.isInvalidUpdate('shortDescription') ||
      this.isInvalidUpdate('longDescription') ||
      this.isInvalidUpdate('status') ||
      this.isInvalidUpdate('authors');
  }

  // isInvalid(control) {
  //   return this.addBookForm.controls[control].invalid &&
  //     this.addBookForm.controls[control].touched;
  // }
  //
  // isIncomplete() {
  //   return this.isInvalid('title') ||
  //     this.isInvalid('isbn') ||
  //     this.isInvalid('publishedDate') ||
  //     this.isInvalid('shortDescription') ||
  //     this.isInvalid('longDescription') ||
  //     this.isInvalid('status') ||
  //     this.isInvalid('authors');
  // }

  // book = {};

  onSubmit() {
    this.review.bookID = this.webService.bookID;
    this.review.name = this.profile.nickname;
    this.webService.postReview(this.review);
    this.reviewForm.reset();
  }

  onSubmitEditBook(bookID) {
    // this.review.bookID = this.webService.bookID;
    this.updateBook.id = bookID;
    this.webService.updateBook(this.updateBook);
    // this.reviewForm.reset();
    console.log('BOOKID' + bookID);
  }
  onDelete(bookID) {
    // console.log(this.review);
    // this.review.bookID = this.webService.bookID;
    // console.log(this.review);
    this.webService.deleteBook(bookID);
  }
  onGridSizeChanged(params) {
    const gridWidth = document.getElementById('grid-wrapper').offsetWidth;
    const columnsToShow = [];
    const columnsToHide = [];
    let totalColsWidth = 0;
    const allColumns = params.columnApi.getAllColumns();
    for (let i = 0; i < allColumns.length; i++) {
      const column = allColumns[i];
      totalColsWidth += column.getMinWidth();
      if (totalColsWidth > gridWidth) {
        columnsToHide.push(column.colId);
      } else {
        columnsToShow.push(column.colId);
      }
    }
    params.columnApi.setColumnsVisible(columnsToShow, true);
    params.columnApi.setColumnsVisible(columnsToHide, false);
    params.api.sizeColumnsToFit();
  }

  parseDate(dateString: string): Date {
    if (dateString) {
      return new Date(dateString);
    } else {
      return null;
    }
  }

}
