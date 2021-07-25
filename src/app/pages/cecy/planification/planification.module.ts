import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PlanificationRoutes } from './planification.routing';
import { FullPlanificacionComponent } from './full-planificacion/full-planificacion.component';
import { TabViewModule } from 'primeng/tabview';
import { PlanificationComponent } from './planification.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PlanificationRoutes),
    TabViewModule,
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextareaModule,
		DropdownModule,
    FormsModule,
    InputTextModule,
    CalendarModule,
    ReactiveFormsModule
    
  ],
  declarations: [
    PlanificationComponent,
    FullPlanificacionComponent,
    
  ],
  providers: []

 
})
export class PlanificationModule { }
