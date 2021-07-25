import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Status } from 'src/app/models/app/status';
import { User } from 'src/app/models/auth/user';
import { Course } from 'src/app/models/cecy/Course';
import { Planification } from 'src/app/models/cecy/Planification';
import { AppService } from 'src/app/services/app/app.service';
import { CecyHttpService } from 'src/app/services/cecy/cecy-http.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-approval',
  templateUrl: './approval.component.html',
  styleUrls: ['./approval.component.css']
})
export class ApprovalComponent implements OnInit {

  constructor(private cecyHttpService: CecyHttpService,
    private formBuilder: FormBuilder,
    private AppHttpService: AppService) { 
      this.buildForm();

    }
//Variables paginacion
first = 0;
rows = 1;

updateVariable: number = null // Varibale para actualizar planificacion 

display: boolean = false;  //Variable para mostrar el modal


formApproval: FormGroup;  // Variable para manejar formulatio reactivo


courses: Course[]; //Variable para almacenar la data de  planificacion
status: Status[]; //Variables para guardar status
onePlanification: Planification; //Variables para guardar una sola planificacion
 
ngOnInit() {

    this.getCourses();
    this.getStatus();
  }


   //funcion para obtener todas los cursos
   getCourses() {
    this.cecyHttpService.get('course/aproval').subscribe(
      response => {

        this.courses = response['data'];
        console.log(this.courses)
      }
    )
  }



  //Funcion para obtener los estados requeridos par una planificacion
  getStatus() {
    const params = new HttpParams().append('type', 'APPROVAL_TYPE');
    this.AppHttpService.getCatalogues(params).subscribe(response => {
      this.status = response['data'];
      console.log(response)
    }, error => {
      console.log(error);
    });
  }

  


  // Funcion para traer todos los cursos para escoger uno
  getOneCourse($id) {

     $id != null ? this.updateVariable = $id : this.updateVariable = null
     console.log(this.updateVariable)

    this.cecyHttpService.get('course/' + $id).subscribe(
      response => {
        this.onePlanification = response['data'][0];
        this.formApproval.patchValue({
       
          status: this.onePlanification.status,
         
        });
        this.display = true

        console.log(this.onePlanification);
      }, error => {
        console.log(error);
      });
  }



  //Creacion de formulario reactivo 
  private buildForm() {
    this.formApproval = this.formBuilder.group({
    
      status: [null, [Validators.required]]

    });

    //Guardar o editar 


    //get de los campos

    this.formApproval.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
        console.log(value);
      });

  }



  //Gets forms para json
  get needs() {
    return this.formApproval.get('needs') as FormArray;
  }

  addNeeds() {
    this.needs.push(this.formBuilder.control(null, Validators.required));
  }

  lessNeeds(index) {
    this.needs.removeAt(index);
  }

  get idField() {
    return this.formApproval.get('id');
  }



  // updatePlanification
  updateCourse() {
   this.display = false;
    Swal.fire({
      title: '¿Estás seguro de asignar esta aprobación?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.cecyHttpService.update('course/approval/' + this.updateVariable, { "course": this.formApproval.value }).subscribe(
          response => {
            console.log(response)
    
            setTimeout(() => {
              this.getCourses()
    
            }, 500);
          },
          error => {
            console.log(error)
          }
        )

        
        Swal.fire(
          'Aprobacion Asignada',
          '',
          'success'
        )
      }
    })

    
  }




  //funciones para manejar el paginado de la table
  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.courses ? this.first === (this.courses.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.courses ? this.first === 0 : true;
  }


}
