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

  constructor(public http: HttpClient) {}


  ngOnInit() {
    // let storedArray: any = JSON.parse(localStorage.getItem("reqResArray") ?? "[]");
    // this.reqResArray = storedArray;
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
  
  getResponse() {
    if (!(this.textControl.value?? "").trim()) return;

    // Add user message
    this.reqResArray.push({ text: this.textControl.value ?? "", sender: 'user' });
    this.textControl.setValue("");

    this.http.post('http://192.168.96.189:7000/get-employee', { question: this.textControl.value }).subscribe(
      (data) => {
        let response: any = JSON.parse(JSON.stringify(data));
        // let namesString = ""; // Initialize an empty string

        // for (let i = 0; i < response.data.length; i++) {
        //     namesString += response.data[i].name;
        //     if (i < response.data.length - 1) {
        //         namesString += ", "; // Add comma and space except for the last item
        //     }
        // }
        // newQuery.res = namesString;
        // this.reqResArray[newQuery.id] = newQuery;
        // localStorage.setItem('reqResArray', JSON.stringify(this.reqResArray));
        this.reqResArray.push({ text: response.response, sender: 'bot' });
      }, (error) => {
        console.log(error);
        // this.reqResArray[newQuery.id].res = "api response";
        // localStorage.setItem('reqResArray', JSON.stringify(this.reqResArray));
        // this.textControl.setValue("");
        this.reqResArray.push({ text: 'Oops! Something went wrong.', sender: 'bot' });
      }
    )
  }
}


// import { Component, ElementRef, ViewChild, OnInit, AfterViewChecked } from '@angular/core';
// import { FormControl } from '@angular/forms';
// import { ChatService } from './chat.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   standalone: false,
//   styleUrls: ['./app.component.css'],
// })
// export class AppComponent implements OnInit, AfterViewChecked {  
//   reqResArray: any[] = [];
//   textControl = new FormControl('');
//   isUserScrolledUp: boolean = false;
//   isLoading: boolean = false;
  
//   @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

//   constructor(private chatService: ChatService) {}

//   ngOnInit() {
//     this.loadChatHistory();
//     setTimeout(() => this.scrollToBottom(false), 100);
//   }

//   ngAfterViewChecked() {
//     if (!this.isUserScrolledUp) {
//       this.scrollToBottom(true);
//     }
//   }

//   loadChatHistory() {
//     this.reqResArray = JSON.parse(localStorage.getItem("reqResArray") ?? "[]");
//   }

//   scrollToBottom(smooth: boolean) {
//     try {
//       this.scrollContainer.nativeElement.scrollTo({
//         top: this.scrollContainer.nativeElement.scrollHeight,
//         behavior: smooth ? "smooth" : "auto",
//       });
//     } catch (err) {
//       console.error("Scroll error:", err);
//     }
//   }

//   onUserScroll() {
//     const element = this.scrollContainer.nativeElement;
//     this.isUserScrolledUp = element.scrollTop + element.clientHeight < element.scrollHeight;
//   }

//   async onClick() {
//     let newQuery = {
//       id: this.reqResArray.length + 1,
//       req: this.textControl.value,
//       res: "..."
//     };

//     this.reqResArray.push(newQuery);
//     this.isLoading = true;
//     localStorage.setItem('reqResArray', JSON.stringify(this.reqResArray));
//     this.textControl.setValue('');

//     try {
//       const response = await this.chatService.getResponse(newQuery.req ?? "");
//       newQuery.res = response;
//     } catch (error) {
//       console.log(error);
//       newQuery.res = "Error fetching response";
//     } finally {
//       this.isLoading = false;
//       this.reqResArray[newQuery.id - 1] = newQuery;
//       localStorage.setItem('reqResArray', JSON.stringify(this.reqResArray));
//       this.scrollToBottom(true);
//     }
//   }

//   clearChat() {
//     this.reqResArray = [];
//     localStorage.removeItem('reqResArray');
//   }
// }

