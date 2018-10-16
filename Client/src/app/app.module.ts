import { AuthService } from './auth.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule} from '@angular/router';
import { CallbackComponent } from './callback.component';
import { AppComponent } from './app.component';
import { BookComponent } from './IndividualBookDetails/book.component';
import { BooksComponent } from './BooksCollection/books.component';
import { HomeComponent } from './home.component';
import {MyProfileComponent} from './UserProfile/myprofile.component';
import { WebService } from './web.service';
import { HttpClientModule} from '@angular/common/http';
import { NgAisModule } from 'angular-instantsearch';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { MenuSelect } from './menu-select.component';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { AgGridModule } from 'ag-grid-angular';
import { SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import { StarRatingModule } from 'angular-star-rating';

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig(), http, options);
}

const routes = [
  {path: 'books', component: BooksComponent},
  {path: 'books/:id', component: BookComponent},
  {path: 'callback', component: CallbackComponent},
  {path: 'myProfile/:username', component: MyProfileComponent}
];

@NgModule({
  declarations: [
    AppComponent, BooksComponent, HomeComponent, MenuSelect, BookComponent, CallbackComponent, MyProfileComponent
  ],
  imports: [
    BrowserModule, HttpModule, RouterModule.forRoot(routes), NgAisModule.forRoot(), FormsModule, ReactiveFormsModule
    , MDBBootstrapModule.forRoot(), HttpClientModule, NgxPaginationModule, AgGridModule.withComponents([])
    , SweetAlert2Module.forRoot(), StarRatingModule.forRoot()
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [WebService, AuthService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
