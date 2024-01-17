import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { LostbornService } from '../../services/lostborn.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-dialog-product-content',
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
    MatTabsModule
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})

export class ProductContentComponent {

  @Input() _data: any; // Input property to receive the data
  editForm!: FormGroup;

  record: any = []; //data we're passing thru.
  isEditing: boolean = false;
  isDirty: boolean = false;
  isNew: boolean = false;
  canDelete: boolean = true;

  fragranceSelectOptions: any[] = [];
  statusSelectOptions: any[] = [];

  ID = 0;
  title = '';
  weight = '';
  description = '';
  price = 0;
  imageUrl = '';
  prodFrag: string[] = [];
  prodStatus: any[] = [];
  descriptionLong = '';
  inStock = 0;
  averageRating = 0;
  imageUrlDetail = '';

  fragranceSelectedValues: string[] = [];
  statusSelectedValues: string[] = [];


  // private method that retrieves index of fragrance and status data we receive...
  private getSelectedValues(data: string[], options: Fragrance[]): string[] {
    return data.map((item) => {
      const selectedOption = options.find((option) => option.viewValue === item);
      return selectedOption ? selectedOption.value : '0';
    });
  }
  private getSelectedData(data: string[] | null, options: Fragrance[]): string[] {
    if (!data) {
      return [];
    }

    return data.map((item) => {
      const selectedOption = options.find((option) => option.value === item);
      return selectedOption ? selectedOption.viewValue : '0';
    });
  }

  ngOnInit(): void {

  }

  // Create a function to set values based on incoming data
  setData(data: any): void {

    this.ID = data.row.ID || 0;
    this.title = data.row.Title || '';
    this.weight = data.row.Weight || '';
    this.description = data.row.Description || '';
    this.price = data.row.Price || 0;
    this.imageUrl = data.row.ImageUrl || '';
    this.prodFrag = data.row.ProdFrag || [];
    console.log('Prod frag data: ', this.prodFrag)
    const prodFragArray = JSON.parse(data.row.ProdFrag || '[]');
    this.fragranceSelectedValues = this.getSelectedValues(prodFragArray, this.fragrances);
    this.prodStatus = data.row.ProdStatus || [];
    const prodStatusArray = JSON.parse(data.row.ProdStatus || '[]');
    this.statusSelectedValues = this.getSelectedValues(prodStatusArray, this.statuses);
    this.descriptionLong = data.row.DescriptionLong || '';
    this.inStock = data.row.InStock || 0;
    this.averageRating = data.row.AverageRating || 0;
    this.imageUrlDetail = data.row.ImageUrlDetail || '';


    // Set initial values for other properties as needed
    // ...
    // Set initial values for form controls
    // Set initial values for form controls
    console.log('Setting fragrance select: ', this.fragranceSelectedValues);

    console.log('Setting status select: ', this.statusSelectedValues);



    // Set initial values for form controls with a slight delay

  }

  // Update the setData function to set initial values in the "General" tab
  setFormData(data: any): void {
    this.ID = data.row.ID || 0;
    // Set initial values for the "General" tab
    this.editForm.patchValue({
      title: data.row.Title || '',
      weight: data.row.Weight || '',
      description: data.row.Description || '',
      price: data.row.Price || 0,
      prodFrag: data.row.ProdFrag || '',
      prodStatus: data.row.ProdStatus || '',
      descriptionLong: data.row.DescriptionLong || '',
      inStock: data.row.InStock || 0,
      averageRating: data.row.AverageRating || 0,
      imageUrl: data.row.ImageUrl || '',
      imageUrlDetail: data.row.ImageUrlDetail || ''
    });
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dataService: LostbornService,
    private dialogRef: MatDialogRef<ProductContentComponent>,
    private snackBar: MatSnackBar
  ) {
    this.record = data.row; // record will be the main data point & will remain untouched.
    this.isNew = data.isNew;

    console.log('Initialized data: ', data.row);

    //set select vars from passed data...

    if (!this.isNew) {

      // Initialize form group with values from row..
      this.setData(data);


    } else {
      //initialize form group with default values...

      this.isEditing = true;
    }

    // Initialize the form group using FormBuilder
    this.editForm = this.fb.group({

      title: [this.title, Validators.required], // Add validation if needed
      weight: [this.weight, Validators.required ],
      description: [this.description, Validators.required],
      price: [this.price, Validators.required],
      imageUrl: [this.imageUrl, Validators.required],
      prodFrag: [this.fragranceSelectedValues, Validators.required],
      prodStatus: [this.statusSelectedValues, Validators.required],
      descriptionLong: [this.descriptionLong, Validators.required],
      inStock: [this.inStock, Validators.required],
      averageRating: [this.averageRating, Validators.required],
      imageUrlDetail: [this.imageUrlDetail, Validators.required],
      // Add other form controls here
    });

    // Subscribe to value changes of the form controls
    // Subscribe to value changes of the form controls
    this.editForm.get('prodFrag')?.valueChanges.subscribe(() => {
      this.onChanged();
    });

    this.editForm.get('prodStatus')?.valueChanges.subscribe(() => {
      this.onChanged();
    });
  }

  onSave(): void {
    // Save logic...

    //get ID & form data...
    const id = this.ID;

    //Reference select controls...
    const selectedStatuses: string[] = this.getSelectedData(this.editForm.get('prodStatus')?.value, this.statuses);
    const selectedFragrances: string[] = this.getSelectedData(this.editForm.get('prodFrag')?.value, this.fragrances);

    // Now you can use selectedStatuses and selectedFragrances as needed
    console.log('Selected Product Statuses:', selectedStatuses);
    console.log('Selected Product Fragrances:', selectedFragrances);

    const formData = {
      Title: this.editForm.get('title')?.value,
      Weight: this.editForm.get('weight')?.value,
      Description: this.editForm.get('description')?.value,
      Price: this.editForm.get('price')?.value,
      ImageUrl: this.editForm.get('imageUrl')?.value,
      ProdFrag: JSON.stringify(selectedFragrances),
      ProdStatus: JSON.stringify(selectedStatuses),
      DescriptionLong: this.editForm.get('descriptionLong')?.value,
      InStock: this.editForm.get('inStock')?.value,
      AverageRating: this.editForm.get('averageRating')?.value,
      ImageUrlDetail: this.editForm.get('imageUrlDetail')?.value,
    };

    console.log(formData);

    if (!this.isDirty) {
      this.snackBar.open('No changes to save.', 'Close', {
        duration: 2000, // Duration in milliseconds
      });
      return;
    } else {
      // Check if the form values are different from the original values
      if (this.isDirty) {
        if (this.isNew) {

          console.log('Create values: ', formData);
          this.dataService.addProductData(formData).subscribe(
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
            ID: id
          }
          mParams = { ...mParams, ...formData };
          console.log('Update values: ', mParams);
          this.dataService.updateProductData(mParams).subscribe(
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
  onChanged(): void {
    this.isDirty = true;
  }
  onGoBack(): void {
    if (this.isEditing && !this.isNew) {
      //We're attempting to go back whist editing...
      if (this.isDirty) {
        //We've made changes, display pop up to user...
        const confirmClose = window.confirm('You have unsaved changes. Do you really want to close?');
        if (!confirmClose) {
          // Prevent the dialog from closing
          return;
        }
        else {
          this.dialogRef.close();
        }
      }
      else { this.isEditing = false; }
    }
    else {
      //close dialogue box...
      this.dialogRef.close();
    }
  }
  onDelete(): void {
    // Display a success message using MatSnackBar
    this.snackBar.open('Data Deleted successfully!', 'Close', {
      duration: 2000, // Duration in milliseconds
    });

    console.log('Attempting to Delete Product with Rec. ID:', this.ID);

    this.dataService.deleteProductData(this.ID).subscribe(
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
  onReset(): void {
    // Reset the form controls to their initial values

    // Set isDirty to false after resetting
    this.isDirty = false;
  }
  onEdit(event: any): void {
    if (!this.isDirty) {
      this.isEditing = true;
    }
  }
  // Helper function to check if the form values are different from the original values
  formValuesChanged(): boolean {
    const formControls = this.editForm.controls;
    console.log(formControls);

    return Object.keys(formControls).some(
      (key) => {
        const formControlValue = formControls[key]?.value;
        const recordValue = this.record[key];

        // Check for null or undefined values
        const isDifferent = formControlValue !== recordValue;

        // Add additional conditions if needed
        console.log(`Did ${key} change?`, isDifferent);
        return isDifferent;
      }
    );
  }

  statuses: Fragrance[] = [
    { value: '1', viewValue: 'CLEAN' },
    { value: '2', viewValue: 'NEW' },
    { value: '3', viewValue: 'EXCLUSIVE' }
  ];

  fragrances: Fragrance[] = [
    { value: '1', viewValue: 'Cardamom' },
    { value: '2', viewValue: 'Ambroxan' },
    { value: '3', viewValue: 'Leather' },
    { value: '4', viewValue: 'Fig' },
    { value: '5', viewValue: 'Coconut' },
    { value: '6', viewValue: 'Jasmine' },
    { value: '7', viewValue: 'White Florals' },
    { value: '8', viewValue: 'Vanilla' },
    { value: '9', viewValue: 'Passion Flower' },
    { value: '10', viewValue: 'Vetiver' },
    { value: '11', viewValue: 'Bergamat' },
    { value: '12', viewValue: 'Copal' },
    { value: '13', viewValue: 'Patchouli' },
    { value: '14', viewValue: 'Petitgrain' },
    { value: '15', viewValue: 'Tonka Bean Variety' }
  ];


}

interface Fragrance {
  value: string;
  viewValue: string;
}
