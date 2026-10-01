---
book: Computer Science 12 (PECTAA)
book_slug: class-12-cs
class: 12
chapter: 4
chapter_title: "Development of Graphical User Interface (GUI)"
section: board-exercise
priority: PRIMARY
book_pages: "58-59"
verbatim_source: curriculum/multan-board/class-12/computer-science/ch4-development-of-gui/source/board-exercise.md
last_updated: 2026-10-02
---

# Chapter 4 · Board EXERCISE (10 MCQs + 10 Short + 8 Long)

The questions below are verbatim from the Punjab Multan Board textbook (pages 58-59). Model answers quote the book word-for-word where possible so students can match the paper's register.

---

## Multiple Choice Questions (verbatim)

### M1

**Question:** The main purpose of a GUI in Python programming is to:

**Options:**
- a) Create a user-friendly interface for interacting with software
- b) Manage files in Python
- c) Handle network operations
- d) Store and retrieve data from databases

**Correct:** a

**Explanation:** From the book (page 46): "A GUI, or Graphical User Interface, is a visual interface that allows users to interact with software using elements like buttons, menus, and forms. GUIs are important because they make programs easier to understand and operate..."

---

### M2

**Question:** Python's built-in GUI toolkit is:

**Options:**
- a) wxPython
- b) Tkinter
- c) PyQt
- d) Kivy

**Correct:** b

**Explanation:** From the book: "Tkinter is Python's standard GUI toolkit that comes pre-installed with the language." wxPython, PyQt, and Kivy exist but are external libraries.

---

### M3

**Question:** The Tkinter widget used to display text is:

**Options:**
- a) Button
- b) Label
- c) Entry
- d) Listbox

**Correct:** b

**Explanation:** From the book: "A Label is used to display text or messages on the screen." Button is for actions, Entry is for input, Listbox is for lists.

---

### M4

**Question:** The pack() method in Tkinter is used to:

**Options:**
- a) Align widgets vertically or horizontally
- b) Organize widgets in rows and columns
- c) Set widget sizes manually
- d) Create pop-up windows

**Correct:** a

**Explanation:** From the book: "The pack() method places widgets in a simple vertical or horizontal order. It is easy to use and works well for small applications." Option (b) describes grid(), not pack().

---

### M5

**Question:** The methods used to organize widgets in Tkinter include:

**Options:**
- a) grid()
- b) pack()
- c) place()
- d) All of the above

**Correct:** d

**Explanation:** The book names three methods: "The pack() method... The grid() method... The place() method..." All three organize widgets, so "All of the above" is correct.

---

### M6

**Question:** Event-driven programming in Tkinter means:

**Options:**
- a) Writing code that runs without user input
- b) Writing code that responds to user actions such as clicks or key presses
- c) Writing code to manage database queries
- d) Writing code to handle network requests

**Correct:** b

**Explanation:** From the book: "Event-driven programming is based on actions called events... Common events include button clicks and key presses."

---

### M7

**Question:** The Tkinter widget used to get user input is:

**Options:**
- a) Label
- b) Button
- c) Entry
- d) Listbox

**Correct:** c

**Explanation:** From the book: "An Entry field is used to enter text, such as a name or password."

---

### M8

**Question:** The Tkinter layout manager that allows precise positioning of widgets using coordinates is:

**Options:**
- a) pack()
- b) grid()
- c) place()
- d) align()

**Correct:** c

**Explanation:** From the book: "The place() method positions widgets at exact locations on the window... It gives more control but needs careful adjustment." align() is not a Tkinter method.

---

### M9

**Question:** The Tkinter option that connects a button click to a function is:

**Options:**
- a) bind()
- b) configure()
- c) command= (no parentheses)
- d) execute()

**Correct:** c

**Explanation:** The book's login example uses `tk.Button(window, text="Login", command=check_login)`. The option name is literally spelled `command= (no parentheses)` in the exam paper. **CURVEBALL:** Many students write `command()` with parentheses, which calls the function immediately instead of linking it to the click. `bind()` exists but is for arbitrary events, not the simple button command binding.

---

### M10

**Question:** CRUD operations in databases stand for:

**Options:**
- a) Create, Read, Update, Delete
- b) Create, Run, Upload, Delete
- c) Copy, Retrieve, Upload, Download
- d) Create, Remove, Update, Manage

**Correct:** a

**Explanation:** From the book: "CRUD stands for Create, Read, Update, and Delete and defines basic database actions."

---

## Short Questions (verbatim)

### S1

**Question:** What is a GUI and why is it important in application development?

**Answer:** A GUI (Graphical User Interface) is a visual interface that allows users to interact with software using elements like buttons, menus, and forms. GUIs are important because they make programs easier to understand and operate, especially for non-technical users. They improve usability by providing visual feedback and reducing the need to remember complex commands. GUI applications are widely used in desktop software, web applications, and mobile apps.

**Marks:** 3

**Difficulty:** easy

---

### S2

**Question:** What is Tkinter and why is it Python's built-in GUI toolkit?

**Answer:** Tkinter is Python's standard GUI toolkit that comes pre-installed with the language. It provides a set of classes and functions to create windows, buttons, labels, entry fields, and other widgets. Tkinter is easy to learn, lightweight, and supports event-driven programming, where actions are triggered by user events. It is suitable for building small to medium-sized GUI applications quickly and efficiently.

**Marks:** 3

**Difficulty:** easy

---

### S3

**Question:** How do you create a window and add frames in Tkinter?

**Answer:** A Tkinter program begins by creating a main window with `window = tk.Tk()`. The window can be resized, given a title (`window.title(...)`), and sized (`window.geometry("400x300")`). Frames are added using `tk.Frame(window, bg=..., height=...)` and placed with `.pack()`. Frames divide the window into smaller parts, making it easier to group related widgets. This structure improves clarity and keeps the interface well-arranged.

**Marks:** 3

**Difficulty:** medium

---

### S4

**Question:** Name two common widgets used in Tkinter.

**Answer:** Two common Tkinter widgets are: Label (used to display text or messages on the screen) and Button (allows the user to perform an action when it is clicked). Other common widgets include Entry (text input), Menu (list of options at the top of the window), and Listbox (shows a list of items for selection).

**Marks:** 2

**Difficulty:** easy

---

### S5

**Question:** What is the purpose of layout management in Tkinter?

**Answer:** Layout management is used to arrange widgets inside a window in a proper way. It decides the position and size of each widget on the screen. Good layout management makes the interface clear and easy to use. It also helps in keeping the window organized. Tkinter provides different methods to manage layout: pack(), grid(), and place().

**Marks:** 3

**Difficulty:** easy

---

### S6

**Question:** How does the pack() method organize elements in Tkinter?

**Answer:** The pack() method places widgets in a simple vertical or horizontal order. It is easy to use and works well for small applications. You call `.pack()` on each widget; they stack in the order you call them. Options like `pady=10` add vertical padding and `fill="x"` makes the widget stretch horizontally.

**Marks:** 3

**Difficulty:** easy

---

### S7

**Question:** What is event-driven programming and how is it used in Tkinter?

**Answer:** Event-driven programming is based on actions called events. The program remains idle until an event occurs. Common events include button clicks and key presses. Each event is linked to a specific function, which runs only when the event happens. This approach saves system resources. In Tkinter, you link an event to a function using the `command=` parameter, for example: `tk.Button(window, text="Login", command=check_login)`. The event loop runs via `window.mainloop()`.

**Marks:** 4

**Difficulty:** medium

---

### S8

**Question:** How do you handle user input in Tkinter?

**Answer:** User input is given through widgets like Entry fields and Buttons. Widgets are connected to functions in the program. When the widget is used, the connected function executes. For example, a user types in an Entry field, and when they click a Button, the connected function reads the input with `.get()` and processes it. In the book's login form, `entry_user.get()` reads the typed username.

**Marks:** 3

**Difficulty:** medium

---

### S9

**Question:** What is the CRUD operation in database management?

**Answer:** CRUD stands for Create, Read, Update, and Delete and defines basic database actions. Create (SQL INSERT) adds new records to a table. Read (SQL SELECT) retrieves data from a table. Update (SQL UPDATE) modifies existing records. Delete (SQL DELETE) removes records. Every database-based application depends on CRUD operations. Python uses SQL commands to perform these operations on databases.

**Marks:** 4

**Difficulty:** medium

---

### S10

**Question:** How do you connect Python to a database like SQLite?

**Answer:** The sqlite3 library is built into Python. To connect: `import sqlite3; connection = sqlite3.connect("school.db")`. If the file does not exist, SQLite creates it automatically. Then create a cursor with `cursor = connection.cursor()`, run SQL commands with `cursor.execute(...)`, save changes with `connection.commit()`, and close with `connection.close()`.

**Marks:** 3

**Difficulty:** medium

---

## Long Questions (verbatim)

### L1

**Question:** Explain the concept of Graphical User Interface (GUI) and discuss its importance in application development.

**Answer_hint:**
Define GUI from the book: "A GUI, or Graphical User Interface, is a visual interface that allows users to interact with software using elements like buttons, menus, and forms." Discuss importance (verbatim from book): "GUIs are important because they make programs easier to understand and operate, especially for non-technical users. They improve usability by providing visual feedback and reducing the need to remember complex commands." Mention widespread use: "GUI applications are widely used in desktop software, web applications, and mobile apps." Contrast with command-line interfaces (from section 4.1 opener): "GUIs make applications more user-friendly and easier to use compared to command-line interfaces." Give examples: Windows / macOS Finder, mobile apps, web browsers.

**Marks:** 10

**Difficulty:** easy

**Expected_answer_length:** 300-400 words

---

### L2

**Question:** Describe Tkinter as Python's built-in GUI toolkit.

**Answer_hint:**
Define Tkinter verbatim: "Tkinter is Python's standard GUI toolkit that comes pre-installed with the language. It provides a set of classes and functions to create windows, buttons, labels, entry fields, and other widgets." Properties: "Tkinter is easy to learn, lightweight, and supports event-driven programming, where actions are triggered by user events. It is suitable for building small to medium-sized GUI applications quickly and efficiently." Walk through the book's Simple GUI Example code: import, window, title, geometry, on_click function, Label, Entry, Button with `command=on_click`, mainloop. Explain the 6 bullets: Tk() creates main window, Label displays text, Entry takes user input, Button performs action, command=on_click event handling, mainloop() runs the GUI.

**Marks:** 10

**Difficulty:** medium

**Expected_answer_length:** 350-450 words

---

### L3

**Question:** What are the key components and widgets in Tkinter?

**Answer_hint:**
Start with "Tkinter provides many components, called widgets, that help build interactive graphical applications." Then describe the 5 common widgets from the book:
- **Label:** displays text or messages on the screen
- **Button:** allows the user to perform an action when clicked
- **Entry:** text input (name or password)
- **Menu:** list of options at the top of the window
- **Listbox:** shows a list of items and allows selection
Also describe:
- **Window:** created with `tk.Tk()`, the main container
- **Frame:** container used to organize and group widgets inside a window; frames divide the window into smaller parts
Mention that these widgets allow users to enter data, choose options, or perform actions, and combining them creates a complete interface.

**Marks:** 10

**Difficulty:** medium

**Expected_answer_length:** 350-450 words

---

### L4

**Question:** What is layout management in Tkinter, and how are elements organized using pack(), grid(), and place()?

**Answer_hint:**
Define: "Layout management is used to arrange widgets inside a window in a proper way. It decides the position and size of each widget on the screen." Then cover all 3 methods verbatim:
- **pack()** places widgets in a simple vertical or horizontal order. Easy to use, works well for small applications. Example code: button.pack(pady=10).
- **grid()** arranges widgets in rows and columns like a table. Useful for forms and structured layouts. Example: button.grid(row=0, column=0). Mention `columnspan` to span columns.
- **place()** positions widgets at exact locations on the window (coordinates). More control but needs careful adjustment. Example: button.place(x=30, y=40).
Mention Figure 4.2 (three windows side-by-side). Close with the TIDBIT: "Proper layout management helps make applications look neat and work well on different screen sizes."

**Marks:** 10

**Difficulty:** medium

**Expected_answer_length:** 400-500 words

---

### L5

**Question:** How can you design clean and responsive user interfaces in Tkinter?

**Answer_hint:**
Direct verbatim from book's "Designing Clean and Responsive Interfaces" section:
- A clean interface has well-arranged widgets and enough space between them.
- Text and buttons should be clear and easy to read.
- Responsive interfaces adjust their layout when the window size changes.
- This helps the program work well on different screen sizes.
- Proper alignment improves the overall look of the application.
- Simple design makes the interface user-friendly.
Give concrete practices: use `padx` / `pady` for spacing, use grid() with `grid_columnconfigure(weight=1)` for responsive columns, choose consistent font sizes, align labels and entries using grid rows, keep window.geometry sensible.

**Marks:** 10

**Difficulty:** medium

**Expected_answer_length:** 300-400 words

---

### L6

**Question:** Explain the concept of event-driven programming in Tkinter.

**Answer_hint:**
Verbatim: "Event-driven programming is based on actions called events. The program remains idle until an event occurs. Common events include button clicks and key presses. Each event is linked to a specific function. The function runs only when the event happens. This approach saves system resources. It is widely used in graphical user interfaces." Explain the Tkinter mechanics: `tk.Button(..., command=check_login)` links the click event to a function; `window.mainloop()` runs the event loop (program waits for events). Walk through the sequence: user clicks → event enters mainloop queue → linked function runs → UI updates → loop repeats. Mention `bind()` for other events (BEYOND THE BOOK is OK to mention briefly).

**Marks:** 10

**Difficulty:** medium

**Expected_answer_length:** 350-450 words

---

### L7

**Question:** How do you handle user input and connect widgets to functions in Tkinter?

**Answer_hint:**
Verbatim from book: "User input is given through widgets like entry fields and buttons. Widgets are connected to functions in the program. When the widget is used, the connected function executes. This allows the program to process the input." Walk through the Login Form example from the book:
- Create Entry fields: `entry_user = tk.Entry(window)`, `entry_pass = tk.Entry(window, show="*")` (show="*" masks password).
- Connect the Button: `tk.Button(window, text="Login", command=check_login)` · `command=check_login` with NO parentheses links the click.
- The function reads input: `username = entry_user.get()`, `password = entry_pass.get()`.
- Validate and respond: `if username == "admin" and password == "1234": messagebox.showinfo("Success", "Login Successful!") else: messagebox.showerror("Error", "Invalid Username or Password")`.
Close with: `window.mainloop()` runs the event loop.

**Marks:** 10

**Difficulty:** hard

**Expected_answer_length:** 400-500 words

---

### L8

**Question:** Discuss the process of connecting Python to a database using SQLite or MySQL.

**Answer_hint:**
Verbatim intro: "Connecting Python to a database allows programs to work with stored data. A database connection is required before performing any data operation." Compare sqlite3 vs MySQL verbatim: "The sqlite3 library is built into Python and is used for small databases. It stores data in a single file on the system. MySQL is used for larger and more complex database systems. A connection is created by providing database details such as name and credentials." Walk through the book's full code example (sqlite3.connect → cursor → CREATE TABLE IF NOT EXISTS students → INSERT INTO students → commit() → SELECT * FROM students → fetchall() → for row in records: print(row) → close()). Close with the 5-bullet summary verbatim:
- Connect to Database: Establishes a connection to the school.db SQLite database.
- Create Cursor: Creates a cursor object to execute SQL commands.
- Execute Query: Executes a SQL query to fetch all records from the students table.
- Fetch and Display Data: Fetches all records and prints each row in the result.
- Close Connection: Closes the database connection after the operation.

**Marks:** 10

**Difficulty:** hard

**Expected_answer_length:** 400-500 words
