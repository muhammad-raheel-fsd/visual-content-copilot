---
book: Computer Science 12 (PECTAA)
book_slug: class-12-cs
class: 12
chapter: 4
chapter_title: "Development of Graphical User Interface (GUI)"
section: mixed-mcqs
count: 30
sampled_from:
  - t4.1a-mcqs.md
  - t4.1b-mcqs.md
  - t4.1c-mcqs.md
  - t4.1d-mcqs.md
  - t4.2a-mcqs.md
  - t4.2b-mcqs.md
  - t4.2c-mcqs.md
last_updated: 2026-10-02
---

# Chapter 4 · Mixed MCQ Bank (30 MCQs across all 7 sub-topics)

A quick 30-question revision set. 4-5 MCQs per sub-topic sampled from the per-topic MCQ files. Answer key at the bottom.

---

## 4.1a · Tkinter Introduction (4)

### 1
Tkinter is Python's:

- a) Database engine
- b) Standard GUI toolkit that comes pre-installed
- c) Web framework
- d) Testing library

**Correct:** b · **Source:** t4.1a Q (Tkinter definition)

### 2
In the Simple GUI Example, `Tk()` creates:

- a) A new file
- b) The main window
- c) A button
- d) A database connection

**Correct:** b · **Source:** t4.1a (5-bullet summary)

### 3
Which widget allows the user to perform an action when clicked?

- a) Label
- b) Entry
- c) Button
- d) Window

**Correct:** c · **Source:** t4.1a Q

### 4
`mainloop()` is used to:

- a) Create widgets
- b) Save data to disk
- c) Run the GUI event loop so the window stays open
- d) Close the application

**Correct:** c · **Source:** t4.1a (5-bullet summary)

---

## 4.1b · Widgets + Frames (4)

### 5
A Frame in Tkinter is:

- a) A kind of label
- b) A container used to organize and group widgets inside a GUI window
- c) An external library
- d) A kind of button

**Correct:** b · **Source:** t4.1b (verbatim definition from Summary)

### 6
In the Frames example, `top_frame.pack(fill="x")` makes the frame:

- a) Fill the window vertically
- b) Fill the window horizontally
- c) Centre itself
- d) Disappear

**Correct:** b · **Source:** t4.1b Q (pack fill)

### 7
Which Tkinter widget provides a list of options at the top of the window?

- a) Listbox
- b) Menu
- c) Entry
- d) Frame

**Correct:** b · **Source:** t4.1b (Common Widgets verbatim)

### 8
A Listbox is used to:

- a) Display a single line of text
- b) Show a list of items and allow selection
- c) Submit a form
- d) Render an image

**Correct:** b · **Source:** t4.1b (Common Widgets verbatim)

---

## 4.1c · Layout Management (4)

### 9
pack() in Tkinter places widgets in a:

- a) Random order
- b) Simple vertical or horizontal order
- c) Rows and columns like a table
- d) Pixel-exact position

**Correct:** b · **Source:** t4.1c Q

### 10
grid() is best suited for:

- a) Pop-up alerts
- b) Forms and structured layouts
- c) Full-screen graphics
- d) File dialogs

**Correct:** b · **Source:** t4.1c Q

### 11
place() positions widgets using:

- a) Rows and columns
- b) Alphabetical order
- c) Exact x,y pixel coordinates
- d) Random values

**Correct:** c · **Source:** t4.1c Q

### 12
`columnspan=2` in grid() makes a widget:

- a) Appear in 2 rows
- b) Stretch across 2 columns
- c) Shrink by 2 columns
- d) Be deleted

**Correct:** b · **Source:** t4.1c Q (book's grid example)

---

## 4.1d · Event Handling + Login Form (4)

### 13
An event in a GUI program is:

- a) A background download
- b) An action, such as clicking a button or typing text
- c) A compiler error
- d) A thread

**Correct:** b · **Source:** t4.1d Q

### 14
In Tkinter, a Button is connected to a Python function through:

- a) The configure method
- b) The `command=` parameter when creating the button
- c) The bind() method only
- d) An external config file

**Correct:** b · **Source:** t4.1d Q (login form)

### 15
In the book's login form, `entry_user.get()` is used to:

- a) Delete the entry field
- b) Read the text the user typed into the entry field
- c) Open a new window
- d) Save the user to a database

**Correct:** b · **Source:** t4.1d Q

### 16
What does `tk.Entry(window, show="*")` do?

- a) Hides the entry
- b) Masks each typed character with `*` so the password is hidden on screen
- c) Prints `*` to the terminal
- d) Deletes the entry

**Correct:** b · **Source:** t4.1d Q

---

## 4.2a · Database Concepts + SQL Structure (5)

### 17
An entity in a database is:

- a) A SQL command
- b) A real-world object, person, place, event, or concept about which data is stored
- c) A file format
- d) A network protocol

**Correct:** b · **Source:** t4.2a Q (verbatim)

### 18
An attribute is:

- a) A piece of hardware
- b) A property or characteristic of an entity
- c) The database file name
- d) A SQL error

**Correct:** b · **Source:** t4.2a Q (verbatim)

### 19
A Primary Key is:

- a) The first column of any table
- b) A unique identifier for each record in a table
- c) A password for the database
- d) The main table

**Correct:** b · **Source:** t4.2a Q (verbatim)

### 20
A Foreign Key is:

- a) A password of another user
- b) A field that links one table to another by referring to the primary key of another table
- c) A table in another language
- d) A SQL error

**Correct:** b · **Source:** t4.2a Q (verbatim)

### 21
SQL stands for:

- a) Simple Query Language
- b) Secure Query Language
- c) Structured Query Language
- d) Standard Query Language

**Correct:** c · **Source:** t4.2a Q (verbatim)

---

## 4.2b · Connecting Python to a Database (5)

### 22
Which Python library is built in and used for small databases?

- a) MySQL
- b) PostgreSQL
- c) sqlite3
- d) MongoDB

**Correct:** c · **Source:** t4.2b Q

### 23
`sqlite3.connect("school.db")` behaves how when the file does not exist?

- a) Raises an error and stops
- b) Prints a warning but does nothing
- c) Creates the file automatically
- d) Opens an Excel sheet

**Correct:** c · **Source:** t4.2b Q (book comment)

### 24
A cursor in sqlite3 is:

- a) A GUI widget
- b) An object used to execute SQL queries
- c) A SQL error
- d) The mouse pointer

**Correct:** b · **Source:** t4.2b Q (book comment)

### 25
`cursor.fetchall()` returns:

- a) A single string
- b) A list of rows (records)
- c) The connection object
- d) Nothing

**Correct:** b · **Source:** t4.2b Q

### 26
Why do we call `connection.close()` at the end?

- a) To delete the database
- b) To close the database connection after the operation and release resources
- c) To erase memory
- d) To restart Python

**Correct:** b · **Source:** t4.2b Q (verbatim)

---

## 4.2c · CRUD Operations (4)

### 27
CRUD stands for:

- a) Create, Rename, Update, Delete
- b) Create, Read, Update, Delete
- c) Copy, Read, Update, Delete
- d) Create, Read, Upload, Download

**Correct:** b · **Source:** t4.2c Q (verbatim)

### 28
Which SQL command corresponds to the Create operation?

- a) SELECT
- b) UPDATE
- c) INSERT
- d) DELETE

**Correct:** c · **Source:** t4.2c Q (Table 4.1)

### 29
`UPDATE students SET Age = 21 WHERE ID = 1;` does what?

- a) Deletes the student with ID 1
- b) Adds a new student with Age 21
- c) Modifies the student with ID 1 to have Age 21
- d) Prints Age 21

**Correct:** c · **Source:** t4.2c Q (Table 4.1)

### 30
If you forget `commit()` after a DELETE, what happens?

- a) The program crashes
- b) The deletion will not be permanent
- c) The entire database is wiped
- d) A warning email is sent

**Correct:** b · **Source:** t4.2c Q (3-bullet summary verbatim)

---

## Answer Key (quick)

1. b · 2. b · 3. c · 4. c · 5. b · 6. b · 7. b · 8. b · 9. b · 10. b
11. c · 12. b · 13. b · 14. b · 15. b · 16. b · 17. b · 18. b · 19. b · 20. b
21. c · 22. c · 23. c · 24. b · 25. b · 26. b · 27. b · 28. c · 29. c · 30. b
