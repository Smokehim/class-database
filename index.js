import express from 'express'
import mysql2 from 'mysql2'
const app = express()
const mysql = mysql2.createConnection({
    host:"localhost",
    user: "root",
    password:"",
    database: "campus"
})
app.use(express.json())
app.use(express.urlencoded({extends:true}))
const PORT = 7000;
mysql.connect(()=>console.log("database"))
app.listen(PORT, (result, error) =>{ 
    if(error){
        console.log("not connected to pot", error)
    }
    console.log(`Server is running on ports`)
})

app.get('/getstudent',(req, res)=>{
    const sql = `SELECT * FROM student`
    mysql.query(sql, (error, result)=>{
        if(error){
            console.log("not able insert student", error)
        }
        console.log("here is your ", result )
    })
})

app.get('/getstudent_ID', (req, res)=>{
    const {studentID} = req.body
    const sql = 'SELECT * FROM student WHERE studentID=?'
    mysql.query(sql, [studentID], (error, result)=>{
        if(error){
            console.log("not able to get use id",error.message)
        }
        console.log("here is you student infor", result)
    })
})

app.post('/poststudent', (req,res)=>{
    const {studentname, email, phonenumber, subjectID, classID } = req.body
    const sql =`INSERT INTO student(studentname, email, phonenumber, subjectID, classID) VALUES(?, ?, ?, ?, ?)`
    mysql.query(sql, [studentname, email, phonenumber, subjectID, classID], (error, result)=>{
        if(error){
            console.log("not able to insert student", error.message)
        }
        console.log("here is your result", result)
    })
})
app.put('/updatestudent', (req, res) => {
    const { studentID, studentname, email, phonenumber } = req.body;

    if (!studentID) {
        return res.status(400).json({ error: "No user ID was provided" });
    }

    const sql = `
        UPDATE student SET 
        studentname = COALESCE(?, studentname),
        email = COALESCE(?, email),
        phonenumber = COALESCE(?, phonenumber)
        WHERE studentID = ?
    `;

    mysql.query(sql, [studentname, email, phonenumber, studentID], (error, result) => {
        if (error) {
            console.error("Database error:", error.message);
            return res.status(500).json({ error: "Student not able to update in databases" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No student found with this ID was entered in rows" });
        }

        return res.status(200).json({ message: "Student updated successfully", result });
    });
});
app.delete('/deletestudent', (req, res) => {
    const [studentID] = req.body
    if(!studentID){
        res.status(500).json({error:"no student is entered"})
    }
    const sql = `DELETE FROM student WHERE studentID = ?`
    mysql.query(sql, [studentID], (error,result)=>{
        if(error){
            return res.status(404).json({error: "not able to delete user", error})
        }
        if(result.affectedRows == 0){
           return res.status(404).json({error: "no use deletd in rows"});
        }
        return res.status(200).json({message: "here is you user", result});
    })
    
});
// students ends
app.get('/getclass',(req,res)=>{
    const sql = `SELECT * FROM class`
    mysql.query(sql, (error, result)=>{
        if(error){
            console.log("not able to get user", error)
        }
        console.log("here are the result", result) 
    })
})
app.get('/getclass_ID',(req,res)=>{
    const classid = req.query.classID
    const sql = `SELECT * FROM class WHERE classID =?`
    mysql.query(sql,[classid], (error, result)=>{
        if(error){
            console.log("not able to get user", error)
        }
        console.log("here are the result", result)
    })
})
app.post('/insertClass', (req, res)=>{
    const {classname, teacherID, subjectID} = req.body
    const sql = `INSERT INTO class(classname, teacherID, subjectID) VALUES(?,?,?)`;
    mysql.query(sql, [classname, teacherID, subjectID], (error, result)=>{
        if(error){
           console.log(error.message) 
        }
        console.log("here is your result", result)
    })
})
app.put('/updateclass', (req,res)=>{
    const {classname, subjectID, teacherID, classID} =req.body
    const sql = `UPDATE SET
    classname = COALESCE(?, classname),
    subjectID = COALESCE(?, subjectID),
    teacherID = COALESCE(?, teacherID)
    WHERE ClassID = ?
    `
    mysql.query(sql, [classname, subjectID, teacherID, classID], (error, result)=>{
        if(error){
            comnsole.log("not able to update class")
        }
        console.log("class updated", result)
    })
})



mysql.connect(()=>{
    const Class = `CREATE TABLE IF NOT EXISTS teacher ( teacherID INT AUTO_INCREMENT PRIMARY KEY,
  teachername VARCHAR(255),
  email VARCHAR(255), 
  phonenumber VARCHAR(255),
  subjectID INT,
  studentID INT
  )`
    mysql.query(Class, (error, result)=>{
        if(error) return console.log("not able to create", error.message)
            console.log("teacher created", result)
    })
})
mysql.connect(()=>{
    const Teacher = `CREATE TABLE IF NOT EXISTS class (
  classID INT AUTO_INCREMENT PRIMARY KEY,
  classname VARCHAR(255),
  teacherID INT,
  subjectID INT
)`
    mysql.query(Teacher, (error, result)=>{
        if(error) return console.log("not able to create", error.message)
            console.log("class created", result)
    })
})
mysql.connect(()=>{
    const Subject = `CREATE TABLE IF NOT EXISTS subject (
  subjectID INT AUTO_INCREMENT PRIMARY KEY,
  subjectname VARCHAR(255)
)`
    mysql.query(Subject, (error, result)=>{
        if(error) return console.log("not able to create", error.message)
            console.log("subject created", result)
    })
})

mysql.connect(()=>{
    const  Student= `CREATE TABLE IF NOT EXISTS student (
  studentID INT AUTO_INCREMENT PRIMARY KEY,
  studentname VARCHAR(255),
  email VARCHAR(255), 
  phonenumber VARCHAR(255),
  subjectID INT, classID INT
)`
    mysql.query(Student, (error, result)=>{
        if(error) return console.log("not able to create", error.message)
            console.log("student created", result)
    })
})
mysql.connect(()=>{
    const sql = `ALTER TABLE class ADD FOREIGN KEY(teacherID) REFERENCES teacher(teacherID),
     ADD FOREIGN KEY(subjectID) REFERENCES subject(subjectID) `
     mysql.query(sql, (error, result)=>{
        if(error){
            console.log("not able to make a foreign key", error.message)
        }
        console.log("here is you result", result)
     })
})
mysql.connect(()=>{
    const sql = `ALTER TABLE teacher ADD FOREIGN KEY(subjectID) REFERENCES subject(subjectID),
     ADD FOREIGN KEY(studentID) REFERENCES student(studentID) `
     mysql.query(sql, (error, result)=>{
        if(error){
            console.log("not able to make a foreign key", error.message)
        }
        console.log("here is you result", result)
     })
})
mysql.connect(()=>{
    const sql = `ALTER TABLE student ADD FOREIGN KEY(classID) REFERENCES class(classID),
     ADD FOREIGN KEY(subjectID) REFERENCES subject(subjectID) `
     mysql.query(sql, (error, result)=>{
        if(error){
            console.log("not able to make a foreign key", error.message)
        }
        console.log("here is you result", result)
     })
})