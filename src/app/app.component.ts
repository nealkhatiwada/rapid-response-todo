import { Component, OnInit } from '@angular/core';
import { Auth } from 'aws-amplify';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  formFields = {
    signUp: {
      given_name: {
        order: 1
      },
      family_name: {
        order: 2
      },
      email: {
        order: 3
      },
      password: {
        order: 4
      },
      confirm_password: {
        order: 5
      }
    },
  }

  ngOnInit() {
    try {
      Auth.currentAuthenticatedUser().then(user => {
        this.isLoggedIn = true;
      });

    } catch(exception) {
      console.log('user is not logged in');
      this.isLoggedIn = false;
    }
  }
}
