import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxUiLoaderService } from "ngx-ui-loader";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'assignmentIIMK';
  imgUrl: any;
  profile!:string;
  show: boolean=false;
  
  constructor(
    private dialog: MatDialog,
    private storage: AngularFireStorage,
    private ngxService: NgxUiLoaderService,
    private db: AngularFireDatabase,
    private snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.getprofile('gs://myfirstapp-ef5d5.appspot.com/IMG_20230224_193253.jpg')
  }
  @ViewChild('secondDialog', { static: true })
  secondDialog!: TemplateRef<any>;
  @ViewChild('fileInput')
  fileInput!: ElementRef;
  openDialogWithoutRef(value: string): void{
    this.getFile(value);
    this.dialog.open(this.secondDialog);
  }
  getFile(filePath: string) {
    this.ngxService.start();
    const fileRef = this.storage.refFromURL(filePath);
  
    fileRef.getDownloadURL().subscribe(downloadURL => {
      console.log('Download URL:', downloadURL);
       this.imgUrl=downloadURL;
      // Extract the file path from the download URL
      const path = new URL(downloadURL).pathname;
      console.log('File Path:', path);
      setTimeout(() => {
        this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
        this.show=true;
      }, 1000);
    }, error => {
      console.error('Error getting download URL:', error);
      setTimeout(() => {
        this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
        this.show=true;
      }, 1000);
    });
    this.imgUrl='';
  }
  getprofile(filePath: string) {
    this.ngxService.start();
    const fileRef = this.storage.refFromURL(filePath);
    fileRef.getDownloadURL().subscribe(downloadURL => {
       this.profile=downloadURL;
       setTimeout(() => {
         this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
         this.show=true;
       }, 1000);
      // Extract the file path from the download URL
    }, error => {
      console.error('Error getting download URL:', error);
      this.ngxService.start(); // start foreground spinner of the master loader with 'default' taskId
      // Stop the foreground loading after 5s
      setTimeout(() => {
        this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
        this.show=true;
      }, 1000);
    });
  }

  onSubmit(value: string): void {
    // Create a new Firebase database reference
    const firebaseRef = this.db.database.ref('/data');
     console.log(firebaseRef, 'firebase')
    // Push the form data to the database
    if(value !== ''){
      firebaseRef.push(value).then(() => {
        this.snackBar.open('Message submitted successfully!', 'Close', {
          duration: 2000, // Duration in milliseconds
        });
        console.log('Data sent to Firebase successfully');
      }).catch((error: any) => {
        console.error('Error sending data to Firebase:', error);
      });
    }
  }
  
  downloadFile(data:string) {
    const blob = new Blob([data], { type: 'text/csv' });
    const url= window.URL.createObjectURL(blob);
    window.open(url);
  }
  
  
  
}
