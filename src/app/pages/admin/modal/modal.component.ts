import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseFormUser } from '@app/shared/utils/base-form-user';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { UserService } from '../services/user.service';

enum Action {
  EDIT = 'edit',
  NEW = 'new',
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent implements OnInit {
  actionTODO = Action.NEW;

  
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public userForm: BaseFormUser,
    private userSvc: UserService
  ) {}
  
 



  ngOnInit(): void {
    if (this.data?.user.hasOwnProperty('id')) {
      this.actionTODO = Action.EDIT;
      this.data.title = 'Edit User';
      this.userForm.baseForm.updateValueAndValidity();
      this.pathFormData();
    } else {
      this.userForm.baseForm.markAsUntouched();
      this.userForm.baseForm.get('name').setValue(null);
      this.userForm.baseForm.get('age').setValue(null);
      this.userForm.baseForm.get('birth').setValue(null);
      this.userForm.baseForm.get('inscription').setValue(null);
      this.userForm.baseForm.updateValueAndValidity();
    }
  }


  onSave(): void {
    const formValue = this.userForm.baseForm.value;

 
    if (this.actionTODO === Action.NEW) {
  
      this.userSvc.new(formValue).subscribe((res: any) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    } else {
      const userId = this.data?.user?.id;
   
      this.userSvc.update(userId, formValue).subscribe((res: any) => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: res.message,
          showConfirmButton: false,
          timer: 1000,
        });
      });
    }
  }

  private pathFormData(): void {
    this.userForm.baseForm.patchValue({
      name: this.data?.user?.name,
      age: this.data?.user?.age,
      birth: this.data?.user?.birth,
      inscription: this.data?.user?.inscription,
      cost: this.data?.user?.cost,
    });
  }

  

  checkField(field: string): boolean {
    return this.userForm.isValidField(field);
  }
}
