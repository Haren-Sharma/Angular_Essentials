# Angular Essentials — Learning Notes

> Angular 17.3.0 | Module-based architecture  
> A task management app covering core Angular concepts.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [How the App Boots](#how-the-app-boots)
3. [Modules](#modules)
4. [Components](#components)
5. [Data Binding](#data-binding)
6. [Directives](#directives)
7. [Component Communication — @Input & @Output](#component-communication--input--output)
8. [Services & Dependency Injection](#services--dependency-injection)
9. [Forms — Template Driven](#forms--template-driven)
10. [Pipes](#pipes)
11. [Content Projection — ng-content](#content-projection--ng-content)
12. [ng-template & Template References](#ng-template--template-references)
13. [Interfaces & Type Safety](#interfaces--type-safety)
14. [Routing Setup](#routing-setup)
15. [Component Patterns Used](#component-patterns-used)
16. [Module-based vs Standalone (Quick Ref)](#module-based-vs-standalone-quick-ref)

---

## Project Structure

```
src/app/
├── app.module.ts              ← Root module
├── app.component.ts           ← Root component (shell)
├── dummy.users.ts             ← Mock user data
├── dummy.tasks.ts             ← Mock task data
│
├── header/                    ← Presentational header
├── user/                      ← User list item + model
├── shared/
│   ├── shared.module.ts       ← Exports reusable components
│   └── card/                  ← Reusable card wrapper
└── tasks/
    ├── tasks.module.ts        ← Feature module
    ├── tasks.component.ts     ← Container: shows user's tasks
    ├── tasks.service.ts       ← State management for tasks
    ├── task/                  ← Single task display + model
    └── new-task/              ← Add task form (modal)
```

---

## How the App Boots

```
main.ts
  └── platformBrowserDynamic().bootstrapModule(AppModule)
        └── AppModule
              ├── declarations: [AppComponent, HeaderComponent, UserComponent]
              ├── imports:      [BrowserModule, SharedModule, RouterOutlet, TasksModule]
              └── bootstrap:    [AppComponent]   ← mounts to <app-root> in index.html
```

**Key points:**
- `main.ts` is the entry point — it hands control to `AppModule`
- `bootstrap` tells Angular which component to mount into `index.html`'s `<app-root>`
- `BrowserModule` provides platform APIs (DOM, pipes like `NgIf`, `NgFor` in older Angular)

---

## Modules

### What is an NgModule?

A class decorated with `@NgModule` that groups related components, directives, and pipes.

```ts
@NgModule({
  declarations: [AppComponent, HeaderComponent, UserComponent],
  // components/directives/pipes that belong to and are owned by this module

  imports: [BrowserModule, SharedModule, RouterOutlet, TasksModule],
  // NgModules (and standalone components/directives/pipes) to make available in this module

  exports: [TasksComponent],
  // what this module exposes to other modules that import it

  bootstrap: [AppComponent],
  // first component that will be bootstrapped (root module only)
})
export class AppModule {}
```

### Types of modules in this project

| Module | Role |
|---|---|
| `AppModule` | Root module — bootstraps the app |
| `TasksModule` | Feature module — owns all task-related components |
| `SharedModule` | Shared module — exports `CardComponent` for reuse |

### Rules
- A component can be declared in **only one** module
- To use a component from another module, **import that module** (not the component directly)
- To share a component outside its module, **export** it from its module

---

## Components

### Anatomy of a component

```ts
@Component({
  selector: 'app-user',           // HTML tag used to render this component
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  // state, inputs, outputs, methods go here
}
```

### Selector usage

```html
<app-user />          <!-- self-closing (Angular 15.1+) -->
<app-user></app-user> <!-- also valid -->
```

### Smart vs Presentational components

| Type | Example | Responsibility |
|---|---|---|
| **Smart / Container** | `TasksComponent` | Fetches/manages data, coordinates children |
| **Presentational / Dumb** | `TaskComponent`, `HeaderComponent` | Receives data via `@Input`, emits via `@Output`, no service calls |

---

## Data Binding

### Four types

```html
<!-- 1. String Interpolation — display component data -->
<span>{{ user.name }}</span>

<!-- 2. Property Binding — bind component value to DOM property -->
<img [src]="imagePath" [alt]="user.avatar" />

<!-- 3. Event Binding — react to DOM events -->
<button (click)="onSelectedUser()">Click</button>

<!-- 4. Two-way Binding — sync form input with component property -->
<input [(ngModel)]="enteredTitle" />
```

> `[(ngModel)]` is the "banana in a box" syntax — `[]` binds in, `()` binds out.  
> Requires `FormsModule` to be imported in the module.

---

## Directives

### Structural Directives (change the DOM structure)

```html
<!-- *ngFor — render a list -->
<li *ngFor="let user of users">
  <app-user [user]="user" />
</li>

<!-- *ngIf — conditional render -->
<app-tasks *ngIf="selectedUser" [name]="selectedUser.name" />

<!-- *ngIf with else — fallback template -->
<app-tasks *ngIf="selectedUser; else fallback" [name]="selectedUser.name" />
<ng-template #fallback>
  <h1>Select a user</h1>
</ng-template>
```

> `*ngFor` and `*ngIf` come from `CommonModule` (imported in `TasksModule`) or `BrowserModule` (imported in `AppModule`).

### Attribute Directives (change appearance/behavior)

```html
<!-- [ngClass] — apply CSS class conditionally -->
<button [ngClass]="selected ? { active: true } : { active: false }">
```

### Angular 17+ Control Flow (new syntax — commented out in this project)

```html
<!-- Modern equivalent of *ngFor -->
@for (user of users; track user.id) {
  <app-user [user]="user" />
}

<!-- Modern equivalent of *ngIf / else -->
@if (selectedUser) {
  <app-tasks [name]="selectedUser.name" />
} @else {
  <h1>Select a user</h1>
}
```

> This project keeps the classic `*ngIf`/`*ngFor` syntax. The new control flow (`@if`, `@for`) is the Angular 17+ default for standalone apps.

---

## Component Communication — @Input & @Output

### Parent → Child via @Input

```ts
// child component
@Input({ required: true }) user!: User;
@Input({ required: true }) selected!: boolean;
```

```html
<!-- parent template -->
<app-user [user]="user" [selected]="selectedUser?.id === user.id" />
```

- `required: true` — Angular throws an error at compile time if the parent forgets to pass it
- `!` (non-null assertion) — tells TypeScript "this will be set, trust me"

### Child → Parent via @Output

```ts
// child component
@Output() select = new EventEmitter<string>();

onSelectedUser() {
  this.select.emit(this.user.id);   // send data up to parent
}
```

```html
<!-- parent template -->
<app-user (select)="onSelectUser($event)" />
```

```ts
// parent component
onSelectUser(id: string) {
  this.selectedUserId = id;
}
```

**Flow summary:**
```
Parent --> @Input  --> Child   (data flows down)
Child  --> @Output --> Parent  (events flow up)
```

---

## Services & Dependency Injection

### Defining a service

```ts
@Injectable({ providedIn: 'root' })
export class TaskService {
  private tasks = [...dummyTasks];  // private state

  getUserTasks(userId: string) {
    return this.tasks.filter(task => task.userId === userId);
  }

  addTask(taskObj: NewTask, userId: string) {
    this.tasks.unshift({ id: 't' + ..., userId, ...taskObj });
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }
}
```

### `providedIn: 'root'`
- Creates a **singleton** — one instance shared across the entire app
- **Tree-shakeable** — if nothing injects it, Angular removes it from the bundle

### Injecting a service into a component

```ts
export class TasksComponent {
  constructor(private tasksService: TaskService) {}

  get selectedTasks() {
    return this.tasksService.getUserTasks(this.id);
  }
}
```

- Angular reads the constructor parameter type (`TaskService`) and provides the singleton automatically
- `private` keeps it encapsulated inside the component

---

## Forms — Template Driven

Uses `FormsModule`. The template drives the form state (no separate form class needed).

```html
<form (ngSubmit)="onSubmit()">
  <input type="text" name="title" [(ngModel)]="enteredTitle" />
  <textarea name="summary" [(ngModel)]="enteredSummary"></textarea>
  <input type="date" name="due-date" [(ngModel)]="enteredDate" />

  <button type="button" (click)="onCancel()">Cancel</button>
  <button type="submit">Create</button>
</form>
```

```ts
export class NewTaskComponent {
  enteredTitle = '';
  enteredSummary = '';
  enteredDate = '';

  onSubmit() {
    this.taskService.addTask({
      title: this.enteredTitle,
      summary: this.enteredSummary,
      dueDate: this.enteredDate,
    }, this.userId);
  }
}
```

**Important:**
- Every `[(ngModel)]` input **must have a `name` attribute** or Angular throws an error
- `type="button"` prevents a plain button inside a form from accidentally submitting it
- `(ngSubmit)` fires when the form is submitted (via submit button or Enter key)

---

## Pipes

Transform data in templates without changing the underlying value.

```html
<!-- date pipe with format parameter -->
<time>{{ task.dueDate | date:'fullDate' }}</time>
<!-- Output: "Saturday, December 31, 2025" -->
```

### Pipe syntax

```
{{ value | pipeName }}
{{ value | pipeName:'param' }}
{{ value | pipeName:'param1':'param2' }}
{{ value | pipe1 | pipe2 }}   ← chaining pipes
```

### Common built-in pipes

| Pipe | Example | Output |
|---|---|---|
| `date` | `{{ date \| date:'fullDate' }}` | Saturday, December 31, 2025 |
| `date` | `{{ date \| date:'shortDate' }}` | 12/31/25 |
| `uppercase` | `{{ 'hello' \| uppercase }}` | HELLO |
| `lowercase` | `{{ 'HELLO' \| lowercase }}` | hello |
| `currency` | `{{ 9.99 \| currency:'USD' }}` | $9.99 |
| `json` | `{{ obj \| json }}` | `{ "id": "t1", ... }` |

---

## Content Projection — ng-content

Allows a parent to inject HTML **into** a child component at a designated slot.

```ts
// card.component.html
<div>
  <ng-content />   ← injected content appears here
</div>
```

```html
<!-- usage in parent -->
<app-card>
  <article>
    <h2>{{ task.title }}</h2>   ← this goes into <ng-content />
  </article>
</app-card>
```

Used in `CardComponent` and `TaskComponent` to create a reusable wrapper with consistent styling.

---

## ng-template & Template References

### Template reference variable

```html
<input #titleInput type="text" />
<button (click)="log(titleInput.value)">Log</button>
```

`#titleInput` gives you a direct reference to the DOM element in the template.

### ng-template for conditional fallback

```html
<app-tasks *ngIf="selectedUser; else fallback" [name]="selectedUser.name" />

<ng-template #fallback>
  <h1>Select a user</h1>
</ng-template>
```

- `ng-template` is never rendered by default — Angular renders it only when referenced
- `#fallback` is the template reference name used by `*ngIf`'s `else`

---

## Interfaces & Type Safety

### Defining a model interface

```ts
// user.model.ts
export interface User {
  id: string;
  avatar: string;
  name: string;
}

// task.model.ts
export interface Task {
  id: string;
  userId: string;
  title: string;
  summary: string;
  dueDate: string;
}

export interface NewTask {
  title: string;
  summary: string;
  dueDate: string;
}
```

### Usage in components

```ts
@Input({ required: true }) user!: User;
// !  → non-null assertion: tells TS this will be assigned (by Angular @Input)
// ?: → optional property
```

### Optional chaining in templates

```html
<!-- safe navigation — won't throw if selectedUser is undefined -->
[selected]="selectedUser?.id === user.id"
```

---

## Routing Setup

This project has routing wired up but no routes defined yet.

```ts
// app.routes.ts
export const routes: Routes = [];

// app.config.ts — used for standalone bootstrap (not used in this module-based app)
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
```

`RouterOutlet` is imported in `AppModule` as a standalone directive — it renders the active route's component wherever `<router-outlet>` is placed in the template.

---

## Component Patterns Used

### 1. Container / Presentational

`TasksComponent` fetches data from `TaskService` and passes it to `TaskComponent` via `@Input`. `TaskComponent` just displays — no service knowledge.

### 2. Shared Module

`SharedModule` declares `CardComponent` and exports it. Any module that imports `SharedModule` gets access to `<app-card>`.

### 3. Feature Module

`TasksModule` owns `TasksComponent`, `TaskComponent`, `NewTaskComponent`. Only `TasksComponent` is exported — internal components stay private.

### 4. Modal Dialog Pattern

`TasksComponent` holds a `showAddTaskModal` boolean. It controls visibility of `NewTaskComponent`. `NewTaskComponent` emits a `close` event when done.

### 5. Service as Shared State

`TaskService` is the single source of truth for task data. Both `TasksComponent` (reads) and `TaskComponent` (deletes) inject the same singleton.

---

## Module-based vs Standalone (Quick Ref)

| | Module-based (this project) | Standalone |
|---|---|---|
| `standalone: true` in decorator | No | Yes |
| Needs `NgModule` | Yes | No |
| Goes in `declarations[]` | Yes | No |
| Goes in `imports[]` | No | Yes (directly) |
| Bootstrap | `bootstrapModule(AppModule)` | `bootstrapApplication(AppComponent, appConfig)` |
| Dependency scope | Inherited from module | Declared in component's own `imports[]` |
| Angular version default | Pre-17 | 17+ |

---

*Angular version: 17.3.0 — Project: essentials*
