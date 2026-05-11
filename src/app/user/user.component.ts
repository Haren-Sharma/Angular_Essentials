import { Component, computed, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { DUMMY_USERS } from '../dummy.users';
import { User } from './user.model';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [NgClass],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  @Input({required:true}) user!:User;
  @Input({required:true}) selected!:boolean;

  @Output() select=new EventEmitter();

  get imagePath(){
    return  'assets/users/'+this.user.avatar   
  }

  onSelectedUser(){
    this.select.emit(this.user.id);
  }
}
