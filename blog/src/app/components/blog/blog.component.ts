import {Component, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";
import {BlogItemComponent} from "../blog-item/blog-item.component";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'blog',
  standalone: true,
  imports: [BlogItemComponent, CommonModule],
  providers: [DataService],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})

export class BlogComponent implements OnInit {
  public items: any;

  constructor(private service: DataService) {
  }

  ngOnInit() {
    this.items = this.service.getAll();
  }
}
