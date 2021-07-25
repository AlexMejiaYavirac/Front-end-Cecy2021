import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { error } from 'protractor';
import { debounceTime } from 'rxjs/operators';
import { Status } from 'src/app/models/app/status';
import { User } from 'src/app/models/auth/user';
import { Course } from 'src/app/models/cecy/Course';
import { Planification } from 'src/app/models/cecy/Planification';
import { AppService } from 'src/app/services/app/app.service';
import { CecyHttpService } from 'src/app/services/cecy/cecy-http.service';
import Swal from 'sweetalert2'


@Component({
  selector: 'app-full-planificacion',
  templateUrl: './full-planificacion.component.html',
  styleUrls: ['./full-planificacion.component.css']
})
export class FullPlanificacionComponent implements OnInit {

  constructor(
    private cecyHttpService: CecyHttpService,
    private formBuilder: FormBuilder,
    private AppHttpService: AppService) {
    this.buildForm();
  }

  //Variables paginacion
  first = 0;
  rows = 1;

  updateVariable: number = null // Varibale para actualizar planificacion 

  display: boolean = false;  //Variable para mostrar el modal


  formPlanification: FormGroup;  // Variable para manejar formulatio reactivo

  validarFecha = new Date(); // Solo tomar fechas desde al dia de hoy [minDate]="validarFecha"

  planifications: Planification[]; //Variable para almacenar la data de  planificacion
  users: User[]; //variable para almacenar usuarios  
  courses: Course; //variable para almacenar usuarios  
  status: Status[]; //Variables para guardar status
  onePlanification: Planification; //Variables para guardar una sola planificacion

  ngOnInit() {
    this.getPlanifications();
    this.getUsers();
    this.getCourses();
    this.getStatus();
    console.log(this.planifications.length)
  }

  //funcion para obtener todas las planificaciones
  getPlanifications() {
    this.cecyHttpService.get('planification/all').subscribe(
      response => {

        this.planifications = response['data'];
        console.log(this.planifications)
      }
    )
  }

  // Funcion para traer todos los usuarios para poder designar un responsable cecy
  getUsers() {
    this.cecyHttpService.get('course/responsables').subscribe(
      response => {
        this.users = response['data'];
        console.log(this.users);
      }, error => {
        console.log(error);
      });
  }

  //Funcion para obtener los estados requeridos par una planificacion
  getStatus() {
    const params = new HttpParams().append('type', 'STATUS_TYPE');
    this.AppHttpService.getCatalogues(params).subscribe(response => {
      this.status = response['data'];
      console.log(response)
    }, error => {
      console.log(error);
    });
  }

  // Funcion para traer todos los cursos para escoger uno
  getCourses() {
    this.cecyHttpService.get('course/all').subscribe(
      response => {
        this.courses = response['data'];
        console.log(this.courses);
      }, error => {
        console.log(error);
      });
  }


  // Funcion para traer todos los cursos para escoger uno
  getOnePlanificacion($idPlanificaction) {

    $idPlanificaction != null ? this.updateVariable = $idPlanificaction : this.updateVariable = null
    console.log(this.updateVariable)

    this.cecyHttpService.get('planification/OnePlanification/' + $idPlanificaction).subscribe(
      response => {
        this.onePlanification = response['data'][0];
        this.formPlanification.patchValue({
          date_start: new Date(this.onePlanification.date_start),
          date_end: new Date(this.onePlanification.date_end),
          course: this.onePlanification.course,
          user: this.onePlanification.user,
          status: this.onePlanification.status,
          needs: this.onePlanification.needs,
        });
        this.display = true

        console.log(this.onePlanification);
      }, error => {
        console.log(error);
      });
  }



  //Funcion para mostar el modal 
  showDialog() {
    this.display = true;
    this.updateVariable = null;
    this.formPlanification.reset()
  }

  //Creacion de formulario reactivo 
  private buildForm() {
    this.formPlanification = this.formBuilder.group({
      id: [null],
      course: [null, [Validators.required]],
      user: [null, [Validators.required]],
      date_start: [null, [Validators.required]],
      date_end: [null, [Validators.required]],
      needs: this.formBuilder.array([
        this.formBuilder.control(null, Validators.required)
      ]),
      status: [null, [Validators.required]]

    });



    //get de los campos

    this.formPlanification.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(value => {
        console.log(value);
      });

  }



  //Gets forms para json y recorra el array
  get needs() {
    return this.formPlanification.get('needs') as FormArray;
  }

  addNeeds() {
    this.needs.push(this.formBuilder.control(null, Validators.required));
  }

  lessNeeds(index) {
    this.needs.removeAt(index);
  }

  get idField() {
    return this.formPlanification.get('id');
  }



  //Funcion crear Planificacion
  storePlanification() {
    this.display= false;
    Swal.fire({
      title: '¿Estás seguro de crear esta planificación?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, crear!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.cecyHttpService.store('planification/createPlanification', { "planification": this.formPlanification.value }).subscribe(
          response => {
            console.log(response)
    
            setTimeout(() => {
              this.getPlanifications()
    
            }, 500);
          },
          error => {
            console.log(error)
          }
        )
        Swal.fire(
          'Planificacion Creada!',
          '',
          'success'
        )
      }
    })

 

  }

  // updatePlanification
  updatePlanification() {
    this.display = false;

    Swal.fire({
      title: '¿Estás seguro de actualizar esta planificación?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, actualiza!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.cecyHttpService.update('planification/' + this.updateVariable, { "planification": this.formPlanification.value }).subscribe(
          response => {
            console.log(response)
    
            setTimeout(() => {
              this.getPlanifications()
    
            }, 500);
          },
          error => {
            console.log(error)
          }
        )

        Swal.fire(
          'Planificacion Actualizada!',
          '',
          'success'
        )
      }
    })
   

  }


  deletePlanificacion($id){

    Swal.fire({
      title: '¿Estás seguro de eliminar esta planificación?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.cecyHttpService.delete('planification/' + $id).subscribe(
          responce=>{
            console.log(responce)
          },error=>{
            console.log(error)
          }
    
        )

        setTimeout(() => {
          this.getPlanifications()

        }, 500);

        Swal.fire(
          'Planificacion Eliminada!',
          '',
          'success'
        )
      }
    })
   
   
  }


  onSubmit() {
    if (this.formPlanification.valid) {

      if (this.updateVariable != null) {
        this.updatePlanification();
      } else {
        this.storePlanification();
      }

    }else{
      console.log('error')
    }

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
    return this.planifications ? this.first === (this.planifications.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.planifications ? this.first === 0 : true;
  }


}
