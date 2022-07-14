import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { pipe, Subject, takeUntil } from 'rxjs';
import { ModalComponent } from './modal/modal.component';
import Swal from 'sweetalert2';
import { UserService } from './services/user.service';
import * as moment from 'moment';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  displayedColumns: string[] = ['name', 'age','birth', 'inscription', 'cost','acciones'];
  dataSource = new MatTableDataSource();
  private destroy$ = new Subject<any>();
  moment: any = moment;
  @ViewChild(MatSort) sort!: MatSort;

  
  constructor(private userSvc:UserService,private _dialog:MatDialog) { }

  loadUsers():void{
    this.userSvc.getAll()
    .subscribe(users=>{
      this.dataSource.data = users;
    },(err)=>{
      Swal.fire(err.error.message)
    })
  }


  ngOnInit(): void {
    this.loadUsers();
  }

  onOpenModal(user={}):void{
   
    this._dialog.open(ModalComponent,
    {
      height:'400px',
      width:'600px',
      hasBackdrop:false,
      data:{title:'New User',user}
    })
    .afterClosed().subscribe(res=>{
      this.loadUsers();
    })

  }

  onDelete(userId:number):void{
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir el cambio",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '¡Sí, eliminar!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userSvc.delete(userId)
        .pipe(takeUntil(this.destroy$))
          .subscribe(res=>{
            Swal.fire(
              '¡Eliminado!',
              res?.['message'],
              'success'
            )
            this.loadUsers();
          })
      }

    })
     
  }

    
 


    

}
