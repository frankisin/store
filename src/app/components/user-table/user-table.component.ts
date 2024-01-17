import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LostbornService } from '../../services/lostborn.service';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ProductContentComponent } from '../../dialogue/product/product.component';
import { DialogContentUserComponent } from '../../dialogue/dialog-content/dialog-content-user.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatPaginatorModule, MatTableModule, MatSortModule, MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.css']
})

export class UserTableComponent implements AfterViewInit {
  members: any[] = [];
  isEditing: boolean = false;
  isDeveloper: boolean = true;
  isDirty: boolean = false;

  dataSource = new MatTableDataSource<Record>();
  dataSourceLength: number = 0;

  @ViewChild(MatPaginator)
  paginator: MatPaginator | null = null;

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'ID',
    'Role',
    'FirstName',
    'LastName',
    'StreetAddress',
    'City',
    'ZipCode',
    'Email',
    'username', // Change this to lowercase 'username'
    'Password',
  ];

  toppings = new FormControl('');

  constructor(private lostBornService: LostbornService, public dialog: MatDialog) { }

  ngAfterViewInit() {
    this.lostBornService.getAllUserData().subscribe((data?: Record[]) => {
      this.members = data || [];
      console.log(data);
      this.dataSource = new MatTableDataSource(data);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;

      this.dataSourceLength = this.dataSource.data.values.length;
    });
  }

  onRowClick(row: any): void {
    console.log('Row clicked: ', row);
    const dialogRef = this.dialog.open(DialogContentUserComponent, {
      data: {
        isNew: false,
        row: row as any,
      },
      width: '600px',
      height: '600px',
      closeOnNavigation: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed:', result);
      this.lostBornService.getAllUserData().subscribe((data?: Record[]) => {
        console.log('Making backend read...');
        this.members = data || [];
        console.log('Table data: ',this.members);
        this.dataSource.data = this.members;
      });
    });
  }

  onChange(): void {
    this.isDirty = true;
  }

  onAddRow(): void {
    console.log('Attempting to add row...');
    const dialogRef = this.dialog.open(DialogContentUserComponent, {
      data: {
        isNew: true,
      },
      width: '600px',
      height: '600px',
      closeOnNavigation: true
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed:', result);
      this.lostBornService.getAllUserData().subscribe((data?: Record[]) => {
        console.log('Making backend read...');
        this.members = data || [];
        this.dataSource.data = this.members;
      });
    });
  }

  applyFilterSearch(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.paginator) {
      this.paginator.firstPage();
    }
  }
}

export interface Record {
  ID: number;
  FirstName: string;
  LastName: string;
  StreetAddress: string;
  City: string;
  ZipCode: string;
  Email: string;
  UserName: string;
  Password: string;
}
