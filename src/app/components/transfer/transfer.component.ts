import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { TransferService } from 'src/app/services/transfer.service';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
  providers: [TransferService]
})
export class TransferComponent implements OnInit {

  formSubmitted = false;
  userForm: FormGroup = new FormGroup({
    transferAddress: new FormControl(''),
    amount: new FormControl(''),
    remarks: new FormControl('')
  });
  user: any;

  accountValidationMessages = { transferAddress: [
    { type: 'required', message: 'Transfer Address is required' },
    { type: 'minLength', message: 'Transfer Address must be 42 characters long' },
    { type: 'maxLength', message: 'Transfer Address must be 42 characters long' }],
    amount: [
    { type: 'required', message: 'Amount is required' },
    { type: 'pattern', message: 'Amount must be a positive number'}],
    remarks: [
    { type: 'required', message: 'Remarks are required' } ]
  };

  constructor(private fb: FormBuilder,
    private transferService: TransferService) { }

  ngOnInit(): void {
    this.formSubmitted = false;
    this.user = {address: '', transferAddress: '', balance: '',
    amount: '', remarks: ''};
    this.getAccountAndBalance();
    this.createForms()
  }

  createForms() {
    this.userForm = this.fb.group({
    transferAddress: new FormControl(this.user.transferAddress, Validators.compose([
    Validators.required, Validators.minLength(42), Validators.maxLength(42)
    ])),
    amount: new FormControl(this.user.amount, Validators.compose([
    Validators.required,
    Validators.pattern('^[+]?([.]\\d+|\\d+[.]?\\d*)$') ])),
    remarks: new FormControl(this.user.remarks, Validators.compose([
    Validators.required ]))
    }); 
  }

  getAccountAndBalance = () => { 
    const that = this; 
    that.user.address = '0x59eA8bf70919E57A245Df7405c641911496A9CC8'; 
    that.user.balance = 50;
    // TODO: fetch data
    // const that = this;
    // this.transferService.getAccounts().then((x)=>{
    //   console.log(x);

    // }).catch((err)=>{
    //   console.log(err);
    // })
    
    this.transferService.getUserAccountAndBalance().then(function(retAccount: any) {
      that.user.address = retAccount.account;
      that.user.balance = retAccount.balance;
      console.log('transfer.components :: getAccountAndBalance :: that.user');
      console.log(that.user);
    }).catch(function(error) {
      console.log(error);
    });
  }

  submitForm() {
    if (this.userForm.invalid) {
      alert('transfer.components :: submitForm :: Form invalid'); return;
    } else {
      console.log('transfer.components :: submitForm :: this.userForm.value');
      console.log(this.userForm.value);
      this.transferService.transferEtherTest2(this.userForm.value);
      // this.transferService.transferEther(this.userForm.value).
      //   then(function() {}).
      //   catch(function(error) {
      //   console.log(error);
      // });
    } 
  }

}
