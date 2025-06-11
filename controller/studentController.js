import Student from "../models/student.js";

export function getStudents(req, res){

	Student.find().then
		((students) => {
			res.json(students);
		})
		.catch(() => {
			res.json({
				message: "Failed to fetch students",
			});
		});
}

export function createStudent (req, res){
	console.log(req.body);

	const student = new Student({
		name: req.body.name,
		age: req.body.age,
		email: req.body.email,
	});

	student.save()
		.then(() => {
			res.json({
				message: "Student saved successfully",
			});
		})
		.catch(() => {
			console.log("Failed to save student");
		});
}