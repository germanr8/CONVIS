﻿import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Usuario } from "../models/Usuario";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<Usuario>;
  public currentUser: Observable<Usuario>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Usuario>(
      JSON.parse(localStorage.getItem("currentUser"))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Usuario {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.http
      .post<any>(`http://localhost:3000/users/authenticate`, {
        username,
        password
      })
      .pipe(
        map(Usuario => {
          localStorage.setItem("currentUser", JSON.stringify(Usuario));
          this.currentUserSubject.next(Usuario);
          return Usuario;
        })
      );
  }

  logout() {
    localStorage.removeItem("currentUser");
    this.currentUserSubject.next(null);
  }
}
