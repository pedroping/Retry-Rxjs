import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { delay, mergeMap, retryWhen, take } from 'rxjs/operators';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  teste = 0;

  constructor(private http: HttpClient) {
    http
      .get('https://jsonplaceholder.typicode.com/users') // OK
      // http
      //   .get('https://jsonplaceholder.typicode.com/WRONGAPI') // WRONG API, so it retries
      .pipe(
        mergeMap((resp) => {
          if (this.teste == 0) {
            this.teste = 1;
            return throwError('ERRR');
          }
          return of(`Teste ${this.teste}`);
        }),
        retryWhen((err) => {
          return err.pipe(delay(1000));
        })
      )
      .subscribe({
        next: (resp) => {
          console.log(resp);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
