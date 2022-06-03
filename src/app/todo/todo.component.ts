import { APIService, ModelSortDirection } from './../API.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Auth } from 'aws-amplify';

export interface Todo {
  id: string;
  author: string;
  completedBy?: string;
  content: string;
  updatedAt: string;
}

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit {

  todoText = 'TODO';
  displayedColumns: string[] = ['id', 'content', 'author', 'completedBy', 'updatedAt'];
  dataSource: any;
  todos: [Todo] | any = [];
  currentUser: any;
  todoFormControl = new FormControl('', Validators.required);

  constructor(private todoService: APIService) {
    this.todoService.OnCreateTodoListener.subscribe(response => {
      this.todos.push(response.value.data?.onCreateTodo);
      this.dataSource = new MatTableDataSource(this.todos);
    });

    this.todoService.OnUpdateTodoListener.subscribe(response => {
      this.updateDataSource(response.value.data?.onUpdateTodo);
    })

  }

  ngOnInit(): void {
    Auth.currentAuthenticatedUser().then(user => {
      this.currentUser = user;
      this.listTodosByDate();
    });
  }

  listTodosByDate() {
    this.todoService.TodosByDate(this.todoText, {}, ModelSortDirection.ASC).then(response => {
      response.items.forEach(todo => {
        this.todos.push(todo);
      });
      this.dataSource = new MatTableDataSource(this.todos);
    })
  }

  createNewTodo() {
    const todoContent = this.todoFormControl.value ? this.todoFormControl.value : '';
    if(!todoContent) {
      return;
    }

    this.todoService.CreateTodo({author: this.currentUser.attributes.given_name, content: todoContent, type: this.todoText}).then(response => {
      this.todoFormControl.reset();
    })
  }

  updateTodo(todoId: string, isComplete: boolean) {
    this.todoService.UpdateTodo({id: todoId, completedBy: !isComplete ? this.currentUser.attributes.given_name : null}).then(response => {
      console.log('updatedTodo: ', response);
    })
  }

  updateDataSource(response: any) {
    this.todos = this.todos.filter((todo: any) => todo.id !== response.id);
    this.todos.push(response);
    this.dataSource = new MatTableDataSource(this.todos);
  }

}
