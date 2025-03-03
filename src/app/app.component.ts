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

  title = "neo4j-hackathon-ui"

  reqResArray: { text: string, sender: string }[] = [
    { text: 'Hey there 👋\nHow can I help you today?', sender: 'bot' }
  ];

  textControl = new FormControl('');
  isUserScrolledUp: boolean = false;
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  sidePanelHistory: any = [
    {
      title: "Today",
      sessions: [
        { title: "Searched query1" },
        { title: "Searched query2" },
        { title: "Searched query3" },
        { title: "Searched query4" },
        { title: "Searched query5" },
      ]
    },
    {
      title: "Previous 7 days",
      sessions: [
        { title: "Searched query1" },
        { title: "Searched query2" },
        { title: "Searched query3" },
        { title: "Searched query4" },
        { title: "Searched query5" },
      ]
    },
  ]

  constructor(public http: HttpClient) { }


  ngOnInit() {
    // let storedArray: any = JSON.parse(localStorage.getItem("reqResArray") ?? "[]");
    // this.reqResArray = storedArray;
    setTimeout(() => this.scrollToBottom(false), 100);
  }

  ngAfterViewChecked() {
    if (!this.isUserScrolledUp) {
      this.scrollToBottom(true);
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

  getResponse() {
    const userInput = this.textControl.value?.trim();
    if (!userInput) return;

    this.reqResArray.push({ text: userInput, sender: 'user' });

    const questionToSend = userInput;

    this.textControl.setValue("");

    const loadingIndex = this.reqResArray.length;
    this.reqResArray.push({ text: 'Typing...', sender: 'bot' });

    this.http.post('http://192.168.96.189:8000/get-data', { question: questionToSend }).subscribe(
      (data) => {
        let response: any = JSON.parse(JSON.stringify(data));
        this.reqResArray[loadingIndex] = { text: response.response, sender: 'bot' };
      },
      (error) => {
        console.log(error);
        this.reqResArray[loadingIndex] = { text: 'Oops! Something went wrong.', sender: 'bot' };
      }
    );
  }
}