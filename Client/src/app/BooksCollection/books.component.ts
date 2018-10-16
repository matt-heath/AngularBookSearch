import { AuthService } from '../auth.service';
import { Component } from '@angular/core';
import { WebService } from '../web.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-businesses-selector',
    templateUrl: './books.component.html',
    styleUrls: ['./books.component.css']
})

export class BooksComponent {
  addBookForm;

  newBook = {
    'title': '',
    'isbn': '',
    'pageCount': '',
    'publishedDate': '',
    'thumbnailUrl': '',
    'shortDescription': '',
    'longDescription': '',
    'status': '',
    'authors': '',
    'categories': ''
  };
  constructor(private webService: WebService, private authService: AuthService, private formBuilder: FormBuilder) {
    this.addBookForm = this.formBuilder.group({
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
    // if (sessionStorage.start) {
    //   this.start = sessionStorage.start;
    // }

    const response = this.webService.getBooks();
    // this.webService.books_list
    //   .subscribe(books => {
    //     this.books_list = books;
    //   });
    // console.log(response.json());
    // this.books_list = response.json();
  }
  // ngAfterViewInit() {
  //   const response = this.webService.getBooks();
  // }
  isInvalid(control) {
    return this.addBookForm.controls[control].invalid &&
      this.addBookForm.controls[control].touched;
  }
  isIncomplete() {
    return this.isInvalid('title') ||
      this.isInvalid('isbn') ||
      this.isInvalid('publishedDate') ||
      this.isInvalid('shortDescription') ||
      this.isInvalid('longDescription') ||
      this.isInvalid('status') ||
      this.isInvalid('authors');
  }

  onSubmitAddBook() {
    this.webService.postBook(this.newBook);
    this.addBookForm.reset();
  }
  books_list;
}
