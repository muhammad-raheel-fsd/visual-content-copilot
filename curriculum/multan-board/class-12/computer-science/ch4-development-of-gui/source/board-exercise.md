---
book: Computer Science 12 (PECTAA)
book_slug: class-12-cs
class: 12
chapter: 4
chapter_title: "Development of Graphical User Interface (GUI)"
section: board-exercise
book_pages: "58-59"
last_updated: 2026-10-02
status: parsed_verbatim
source_pdf: curriculum/books/class-12-cs.pdf
---

# Chapter 4 EXERCISE (verbatim from book, pages 58-59)

## Multiple Choice Questions (10 MCQs)

1. The main purpose of a GUI in Python programming is to:
   (a) Create a user-friendly interface for interacting with software
   (b) Manage files in Python
   (c) Handle network operations
   (d) Store and retrieve data from databases

2. Python's built-in GUI toolkit is:
   (a) wxPython
   (b) Tkinter
   (c) PyQt
   (d) Kivy

3. The Tkinter widget used to display text is:
   (a) Button
   (b) Label
   (c) Entry
   (d) Listbox

4. The pack() method in Tkinter is used to:
   (a) Align widgets vertically or horizontally
   (b) Organize widgets in rows and columns
   (c) Set widget sizes manually
   (d) Create pop-up windows

5. The methods used to organize widgets in Tkinter include:
   (a) grid()
   (b) pack()
   (c) place()
   (d) All of the above

6. Event-driven programming in Tkinter means:
   (a) Writing code that runs without user input
   (b) Writing code that responds to user actions such as clicks or key presses
   (c) Writing code to manage database queries
   (d) Writing code to handle network requests

7. The Tkinter widget used to get user input is:
   (a) Label
   (b) Button
   (c) Entry
   (d) Listbox

8. The Tkinter layout manager that allows precise positioning of widgets using coordinates is:
   (a) pack()
   (b) grid()
   (c) place()
   (d) align()

9. The Tkinter option that connects a button click to a function is:
   (a) bind()
   (b) configure()
   (c) command= (no parentheses)
   (d) execute()

10. CRUD operations in databases stand for:
    (a) Create, Read, Update, Delete
    (b) Create, Run, Upload, Delete
    (c) Copy, Retrieve, Upload, Download
    (d) Create, Remove, Update, Manage

## Short Questions (10)

1. What is a GUI and why is it important in application development?
2. What is Tkinter and why is it Python's built-in GUI toolkit?
3. How do you create a window and add frames in Tkinter?
4. Name two common widgets used in Tkinter.
5. What is the purpose of layout management in Tkinter?
6. How does the pack() method organize elements in Tkinter?
7. What is event-driven programming and how is it used in Tkinter?
8. How do you handle user input in Tkinter?
9. What is the CRUD operation in database management?
10. How do you connect Python to a database like SQLite?

## Long Questions (8)

1. Explain the concept of Graphical User Interface (GUI) and discuss its importance in application development.
2. Describe Tkinter as Python's built-in GUI toolkit.
3. What are the key components and widgets in Tkinter?
4. What is layout management in Tkinter, and how are elements organized using pack(), grid(), and place()?
5. How can you design clean and responsive user interfaces in Tkinter?
6. Explain the concept of event-driven programming in Tkinter.
7. How do you handle user input and connect widgets to functions in Tkinter?
8. Discuss the process of connecting Python to a database using SQLite or MySQL.

## Answer Key (MCQs, verbatim)

1. A
2. B
3. B
4. A
5. D
6. B
7. C
8. C
9. C
10. A

## Curveballs to watch (teacher notes)

- **MCQ 9:** The correct option is literally spelled `command= (no parentheses)`. Students who parse it as "command=" without reading the parenthetical note may mis-attribute to `bind()` or `execute()`. Flag this subtlety when revising.
- **MCQ 5:** The answer is "All of the above", not just pack() or grid(). Students who memorise only pack() + grid() miss place().
- **MCQ 4 vs 8:** pack() is "align vertically or horizontally" (4A), place() is "precise positioning using coordinates" (8C). Easy to confuse.
