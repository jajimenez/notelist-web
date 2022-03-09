import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { AuthService } from "src/app/services/auth.service";
import { AuthUser } from "src/app/models/auth-user.model";

@Component({
    selector: "app-login",
    templateUrl: "./login.component.html",
    styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy {
    loginSub: Subscription | null = null;

    waiting: boolean = false;
    error: string | null = null;

    constructor(private authService: AuthService) { }

    ngOnInit(): void {
    }

    onSubmit(form: NgForm) {
        if (!form.valid) return;

        this.waiting = true;
        this.error = null;

        const username = form.value.username;
        const password = form.value.password;

        this.loginSub = this.authService.login(username, password).subscribe({
            next: (u: AuthUser) => {
                this.waiting = false;
            },
            error: (e: string) => {
                this.waiting = false;
                this.error = e;
            }
        });
    }

    ngOnDestroy(): void {
        this.loginSub?.unsubscribe();
    }
}
