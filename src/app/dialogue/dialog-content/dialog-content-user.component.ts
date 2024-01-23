import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { LostbornService } from '../../services/lostborn.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-dialog-content-user',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
  ],
  templateUrl: './dialog-content-user.component.html',
  styleUrl: './dialog-content-user.css',
})
export class DialogContentUserComponent {
  @Input() _data: any; // Input property to receive the data
  editForm!: FormGroup;

  record: any = []; //data we're passing thru.
  isEditing: boolean = false;
  isDirty: boolean = false;
  isNew: boolean = false;
  canDelete: boolean = true;

  // Create separate form controls for each select control
  ipPlanControl = new FormControl('');
  userTypeControl = new FormControl('');
  planStatusControl = new FormControl('');
  accessPageControl = new FormControl('');
  accessTypeControl = new FormControl('');

  // Define variables for each property
  ID: number = 0;
  Role: string = '';
  city: string = '';
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  password: string = '';
  streetAddress: string = '';
  username: string = '';
  zipCode: string = '';

  // Create a function to set values based on incoming data
  setData(data: any): void {
    this.ID = data.row.ID || 0;
    this.Role = data.row.Role || '';
    this.city = data.row.city || '';
    this.email = data.row.email || '';
    this.firstName = data.row.firstName || '';
    this.lastName = data.row.lastName || '';
    this.password = data.row.password || '';
    this.streetAddress = data.row.streetAddress || '';
    this.username = data.row.username || '';
    this.zipCode = data.row.zipCode || '';
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: any,
    private fb: FormBuilder,
    private dataService: LostbornService,
    private dialogRef: MatDialogRef<DialogContentUserComponent>,
    private snackBar: MatSnackBar
  ) {
    this.record = data.row; // record will be the main data point & will remain untouched.
    this.isNew = data.isNew;

    if (!this.isNew) {
      // Initialize form group with values from row..
      this.editForm = this.fb.group({
        firstName: [this.data.row.firstName],
        lastName: [this.data.row.lastName],
        streetAddress: [this.data.row.streetAddress],
        city: [this.data.row.city],
        zipCode: [this.data.row.zipCode],
        email: [this.data.row.email],
        username: [this.data.row.username],
        password: [this.data.row.password],
      });
      this.setData(data);
    } else {
      // initialize form group with default values...
      this.editForm = this.fb.group({
        firstName: [this.firstName],
        lastName: [this.lastName],
        streetAddress: [this.streetAddress],
        city: [this.city],
        zipCode: [this.zipCode],
        email: [this.email],
        username: [this.username],
        password: [this.password],
      });
      this.isEditing = true;
    }
    // Subscribe to value changes of the form controls
    this.editForm.valueChanges.subscribe(() => {
      // Set isDirty to true when changes are made
      this.isDirty = true;
    });
  }

  onEdit(event: any): void {
    if (!this.isDirty) {
      this.isEditing = true;
    }
  }

  onReset(): void {
    // Reset the form controls to their initial values
    // Set input fields to default..
    this.editForm.patchValue({
      firstName: this.firstName,
      lastName: this.lastName,
      streetAddress: this.streetAddress,
      city: this.city,
      zipCode: this.zipCode,
      email: this.email,
      username: this.username,
      password: this.password,
    });
    // Set isDirty to false after resetting
    this.isDirty = false;
  }

  onSave(): void {
    // Save logic...
    // get input controls...
    const id = this.ID;
    const firstNameVal = this.editForm.get('firstName')?.value;
    const lastNameVal = this.editForm.get('lastName')?.value;
    const streetAddressVal = this.editForm.get('streetAddress')?.value;
    const cityVal = this.editForm.get('city')?.value;
    const zipCodeVal = this.editForm.get('zipCode')?.value;
    const emailVal = this.editForm.get('email')?.value;
    const usernameVal = this.editForm.get('username')?.value;
    const passwordVal = this.editForm.get('password')?.value;

    if (!this.isDirty) {
      this.snackBar.open('No changes to save.', 'Close', {
        duration: 2000, // Duration in milliseconds
      });
      return;
    } else {
      // Check if the form values are different from the original values
      if (this.formValuesChanged()) {
        if (this.isNew) {
          // Logic for creating a record...
          let mParams = {

            firstName: firstNameVal,
            lastName: lastNameVal,
            streetAddress: streetAddressVal,
            city: cityVal,
            zipCode: zipCodeVal,
            email: emailVal,
            username: usernameVal,
            password: passwordVal,
            Role: this.Role,  // Set Role to an appropriate value or leave it as an empty string
            Carts: [{
              UserID: id,
              User: {
                ID: this.ID,
                Role: this.Role,
                city: this.city,
                email: this.email,
                firstName: this.firstName,
                lastName: this.lastName,
                password: this.password,
                streetAddress: this.streetAddress,
                username: this.username,
                zipCode: this.zipCode,
                Carts: []
              }
            }]
          }
          console.log('Create values: ', mParams);
          this.dataService.addUserData(mParams).subscribe(
            (response) => {
              // Handle success
              console.log('Record created successfully:', response);
              this.isEditing = false;
              this.snackBar.open('New record added successfully!', 'Close', {
                duration: 2000,
              });
              // Close the dialog after saving
              this.dialogRef.close();
            },
            (error) => {
              // Handle error
              console.error('Error creating record:', error);
              this.snackBar.open('Failed to add new record.', 'Close', {
                duration: 2000,
              });
            }
          );
        } else {

          // Logic for updating an existing record...
          let mParams = {
            ID: id,
            firstName: firstNameVal,
            lastName: lastNameVal,
            streetAddress: streetAddressVal,
            city: cityVal,
            zipCode: zipCodeVal,
            email: emailVal,
            username: usernameVal,
            password: passwordVal,
            Role: this.Role,
            Cart: {
              UserID: id, // Assuming UserID is the same as the user's ID
            }
          };

          console.log('Update values: ', mParams);
          this.dataService.updateUserData(mParams).subscribe(
            (response) => {
              // Handle success
              console.log('Record Updated successfully:', response);
              this.isEditing = false;
              this.snackBar.open('Record Updated successfully!', 'Close', {
                duration: 2000,
              });
              // Close the dialog after saving
              this.dialogRef.close();
            },
            (error) => {
              // Handle error
              console.error('Error creating record:', error);
              this.snackBar.open('Failed to add new record.', 'Close', {
                duration: 2000,
              });
            }
          );
        }
      } else {
        this.snackBar.open('No changes to save.', 'Close', {
          duration: 2000, // Duration in milliseconds
        });
        return;
      }
    }
  }

  onSelectChanged(): void {
    this.isDirty = true;
  }

  onDelete(): void {
    // Display a success message using MatSnackBar
    this.snackBar.open('Data Deleted successfully!', 'Close', {
      duration: 2000, // Duration in milliseconds
    });

    console.log('Attempting to Delete Rec. ID:', this.ID);

    this.dataService.deleteUserData(this.ID).subscribe(
      (response) => {
        // Handle success
        console.log('Record Deleted successfully:', response);
        this.isEditing = false;
        this.snackBar.open('Record Deleted successfully!', 'Close', {
          duration: 2000,
        });
        // Close the dialog after saving
        this.dialogRef.close();
      },
      (error) => {
        // Handle error
        console.error('Error Deleting record:', error);
        this.snackBar.open('Failed to Delete record.', 'Close', {
          duration: 2000,
        });
      }
    );

    // Close the dialog after saving
    this.dialogRef.close();
  }

  onGoBack(): void {
    if (this.isEditing && !this.isNew) {
      // We're attempting to go back whist editing...
      if (this.isDirty) {
        // We've made changes, display pop up to user...
        const confirmClose = window.confirm(
          'You have unsaved changes. Do you really want to close?'
        );
        if (!confirmClose) {
          // Prevent the dialog from closing
          return;
        } else {
          this.dialogRef.close();
        }
      } else {
        this.isEditing = false;
      }
    } else {
      // close dialogue box...
      this.dialogRef.close();
    }
  }

  // Helper function to check if the form values are different from the original values
  formValuesChanged(): boolean {
    return (
      this.editForm.get('firstName')?.value !== this.firstName ||
      this.editForm.get('lastName')?.value !== this.lastName ||
      this.editForm.get('streetAddress')?.value !== this.streetAddress ||
      this.editForm.get('city')?.value !== this.city ||
      this.editForm.get('zipCode')?.value !== this.zipCode ||
      this.editForm.get('email')?.value !== this.email ||
      this.editForm.get('username')?.value !== this.username ||
      this.editForm.get('password')?.value !== this.password
    );
  }
}
