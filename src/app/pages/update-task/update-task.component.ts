import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { TASKEMPTY, Task } from 'src/app/core/models/task';
import { TaskFilter } from 'src/app/core/models/taskFilter';
import { TASKUPDATEEMPTY, TaskUpdate } from 'src/app/core/models/taskUpdate';
import { TaskService } from 'src/app/core/services/task.service';
import { TaskFormComponent } from 'src/app/shared/task-form/task-form.component';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.css']
})
export class UpdateTaskComponent implements OnInit {

  @ViewChild(TaskFormComponent) 
  taskFormComponent!: TaskFormComponent ;

  taskData: Task = TASKEMPTY;
  taskIdToUpdate: number;
  routeSubscription: Subscription;
  taskFilter : TaskFilter = new TaskFilter;
  constructor(
    private router: Router,
    private urlRoute: ActivatedRoute,
    private taskService : TaskService
  ) {
    this.routeSubscription = new Subscription;
    this.taskIdToUpdate = -1;
  }

  ngOnInit(): void {
    this.LoadTaskByIdToUpdate();
  }

  async LoadTaskByIdToUpdate() {
    try {
      this.routeSubscription = this.urlRoute.params.subscribe(params => {
        if (params['id']) {
          this.taskIdToUpdate = params['id'];
        }
      })
      this.taskFilter.taskId = this.taskIdToUpdate;
      const getTaskId = await this.taskService.getTaskList(this.taskFilter);
      if (getTaskId.ok) {
        this.taskData = getTaskId.data[0];
        
      }
    }
    catch (error) {
      console.log(error)
    }
  }

  async onFormSubmit(taskData: Task) { 
    try {
      const updateTask = await this.taskService.putTask(taskData);
      if (updateTask.ok) {
        this.taskData = updateTask.data;
        this.redirectToHomePage()
      }
    } catch (error) {
      console.log(error);
    }
  }

  saveTask() {
    this.taskFormComponent.getBackFormData();
  }

  redirectToHomePage(): void {
    this.router.navigate(['/task']);
  }
}
