import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent {

  reqResArray: any = [];
  textControl = new FormControl('');
  isUserScrolledUp: boolean = false;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor(public http: HttpClient) {}


  ngOnInit() {
    let storedArray: any = JSON.parse(localStorage.getItem("reqResArray") ?? "[]");
    this.reqResArray = storedArray;
    setTimeout(() => this.scrollToBottom(false), 100); // Ensure it scrolls on init without animation
  }

  ngAfterViewChecked() {
    if (!this.isUserScrolledUp) {
      this.scrollToBottom(true); // Smooth scroll only when a new message is added
    }
  }

  scrollToBottom(smooth: boolean) {
    try {
      this.scrollContainer.nativeElement.scrollTo({
        top: this.scrollContainer.nativeElement.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    } catch (err) {
      console.error("Scroll error:", err);
    }
  }

  onUserScroll() {
    const element = this.scrollContainer.nativeElement;
    this.isUserScrolledUp = element.scrollTop + element.clientHeight < element.scrollHeight;
  }
  
  getResponse(newQuery: any) {
    this.http.post('http://192.168.96.189:7000/get-employee', { question: newQuery.req }).subscribe(
      (data) => {
        let response: any = JSON.parse(JSON.stringify(data));
        let namesString = ""; // Initialize an empty string

        for (let i = 0; i < response.data.length; i++) {
            namesString += response.data[i].name;
            if (i < response.data.length - 1) {
                namesString += ", "; // Add comma and space except for the last item
            }
        }
        newQuery.res = namesString;
        this.reqResArray[newQuery.id] = newQuery;
        localStorage.setItem('reqResArray', JSON.stringify(this.reqResArray));
        this.textControl.setValue("");
      }, (error) => {
        console.log(error);
        this.reqResArray[newQuery.id].res = "api response";
        localStorage.setItem('reqResArray', JSON.stringify(this.reqResArray));
        this.textControl.setValue("");
      }
    )
  }
  
  onClick() {
    let newId = this.reqResArray.length + 1;
    let newQuery: any = { id: newId, req: this.textControl.value, res: "..." };
    this.reqResArray.push(newQuery);
    localStorage.setItem('reqResArray', JSON.stringify(this.reqResArray));
    this.getResponse(newQuery);
    this.isUserScrolledUp = false; // Auto-scroll when new messages are added
    this.scrollToBottom(true);
    this.textControl.setValue("");
  }
}
