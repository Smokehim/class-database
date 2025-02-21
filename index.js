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
        res.status().json({error:"not connected to pot", error})
    }
    console.log(`Server is running on ports`)
})

app.get('/getstudent',(req, res)=>{
    const sql = `SELECT * FROM student`
    mysql.query(sql, (error, result)=>{
        if(error){
            res.status(500).json({error:"not able insert student", error})
        }
        console.log("here is your ", result)
        res.status(200).json({message:"here is your ", result} )
    })
})

app.get('/getstudent_ID', (req, res)=>{
    const {studentID} = req.body
    if(!studentID){
        res.status(404).json({error:"no use input found"})
    }
    const sql = 'SELECT * FROM student WHERE studentID=?'
    mysql.query(sql, [studentID], (error, result)=>{
        if(error){
            res.status(500).json({error:"not able to get use id",result})
        }
        console.log("here is you student infor", result)
        res.status(200).json({message: "here is you student infor", result})
    })
})

app.post('/poststudent', (req,res)=>{
    const {studentname, email, phonenumber, subjectID, classID } = req.body
    const sql =`INSERT INTO student(studentname, email, phonenumber, subjectID, classID) VALUES(?, ?, ?, ?, ?)`
    mysql.query(sql, [studentname, email, phonenumber, subjectID, classID], (error, result)=>{
        if(error){
            console.log("not able to insert student", error)
            res.status(500).json({error:"not able to insert student"})
        }
        console.log("here is your result", result)
        res.status(200).json({message:"here is your result", result})
    })
})
app.put('/updatestudent', (req, res) => {
    const { studentID, studentname, email, phonenumber } = req.body;

    if (!studentID) {
        return res.status(404).json({ error: "No user ID was provided" });
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
            return res.status(400).json({ message: "No student found with this ID was entered in rows" });
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
            res.status(500).json({error:"not able to get class", error})
        }
        res.status(200).json({message:"here are the result", result}) 
    })
})
app.get('/getclassID',(req,res)=>{
    const {classID} = req.body
    if(!classID){
        return res.status(404).json({error:" no use is insted"});
    }
    const sql = `SELECT * FROM class WHERE classID =?`
    mysql.query(sql,[classID], (error, result)=>{
        if(error){
            console.log("not able to get classid", error)
            res.status(500).json({error:"not able to get userid", error})
        }
        console.log("here are the result", result)
        res.status(200).json({message:"here are the result", result}) 
    })
})
app.post('/postclass', (req, res)=>{
    const {classname, teacherID, subjectID} = req.body
    const sql = `INSERT INTO class(classname, teacherID, subjectID) VALUES(?,?,?)`;
    mysql.query(sql, [classname, teacherID, subjectID], (error, result)=>{
        if(error){
           console.log("not able to insert class", error.message) 
           res.status(500).json({error:"not able to insert class", error})
        }
        console.log("here is your result", result)
        res.status(200).json({message:"here are the result", result}) 
    })
})
app.put('/updateclass', (req,res)=>{
    const {classname, subjectID, teacherID, classID} =req.body
    if(!classID){
        res.status(404).json({error: "not able to get classId"});
    }
    const sql = `UPDATE class SET
    classname = COALESCE(?, classname),
    subjectID = COALESCE(?, subjectID),
    teacherID = COALESCE(?, teacherID)
    WHERE ClassID = ?
    `
    mysql.query(sql, [classname, subjectID, teacherID, classID], (error, result)=>{
        if(error){
            comnsole.log("not able to update class", error)
            res.status(500).json({error: "not able to insert class due to sql error", error})
        }
        if(result.affectedRows == 0){
            res.status(400).json({error:"no affected rows "})
        }
        console.log("class updated", result)
        res.status(200).json({message: "class has been updated here is you result", result})
    })
})
app.delete('/deleteclass', (req,res)=>{
    const {classID} = req.body
    if(!classID){
        res.status(404).json({error: "not able to get classId"});
    }
    const sql = `DELETE FROM class WHERE classID = ?`
    mysql.query(sql, [classID], (error, result)=>{
        if(error){
            console.log("not able to delete class due to sql sentags or server error", error.message)
            res.status(500).json({error: "not able to delete class due to sql sentags or server error", error});
        }
        if(result.affectedRows == 0){
            res.status(400).json({error: "no rows where affected"})
        }
        console.log("here is you result", result)
        res.status(200).json({message: "here is your result", result})
    })
})
// teacher starts here
app.get('/getteacher', (req,res)=>{
    const sql = `SELECT * FROM teacher`
    mysql.query(sql, (error, result)=>{
        if(error){
            console.log("no able to get uses due to squl or server", error)
            res.status(500).json({error: "no able to get uses due to squl or server", error});
        }
        console.log("here is your result", result)
        res.status(200).json({message: "here is your result", result})
    })
})
app.get('/getteacherID', (req, res)=>{
    const {teacherID} = req.body
    if(!teacherID){
        res.status(404).json({error: "not able to get teacherID"});
    }
    const sql = `SELECT *  FROM teacher WHERE teacherID = ?`
    mysql.query(sql, [teacherID], (error, result)=>{
        if(error){
            console.log("not able to get teacherid due server error or sql", error.message)
            res.status(500).json({error: "not able to get teacherid due server error or sql", error});
        }
        console.log("here is your result", result)
        res.status(200).json({message: "here is your result", result})
    })

})
app.post('/postteacher', (req , res)=>{
    const {teachername, email, phonenumber} = req.body
    const sql = `INSERT INTO teacher(teachername, email, phonenumber) VALUES(?,?,?)`
    mysql.query(sql, [teachername, email, phonenumber], (error, result)=>{
        if(error){
            console.log("not able to insert teacherid due server error or sql", error.message)
            res.status(500).json({error: "not able to get teacherid due server error or sql", error});
        }
        if(result.affectedRows == 0){
            res.status(400).json({error: "no rows affected", error})
        }
        console.log("here is your result", result)
        res.status(200).json({message: "here is your result", result})
    })
})
app.put('/updateteacher', (req,res)=>{
    const {teachername, email, phonenumber, subjectID , studentID, teacherID } = req.body
    if(!teacherID){
        res.status(404).json({error: "not able to get teacherId"});
    }
    const sql =`UPDATE teacher SET
     teachername = COALESCE(?, teachername),
     email = COALESCE(?, email),
     phonenumber = COALESCE(?, phonenumber),
     subjectID = COALESCE(?, subjectID),
     studentID = COALESCE(? , subjectID)
     WHERE teacherID = ?`
    mysql.query(sql, [teachername, email, phonenumber, subjectID , studentID, teacherID], (error, result)=>{
        if(error){
            console.log("not able to update teacher due server error or sql", error.message)
            res.status(500).json({error: "not able to update teacherid due server error or sql", error});
        }
        if(result.affectedRows == 0){
            res.status(400).json({error: "no rows affected", error})
        }
        console.log("here is your result", result)
        res.status(200).json({message: "here is your result", result})
    })

})
app.delete('/deleteteacher', (req,res)=>{
    const {teacherID} = req.body
    if(!teacherID){
        res.status(404).json({error: "not able to get teacherId"});
    }
    const sql = `DELETE FROM teacher WHERE teacherID = ?`
    mysql.query(sql, [teacherID], (error, result)=>{
        if(error){
            console.log("not able to delete teacher due to sql sentags or server error", error.message)
            res.status(500).json({error: "not able to delete class due to sql sentags or server error", error});
        }
        if(result.affectedRows == 0){
            res.status(400).json({error: "no rows where affected"})
        }
        console.log("here is you result", result)
        res.status(200).json({message: "here is your result", result})
    })
})
//subject starts
app.get('/getsubject', (req,res)=>{
    const sql = `SELECT * FROM subject`
    mysql.query(sql, (error, result)=>{
        if(error){
            console.log("no able to get subject due to squl or server", error)
            res.status(500).json({error: "no able to get subject due to squl or server", error});
        }
        console.log("here is your result", result)
        res.status(200).json({message: "here is your result", result})
    })
})
app.get('/getsubjectID', (req, res)=>{
    const {teacherID} = req.body
    if(!classID){
        res.status(404).json({error: "not able to get subjectID"});
    }
    const sql = `SELECT *  FROM subject WHERE subjectID = ?`
    mysql.query(sql, [teacherID], (error, result)=>{
        if(error){
            console.log("not able to get subjectid due server error or sql", error.message)
            res.status(500).json({error: "not able to get subjectid due server error or sql", error});
        }
        console.log("here is your result", result)
        res.status(200).json({message: "here is your result", result})
    })

})
app.post('/postsubject', (req , res)=>{
    const {subjectname} = req.body
    const sql = `INSERT INTO subject(subjectname) VALUES(?)`
    mysql.query(sql, [subjectname], (error, result)=>{
        if(error){
            console.log("not able to insert subjectname due server error or sql", error.message)
            res.status(500).json({error: "not able to getsubjectname due server error or sql", error});
        }
        if(result.affectedRows == 0){
            res.status(400).json({error: "no rows affected", error})
        }
        console.log("here is your result", result)
        res.status(200).json({message: "here is your result", result})
    })
})
app.put('/updatesubject', (req,res)=>{
    const {subjectname, subjectID  } = req.body
    if(!subjectID){
        res.status(404).json({error: "not able to get teacherId"});
    }
    const sql =`UPDATE subject SET
     subjectname = COALESCE(?, subjectname)
     WHERE subjectID = ?`
    mysql.query(sql, [subjectname, subjectID], (error, result)=>{
        if(error){
            console.log("not able to update teacher due server error or sql", error.message)
            res.status(500).json({error: "not able to update teacherid due server error or sql", error});
        }
        if(result.affectedRows == 0){
            res.status(400).json({error: "no rows affected", error})
        }
        console.log("here is your result", result)
        res.status(200).json({message: "here is your result", result})
    })

})
app.delete('/deletesubject', (req,res)=>{
    const {subjectID} = req.body
    if(!subjectID){
        res.status(404).json({error: "not able to get subjectId"});
    }
    const sql = `DELETE FROM subject WHERE subjectID = ?`
    mysql.query(sql, [subjectID], (error, result)=>{
        if(error){
            console.log("not able to delete subject due to sql sentags or server error", error.message)
            res.status(500).json({error: "not able to delete subject due to sql sentags or server error", error});
        }
        if(result.affectedRows == 0){
            res.status(400).json({error: "no rows where affected"})
        }
        console.log("here is you result", result)
        res.status(200).json({message: "here is your result", result})
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